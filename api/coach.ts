// Vercel Serverless Function: /api/coach
// Securely proxies Gemini AI Life Coach requests without exposing GEMINI_API_KEY to browser bundles.

export const config = {
  runtime: 'edge', // Edge runtime for ultra-low latency
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        available: false,
        error: 'GEMINI_API_KEY is not configured in environment variables.',
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

    const models = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite'];
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
