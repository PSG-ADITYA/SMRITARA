import { createSeededRandom, randomInt } from './seededRandom';

export type SequenceRecallMode = 'forward' | 'reverse';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface NumberSequenceRound {
  id: string;
  mode: SequenceRecallMode;
  digits: number[];
  length: number;
  displaySpeedMs: number;
  difficulty: GameDifficulty;
}

/**
 * Procedurally generates a Number Sequence Memory round (Digit Span)
 */
export function generateNumberSequenceRound(
  difficulty: GameDifficulty = 'medium',
  mode: SequenceRecallMode = 'forward',
  seed?: number | string
): NumberSequenceRound {
  const rng = createSeededRandom(seed);

  let length = 5;
  let displaySpeedMs = 900;

  if (difficulty === 'easy') {
    length = mode === 'forward' ? 4 : 3;
    displaySpeedMs = 1000;
  } else if (difficulty === 'medium') {
    length = mode === 'forward' ? 6 : 4;
    displaySpeedMs = 850;
  } else {
    length = mode === 'forward' ? 8 : 6;
    displaySpeedMs = 700;
  }

  const digits: number[] = [];
  for (let i = 0; i < length; i++) {
    // Avoid immediate duplicate digits
    let d = randomInt(1, 9, rng);
    while (i > 0 && d === digits[i - 1]) {
      d = randomInt(1, 9, rng);
    }
    digits.push(d);
  }

  return {
    id: `numseq_${Date.now()}_${randomInt(1000, 9999, rng)}`,
    mode,
    digits,
    length,
    displaySpeedMs,
    difficulty,
  };
}

/**
 * Validates player's entered sequence based on mode (forward or reverse)
 */
export function validateNumberSequence(
  round: NumberSequenceRound,
  userDigits: number[]
): {
  isCorrect: boolean;
  accuracy: number;
  expectedSequence: number[];
  userSequence: number[];
} {
  const expectedSequence = round.mode === 'reverse'
    ? [...round.digits].reverse()
    : [...round.digits];

  let matches = 0;
  for (let i = 0; i < expectedSequence.length; i++) {
    if (userDigits[i] === expectedSequence[i]) matches++;
  }

  const accuracy = Math.round((matches / expectedSequence.length) * 100);
  const isCorrect = matches === expectedSequence.length && userDigits.length === expectedSequence.length;

  return {
    isCorrect,
    accuracy,
    expectedSequence,
    userSequence: userDigits,
  };
}

export function calculateNumberSequenceScore(
  round: NumberSequenceRound,
  report: { isCorrect: boolean; accuracy: number },
  durationSeconds: number
): number {
  const basePoints = report.accuracy;
  const lengthBonus = round.length * 8;
  const reverseMultiplier = round.mode === 'reverse' ? 1.3 : 1.0;
  const speedBonus = Math.max(0, 25 - durationSeconds) * 1.5;
  const diffMultiplier = round.difficulty === 'hard' ? 1.4 : round.difficulty === 'medium' ? 1.1 : 0.9;
  return Math.round((basePoints + lengthBonus + speedBonus) * reverseMultiplier * diffMultiplier);
}

