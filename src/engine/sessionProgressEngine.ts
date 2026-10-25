export interface PracticeSession {
  id: string;
  activityType: 'memory' | 'meditation' | 'chanting' | 'cultural' | 'focus' | 'discipline';
  activityId: string;
  activityTitle: string;
  startTime: string;
  completedAt: string;
  durationSeconds: number;
  completed: boolean;
  score?: number;
  attempts?: number;
  correctCount?: number;
  errorCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  metadata?: Record<string, any>;
}

export interface SessionComparison {
  hasBaseline: boolean;
  previousSession?: PracticeSession;
  summary: string;
  detail?: string;
  metricLabel?: string;
  currentValue?: string | number;
  previousValue?: string | number;
}

export interface PracticeMilestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'starter' | 'consistency' | 'diversity' | 'mastery';
  unlocked: boolean;
  unlockedAt?: string;
}

const MILESTONES_DEF: Omit<PracticeMilestone, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first verified practice session in any category.',
    icon: '🌱',
    category: 'starter'
  },
  {
    id: 'deep_breath',
    title: 'Deep Breath',
    description: 'Complete 3 guided breathwork or meditation sessions.',
    icon: '🌬️',
    category: 'mastery'
  },
  {
    id: 'memory_spark',
    title: 'Memory Spark',
    description: 'Complete 3 cognitive drills in the Memory Gym.',
    icon: '💡',
    category: 'mastery'
  },
  {
    id: 'cultural_roots',
    title: 'Cultural Anchor',
    description: 'Complete 3 cultural recitations or chanting practices.',
    icon: '📜',
    category: 'mastery'
  },
  {
    id: 'balanced_mind',
    title: 'Balanced Mind',
    description: 'Practice across at least 3 distinct activity categories.',
    icon: '⚖️',
    category: 'diversity'
  },
  {
    id: 'steady_cadence',
    title: 'Steady Cadence',
    description: 'Record practice sessions across 3 distinct calendar days.',
    icon: '📅',
    category: 'consistency'
  }
];

export function calculateSessionPoints(session: PracticeSession): number {
  if (!session.completed && session.durationSeconds < 60) return 0;
  const minutes = Math.max(1, Math.round(session.durationSeconds / 60));
  let basePoints = minutes * 3; // 3 points per minute of genuine practice
  if (session.completed) basePoints += 5; // 5 points completion bonus
  return Math.min(50, basePoints);
}

export function compareWithPreviousSession(
  current: PracticeSession,
  allSessions: PracticeSession[]
): SessionComparison {
  // Find earlier sessions with matching activityId or same activityType
  const earlierSessions = allSessions.filter(
    s => s.id !== current.id &&
         new Date(s.completedAt).getTime() < new Date(current.completedAt).getTime() &&
         (s.activityId === current.activityId || s.activityType === current.activityType)
  );

  if (earlierSessions.length === 0) {
    return {
      hasBaseline: false,
      summary: 'Baseline established — this is your first recorded session for this activity.',
      detail: 'Complete another session to see your factual comparison with past performance.'
    };
  }

  // Sort descending by completion time to find the immediately preceding session
  earlierSessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  const prev = earlierSessions[0];

  const currentDate = new Date(current.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const prevDate = new Date(prev.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // 1. If accuracy / items are recorded (Memory games)
  if (current.correctCount !== undefined && prev.correctCount !== undefined) {
    const diff = current.correctCount - prev.correctCount;
    const diffText = diff > 0 ? `+${diff}` : `${diff}`;
    const summary = diff > 0
      ? `You completed ${current.correctCount} items today, compared with ${prev.correctCount} on ${prevDate} (+${diff}).`
      : diff === 0
      ? `You matched your previous result of ${current.correctCount} items from ${prevDate}.`
      : `You completed ${current.correctCount} items today (${prev.correctCount} on ${prevDate}).`;

    return {
      hasBaseline: true,
      previousSession: prev,
      summary,
      metricLabel: 'Items Completed',
      currentValue: current.correctCount,
      previousValue: prev.correctCount
    };
  }

  // 2. If duration is the primary metric (Meditation / Chanting / Focus)
  const curMins = Math.round(current.durationSeconds / 60);
  const prevMins = Math.round(prev.durationSeconds / 60);
  const diffMins = curMins - prevMins;

  const durationSummary = diffMins > 0
    ? `You practiced for ${curMins} min today, compared with ${prevMins} min on ${prevDate} (+${diffMins} min).`
    : diffMins === 0
    ? `You maintained a steady ${curMins} min practice, matching your previous session on ${prevDate}.`
    : `You completed a focused ${curMins} min session today (${prevMins} min on ${prevDate}).`;

  return {
    hasBaseline: true,
    previousSession: prev,
    summary: durationSummary,
    metricLabel: 'Duration (Minutes)',
    currentValue: curMins,
    previousValue: prevMins
  };
}

export function evaluateMilestones(sessions: PracticeSession[]): PracticeMilestone[] {
  const completed = sessions.filter(s => s.completed || s.durationSeconds >= 60);

  const dates = new Set(completed.map(s => s.completedAt.split('T')[0]));
  const categories = new Set(completed.map(s => s.activityType));
  const meditationCount = completed.filter(s => s.activityType === 'meditation').length;
  const memoryCount = completed.filter(s => s.activityType === 'memory').length;
  const culturalCount = completed.filter(s => s.activityType === 'chanting' || s.activityType === 'cultural').length;

  return MILESTONES_DEF.map(def => {
    let unlocked = false;
    let unlockedAt: string | undefined = undefined;

    switch (def.id) {
      case 'first_step':
        unlocked = completed.length >= 1;
        if (unlocked) unlockedAt = completed[0].completedAt;
        break;
      case 'deep_breath':
        unlocked = meditationCount >= 3;
        break;
      case 'memory_spark':
        unlocked = memoryCount >= 3;
        break;
      case 'cultural_roots':
        unlocked = culturalCount >= 3;
        break;
      case 'balanced_mind':
        unlocked = categories.size >= 3;
        break;
      case 'steady_cadence':
        unlocked = dates.size >= 3;
        break;
    }

    return {
      ...def,
      unlocked,
      unlockedAt
    };
  });
}
