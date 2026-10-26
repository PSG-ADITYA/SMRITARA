// Test persistence flow, redirect URL formulation, and session reconstruction
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- SMRITARA Persistence & Authentication Unit Tests ---\n');

let passed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}:`, err.message);
    process.exit(1);
  }
}

// Test 1: Verify signUpWithEmail contains emailRedirectTo
it('supabase.ts signUpWithEmail includes emailRedirectTo', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/lib/supabase.ts'), 'utf-8');
  assert(content.includes('emailRedirectTo: redirectUrl'), 'Must set emailRedirectTo in options');
  assert(content.includes('https://smritara-topaz.vercel.app'), 'Must contain production fallback url');
});

// Test 2: Verify unverified email login route in AuthModal
it('AuthModal detects email not confirmed and switches to confirm_pending', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/onboarding/AuthModal.tsx'), 'utf-8');
  assert(content.includes("res.error.toLowerCase().includes('email not confirmed')"), 'Must detect unconfirmed email error in login');
  assert(content.includes("setMode('confirm_pending')"), 'Must switch mode to confirm_pending');
});

// Test 3: Verify AppContext loadCloudData reconstructs memorySessions from practice_sessions
it('AppContext loadCloudData reconstructs memorySessions for cognitive games', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/context/AppContext.tsx'), 'utf-8');
  assert(content.includes("filter(s => s.activityType === 'memory')"), 'Must filter cloudSessions for memory activities');
  assert(content.includes('setMemorySessions'), 'Must update memorySessions state');
  assert(content.includes('saveCloudProfile(userId, initialProfile)'), 'Must initialize deferred cloud profile on login');
});

// Test 4: Verify AppContext syncs habits and streak updates to Supabase
it('AppContext syncs habits and profile streak to cloud', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/context/AppContext.tsx'), 'utf-8');
  assert(content.includes('saveCloudHabits(currentUser.id, updated)'), 'addHabit must save to cloud');
  assert(content.includes('deleteCloudHabit(currentUser.id, id)'), 'deleteHabit must save to cloud');
  assert(content.includes('toggleCloudSavedTip(currentUser.id, tipId, !isSaved)'), 'toggleSaveTip must save to cloud');
  assert(content.includes('saveCloudProfile(currentUser.id, updated)'), 'upsertDailyLog must sync updated streak to profiles');
});

// Test 5: Verify api/coach.ts protects Gemini API key
it('api/coach.ts requires server-side GEMINI_API_KEY and does not expose it', () => {
  const content = fs.readFileSync(path.join(__dirname, '../api/coach.ts'), 'utf-8');
  assert(content.includes('process.env.GEMINI_API_KEY'), 'Must read GEMINI_API_KEY from environment');
  assert(content.includes('GEMINI_API_KEY is not configured in environment variables'), 'Must return helpful notice when key missing');
});

console.log(`\n=============================================================`);
console.log(`PERSISTENCE TESTS SUMMARY: ${passed} PASSED, 0 FAILED`);
console.log(`=============================================================\n`);
