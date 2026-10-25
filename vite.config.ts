import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'smritara-backend-middleware',
        configureServer(server) {
          // 1. AI Coach Proxy API
          server.middlewares.use('/api/coach', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ available: false, error: 'GEMINI_API_KEY not configured on server' }));
              return;
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const { contents, generationConfig } = JSON.parse(bodyStr || '{}');
                
                // Models to try in order of speed and availability
                const models = ['gemini-2.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-2.5-flash'];
                let lastError: string | null = null;
                let responseData: any = null;
                let responseStatus = 500;

                for (const model of models) {
                  try {
                    const geminiRes = await fetch(
                      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents, generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 1000 } })
                      }
                    );

                    const data = (await geminiRes.json()) as any;
                    if (geminiRes.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                      responseData = data;
                      responseStatus = geminiRes.status;
                      break;
                    } else if (data?.error) {
                      lastError = data.error.message || `Model ${model} returned error`;
                    }
                  } catch (e: any) {
                    lastError = e.message;
                  }
                }

                if (responseData) {
                  const replyText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  res.statusCode = responseStatus;
                  res.setHeader('Content-Type', 'application/json');
                  // Provide both formats for maximum frontend compatibility
                  res.end(JSON.stringify({
                    reply: replyText,
                    candidates: responseData.candidates,
                    usageMetadata: responseData.usageMetadata
                  }));
                } else {
                  res.statusCode = 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    error: lastError || 'AI service unavailable',
                    available: false
                  }));
                }
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Internal coach proxy error', available: false }));
              }
            });
          });

          // 2. Weekly Report Dispatcher API (Genuine SMTP with Nodemailer + Direct Gmail Fallback)
          server.middlewares.use('/api/send-report-email', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const { email, clientName, subject, html, markdown } = JSON.parse(bodyStr || '{}');
                if (!email || !email.includes('@')) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Invalid recipient email address' }));
                  return;
                }

                const smtpUser = process.env.SMTP_USER || env.SMTP_USER || process.env.GMAIL_USER || env.GMAIL_USER;
                const smtpPass = process.env.SMTP_PASS || env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || env.GMAIL_APP_PASSWORD;
                const smtpHost = process.env.SMTP_HOST || env.SMTP_HOST || 'smtp.gmail.com';
                const smtpPort = process.env.SMTP_PORT || env.SMTP_PORT || '465';

                // If SMTP credentials are configured, execute genuine delivery
                if (smtpUser && smtpPass) {
                  try {
                    const isGmail = !smtpHost || smtpHost.includes('gmail.com');
                    const transporter = nodemailer.createTransport(
                      isGmail
                        ? {
                            service: 'gmail',
                            auth: { user: smtpUser, pass: smtpPass }
                          }
                        : {
                            host: smtpHost,
                            port: Number(smtpPort) || 465,
                            secure: Number(smtpPort) === 465,
                            auth: { user: smtpUser, pass: smtpPass }
                          }
                    );

                    const mailOptions = {
                      from: `"SMRITARA Cognitive Wellness" <${smtpUser}>`,
                      to: email,
                      subject: subject || 'SMRITARA Weekly Progress Report',
                      text: markdown || 'Your weekly cognitive report is attached.',
                      html: html || undefined
                    };

                    const info = await transporter.sendMail(mailOptions);
                    console.log(`[SMRITARA SMTP] Successfully delivered report to ${email} (MessageId: ${info.messageId})`);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                      success: true,
                      sentVia: 'smtp',
                      deliveryId: info.messageId,
                      recipient: email,
                      message: `Weekly report successfully delivered to ${email} via SMTP!`
                    }));
                    return;
                  } catch (smtpErr: any) {
                    console.error('[SMRITARA SMTP Error]', smtpErr.message);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                      success: false,
                      smtpConfigured: true,
                      error: `SMTP authentication or delivery failed: ${smtpErr.message}. Use 1-Click Gmail Send instead.`
                    }));
                    return;
                  }
                }

                // If SMTP is not yet configured, be completely honest and offer 1-Click Gmail
                console.log(`[SMRITARA Report Notice] SMTP not configured. Recipient: ${email} (${clientName || 'Client'}). Direct 1-Click Gmail available.`);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  smtpConfigured: false,
                  directGmailAvailable: true,
                  message: 'SMTP credentials (Gmail App Password) are not configured. Click "Open in Gmail (1-Click)" to dispatch directly from your Gmail inbox, or configure SMTP credentials below.'
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message || 'Email dispatch failed' }));
              }
            });
          });

          // 3. SMTP Configuration & Test API
          server.middlewares.use('/api/config/smtp', async (req, res) => {
            if (req.method === 'GET') {
              const smtpUser = process.env.SMTP_USER || env.SMTP_USER || process.env.GMAIL_USER || env.GMAIL_USER;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                configured: !!(smtpUser && (process.env.SMTP_PASS || env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || env.GMAIL_APP_PASSWORD)),
                user: smtpUser || ''
              }));
              return;
            }

            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  const { user, pass, host, port } = JSON.parse(bodyStr || '{}');
                  if (!user || !pass) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: 'Email and App Password are required' }));
                    return;
                  }

                  const isGmail = !host || host.includes('gmail.com');
                  const testTransporter = nodemailer.createTransport(
                    isGmail
                      ? { service: 'gmail', auth: { user, pass } }
                      : {
                          host: host || 'smtp.gmail.com',
                          port: Number(port) || 465,
                          secure: Number(port) === 465,
                          auth: { user, pass }
                        }
                  );

                  // Verify credentials
                  await testTransporter.verify();

                  // If verified, write to .env file
                  const envPath = path.resolve(process.cwd(), '.env');
                  let currentEnv = '';
                  if (fs.existsSync(envPath)) {
                    currentEnv = fs.readFileSync(envPath, 'utf8');
                  }

                  const lines = currentEnv.split('\n').filter(l => 
                    !l.startsWith('SMTP_USER=') && 
                    !l.startsWith('SMTP_PASS=') && 
                    !l.startsWith('SMTP_HOST=') && 
                    !l.startsWith('SMTP_PORT=') &&
                    !l.startsWith('GMAIL_USER=') &&
                    !l.startsWith('GMAIL_APP_PASSWORD=')
                  );

                  lines.push(`SMTP_USER=${user}`);
                  lines.push(`SMTP_PASS=${pass}`);
                  if (host) lines.push(`SMTP_HOST=${host}`);
                  if (port) lines.push(`SMTP_PORT=${port}`);

                  fs.writeFileSync(envPath, lines.join('\n').trim() + '\n', 'utf8');

                  // Update active process.env
                  process.env.SMTP_USER = user;
                  process.env.SMTP_PASS = pass;
                  if (host) process.env.SMTP_HOST = host;
                  if (port) process.env.SMTP_PORT = String(port);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: 'SMTP credentials verified and saved to .env!' }));
                } catch (verifyErr: any) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: `Verification failed: ${verifyErr.message}` }));
                }
              });
              return;
            }

            res.statusCode = 405;
            res.end('Method Not Allowed');
          });
        }
      }
    ],
  };
});

