import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Compass, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Bot
} from 'lucide-react';
import { spokenGuideService, GUIDE_SCRIPTS, type SpokenPlaybackState } from '../../engine/spokenGuideService';
import { useApp } from '../../context/AppContext';

interface SpokenGuideBarProps {
  onStartTour?: () => void;
}

export const SpokenGuideBar: React.FC<SpokenGuideBarProps> = ({ onStartTour }) => {
  const { activeTab, soundEnabled } = useApp();
  const [playbackState, setPlaybackState] = useState<SpokenPlaybackState>('idle');
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = spokenGuideService.subscribe({
      onStateChange: (state) => setPlaybackState(state),
      onSentence: (sentence) => setCurrentCaption(sentence),
      onEnd: () => setPlaybackState('idle'),
    });
    return () => unsubscribe();
  }, []);

  const getContextScript = (): string => {
    switch (activeTab) {
      case 'games':
      case 'memory':
        return GUIDE_SCRIPTS.gamesCenter;
      case 'library':
      case 'smritiveda':
        return GUIDE_SCRIPTS.library;
      case 'meditation':
      case 'mindfulness':
        return GUIDE_SCRIPTS.meditation;
      case 'progress':
      case 'patterns':
        return GUIDE_SCRIPTS.progress;
      case 'dashboard':
      default:
        return GUIDE_SCRIPTS.dashboard;
    }
  };

  const handlePlayContextGuide = () => {
    const script = getContextScript();
    spokenGuideService.speak(script);
  };

  const handlePauseResume = () => {
    if (playbackState === 'speaking') {
      spokenGuideService.pause();
    } else if (playbackState === 'paused') {
      spokenGuideService.resume();
    } else {
      handlePlayContextGuide();
    }
  };

  const handleStop = () => {
    spokenGuideService.stop();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    spokenGuideService.setMuted(nextMuted);
  };

  return (
    <aside
      aria-label="Spoken AI Guide Controls"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        zIndex: 90,
        maxWidth: isMinimized ? '280px' : '480px',
        width: 'calc(100% - 48px)',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 12px 32px rgba(40, 84, 67, 0.16), 0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1.5px solid var(--primary-light)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: playbackState === 'speaking' ? 'var(--primary-subtle)' : '#FAFAF9',
        borderBottom: isMinimized ? 'none' : '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Spoken AI Guide</span>
              {playbackState === 'speaking' && (
                <span className="badge badge-teal" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Speaking</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Launch interactive platform tour"
            >
              <Compass size={13} />
              <span>Tour</span>
            </button>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
            title={isMinimized ? 'Expand Guide' : 'Minimize Guide'}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Content: Captions & Controls */}
      {!isMinimized && (
        <div style={{ padding: '12px 14px' }}>
          {/* Subtitle / Live Captions box */}
          <div
            style={{
              minHeight: '44px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#F9F8F5',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              lineHeight: 1.45,
              color: currentCaption ? 'var(--text-main)' : 'var(--text-muted)',
              fontStyle: currentCaption ? 'normal' : 'italic',
              marginBottom: '10px'
            }}
            aria-live="polite"
          >
            {currentCaption || 'Click "Guide this Screen" to hear spoken instructions and insights.'}
          </div>

          {/* Action Button Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={playbackState === 'speaking' || playbackState === 'paused' ? handlePauseResume : handlePlayContextGuide}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
                title={playbackState === 'speaking' ? 'Pause speech' : 'Play spoken guide for this section'}
              >
                {playbackState === 'speaking' ? <Pause size={13} /> : <Play size={13} />}
                <span>{playbackState === 'speaking' ? 'Pause' : playbackState === 'paused' ? 'Resume' : 'Guide this Screen'}</span>
              </button>

              {(playbackState === 'speaking' || playbackState === 'paused') && (
                <button
                  onClick={handleStop}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                  title="Stop audio playback"
                >
                  <Square size={12} />
                  <span>Stop</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={toggleMute}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isMuted ? '#DC2626' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={isMuted ? 'Unmute voice guide' : 'Mute voice guide'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
