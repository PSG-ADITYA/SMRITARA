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
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
              Working Memory Span
            </span>
            <span className="text-xs text-stone-600">ID: {round.id.slice(-6)}</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 font-serif mt-1">
            {mode === 'reverse' ? 'Reverse Digit Recall' : 'Number Sequence Memory'}
          </h2>
          <p className="text-xs text-stone-600">
            {mode === 'reverse'
              ? 'Observe the flashed digit sequence, then reconstruct it in reverse order.'
              : 'Observe the flashed digit sequence, then reproduce it in forward order.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => handleModeChange('forward')}
              disabled={phase === 'flashing'}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'forward' ? 'bg-white text-stone-800 shadow-xs font-semibold' : 'text-stone-600'
              }`}
            >
              Forward
            </button>
            <button
              onClick={() => handleModeChange('reverse')}
              disabled={phase === 'flashing'}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                mode === 'reverse' ? 'bg-emerald-800 text-white shadow-xs font-semibold' : 'text-stone-600'
              }`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              Reverse
            </button>
          </div>

          {/* Difficulty */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'flashing'}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  difficulty === d
                    ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => speakGameInstruction('number-sequence')}
            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Listen to spoken instructions"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: Ready */}
      {phase === 'ready' && (
        <div className="text-center py-10 px-4 space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl mx-auto flex items-center justify-center border border-amber-200/60 shadow-inner">
            <span className="text-3xl font-bold font-mono text-amber-900">7 • 2</span>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-stone-800 font-serif">
              {mode === 'reverse' ? 'Reverse Working Memory Span' : 'Forward Digit Span'}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              You will see <strong className="text-emerald-800 font-semibold">{round.length} numbers</strong> flash one by
              one. Once finished, enter them{' '}
              <strong className="text-amber-800 font-semibold">
                {mode === 'reverse' ? 'in REVERSE order' : 'in the original order'}
              </strong>
              .
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={beginFlashing}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Digit Stream ({round.length} Digits)
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Flashing */}
      {phase === 'flashing' && (
        <div className="text-center py-12 space-y-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>Focus Attention: Flashing Sequence</span>
          </div>

          <div className="h-40 flex items-center justify-center">
            {activeDigitIndex >= 0 ? (
              <div className="w-28 h-28 bg-emerald-800 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-900/20 text-6xl font-bold font-mono animate-scaleIn">
                {round.digits[activeDigitIndex]}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-stone-200 flex items-center justify-center animate-spin" />
            )}
          </div>

          <div className="flex justify-center gap-2">
            {round.digits.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === activeDigitIndex
                    ? 'bg-emerald-700 scale-125'
                    : i < activeDigitIndex
                    ? 'bg-emerald-200'
                    : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Input */}
      {phase === 'input' && (
        <div className="space-y-6 max-w-md mx-auto py-2">
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              {mode === 'reverse' ? 'Enter Digits in REVERSE Order' : 'Enter Digits in FORWARD Order'}
            </p>
            <p className="text-[11px] text-stone-600">Use on-screen numpad or your keyboard (1–9, Backspace, Enter)</p>
          </div>

          {/* Sequence Slots */}
          <div className="flex justify-center gap-2.5 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            {Array.from({ length: round.length }).map((_, idx) => {
              const entered = userDigits[idx];
              const isCurrentSlot = idx === userDigits.length;
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl border transition-all ${
                    entered !== undefined
                      ? 'bg-white border-emerald-600 text-emerald-900 shadow-xs'
                      : isCurrentSlot
                      ? 'bg-white border-amber-500 ring-2 ring-amber-400/30'
                      : 'bg-stone-100/70 border-stone-200 text-stone-300'
                  }`}
                >
                  {entered !== undefined ? entered : '—'}
                </div>
              );
            })}
          </div>

          {/* Virtual Numpad */}
          <div className="grid grid-cols-3 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumpadPress(num)}
                disabled={userDigits.length >= round.length}
                className="p-4 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 text-xl font-bold font-mono rounded-2xl border border-stone-200 shadow-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setUserDigits([])}
              className="p-4 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold rounded-2xl border border-stone-200 transition-all cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumpadPress(0)}
              disabled
              className="p-4 bg-stone-100/40 text-stone-300 text-xs font-semibold rounded-2xl border border-stone-100"
            >
              —
            </button>
            <button
              onClick={handleBackspace}
              disabled={userDigits.length === 0}
              className="p-4 bg-stone-50 hover:bg-stone-100 text-stone-700 flex items-center justify-center rounded-2xl border border-stone-200 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Delete className="w-5 h-5" />
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
