import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Heart,
  Volume2,
  VolumeX,
  AlertCircle,
  Eye,
  ShieldCheck,
  Compass,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { audioService } from '../../engine/audioService';

export interface MeditationProcedure {
  id: string;
  name: string;
  category: 'breathing' | 'guided' | 'silent';
  recommendedMinutes: number;
  whatItIs: string;
  howToPerform: string;
  steps: string[];
  phases?: { name: string; duration: number }[];
}

export const PROCEDURES: MeditationProcedure[] = [
  {
    id: 'box_breathing',
    name: 'Box Breathing (4-4-4-4)',
    category: 'breathing',
    recommendedMinutes: 4,
    whatItIs: 'A structured, equal-ratio breathing technique that balances the autonomic nervous system and lowers acute stress.',
    howToPerform: 'Inhale through the nose for 4 seconds, gently hold full for 4, exhale smoothly through the mouth for 4, and hold empty for 4.',
    steps: [
      'Sit comfortably with your spine upright and shoulders released.',
      'Inhale slowly through your nose filling your lower lungs (4s).',
      'Hold the breath without straining or locking your throat (4s).',
      'Release the breath smoothly and completely through your lips (4s).',
      'Rest comfortably in the empty pause before the next breath (4s).'
    ],
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold Empty', duration: 4 },
    ]
  },
  {
    id: 'slow_breathing',
    name: 'Slow Balanced Breathing (5s-5s)',
    category: 'breathing',
    recommendedMinutes: 5,
    whatItIs: 'Resonant frequency breathing (~6 breaths/minute) that synchronizes heart rate variability (HRV) with respiration.',
    howToPerform: 'Breathe in slowly and smoothly for 5 seconds, then breathe out with equal length for 5 seconds without holding.',
    steps: [
      'Rest your hands loosely on your abdomen.',
      'Inhale gently through the nose, feeling the belly expand outward (5s).',
      'Without pausing, exhale softly through the nose, feeling the belly settle (5s).',
      'Maintain an unbroken, wave-like cadence.'
    ],
    phases: [
      { name: 'Inhale Smoothly', duration: 5 },
      { name: 'Exhale Smoothly', duration: 5 }
    ]
  },
  {
    id: 'gentle_calm',
    name: 'Gentle Mindful Breathing (4s In, 6s Out)',
    category: 'breathing',
    recommendedMinutes: 3,
    whatItIs: 'An extended-exhale practice that gently stimulates the vagus nerve and promotes physical relaxation.',
    howToPerform: 'Take a soft 4-second inhalation followed by a prolonged, unhurried 6-second exhalation.',
    steps: [
      'Settle your gaze softly or close your eyes.',
      'Inhale through the nose with ease (4s).',
      'Allow the exhale to be longer and twice as quiet as the inhale (6s).',
      'Notice the release of muscular tension in the jaw and neck with each exhale.'
    ],
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale Slowly', duration: 6 }
    ]
  },
  {
    id: 'body_scan',
    name: 'Full Body Scan Meditation',
    category: 'guided',
    recommendedMinutes: 7,
    whatItIs: 'A progressive somatic attention practice that systematically releases accumulated physical tension.',
    howToPerform: 'Move non-judgmental attention gradually from the crown of your head down to the soles of your feet.',
    steps: [
      'Begin by noticing sensations at the crown of your head and forehead. Soften the brow.',
      'Bring attention to the jaw, neck, and throat. Allow the tongue to drop away from the roof of the mouth.',
      'Shift awareness down through the shoulders, arms, and fingertips. Release any gripping.',
      'Feel the rise and fall of the chest and abdomen with the breath.',
      'Scan down through the hips, thighs, knees, and into the soles of your feet resting against the earth.'
    ]
  },
  {
    id: 'focused_attention',
    name: 'Focused Single-Point Attention',
    category: 'guided',
    recommendedMinutes: 5,
    whatItIs: 'Classical Shamatha meditation cultivating stable attentional concentration using the breath as an anchor.',
    howToPerform: 'Anchor attention at the rim of the nostrils. Whenever the mind wanders, gently return without judgment.',
    steps: [
      'Choose your sensory anchor: the coolness of air entering the nostrils.',
      'Observe each inhalation and exhalation from start to finish.',
      'When thoughts, memories, or sounds arise, notice them without criticism.',
      'Gently and patiently escort attention back to the anchor point.'
    ]
  },
  {
    id: 'loving_kindness',
    name: 'Loving-Kindness Meditation (Metta)',
    category: 'guided',
    recommendedMinutes: 6,
    whatItIs: 'Heart-centered meditation generating unconditional goodwill, patience, and compassion for self and others.',
    howToPerform: 'Silently repeat benevolent phrases sequentially toward yourself, a benefactor, a neutral person, and all beings.',
    steps: [
      'Toward yourself: "May I be safe, healthy, peaceful, and live with ease."',
      'Toward a benefactor or loved one: "May you be safe, healthy, peaceful, and live with ease."',
      'Toward a neutral stranger you encountered: "May you be safe and free from suffering."',
      'Toward all beings everywhere without distinction: "May all beings be well and at peace."'
    ]
  },
  {
    id: 'grounding_54321',
    name: 'Grounding Practice (5-4-3-2-1 Sensory Reset)',
    category: 'guided',
    recommendedMinutes: 3,
    whatItIs: 'An evidence-based sensory orientation exercise to interrupt rumination and anchor presence in the physical environment.',
    howToPerform: 'Engage your five senses sequentially to ground yourself in the immediate present moment.',
    steps: [
      'Acknowledge 5 things you can see around you right now.',
      'Acknowledge 4 things you can physically feel (feet on floor, clothes on shoulders).',
      'Acknowledge 3 distinct sounds you can hear in the distance or nearby.',
      'Acknowledge 2 scents you can smell or neutral clean air.',
      'Acknowledge 1 thing you can taste or the sensation of taking a mindful sip of water.'
    ]
  },
  {
    id: 'silent_meditation',
    name: 'Silent Contemplation Meditation',
    category: 'silent',
    recommendedMinutes: 10,
    whatItIs: 'Unstructured, restful awareness sitting in stillness with subtle opening and closing chimes.',
    howToPerform: 'Rest in pure awareness without attempting to manipulate thoughts, breath, or posture.',
    steps: [
      'Sit comfortably and let your hands rest gently in your lap.',
      'Allow sounds and thoughts to come and go like clouds across an open sky.',
      'Remain seated until the final temple bell sounds.'
    ]
  }
];

export const MindfulnessView: React.FC = () => {
  const { recordMindfulnessSession, soundEnabled, setSoundEnabled, celebrationsEnabled } = useApp();

  const [selectedId, setSelectedId] = useState<string>('box_breathing');
  const [durationMinutes, setDurationMinutes] = useState<number>(4);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Breathing state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);

  const activeProcedure = PROCEDURES.find(p => p.id === selectedId) || PROCEDURES[0];
  const isBreathing = activeProcedure.category === 'breathing' && activeProcedure.phases;

  // Handle technique selection
  const handleSelectProcedure = (proc: MeditationProcedure) => {
    setIsActive(false);
    setSelectedId(proc.id);
    setDurationMinutes(proc.recommendedMinutes);
    setSecondsRemaining(proc.recommendedMinutes * 60);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(proc.phases ? proc.phases[0].duration : 4);
    setSessionCompleted(false);
  };

  // Main countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      setIsActive(false);
      setSessionCompleted(true);
      recordMindfulnessSession({
        date: new Date().toISOString().split('T')[0],
        type: activeProcedure.category === 'breathing' ? 'breathing' : 'meditation',
        durationSeconds: durationMinutes * 60,
        technique: activeProcedure.id as any
      });
      if (soundEnabled) {
        audioService.playTempleBell(1.0, 0.4);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, secondsRemaining, durationMinutes, activeProcedure, soundEnabled]);

  // Synchronized breathing runner with precise inhale/exhale sound cues
  useEffect(() => {
    let phaseTimer: any = null;
    if (isActive && isBreathing && activeProcedure.phases) {
      phaseTimer = setInterval(() => {
        setPhaseSecondsLeft(prev => {
          if (prev <= 1) {
            const nextIdx = (currentPhaseIndex + 1) % activeProcedure.phases!.length;
            setCurrentPhaseIndex(nextIdx);
            const nextPhase = activeProcedure.phases![nextIdx];

            // Trigger synchronized cue tone based on next phase
            if (soundEnabled) {
              if (nextPhase.name.toLowerCase().includes('inhale')) {
                audioService.playInhaleCue();
              } else if (nextPhase.name.toLowerCase().includes('exhale')) {
                audioService.playExhaleCue();
              } else {
                audioService.playHoldCue();
              }
            }
            return nextPhase.duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(phaseTimer);
  }, [isActive, isBreathing, currentPhaseIndex, activeProcedure, soundEnabled]);

  const handleStart = () => {
    setIsActive(true);
    setSessionCompleted(false);
    if (soundEnabled) {
      audioService.playStartChime();
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(durationMinutes * 60);
    setCurrentPhaseIndex(0);
    if (activeProcedure.phases) {
      setPhaseSecondsLeft(activeProcedure.phases[0].duration);
    }
    setSessionCompleted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const currentPhase = isBreathing && activeProcedure.phases ? activeProcedure.phases[currentPhaseIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Overview & Mute Control */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Respiratory Regulation</span>
              <span className="badge badge-teal">8 Guided Disciplines</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Meditation & Guided Breathwork
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '640px', marginTop: '4px' }}>
              Gentle, deliberate techniques to regulate nervous tone, deepen presence, and release physical tension.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-secondary btn-sm"
              title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
              data-testid="meditation-mute-btn"
            >
              {soundEnabled ? <Volume2 size={15} color="var(--primary)" /> : <VolumeX size={15} color="var(--text-muted)" />}
              <span>{soundEnabled ? 'Audio Cues: Active' : 'Silent Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Session Player */}
      <div className="clean-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-teal)', letterSpacing: '0.06em', marginBottom: '4px' }}>
            {activeProcedure.category.toUpperCase()} • {durationMinutes} MINUTES
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            {activeProcedure.name}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {activeProcedure.howToPerform}
          </p>

          {/* Visual Breathing Circle / Focus Anchor */}
          <div style={{
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: '20px 0'
          }}>
            {isBreathing && currentPhase ? (
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: currentPhase.name.toLowerCase().includes('inhale')
                    ? 'radial-gradient(circle, var(--primary-subtle) 0%, rgba(40, 84, 67, 0.15) 100%)'
                    : 'radial-gradient(circle, var(--accent-teal-subtle) 0%, rgba(30, 112, 101, 0.12) 100%)',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: `transform ${currentPhase.duration}s ease-in-out`,
                  transform: currentPhase.name.toLowerCase().includes('inhale') ? 'scale(1.15)' : 'scale(0.85)'
                }}
              >
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {currentPhase.name}
                </div>
                <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                  {phaseSecondsLeft}s
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '170px',
                  height: '170px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Focus Anchor</div>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatTime(secondsRemaining)}
                </div>
              </div>
            )}
          </div>

          {/* Time Remaining Bar */}
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px' }}>
            Session Time Remaining: <span className="font-mono">{formatTime(secondsRemaining)}</span>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {isActive ? (
              <button onClick={handlePause} className="btn btn-secondary">
                <Pause size={16} />
                <span>Pause</span>
              </button>
            ) : (
              <button onClick={handleStart} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <Play size={16} fill="currentColor" />
                <span>{secondsRemaining < durationMinutes * 60 ? 'Resume' : 'Begin Practice'}</span>
              </button>
            )}

            <button onClick={handleReset} className="btn btn-secondary">
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Session Completed Confirmation */}
          {sessionCompleted && (
            <div style={{
              marginTop: '20px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid rgba(40, 84, 67, 0.25)',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}>
              ✓ Session recorded successfully. Practice points awarded!
            </div>
          )}

          {/* Safe Instructions Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginTop: '24px'
          }}>
            <AlertCircle size={14} />
            <span>If you feel lightheaded at any point, gently return to natural breathing and pause the exercise.</span>
          </div>
        </div>
      </div>

      {/* 3. Technique Library (8 Procedures with Detailed Procedures) */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
          Select Guided Procedure
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {PROCEDURES.map(proc => {
            const isSelected = proc.id === selectedId;
            return (
              <div
                key={proc.id}
                onClick={() => handleSelectProcedure(proc)}
                className="clean-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-sage">
                    {proc.category.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{proc.recommendedMinutes}m</span>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', marginBottom: '4px' }}>
                  {proc.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
                  {proc.whatItIs}
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isSelected ? 'Currently Selected' : 'Select Procedure'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
