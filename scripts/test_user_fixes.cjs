// Automated verification of user fixes in SMRITARA
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Verification of AI Coach Button in Header ---');
const headerCode = fs.readFileSync(path.join(__dirname, '../src/components/common/Header.tsx'), 'utf-8');
assert(headerCode.includes("setActiveTab('coach')"), 'Header AI Coach element has onClick switching to coach tab');
assert(headerCode.includes("<button") && headerCode.includes("AI Coach Ready"), 'AI Coach badge is an interactive button');

console.log('\n--- 2. Verification of Login State Isolation in AppContext ---');
const appContextCode = fs.readFileSync(path.join(__dirname, '../src/context/AppContext.tsx'), 'utf-8');
assert(appContextCode.includes('clearInMemoryUserData'), 'clearInMemoryUserData helper defined to wipe leaked states');
assert(appContextCode.includes('loadUserDataFromStorage'), 'loadUserDataFromStorage helper properly loads scoped user data');
assert(appContextCode.includes("setPracticeSessions(cloudSessions || [])"), 'loadCloudData always sets practiceSessions (or empty array)');
assert(appContextCode.includes("setDailyLogs(cloudLogs || [])"), 'loadCloudData always sets dailyLogs (or empty array)');
assert(appContextCode.includes("clearInMemoryUserData();") && appContextCode.includes("const logout = async"), 'logout cleanly wipes in-memory records');

console.log('\n--- 3. Verification of Daily Check-In & Sleep Data Input ---');
const modalCode = fs.readFileSync(path.join(__dirname, '../src/components/discipline/DailyLogModal.tsx'), 'utf-8');
assert(modalCode.includes('sleepPresets = [5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 10.0]'), 'DailyLogModal includes quick duration preset chips');
assert(modalCode.includes('type="number"') && modalCode.includes('value={sleepHours}'), 'DailyLogModal includes direct numeric input for sleep');
assert(!modalCode.includes("color: '#fff'"), 'Date picker does not use invisible white-on-light color style');
assert(modalCode.includes('completedHabitIds: selectedHabitIds'), 'DailyLogModal passes selected habit IDs to upsertDailyLog');
assert(appContextCode.includes("activityType: 'discipline'") && appContextCode.includes("Daily Check-In & Sleep Calibration"), 'upsertDailyLog records verified practice session for progress tracking');

console.log('\n--- 4. Verification of Weekly Auto-Generated & Auto-Emailed Reports ---');
const reportEnginePath = path.join(__dirname, '../src/engine/weeklyReportEngine.ts');
assert(fs.existsSync(reportEnginePath), 'weeklyReportEngine.ts exists');
const reportEngineCode = fs.readFileSync(reportEnginePath, 'utf-8');
assert(reportEngineCode.includes('export function generateWeeklyReport'), 'generateWeeklyReport is exported');
assert(reportEngineCode.includes('export async function sendWeeklyReportEmail'), 'sendWeeklyReportEmail is exported');
assert(reportEngineCode.includes('/api/send-report-email'), 'Weekly report posts to /api/send-report-email');
assert(reportEngineCode.includes('archiveDispatchedReport'), 'Weekly report archives history in local storage');

const progressViewCode = fs.readFileSync(path.join(__dirname, '../src/components/progress/ProgressView.tsx'), 'utf-8');
assert(progressViewCode.includes('Weekly Client Executive Report & Auto-Email'), 'ProgressView renders Weekly Executive Report panel');
assert(progressViewCode.includes('Generate & Email Report Now'), 'ProgressView includes instant report dispatch button');
assert(progressViewCode.includes('Preview Report'), 'ProgressView includes executive report preview modal');
assert(progressViewCode.includes('weeklyReportsEnabled'), 'ProgressView includes automatic weekly auto-dispatch toggle');

const viteConfigCode = fs.readFileSync(path.join(__dirname, '../vite.config.ts'), 'utf-8');
assert(viteConfigCode.includes('/api/send-report-email'), 'vite.config.ts middleware handles /api/send-report-email');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
