import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Brain, 
  Wind, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle,
  Play,
  Bookmark,
  X,
  Clock,
  Compass,
  BarChart3,
  Calendar,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDailyRecommendations } from '../../engine/recommendationEngine';
import { compareWithPreviousSession } from '../../engine/sessionProgressEngine';

export const DashboardView: React.FC<{ onOpenLogModal: () => void }> = ({ onOpenLogModal }) => {
  const { 
    user, 
    practiceSessions, 
    todayTip, 
    dismissTip, 
    savedTipIds, 
    toggleSaveTip,
    practicePoints, 
    milestones, 
    setActiveTab, 
    getTodayLog, 
    isDemoMode 
  } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<5 | 7 | 10>(7);
  const [dismissedRecIds, setDismissedRecIds] = useState<string[]>([]);

  const todayLog = getTodayLog();
  const recommendations = generateDailyRecommendations(
    practiceSessions,
    selectedDuration,
    user.onboardingPreferences?.preferredLanguage || 'english',
    dismissedRecIds
  );

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Find most recent completed session to show comparison
  const latestSession = practiceSessions[0];
  const comparison = latestSession 
    ? compareWithPreviousSession(latestSession, practiceSessions)
    : null;

  // Unfinished or today's activities count
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = practiceSessions.filter(s => s.completedAt.startsWith(todayStr));
  const completedToday = todaySessions.length;

  const isTipSaved = savedTipIds.includes(todayTip.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Warm Greeting & Today's Overview Hero */}
      <div className="clean-card" style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Daily Command Center</span>
              {isDemoMode ? (
                <span className="badge badge-amber">Demo Sandbox</span>
              ) : (
                <span className="badge badge-teal">Personal Space</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {getGreeting()}, {user.username}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', marginTop: '4px' }}>
              Focus on intentional practice today. Your routine adapts to your available time and recent drills.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Practice Points Stat */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Practice Points
              </div>
              <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                {practicePoints}
              </div>
            </div>

            {/* Sessions Today Stat */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Sessions Today
              </div>
              <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                {completedToday}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Daily Tip (Curated from 1,000+ Verified Tips) */}
      <div style={{
        background: 'var(--bg-card-inner)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '260px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--accent-amber-subtle)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-amber)', letterSpacing: '0.04em' }}>
                Tip of the Day • {todayTip.category}
              </span>
              {todayTip.authorOrOrigin && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({todayTip.authorOrOrigin})</span>
              )}
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              "{todayTip.text}"
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => toggleSaveTip(todayTip.id)}
            className="btn btn-secondary btn-sm"
            style={{ color: isTipSaved ? 'var(--primary)' : 'var(--text-secondary)' }}
            title={isTipSaved ? 'Remove from saved tips' : 'Save tip to review later'}
          >
            <Bookmark size={14} fill={isTipSaved ? 'currentColor' : 'none'} />
            <span>{isTipSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={() => dismissTip(todayTip.id)}
            className="btn btn-secondary btn-sm"
            title="Dismiss this tip for today"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 3. Today's Suggested Practice (Duration Selector: 5m, 7m, 10m) */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Today's Suggested Practice
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Choose your available time. We dynamically distribute activities without rigid completion pressure.
            </p>
          </div>

          {/* 5 / 7 / 10 Minute Duration Choice */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            {([5, 7, 10] as const).map(mins => (
              <button
                key={mins}
                onClick={() => setSelectedDuration(mins)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedDuration === mins ? '#FFFFFF' : 'transparent',
                  color: selectedDuration === mins ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: selectedDuration === mins ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: selectedDuration === mins ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Practice Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {recommendations.map(act => (
            <div
              key={act.id}
              style={{
                background: 'var(--bg-card-inner)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-sage">
                    {act.categoryLabel}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>{act.durationMinutes}m</span>
                  </div>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '16px' }}>
                  {act.reason}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setActiveTab(act.targetTab)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Play size={13} fill="currentColor" />
                  <span>Begin ({act.durationMinutes}m)</span>
                </button>
                <button
                  onClick={() => setDismissedRecIds(prev => [...prev, act.id])}
                  className="btn btn-secondary btn-sm"
                  title="Replace with alternative activity"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Real Performance Comparison with Previous Session */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <BarChart3 size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Comparison with Previous Comparable Session
          </h3>
        </div>

        {comparison ? (
          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              marginBottom: '10px'
            }}>
              <strong>{comparison.summary}</strong>
              {comparison.detail && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {comparison.detail}
                </div>
              )}
            </div>
            {latestSession && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Latest recorded session: <strong>{latestSession.activityTitle}</strong> on {new Date(latestSession.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({Math.round(latestSession.durationSeconds / 60)} min).
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)'
          }}>
            Establishing baseline — complete a session in Memory Gym, Chanting, or Meditation to view your direct progress comparison against prior sessions.
          </div>
        )}
      </div>

      {/* 5. Quick Access Grid to Activities */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Quick Access Disciplines
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {[
            {
              id: 'games',
              title: 'Cognitive Games',
              desc: 'Sequence chimes & pattern memory',
              icon: Brain,
              tag: 'Memory Gym'
            },
            {
              id: 'library',
              title: 'Cultural Library',
              desc: 'Audible verses, shlokas & poems',
              icon: BookOpen,
              tag: 'Literature'
            },
            {
              id: 'meditation',
              title: 'Meditation Studio',
              desc: '8 guided breathing techniques',
              icon: Wind,
              tag: 'Breathwork'
            },
            {
              id: 'practice',
              title: 'Practice Routine',
              desc: 'Circadian schedule & focus sprint',
              icon: Target,
              tag: 'Consistency'
            },
          ].map(mod => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className="clean-card"
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <Icon size={20} color="var(--primary)" />
                    <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>{mod.tag}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {mod.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginTop: '14px' }}>
                  <span>Open Discipline</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
