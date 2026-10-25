import { createSeededRandom, pickRandom, randomInt, shuffleArray } from './seededRandom';

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type DiceTheme = 'classic' | 'emerald' | 'amber' | 'ruby' | 'sapphire';

export interface GeneratedDie {
  id: number;
  position: number; // 0-based
  value: 1 | 2 | 3 | 4 | 5 | 6;
  colorTheme: DiceTheme;
  rotateX: number;
  rotateY: number;
}

export type DiceQuestionType = 'specific_face' | 'color_sum' | 'highest_value';

export interface DiceQuestion {
  id: string;
  type: DiceQuestionType;
  prompt: string;
  options: (number | string)[];
  correctAnswer: number | string;
  explanation: string;
}

export interface DiceRound {
  id: string;
  diceCount: number;
  dice: GeneratedDie[];
  memorizeSeconds: number;
  questions: DiceQuestion[];
  difficulty: GameDifficulty;
}

const THEMES: DiceTheme[] = ['emerald', 'amber', 'ruby', 'sapphire', 'classic'];

/**
 * Procedurally generates an authentic 3D Dice Memory round
 */
export function generateDiceRound(
  difficulty: GameDifficulty = 'medium',
  seed?: number | string
): DiceRound {
  const rng = createSeededRandom(seed);

  let diceCount = 3;
  let memorizeSeconds = 5;
  let questionCount = 2;

  if (difficulty === 'easy') {
    diceCount = 2;
    memorizeSeconds = 6;
    questionCount = 1;
  } else if (difficulty === 'medium') {
    diceCount = 4;
    memorizeSeconds = 5;
    questionCount = 2;
  } else {
    diceCount = 5;
    memorizeSeconds = 4.5;
    questionCount = 3;
  }

  const dice: GeneratedDie[] = [];
  const themePool = shuffleArray([...THEMES], rng);

  for (let i = 0; i < diceCount; i++) {
    const val = randomInt(1, 6, rng) as 1 | 2 | 3 | 4 | 5 | 6;
    const theme = themePool[i % themePool.length];
    // Gentle 3D rotations for clear viewing angles
    const rotX = randomInt(-25, 25, rng);
    const rotY = randomInt(15, 55, rng);

    dice.push({
      id: i + 1,
      position: i,
      value: val,
      colorTheme: theme,
      rotateX: rotX,
      rotateY: rotY,
    });
  }

  // Generate procedural questions based on the active scene
  const questions: DiceQuestion[] = [];

  // Question 1: Specific die value
  const targetDie = pickRandom(dice, rng);
  const correctVal = targetDie.value;
  const incorrectOptions = [1, 2, 3, 4, 5, 6].filter(v => v !== correctVal);
  const pickedIncorrect = shuffleArray(incorrectOptions, rng).slice(0, 3);
  const options1 = shuffleArray([correctVal, ...pickedIncorrect], rng);

  questions.push({
    id: `q_face_${targetDie.id}`,
    type: 'specific_face',
    prompt: `What was the front face value on Die #${targetDie.id} (${targetDie.colorTheme.toUpperCase()})?`,
    options: options1,
    correctAnswer: correctVal,
    explanation: `Die #${targetDie.id} (${targetDie.colorTheme}) had ${correctVal} pips.`,
  });

  // Question 2: Color Sum or Total Sum
  if (questionCount >= 2) {
    const totalSum = dice.reduce((acc, d) => acc + d.value, 0);
    const sumOptions = shuffleArray([
      totalSum,
      Math.max(diceCount, totalSum - randomInt(1, 3, rng)),
      totalSum + randomInt(1, 3, rng),
      totalSum + randomInt(4, 6, rng),
    ], rng);

    questions.push({
      id: 'q_total_sum',
      type: 'color_sum',
      prompt: `What was the sum total of all ${diceCount} visible dice faces?`,
      options: Array.from(new Set(sumOptions)),
      correctAnswer: totalSum,
      explanation: `The sum of values (${dice.map(d => d.value).join(' + ')}) equals ${totalSum}.`,
    });
  }

  // Question 3: Highest value die position (Hard mode)
  if (questionCount >= 3) {
    const maxVal = Math.max(...dice.map(d => d.value));
    const highestDice = dice.filter(d => d.value === maxVal);
    const targetHigh = highestDice[0];

    const options = dice.map(d => `Die #${d.id} (${d.colorTheme})`);

    questions.push({
      id: 'q_highest',
      type: 'highest_value',
      prompt: `Which die displayed the highest pip value (${maxVal})?`,
      options: shuffleArray(options, rng),
      correctAnswer: `Die #${targetHigh.id} (${targetHigh.colorTheme})`,
      explanation: `Die #${targetHigh.id} (${targetHigh.colorTheme}) had the highest value of ${maxVal}.`,
    });
  }

  return {
    id: `dice_${Date.now()}_${randomInt(1000, 9999, rng)}`,
    diceCount,
    dice,
    memorizeSeconds,
    questions,
    difficulty,
  };
}

/**
 * Validates player's answers for 3D Dice Memory
 */
export function validateDiceAnswers(
  round: DiceRound,
  userAnswers: Record<string, number | string>
): {
  isPerfect: boolean;
  accuracy: number;
  correctCount: number;
  totalQuestions: number;
  breakdown: { questionId: string; prompt: string; userAns: any; correctAns: any; isCorrect: boolean; explanation: string }[];
} {
  let correctCount = 0;
  const breakdown: any[] = [];

  round.questions.forEach(q => {
    const userAns = userAnswers[q.id];
    const isCorrect = String(userAns) === String(q.correctAnswer);
    if (isCorrect) correctCount++;

    breakdown.push({
      questionId: q.id,
      prompt: q.prompt,
      userAns,
      correctAns: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  });

  const totalQuestions = round.questions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  return {
    isPerfect: correctCount === totalQuestions,
    accuracy,
    correctCount,
    totalQuestions,
    breakdown,
  };
}

/**
 * Calculates score for 3D Dice Memory
 */
export function calculateDiceScore(
  round: DiceRound,
  accuracy: number,
  elapsedSeconds: number
): { score: number; points: number } {
  const diffMultiplier = round.difficulty === 'hard' ? 1.4 : round.difficulty === 'medium' ? 1.0 : 0.8;
  const speedBonus = Math.max(0, 25 - elapsedSeconds) * 2;

  const score = Math.max(10, Math.min(100, Math.round(accuracy * diffMultiplier + speedBonus)));
  const points = Math.round((score / 100) * (round.difficulty === 'hard' ? 55 : round.difficulty === 'medium' ? 40 : 25));

  return { score, points };
}
