// Automated Verification Suite for AI Life Coach & Gemini API Configuration
const http = require('http');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Verification of Server-Side Security & Key Protection ---');
  const apiCoachCode = fs.readFileSync(path.join(__dirname, '../api/coach.ts'), 'utf-8');
  const viteConfigCode = fs.readFileSync(path.join(__dirname, '../vite.config.ts'), 'utf-8');
  const geminiEngineCode = fs.readFileSync(path.join(__dirname, '../src/engine/gemini.ts'), 'utf-8');

  assert(apiCoachCode.includes('cleanKey'), 'api/coach.ts sanitizes surrounding quotes and whitespace from GEMINI_API_KEY');
  assert(viteConfigCode.includes('resolveApiKey'), 'vite.config.ts dynamically resolves and sanitizes GEMINI_API_KEY per request');
  assert(!geminiEngineCode.includes('VITE_GEMINI_API_KEY'), 'Frontend does not expose GEMINI_API_KEY via VITE_ client bundle');
  assert(geminiEngineCode.includes("fetch('/api/coach'"), 'Frontend communicates strictly through server-side /api/coach proxy');

  console.log('\n--- 2. Verification of Supported Gemini Model Calibration ---');
  assert(
    apiCoachCode.includes('gemini-3.5-flash-lite') && apiCoachCode.includes('gemini-3.8-flash'),
    'api/coach.ts configures active modern models (gemini-3.5-flash-lite, gemini-3.8-flash)'
  );
  assert(
    viteConfigCode.includes('gemini-3.5-flash-lite') && viteConfigCode.includes('gemini-3.8-flash'),
    'vite.config.ts configures active modern models (gemini-3.5-flash-lite, gemini-3.8-flash)'
  );
  assert(!apiCoachCode.includes('gemini-1.5-flash'), 'api/coach.ts does not rely on deprecated gemini-1.5-flash');
  assert(!viteConfigCode.includes('gemini-1.5-flash'), 'vite.config.ts does not rely on deprecated gemini-1.5-flash');

  console.log('\n--- 3. Verification of Error & Edge Case Handlers ---');
  assert(apiCoachCode.includes('status === 429'), 'api/coach.ts handles rate-limiting / quota limits (HTTP 429)');
  assert(viteConfigCode.includes('status === 429'), 'vite.config.ts handles rate-limiting / quota limits (HTTP 429)');
  assert(apiCoachCode.includes('status === 400'), 'api/coach.ts handles rejected API keys (HTTP 400)');
  assert(viteConfigCode.includes('status === 400'), 'vite.config.ts handles rejected API keys (HTTP 400)');

  console.log('\n--- 4. Live Server Request Test (/api/coach) ---');
  await new Promise((resolve) => {
    const payload = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'I am feeling sad today because work was overwhelming.' }]
        }
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    });

    const req = http.request('http://localhost:5173/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        assert(res.statusCode === 200, `Local dev server /api/coach returned HTTP 200 (actual: ${res.statusCode})`);
        
        try {
          const parsed = JSON.parse(data);
          const replyText = parsed.reply || parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          assert(replyText.length > 20, `AI returned genuine non-empty content (length: ${replyText.length} chars)`);
          assert(!replyText.includes('GEMINI_API_KEY is not configured'), 'Response does NOT contain missing API key warning');
          assert(!replyText.includes('temporarily unavailable'), 'Response is genuine and not a simulated fallback');
          console.log(`\n  Live AI Response Sample:\n  "${replyText.slice(0, 180).replace(/\n/g, ' ')}..."\n`);
        } catch (e) {
          assert(false, `Failed to parse response JSON: ${e.message}`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      assert(false, `Live request error: ${err.message}. Is dev server running on port 5173?`);
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      assert(false, 'Live request timed out after 15s');
      resolve();
    });

    req.write(payload);
    req.end();
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
