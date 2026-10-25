import type { OnboardingPreferences, PersonalizedPlanItem } from '../types';

export function generatePersonalizedPlan(prefs: OnboardingPreferences): PersonalizedPlanItem[] {
  const plan: PersonalizedPlanItem[] = [];
  const lang = prefs.preferredLanguage;
  const mins = prefs.dailyPracticeMinutes || 15;

  // 1. Cognitive game recommendation based on interests
  if (prefs.interests.includes('games') || prefs.interests.includes('cognitive') || prefs.goals.includes('memory')) {
    plan.push({
      id: 'plan_cog_' + Date.now(),
      title: 'Object & Spatial Memory Gym',
      category: 'cognitive',
      durationMinutes: Math.min(5, Math.floor(mins * 0.3)),
      reason: 'Calibrates visual working memory and active attention span.',
      actionTab: 'smritiveda',
      completed: false
    });
  } else {
    plan.push({
      id: 'plan_cog_' + Date.now(),
      title: 'Pattern & Sequence Working Memory',
      category: 'cognitive',
      durationMinutes: Math.min(5, Math.floor(mins * 0.3)),
      reason: 'Strengthens neural retrieval pathways through short interval recall.',
      actionTab: 'smritiveda',
      completed: false
    });
  }

  // 2. Cultural learning item adapted to preferred language
  let culturalTitle = 'Daily Cultural Wisdom Verse';
  let culturalReason = 'Cultivates mindfulness and philosophical contemplation.';

  if (lang === 'telugu') {
    culturalTitle = 'తెలుగు పద్య సాధన: వేమన & సుమతి శతకాలు';
    culturalReason = 'Recite Vemana moral verses to train oral rhythm and linguistic memory.';
  } else if (lang === 'hindi') {
    culturalTitle = 'कबीर & रहीम दोहे: आत्म-चिंतन एवं विचार';
    culturalReason = 'Reflective couplets for emotional grounding and internal self-awareness.';
  } else if (prefs.interests?.includes('chanting')) {
    culturalTitle = 'Sanskrit Mantra Chanting: Gayatri & Shanti';
    culturalReason = 'Repetitive shloka meter calms neural activity and builds focused recall.';
  } else {
    culturalTitle = 'Philosophical Reflection & Truth Passages';
    culturalReason = 'Universal ethical wisdom for mental clarity and stoic resilience.';
  }

  plan.push({
    id: 'plan_cult_' + (Date.now() + 1),
    title: culturalTitle,
    category: 'cultural',
    durationMinutes: Math.min(10, Math.floor(mins * 0.4)),
    reason: culturalReason,
    actionTab: 'smritiveda',
    completed: false
  });

  // 3. Mindfulness or breathwork
  const mindfulnessMins = Math.max(3, mins - 10);
  plan.push({
    id: 'plan_mind_' + (Date.now() + 2),
    title: 'Box Breathing & Heart Coherence',
    category: 'mindfulness',
    durationMinutes: mindfulnessMins,
    reason: 'Down-regulates physiological arousal to prepare for focused deep work.',
    actionTab: 'mindfulness',
    completed: false
  });

  // 4. One achievable foundational habit matching goals
  let habitName = 'Morning Sunlight & Hydration';
  if (prefs.goals.includes('focus')) {
    habitName = '25-Min Single-Task Focus Sprint';
  } else if (prefs.goals.includes('habits')) {
    habitName = 'Evening Digital Sunset (30m screen-off)';
  } else if (prefs.goals.includes('cultural')) {
    habitName = '5-Min Daily Shloka / Poem Reflection';
  }

  plan.push({
    id: 'plan_hab_' + (Date.now() + 3),
    title: `Key Keystone Habit: "${habitName}"`,
    category: 'habit',
    durationMinutes: 5,
    reason: 'Consistent small daily actions establish durable compounding momentum.',
    actionTab: 'discipline',
    completed: false
  });

  return plan;
}
