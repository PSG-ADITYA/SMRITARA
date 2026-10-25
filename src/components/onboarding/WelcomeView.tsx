import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Brain, 
  BookOpen, 
  Wind, 
  Target,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from './AuthModal';
import { SmritaraBrand } from '../common/SmritaraBrand';

export const WelcomeView: React.FC = () => {
  const { enterDemoMode } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Top Studio Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 36px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <SmritaraBrand variant="full" size="md" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setAuthMode('signin')}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Hero & Introduction */}
      <main style={{
        flex: 1,
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '48px 24px 72px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Subtle pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--primary-subtle)',
          border: '1px solid rgba(40, 84, 67, 0.2)',
          padding: '5px 14px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: '20px'
        }}>
          <Sparkles size={14} color="var(--accent-amber)" />
          <span>Personal Growth & Cognitive Discipline Platform</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: '18px',
          maxWidth: '820px',
          color: 'var(--text-main)'
        }}>
          Intentional Practice for Memory, Mindful Routine, and Clarity.
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: 1.6,
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          SMRITARA integrates daily practice schedules, working-memory drills, Sanskrit and classical literature recitation, and guided breath regulation into one calm, private space.
        </p>

        {/* Primary & Secondary Actions */}
        <div style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '56px'
        }}>
          <button
            onClick={() => setAuthMode('signup')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={enterDemoMode}
            className="btn btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            <Compass size={17} color="var(--primary)" />
            <span>Explore Demo</span>
          </button>
        </div>

        {/* Clean Dashboard & Practice Preview Card */}
        <div style={{
          width: '100%',
          maxWidth: '880px',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px 32px',
          marginBottom: '64px',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Today's Daily Practice Preview
              </div>
              <h3 style={{ fontSize: '1.25rem', marginTop: '2px', color: 'var(--text-main)' }}>
                7-Minute Midday Calibration
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-sage">5 Min</span>
              <span className="badge badge-teal" style={{ border: '2px solid var(--accent-teal)' }}>7 Min</span>
              <span className="badge badge-sage">10 Min</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            <div style={{
              background: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '4px' }}>
                STEP 1 • 3 MIN
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                Box Breathing Reset
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Synchronized 4-4-4-4 rhythm with gentle audio cues to stabilize nervous tone.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                STEP 2 • 2 MIN
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                Sequence Recall Drill
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Progressive chime sequences training short-term auditory and visual encoding.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-terracotta)', marginBottom: '4px' }}>
                STEP 3 • 2 MIN
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                Stoic Passage Reflection
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Marcus Aurelius' Inner Citadel with clear audible recitation and verse recall.
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div style={{ width: '100%', marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Four Core Disciplines in One Space</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
              Designed to be flexible: practice what you need today rather than feeling pressured to complete exhaustive lists.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            textAlign: 'left'
          }}>
            <div className="clean-card" style={{ padding: '22px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '14px'
              }}>
                <Target size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Practice Routine</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Circadian schedule alignment, self-reported daily check-ins, and focused sprint timers without false claims of device control.
              </p>
            </div>

            <div className="clean-card" style={{ padding: '22px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--accent-teal-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-teal)',
                marginBottom: '14px'
              }}>
                <Brain size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Cognitive Games</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Auditory sequence chimes, spatial matrix patterns, passage memory, and object recall drills with factual progression comparisons.
              </p>
            </div>

            <div className="clean-card" style={{ padding: '22px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--accent-amber-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)',
                marginBottom: '14px'
              }}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Cultural Library & Chanting</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                English philosophy, Sanskrit shlokas, and regional poetry with honest audio playback, speed pacing, and line-by-line practice.
              </p>
            </div>

            <div className="clean-card" style={{ padding: '22px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--accent-terracotta-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-terracotta)',
                marginBottom: '14px'
              }}>
                <Wind size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Meditation Studio</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                8 guided breathing and mindfulness techniques with synchronized cues, full mute controls, and complete visual alternatives.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Privacy & Medical Disclaimer */}
        <div style={{
          width: '100%',
          maxWidth: '820px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          textAlign: 'left'
        }}>
          <Lock size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px' }}>
              Private, Grounded & Transparent
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your progress and reflections are saved locally on this device. SMRITARA is designed for personal self-cultivation, routine consistency, and cognitive exercise. It does not provide medical diagnosis, clinical sleep therapy, or psychological treatment.
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </div>
  );
};
