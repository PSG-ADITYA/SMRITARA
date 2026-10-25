import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Play,
  RotateCcw
} from 'lucide-react';
import { spokenGuideService } from '../../engine/spokenGuideService';

interface TourStep {
  title: string;
  badge: string;
  script: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Personal Command Center & Circadian Timing',
    badge: 'Step 1 of 5',
    script: 'Welcome to your Command Center. Here, SMRITARA tracks your circadian energy balance, sleep calibration, and rotating wisdom. Log your daily check-in each morning to earn practice points.',
    highlights: [
      'Check in daily with sleep hours and constructive habits',
      'Track real practice points earned from verified exercises',
      'Inspect your chronotype schedule tailored to your biology'
    ]
  },
  {
    title: 'Daily Practice Routine & Focus Blocks',
    badge: 'Step 2 of 5',
    script: 'The Practice section organizes your daytime rhythm into morning calibration, focused 25-minute deep work intervals, and evening wind-down rituals.',
    highlights: [
      'Chronotype-optimized schedule blocks',
      'Distraction-free deep work timer with session points',
      'Habit streak reinforcement without false metrics'
    ]
  },
  {
    title: 'Cognitive Games Centre',
    badge: 'Step 3 of 5',
    script: 'In the Cognitive Games Centre, exercise your neuroplastic working memory with Fruit Memory Path, Memory Melody, Pattern Memory, and 3D Dice Memory. Every round is procedurally generated with adaptive difficulty.',
    highlights: [
      'Fruit Memory Path: Sequential visual memory and distractor filtering',
      'Memory Melody: Web Audio pitch recall with synthetic tone feedback',
      'Pattern Memory: Sacred geometry reconstruction with mistake diagnostics',
      '3D Dice Memory: Perspective inspection with accessible 2D toggle'
    ]
  },
  {
    title: 'Cultural Library & Chanting Studio',
    badge: 'Step 4 of 5',
    script: 'Access ancient wisdom from Thirukkural, the Katha Upanishad, and Stoic philosophy. Practice rhythm-paced recitation with adjustable speech speed and text synchronization.',
    highlights: [
      'Classical verses translated with philosophical commentary',
      'Recitation studio with adjustable pacing and speech readout',
      'Personal favorites saved securely to your profile'
    ]
  },
  {
    title: 'AI Life Coach & Weekly Progress Reports',
    badge: 'Step 5 of 5',
    script: 'Your private AI Life Coach answers questions using your actual stored logs. Every Sunday, generate your factual weekly progress report and send it directly to your Gmail inbox in one click.',
    highlights: [
      'Grounded advice based on your verified performance data',
      'Voice input and speech output with full privacy',
      '1-Click Gmail report dispatch and automated SMTP delivery'
    ]
  }
];

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);

  const step = TOUR_STEPS[currentStepIdx];

  // Speak step description when step changes
  useEffect(() => {
    if (isOpen && isVoiceActive) {
      spokenGuideService.speak(step.script);
    }
    return () => {
      spokenGuideService.stop();
    };
  }, [isOpen, currentStepIdx, isVoiceActive]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReplay = () => {
    spokenGuideService.speak(step.script);
  };

  const handleComplete = () => {
    spokenGuideService.stop();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.68)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '32px',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.24)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          title="Exit Tour"
        >
          <X size={20} />
        </button>

        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span className="badge badge-teal" style={{ fontSize: '0.78rem' }}>{step.badge}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleReplay}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Replay spoken voice for this step"
            >
              <RotateCcw size={12} />
              <span>Replay Audio</span>
            </button>
            <button
              onClick={() => {
                const next = !isVoiceActive;
                setIsVoiceActive(next);
                if (!next) spokenGuideService.stop();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isVoiceActive ? 'var(--primary)' : 'var(--text-muted)'
              }}
              title={isVoiceActive ? 'Mute voice guide' : 'Unmute voice guide'}
            >
              {isVoiceActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
          {step.title}
        </h3>

        {/* Script Quote */}
        <div style={{
          padding: '14px 18px',
          background: '#F9F8F5',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '4px solid var(--primary)',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginBottom: '20px'
        }}>
          "{step.script}"
        </div>

        {/* Highlights List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {step.highlights.map((h, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--text-main)' }}>{h}</span>
            </div>
          ))}
        </div>

        {/* Stepper Dots & Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStepIdx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentStepIdx ? 'var(--primary)' : 'var(--border-subtle)',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 18px' }}
            >
              <span>{currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
