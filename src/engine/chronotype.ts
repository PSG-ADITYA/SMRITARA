import type { Chronotype, ChronotypeProfile, DailyScheduleBlock } from '../types';

export interface AssessmentQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    score: number; // 1 (strong evening) to 4 (strong morning)
    detail?: string;
  }[];
}

export const CHRONOTYPE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'wake_unrestricted',
    question: 'When completely free of alarms and work commitments, what time do you naturally wake up?',
    description: 'Think about a quiet holiday or weekend with no obligations.',
    options: [
      { text: '05:00 – 06:30 AM', score: 4, detail: 'Early natural awakening' },
      { text: '06:30 – 08:00 AM', score: 3, detail: 'Moderate morning riser' },
      { text: '08:00 – 09:30 AM', score: 2, detail: 'Late morning riser' },
      { text: '09:30 AM or later', score: 1, detail: 'Natural night owl' },
    ]
  },
  {
    id: 'bed_unrestricted',
    question: 'If you have no early obligations the next day, what time do you naturally feel ready for sleep?',
    description: 'Look for when genuine physical sleepiness sets in.',
    options: [
      { text: '09:00 – 10:30 PM', score: 4, detail: 'Early fatigue onset' },
      { text: '10:30 – 11:45 PM', score: 3, detail: 'Balanced evening' },
      { text: '11:45 PM – 01:15 AM', score: 2, detail: 'Late night vigilance' },
      { text: '01:15 AM or later', score: 1, detail: 'Extended nocturnal alertness' },
    ]
  },
  {
    id: 'peak_focus',
    question: 'At what time of day do you feel your sharpest mental clarity for demanding cognitive tasks?',
    description: 'Such as coding, complex analysis, writing, or studying.',
    options: [
      { text: 'Early Morning (07:00 – 10:30 AM)', score: 4 },
      { text: 'Late Morning to Early Afternoon (10:30 AM – 02:00 PM)', score: 3 },
      { text: 'Late Afternoon to Dusk (03:30 – 07:00 PM)', score: 2 },
      { text: 'Late Evening or Night (08:00 PM – Midnight)', score: 1 },
    ]
  },
  {
    id: 'waking_ease',
    question: 'How do you feel in the first 20 minutes after waking on a typical morning?',
    description: 'Rate your transition out of sleep inertia.',
    options: [
      { text: 'Alert and energized almost immediately', score: 4 },
      { text: 'Mildly groggy for 10 minutes, then ready to go', score: 3 },
      { text: 'Sluggish; I definitely need coffee, water, and warm-up time', score: 2 },
      { text: 'Exhausted; heavy sleep inertia regardless of sleep length', score: 1 },
    ]
  },
  {
    id: 'schedule_contrast',
    question: 'How large is the difference between your weekday waking time and your weekend waking time?',
    description: 'Also known as social jetlag.',
    options: [
      { text: 'Negligible (under 30 minutes difference)', score: 4 },
      { text: 'Moderate (around 1 to 1.5 hours difference)', score: 3 },
      { text: 'Significant (2 to 3 hours shift on weekends)', score: 2 },
      { text: 'Extreme (3+ hours variation or flip-flopping schedule)', score: 1 },
    ]
  },
  {
    id: 'evening_alertness',
    question: 'Around 09:30 PM, which best describes your mental state?',
    description: 'Assesses circadian wind-down melatonin progression.',
    options: [
      { text: 'Drowsy and ready to wind down for bed', score: 4 },
      { text: 'Relaxed, ready for light reading or leisure', score: 3 },
      { text: 'A second wind of energy and creative thoughts', score: 2 },
      { text: 'Peak cognitive sharpness and active focus', score: 1 },
    ]
  },
  {
    id: 'sleep_quality',
    question: 'How would you describe your overall sleep continuity and lightness?',
    options: [
      { text: 'Deep and uninterrupted; rarely wake up during the night', score: 3 },
      { text: 'Standard; wake up once occasionally, fall back asleep quickly', score: 2 },
      { text: 'Very light; easily stirred by slight noises, lights, or racing thoughts', score: 1 },
    ]
  }
];

export function evaluateChronotype(answers: Record<string, number>, commitments?: string): ChronotypeProfile {
  // Score range: 7 to 27
  const totalScore = Object.values(answers).reduce((acc, s) => acc + s, 0);
  const isLightSleeper = answers['sleep_quality'] === 1;

  let chronotype: Chronotype;
  let label: string;
  let tagline: string;
  let description: string;
  let peakAlertness: string;
  let focusWindows: string[];
  let sleepAdvice: string;

  if (isLightSleeper && totalScore < 20) {
    chronotype = 'dolphin';
    label = 'The Dolphin (Adaptive / Light Rhythm)';
    tagline = 'High-intelligence, sensitive nervous system that benefits from rhythmic pacing.';
    description = 'You experience light sleep and periodic surges of mental alertness throughout the day. Rather than forcing long marathon blocks, your brain performs best with structured 45-minute sprints and consistent wind-down rituals to prevent sensory overload.';
    peakAlertness = 'Mid-Afternoon (03:00 PM – 07:00 PM)';
    focusWindows = ['10:00 AM – 11:45 AM', '03:30 PM – 06:30 PM'];
    sleepAdvice = 'Keep bedroom pitch black, cool (18°C/65°F), and stop screen illumination 60 minutes before bed. Don\'t stress in bed if awake; use box breathing.';
  } else if (totalScore >= 22) {
    chronotype = 'lion';
    label = 'The Lion (Early Morning Riser)';
    tagline = 'Proactive, early-peaking circadian drive with clear morning dominance.';
    description = 'You wake up naturally early and experience your highest analytical focus in the morning hours. By late afternoon, your cognitive stamina winds down, making evenings ideal for social connection, reflection, and early restorative sleep.';
    peakAlertness = 'Early Morning (07:30 AM – 11:30 AM)';
    focusWindows = ['08:00 AM – 11:30 AM', '02:00 PM – 04:00 PM'];
    sleepAdvice = 'Prioritize consistent 09:45 – 10:30 PM bedtimes. Protect your morning golden hours from low-value meetings or distractions.';
  } else if (totalScore >= 16) {
    chronotype = 'bear';
    label = 'The Bear (Solar / Balanced Tracker)';
    tagline = 'Aligned with solar cycles, steady endurance, and balanced energy distribution.';
    description = 'You comprise roughly 50% of the population. Your energy tracks the sun: you wake smoothly around 07:00 AM, reach deep analytical flow by late morning, experience a natural mid-afternoon dip, and wind down comfortably around 11:00 PM.';
    peakAlertness = 'Late Morning (10:00 AM – 02:00 PM)';
    focusWindows = ['10:00 AM – 01:30 PM', '04:00 PM – 06:00 PM'];
    sleepAdvice = 'Aim for 7.5 to 8 hours. Take a 15-minute natural light break around 02:00 PM to smoothly bridge the afternoon slump without excessive caffeine.';
  } else {
    chronotype = 'wolf';
    label = 'The Wolf (Evening / Nocturnal Riser)';
    tagline = 'Creative night focus, late-shifted circadian alertness, and sustained evening flow.';
    description = 'Your natural circadian pacemaker produces melatonin later in the night. Mornings require a gradual transition, but your mental sharpness peaks when the world quietens down in the late afternoon and evening hours.';
    peakAlertness = 'Late Afternoon & Evening (04:30 PM – 10:00 PM)';
    focusWindows = ['01:30 PM – 04:30 PM', '06:30 PM – 09:30 PM'];
    sleepAdvice = 'If college or work requires early rising, anchor your morning with immediate sunlight, cold water, and high-protein breakfast. Shift creative work to dusk.';
  }

  // Generate realistic schedule tailored to chronotype and real-life commitments
  const schedule = generateScheduleForChronotype(chronotype, commitments);

  return {
    chronotype,
    score: totalScore,
    label,
    tagline,
    description,
    peakAlertness,
    focusWindows,
    sleepAdvice,
    schedule,
    completedAt: new Date().toISOString()
  };
}

export function generateScheduleForChronotype(chronotype: Chronotype, commitments?: string): DailyScheduleBlock[] {
  const isEarlyConstraint = commitments?.toLowerCase().includes('early') || 
                            commitments?.toLowerCase().includes('college') || 
                            commitments?.toLowerCase().includes('office');

  switch (chronotype) {
    case 'lion':
      return [
        { id: '1', title: 'Gentle Rise & Sunlight Hydration', startTime: '06:00', endTime: '06:45', category: 'personal', notes: 'Drink 500ml water, view outdoor natural light.' },
        { id: '2', title: 'Golden Hour Deep Work (Core Task)', startTime: '07:30', endTime: '10:30', category: 'deep_work', notes: 'Highest cognitive clarity of the day. No notifications.' },
        { id: '3', title: 'Collaborative / Secondary Tasks', startTime: '11:00', endTime: '13:00', category: 'light_work', notes: 'Emails, team syncs, admin work.' },
        { id: '4', title: 'Nourishment & Restorative Walk', startTime: '13:00', endTime: '14:00', category: 'personal', notes: 'Balanced meal and light movement.' },
        { id: '5', title: 'Afternoon Focus Sprint', startTime: '14:30', endTime: '16:00', category: 'deep_work', notes: 'Reviewing code, documentation, or study review.' },
        { id: '6', title: 'Exercise / Physical Movement', startTime: '16:30', endTime: '17:30', category: 'exercise', notes: 'Strength, cardio, or outdoor sport.' },
        { id: '7', title: 'Mindfulness & Digital Wind-Down', startTime: '20:30', endTime: '21:30', category: 'wind_down', notes: 'Breathing exercise, journal, dim amber lighting.' },
        { id: '8', title: 'Restorative Sleep', startTime: '22:00', endTime: '06:00', category: 'sleep', notes: 'Deep 8-hour circadian recovery.' },
      ];

    case 'wolf':
      // Provide realistic schedule if user has early college/work commitments
      return [
        { id: '1', title: isEarlyConstraint ? 'Wake & Cold Splash Protocol' : 'Natural Awakening & Sunlight', startTime: isEarlyConstraint ? '07:00' : '08:30', endTime: isEarlyConstraint ? '07:45' : '09:15', category: 'personal', notes: 'Immediate exposure to bright light to shut down melatonin.' },
        { id: '2', title: 'Warm-up / Light Analytical Tasks', startTime: isEarlyConstraint ? '08:30' : '09:30', endTime: '11:30', category: 'light_work', notes: 'Reading, task breakdown, emails before heavy processing.' },
        { id: '3', title: 'Nutritious Lunch & Mental Break', startTime: '12:30', endTime: '13:30', category: 'personal', notes: 'Steady protein, short walk.' },
        { id: '4', title: 'First Deep Work Sprint', startTime: '14:00', endTime: '16:30', category: 'deep_work', notes: 'Brain ramping up to full gear.' },
        { id: '5', title: 'Physical Training / Mobility', startTime: '17:00', endTime: '18:00', category: 'exercise', notes: 'Wolves perform exceptionally well in late afternoon workouts.' },
        { id: '6', title: 'Peak Flow Deep Work (Zone In)', startTime: '18:30', endTime: '21:00', category: 'deep_work', notes: 'Your natural peak focus window. High creative and problem solving output.' },
        { id: '7', title: 'Mindfulness Studio & Screen Cutoff', startTime: '22:30', endTime: '23:30', category: 'wind_down', notes: 'Audio-only, 4-7-8 breathing, zero blue light.' },
        { id: '8', title: 'Sleep', startTime: '23:45', endTime: isEarlyConstraint ? '07:00' : '08:30', category: 'sleep', notes: 'Dark, quiet, cold environment.' },
      ];

    case 'dolphin':
      return [
        { id: '1', title: 'Gentle Rise & 5-min Box Breathing', startTime: '06:45', endTime: '07:30', category: 'personal', notes: 'Soften morning sympathetic nervous activation.' },
        { id: '2', title: 'Morning Analytical Sprint', startTime: '08:30', endTime: '10:30', category: 'deep_work', notes: 'Focus on 1 priority before attention fragments.' },
        { id: '3', title: 'Light Admin & Walking Break', startTime: '11:00', endTime: '12:30', category: 'light_work', notes: 'Movement prevents midday restlessness.' },
        { id: '4', title: 'Midday Recharge / Non-Sleep Deep Rest', startTime: '13:00', endTime: '14:00', category: 'personal', notes: '15 min NSDR meditation or quiet listening.' },
        { id: '5', title: 'Afternoon Creative Sprint', startTime: '15:30', endTime: '18:00', category: 'deep_work', notes: 'Dolphins experience sharp late afternoon energy.' },
        { id: '6', title: 'Calming Movement / Yoga / Walk', startTime: '18:30', endTime: '19:15', category: 'exercise', notes: 'Avoid intense evening workouts that elevate cortisol.' },
        { id: '7', title: 'Warm Bath & Mindful Reflection', startTime: '21:00', endTime: '22:00', category: 'wind_down', notes: 'Journal thoughts to empty working memory.' },
        { id: '8', title: 'Sleep & Night Recovery', startTime: '22:30', endTime: '06:45', category: 'sleep', notes: 'Use earplugs or white noise if sensitive to sound.' },
      ];

    case 'bear':
    default:
      return [
        { id: '1', title: 'Solar Awakening & Morning Walk', startTime: '07:00', endTime: '08:00', category: 'personal', notes: 'Sunlight in eyes, glass of water, gentle stretch.' },
        { id: '2', title: 'Deep Work Block 1 (Hardest Project)', startTime: '09:00', endTime: '12:00', category: 'deep_work', notes: 'Peak cognitive stamina. Tackle difficult problem sets or deep coding.' },
        { id: '3', title: 'Lunch & Fresh Air', startTime: '12:30', endTime: '13:30', category: 'personal', notes: 'Wholesome fuel, step away from screens.' },
        { id: '4', title: 'Secondary Tasks & Communication', startTime: '14:00', endTime: '15:30', category: 'light_work', notes: 'Collaborations, reviews, low-friction tasks.' },
        { id: '5', title: 'Deep Work Block 2 (Execution)', startTime: '16:00', endTime: '17:30', category: 'deep_work', notes: 'Closing out daily deliverables.' },
        { id: '6', title: 'Workout / Cardio', startTime: '18:00', endTime: '19:00', category: 'exercise', notes: 'Physical conditioning and stress release.' },
        { id: '7', title: 'Evening Coherence Breathing & Journal', startTime: '21:30', endTime: '22:30', category: 'wind_down', notes: 'Transition nervous system into parasympathetic mode.' },
        { id: '8', title: 'Sleep', startTime: '23:00', endTime: '07:00', category: 'sleep', notes: 'Consistent 8 hours aligned with solar rhythm.' },
      ];
  }
}
