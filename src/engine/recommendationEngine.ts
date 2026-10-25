import type { PracticeSession } from './sessionProgressEngine';
import type { InterfaceLanguage } from '../types';

export interface SuggestedActivity {
  id: string;
  activityType: 'memory' | 'meditation' | 'chanting' | 'cultural' | 'focus';
  activityId: string;
  title: string;
  durationMinutes: 5 | 7 | 10;
  targetTab: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  categoryLabel: string;
}

export function generateDailyRecommendations(
  sessions: PracticeSession[],
  preferredDuration: 5 | 7 | 10 = 7,
  interfaceLang: InterfaceLanguage = 'english',
  dismissedIds: string[] = []
): SuggestedActivity[] {
  const completed = sessions.filter(s => s.completed || s.durationSeconds >= 60);

  // Analyze recent categories
  const recentCategories = completed.slice(-5).map(s => s.activityType);
  const memorySessions = completed.filter(s => s.activityType === 'memory');
  
  // Calculate recent memory accuracy for difficulty adaptation
  let suggestedDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (memorySessions.length >= 2) {
    const lastTwo = memorySessions.slice(-2);
    const avgScore = lastTwo.reduce((acc, s) => acc + (s.score || 70), 0) / 2;
    if (avgScore > 85) suggestedDifficulty = 'hard';
    else if (avgScore < 50) suggestedDifficulty = 'easy';
    else suggestedDifficulty = 'medium';
  }

  const pool: SuggestedActivity[] = [
    {
      id: 'rec_box_breathing',
      activityType: 'meditation',
      activityId: 'box_breathing',
      title: 'Box Breathing Grounding',
      durationMinutes: preferredDuration,
      targetTab: 'meditation',
      difficulty: 'easy',
      categoryLabel: 'Respiratory Regulation',
      reason: recentCategories.includes('meditation')
        ? 'Reinforces calm autonomic balance practiced recently.'
        : 'Recommended to balance cognitive work with centered breath awareness.'
    },
    {
      id: 'rec_memory_sequence',
      activityType: 'memory',
      activityId: 'sequence_chimes',
      title: 'Sequence Chime Recall',
      durationMinutes: preferredDuration,
      targetTab: 'games',
      difficulty: suggestedDifficulty,
      categoryLabel: 'Working Memory',
      reason: memorySessions.length > 0
        ? `Tuned to ${suggestedDifficulty} difficulty based on your recent drill performance.`
        : 'Initial working memory benchmark to test auditory and visual recall.'
    },
    {
      id: 'rec_cultural_recitation',
      activityType: 'cultural',
      activityId: 'sanskrit_gayatri',
      title: 'Gāyatrī Mantra & Reflection',
      durationMinutes: preferredDuration,
      targetTab: 'library',
      difficulty: 'easy',
      categoryLabel: 'Cultural Resonance',
      reason: 'Brings contemplation and clear articulation to your daily rhythm.'
    },
    {
      id: 'rec_matrix_memory',
      activityType: 'memory',
      activityId: 'spatial_matrix',
      title: 'Spatial Matrix Pattern',
      durationMinutes: preferredDuration,
      targetTab: 'games',
      difficulty: suggestedDifficulty,
      categoryLabel: 'Spatial Cognition',
      reason: 'Challenges visual retention and spatial pattern recognition.'
    },
    {
      id: 'rec_loving_kindness',
      activityType: 'meditation',
      activityId: 'loving_kindness',
      title: 'Loving-Kindness Meditation',
      durationMinutes: preferredDuration,
      targetTab: 'meditation',
      difficulty: 'easy',
      categoryLabel: 'Emotional Well-Being',
      reason: 'Cultivates patience, goodwill, and resilience for challenging interactions.'
    }
  ];

  // Filter out dismissed suggestions
  const filtered = pool.filter(item => !dismissedIds.includes(item.id));

  // Rotate based on day of month to avoid staleness
  const dayOfMonth = new Date().getDate();
  const rotated = [...filtered.slice(dayOfMonth % filtered.length), ...filtered.slice(0, dayOfMonth % filtered.length)];

  return rotated.slice(0, 3);
}
