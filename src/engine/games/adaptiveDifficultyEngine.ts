import type { GameDifficulty } from './fruitPathEngine';

export interface GamePerformanceRecord {
  gameType: string;
  difficulty: GameDifficulty;
  accuracy: number; // 0 - 100
  timeSpentSeconds: number;
  completedAt: string;
}

export interface AdaptiveCalibration {
  recommendedDifficulty: GameDifficulty;
  status: 'advance' | 'maintain' | 'ease';
  explanation: string;
  averageAccuracy: number;
  recentRoundsCount: number;
}

export interface AdaptiveEvaluationOptions {
  gameId: string;
  currentDifficulty: GameDifficulty;
  accuracy: number;
  averageResponseTimeSeconds?: number;
  consecutiveSuccesses?: number;
  recentMistakes?: number;
}

export function evaluateAdaptiveDifficulty(
  gameTypeOrOptions: string | AdaptiveEvaluationOptions,
  historyOrDifficulty?: GamePerformanceRecord[] | GameDifficulty,
  currentDifficulty: GameDifficulty = 'medium'
): AdaptiveCalibration {
  let gameType = typeof gameTypeOrOptions === 'string' ? gameTypeOrOptions : gameTypeOrOptions.gameId;
  let history: GamePerformanceRecord[] = [];
  let diff: GameDifficulty = currentDifficulty;

  if (typeof gameTypeOrOptions !== 'string') {
    diff = gameTypeOrOptions.currentDifficulty;
    // Synthesize history from current round
    history = [
      {
        gameType: gameTypeOrOptions.gameId,
        difficulty: gameTypeOrOptions.currentDifficulty,
        accuracy: gameTypeOrOptions.accuracy,
        timeSpentSeconds: Math.round(gameTypeOrOptions.averageResponseTimeSeconds || 5),
        completedAt: new Date().toISOString(),
      },
    ];
    if ((gameTypeOrOptions.consecutiveSuccesses || 0) >= 1) {
      history.push({
        gameType: gameTypeOrOptions.gameId,
        difficulty: gameTypeOrOptions.currentDifficulty,
        accuracy: gameTypeOrOptions.accuracy,
        timeSpentSeconds: 5,
        completedAt: new Date().toISOString(),
      });
    } else if ((gameTypeOrOptions.recentMistakes || 0) >= 3) {
      history.push({
        gameType: gameTypeOrOptions.gameId,
        difficulty: gameTypeOrOptions.currentDifficulty,
        accuracy: Math.min(45, gameTypeOrOptions.accuracy),
        timeSpentSeconds: 10,
        completedAt: new Date().toISOString(),
      });
    }
  } else {
    history = Array.isArray(historyOrDifficulty) ? historyOrDifficulty : [];
    diff = typeof historyOrDifficulty === 'string' ? historyOrDifficulty : currentDifficulty;
  }

  // Filter for matching game records
  const relevant = history
    .filter(r => r.gameType === gameType || gameType === 'all')
    .slice(0, 5); // recent 5 rounds

  if (relevant.length === 0) {
    return {
      recommendedDifficulty: diff,
      status: 'maintain',
      explanation: 'Establishing baseline. Play 2–3 rounds to calibrate your personalized cognitive difficulty.',
      averageAccuracy: 0,
      recentRoundsCount: 0,
    };
  }

  const avgAcc = Math.round(
    relevant.reduce((acc, r) => acc + (r.accuracy || 0), 0) / relevant.length
  );

  // High performance: consecutive high accuracy
  if (relevant.length >= 2 && avgAcc >= 88) {
    if (currentDifficulty === 'easy') {
      return {
        recommendedDifficulty: 'medium',
        status: 'advance',
        explanation: `Strong mastery demonstrated (${avgAcc}% accuracy over ${relevant.length} rounds). Stepping up to Medium for deeper cognitive engagement.`,
        averageAccuracy: avgAcc,
        recentRoundsCount: relevant.length,
      };
    }
    if (currentDifficulty === 'medium') {
      return {
        recommendedDifficulty: 'hard',
        status: 'advance',
        explanation: `Exceptional working memory accuracy (${avgAcc}% average). Advancing to Hard to expand sequence span and distractor resistance.`,
        averageAccuracy: avgAcc,
        recentRoundsCount: relevant.length,
      };
    }
    return {
      recommendedDifficulty: 'hard',
      status: 'maintain',
      explanation: `Top-tier cognitive performance (${avgAcc}% on Hard). Continuing at peak challenge to build neuroplastic resilience.`,
      averageAccuracy: avgAcc,
      recentRoundsCount: relevant.length,
    };
  }

  // Struggling performance: low accuracy over multiple rounds
  if (relevant.length >= 2 && avgAcc < 55) {
    if (currentDifficulty === 'hard') {
      return {
        recommendedDifficulty: 'medium',
        status: 'ease',
        explanation: `Recent accuracy averaged ${avgAcc}%. Calibrating difficulty down to Medium to consolidate spatial mapping fundamentals.`,
        averageAccuracy: avgAcc,
        recentRoundsCount: relevant.length,
      };
    }
    if (currentDifficulty === 'medium') {
      return {
        recommendedDifficulty: 'easy',
        status: 'ease',
        explanation: `Accuracy averaged ${avgAcc}%. Easing pace to Easy to build steady recall rhythm without cognitive fatigue.`,
        averageAccuracy: avgAcc,
        recentRoundsCount: relevant.length,
      };
    }
  }

  // Balanced zone
  return {
    recommendedDifficulty: currentDifficulty,
    status: 'maintain',
    explanation: `Balanced challenge profile (${avgAcc}% accuracy). Optimal for sustainable memory consolidation at ${currentDifficulty.toUpperCase()} level.`,
    averageAccuracy: avgAcc,
    recentRoundsCount: relevant.length,
  };
}
