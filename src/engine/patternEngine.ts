import type { DailyLog, FocusSession, Habit, MemorySession, MindfulnessSession, PatternInsight } from '../types';

export function computePatternInsights(
  logs: DailyLog[],
  focusSessions: FocusSession[],
  mindfulnessSessions: MindfulnessSession[],
  memorySessions: MemorySession[],
  habits: Habit[]
): PatternInsight[] {
  const insights: PatternInsight[] = [];
  const logCount = logs.length;

  if (logCount < 2) {
    return [
      {
        id: 'initial_state',
        title: 'Calibrating Your Baseline',
        observation: `You have recorded ${logCount} day(s) of activity so far.`,
        hypothesis: 'Cross-module correlation engines require consistent voluntary data points to uncover statistically reliable relationships.',
        recommendation: 'Log your sleep, habits, and mood for at least 3 to 7 consecutive days to reveal your initial personal patterns.',
        confidence: 'Preliminary (3+ days)',
        metricPair: 'Data Volume',
        sampleCount: logCount
      }
    ];
  }

  // 1. Relationship: Sleep Duration vs Reported Energy / Mood
  const validSleepLogs = logs.filter(l => l.sleepHours > 0 && l.energyScore > 0);
  if (validSleepLogs.length >= 3) {
    const avgSleep = validSleepLogs.reduce((acc, l) => acc + l.sleepHours, 0) / validSleepLogs.length;
    const highSleepDays = validSleepLogs.filter(l => l.sleepHours >= avgSleep);
    const lowSleepDays = validSleepLogs.filter(l => l.sleepHours < avgSleep);

    if (highSleepDays.length > 0 && lowSleepDays.length > 0) {
      const avgEnergyHighSleep = highSleepDays.reduce((acc, l) => acc + l.energyScore, 0) / highSleepDays.length;
      const avgEnergyLowSleep = lowSleepDays.reduce((acc, l) => acc + l.energyScore, 0) / lowSleepDays.length;
      const diff = avgEnergyHighSleep - avgEnergyLowSleep;

      if (Math.abs(diff) >= 0.8) {
        insights.push({
          id: 'sleep_vs_energy',
          title: 'Sleep Duration & Subjective Energy',
          observation: `On days with >= ${avgSleep.toFixed(1)}h sleep, your reported energy averaged ${avgEnergyHighSleep.toFixed(1)}/10, compared to ${avgEnergyLowSleep.toFixed(1)}/10 on shorter sleep days.`,
          hypothesis: 'Adequate nocturnal sleep cycles appear to strongly support your subjective vitality and cognitive readiness the following day.',
          recommendation: 'Protect your bedtime window by initiating your wind-down routine 45 minutes earlier when demanding days are scheduled.',
          confidence: validSleepLogs.length >= 7 ? 'Moderate (7+ days)' : 'Preliminary (3+ days)',
          metricPair: 'Sleep vs Energy',
          sampleCount: validSleepLogs.length
        });
      }
    }
  }

  // 2. Relationship: Habit Consistency vs Mood Score
  if (logs.length >= 3 && habits.length > 0) {
    const goodHabits = habits.filter(h => h.type === 'good');
    if (goodHabits.length > 0) {
      const completionRates = logs.map(l => {
        const completedCount = goodHabits.filter(h => l.completedHabitIds.includes(h.id)).length;
        const rate = completedCount / goodHabits.length;
        return { rate, mood: l.moodScore };
      });

      const highHabitDays = completionRates.filter(c => c.rate >= 0.6);
      const lowHabitDays = completionRates.filter(c => c.rate < 0.6);

      if (highHabitDays.length > 0 && lowHabitDays.length > 0) {
        const avgMoodHigh = highHabitDays.reduce((acc, c) => acc + c.mood, 0) / highHabitDays.length;
        const avgMoodLow = lowHabitDays.reduce((acc, c) => acc + c.mood, 0) / lowHabitDays.length;

        if (avgMoodHigh - avgMoodLow >= 0.7) {
          insights.push({
            id: 'habit_vs_mood',
            title: 'Habit Execution & Daily Mood',
            observation: `Days where you achieved >= 60% of your good habits correlated with an average mood score of ${avgMoodHigh.toFixed(1)}/10, vs ${avgMoodLow.toFixed(1)}/10 on lower adherence days.`,
            hypothesis: 'Completing intentional positive habits triggers self-efficacy and dopamine satisfaction, positively reinforcing your day.',
            recommendation: 'When feeling low on willpower, focus on completing just 1 high-impact habit (e.g. water or 15m walk) rather than attempting perfection.',
            confidence: logs.length >= 7 ? 'Moderate (7+ days)' : 'Preliminary (3+ days)',
            metricPair: 'Habits vs Mood',
            sampleCount: logs.length
          });
        }
      }
    }
  }

  // 3. Relationship: Mindfulness Practice vs Productivity / Stress Recovery
  if (mindfulnessSessions.length >= 2 && logs.length >= 3) {
    const sessionDates = new Set(mindfulnessSessions.map(s => s.date));
    const daysWithMeditation = logs.filter(l => sessionDates.has(l.date));
    const daysWithoutMeditation = logs.filter(l => !sessionDates.has(l.date));

    if (daysWithMeditation.length > 0 && daysWithoutMeditation.length > 0) {
      const avgProdMed = daysWithMeditation.reduce((acc, l) => acc + l.productivityScore, 0) / daysWithMeditation.length;
      const avgProdNoMed = daysWithoutMeditation.reduce((acc, l) => acc + l.productivityScore, 0) / daysWithoutMeditation.length;

      insights.push({
        id: 'mindfulness_vs_productivity',
        title: 'Mindfulness Practice & Focus Productivity',
        observation: `On days containing mindfulness or breathing exercises, your self-rated productivity was ${avgProdMed.toFixed(1)}/10 vs ${avgProdNoMed.toFixed(1)}/10 on days without.`,
        hypothesis: 'Intentional vagal nerve stimulation and calm pauses prevent cognitive fatigue and attention scattering.',
        recommendation: 'Integrate a short 3-minute box breathing session before starting your highest priority deep work block.',
        confidence: daysWithMeditation.length >= 5 ? 'Moderate (7+ days)' : 'Preliminary (3+ days)',
        metricPair: 'Mindfulness vs Productivity',
        sampleCount: mindfulnessSessions.length
      });
    }
  }

  // 4. Memory Gym Progress & Cognitive Accuracy Over Time
  if (memorySessions.length >= 3) {
    const sorted = [...memorySessions].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const avgAccFirst = firstHalf.reduce((acc, s) => acc + s.accuracy, 0) / firstHalf.length;
    const avgAccSecond = secondHalf.reduce((acc, s) => acc + s.accuracy, 0) / secondHalf.length;
    const progressDiff = avgAccSecond - avgAccFirst;

    insights.push({
      id: 'memory_gym_adaptation',
      title: 'Cognitive Engagement Trend',
      observation: `Across ${memorySessions.length} sessions, your average accuracy shifted from ${avgAccFirst.toFixed(0)}% to ${avgAccSecond.toFixed(0)}% (${progressDiff >= 0 ? '+' : ''}${progressDiff.toFixed(0)}%).`,
      hypothesis: 'Consistent retrieval practice engages working memory pathways and sharpens selective attention.',
      recommendation: 'To maintain healthy cognitive stimulation, alternate between spatial matrix recall and verbal cultural passage exercises.',
      confidence: memorySessions.length >= 6 ? 'Moderate (7+ days)' : 'Preliminary (3+ days)',
      metricPair: 'Memory Practice vs Accuracy',
      sampleCount: memorySessions.length
    });
  }

  // Fallback default insight if no sharp correlations yet
  if (insights.length === 0) {
    insights.push({
      id: 'rhythm_stability',
      title: 'Establishing Rhythm & Consistency',
      observation: `You have logged ${logCount} day(s) of metrics with a current discipline score of ${logs[logs.length - 1]?.disciplineScore ?? 0}/100.`,
      hypothesis: 'Human performance patterns become distinct and actionable after 5 to 7 days of synchronized tracking.',
      recommendation: 'Keep recording your daily benchmarks and complete at least one focus session today.',
      confidence: 'Preliminary (3+ days)',
      metricPair: 'General Rhythm',
      sampleCount: logCount
    });
  }

  return insights;
}
