import React, { useState } from 'react';
import { 
  BarChart3, 
  Award, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Brain, 
  Wind, 
  Flame, 
  Target,
  Sparkles,
  Info,
  Filter,
  Mail,
  Send,
  FileText,
  Download,
  Eye,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { compareWithPreviousSession, type PracticeSession } from '../../engine/sessionProgressEngine';
import { generateWeeklyReport, downloadReportFile, type WeeklyProgressReport } from '../../engine/weeklyReportEngine';

export const ProgressView: React.FC = () => {
  const { 
    user,
    dailyLogs,
    habits,
    practiceSessions, 
    milestones, 
    practicePoints, 
    memorySessions,
    mindfulnessSessions,
    chantingSessions,
    focusSessions,
    setActiveTab,
    weeklyReportsEnabled,
    setWeeklyReportsEnabled,
    reportHistory,
    generateAndEmailReport
  } = useApp();

  const [recipientEmail, setRecipientEmail] = useState<string>(user.email || '');
  const [isSendingReport, setIsSendingReport] = useState<boolean>(false);
  const [sendFeedback, setSendFeedback] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const [previewReport, setPreviewReport] = useState<WeeklyProgressReport | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('all');

  // Compute total practice time across all verified sessions
  const totalSeconds = practiceSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // Filtered session list
  const filteredSessions = practiceSessions.filter(s => {
    if (categoryFilter === 'all') return true;
    return s.activityType === categoryFilter;
  });

  // Latest session for comparison
  const latestSession = practiceSessions.length > 0 ? practiceSessions[0] : null;

  // Comparison against previous session
  const latestComparison = latestSession 
    ? compareWithPreviousSession(latestSession, practiceSessions)
    : null;

  // Find previous sessions by type for targeted comparisons
  const latestMemory = practiceSessions.find(s => s.activityType === 'memory');
  const memoryComparison = latestMemory ? compareWithPreviousSession(latestMemory, practiceSessions) : null;

  const latestMeditation = practiceSessions.find(s => s.activityType === 'meditation');
  const meditationComparison = latestMeditation ? compareWithPreviousSession(latestMeditation, practiceSessions) : null;

  const latestChanting = practiceSessions.find(s => s.activityType === 'chanting');
  const chantingComparison = latestChanting ? compareWithPreviousSession(latestChanting, practiceSessions) : null;

  const latestFocus = practiceSessions.find(s => s.activityType === 'focus');
  const focusComparison = latestFocus ? compareWithPreviousSession(latestFocus, practiceSessions) : null;

  const unlockedCount = milestones.filter(m => m.unlocked).length;

  const handleSendReport = async () => {
    const target = recipientEmail.trim() || user.email;
    if (!target || !target.includes('@')) {
      setSendFeedback({ status: 'error', message: 'Please enter a valid client email address.' });
      return;
    }
    setIsSendingReport(true);
    setSendFeedback(null);
    try {
      const res = await generateAndEmailReport(target);
      setSendFeedback({ status: res.success ? 'success' : 'error', message: res.message });
    } catch (err: any) {
      setSendFeedback({ status: 'error', message: err.message || 'Failed to dispatch report.' });
    } finally {
      setIsSendingReport(false);
    }
  };

  const handlePreviewReport = () => {
    const rpt = generateWeeklyReport(user, dailyLogs, practiceSessions, habits);
    setPreviewReport(rpt);
    setIsPreviewOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* 1. Overview Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRACTICE POINTS</span>
            <Sparkles size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {practicePoints}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Earned from verified sessions
          </div>
        </div>

        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED SESSIONS</span>
            <CheckCircle2 size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {practiceSessions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across all activity types
          </div>
        </div>

        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL TIME</span>
            <Clock size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {totalMinutes} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>min</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Mindful, deliberate practice
          </div>
        </div>

        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MILESTONES UNLOCKED</span>
            <Award size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {unlockedCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {milestones.length}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Restrained consistency markers
          </div>
        </div>
      </div>

      {/* 2. Core Feature: Factual Comparison With Previous Session */}
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <span>Factual Comparison with Previous Session</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Direct, honest comparisons between identical activity categories without pseudo-metrics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'Latest' },
              { id: 'memory', label: 'Memory' },
              { id: 'meditation', label: 'Meditation' },
              { id: 'chanting', label: 'Chanting' },
              { id: 'focus', label: 'Focus' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedActivityType(tab.id)}
                className={`btn btn-sm ${selectedActivityType === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.76rem', padding: '4px 10px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected comparison box */}
        {(() => {
          let activeComp = latestComparison;
          let targetSession = latestSession;
          if (selectedActivityType === 'memory') {
            activeComp = memoryComparison;
            targetSession = latestMemory || null;
          } else if (selectedActivityType === 'meditation') {
            activeComp = meditationComparison;
            targetSession = latestMeditation || null;
          } else if (selectedActivityType === 'chanting') {
            activeComp = chantingComparison;
            targetSession = latestChanting || null;
          } else if (selectedActivityType === 'focus') {
            activeComp = focusComparison;
            targetSession = latestFocus || null;
          }

          if (!targetSession || !activeComp) {
            return (
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card-inner)',
                border: '1px dashed var(--border-subtle)',
                textAlign: 'center'
              }}>
                <Info size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  No session recorded yet in this category
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 14px auto' }}>
                  Complete a practice session to establish your baseline and enable real performance comparisons.
                </div>
                <button
                  onClick={() => setActiveTab(selectedActivityType === 'all' ? 'dashboard' : selectedActivityType === 'memory' ? 'games' : selectedActivityType === 'meditation' ? 'meditation' : 'practice')}
                  className="btn btn-secondary btn-sm"
                >
                  Start Practice
                </button>
              </div>
            );
          }

          return (
            <div style={{
              background: activeComp.hasBaseline ? 'var(--primary-subtle)' : 'var(--bg-card-inner)',
              border: `1px solid ${activeComp.hasBaseline ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                  {targetSession.activityTitle} ({targetSession.activityType})
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Completed {new Date(targetSession.completedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.5 }}>
                {activeComp.summary}
              </div>

              {activeComp.detail && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {activeComp.detail}
                </div>
              )}

              {activeComp.hasBaseline && activeComp.metricLabel && (
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(40, 84, 67, 0.15)',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Current {activeComp.metricLabel}: </span>
                    <strong style={{ color: 'var(--primary)' }}>{activeComp.currentValue}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Previous {activeComp.metricLabel}: </span>
                    <strong style={{ color: 'var(--text-main)' }}>{activeComp.previousValue}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* 3. Consistency Milestones (Restrained & Meaningful) */}
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--accent-amber)" />
            <span>Consistency Milestones</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Earned exclusively from verified sessions. No streaks, no guilt, no penalty for days off.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {milestones.map(m => {
            return (
              <div
                key={m.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: m.unlocked ? '#FFFFFF' : 'var(--bg-card-inner)',
                  border: `1px solid ${m.unlocked ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                  opacity: m.unlocked ? 1 : 0.72,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: m.unlocked ? 'var(--primary-subtle)' : '#E6E3DA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {m.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{m.title}</strong>
                    {m.unlocked ? (
                      <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Unlocked</span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Locked</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0 0 0' }}>
                    {m.description}
                  </p>
                  {m.unlocked && m.unlockedAt && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '4px' }}>
                      Earned {new Date(m.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Verified Session History Log */}
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary)" />
              <span>Verified Session History Log</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Immutable audit log of completed cognitive drills, meditation, and chanting practice.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                fontSize: '0.8rem',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: '#FFFFFF',
                color: 'var(--text-main)'
              }}
            >
              <option value="all">All Activities</option>
              <option value="memory">Cognitive Memory</option>
              <option value="meditation">Meditation & Breathing</option>
              <option value="chanting">Cultural Chanting</option>
              <option value="focus">Focus Sprints</option>
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            No verified practice sessions found for this filter. Complete an activity to see it logged here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <th style={{ padding: '8px 12px' }}>ACTIVITY</th>
                  <th style={{ padding: '8px 12px' }}>CATEGORY</th>
                  <th style={{ padding: '8px 12px' }}>DATE & TIME</th>
                  <th style={{ padding: '8px 12px' }}>DURATION</th>
                  <th style={{ padding: '8px 12px' }}>PERFORMANCE / MEASURE</th>
                  <th style={{ padding: '8px 12px' }}>POINTS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(s => {
                  const durationMins = Math.max(1, Math.round(s.durationSeconds / 60));
                  const dateStr = new Date(s.completedAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {s.activityTitle}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-teal" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                          {s.activityType}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-main)' }}>
                        {durationMins} min
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {s.correctCount !== undefined ? (
                          <span>{s.correctCount} items correct {s.attempts ? `(${Math.round((s.correctCount / s.attempts) * 100)}%)` : ''}</span>
                        ) : s.metadata?.rounds ? (
                          <span>{s.metadata.rounds} cycles completed</span>
                        ) : s.metadata?.loops ? (
                          <span>{s.metadata.loops} mantra repetitions</span>
                        ) : (
                          <span>Completed cleanly</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                        +{Math.min(50, Math.max(1, Math.round(s.durationSeconds / 60)) * 3 + (s.completed ? 5 : 0))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Weekly Executive Progress Report & Auto-Email Dispatch */}
      <div className="clean-card" style={{
        padding: '24px 28px',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-teal">Automated Reports</span>
              <span className="badge badge-sage">Weekly Synthesis</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} color="var(--primary)" />
              Weekly Client Executive Report & Auto-Email
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '640px' }}>
              Synthesizes 7-day sleep averages vs personal targets, habit compliance rates, focus sprint volume, and personalized AI Coach directives into an executive PDF/email ready report.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={weeklyReportsEnabled}
                onChange={e => setWeeklyReportsEnabled(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Auto-dispatch weekly on Sundays</span>
            </label>
          </div>
        </div>

        {/* Email Recipient and Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          background: 'var(--bg-card-inner)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          marginBottom: '18px'
        }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Client Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="e.g. client@domain.com"
              className="input-field"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: '#FFFFFF',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
            <button
              onClick={handleSendReport}
              disabled={isSendingReport}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isSendingReport ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
              <span>{isSendingReport ? 'Generating & Dispatching...' : 'Generate & Email Report Now'}</span>
            </button>

            <button
              onClick={handlePreviewReport}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={15} />
              <span>Preview Report</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {sendFeedback && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: sendFeedback.status === 'success' ? 'rgba(40, 84, 67, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            border: `1px solid ${sendFeedback.status === 'success' ? 'rgba(40, 84, 67, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
            color: sendFeedback.status === 'success' ? 'var(--primary)' : '#DC2626',
            fontSize: '0.86rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {sendFeedback.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{sendFeedback.message}</span>
            </div>
            <button onClick={() => setSendFeedback(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Report History Summary */}
        {reportHistory.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Recent Dispatched Reports
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reportHistory.slice(0, 3).map(rpt => (
                <div
                  key={rpt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#F9F8F5',
                    fontSize: '0.84rem',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={15} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{rpt.weekLabel}</span>
                    <span style={{ color: 'var(--text-muted)' }}>• Sent to {rpt.recipientEmail}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-sage">Score: {rpt.averageScore}/100</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{new Date(rpt.sentAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && previewReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '780px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            padding: '32px',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
          }}>
            <button
              onClick={() => setIsPreviewOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge badge-teal">Client Executive Preview</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  Weekly Progress Report — {previewReport.metrics.weekLabel}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadReportFile(previewReport, 'md')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download .MD</span>
                </button>
                <button
                  onClick={() => downloadReportFile(previewReport, 'html')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download .HTML</span>
                </button>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              padding: '16px',
              background: '#F9F8F5',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Discipline Score</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {previewReport.metrics.averageDisciplineScore}/100
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Nightly Sleep Avg</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E3A8A' }}>
                  {previewReport.metrics.averageSleep}h
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Target: {previewReport.metrics.targetSleep}h</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Practice Time</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {previewReport.metrics.totalPracticeMinutes}m
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{previewReport.metrics.totalSessions} sessions</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Habit Consistency</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>
                  {previewReport.metrics.habitCompletionRate}%
                </div>
              </div>
            </div>

            {/* AI Coach Assessment */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                AI Life Coach Assessment
              </h4>
              <div style={{
                padding: '14px 18px',
                background: '#F4F8F6',
                borderLeft: '4px solid var(--primary)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)'
              }}>
                {previewReport.metrics.executiveSummary}
              </div>
            </div>

            {/* Directives */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                3 Calibrated Directives for Next Week
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {previewReport.metrics.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      background: '#F9F8F5',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <strong style={{ color: 'var(--primary)' }}>Directive {idx + 1}: </strong>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsPreviewOpen(false)} className="btn btn-secondary">
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleSendReport();
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={15} />
                <span>Email Report to {recipientEmail || user.email}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="clean-card" style={{
        padding: '16px 20px',
        background: '#FFFFFF',
        borderLeft: '4px solid var(--primary)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-main)' }}>Local Data Storage & Ethical Measurement Disclosure: </strong>
          Your session records are persisted securely in your local browser storage. SMRITARA does not upload your personal practice logs or biometric data to external servers without an authorized account. Comparisons are purely factual arithmetic reflections of your own past sessions and do not represent medical or neurological diagnoses.
        </div>
      </div>
    </div>
  );
};
