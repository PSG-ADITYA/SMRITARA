import { ALL_PATTERN_SYMBOLS, PATTERN_SYMBOLS_CATALOGUE, type PatternSymbolKey } from '../../components/common/icons/PatternSymbols';
import { createSeededRandom, pickRandom, randomInt, shuffleArray } from './seededRandom';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface PatternCell {
  cellIndex: number;
  row: number;
  col: number;
  symbol: PatternSymbolKey | null; // null if empty cell
  color: string;
}

export interface PatternMemoryRound {
  id: string;
  gridSize: number; // 3 for 3x3, 4 for 4x4
  patternCells: PatternCell[];
  filledCount: number;
  memorizeSeconds: number;
  paletteSymbols: PatternSymbolKey[];
  difficulty: GameDifficulty;
}

export interface CellDiscrepancy {
  cellIndex: number;
  row: number;
  col: number;
  expectedSymbol: PatternSymbolKey | null;
  userSymbol: PatternSymbolKey | null;
  explanation: string;
}

export interface PatternValidationReport {
  isPerfect: boolean;
  accuracy: number;
  correctCount: number;
  totalTargetCells: number;
  discrepancies: CellDiscrepancy[];
  summaryFeedback: string;
}

/**
 * Generates a procedurally calibrated Pattern Memory grid round
 */
export function generatePatternRound(
  difficulty: GameDifficulty = 'medium',
  seed?: number | string
): PatternMemoryRound {
  const rng = createSeededRandom(seed);

  let gridSize = 3;
  let filledCount = 5;
  let memorizeSeconds = 4.5;

  if (difficulty === 'easy') {
    gridSize = 3;
    filledCount = 4;
    memorizeSeconds = 5;
  } else if (difficulty === 'medium') {
    gridSize = 3;
    filledCount = 6;
    memorizeSeconds = 4;
  } else {
    gridSize = 4;
    filledCount = 8;
    memorizeSeconds = 3.5;
  }

  const totalCells = gridSize * gridSize;
  const allIndices = Array.from({ length: totalCells }, (_, i) => i);
  const targetIndices = shuffleArray(allIndices, rng).slice(0, filledCount);

  // Available palette symbols
  const paletteSymbols = shuffleArray([...ALL_PATTERN_SYMBOLS], rng).slice(0, Math.min(6, filledCount + 2));

  const patternCells: PatternCell[] = [];

  for (let idx = 0; idx < totalCells; idx++) {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const isTarget = targetIndices.includes(idx);

    let symbol: PatternSymbolKey | null = null;
    let color = '#285443';

    if (isTarget) {
      symbol = pickRandom(paletteSymbols, rng);
      color = PATTERN_SYMBOLS_CATALOGUE[symbol].defaultColor;
    }

    patternCells.push({
      cellIndex: idx,
      row,
      col,
      symbol,
      color,
    });
  }

  return {
    id: `pattern_${Date.now()}_${randomInt(1000, 9999, rng)}`,
    gridSize,
    patternCells,
    filledCount,
    memorizeSeconds,
    paletteSymbols,
    difficulty,
  };
}

/**
 * Validates player's reconstructed grid against the reference pattern
 * Generates constructive explanations for every mistake
 */
export function validatePatternReconstruction(
  round: PatternMemoryRound,
  userGrid: Record<number, PatternSymbolKey | null>
): PatternValidationReport {
  const discrepancies: CellDiscrepancy[] = [];
  let correctCount = 0;

  round.patternCells.forEach(cell => {
    const userSym = userGrid[cell.cellIndex] || null;
    const expSym = cell.symbol;

    if (userSym === expSym) {
      correctCount++;
    } else {
      let explanation = '';
      const posLabel = `Row ${cell.row + 1}, Col ${cell.col + 1}`;

      if (expSym && !userSym) {
        explanation = `${posLabel}: Expected ${PATTERN_SYMBOLS_CATALOGUE[expSym].name}, but was left blank.`;
      } else if (!expSym && userSym) {
        explanation = `${posLabel}: Should have remained empty, but ${PATTERN_SYMBOLS_CATALOGUE[userSym].name} was placed.`;
      } else if (expSym && userSym) {
        explanation = `${posLabel}: Expected ${PATTERN_SYMBOLS_CATALOGUE[expSym].name}, but you placed ${PATTERN_SYMBOLS_CATALOGUE[userSym].name}.`;
      }

      discrepancies.push({
        cellIndex: cell.cellIndex,
        row: cell.row,
        col: cell.col,
        expectedSymbol: expSym,
        userSymbol: userSym,
        explanation,
      });
    }
  });

  const totalCells = round.gridSize * round.gridSize;
  const accuracy = Math.round((correctCount / totalCells) * 100);
  const isPerfect = discrepancies.length === 0;

  let summaryFeedback = '';
  if (isPerfect) {
    summaryFeedback = 'Flawless spatial & visual recall! Every single symbol and placement matched the reference pattern.';
  } else if (accuracy >= 80) {
    summaryFeedback = `High spatial retention (${accuracy}%). You correctly recalled ${correctCount} of ${totalCells} cell locations.`;
  } else if (accuracy >= 55) {
    summaryFeedback = `Partial recall (${accuracy}%). Notice the discrepancy highlights below to calibrate your visual boundary mapping.`;
  } else {
    summaryFeedback = `Developing pattern focus (${accuracy}%). Next round, try anchoring outer quadrant symbols first before inner shapes.`;
  }

  return {
    isPerfect,
    accuracy,
    correctCount,
    totalTargetCells: totalCells,
    discrepancies,
    summaryFeedback,
  };
}

/**
 * Calculates score for Pattern Memory
 */
export function calculatePatternScore(
  round: PatternMemoryRound,
  accuracy: number,
  elapsedSeconds: number
): { score: number; points: number } {
  const diffMultiplier = round.difficulty === 'hard' ? 1.4 : round.difficulty === 'medium' ? 1.0 : 0.8;
  const speedBonus = Math.max(0, 30 - elapsedSeconds) * 1.5;

  const score = Math.max(10, Math.min(100, Math.round(accuracy * diffMultiplier + speedBonus)));
  const points = Math.round((score / 100) * (round.difficulty === 'hard' ? 60 : round.difficulty === 'medium' ? 45 : 30));

  return { score, points };
}
