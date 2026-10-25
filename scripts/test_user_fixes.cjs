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

console.log('\n--- 2. Verification of Beginner Account Starting at 0 Practice Points ---');
const appContextCode = fs.readFileSync(path.join(__dirname, '../src/context/AppContext.tsx'), 'utf-8');
assert(appContextCode.includes('clearInMemoryUserData();'), 'clearInMemoryUserData helper called on account registration');
assert(appContextCode.includes("localStorage.setItem(prefix + 'practiceSessions', '[]');"), 'practiceSessions storage initialized to empty array on registration');
assert(appContextCode.includes('setPracticeSessions([]);'), 'practiceSessions state explicitly reset to empty array for beginner account');
assert(!appContextCode.includes('if (practiceSessions.length > 0 || dailyLogs.length > 0) {\n          migrateLocalDataToCloud'), 'Guest practice sessions are NOT migrated into newly registered beginner account');
assert(appContextCode.includes('disciplineScore: 0') && appContextCode.includes('currentStreak: 0'), 'Beginner account starts with disciplineScore 0 and currentStreak 0');

console.log('\n--- 3. Verification of AI Life Coach Chat History Persistence & Reset ---');
assert(appContextCode.includes('export const createDefaultWelcomeMessage'), 'createDefaultWelcomeMessage helper exported');
assert(appContextCode.includes("localStorage.setItem(getPrefix() + 'chatMessages'"), 'sendMessageToCoach synchronously persists chat messages to localStorage');
assert(appContextCode.includes("createDefaultWelcomeMessage(acctName)"), 'loadUserDataFromStorage falls back to welcome greeting if chat is empty');
assert(appContextCode.includes("localStorage.setItem(getPrefix() + 'chatMessages', JSON.stringify([welcome]))"), 'clearCoachChat synchronously persists reset welcome message');

const coachViewCode = fs.readFileSync(path.join(__dirname, '../src/components/aicoach/AICoachView.tsx'), 'utf-8');
assert(coachViewCode.includes('handleClearHistory'), 'AICoachView implements handleClearHistory with confirmation dialog');
assert(coachViewCode.includes('Clear History'), 'AICoachView contains explicit Clear History button');

console.log('\n--- 4. Verification of Real Email Sending (Gmail 1-Click + Nodemailer SMTP) ---');
const reportEnginePath = path.join(__dirname, '../src/engine/weeklyReportEngine.ts');
assert(fs.existsSync(reportEnginePath), 'weeklyReportEngine.ts exists');
const reportEngineCode = fs.readFileSync(reportEnginePath, 'utf-8');
assert(reportEngineCode.includes('export function getGmailComposeUrl'), 'getGmailComposeUrl is exported for 1-click Gmail sending');
assert(reportEngineCode.includes('mail.google.com/mail/?view=cm'), 'getGmailComposeUrl targets Gmail compose endpoint');
assert(reportEngineCode.includes('export function getMailtoUrl'), 'getMailtoUrl is exported for native mail clients');
assert(reportEngineCode.includes('export async function sendWeeklyReportEmail'), 'sendWeeklyReportEmail is exported');

const viteConfigCode = fs.readFileSync(path.join(__dirname, '../vite.config.ts'), 'utf-8');
assert(viteConfigCode.includes("import nodemailer from 'nodemailer';"), 'vite.config.ts imports nodemailer');
assert(viteConfigCode.includes('transporter.sendMail'), 'vite.config.ts delivers email via nodemailer transporter');
assert(viteConfigCode.includes('/api/config/smtp'), 'vite.config.ts exposes /api/config/smtp endpoint');

const progressViewCode = fs.readFileSync(path.join(__dirname, '../src/components/progress/ProgressView.tsx'), 'utf-8');
assert(progressViewCode.includes('Open in Gmail (1-Click)'), 'ProgressView includes 1-Click Gmail direct dispatch button');
assert(progressViewCode.includes('Send via SMTP Server'), 'ProgressView includes Send via SMTP server button');
assert(progressViewCode.includes('isSmtpModalOpen') && progressViewCode.includes('Automated SMTP Email Setup'), 'ProgressView includes SMTP setup modal');
assert(progressViewCode.includes('getGmailComposeUrl'), 'ProgressView integrates getGmailComposeUrl');

console.log('\n--- 5. Verification of Daily Check-In & Sleep Data Input ---');
const modalCode = fs.readFileSync(path.join(__dirname, '../src/components/discipline/DailyLogModal.tsx'), 'utf-8');
assert(modalCode.includes('sleepPresets = [5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 10.0]'), 'DailyLogModal includes quick duration preset chips');
assert(modalCode.includes('type="number"') && modalCode.includes('value={sleepHours}'), 'DailyLogModal includes direct numeric input for sleep');
assert(!modalCode.includes("color: '#fff'"), 'Date picker does not use invisible white-on-light color style');
assert(modalCode.includes('completedHabitIds: selectedHabitIds'), 'DailyLogModal passes selected habit IDs to upsertDailyLog');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
