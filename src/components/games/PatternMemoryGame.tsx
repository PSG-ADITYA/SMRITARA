import React, { useState, useEffect, useRef } from 'react';
import {
  type PatternSymbolKey,
  PATTERN_SYMBOLS_CATALOGUE,
  PatternSymbolSVG,
} from '../common/icons/PatternSymbols';
import {
  generatePatternRound,
  validatePatternReconstruction,
  calculatePatternScore,
  type PatternMemoryRound,
  type PatternValidationReport,
  type GameDifficulty,
} from '../../engine/games/patternMemoryEngine';
import { evaluateAdaptiveDifficulty } from '../../engine/games/adaptiveDifficultyEngine';
import { speakGameInstruction, speakRoundFeedback } from '../../engine/spokenGuideService';
import { Play, RotateCcw, ArrowRight, Eye, CheckCircle2, AlertCircle, Info, Sparkles, Volume2 } from 'lucide-react';

interface PatternMemoryGameProps {
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

type Phase = 'ready' | 'memorize' | 'reconstruct' | 'result';

export const PatternMemoryGame: React.FC<PatternMemoryGameProps> = ({
  onComplete,
  onExit,
  initialDifficulty = 'medium',
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [round, setRound] = useState<PatternMemoryRound>(() => generatePatternRound(initialDifficulty));
  const [phase, setPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userGrid, setUserGrid] = useState<Record<number, PatternSymbolKey | null>>({});
  const [selectedPaletteSymbol, setSelectedPaletteSymbol] = useState<PatternSymbolKey | null>(null);
  const [validationReport, setValidationReport] = useState<PatternValidationReport | null>(null);
  const [score, setScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [recentMistakes, setRecentMistakes] = useState<number>(0);

  const timerRef = useRef<any>(null);

  // Initialize a fresh round
  const startNewRound = (diff: GameDifficulty = difficulty, seed?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newRound = generatePatternRound(diff, seed);
    setRound(newRound);
    setUserGrid({});
    setSelectedPaletteSymbol(newRound.paletteSymbols[0] || null);
    setValidationReport(null);
    setPhase('ready');
    setTimeLeft(newRound.memorizeSeconds);
  };

  const handleDifficultyChange = (newDiff: GameDifficulty) => {
    setDifficulty(newDiff);
    startNewRound(newDiff);
  };

  const beginMemorization = () => {
    setPhase('memorize');
    setTimeLeft(round.memorizeSeconds);
    const roundStart = Date.now();
    setStartTime(roundStart);

    speakGameInstruction('pattern-memory');

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('reconstruct');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCellClick = (cellIndex: number) => {
    if (phase !== 'reconstruct') return;

    setUserGrid(prev => {
      const current = prev[cellIndex];
      // If clicking with selected palette symbol:
      // If same symbol already placed, clicking again clears it (toggle)
      if (selectedPaletteSymbol) {
        if (current === selectedPaletteSymbol) {
          const next = { ...prev };
          delete next[cellIndex];
          return next;
        }
        return { ...prev, [cellIndex]: selectedPaletteSymbol };
      }
      // If no symbol selected, clicking an existing placed symbol removes it
      if (current) {
        const next = { ...prev };
        delete next[cellIndex];
        return next;
      }
      return prev;
    });
  };

  const clearGrid = () => {
    setUserGrid({});
  };

  const handleSubmitReconstruction = () => {
    if (phase !== 'reconstruct') return;

    const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setElapsedTime(durationSec);

    const report = validatePatternReconstruction(round, userGrid);
    const calculated = calculatePatternScore(round, report.accuracy, durationSec);
    const finalPts = calculated.points;

    setValidationReport(report);
    setScore(finalPts);
    setPhase('result');

    speakRoundFeedback(
      report.isPerfect ? 'high' : report.accuracy >= 60 ? 'medium' : 'low',
      'pattern-memory'
    );

    // Adaptive difficulty evaluation
    const mistakes = report.discrepancies.length;
    setRecentMistakes(mistakes);

    const adaptive = evaluateAdaptiveDifficulty({
      gameId: 'pattern-memory',
      currentDifficulty: difficulty,
      accuracy: report.accuracy,
      averageResponseTimeSeconds: durationSec / (round.filledCount || 1),
      consecutiveSuccesses: report.isPerfect ? 1 : 0,
      recentMistakes: mistakes,
    });

    if (onComplete) {
      onComplete({
        gameId: 'pattern-memory',
        gameTitle: 'Pattern Memory',
        score: finalPts,
        accuracy: report.accuracy,
        difficulty,
        durationSeconds: durationSec,
        details: `${report.correctCount}/${round.filledCount} target cells reconstructed correctly in ${durationSec}s. ${adaptive.explanation}`,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
              Pattern & Geometry
            </span>
            <span className="text-xs text-stone-600">ID: {round.id.slice(-6)}</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 font-serif mt-1">Sacred Pattern Memory</h2>
          <p className="text-xs text-stone-600">
            Memorize the arrangement of sacred geometry symbols and faithfully reconstruct the grid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Selection */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'memorize'}
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
            onClick={() => speakGameInstruction('pattern-memory')}
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

      {/* PHASE 1: Ready / Introduction */}
      {phase === 'ready' && (
        <div className="text-center py-10 px-4 space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 shadow-inner">
            <PatternSymbolSVG symbolKey="mandala" size={44} color="#285443" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-stone-800 font-serif">Ready to Observe?</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              You will be shown a {round.gridSize}×{round.gridSize} grid containing{' '}
              <strong className="text-emerald-800 font-semibold">{round.filledCount} sacred symbols</strong> for{' '}
              <strong className="text-amber-800 font-semibold">{round.memorizeSeconds} seconds</strong>. Pay close
              attention to both position and symbol type.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={beginMemorization}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Begin Memorization ({round.memorizeSeconds}s)
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Memorize */}
      {phase === 'memorize' && (
        <div className="space-y-6 text-center py-4">
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-5 h-5 text-amber-800 animate-pulse" />
            <span className="text-sm font-semibold text-amber-800">Memorize Pattern: {timeLeft}s remaining</span>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-stone-100 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(timeLeft / round.memorizeSeconds) * 100}%` }}
            />
          </div>

          {/* Grid Display */}
          <div
            className="grid gap-3 p-4 bg-stone-50 rounded-3xl border border-stone-200 mx-auto w-fit shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {round.patternCells.map(cell => (
              <div
                key={cell.cellIndex}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all ${
                  cell.symbol
                    ? 'bg-white shadow-md border-2 border-emerald-700/30 ring-2 ring-emerald-500/10'
                    : 'bg-stone-100/60 border border-stone-200/50'
                }`}
              >
                {cell.symbol && (
                  <div className="flex flex-col items-center gap-1">
                    <PatternSymbolSVG symbolKey={cell.symbol} size={42} color={cell.color} />
                    <span className="text-[10px] font-medium text-stone-600">
                      {PATTERN_SYMBOLS_CATALOGUE[cell.symbol].name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Reconstruct */}
      {phase === 'reconstruct' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <p className="text-xs font-semibold text-stone-700">Reconstruction Phase</p>
              <p className="text-[11px] text-stone-600">
                Select a symbol from the palette below, then tap a cell to place it. Tap again to clear.
              </p>
            </div>
            <button
              onClick={clearGrid}
              className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 bg-white"
            >
              Clear Grid
            </button>
          </div>

          {/* Interactive Reconstructable Grid */}
          <div
            className="grid gap-3 p-4 bg-stone-50 rounded-3xl border border-stone-200 mx-auto w-fit shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: round.gridSize * round.gridSize }).map((_, idx) => {
              const placedSymbol = userGrid[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    placedSymbol
                      ? 'bg-white shadow-md border-2 border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-stone-100/80 border border-dashed border-stone-300'
                  }`}
                >
                  {placedSymbol ? (
                    <>
                      <PatternSymbolSVG symbolKey={placedSymbol} size={40} />
                      <span className="text-[10px] font-medium text-stone-600 mt-1">
                        {PATTERN_SYMBOLS_CATALOGUE[placedSymbol].name}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-stone-300 font-mono">#{idx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Selector */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 max-w-xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-emerald-900 block text-center">
              Active Symbol Palette (Select to Stamp)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {round.paletteSymbols.map(sym => {
                const isSelected = selectedPaletteSymbol === sym;
                const info = PATTERN_SYMBOLS_CATALOGUE[sym];
                return (
                  <button
                    key={sym}
                    onClick={() => setSelectedPaletteSymbol(sym)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-white shadow-md border-emerald-600 ring-2 ring-emerald-500/30 scale-105'
                        : 'bg-white/80 border-stone-200 hover:bg-white text-stone-600'
                    }`}
                  >
                    <PatternSymbolSVG symbolKey={sym} size={24} color={info.defaultColor} />
                    <span className="text-xs font-medium text-stone-700">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmitReconstruction}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 active:scale-95"
            >
              Verify Reconstruction
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: Result & Mistake Diagnostics */}
      {phase === 'result' && validationReport && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border text-center space-y-3 ${
              validationReport.isPerfect
                ? 'bg-emerald-50/80 border-emerald-200'
                : validationReport.accuracy >= 60
                ? 'bg-amber-50/80 border-amber-200'
                : 'bg-rose-50/80 border-rose-200'
            }`}
          >
            <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mx-auto">
              {validationReport.isPerfect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h3 className="text-2xl font-bold text-stone-800 font-serif">
              {validationReport.isPerfect
                ? 'Flawless Spatial Reconstruction!'
                : `${validationReport.accuracy}% Accuracy`}
            </h3>

            <p className="text-sm text-stone-700 max-w-lg mx-auto">{validationReport.summaryFeedback}</p>

            <div className="flex justify-center gap-6 pt-2">
              <div className="text-center">
                <span className="text-xs text-stone-600 block">Score</span>
                <span className="text-xl font-bold text-emerald-800">+{score} pts</span>
              </div>
              <div className="w-px bg-stone-200" />
              <div className="text-center">
                <span className="text-xs text-stone-600 block">Correct Cells</span>
                <span className="text-xl font-bold text-stone-800">
                  {validationReport.correctCount} / {round.patternCells.length}
                </span>
              </div>
              <div className="w-px bg-stone-200" />
              <div className="text-center">
                <span className="text-xs text-stone-600 block">Recall Time</span>
                <span className="text-xl font-bold text-stone-800">{elapsedTime}s</span>
              </div>
            </div>
          </div>

          {/* Constructive Diagnostics for Mistakes */}
          {validationReport.discrepancies.length > 0 && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm font-semibold text-stone-800">
                  Constructive Diagnostics ({validationReport.discrepancies.length} discrepancy)
                </h4>
              </div>
              <div className="space-y-2">
                {validationReport.discrepancies.map((disc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-xs flex items-center justify-between gap-4"
                  >
                    <span className="text-stone-700">{disc.explanation}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {disc.expectedSymbol && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                          <span>Target:</span>
                          <PatternSymbolSVG symbolKey={disc.expectedSymbol} size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Verification: Target Pattern vs Player Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {/* Target Reference */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
              <span className="text-xs font-semibold text-stone-700 block">Original Reference</span>
              <div
                className="grid gap-2 mx-auto w-fit"
                style={{
                  gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`,
                }}
              >
                {round.patternCells.map(c => (
                  <div
                    key={c.cellIndex}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      c.symbol ? 'bg-white shadow-sm border border-stone-200' : 'bg-stone-200/50'
                    }`}
                  >
                    {c.symbol && <PatternSymbolSVG symbolKey={c.symbol} size={28} color={c.color} />}
                  </div>
                ))}
              </div>
            </div>

            {/* User Submission */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
              <span className="text-xs font-semibold text-stone-700 block">Your Reconstruction</span>
              <div
                className="grid gap-2 mx-auto w-fit"
                style={{
                  gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`,
                }}
              >
                {round.patternCells.map(c => {
                  const userSym = userGrid[c.cellIndex] || null;
                  const isMatch = userSym === c.symbol;
                  return (
                    <div
                      key={c.cellIndex}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                        isMatch
                          ? 'bg-emerald-50 border-emerald-400'
                          : 'bg-rose-50 border-rose-400 ring-1 ring-rose-400'
                      }`}
                    >
                      {userSym ? (
                        <PatternSymbolSVG symbolKey={userSym} size={28} />
                      ) : (
                        <span className="text-[10px] text-stone-300 font-mono">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-stone-100">
            <button
              onClick={() => startNewRound(difficulty)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Next Procedural Round
            </button>
            <button
              onClick={() => {
                setUserGrid({});
                setValidationReport(null);
                setPhase('reconstruct');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-medium rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all text-sm"
            >
              Retry Same Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
