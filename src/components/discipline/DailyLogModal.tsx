import React, { useState, useEffect } from 'react';
import { X, Moon, Smartphone, Smile, Zap, TrendingUp, Sparkles, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { calculateDailyDisciplineScore } from '../../engine/scoring';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({ isOpen, onClose }) => {
  const { user, habits, dailyLogs, upsertDailyLog, toggleHabitForDate } = useApp();

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getTodayStr();
  const existingLog = dailyLogs.find(l => l.date === todayStr);

  const [dateStr, setDateStr] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState(existingLog ? existingLog.sleepHours : user.targetSleep);
  const [screenTimeHours, setScreenTimeHours] = useState(existingLog ? existingLog.screenTimeHours : user.targetScreenTime);
  const [moodScore, setMoodScore] = useState(existingLog ? existingLog.moodScore : 8);
  const [energyScore, setEnergyScore] = useState(existingLog ? existingLog.energyScore : 7);
  const [productivityScore, setProductivityScore] = useState(existingLog ? existingLog.productivityScore : 8);
  const [notes, setNotes] = useState(existingLog ? existingLog.notes : '');
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>(
    existingLog ? existingLog.completedHabitIds : []
  );

  useEffect(() => {
    const log = dailyLogs.find(l => l.date === dateStr);
    if (log) {
      setSleepHours(log.sleepHours);
      setScreenTimeHours(log.screenTimeHours);
      setMoodScore(log.moodScore);
      setEnergyScore(log.energyScore);
      setProductivityScore(log.productivityScore);
      setNotes(log.notes);
      setSelectedHabitIds(log.completedHabitIds);
    }
  }, [dateStr, dailyLogs]);

  if (!isOpen) return null;

  // Real-time score calculation preview
  const previewScore = calculateDailyDisciplineScore(
    sleepHours,
    user.targetSleep,
    screenTimeHours,
    user.targetScreenTime,
    habits,
    selectedHabitIds
  );

  const handleToggleHabit = (id: string) => {
    setSelectedHabitIds(prev => 
      prev.includes(id) ? prev.filter(hId => hId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertDailyLog({
      date: dateStr,
      sleepHours,
      screenTimeHours,
      moodScore,
      energyScore,
      productivityScore,
      notes
    });

    // Update habits for this date
    selectedHabitIds.forEach(hId => {
      if (!existingLog?.completedHabitIds.includes(hId)) {
        toggleHabitForDate(hId, dateStr);
      }
    });

    if (previewScore.total >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    onClose();
  };

  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '32px'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
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

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary-light)" />
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Daily Activity & State Check-In</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Record sleep, screen time, and subjective energy to fuel your personal growth feedback loop.
          </p>
        </div>

        {/* Live Score Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(20, 184, 166, 0.15) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Calculated Discipline Score
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
              {previewScore.total} <span style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>/ 100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${previewScore.total >= 75 ? 'badge-emerald' : previewScore.total >= 50 ? 'badge-amber' : 'badge-rose'}`}>
              {previewScore.tier}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sleep: {previewScore.sleepScore}/20 • Screen: {previewScore.screenScore}/20 • Habits: {previewScore.goodHabitsScore + previewScore.badHabitsScore}/60
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Sleep Slider */}
            <div className="glass-card-inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Moon size={16} color="#818cf8" />
                  <span>Sleep Hours</span>
                </div>
                <span className="font-mono" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                  {sleepHours}h (Target: {user.targetSleep}h)
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="12.0"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Screen Time Slider */}
            <div className="glass-card-inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Smartphone size={16} color="#f43f5e" />
                  <span>Screen Time (Phone + Non-Work)</span>
                </div>
                <span className="font-mono" style={{ color: screenTimeHours <= user.targetScreenTime ? '#34d399' : '#fb7185', fontWeight: 700 }}>
                  {screenTimeHours}h (Limit: {user.targetScreenTime}h)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.5"
                value={screenTimeHours}
                onChange={e => setScreenTimeHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: screenTimeHours <= user.targetScreenTime ? '#10b981' : '#f43f5e' }}
              />
            </div>
          </div>

          {/* Energy & Mood Ratings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Mood */}
            <div className="glass-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <Smile size={14} color="#f59e0b" />
                <span>Daily Mood: <strong style={{ color: '#fff' }}>{moodScore}/10</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={e => setMoodScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            {/* Energy */}
            <div className="glass-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <Zap size={14} color="#10b981" />
                <span>Subjective Energy: <strong style={{ color: '#fff' }}>{energyScore}/10</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyScore}
                onChange={e => setEnergyScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            {/* Productivity */}
            <div className="glass-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <TrendingUp size={14} color="var(--primary-light)" />
                <span>Productivity: <strong style={{ color: '#fff' }}>{productivityScore}/10</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={productivityScore}
                onChange={e => setProductivityScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Habit Toggles */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
              Habit Checklist for Today
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {goodHabits.map(h => {
                const isChecked = selectedHabitIds.includes(h.id);
                return (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card-inner)',
                      border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `2px solid ${isChecked ? '#10b981' : 'var(--text-muted)'}`,
                      background: isChecked ? '#10b981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isChecked && <Check size={12} color="#ffffff" />}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: isChecked ? '#ffffff' : 'var(--text-secondary)' }}>
                      {h.name}
                    </span>
                  </div>
                );
              })}

              {badHabits.map(h => {
                const isTriggered = selectedHabitIds.includes(h.id);
                return (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isTriggered ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-card-inner)',
                      border: `1px solid ${isTriggered ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `2px solid ${isTriggered ? '#f43f5e' : 'var(--text-muted)'}`,
                      background: isTriggered ? '#f43f5e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isTriggered && <X size={12} color="#ffffff" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: isTriggered ? '#f43f5e' : 'var(--text-secondary)' }}>
                        {h.name}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {isTriggered ? 'Triggered (Point Deduction)' : 'Successfully Avoided (+pts)'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Daily Observations & Context
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Slept well, completed 2 focus blocks, felt sharp after midday walk..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Daily Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
