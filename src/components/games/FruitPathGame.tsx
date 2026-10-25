import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award,
  Eye,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateFruitPathRound, 
  validateFruitPathStep, 
  calculateFruitPathScore, 
  type FruitPathRound, 
  type GameDifficulty 
} from '../../engine/games/fruitPathEngine';
import { FRUIT_CATALOGUE, type FruitKey } from '../common/icons/FruitIcons';
import { spokenGuideService, GUIDE_SCRIPTS } from '../../engine/spokenGuideService';
import { audioService } from '../../engine/audioService';

interface FruitPathGameProps {
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

export const FruitPathGame: React.FC<FruitPathGameProps> = ({
  difficulty = 'medium',
  onSessionComplete,
  onComplete,
  onExit,
}) => {
  const [round, setRound] = useState<FruitPathRound>(() => generateFruitPathRound(difficulty));
  const [gameState, setGameState] = useState<'intro' | 'memorize' | 'recall' | 'result'>('intro');
  const [countdown, setCountdown] = useState<number>(round.memorizeSeconds);
  const [userSelectedIds, setUserSelectedIds] = useState<number[]>([]);
  const [mistakeTileId, setMistakeTileId] = useState<number | null>(null);
  const [replaysUsed, setReplaysUsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<{ score: number; accuracy: number; points: number } | null>(null);

  // Memorize countdown timer
  useEffect(() => {
    let timer: any;
    if (gameState === 'memorize') {
      setCountdown(round.memorizeSeconds);
      const start = Date.now();
      timer = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        const remain = Math.max(0, Math.ceil(round.memorizeSeconds - elapsed));
        setCountdown(remain);
        if (remain <= 0) {
          clearInterval(timer);
          setGameState('recall');
          setStartTime(Date.now());
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState, round]);

  const handleStartRound = () => {
    audioService.playStartChime();
    setUserSelectedIds([]);
    setMistakeTileId(null);
    setGameState('memorize');
  };

  const handleHearRules = () => {
    spokenGuideService.speak(GUIDE_SCRIPTS.fruitPath);
  };

  const handleReplayPath = () => {
    setReplaysUsed(prev => prev + 1);
    setGameState('memorize');
  };

  const handleTileClick = (tileId: number) => {
    if (gameState !== 'recall') return;
    if (userSelectedIds.includes(tileId)) return;

    audioService.playClick();
    const result = validateFruitPathStep(round, userSelectedIds, tileId);

    if (result.isCorrect) {
      audioService.playSuccessBell();
      const updated = [...userSelectedIds, tileId];
      setUserSelectedIds(updated);

      if (result.isComplete) {
        handleRoundFinished(updated.length, true);
      }
    } else {
      audioService.playSoftMistake();
      setMistakeTileId(tileId);
      setTimeout(() => setMistakeTileId(null), 800);
      handleRoundFinished(userSelectedIds.length, false);
    }
  };

  const handleRoundFinished = (correctSteps: number, isWin: boolean) => {
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const scoreData = calculateFruitPathScore(round, correctSteps, elapsed, replaysUsed);
    setFinalScore(scoreData);
    setGameState('result');

    if (isWin && scoreData.accuracy >= 70) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }

    onSessionComplete?.({
      gameType: 'fruit_path',
      difficulty: round.difficulty,
      score: scoreData.score,
      accuracy: scoreData.accuracy,
      durationSeconds: elapsed,
      points: scoreData.points,
    });

    onComplete?.({
      gameId: 'fruit-path',
      gameTitle: 'Fruit Memory Path',
      score: scoreData.score,
      accuracy: scoreData.accuracy,
      difficulty: round.difficulty,
      durationSeconds: elapsed,
      details: `Recalled ${correctSteps}/${round.sequenceLength} steps in ${elapsed}s (Score: ${scoreData.score})`,
    });
  };

  const handlePlayAgain = () => {
    const newRound = generateFruitPathRound(difficulty);
    setRound(newRound);
    setReplaysUsed(0);
    setUserSelectedIds([]);
    setMistakeTileId(null);
    setFinalScore(null);
    setGameState('memorize');
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
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            border: '2px solid #F59E0B'
          }}>
            <Sparkles size={32} color="#D97706" />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Fruit Memory Path
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px auto' }}>
            A sequential visual recall challenge. A series of distinct hand-illustrated fruits will be illuminated in a path. Memorize their exact order before they disappear, then tap each fruit in sequence.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            padding: '16px',
            background: '#F9F8F5',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '28px',
            fontSize: '0.84rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>Grid Size</span>
              <strong>{round.gridSize} × {round.gridSize}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>Sequence Span</span>
              <strong>{round.sequenceLength} Fruits</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>Inspection Window</span>
              <strong>{round.memorizeSeconds}s</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={handleHearRules}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Hear spoken instructions"
            >
              <Volume2 size={16} />
              <span>Spoken Guide</span>
            </button>
            <button
              onClick={handleStartRound}
              className="btn btn-primary"
              style={{ padding: '10px 32px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={18} />
              <span>Begin Round</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE GAMEPLAY (MEMORIZE OR RECALL) */}
      {(gameState === 'memorize' || gameState === 'recall') && (
        <div className="clean-card" style={{ padding: '28px 24px', background: '#FFFFFF' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal" style={{ textTransform: 'uppercase' }}>{round.difficulty}</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {gameState === 'memorize' ? 'Memorization Phase' : `Progress: ${userSelectedIds.length} / ${round.sequenceLength}`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {gameState === 'recall' && (
                <button
                  onClick={handleReplayPath}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Peek at the path again (slight score deduction)"
                >
                  <Eye size={13} />
                  <span>Peek Path ({replaysUsed})</span>
                </button>
              )}
              <button onClick={onExit} className="btn btn-secondary btn-sm" style={{ fontSize: '0.76rem' }}>
                Exit
              </button>
            </div>
          </div>

          {/* Phase Banner */}
          <div style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '0.94rem',
            background: gameState === 'memorize' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(40, 84, 67, 0.1)',
            color: gameState === 'memorize' ? '#B45309' : 'var(--primary)',
            border: `1px solid ${gameState === 'memorize' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(40, 84, 67, 0.3)'}`
          }}>
            {gameState === 'memorize'
              ? `Memorize the Path Sequence! Hiding in ${countdown}s`
              : 'Tap the fruits in the exact order memorized!'}
          </div>

          {/* The Game Board */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${round.gridSize}, 1fr)`,
            gap: '12px',
            maxWidth: `${round.gridSize * 95}px`,
            margin: '0 auto 24px auto'
          }}>
            {round.tiles.map(tile => {
              const FruitComponent = FRUIT_CATALOGUE[tile.fruit].component;
              const isPath = tile.stepNumber !== null;
              const isSelected = userSelectedIds.includes(tile.id);
              const isMistake = mistakeTileId === tile.id;

              // What to show on the tile
              const showFruit = gameState === 'memorize' ? isPath : isSelected;
              const stepBadge = gameState === 'memorize' && isPath ? tile.stepNumber : isSelected ? userSelectedIds.indexOf(tile.id) + 1 : null;

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  disabled={gameState !== 'recall' || isSelected}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '16px',
                    background: isMistake
                      ? '#FEE2E2'
                      : isSelected
                      ? '#DCFCE7'
                      : showFruit
                      ? '#FFFBEB'
                      : '#FFFFFF',
                    border: `2.5px solid ${
                      isMistake
                        ? '#EF4444'
                        : isSelected
                        ? '#16A34A'
                        : showFruit
                        ? '#F59E0B'
                        : 'var(--border-subtle)'
                    }`,
                    boxShadow: showFruit ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: gameState === 'recall' && !isSelected ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                  aria-label={`${tile.fruit} at row ${tile.row + 1}, column ${tile.col + 1}`}
                >
                  {/* Step number badge */}
                  {stepBadge !== null && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      left: '8px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isSelected ? '#16A34A' : '#F59E0B',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {stepBadge}
                    </span>
                  )}

                  {/* Fruit Illustration */}
                  {showFruit ? (
                    <FruitComponent size={44} />
                  ) : (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--bg-card-inner)',
                      opacity: 0.6
                    }} />
                  )}
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
            {finalScore.accuracy >= 70 ? <Award size={32} /> : <AlertCircle size={32} />}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            {finalScore.accuracy === 100 ? 'Flawless Sequence Recall!' : finalScore.accuracy >= 70 ? 'Solid Path Retention!' : 'Path Interrupted'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
            {finalScore.accuracy === 100
              ? 'You recalled the complete fruit sequence in exact spatial order.'
              : `You correctly reproduced ${userSelectedIds.length} of ${round.sequenceLength} sequence steps.`}
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
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Session Score</span>
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
              <span>Next Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
