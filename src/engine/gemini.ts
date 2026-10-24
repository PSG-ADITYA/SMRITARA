import type { ChatMessage, DailyLog, Habit, MemorySession, MindfulnessSession, ProposedAction, UserProfile } from '../types';

export interface GroundedContext {
  user: UserProfile;
  habits: Habit[];
  recentLogs: DailyLog[];
  memorySessions: MemorySession[];
  mindfulnessSessions: MindfulnessSession[];
}

/**
 * Builds deterministic, grounded coach response when running offline or without Gemini API key.
 */
export function getOfflineCoachResponse(context: GroundedContext, userMessage: string): { text: string; proposedActions?: ProposedAction[] } {
  const { user, habits, recentLogs } = context;
  const lowerMsg = userMessage.toLowerCase();
  const latestLog = recentLogs.length > 0 ? recentLogs[recentLogs.length - 1] : null;

  // 1. If asking about chronotype or schedule
  if (lowerMsg.includes('chronotype') || lowerMsg.includes('body clock') || lowerMsg.includes('schedule') || lowerMsg.includes('wake')) {
    if (user.chronotypeProfile) {
      return {
        text: `Based on your Body Clock assessment, you are **${user.chronotypeProfile.label}**.

**Circadian Observation:** Your peak alertness window is **${user.chronotypeProfile.peakAlertness}**, with recommended deep work windows during: ${user.chronotypeProfile.focusWindows.join(', ')}.

**Actionable Advice:** ${user.chronotypeProfile.sleepAdvice}

Would you like me to align your daily task calendar with these physiological windows?`,
        proposedActions: [
          {
            id: 'action_sched_' + Date.now(),
            title: 'Apply Chronotype Schedule to Calendar',
            description: `Auto-configure your daily routine based on ${user.chronotypeProfile.label} guidelines.`,
            type: 'update_schedule',
            payload: { schedule: user.chronotypeProfile.schedule },
            status: 'pending'
          }
        ]
      };
    } else {
      return {
        text: `You haven't completed your free **Body Clock Assessment** yet. 

Understanding whether your circadian rhythm aligns with the Lion, Bear, Wolf, or Dolphin archetype is essential to schedule demanding cognitive work when your brain is naturally sharpest.

Visit the **Body Clock** tab to complete the 2-minute assessment.`,
      };
    }
  }

  // 2. If asking about habits or discipline
  if (lowerMsg.includes('habit') || lowerMsg.includes('discipline') || lowerMsg.includes('streak') || lowerMsg.includes('progress')) {
    const goodHabits = habits.filter(h => h.type === 'good');
    const badHabits = habits.filter(h => h.type === 'bad');
    const score = latestLog ? latestLog.disciplineScore : user.disciplineScore;

    return {
      text: `Here is a transparent review of your current discipline data:

* **Discipline Score:** **${score}/100** (Current Streak: **${user.currentStreak} Days**)
* **Configured Habits:** Tracking ${goodHabits.length} constructive habits and ${badHabits.length} impulse mitigations.
* **Target Benchmarks:** ${user.targetSleep}h sleep / ${user.targetScreenTime}h screen time limit.

${latestLog ? `On your last logged day (${latestLog.date}), you completed ${latestLog.completedHabitIds.length} good habit(s) and logged ${latestLog.sleepHours}h of sleep.` : 'No logs recorded for today yet. Make sure to complete your evening log.'}

**Grounded Recommendation:** Consistency compounds. Don't worry about hitting a perfect 100 every single day; focus on never missing two days in a row.`,
      proposedActions: [
        {
          id: 'action_habit_' + Date.now(),
          title: 'Add Habit: "15-Min Focused Reading"',
          description: 'Strengthen daily cognitive focus with a structured reading habit.',
          type: 'add_habit',
          payload: { name: '15-Min Focused Reading', type: 'good' },
          status: 'pending'
        }
      ]
    };
  }

  // 3. If asking about memory or brain training
  if (lowerMsg.includes('memory') || lowerMsg.includes('brain') || lowerMsg.includes('smriti') || lowerMsg.includes('focus')) {
    const memCount = context.memorySessions.length;
    return {
      text: `You have completed **${memCount} session(s)** in the Memory Gym.

**Cognitive Observation:** Engaging working memory with sequence and spatial pattern recall exercises stimulates neural plasticity and working memory capacity.

**Recommended Step:** Try a session of **Matrix Grid Memory** or the **Cultural Passage Recall** exercise to test verbal and spatial memory channels.`,
      proposedActions: [
        {
          id: 'action_mem_' + Date.now(),
          title: 'Start Matrix Pattern Exercise',
          description: 'Play a 2-minute spatial pattern recognition exercise.',
          type: 'memory_recommendation',
          payload: { gameType: 'matrix', difficulty: 'medium' },
          status: 'pending'
        }
      ]
    };
  }

  // 4. Default grounded response
  return {
    text: `Hello ${user.username || 'Friend'}, I am your **SMRITARA Life Coach**.

I synthesize your data across all 5 modules: Body Clock, Discipline OS, Memory Gym, Mindfulness Studio, and Personal Patterns.

**Current Status Overview:**
* **Discipline Score:** ${user.disciplineScore}/100 | **Streak:** ${user.currentStreak} Days
* **Sleep Target:** ${user.targetSleep}h | **Screen Limit:** ${user.targetScreenTime}h
* **Chronotype:** ${user.chronotypeProfile ? user.chronotypeProfile.label : 'Assessment Pending'}
* **Mindfulness Sessions Completed:** ${context.mindfulnessSessions.length}

How can I assist your personal growth journey today? You can ask me to analyze your daily habits, suggest schedule adjustments, or recommend focus sessions.`,
  };
}

/**
 * Communicates with Google Gemini via REST API using user API key or environment key.
 * Grounded with real user metrics and structured action generation.
 */
export async function sendCoachMessage(
  userApiKey: string | undefined,
  context: GroundedContext,
  userMessage: string,
  history: ChatMessage[]
): Promise<{ text: string; proposedActions?: ProposedAction[] }> {
  const { user, habits, recentLogs, memorySessions, mindfulnessSessions } = context;

  // Build grounded prompt context
  const systemPrompt = `You are the AI Life Coach for SMRITARA, a personal growth platform connecting:
1. Body Clock (chronotypes, circadian alertness, and adaptive daily schedules)
2. Discipline OS (transparent habits, sleep, screen time, focus sessions, discipline scores)
3. Memory Gym (cognitive engagement and working memory exercises inspired by Smriti Veda)
4. Mindfulness Studio (respiratory regulation and meditation)
5. Personal Pattern Engine (data-grounded behavioral insights)

CORE OPERATIONAL PRINCIPLES:
- DATA GROUNDED: Only make statements supported by the user's actual stored records provided below. NEVER fabricate sleep records, habit counts, or test scores.
- DISTINGUISH OBSERVATIONS FROM HYPOTHESES: Clearly separate observed facts ("You recorded 6.5h sleep on 3 days") from hypotheses ("This might correlate with lower afternoon energy") and actionable recommendations.
- NO MEDICAL DIAGNOSES: Never claim to diagnose clinical sleep disorders, depression, ADHD, or dementia.
- SUPPORTIVE & INTENTIONAL: Do NOT use abusive, shaming, or excessively harsh "Ares" rhetoric. Be clear, analytical, empowering, and practical.
- ACTION-ORIENTED: When relevant, suggest concrete application actions (such as adding a habit, adjusting schedule, or starting a mindfulness session).

USER DATA CONTEXT:
- Username: ${user.username}
- Current Discipline Score: ${user.disciplineScore}/100
- Consecutive Streak: ${user.currentStreak} Days
- Target Sleep: ${user.targetSleep} hours | Screen Time Limit: ${user.targetScreenTime} hours
- Chronotype Profile: ${user.chronotypeProfile ? `${user.chronotypeProfile.label} (Peak alertness: ${user.chronotypeProfile.peakAlertness})` : 'Not yet assessed'}
- Configured Habits (${habits.length}): ${habits.map(h => `${h.name} [${h.type}]`).join(', ') || 'None'}
- Recent Daily Logs (${recentLogs.length}):
${recentLogs.slice(-5).map(l => `  * ${l.date}: Sleep ${l.sleepHours}h, Screen ${l.screenTimeHours}h, Mood ${l.moodScore}/10, Energy ${l.energyScore}/10, Habits Completed: ${l.completedHabitIds.length}, Score: ${l.disciplineScore}/100`).join('\n') || '  No logs recorded yet.'}
- Memory Gym Sessions: ${memorySessions.length} sessions completed.
- Mindfulness Sessions: ${mindfulnessSessions.length} sessions recorded.

FORMATTING REQUIREMENT:
If you propose a specific application action for the user to approve, include an action block at the very end of your response in this exact format:
[ACTION:type={"title": "Action Title", "description": "Brief description", "actionType": "add_habit"|"update_schedule"|"mindfulness_recommendation", "payload": {}}]`;

  const conversationHistory = history.slice(-6).map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const contents = [
    ...conversationHistory,
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUSER MESSAGE: ${userMessage}` }]
    }
  ];

  // 1. Try secure backend proxy first if available (keeps API keys completely off client)
  try {
    const proxyController = new AbortController();
    const proxyTimeout = setTimeout(() => proxyController.abort(), 3500);

    const proxyRes = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: 800 } }),
      signal: proxyController.signal
    });
    clearTimeout(proxyTimeout);

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && data.available !== false && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return parseGeminiResponse(data.candidates[0].content.parts[0].text);
      }
    }
  } catch {
    // Backend proxy not reachable; continue to client BYOK or offline fallback
  }

  // 2. If client supplied a personal BYOK key in local settings
  const apiKey = userApiKey?.trim();
  if (!apiKey) {
    return getOfflineCoachResponse(context, userMessage);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      // If 404 or model unavailable, try gemini-1.5-flash
      const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: 800 } })
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Gemini API error: ${fallbackResponse.statusText}`);
      }
      const data = await fallbackResponse.json();
      return parseGeminiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseGeminiResponse(rawText);
  } catch (error) {
    console.warn('Gemini request failed, falling back to grounded rule engine:', error);
    const offlineResult = getOfflineCoachResponse(context, userMessage);
    return {
      text: offlineResult.text,
      proposedActions: offlineResult.proposedActions
    };
  }
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
