import React, { useState, useEffect } from 'react';
import { X, Moon, Smartphone, Smile, Zap, TrendingUp, Sparkles, Check, Clock } from 'lucide-react';
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

  const [dateStr, setDateStr] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState(user.targetSleep || 7.5);
  const [screenTimeHours, setScreenTimeHours] = useState(user.targetScreenTime || 3.5);
  const [moodScore, setMoodScore] = useState(7);
  const [energyScore, setEnergyScore] = useState(7);
  const [productivityScore, setProductivityScore] = useState(7);
  const [notes, setNotes] = useState('');
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);

  // Synchronize state when modal opens or date selection changes
  useEffect(() => {
    if (isOpen) {
      const log = dailyLogs.find(l => l.date === dateStr);
      if (log) {
        setSleepHours(log.sleepHours);
        setScreenTimeHours(log.screenTimeHours);
        setMoodScore(log.moodScore);
        setEnergyScore(log.energyScore);
        setProductivityScore(log.productivityScore);
        setNotes(log.notes || '');
        setSelectedHabitIds(log.completedHabitIds || []);
      } else {
        setSleepHours(user.targetSleep || 7.5);
        setScreenTimeHours(user.targetScreenTime || 3.5);
        setMoodScore(7);
        setEnergyScore(7);
        setProductivityScore(7);
        setNotes('');
        setSelectedHabitIds([]);
      }
    }
  }, [isOpen, dateStr, dailyLogs]);

  // Comparison with previous recorded day
  const pastRecordedLogs = dailyLogs
    .filter(l => l.date < dateStr && l.sleepHours > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
  const previousRecordedDay = pastRecordedLogs[0];

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
      notes,
      completedHabitIds: selectedHabitIds,
      reportedAt: new Date().toISOString(),
      appliedDate: dateStr
    });

    // Also synchronize individual habit toggles
    selectedHabitIds.forEach(hId => {
      toggleHabitForDate(hId, dateStr);
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

  const sleepPresets = [5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 10.0];
  const screenPresets = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];

  return (
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
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '740px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '32px',
        background: '#FFFFFF',
        color: 'var(--text-main)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
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
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Close Check-In"
        >
          <X size={22} />
        </button>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Daily Activity & Sleep Check-In
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Record today's sleep duration, screen time, and micro-habits. Storing this updates your streak, calibration score, and awards verified progress points.
          </p>

          {/* Date Picker Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Check-in applies to date:</span>
            <input
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              className="input-field"
              style={{
                padding: '6px 12px',
                fontSize: '0.88rem',
                width: 'auto',
                background: '#F9F8F5',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)'
              }}
            />
            {dateStr === todayStr && (
              <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>Today's Check-In</span>
            )}
          </div>
        </div>

        {/* Live Score Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--primary-subtle)',
          border: '1px solid rgba(40, 84, 67, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Calculated Discipline Score for {dateStr === todayStr ? 'Today' : dateStr}
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--primary)' }}>
              {previewScore.total} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${previewScore.total >= 75 ? 'badge-emerald' : previewScore.total >= 50 ? 'badge-amber' : 'badge-rose'}`}>
              {previewScore.tier}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Sleep: {previewScore.sleepScore}/20 • Screen: {previewScore.screenScore}/20 • Habits: {previewScore.goodHabitsScore + previewScore.badHabitsScore}/60
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Sleep Slider & Quick Chips */}
            <div className="clean-card" style={{ padding: '18px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  <Moon size={16} color="var(--primary)" />
                  <span>Sleep Recorded for Today (Last Night)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="14.0"
                    value={sleepHours}
                    onChange={e => setSleepHours(Math.max(1, parseFloat(e.target.value) || 0))}
                    style={{
                      width: '60px',
                      padding: '3px 6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--primary)',
                      background: '#F9F8F5'
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>hrs</span>
                </div>
              </div>

              {/* Quick Select Preset Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
                {sleepPresets.map(preset => {
                  const isActive = sleepHours === preset;
                  return (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setSleepHours(preset)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isActive ? 'var(--primary)' : '#F4F2EC',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset}h
                    </button>
                  );
                })}
              </div>

              <input
                type="range"
                min="3.0"
                max="12.0"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '4px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Reported: {sleepHours}h</span>
                <span>Self-Reported Target: {user.targetSleep}h</span>
              </div>

              {/* Factual Previous Day Comparison */}
              <div style={{
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                marginTop: '10px',
                padding: '8px 12px',
                background: '#F8F5EE',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                {previousRecordedDay ? (
                  <span>
                    Compared with previous record ({previousRecordedDay.date}):{' '}
                    <strong style={{ color: sleepHours >= previousRecordedDay.sleepHours ? '#047857' : '#B45309' }}>
                      {sleepHours >= previousRecordedDay.sleepHours ? '+' : ''}
                      {(sleepHours - previousRecordedDay.sleepHours).toFixed(1)}h
                    </strong>{' '}
                    ({previousRecordedDay.sleepHours}h recorded previously).
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>
                    No prior record. Establishing your personal sleep baseline.
                  </span>
                )}
              </div>
            </div>

            {/* Screen Time Slider & Quick Chips */}
            <div className="clean-card" style={{ padding: '18px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  <Smartphone size={16} color="var(--accent-amber)" />
                  <span>Non-Work Screen Time</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="14.0"
                    value={screenTimeHours}
                    onChange={e => setScreenTimeHours(Math.max(0, parseFloat(e.target.value) || 0))}
                    style={{
                      width: '60px',
                      padding: '3px 6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      color: screenTimeHours <= user.targetScreenTime ? 'var(--primary)' : '#DC2626',
                      background: '#F9F8F5'
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>hrs</span>
                </div>
              </div>

              {/* Quick Select Preset Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
                {screenPresets.map(preset => {
                  const isActive = screenTimeHours === preset;
                  return (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setScreenTimeHours(preset)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isActive ? 'var(--accent-amber)' : '#F4F2EC',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        border: `1px solid ${isActive ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset}h
                    </button>
                  );
                })}
              </div>

              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={screenTimeHours}
                onChange={e => setScreenTimeHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: screenTimeHours <= user.targetScreenTime ? 'var(--primary)' : '#DC2626', marginTop: '4px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Reported: {screenTimeHours}h</span>
                <span>Self-Imposed Target Limit: {user.targetScreenTime}h</span>
              </div>
            </div>
          </div>

          {/* Energy & Mood Ratings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Mood */}
            <div className="clean-card" style={{ padding: '14px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smile size={14} color="var(--accent-amber)" />
                  <span>Daily Mood</span>
                </div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{moodScore}/10</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={e => setMoodScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
              />
            </div>

            {/* Energy */}
            <div className="clean-card" style={{ padding: '14px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="var(--primary)" />
                  <span>Subjective Energy</span>
                </div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{energyScore}/10</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyScore}
                onChange={e => setEnergyScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Productivity */}
            <div className="clean-card" style={{ padding: '14px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="var(--accent-teal)" />
                  <span>Focus & Productivity</span>
                </div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{productivityScore}/10</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={productivityScore}
                onChange={e => setProductivityScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-teal)' }}
              />
            </div>
          </div>

          {/* Habit Toggles */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
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
                      background: isChecked ? 'rgba(40, 84, 67, 0.08)' : '#F9F8F5',
                      border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `2px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isChecked ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isChecked && <Check size={12} color="#ffffff" />}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: isChecked ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: isChecked ? 600 : 400 }}>
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
                      background: isTriggered ? 'rgba(220, 38, 38, 0.08)' : '#F9F8F5',
                      border: `1px solid ${isTriggered ? 'rgba(220, 38, 38, 0.4)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `2px solid ${isTriggered ? '#DC2626' : 'var(--border-subtle)'}`,
                      background: isTriggered ? '#DC2626' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isTriggered && <X size={12} color="#ffffff" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: isTriggered ? '#DC2626' : 'var(--text-secondary)', fontWeight: isTriggered ? 600 : 400 }}>
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
              placeholder="e.g. Slept 7.5h restorative sleep, did morning breathing, feeling alert..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#F9F8F5',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>Record Check-In & Save Progress</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
