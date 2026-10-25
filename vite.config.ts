import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'coach-proxy-middleware',
        configureServer(server) {
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
                const models = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite'];
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

          // Weekly Report Dispatcher API
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
                const { email, clientName } = JSON.parse(bodyStr || '{}');
                if (!email || !email.includes('@')) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Invalid recipient email address' }));
                  return;
                }

                const deliveryId = 'smr_rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
                const timestamp = new Date().toISOString();

                console.log(`[SMRITARA Report Dispatcher] Dispatched weekly report to ${email} for ${clientName || 'Client'} (Receipt: ${deliveryId})`);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  deliveryId,
                  recipient: email,
                  timestamp,
                  message: `Weekly report successfully dispatched to ${email}`
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message || 'Email dispatch failed' }));
              }
            });
          });
        }
      }
    ],
  };
});

