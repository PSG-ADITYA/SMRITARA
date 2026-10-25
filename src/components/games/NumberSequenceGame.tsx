import React, { useState, useEffect, useRef } from 'react';
import {
  generateNumberSequenceRound,
  validateNumberSequence,
  calculateNumberSequenceScore,
  type NumberSequenceRound,
  type SequenceRecallMode,
  type GameDifficulty,
} from '../../engine/games/numberSequenceEngine';
import { evaluateAdaptiveDifficulty } from '../../engine/games/adaptiveDifficultyEngine';
import { speakGameInstruction, speakRoundFeedback } from '../../engine/spokenGuideService';
import { Play, RotateCcw, ArrowRight, Eye, CheckCircle2, XCircle, Volume2, ArrowLeftRight, Delete } from 'lucide-react';

interface NumberSequenceGameProps {
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
  initialDifficulty?: GameDifficulty;
}

type Phase = 'ready' | 'flashing' | 'input' | 'result';

export const NumberSequenceGame: React.FC<NumberSequenceGameProps> = ({
  onComplete,
  onExit,
  initialDifficulty = 'medium',
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [mode, setMode] = useState<SequenceRecallMode>('forward');
  const [round, setRound] = useState<NumberSequenceRound>(() =>
    generateNumberSequenceRound(initialDifficulty, 'forward')
  );
  const [phase, setPhase] = useState<Phase>('ready');
  const [activeDigitIndex, setActiveDigitIndex] = useState<number>(-1);
  const [userDigits, setUserDigits] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [validation, setValidation] = useState<ReturnType<typeof validateNumberSequence> | null>(null);

  const flashTimeouts = useRef<any[]>([]);

  const startNewRound = (diff: GameDifficulty = difficulty, recallMode: SequenceRecallMode = mode) => {
    clearAllTimeouts();
    const newRound = generateNumberSequenceRound(diff, recallMode);
    setRound(newRound);
    setUserDigits([]);
    setValidation(null);
    setActiveDigitIndex(-1);
    setPhase('ready');
  };

  const clearAllTimeouts = () => {
    flashTimeouts.current.forEach(t => clearTimeout(t));
    flashTimeouts.current = [];
  };

  const handleDifficultyChange = (newDiff: GameDifficulty) => {
    setDifficulty(newDiff);
    startNewRound(newDiff, mode);
  };

  const handleModeChange = (newMode: SequenceRecallMode) => {
    setMode(newMode);
    startNewRound(difficulty, newMode);
  };

  const beginFlashing = () => {
    setPhase('flashing');
    setUserDigits([]);
    setActiveDigitIndex(-1);
    setStartTime(Date.now());

    speakGameInstruction('number-sequence');

    const speed = round.displaySpeedMs;

    round.digits.forEach((_, idx) => {
      // Turn on
      const onTimeout = setTimeout(() => {
        setActiveDigitIndex(idx);
      }, (idx + 0.5) * speed);

      // Turn off
      const offTimeout = setTimeout(() => {
        setActiveDigitIndex(-1);
      }, (idx + 1) * speed - 150);

      flashTimeouts.current.push(onTimeout, offTimeout);
    });

    // Switch to input phase
    const endTimeout = setTimeout(() => {
      setPhase('input');
      setActiveDigitIndex(-1);
    }, (round.digits.length + 1) * speed);

    flashTimeouts.current.push(endTimeout);
  };

  const handleNumpadPress = (digit: number) => {
    if (phase !== 'input') return;
    if (userDigits.length >= round.digits.length) return;
    setUserDigits(prev => [...prev, digit]);
  };

  const handleBackspace = () => {
    if (phase !== 'input') return;
    setUserDigits(prev => prev.slice(0, -1));
  };

  const handleSubmitSequence = () => {
    if (phase !== 'input') return;
    const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setElapsedTime(durationSec);

    const report = validateNumberSequence(round, userDigits);
    const calculatedScore = calculateNumberSequenceScore(round, report, durationSec);

    setValidation(report);
    setScore(calculatedScore);
    setPhase('result');

    speakRoundFeedback(report.isCorrect ? 'high' : report.accuracy >= 50 ? 'medium' : 'low', 'number-sequence');

    const adaptive = evaluateAdaptiveDifficulty({
      gameId: 'number-sequence',
      currentDifficulty: difficulty,
      accuracy: report.accuracy,
      averageResponseTimeSeconds: durationSec / round.digits.length,
      consecutiveSuccesses: report.isCorrect ? 1 : 0,
      recentMistakes: report.expectedSequence.length - (report.accuracy * report.expectedSequence.length) / 100,
    });

    if (onComplete) {
      onComplete({
        gameId: 'number-sequence',
        gameTitle: mode === 'reverse' ? 'Reverse Recall (Digits)' : 'Number Sequence Memory',
        score: calculatedScore,
        accuracy: report.accuracy,
        difficulty,
        durationSeconds: durationSec,
        details: `${report.isCorrect ? 'Perfect' : `${report.accuracy}%`} ${mode} recall of ${round.length} digits in ${durationSec}s. ${adaptive.explanation}`,
      });
    }
  };

  // Keyboard support for 1-9 & Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'input') return;
      if (e.key >= '1' && e.key <= '9') {
        handleNumpadPress(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter' && userDigits.length === round.digits.length) {
        handleSubmitSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, userDigits, round.digits.length]);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="clean-card" style={{ maxWidth: '860px', margin: '0 auto', background: '#FFFFFF', padding: '32px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-amber">Working Memory Span</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {round.id.slice(-6)}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 2px 0', color: 'var(--text-main)' }}>
            {mode === 'reverse' ? 'Reverse Digit Recall' : 'Number Sequence Memory'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            {mode === 'reverse'
              ? 'Observe the flashed digit sequence, then reconstruct it in reverse order.'
              : 'Observe the flashed digit sequence, then reproduce it in forward order.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-card-inner)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => handleModeChange('forward')}
              disabled={phase === 'flashing'}
              className={`btn btn-sm ${mode === 'forward' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '0.76rem' }}
            >
              Forward
            </button>
            <button
              onClick={() => handleModeChange('reverse')}
              disabled={phase === 'flashing'}
              className={`btn btn-sm ${mode === 'reverse' ? 'btn-teal' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.76rem' }}
            >
              <ArrowLeftRight size={12} />
              <span>Reverse</span>
            </button>
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', background: 'var(--bg-card-inner)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'flashing'}
                className={`btn btn-sm ${difficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', padding: '4px 10px', fontSize: '0.76rem' }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => speakGameInstruction('number-sequence')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Listen to spoken instructions"
          >
            <Volume2 size={16} />
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="btn btn-secondary btn-sm"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: Ready */}
      {phase === 'ready' && (
        <div style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--accent-amber-subtle)', borderRadius: 'var(--radius-md)', margin: '0 auto 18px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>7 • 2</span>
          </div>

          <div style={{ maxWidth: '480px', margin: '0 auto 24px auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              {mode === 'reverse' ? 'Reverse Working Memory Span' : 'Forward Digit Span'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              You will see <strong style={{ color: 'var(--primary)' }}>{round.length} numbers</strong> flash one by
              one. Once finished, enter them{' '}
              <strong style={{ color: 'var(--accent-amber)' }}>
                {mode === 'reverse' ? 'in REVERSE order' : 'in the original order'}
              </strong>
              .
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={beginFlashing}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="currentColor" />
              <span>Start Digit Stream ({round.length} Digits)</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Flashing */}
      {phase === 'flashing' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
            <Eye size={18} />
            <span>Focus Attention: Flashing Sequence</span>
          </div>

          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeDigitIndex >= 0 ? (
              <div style={{ width: '100px', height: '100px', background: 'var(--primary)', color: '#FFFFFF', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', boxShadow: 'var(--shadow-lg)' }}>
                {round.digits[activeDigitIndex]}
              </div>
            ) : (
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px dashed var(--border-medium)', animation: 'spin 1s linear infinite' }} />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {round.digits.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i === activeDigitIndex
                    ? 'var(--primary)'
                    : i < activeDigitIndex
                    ? 'var(--primary-light)'
                    : 'var(--border-subtle)',
                  transform: i === activeDigitIndex ? 'scale(1.3)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Input */}
      {phase === 'input' && (
        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '4px' }}>
              {mode === 'reverse' ? 'Enter Digits in REVERSE Order' : 'Enter Digits in FORWARD Order'}
            </p>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>Use on-screen numpad or your keyboard (1–9, Backspace, Enter)</p>
          </div>

          {/* Sequence Slots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px', background: 'var(--bg-card-inner)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {Array.from({ length: round.length }).map((_, idx) => {
              const entered = userDigits[idx];
              const isCurrentSlot = idx === userDigits.length;
              return (
                <div
                  key={idx}
                  style={{
                    width: '44px',
                    height: '52px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    background: '#FFFFFF',
                    border: `2px solid ${
                      entered !== undefined
                        ? 'var(--primary)'
                        : isCurrentSlot
                        ? 'var(--accent-amber)'
                        : 'var(--border-subtle)'
                    }`,
                    color: entered !== undefined ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                >
                  {entered !== undefined ? entered : '—'}
                </div>
              );
            })}
          </div>

          {/* Virtual Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumpadPress(num)}
                disabled={userDigits.length >= round.length}
                style={{
                  height: '56px',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setUserDigits([])}
              className="btn btn-secondary"
              style={{ height: '56px', fontSize: '0.82rem', fontWeight: 600 }}
            >
              Clear
            </button>
            <button
              onClick={() => handleNumpadPress(0)}
              disabled
              style={{
                height: '56px',
                background: 'var(--bg-card-inner)',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}
            >
              —
            </button>
            <button
              onClick={handleBackspace}
              disabled={userDigits.length === 0}
              className="btn btn-secondary"
              style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Delete last digit"
            >
              <Delete size={18} />
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmitSequence}
              disabled={userDigits.length < round.length}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify Recall
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: Result */}
      {phase === 'result' && validation && (
        <div className="space-y-6 text-center py-4">
          <div
            className={`p-6 rounded-2xl border max-w-md mx-auto space-y-3 ${
              validation.isCorrect ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
            }`}
          >
            <div className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm">
              {validation.isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h3 className="text-2xl font-bold text-stone-800 font-serif">
              {validation.isCorrect ? 'Accurate Recall!' : `${validation.accuracy}% Accurate`}
            </h3>

            <p className="text-sm text-stone-700">
              {validation.isCorrect
                ? `You faithfully reproduced all ${round.length} digits in ${mode} order!`
                : `You correctly recalled ${
                    (validation.accuracy * validation.expectedSequence.length) / 100
                  } of ${validation.expectedSequence.length} positions.`}
            </p>

            <div className="flex justify-center gap-6 pt-2">
              <div>
                <span className="text-xs text-stone-600 block">Score</span>
                <span className="text-xl font-bold text-emerald-800">+{score} pts</span>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <span className="text-xs text-stone-600 block">Time</span>
                <span className="text-xl font-bold text-stone-800">{elapsedTime}s</span>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <span className="text-xs text-stone-600 block">Span Mode</span>
                <span className="text-xl font-bold text-stone-800 capitalize">{mode}</span>
              </div>
            </div>
          </div>

          {/* Sequence Comparison */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-lg mx-auto space-y-4">
            <div>
              <span className="text-xs font-semibold text-stone-600 block mb-1.5">
                Target Order ({mode.toUpperCase()}):
              </span>
              <div className="flex justify-center gap-2">
                {validation.expectedSequence.map((num, i) => (
                  <span
                    key={i}
                    className="w-9 h-11 bg-white border border-stone-200 rounded-lg flex items-center justify-center font-mono font-bold text-stone-800 text-sm shadow-xs"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-600 block mb-1.5">Your Response:</span>
              <div className="flex justify-center gap-2">
                {validation.expectedSequence.map((_, i) => {
                  const userVal = validation.userSequence[i];
                  const isMatch = userVal === validation.expectedSequence[i];
                  return (
                    <span
                      key={i}
                      className={`w-9 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm border ${
                        isMatch
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                          : 'bg-rose-50 border-rose-400 text-rose-900 line-through'
                      }`}
                    >
                      {userVal !== undefined ? userVal : '—'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => startNewRound(difficulty, mode)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Next Sequence Round
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-medium rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all text-sm"
              >
                Back to Catalogue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
