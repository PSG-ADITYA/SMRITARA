import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Award, 
  Flame, 
  Plus, 
  Eye, 
  EyeOff, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { CULTURAL_LIBRARY } from '../../data/culturalContent';
import type { CulturalItem } from '../../types';
import { useAudioService } from '../../hooks/useAudioService';

export const ChantingStudioView: React.FC<{ initialItem?: CulturalItem }> = ({ initialItem }) => {
  const { recordChantingSession, user, soundEnabled, setSoundEnabled, speechRate, celebrationsEnabled } = useApp();
  const { 
    speak, 
    pause, 
    resume, 
    stop, 
    playTempleBell, 
    playbackState, 
    activeId,
    currentLineIndex 
  } = useAudioService();

  const [selectedChant, setSelectedChant] = useState<CulturalItem>(
    initialItem || CULTURAL_LIBRARY.find(c => c.category === 'mantra' || c.category === 'shloka') || CULTURAL_LIBRARY[0]
  );

  const [targetLoops, setTargetLoops] = useState<number>(9);
  const [currentLoops, setCurrentLoops] = useState<number>(0);
  const [mode, setMode] = useState<'listen' | 'repeat' | 'recall' | 'silent'>('repeat');
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | 'all'>('all');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [maskText, setMaskText] = useState<boolean>(false);

  const lines = selectedChant.originalText.split('\n').filter(Boolean);

  useEffect(() => {
    if (initialItem) {
      setSelectedChant(initialItem);
      handleReset();
    }
  }, [initialItem]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const handleIncrementLoop = () => {
    setCurrentLoops(prev => {
      const next = prev + 1;
      if (soundEnabled) {
        playTempleBell(1.0 + (next % 7) * 0.05);
      }
      if (next >= targetLoops && !isCompleted) {
        handleCompleteSession(next);
      }
      return next;
    });
  };

  const handleCompleteSession = (finalLoops: number) => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setIsCompleted(true);
    if (celebrationsEnabled) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    if (soundEnabled) {
      playTempleBell(0.9, 0.45);
    }

    recordChantingSession({
      date: new Date().toISOString().split('T')[0],
      chantId: selectedChant.id,
      chantTitle: selectedChant.title,
      language: selectedChant.language,
      repetitionsCompleted: finalLoops,
      targetRepetitions: targetLoops,
      mode,
      durationSeconds: Math.max(elapsed, 30)
    });
  };

  const isCurrentChantPlaying = activeId === selectedChant.id && playbackState === 'playing';
  const isCurrentChantPaused = activeId === selectedChant.id && playbackState === 'paused';

  const handlePlayRecitation = () => {
    if (isCurrentChantPlaying) {
      pause();
    } else if (isCurrentChantPaused) {
      resume();
    } else {
      const textToSpeak = selectedChunkIndex === 'all' 
        ? selectedChant.originalText 
        : lines[selectedChunkIndex] || selectedChant.originalText;

      speak(textToSpeak, { 
        id: selectedChant.id, 
        language: selectedChant.language,
        rate: speechRate || 0.85
      });
    }
  };

  const handleStopRecitation = () => {
    stop();
  };

  const handlePracticeChunk = (idx: number) => {
    setSelectedChunkIndex(idx);
    const line = lines[idx];
    if (line) {
      speak(line, {
        id: selectedChant.id,
        language: selectedChant.language,
        rate: speechRate || 0.85
      });
    }
  };

  const handleReset = () => {
    stop();
    setCurrentLoops(0);
    setIsCompleted(false);
    setSelectedChunkIndex('all');
    setStartTime(Date.now());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Overview & Chime Toggle */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Smriti Veda</span>
              <span className="badge badge-teal">Chanting & Line Mastery</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Interactive Chanting Studio
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '640px', marginTop: '4px' }}>
              Master sacred verses and moral poetry through deliberate repetition, chunk practice, and harmonic bells.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-secondary btn-sm"
              title={soundEnabled ? 'Mute bell sound' : 'Enable bell chime'}
              data-testid="temple-bell-toggle"
            >
              {soundEnabled ? <Volume2 size={15} color="var(--primary)" /> : <VolumeX size={15} color="var(--text-muted)" />}
              <span>{soundEnabled ? 'Temple Bell: Active' : 'Bell: Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Chanting Console */}
      <div className="clean-card" style={{ padding: '32px 36px', background: '#FFFFFF' }}>
        {/* Chant Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
          {CULTURAL_LIBRARY.filter(c => c.category === 'mantra' || c.category === 'shloka' || c.category === 'poem').map(item => (
            <button
              key={item.id}
              onClick={() => { setSelectedChant(item); handleReset(); }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${selectedChant.id === item.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: selectedChant.id === item.id ? 'var(--primary-subtle)' : '#FFFFFF',
                color: selectedChant.id === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {item.title.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Chant Details */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-sage" style={{ textTransform: 'capitalize' }}>{selectedChant.language}</span>
            <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>{selectedChant.category}</span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            {selectedChant.title}
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Source: {selectedChant.source}
          </div>
        </div>

        {/* Chunk Practice Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          background: 'var(--bg-secondary)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={14} />
            <span>Practice Chunk:</span>
          </span>
          <button
            onClick={() => setSelectedChunkIndex('all')}
            className={`btn ${selectedChunkIndex === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="chunk-btn-all"
          >
            Full Verse
          </button>
          {lines.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePracticeChunk(idx)}
              className={`btn ${selectedChunkIndex === idx ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              data-testid={`chunk-btn-line-${idx}`}
            >
              Line {idx + 1}
            </button>
          ))}
        </div>

        {/* Original Script Box */}
        <div style={{
          background: 'var(--bg-card-inner)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '1.25rem',
          lineHeight: 1.9,
          fontWeight: 600,
          fontFamily: 'serif',
          color: 'var(--text-main)',
          marginBottom: '24px'
        }}>
          {maskText ? (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '20px 0' }}>
              [Text hidden for pure recall practice. Tap "Show Text" to reveal.]
            </div>
          ) : (
            lines.map((line, idx) => {
              const isSelectedChunk = selectedChunkIndex === idx;
              const isSpeakingLine = isCurrentChantPlaying && idx === currentLineIndex;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: isSpeakingLine 
                      ? 'var(--primary-subtle)' 
                      : isSelectedChunk 
                      ? 'rgba(30, 112, 101, 0.12)' 
                      : 'transparent',
                    color: isSpeakingLine 
                      ? 'var(--primary)' 
                      : isSelectedChunk 
                      ? 'var(--accent-teal)' 
                      : 'var(--text-main)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {line}
                </div>
              );
            })
          )}
        </div>

        {/* Transliteration & Meaning */}
        {!maskText && (
          <div style={{ textAlign: 'center', marginBottom: '28px', maxWidth: '640px', margin: '0 auto 28px' }}>
            {selectedChant.transliteration && (
              <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {selectedChant.transliteration}
              </div>
            )}
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedChant.meaning}
            </div>
          </div>
        )}

        {/* Recitation and Mask Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlayRecitation}
            className={`btn ${isCurrentChantPlaying ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '9px 20px' }}
          >
            {isCurrentChantPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
            <span>{isCurrentChantPlaying ? 'Pause Recitation' : 'Play Recitation'}</span>
          </button>

          {isCurrentChantPlaying && (
            <button onClick={handleStopRecitation} className="btn btn-secondary">
              <Square size={14} />
              <span>Stop</span>
            </button>
          )}

          <button
            onClick={() => setMaskText(!maskText)}
            className="btn btn-secondary"
            title={maskText ? 'Reveal text' : 'Hide text for recall practice'}
          >
            {maskText ? <Eye size={15} /> : <EyeOff size={15} />}
            <span>{maskText ? 'Show Text' : 'Hide for Recall'}</span>
          </button>
        </div>

        {/* Repetition Target & Counter Display */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center' }}>Target:</span>
            {[9, 21, 108].map(target => (
              <button
                key={target}
                onClick={() => { setTargetLoops(target); setCurrentLoops(0); setIsCompleted(false); }}
                style={{
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${targetLoops === target ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: targetLoops === target ? 'var(--primary)' : '#FFFFFF',
                  color: targetLoops === target ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {target} Repetitions
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Completed Repetitions
            </div>
            <div className="font-mono" style={{ fontSize: '2.8rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.1 }}>
              {currentLoops} / {targetLoops}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={handleIncrementLoop}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 700 }}
              data-testid="loop-increment-btn"
            >
              <Plus size={18} />
              <span>+1 Repetition Completed</span>
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {isCompleted && (
            <div style={{
              marginTop: '18px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid rgba(40, 84, 67, 0.25)',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}>
              ✓ Complete! All {targetLoops} repetitions recorded. Practice points awarded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
