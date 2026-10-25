import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { DailyScheduleBlock } from '../../types';

export const PracticeView: React.FC<{ onOpenLogModal?: () => void }> = ({ onOpenLogModal }) => {
  const { 
    user, 
    habits, 
    addHabit, 
    deleteHabit, 
    toggleHabitForDate, 
    todaySchedule, 
    updateSchedule,
    addFocusSession, 
    getTodayLog,
    soundEnabled
  } = useApp();

  const todayLog = getTodayLog();
  const todayStr = new Date().toISOString().split('T')[0];

  // Focus Sprint Timer State
  const [taskName, setTaskName] = useState('Deep Practice & Focus');
  const [sprintMinutes, setSprintMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // New Habit input
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      addFocusSession(taskName, sprintMinutes);
      alert(`Focus sprint completed: ${taskName} (${sprintMinutes} min)`);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleStartTimer = () => {
    setTimerActive(true);
  };

  const handlePauseTimer = () => {
    setTimerActive(false);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeLeft(sprintMinutes * 60);
  };

  const handleDurationChange = (mins: number) => {
    setSprintMinutes(mins);
    setTimeLeft(mins * 60);
    setTimerActive(false);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitType);
    setNewHabitName('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Overview */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Circadian Alignment</span>
              {user.chronotypeProfile && (
                <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>
                  {user.chronotypeProfile.label}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Practice Routine & Energy Schedule
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '640px', marginTop: '4px' }}>
              Structure demanding work during peak mental alertness windows and practice calming reflections during wind-down periods.
            </p>
          </div>

          {onOpenLogModal && (
            <button onClick={onOpenLogModal} className="btn btn-primary">
              <Plus size={16} />
              <span>Self-Reported Check-In</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Focus Sprint Timer (Honest, no fake device control) */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Clock size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Focused Practice Sprint
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '20px' }}>
          Dedicated single-task focus timer. We do not pretend to lock your device or read private phone data; focus is self-directed.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px'
        }}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Sprint Objective
              </label>
              <input
                type="text"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                className="input-field"
                style={{ width: '280px', padding: '8px 12px' }}
                placeholder="What are you focusing on?"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[15, 25, 45].map(m => (
                <button
                  key={m}
                  onClick={() => handleDurationChange(m)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: sprintMinutes === m ? 'var(--primary)' : '#FFFFFF',
                    color: sprintMinutes === m ? '#FFFFFF' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {m} Min
                </button>
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
              {formatTimer(timeLeft)}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
              {timerActive ? (
                <button onClick={handlePauseTimer} className="btn btn-secondary btn-sm">
                  <Pause size={14} />
                  <span>Pause</span>
                </button>
              ) : (
                <button onClick={handleStartTimer} className="btn btn-primary btn-sm">
                  <Play size={14} fill="currentColor" />
                  <span>Start Sprint</span>
                </button>
              )}
              <button onClick={handleResetTimer} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Habit Consistency */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Daily Consistency Checklist
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
              Build sustainable momentum. Missed sessions are never penalized; simply return the next day.
            </p>
          </div>

          <form onSubmit={handleAddHabit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              placeholder="Add positive habit..."
              className="input-field"
              style={{ width: '220px', padding: '6px 10px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {habits.map(h => {
            const isDone = todayLog?.completedHabitIds.includes(h.id);
            return (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isDone ? 'var(--primary-subtle)' : 'var(--bg-card-inner)',
                  border: `1px solid ${isDone ? 'rgba(40, 84, 67, 0.25)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                <div 
                  onClick={() => toggleHabitForDate(h.id, todayStr)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `1.5px solid ${isDone ? 'var(--primary)' : 'var(--border-medium)'}`,
                    background: isDone ? 'var(--primary)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    {isDone && <CheckCircle2 size={14} />}
                  </div>
                  <div>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: isDone ? 'var(--primary)' : 'var(--text-main)',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}>
                      {h.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      ({h.category || 'General'})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-sage" style={{ fontSize: '0.72rem' }}>
                    {h.streak || 0}d streak
                  </span>
                  <button
                    onClick={() => deleteHabit(h.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Remove habit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Circadian Alertness Windows */}
      {todaySchedule && todaySchedule.length > 0 && (
        <div className="clean-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Circadian Energy Schedule
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
            Aligned with your morningness-eveningness chronotype rhythm:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {todaySchedule.slice(0, 6).map((block: DailyScheduleBlock) => (
              <div
                key={block.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '2px' }}>
                  {block.startTime} – {block.endTime}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {block.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {block.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
