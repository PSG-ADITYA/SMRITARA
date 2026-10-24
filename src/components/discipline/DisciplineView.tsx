import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Target, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const DisciplineView: React.FC<{ onOpenLogModal: () => void }> = ({ onOpenLogModal }) => {
  const { 
    user, 
    habits, 
    addHabit, 
    deleteHabit, 
    dailyLogs, 
    toggleHabitForDate, 
    addFocusSession, 
    focusSessions,
    getTodayLog 
  } = useApp();

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getTodayStr();
  const todayLog = getTodayLog();

  // Habit Add Form State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');
  const [newHabitCategory, setNewHabitCategory] = useState('Focus');

  // Focus Timer State
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTaskName, setCurrentTaskName] = useState('Deep Work & Core Sprint');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      addFocusSession(currentTaskName, focusMinutes);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      alert(`🎉 Focus Session Completed: ${focusMinutes} minutes of "${currentTaskName}" saved!`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(focusMinutes * 60);
  };

  const handleSetTimerDuration = (mins: number) => {
    setFocusMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsTimerRunning(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName, newHabitType, newHabitCategory);
    setNewHabitName('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  // Adherence Calculations
  const completedGoodCount = goodHabits.filter(h => todayLog?.completedHabitIds.includes(h.id)).length;
  const avoidedBadCount = badHabits.filter(h => !todayLog?.completedHabitIds.includes(h.id)).length;

  return (
    <div>
      {/* Top Discipline Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Score Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Discipline Score (7d Rolling)
            </span>
            <Sparkles size={16} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>
            {user.disciplineScore} <span style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Transparent: Sleep (20) + Screen (20) + Habits (60)
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Consecutive Active Streak
            </span>
            <Flame size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>
            {user.currentStreak} <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Days</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Grace period: Active today or yesterday
          </div>
        </div>

        {/* Focus Time Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Focus Time Recorded
            </span>
            <Timer size={18} color="#14b8a6" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2dd4bf' }}>
            {focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0)} <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Mins</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {focusSessions.length} deep work session(s)
          </div>
        </div>

        {/* Habit Completion Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Today's Habit Execution
            </span>
            <Target size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399' }}>
            {completedGoodCount} <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>/ {goodHabits.length}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Avoided {avoidedBadCount} of {badHabits.length} bad habits
          </div>
        </div>
      </div>

      {/* Main Grid: Focus Timer + Habit Manager */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', marginBottom: '28px' }}>
        {/* Interactive Focus Session Timer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={20} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Deep Work Focus Timer</h3>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[15, 25, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSetTimerDuration(mins)}
                  className={`btn btn-sm ${focusMinutes === mins ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Task Name Input */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
            <input
              type="text"
              className="input-field"
              value={currentTaskName}
              onChange={e => setCurrentTaskName(e.target.value)}
              placeholder="What are you focusing on?"
              style={{ textAlign: 'center', fontSize: '0.95rem' }}
            />
          </div>

          {/* Circular Timer Display */}
          <div style={{
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(12, 12, 20, 0.8) 70%)',
            border: `3px solid ${isTimerRunning ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
            boxShadow: isTimerRunning ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            transition: 'all 0.3s ease'
          }}>
            <div className="font-mono" style={{ fontSize: '3.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
              {formatTime(secondsRemaining)}
            </div>
            <div style={{ fontSize: '0.8rem', color: isTimerRunning ? '#34d399' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              {isTimerRunning ? 'Flow In Progress' : 'Ready to Sprint'}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {isTimerRunning ? (
              <button onClick={handlePauseTimer} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                <Pause size={18} />
                <span>Pause</span>
              </button>
            ) : (
              <button onClick={handleStartTimer} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                <Play size={18} />
                <span>Start Focus</span>
              </button>
            )}
            <button onClick={handleResetTimer} className="btn btn-secondary">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Habits Manager & Daily Checklist */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Habit Portfolio</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Click to toggle completion for today ({todayStr})
              </p>
            </div>
            <button onClick={onOpenLogModal} className="btn btn-primary btn-sm">
              Log Full Day
            </button>
          </div>

          {/* Add Habit Inline Form */}
          <form onSubmit={handleCreateHabit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Add new habit (e.g. Read 10 pages)..."
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
            />
            <select
              value={newHabitType}
              onChange={e => setNewHabitType(e.target.value as 'good' | 'bad')}
              style={{
                background: 'var(--bg-card-inner)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                padding: '0 8px',
                fontSize: '0.82rem'
              }}
            >
              <option value="good">Good (+pts)</option>
              <option value="bad">Bad (-pts)</option>
            </select>
            <button type="submit" className="btn btn-teal btn-sm">
              <Plus size={16} />
            </button>
          </form>

          {/* Habit Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
            {habits.map(habit => {
              const isGood = habit.type === 'good';
              const isCompleted = todayLog?.completedHabitIds.includes(habit.id);

              return (
                <div
                  key={habit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card-inner)',
                    border: `1px solid ${isCompleted ? (isGood ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)') : 'var(--border-subtle)'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    onClick={() => toggleHabitForDate(habit.id, todayStr)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      border: `2px solid ${isCompleted ? (isGood ? '#10b981' : '#f43f5e') : 'var(--text-muted)'}`,
                      background: isCompleted ? (isGood ? '#10b981' : '#f43f5e') : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isCompleted && (isGood ? <Check size={13} color="#ffffff" /> : <X size={13} color="#ffffff" />)}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                        {habit.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isGood ? '#34d399' : '#fb7185' }}>
                        {isGood ? 'Positive Habit' : 'Impulse to Avoid'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title="Delete Habit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Daily Logs Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Recent Activity Logs</h3>
        {dailyLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            No logs recorded yet. Click "Log Full Day" to create your first daily benchmark.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Score</th>
                  <th style={{ padding: '12px 14px' }}>Sleep</th>
                  <th style={{ padding: '12px 14px' }}>Screen Time</th>
                  <th style={{ padding: '12px 14px' }}>Mood / Energy</th>
                  <th style={{ padding: '12px 14px' }}>Habits Completed</th>
                  <th style={{ padding: '12px 14px' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogs.slice(0, 7).map(log => (
                  <tr key={log.date} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{log.date}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${log.disciplineScore >= 75 ? 'badge-emerald' : log.disciplineScore >= 50 ? 'badge-amber' : 'badge-rose'}`}>
                        {log.disciplineScore} pts
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>{log.sleepHours}h</td>
                    <td style={{ padding: '12px 14px' }}>{log.screenTimeHours}h</td>
                    <td style={{ padding: '12px 14px' }}>{log.moodScore}/10 • {log.energyScore}/10</td>
                    <td style={{ padding: '12px 14px' }}>{log.completedHabitIds.length} done</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
