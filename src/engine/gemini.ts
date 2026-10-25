import type { ChatMessage, DailyLog, Habit, MemorySession, MindfulnessSession, ProposedAction, UserProfile } from '../types';

export interface GroundedContext {
  user: UserProfile;
  habits: Habit[];
  recentLogs: DailyLog[];
  memorySessions: MemorySession[];
  mindfulnessSessions: MindfulnessSession[];
}

/**
 * Standard, user-friendly response when the server-side AI model is temporarily unavailable.
 * Never exposes developer settings, environment variable names, or API keys to ordinary users.
 */
export function getUnavailableCoachResponse(userMessage?: string): { text: string; isUnavailable: boolean; proposedActions?: ProposedAction[] } {
  return {
    text: `Your AI Life Coach is temporarily unavailable. Please try again in a few moments.\n\nAll your personal logs, habit checklists, and cognitive exercises remain safely saved and fully accessible.`,
    isUnavailable: true
  };
}

/**
 * Communicates with Google Gemini via server-side proxy (/api/coach) configured via GEMINI_API_KEY.
 * Falls back gracefully to user-friendly notice without exposing internal errors.
 */
export async function sendCoachMessage(
  userApiKey: string | undefined,
  context: GroundedContext,
  userMessage: string,
  history: ChatMessage[]
): Promise<{ text: string; proposedActions?: ProposedAction[]; isUnavailable?: boolean }> {
  const { user, habits, recentLogs, memorySessions, mindfulnessSessions } = context;

  // Build grounded prompt context
  const systemPrompt = `You are the AI Life Coach for SMRITARA, a personal growth and cognitive mastery platform connecting:
1. Body Clock (chronotypes, circadian alertness, and adaptive daily schedules)
2. Discipline OS (transparent habits, sleep, screen time, focus sessions, discipline scores)
3. Smriti Veda (cognitive memory drills, shloka chanting, and cultural literature in Telugu, Sanskrit, Hindi, English)
4. Mindfulness Studio (respiratory regulation and meditation)
5. Personal Pattern Engine (data-grounded behavioral insights)

CORE OPERATIONAL PRINCIPLES:
- DATA GROUNDED: Only state facts supported by the user's actual stored records provided below. NEVER fabricate sleep records, habit counts, or test scores.
- DISTINGUISH OBSERVATIONS FROM HYPOTHESES: Clearly separate observed facts ("You recorded 6.5h sleep on 2 days") from hypotheses ("This might correlate with lower afternoon energy") and actionable recommendations.
- NO MEDICAL DIAGNOSES: Never claim to diagnose clinical sleep disorders, depression, ADHD, or dementia.
- SUPPORTIVE & INTENTIONAL: Be thoughtful, clear, analytical, empowering, and practical.
- MULTI-TURN AWARENESS: Maintain conversational context. If user provides new constraints (e.g. "I only have 15 minutes", "Include Telugu chanting"), adapt previous answers smoothly.
- CULTURAL AUTHENTICITY: When discussing verses or mantras, rely on verified cultural traditions and literature.

USER DATA CONTEXT:
- Name: ${user.username}
- Preferred Language: ${user.onboardingPreferences?.preferredLanguage || 'English'}
- Primary Goals: ${user.onboardingPreferences?.goals?.join(', ') || 'General growth'}
- Practice Time: ${user.onboardingPreferences?.practiceTime || 'flexible'} (${user.onboardingPreferences?.dailyPracticeMinutes || 15} min/day)
- Current Discipline Score: ${user.disciplineScore}/100 | Streak: ${user.currentStreak} Days
- Target Sleep: ${user.targetSleep} hours | Screen Time Limit: ${user.targetScreenTime} hours
- Chronotype Profile: ${user.chronotypeProfile ? `${user.chronotypeProfile.label} (Peak alertness: ${user.chronotypeProfile.peakAlertness})` : 'Not yet assessed'}
- Configured Habits (${habits.length}): ${habits.map(h => `${h.name} [${h.type}]`).join(', ') || 'None'}
- Recent Daily Logs (${recentLogs.length}):
${recentLogs.slice(-5).map(l => `  * ${l.date}: Sleep ${l.sleepHours}h, Screen ${l.screenTimeHours}h, Mood ${l.moodScore}/10, Energy ${l.energyScore}/10, Habits Completed: ${l.completedHabitIds.length}, Score: ${l.disciplineScore}/100`).join('\n') || '  No logs recorded yet.'}
- Memory Sessions: ${memorySessions.length} drills completed.
- Mindfulness Sessions: ${mindfulnessSessions.length} recorded.

FORMATTING REQUIREMENT:
If you propose a specific application action for the user to approve, include an action block at the very end of your response in this exact format:
[ACTION:type={"title": "Action Title", "description": "Brief description", "actionType": "add_habit"|"update_schedule"|"mindfulness_recommendation"|"memory_recommendation", "payload": {}}]`;

  // Build conversational turns
  const conversationHistory = history.slice(-8).map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model',
      parts: [{ text: `Understood. I am SMRITARA's AI Life Coach, fully grounded in ${user.username}'s recorded profile and preferences.` }]
    },
    ...conversationHistory,
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  // Primary secure path: Backend proxy (/api/coach) using server-side GEMINI_API_KEY
  try {
    const proxyController = new AbortController();
    const proxyTimeout = setTimeout(() => proxyController.abort(), 25000);

    const proxyRes = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1000 } }),
      signal: proxyController.signal
    });
    clearTimeout(proxyTimeout);

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && data.available !== false) {
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return parseGeminiResponse(data.candidates[0].content.parts[0].text);
        } else if (typeof data.reply === 'string' && data.reply.trim().length > 0) {
          return parseGeminiResponse(data.reply);
        }
      } else if (data && data.error) {
        return {
          text: `AI Life Coach notice: ${data.error}. Practice records, routines, and daily logs remain fully accessible.`,
          isUnavailable: true
        };
      }
    } else if (proxyRes.status === 429) {
      return {
        text: 'The AI Life Coach is receiving high query volume (rate limit reached). Please wait a moment before sending your next reflection.',
        isUnavailable: true
      };
    } else if (proxyRes.status === 502 || proxyRes.status === 503) {
      return {
        text: 'The AI Life Coach service is temporarily unreachable upstream. Your habits, daily check-ins, and cognitive sessions are safely saved.',
        isUnavailable: true
      };
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        text: 'The request to your AI Life Coach timed out. Please check your connection and try again.',
        isUnavailable: true
      };
    }
    console.warn('Backend /api/coach proxy request failed:', err?.message || err);
  }

  // Clean, professional user-facing notice
  return getUnavailableCoachResponse(userMessage);
}

function parseGeminiResponse(rawText: string): { text: string; proposedActions?: ProposedAction[] } {
  const actionRegex = /\[ACTION:type=({.*?})\]/s;
  const match = rawText.match(actionRegex);

  let cleanText = rawText.replace(actionRegex, '').trim();
  const proposedActions: ProposedAction[] = [];

  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      proposedActions.push({
        id: 'action_' + Date.now(),
        title: parsed.title || 'Recommended Action',
        description: parsed.description || '',
        type: parsed.actionType || 'add_habit',
        payload: parsed.payload || {},
        status: 'pending'
      });
    } catch (e) {
      console.error('Failed to parse action JSON:', e);
    }
  }

  return { text: cleanText, proposedActions };
}
