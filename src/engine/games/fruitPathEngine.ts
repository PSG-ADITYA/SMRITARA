import { ALL_FRUITS, type FruitKey } from '../../components/common/icons/FruitIcons';
import { createSeededRandom, pickRandom, randomInt, shuffleArray } from './seededRandom';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface FruitPathTile {
  id: number;
  row: number;
  col: number;
  fruit: FruitKey;
  stepNumber: number | null; // 1-based step if in path, null if distractor
}

export interface FruitPathRound {
  id: string;
  gridSize: number;
  sequenceLength: number;
  tiles: FruitPathTile[];
  pathSequence: number[]; // tile IDs in order
  pathFruits: FruitKey[]; // fruit keys in order
  memorizeSeconds: number;
  difficulty: GameDifficulty;
}

export interface PathValidationResult {
  isCorrect: boolean;
  isComplete: boolean;
  currentIndex: number;
  totalLength: number;
  expectedTileId: number;
  revealedTileIds: number[];
}

/**
 * Generates a procedurally calibrated Fruit Memory Path round
 */
export function generateFruitPathRound(
  difficulty: GameDifficulty = 'medium',
  seed?: number | string
): FruitPathRound {
  const rng = createSeededRandom(seed);

  // Difficulty configurations
  let gridSize = 3;
  let sequenceLength = 4;
  let memorizeSeconds = 4;

  if (difficulty === 'easy') {
    gridSize = 3;
    sequenceLength = 3;
    memorizeSeconds = 5;
  } else if (difficulty === 'medium') {
    gridSize = 4;
    sequenceLength = 5;
    memorizeSeconds = 4;
  } else {
    gridSize = 4;
    sequenceLength = 7;
    memorizeSeconds = 3.5;
  }

  const totalCells = gridSize * gridSize;
  const allCellIndices = Array.from({ length: totalCells }, (_, i) => i);
  const shuffledIndices = shuffleArray(allCellIndices, rng);

  // Pick unique cells for the path
  const pathTileIndices = shuffledIndices.slice(0, sequenceLength);

  // Generate sequence of fruits for the path (diverse selection)
  const pathFruits: FruitKey[] = [];
  const fruitPool = shuffleArray([...ALL_FRUITS], rng);

  for (let i = 0; i < sequenceLength; i++) {
    // Avoid same fruit twice in immediate succession
    const candidates = fruitPool.filter(f => i === 0 || f !== pathFruits[i - 1]);
    const chosen = pickRandom(candidates, rng);
    pathFruits.push(chosen);
  }

  // Construct grid tiles
  const tiles: FruitPathTile[] = [];

  for (let idx = 0; idx < totalCells; idx++) {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const pathStepIdx = pathTileIndices.indexOf(idx);

    let fruit: FruitKey;
    let stepNumber: number | null = null;

    if (pathStepIdx !== -1) {
      stepNumber = pathStepIdx + 1;
      fruit = pathFruits[pathStepIdx];
    } else {
      // Distractor fruit
      fruit = pickRandom(ALL_FRUITS, rng);
    }

    tiles.push({
      id: idx,
      row,
      col,
      fruit,
      stepNumber,
    });
  }

  return {
    id: `fpath_${Date.now()}_${randomInt(1000, 9999, rng)}`,
    gridSize,
    sequenceLength,
    tiles,
    pathSequence: pathTileIndices,
    pathFruits,
    memorizeSeconds,
    difficulty,
  };
}

/**
 * Validates player's clicked tile against the current step in the path
 */
export function validateFruitPathStep(
  round: FruitPathRound,
  userSelectedIds: number[],
  clickedTileId: number
): PathValidationResult {
  const currentStep = userSelectedIds.length;
  const expectedTileId = round.pathSequence[currentStep];
  const isCorrect = clickedTileId === expectedTileId;
  const nextSelection = isCorrect ? [...userSelectedIds, clickedTileId] : userSelectedIds;
  const isComplete = isCorrect && nextSelection.length === round.pathSequence.length;

  return {
    isCorrect,
    isComplete,
    currentIndex: nextSelection.length,
    totalLength: round.pathSequence.length,
    expectedTileId,
    revealedTileIds: nextSelection,
  };
}

/**
 * Calculates cognitive performance score for Fruit Memory Path
 */
export function calculateFruitPathScore(
  round: FruitPathRound,
  correctSteps: number,
  elapsedSeconds: number,
  replayedCount: number = 0
): { score: number; accuracy: number; points: number } {
  const accuracy = Math.round((correctSteps / round.sequenceLength) * 100);

  const diffMultiplier = round.difficulty === 'hard' ? 1.4 : round.difficulty === 'medium' ? 1.0 : 0.75;
  const replayPenalty = Math.max(0, replayedCount * 10);
  const timeBonus = Math.max(0, 30 - elapsedSeconds) * 2;

  const baseScore = accuracy * diffMultiplier;
  const score = Math.max(10, Math.min(100, Math.round(baseScore + timeBonus - replayPenalty)));

  // Platform practice points (10 to 60 based on difficulty and accuracy)
  const points = Math.round((score / 100) * (round.difficulty === 'hard' ? 50 : round.difficulty === 'medium' ? 35 : 20));

  return { score, accuracy, points };
}
