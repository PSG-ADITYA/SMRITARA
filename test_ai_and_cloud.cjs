const http = require('http');

async function askCoach(question) {
  const payload = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: `You are SMRITARA's AI Life Coach. Answer concisely: ${question}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300
    }
  });

  const t0 = Date.now();
  const res = await fetch('http://localhost:5173/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  const elapsed = Date.now() - t0;
  const status = res.status;
  const data = await res.json();
  const reply = data.reply || data.candidates?.[0]?.content?.parts?.[0]?.text;

  return { status, elapsed, reply, data };
}

async function runLiveVerification() {
  console.log('🤖 Starting SMRITARA 3.1 Live AI Coach & Cloud Backend Verification...\n');

  const questions = [
    'What are the core practice pillars in SMRITARA and how do they balance daily growth?',
    'Can you recommend a 5-minute morning mindful breathing procedure for focus?',
    'How does cultural literature like Sanskrit shlokas and Telugu verses improve memory recall in SMRITARA?'
  ];

  let passed = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`[Question ${i + 1}]: "${q}"`);
    try {
      const result = await askCoach(q);
      console.log(`  -> HTTP Status: ${result.status} (${result.elapsed}ms)`);
      if (result.status === 200 && result.reply && !result.reply.includes('temporarily unavailable')) {
        console.log(`  -> ✅ LIVE AI RESPONSE RECEIVED:`);
        console.log(`     "${result.reply.substring(0, 160).replace(/\n/g, ' ')}..."\n`);
        passed++;
      } else {
        console.error(`  -> ❌ FAILED: Unexpected response or unavailable message. Data:`, result.data);
      }
    } catch (err) {
      console.error(`  -> ❌ Network/Execution Error:`, err.message);
    }
  }

  console.log(`\n============================================================`);
  console.log(`🎯 AI COACH LIVE VERIFICATION RESULT: ${passed}/${questions.length} LIVE GEMINI RESPONSES VERIFIED`);
  console.log(`============================================================\n`);

  if (passed !== questions.length) {
    process.exit(1);
  }
}

runLiveVerification();
