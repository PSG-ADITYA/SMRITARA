import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import type { BreathingTechnique } from '../../types';

interface TechniqueConfig {
  id: BreathingTechnique;
  name: string;
  phases: { name: string; duration: number }[];
  description: string;
}

const TECHNIQUES: TechniqueConfig[] = [
  {
    id: 'box',
    name: 'Box Breathing (Navy SEAL Protocol)',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
    description: 'Stabilizes sympathetic nervous arousal and restores emotional equilibrium.'
  },
  {
    id: '478',
    name: '4-7-8 Relaxing Breath',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold Full', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
    description: 'Potent parasympathetic activator for deep calm and evening sleep preparation.'
  },
  {
    id: 'coherence',
    name: 'Heart Coherence (5.5s Pace)',
    phases: [
      { name: 'Inhale Smoothly', duration: 5.5 },
      { name: 'Exhale Smoothly', duration: 5.5 },
    ],
    description: 'Synchronizes heart-rate variability (HRV) with respiration for sustained focus.'
  },
  {
    id: 'calm',
    name: 'Extended Exhale (4-2-6)',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 2 },
      { name: 'Exhale Slowly', duration: 6 },
    ],
    description: 'Lowers heart rate quickly during acute work pressure or exam anxiety.'
  }
];

export const MindfulnessView: React.FC = () => {
  const { recordMindfulnessSession, mindfulnessSessions } = useApp();

  const [mode, setMode] = useState<'breathing' | 'meditation'>('breathing');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>('box');
  const [durationMinutes, setDurationMinutes] = useState<number>(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Breathing Animation State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);

  // Reflection State
  const [moodBefore, setMoodBefore] = useState<number>(6);
  const [moodAfter, setMoodAfter] = useState<number>(8);
  const [journalNotes, setJournalNotes] = useState<string>('');
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  const activeTech = TECHNIQUES.find(t => t.id === selectedTechnique) || TECHNIQUES[0];
  const currentPhase = activeTech.phases[currentPhaseIndex];

  // Main session timer
  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      setSessionCompleted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    return () => clearInterval(timer);
  }, [isActive, secondsRemaining]);

  // Breathing phase cycle runner
  useEffect(() => {
    let phaseInterval: any = null;
    if (isActive && mode === 'breathing') {
      phaseInterval = setInterval(() => {
        setPhaseSecondsLeft(prev => {
          if (prev <= 1) {
            const nextIdx = (currentPhaseIndex + 1) % activeTech.phases.length;
            setCurrentPhaseIndex(nextIdx);
            return Math.round(activeTech.phases[nextIdx].duration);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(phaseInterval);
  }, [isActive, mode, currentPhaseIndex, activeTech]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(durationMinutes * 60);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(Math.round(activeTech.phases[0].duration));
    setSessionCompleted(false);
  };

  const handleSelectDuration = (mins: number) => {
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsActive(false);
    setSessionCompleted(false);
  };

  const handleSaveReflection = () => {
    recordMindfulnessSession({
      date: new Date().toISOString().split('T')[0],
      type: mode,
      technique: mode === 'breathing' ? selectedTechnique : undefined,
      durationSeconds: durationMinutes * 60 - secondsRemaining,
      moodBefore,
      moodAfter,
      reflectionNotes: journalNotes
    });
    setSessionCompleted(false);
    alert('✨ Mindful session and reflection successfully recorded in your history!');
  };

  // Determine scale of breathing circle based on phase
  const getCircleScale = () => {
    if (!isActive) return 1.0;
    if (mode !== 'breathing') return 1.05;

    const phase = currentPhase.name.toLowerCase();
    if (phase.includes('inhale')) {
      const progress = 1 - (phaseSecondsLeft / currentPhase.duration);
      return 0.8 + progress * 0.45; // Expands from 0.8 to 1.25
    } else if (phase.includes('exhale')) {
      const progress = 1 - (phaseSecondsLeft / currentPhase.duration);
      return 1.25 - progress * 0.45; // Contracts from 1.25 to 0.8
    } else {
      // Hold phase
      return currentPhaseIndex === 1 ? 1.25 : 0.8;
    }
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Studio Header Card */}
      <div className="glass-card" style={{ maxWidth: '840px', margin: '0 auto 28px auto', padding: '36px', textAlign: 'center' }}>
        {/* Mode Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={() => { setMode('breathing'); handleReset(); }}
            className={`btn ${mode === 'breathing' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Wind size={16} />
            <span>Interactive Breathwork</span>
          </button>
          <button
            onClick={() => { setMode('meditation'); handleReset(); }}
            className={`btn ${mode === 'meditation' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Heart size={16} />
            <span>Stillness Meditation</span>
          </button>
        </div>

        {/* Technique & Duration Selection */}
        {mode === 'breathing' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {TECHNIQUES.map(tech => (
              <button
                key={tech.id}
                onClick={() => {
                  setSelectedTechnique(tech.id);
                  handleReset();
                }}
                className={`btn btn-sm ${selectedTechnique === tech.id ? 'btn-teal' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem' }}
              >
                {tech.name.split('(')[0]}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {[1, 3, 5, 10].map(mins => (
            <button
              key={mins}
              onClick={() => handleSelectDuration(mins)}
              className={`btn btn-sm ${durationMinutes === mins ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              {mins} min
            </button>
          ))}
        </div>

        {/* Breathing Animation Canvas */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          margin: '0 auto 36px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Ambient Glow Ring */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }} />

          {/* Dynamic Scaling Circle */}
          <div style={{
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)',
            border: '2px solid rgba(167, 139, 250, 0.5)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${getCircleScale()})`,
            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {mode === 'breathing' ? (
              <>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                  {isActive ? currentPhase?.name : 'Ready'}
                </div>
                {isActive && (
                  <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2dd4bf', marginTop: '4px' }}>
                    {phaseSecondsLeft}s
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {isActive ? 'Witness the Breath' : 'Ready'}
                </div>
                <div className="font-mono" style={{ fontSize: '1.4rem', color: '#a78bfa', marginTop: '4px' }}>
                  {formatTimer(secondsRemaining)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Total Time & Controls */}
        <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-secondary)' }}>
          Session: {formatTimer(secondsRemaining)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '24px' }}>
          {isActive ? (
            <button onClick={handlePause} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
              <Pause size={18} />
              <span>Pause</span>
            </button>
          ) : (
            <button onClick={handleStart} className="btn btn-primary" style={{ padding: '12px 32px' }}>
              <Play size={18} />
              <span>{secondsRemaining < durationMinutes * 60 ? 'Resume' : 'Start Session'}</span>
            </button>
          )}
          <button onClick={handleReset} className="btn btn-secondary">
            <RotateCcw size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto' }}>
          {activeTech.description}
        </p>
      </div>

      {/* Mood Check-In & Reflection Form */}
      <div className="glass-card" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
          Mindful Check-in & Self-Reflection
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '18px' }}>
          <div className="glass-card-inner">
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Pre-Session Calm: <strong>{moodBefore}/10</strong>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moodBefore}
              onChange={e => setMoodBefore(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
          </div>

          <div className="glass-card-inner">
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Post-Session Calm: <strong>{moodAfter}/10</strong>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moodAfter}
              onChange={e => setMoodAfter(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Reflection Notes (Optional thoughts or insights)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Heart rate slowed noticeably; ready to begin coding sprint..."
            value={journalNotes}
            onChange={e => setJournalNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSaveReflection} className="btn btn-teal">
            <CheckCircle size={16} />
            <span>Save Reflection to History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
