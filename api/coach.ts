// Vercel Serverless Function: /api/coach
// Securely proxies Gemini AI Life Coach requests without exposing GEMINI_API_KEY to browser bundles.

export const config = {
  runtime: 'edge', // Edge runtime for ultra-low latency
};

function cleanKey(val?: string | null): string {
  if (!val) return '';
  let k = val.trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim();
  }
  return k;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let apiKey = cleanKey(process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY);

  // In local node execution, attempt reading .env if process.env wasn't pre-populated
  if (!apiKey && typeof process !== 'undefined' && process.cwd) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eq = trimmed.indexOf('=');
          if (eq !== -1) {
            const k = trimmed.slice(0, eq).trim();
            const v = trimmed.slice(eq + 1).trim();
            if (k === 'GEMINI_API_KEY' || k === 'GEMINI_KEY' || k === 'GOOGLE_API_KEY') {
              apiKey = cleanKey(v);
              if (apiKey) break;
            }
          }
        }
      }
    } catch {
      // Edge runtime doesn't have fs module, which is expected
    }
  }

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        available: false,
        error: 'GEMINI_API_KEY is not configured in environment variables. Please ensure GEMINI_API_KEY is set in your server environment.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await req.json();
    const { contents, generationConfig } = body || {};

    const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-lite-latest'];
    let responseData: any = null;
    let responseStatus = 500;
    let lastError: string | null = null;

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 1000 },
            }),
          }
        );

        const data = await geminiRes.json();
        if (geminiRes.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseData = data;
          responseStatus = geminiRes.status;
          break;
        } else if (geminiRes.status === 400 && data.error?.message?.toLowerCase().includes('key')) {
          return new Response(
            JSON.stringify({
              available: false,
              error: 'The configured GEMINI_API_KEY was rejected by Google AI. Please verify the key in Google AI Studio.',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } else if (geminiRes.status === 429) {
          return new Response(
            JSON.stringify({
              available: false,
              error: 'Gemini AI rate limit or quota exceeded. Please wait a moment before sending your next reflection.',
            }),
            {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } else if (data.error) {
          lastError = data.error.message || `Model ${model} error`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (responseData) {
      const replyText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return new Response(
        JSON.stringify({
          reply: replyText,
          candidates: responseData.candidates,
          usageMetadata: responseData.usageMetadata,
        }),
        {
          status: responseStatus,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        available: false,
        error: lastError || 'All Gemini models unavailable',
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        available: false,
        error: err.message || 'Internal proxy error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
