import type { DailyLog, Habit } from '../types';

export interface ScoreBreakdown {
  total: number;
  sleepScore: number;
  screenScore: number;
  goodHabitsScore: number;
  badHabitsScore: number;
  tier: 'S-Tier' | 'A-Tier' | 'C-Tier' | 'Needs Focus';
}

/**
 * Computes transparent, deterministic discipline score (0 - 100).
 * Sleep: 20 pts max
 * Screen time: 20 pts max
 * Good habits completion: 30 pts max
 * Bad habits avoidance: 30 pts max
 */
export function calculateDailyDisciplineScore(
  sleepHours: number,
  targetSleep: number,
  screenTimeHours: number,
  targetScreenTime: number,
  userHabits: Habit[],
  completedHabitIds: string[]
): ScoreBreakdown {
  // A. Sleep Score (Max 20)
  const sleepDiff = Math.abs(sleepHours - targetSleep);
  let sleepScore = 0;
  if (sleepDiff <= 1.0) {
    sleepScore = 20;
  } else if (sleepDiff <= 2.0) {
    sleepScore = 10;
  } else {
    sleepScore = 0;
  }

  // B. Screen Time Score (Max 20)
  let screenScore = 0;
  if (screenTimeHours <= targetScreenTime) {
    screenScore = 20;
  } else if (screenTimeHours <= targetScreenTime + 2.0) {
    screenScore = 10;
  } else {
    screenScore = 0;
  }

  // C. Habits Scores (Max 60 total: 30 good, 30 bad avoidance)
  const goodHabits = userHabits.filter(h => h.type === 'good');
  const badHabits = userHabits.filter(h => h.type === 'bad');

  let goodHabitsScore = 30;
  if (goodHabits.length > 0) {
    const completedGoodCount = goodHabits.filter(h => completedHabitIds.includes(h.id)).length;
    goodHabitsScore = Math.round((completedGoodCount / goodHabits.length) * 30);
  }

  let badHabitsScore = 30;
  if (badHabits.length > 0) {
    // For bad habits, completedHabitIds tracks whether they slipped. If NOT in completedHabitIds, it was avoided!
    const avoidedCount = badHabits.filter(h => !completedHabitIds.includes(h.id)).length;
    badHabitsScore = Math.round((avoidedCount / badHabits.length) * 30);
  }

  const total = Math.max(0, Math.min(100, sleepScore + screenScore + goodHabitsScore + badHabitsScore));

  let tier: ScoreBreakdown['tier'] = 'Needs Focus';
  if (total >= 90) tier = 'S-Tier';
  else if (total >= 75) tier = 'A-Tier';
  else if (total >= 50) tier = 'C-Tier';

  return {
    total,
    sleepScore,
    screenScore,
    goodHabitsScore,
    badHabitsScore,
    tier
  };
}

/**
 * Calculates current consecutive streak from logged dates (allowing yesterday/today grace).
 */
export function calculateStreak(loggedDates: string[]): number {
  if (!loggedDates || loggedDates.length === 0) return 0;

  const dateSet = new Set(loggedDates);
  const now = new Date();
  
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let currentStreak = 0;
  let checkDate: Date;

  if (dateSet.has(todayStr)) {
    checkDate = new Date(now);
  } else if (dateSet.has(yesterdayStr)) {
    checkDate = new Date(yesterday);
  } else {
    return 0;
  }

  while (dateSet.has(formatDate(checkDate))) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return currentStreak;
}

/**
 * Calculates rolling average score over last 7 recorded days.
 */
export function calculateRollingScore(logs: DailyLog[]): number {
  if (!logs || logs.length === 0) return 0;
  const recent = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const sum = recent.reduce((acc, log) => acc + log.disciplineScore, 0);
  return Math.round(sum / recent.length);
}
