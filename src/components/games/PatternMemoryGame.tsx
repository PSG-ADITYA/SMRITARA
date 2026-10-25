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
    <div className="clean-card" style={{ maxWidth: '860px', margin: '0 auto', background: '#FFFFFF', padding: '32px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-amber">Pattern & Geometry</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {round.id.slice(-6)}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 2px 0', color: 'var(--text-main)' }}>Sacred Pattern Memory</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            Memorize the arrangement of sacred geometry symbols and faithfully reconstruct the grid.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Difficulty Selection */}
          <div style={{ display: 'flex', background: 'var(--bg-card-inner)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'memorize'}
                className={`btn btn-sm ${difficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', padding: '4px 10px', fontSize: '0.76rem' }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => speakGameInstruction('pattern-memory')}
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

      {/* PHASE 1: Ready / Introduction */}
      {phase === 'ready' && (
        <div style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', margin: '0 auto 18px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
            <PatternSymbolSVG symbolKey="mandala" size={44} color="#285443" />
          </div>

          <div style={{ maxWidth: '480px', margin: '0 auto 24px auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Ready to Observe?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              You will be shown a {round.gridSize}×{round.gridSize} grid containing{' '}
              <strong style={{ color: 'var(--primary)' }}>{round.filledCount} sacred symbols</strong> for{' '}
              <strong style={{ color: 'var(--accent-amber)' }}>{round.memorizeSeconds} seconds</strong>. Pay close
              attention to both position and symbol type.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={beginMemorization}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="currentColor" />
              <span>Begin Memorization ({round.memorizeSeconds}s)</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Memorize */}
      {phase === 'memorize' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <Eye size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              Memorize Pattern: {timeLeft}s remaining
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '260px', height: '6px', background: 'var(--bg-card-inner)', borderRadius: '9999px', margin: '0 auto 24px auto', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--accent-amber)',
                transition: 'width 1s linear',
                width: `${(timeLeft / round.memorizeSeconds) * 100}%`
              }}
            />
          </div>

          {/* Grid Display */}
          <div
            style={{
              display: 'grid',
              gap: '12px',
              padding: '18px',
              background: 'var(--bg-card-inner)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              margin: '0 auto',
              width: 'fit-content',
              gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`
            }}
          >
            {round.patternCells.map(cell => (
              <div
                key={cell.cellIndex}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: cell.symbol ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                  border: `2px solid ${cell.symbol ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                  boxShadow: cell.symbol ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cell.symbol && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <PatternSymbolSVG symbolKey={cell.symbol} size={42} color={cell.color} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card-inner)', padding: '12px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Reconstruction Phase</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Select a symbol from the palette below, then tap a cell to place it. Tap again to clear.
              </div>
            </div>
            <button
              onClick={clearGrid}
              className="btn btn-secondary btn-sm"
            >
              Clear Grid
            </button>
          </div>

          {/* Interactive Reconstructable Grid */}
          <div
            style={{
              display: 'grid',
              gap: '12px',
              padding: '18px',
              background: 'var(--bg-card-inner)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              margin: '0 auto',
              width: 'fit-content',
              gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: round.gridSize * round.gridSize }).map((_, idx) => {
              const placedSymbol = userGrid[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    border: `2px ${placedSymbol ? 'solid var(--primary)' : 'dashed var(--border-medium)'}`,
                    boxShadow: placedSymbol ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {placedSymbol ? (
                    <>
                      <PatternSymbolSVG symbolKey={placedSymbol} size={38} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {PATTERN_SYMBOLS_CATALOGUE[placedSymbol].name}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>#{idx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Selector */}
          <div style={{ padding: '16px', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(40, 84, 67, 0.15)', maxWidth: '580px', margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'block', textAlign: 'center', marginBottom: '12px' }}>
              Active Symbol Palette (Select to Stamp)
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {round.paletteSymbols.map(sym => {
                const isSelected = selectedPaletteSymbol === sym;
                const info = PATTERN_SYMBOLS_CATALOGUE[sym];
                return (
                  <button
                    key={sym}
                    onClick={() => setSelectedPaletteSymbol(sym)}
                    className="btn btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--primary)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <PatternSymbolSVG symbolKey={sym} size={22} color={isSelected ? '#FFFFFF' : info.defaultColor} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
            <button
              onClick={handleSubmitReconstruction}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              <span>Verify Reconstruction</span>
              <ArrowRight size={16} />
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
