import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Target, 
  Brain, 
  Wind, 
  Moon, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle,
  Play,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC<{ onOpenLogModal: () => void }> = ({ onOpenLogModal }) => {
  const { 
    user, 
    habits, 
    dailyLogs, 
    focusSessions, 
    memorySessions, 
    mindfulnessSessions, 
    todaySchedule, 
    patternInsights,
    setActiveTab, 
    getTodayLog 
  } = useApp();

  const todayLog = getTodayLog();
  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  const completedGoodCount = goodHabits.filter(h => todayLog?.completedHabitIds.includes(h.id)).length;
  const avoidedBadCount = badHabits.filter(h => !todayLog?.completedHabitIds.includes(h.id)).length;
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Suggested next action priority heuristic
  let suggestedAction = {
    title: 'Complete Today\'s Activity Log',
    subtitle: 'Log sleep, screen time, and habits to calibrate your daily score.',
    actionText: 'Log Activity',
    onClick: onOpenLogModal,
    icon: PlusCircle
  };

  if (todayLog && !user.chronotypeProfile) {
    suggestedAction = {
      title: 'Discover Your Circadian Chronotype',
      subtitle: 'Take the 2-minute assessment to unlock your optimal focus windows.',
      actionText: 'Take Assessment',
      onClick: () => setActiveTab('bodyclock'),
      icon: Clock
    };
  } else if (todayLog && memorySessions.length === 0) {
    suggestedAction = {
      title: 'Engage Working Memory in the Gym',
      subtitle: 'Play a 2-minute Matrix Grid or Sequence Recall exercise.',
      actionText: 'Start Memory Exercise',
      onClick: () => setActiveTab('memory'),
      icon: Brain
    };
  } else if (todayLog && mindfulnessSessions.length === 0) {
    suggestedAction = {
      title: 'Mindful Respiratory Reset',
      subtitle: 'Perform a 3-minute Box Breathing session to lower stress.',
      actionText: 'Begin Breathwork',
      onClick: () => setActiveTab('mindfulness'),
      icon: Wind
    };
  } else if (todayLog) {
    suggestedAction = {
      title: 'Consult Your AI Life Coach',
      subtitle: 'Review grounded observations and explore personalized habit proposals.',
      actionText: 'Open AI Coach',
      onClick: () => setActiveTab('coach'),
      icon: Sparkles
    };
  }

  const primaryInsight = patternInsights[0];

  return (
    <div>
      {/* Top Hero Welcome Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(20, 184, 166, 0.12) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        marginBottom: '28px',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple">Command Center</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Personal Growth Feedback Loop
              </span>
            </div>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Welcome back, <span className="gradient-title">{user.username}</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', marginTop: '4px' }}>
              "Understand yourself. Train your mind. Become who you intend to be."
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Discipline Score
              </div>
              <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff' }}>
                {user.disciplineScore} <span style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>/ 100</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Active Streak
              </div>
              <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Flame size={24} />
                <span>{user.currentStreak}d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Action Banner */}
      <div style={{
        background: 'rgba(12, 12, 20, 0.8)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-teal) 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <suggestedAction.icon size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase' }}>
              Recommended Next Step
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              {suggestedAction.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {suggestedAction.subtitle}
            </div>
          </div>
        </div>

        <button onClick={suggestedAction.onClick} className="btn btn-teal">
          <span>{suggestedAction.actionText}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Core Pillar Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Habit Completion Card */}
        <div 
          onClick={() => setActiveTab('discipline')} 
          className="glass-card" 
          style={{ cursor: 'pointer', padding: '22px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Habits Completed
            </span>
            <Target size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399' }}>
            {completedGoodCount} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {goodHabits.length}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {avoidedBadCount} of {badHabits.length} bad habits avoided
          </div>
        </div>

        {/* Focus Sprint Card */}
        <div 
          onClick={() => setActiveTab('discipline')} 
          className="glass-card" 
          style={{ cursor: 'pointer', padding: '22px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Focus Sprints
            </span>
            <Clock size={18} color="#14b8a6" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2dd4bf' }}>
            {totalFocusMinutes} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Mins</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {focusSessions.length} deep work session(s)
          </div>
        </div>

        {/* Memory Gym Card */}
        <div 
          onClick={() => setActiveTab('memory')} 
          className="glass-card" 
          style={{ cursor: 'pointer', padding: '22px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Memory Gym Tests
            </span>
            <Brain size={18} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-light)' }}>
            {memorySessions.length} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Played</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Avg accuracy: {memorySessions.length > 0 ? Math.round(memorySessions.reduce((a, s) => a + s.accuracy, 0) / memorySessions.length) : 0}%
          </div>
        </div>

        {/* Mindfulness Card */}
        <div 
          onClick={() => setActiveTab('mindfulness')} 
          className="glass-card" 
          style={{ cursor: 'pointer', padding: '22px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Mindfulness Time
            </span>
            <Wind size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#a5b4fc' }}>
            {Math.round(mindfulnessSessions.reduce((a, s) => a + s.durationSeconds, 0) / 60)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Mins</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {mindfulnessSessions.length} session(s) completed
          </div>
        </div>
      </div>

      {/* Mid Section: Chronotype Schedule + Pattern Insight */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', marginBottom: '28px' }}>
        {/* Daily Schedule Preview */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary-light)" />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Today's Synchronized Schedule</h4>
            </div>
            <button onClick={() => setActiveTab('bodyclock')} className="btn btn-secondary btn-sm">
              <span>View Full</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todaySchedule.slice(0, 4).map((block, idx) => (
              <div
                key={block.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{block.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{block.notes}</div>
                </div>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                  {block.startTime} – {block.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grounded Behavioral Pattern Insight */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#2dd4bf" />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Grounded Pattern Insight</h4>
            </div>
            <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
              {primaryInsight?.confidence || 'Active Analysis'}
            </span>
          </div>

          <div className="glass-card-inner" style={{ padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
              {primaryInsight?.title || 'Personal Growth Calibration'}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.6, marginBottom: '10px' }}>
              {primaryInsight?.observation || 'Recording consistent daily logs will reveal how sleep duration and focus timing impact your energy.'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Tip:</strong> {primaryInsight?.recommendation || 'Maintain steady bedtime hours to protect morning cognitive stamina.'}
            </p>
          </div>

          <button onClick={() => setActiveTab('patterns')} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <span>Explore All Behavioral Correlations</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
