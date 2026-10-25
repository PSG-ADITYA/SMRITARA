import type { UserProfile, DailyLog, Habit } from '../types';
import type { PracticeSession } from './sessionProgressEngine';

export interface WeeklyReportMetrics {
  weekLabel: string;
  startDate: string;
  endDate: string;
  clientName: string;
  clientEmail: string;
  generatedAt: string;
  totalPracticeMinutes: number;
  totalSessions: number;
  sessionsByType: Record<string, number>;
  averageSleep: number;
  targetSleep: number;
  sleepDelta: number;
  averageScreenTime: number;
  targetScreenTime: number;
  averageDisciplineScore: number;
  currentStreak: number;
  habitsTrackedCount: number;
  habitCompletionRate: number;
  executiveSummary: string;
  actionItems: string[];
}

export interface WeeklyProgressReport {
  id: string;
  weekNumber: number;
  year: number;
  metrics: WeeklyReportMetrics;
  markdownContent: string;
  htmlContent: string;
  generatedAt: string;
  recipientEmail: string;
  deliveryStatus: 'pending' | 'sent' | 'local_archive';
  deliveryReceiptId?: string;
}

export interface ReportHistoryItem {
  id: string;
  weekLabel: string;
  recipientEmail: string;
  sentAt: string;
  averageScore: number;
  totalMinutes: number;
  deliveryStatus: 'sent' | 'local_archive';
}

/**
 * Gathers records over the past 7 days and synthesizes an executive client progress report
 */
export function generateWeeklyReport(
  user: UserProfile,
  dailyLogs: DailyLog[],
  practiceSessions: PracticeSession[],
  habits: Habit[]
): WeeklyProgressReport {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const startStr = sevenDaysAgo.toISOString().split('T')[0];
  const endStr = now.toISOString().split('T')[0];

  const formatDateLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const weekLabel = `${formatDateLabel(sevenDaysAgo)} – ${formatDateLabel(now)}`;

  // Filter logs for the 7-day period (or use available logs if just starting)
  const recentLogs = dailyLogs.filter(l => l.date >= startStr && l.date <= endStr);
  const effectiveLogs = recentLogs.length > 0 ? recentLogs : dailyLogs.slice(0, 7);

  // Filter practice sessions for the 7-day period
  const recentSessions = practiceSessions.filter(s => {
    const sDate = s.completedAt.split('T')[0];
    return sDate >= startStr && sDate <= endStr;
  });
  const effectiveSessions = recentSessions.length > 0 ? recentSessions : practiceSessions;

  // 1. Practice metrics
  const totalPracticeSeconds = effectiveSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalPracticeMinutes = Math.round(totalPracticeSeconds / 60);
  const totalSessions = effectiveSessions.length;

  const sessionsByType: Record<string, number> = {
    memory: 0,
    meditation: 0,
    chanting: 0,
    focus: 0,
    discipline: 0
  };

  effectiveSessions.forEach(s => {
    const type = s.activityType || 'discipline';
    sessionsByType[type] = (sessionsByType[type] || 0) + 1;
  });

  // 2. Sleep & Screen Time metrics
  const daysWithSleep = effectiveLogs.filter(l => l.sleepHours > 0);
  const avgSleep = daysWithSleep.length > 0
    ? parseFloat((daysWithSleep.reduce((acc, l) => acc + l.sleepHours, 0) / daysWithSleep.length).toFixed(1))
    : (user.targetSleep || 7.5);

  const targetSleep = user.targetSleep || 8.0;
  const sleepDelta = parseFloat((avgSleep - targetSleep).toFixed(1));

  const daysWithScreen = effectiveLogs.filter(l => l.screenTimeHours !== undefined);
  const avgScreenTime = daysWithScreen.length > 0
    ? parseFloat((daysWithScreen.reduce((acc, l) => acc + l.screenTimeHours, 0) / daysWithScreen.length).toFixed(1))
    : (user.targetScreenTime || 3.5);

  const targetScreen = user.targetScreenTime || 4.0;

  // 3. Discipline score average
  const avgDiscipline = effectiveLogs.length > 0
    ? Math.round(effectiveLogs.reduce((acc, l) => acc + (l.disciplineScore || 0), 0) / effectiveLogs.length)
    : (user.disciplineScore || 0);

  // 4. Habit adherence rate
  let habitChecksCount = 0;
  let totalPossibleHabits = 0;
  const goodHabits = habits.filter(h => h.type === 'good');

  if (effectiveLogs.length > 0 && goodHabits.length > 0) {
    totalPossibleHabits = effectiveLogs.length * goodHabits.length;
    effectiveLogs.forEach(l => {
      habitChecksCount += (l.completedHabitIds || []).filter(id => goodHabits.some(h => h.id === id)).length;
    });
  }

  const habitCompletionRate = totalPossibleHabits > 0
    ? Math.round((habitChecksCount / totalPossibleHabits) * 100)
    : (user.currentStreak > 0 ? 80 : 0);

  // 5. Synthesis: AI Coach Executive Assessment
  const clientName = user.username || 'Practitioner';
  const clientEmail = user.email || 'client@smritara.app';

  let executiveSummary = '';
  if (totalSessions === 0 && effectiveLogs.length === 0) {
    executiveSummary = `Welcome ${clientName}. This report marks the opening baseline of your SMRITARA cognitive discipline journey. As you complete daily sleep check-ins, focus blocks, and classical recitations, your weekly executive report will track precise circadian rhythms, memory retention curves, and discipline scores.`;
  } else if (avgDiscipline >= 80) {
    executiveSummary = `Exceptional discipline performance this week, ${clientName}. With an average discipline rating of ${avgDiscipline}/100 and ${totalPracticeMinutes} minutes of deliberate practice, your cognitive stamina and rhythm stability are operating in an optimal state.`;
  } else if (avgDiscipline >= 60) {
    executiveSummary = `Steady and resilient progress this week, ${clientName}. You completed ${totalSessions} sessions across ${totalPracticeMinutes} minutes. Aligning your actual sleep (${avgSleep}h vs ${targetSleep}h goal) will unlock higher midday focus and clearer memory recall next week.`;
  } else {
    executiveSummary = `Foundation week for ${clientName}. You logged ${totalSessions} practice drills. Prioritize your evening wind-down to close the sleep gap and protect your deep work blocks. Consistent micro-habits compound rapidly into effortless discipline.`;
  }

  // 3 Targeted Action Items
  const actionItems: string[] = [];
  if (sleepDelta < -0.5) {
    actionItems.push(`Circadian Alignment: Aim to close the ${Math.abs(sleepDelta)}h deficit by advancing bedtime wind-down by 35 minutes.`);
  } else {
    actionItems.push(`Circadian Consistency: Sleep duration averaged ${avgSleep}h (target: ${targetSleep}h). Maintain morning sunlight within 30 minutes of waking.`);
  }

  if (sessionsByType.focus < 2) {
    actionItems.push(`Deep Work Sprints: Schedule at least three 25-minute uninterrupted focus intervals before midday.`);
  } else {
    actionItems.push(`Focus Momentum: Strong focus output with ${sessionsByType.focus} blocks logged. Continue batching high-cognitive tasks.`);
  }

  if (sessionsByType.memory === 0 && sessionsByType.chanting === 0) {
    actionItems.push(`Cognitive Gym: Engage in at least 2 classical recitation or memory recall drills to strengthen auditory working memory.`);
  } else {
    actionItems.push(`Cognitive Acuity: Good balance across memory and classical recitation drills. Consider stepping up to 7-minute recitations.`);
  }

  const metrics: WeeklyReportMetrics = {
    weekLabel,
    startDate: startStr,
    endDate: endStr,
    clientName,
    clientEmail,
    generatedAt: now.toISOString(),
    totalPracticeMinutes,
    totalSessions,
    sessionsByType,
    averageSleep: avgSleep,
    targetSleep,
    sleepDelta,
    averageScreenTime: avgScreenTime,
    targetScreenTime: targetScreen,
    averageDisciplineScore: avgDiscipline,
    currentStreak: user.currentStreak || 0,
    habitsTrackedCount: habits.length,
    habitCompletionRate,
    executiveSummary,
    actionItems
  };

  // Build Markdown
  const markdownContent = `# SMRITARA Weekly Client Executive Report
**Client:** ${clientName} (${clientEmail})  
**Period:** ${weekLabel}  
**Discipline Score:** ${avgDiscipline}/100 | **Current Streak:** ${user.currentStreak || 0} Days  

---

### 1. Executive Performance Summary
${executiveSummary}

---

### 2. Core Weekly Metrics
| Metric | Recorded Value | Target / Goal | Status |
| :--- | :--- | :--- | :--- |
| **Total Practice Time** | ${totalPracticeMinutes} minutes | 60+ min/week | ${totalPracticeMinutes >= 60 ? '✅ Target Met' : '🟡 In Progress'} |
| **Total Sessions** | ${totalSessions} sessions | 5+ sessions | ${totalSessions >= 5 ? '✅ Strong' : '🟡 Developing'} |
| **Average Nightly Sleep** | ${avgSleep} hours | ${targetSleep} hours | ${avgSleep >= targetSleep - 0.5 ? '✅ Aligned' : '⚠️ ' + Math.abs(sleepDelta) + 'h Under Target'} |
| **Non-Work Screen Time** | ${avgScreenTime} hours | < ${targetScreen} hours | ${avgScreenTime <= targetScreen ? '✅ Controlled' : '⚠️ Above Limit'} |
| **Average Discipline Score** | ${avgDiscipline} / 100 | 75+ | ${avgDiscipline >= 75 ? '🌟 Tier 1 Elite' : avgDiscipline >= 50 ? '🌱 Tier 2 Steady' : '⚠️ Building Rhythm'} |
| **Habit Adherence Rate** | ${habitCompletionRate}% | 75%+ | ${habitCompletionRate >= 75 ? '✅ Consistent' : '🟡 Recalibrating'} |

---

### 3. Activity Breakdown
- **Cognitive Memory Gym:** ${sessionsByType.memory || 0} drills
- **Mindfulness & Respiration:** ${sessionsByType.meditation || 0} sessions
- **Classical Recitation (SmritiVeda):** ${sessionsByType.chanting || 0} recitations
- **Focused Work Sprints:** ${sessionsByType.focus || 0} blocks
- **Daily Check-Ins & Sleep Calibrations:** ${sessionsByType.discipline || 0} records

---

### 4. AI Coach Directives for Next Week
${actionItems.map((item, idx) => `${idx + 1}. **${item.split(':')[0]}:** ${item.split(':')[1] || item}`).join('\n')}

---
*Report generated automatically by SMRITARA Cognitive Wellness Engine on ${now.toLocaleDateString()}.*
`;

  // Build Responsive HTML Email with elegant inline styling
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SMRITARA Weekly Executive Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FBF9F4; color: #1F2937; margin: 0; padding: 30px 15px; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D6; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden;">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #1A3C34 0%, #285443 100%); padding: 32px 28px; color: #FFFFFF;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #E5C378;">SMRITARA COGNITIVE REPORT</span>
        <span style="font-size: 12px; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 20px;">${weekLabel}</span>
      </div>
      <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 800; color: #FFFFFF;">Weekly Executive Progress Summary</h1>
      <p style="margin: 0; font-size: 14px; color: #C5D8CF;">Prepared exclusively for <strong>${clientName}</strong> (${clientEmail})</p>
    </div>

    <!-- Main Score Highlight Grid -->
    <div style="padding: 24px 28px; background: #F8F5EE; border-bottom: 1px solid #E6E1D6;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 33%; text-align: center; padding: 12px; border-right: 1px solid #E6E1D6;">
            <div style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700;">Discipline Score</div>
            <div style="font-size: 28px; font-weight: 800; color: #1A3C34; margin: 4px 0;">${avgDiscipline}<span style="font-size: 14px; color: #6B7280;">/100</span></div>
            <div style="font-size: 11px; color: #047857; font-weight: 600;">7-Day Rolling Avg</div>
          </td>
          <td style="width: 33%; text-align: center; padding: 12px; border-right: 1px solid #E6E1D6;">
            <div style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700;">Nightly Sleep</div>
            <div style="font-size: 28px; font-weight: 800; color: #1E3A8A; margin: 4px 0;">${avgSleep}<span style="font-size: 14px; color: #6B7280;">h</span></div>
            <div style="font-size: 11px; color: ${sleepDelta >= 0 ? '#047857' : '#B45309'}; font-weight: 600;">Goal: ${targetSleep}h (${sleepDelta >= 0 ? '+' : ''}${sleepDelta}h)</div>
          </td>
          <td style="width: 33%; text-align: center; padding: 12px;">
            <div style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700;">Practice Time</div>
            <div style="font-size: 28px; font-weight: 800; color: #8A5A1E; margin: 4px 0;">${totalPracticeMinutes}<span style="font-size: 14px; color: #6B7280;">m</span></div>
            <div style="font-size: 11px; color: #047857; font-weight: 600;">${totalSessions} Total Sessions</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Executive Reflection -->
    <div style="padding: 24px 28px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #1A3C34; margin: 0 0 10px 0;">AI Life Coach Assessment</h2>
      <div style="background: #F4F8F6; border-left: 4px solid #285443; padding: 14px 18px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #2D3748;">
        ${executiveSummary}
      </div>

      <!-- Metrics Table -->
      <h2 style="font-size: 16px; font-weight: 700; color: #1A3C34; margin: 24px 0 12px 0;">Key Weekly Metrics</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background: #F8F5EE; text-align: left; border-bottom: 2px solid #E6E1D6;">
          <th style="padding: 10px 12px; color: #4B5563;">Metric</th>
          <th style="padding: 10px 12px; color: #4B5563;">Actual</th>
          <th style="padding: 10px 12px; color: #4B5563;">Goal</th>
          <th style="padding: 10px 12px; color: #4B5563;">Status</th>
        </tr>
        <tr style="border-bottom: 1px solid #F0ECE1;">
          <td style="padding: 10px 12px; font-weight: 600;">Average Sleep Duration</td>
          <td style="padding: 10px 12px;">${avgSleep} hrs</td>
          <td style="padding: 10px 12px;">${targetSleep} hrs</td>
          <td style="padding: 10px 12px; color: ${sleepDelta >= -0.5 ? '#047857' : '#B45309'}; font-weight: 600;">
            ${sleepDelta >= 0 ? 'Optimal' : Math.abs(sleepDelta) + 'h under target'}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F0ECE1;">
          <td style="padding: 10px 12px; font-weight: 600;">Non-Work Screen Time</td>
          <td style="padding: 10px 12px;">${avgScreenTime} hrs</td>
          <td style="padding: 10px 12px;">&lt; ${targetScreen} hrs</td>
          <td style="padding: 10px 12px; color: ${avgScreenTime <= targetScreen ? '#047857' : '#B45309'}; font-weight: 600;">
            ${avgScreenTime <= targetScreen ? 'Within Limit' : 'Above Target'}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F0ECE1;">
          <td style="padding: 10px 12px; font-weight: 600;">Discipline Streak</td>
          <td style="padding: 10px 12px;">${user.currentStreak || 0} days</td>
          <td style="padding: 10px 12px;">Daily</td>
          <td style="padding: 10px 12px; color: #047857; font-weight: 600;">Active Rhythm</td>
        </tr>
        <tr style="border-bottom: 1px solid #F0ECE1;">
          <td style="padding: 10px 12px; font-weight: 600;">Habit Adherence Rate</td>
          <td style="padding: 10px 12px;">${habitCompletionRate}%</td>
          <td style="padding: 10px 12px;">75%+</td>
          <td style="padding: 10px 12px; color: ${habitCompletionRate >= 75 ? '#047857' : '#B45309'}; font-weight: 600;">
            ${habitCompletionRate >= 75 ? 'Consistent' : 'Building'}
          </td>
        </tr>
      </table>

      <!-- Next Week Directives -->
      <h2 style="font-size: 16px; font-weight: 700; color: #1A3C34; margin: 24px 0 12px 0;">3 Calibrated Action Items for Next Week</h2>
      <div style="background: #FFFFFF; border: 1px solid #E6E1D6; border-radius: 8px; padding: 8px 16px;">
        ${actionItems.map((item, idx) => `
          <div style="padding: 10px 0; border-bottom: ${idx < actionItems.length - 1 ? '1px solid #F0ECE1' : 'none'}; font-size: 13px; line-height: 1.5;">
            <strong style="color: #1A3C34;">Step ${idx + 1}:</strong> ${item}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8F5EE; padding: 20px 28px; text-align: center; border-top: 1px solid #E6E1D6; font-size: 12px; color: #6B7280;">
      <p style="margin: 0 0 6px 0;"><strong>SMRITARA</strong> • Grounded Classical Wisdom & Cognitive Rhythm</p>
      <p style="margin: 0;">This email was sent to ${clientEmail} based on your weekly progress subscription.</p>
    </div>

  </div>
</body>
</html>
  `.trim();

  const reportId = `smr_rpt_${Date.now()}`;
  const weekNumber = getWeekNumber(now);

  return {
    id: reportId,
    weekNumber,
    year: now.getFullYear(),
    metrics,
    markdownContent,
    htmlContent,
    generatedAt: now.toISOString(),
    recipientEmail: clientEmail,
    deliveryStatus: 'pending'
  };
}

/**
 * Dispatches the weekly report to the client email via the server API with local fallback
 */
export async function sendWeeklyReportEmail(
  report: WeeklyProgressReport,
  overrideEmail?: string
): Promise<{ success: boolean; message: string; receiptId?: string; smtpConfigured?: boolean }> {
  const recipient = (overrideEmail || report.recipientEmail).trim().toLowerCase();
  
  if (!recipient || !recipient.includes('@')) {
    return { success: false, message: 'Please provide a valid client email address.' };
  }

  try {
    const res = await fetch('/api/send-report-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: recipient,
        clientName: report.metrics.clientName,
        subject: `SMRITARA Weekly Progress Report — ${report.metrics.weekLabel}`,
        report: {
          id: report.id,
          weekLabel: report.metrics.weekLabel,
          averageScore: report.metrics.averageDisciplineScore,
          averageSleep: report.metrics.averageSleep,
          totalMinutes: report.metrics.totalPracticeMinutes,
          summary: report.metrics.executiveSummary
        },
        markdown: report.markdownContent,
        html: report.htmlContent
      })
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok && data.success) {
      const receiptId = data.deliveryId || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      // Archive into local history
      archiveDispatchedReport({
        id: report.id,
        weekLabel: report.metrics.weekLabel,
        recipientEmail: recipient,
        sentAt: new Date().toISOString(),
        averageScore: report.metrics.averageDisciplineScore,
        totalMinutes: report.metrics.totalPracticeMinutes,
        deliveryStatus: 'sent'
      });

      return {
        success: true,
        receiptId,
        message: data.message || `Weekly report successfully emailed to ${recipient}`
      };
    } else {
      return {
        success: false,
        smtpConfigured: data.smtpConfigured ?? false,
        receiptId: '',
        message: data.message || data.error || 'SMTP delivery failed. Click 1-Click Gmail Send to dispatch immediately from your email client.'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      smtpConfigured: false,
      receiptId: '',
      message: err.message || 'Network error communicating with report email server. You can dispatch directly via 1-Click Gmail.'
    };
  }
}

/**
 * Direct 1-Click Gmail dispatch URL generator
 * Opens mail.google.com in browser with pre-filled recipient, subject, and markdown report content.
 */
export function getGmailComposeUrl(recipientEmail: string, report: WeeklyProgressReport): string {
  const subject = `SMRITARA Weekly Progress Report — ${report.metrics.weekLabel}`;
  const body = report.markdownContent;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Standard mailto: URI fallback for native email clients (Apple Mail, Thunderbird, Outlook)
 */
export function getMailtoUrl(recipientEmail: string, report: WeeklyProgressReport): string {
  const subject = `SMRITARA Weekly Progress Report — ${report.metrics.weekLabel}`;
  const body = report.markdownContent.length > 1800 
    ? report.markdownContent.substring(0, 1800) + '\n\n...[Full report available in SMRITARA platform]'
    : report.markdownContent;
  return `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Downloads the report as a file (.md or .html)
 */
export function downloadReportFile(report: WeeklyProgressReport, format: 'md' | 'html'): void {
  const content = format === 'md' ? report.markdownContent : report.htmlContent;
  const mime = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/html;charset=utf-8';
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SMRITARA_Weekly_Report_${report.metrics.startDate}_to_${report.metrics.endDate}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Helper to get week number
 */
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Persists sent report metadata to localStorage
 */
export function archiveDispatchedReport(item: ReportHistoryItem): void {
  try {
    const raw = localStorage.getItem('smritara_report_history');
    const history: ReportHistoryItem[] = raw ? JSON.parse(raw) : [];
    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 20);
    localStorage.setItem('smritara_report_history', JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to archive report history:', err);
  }
}

/**
 * Retrieves past dispatched reports
 */
export function getReportHistory(): ReportHistoryItem[] {
  try {
    const raw = localStorage.getItem('smritara_report_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
