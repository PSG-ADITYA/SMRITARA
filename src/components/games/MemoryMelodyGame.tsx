import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  Music,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateMelodyRound, 
  validateMelodyStep, 
  calculateMelodyScore, 
  melodySynth, 
  getTempoTiming,
  type MelodyRound, 
  type GameDifficulty, 
  type TempoSetting,
  type MusicalNoteDef
} from '../../engine/games/melodyEngine';
import { spokenGuideService, GUIDE_SCRIPTS } from '../../engine/spokenGuideService';

interface MemoryMelodyGameProps {
  difficulty?: GameDifficulty;
  onSessionComplete?: (metrics: {
    gameType: string;
    difficulty: GameDifficulty;
    score: number;
    accuracy: number;
    durationSeconds: number;
    points: number;
  }) => void;
  onComplete?: (result: {
    gameId: string;
    gameTitle: string;
    score: number;
    accuracy: number;
    difficulty: GameDifficulty;
    durationSeconds: number;
    details: string;
  }) => void;
  onExit?: () => void;
}

export const MemoryMelodyGame: React.FC<MemoryMelodyGameProps> = ({
  difficulty = 'medium',
  onSessionComplete,
  onComplete,
  onExit,
}) => {
  const [tempo, setTempo] = useState<TempoSetting>('moderate');
  const [round, setRound] = useState<MelodyRound>(() => generateMelodyRound(difficulty, tempo));
  const [gameState, setGameState] = useState<'intro' | 'listening' | 'recall' | 'result'>('intro');
  const [activeFlashingNoteId, setActiveFlashingNoteId] = useState<string | null>(null);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [replaysUsed, setReplaysUsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<{ score: number; accuracy: number; points: number } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(melodySynth.isSoundMuted());

  useEffect(() => {
    return () => {
      spokenGuideService.stop();
    };
  }, []);

  // Play the melody sequence
  const playSequencePlayback = async () => {
    spokenGuideService.stop();
    setGameState('listening');
    setActiveFlashingNoteId(null);
    const timing = getTempoTiming(tempo);

    await melodySynth.playSequence(
      round.sequence,
      { durationMs: timing.durationMs, pauseMs: timing.pauseMs },
      (note) => {
        setActiveFlashingNoteId(note.id);
        setTimeout(() => setActiveFlashingNoteId(null), timing.durationMs);
      }
    );

    setActiveFlashingNoteId(null);
    setGameState('recall');
    if (startTime === 0) setStartTime(Date.now());
  };

  const handleStartGame = () => {
    spokenGuideService.stop();
    setUserSequence([]);
    setFinalScore(null);
    playSequencePlayback();
  };

  const handleReplayMelody = () => {
    if (gameState !== 'recall') return;
    spokenGuideService.stop();
    setReplaysUsed(prev => prev + 1);
    playSequencePlayback();
  };

  const handleNotePadClick = (note: MusicalNoteDef) => {
    if (gameState !== 'recall') return;

    // Synthesize tone on tap
    melodySynth.playTone(note.frequency, 300);
    setActiveFlashingNoteId(note.id);
    setTimeout(() => setActiveFlashingNoteId(null), 250);

    const nextUserSeq = [...userSequence, note.id];
    setUserSequence(nextUserSeq);

    const validation = validateMelodyStep(round, userSequence, note.id);

    if (!validation.isCorrect) {
      handleRoundFinish(userSequence.length, false);
      return;
    }

    if (validation.isComplete) {
      handleRoundFinish(nextUserSeq.length, true);
    }
  };

  const handleRoundFinish = (correctNotes: number, isWin: boolean) => {
    const elapsed = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
    const scoreData = calculateMelodyScore(round, correctNotes, replaysUsed, elapsed);
    setFinalScore(scoreData);
    setGameState('result');

    if (isWin && scoreData.accuracy >= 70) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }

    onSessionComplete?.({
      gameType: 'memory_melody',
      difficulty: round.difficulty,
      score: scoreData.score,
      accuracy: scoreData.accuracy,
      durationSeconds: elapsed,
      points: scoreData.points,
    });

    onComplete?.({
      gameId: 'memory-melody',
      gameTitle: 'Memory Melody',
      score: scoreData.score,
      accuracy: scoreData.accuracy,
      difficulty: round.difficulty,
      durationSeconds: elapsed,
      details: `Reproduced ${correctNotes}/${round.sequence.length} musical notes at ${round.tempoBpm} BPM (Score: ${scoreData.score})`,
    });
  };

  const handlePlayAgain = () => {
    const newRound = generateMelodyRound(difficulty, tempo);
    setRound(newRound);
    setUserSequence([]);
    setReplaysUsed(0);
    setFinalScore(null);
    setStartTime(Date.now());
    playSequencePlayback();
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    melodySynth.setMuted(next);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <div className="clean-card" style={{ padding: '36px 28px', background: '#FFFFFF' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            border: '2px solid #6366F1'
          }}>
            <Music size={32} color="#4F46E5" />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Memory Melody
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px auto' }}>
            Auditory working memory training using pure synthetic musical tones. Listen attentively to the melody sequence, then reproduce each note on the interactive pads.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-muted)' }}>Playback Tempo:</span>
            {(['slow', 'moderate', 'brisk'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTempo(t);
                  setRound(generateMelodyRound(difficulty, t));
                }}
                className={`btn btn-sm ${tempo === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', fontSize: '0.78rem', padding: '4px 12px' }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            padding: '8px 14px',
            background: '#F9F8F5',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-block',
            marginBottom: '28px'
          }}>
            ℹ️ Sound tones are synthesized locally in real-time via Web Audio API.
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                if (spokenGuideService.getState() === 'speaking') {
                  spokenGuideService.stop();
                } else {
                  spokenGuideService.speak(GUIDE_SCRIPTS.melody);
                }
              }}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Toggle spoken rules"
            >
              <Volume2 size={16} />
              <span>Spoken Guide</span>
            </button>
            <button
              onClick={handleStartGame}
              className="btn btn-primary"
              style={{ padding: '10px 32px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={18} />
              <span>Play Melody</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE GAMEPLAY */}
      {(gameState === 'listening' || gameState === 'recall') && (
        <div className="clean-card" style={{ padding: '28px 24px', background: '#FFFFFF' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal" style={{ textTransform: 'uppercase' }}>{round.difficulty}</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {gameState === 'listening' ? 'Listening carefully...' : `Input: ${userSequence.length} / ${round.sequence.length}`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {gameState === 'recall' && (
                <button
                  onClick={handleReplayMelody}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Replay the melody tone sequence"
                >
                  <RotateCcw size={12} />
                  <span>Replay ({replaysUsed})</span>
                </button>
              )}
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isMuted ? '#DC2626' : 'var(--text-secondary)' }}
                title={isMuted ? 'Unmute tones' : 'Mute tones'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button onClick={onExit} className="btn btn-secondary btn-sm" style={{ fontSize: '0.76rem' }}>
                Exit
              </button>
            </div>
          </div>

          {/* Status Message */}
          <div style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            fontWeight: 700,
            fontSize: '0.94rem',
            background: gameState === 'listening' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(40, 84, 67, 0.1)',
            color: gameState === 'listening' ? '#4F46E5' : 'var(--primary)',
            border: `1px solid ${gameState === 'listening' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(40, 84, 67, 0.3)'}`
          }}>
            {gameState === 'listening' ? '🎵 Listening to musical tone sequence...' : '🎹 Your turn! Tap the matching notes from memory.'}
          </div>

          {/* Interactive Note Pads Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${round.activePadCount > 4 ? 4 : round.activePadCount}, 1fr)`,
            gap: '12px',
            maxWidth: '480px',
            margin: '0 auto 28px auto'
          }}>
            {round.availableNotes.map(note => {
              const isLit = activeFlashingNoteId === note.id;

              return (
                <button
                  key={note.id}
                  onClick={() => handleNotePadClick(note)}
                  disabled={gameState !== 'recall'}
                  style={{
                    height: '95px',
                    borderRadius: '16px',
                    background: isLit ? note.color : '#FFFFFF',
                    color: isLit ? '#FFFFFF' : 'var(--text-main)',
                    border: `2.5px solid ${isLit ? '#FFFFFF' : note.color}`,
                    boxShadow: isLit
                      ? `0 0 20px ${note.color}, 0 6px 16px rgba(0,0,0,0.18)`
                      : '0 2px 6px rgba(0,0,0,0.06)',
                    cursor: gameState === 'recall' ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transform: isLit ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.12s ease'
                  }}
                  aria-label={`Note ${note.name} (${note.swara})`}
                >
                  <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{note.name}</span>
                  <span style={{ fontSize: '0.72rem', opacity: isLit ? 0.95 : 0.65 }}>{note.swara}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RESULTS SCREEN */}
      {gameState === 'result' && finalScore && (
        <div className="clean-card" style={{ padding: '36px 28px', background: '#FFFFFF' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: finalScore.accuracy >= 70 ? 'var(--primary-subtle)' : '#FEE2E2',
            border: `2px solid ${finalScore.accuracy >= 70 ? 'var(--primary)' : '#EF4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: finalScore.accuracy >= 70 ? 'var(--primary)' : '#DC2626'
          }}>
            <Award size={32} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            {finalScore.accuracy === 100 ? 'Melodic Perfection!' : finalScore.accuracy >= 70 ? 'Harmonic Retention!' : 'Melody Interrupted'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
            {finalScore.accuracy === 100
              ? 'You reproduced every musical tone in exact pitch sequence.'
              : `You accurately recalled ${userSequence.length} of ${round.sequence.length} musical notes.`}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            maxWidth: '420px',
            margin: '0 auto 28px auto'
          }}>
            <div style={{ padding: '14px', background: '#F9F8F5', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{finalScore.accuracy}%</div>
            </div>
            <div style={{ padding: '14px', background: '#F9F8F5', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Score</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{finalScore.score}</div>
            </div>
            <div style={{ padding: '14px', background: '#F9F8F5', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Practice Points</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>+{finalScore.points}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={onExit} className="btn btn-secondary" style={{ padding: '10px 24px' }}>
              Catalogue
            </button>
            <button
              onClick={handlePlayAgain}
              className="btn btn-primary"
              style={{ padding: '10px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Next Melody</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
