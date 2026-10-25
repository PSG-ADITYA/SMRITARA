import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe, 
  Target, 
  Clock, 
  Brain, 
  BookOpen, 
  Wind,
  Volume2,
  VolumeX,
  Moon,
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SmritaraBrand } from '../common/SmritaraBrand';
import type { 
  InterfaceLanguage,
  ContentLanguage,
  OnboardingPreferences, 
  ChronotypeProfile,
  Chronotype
} from '../../types';
import { generateScheduleForChronotype } from '../../engine/chronotype';
import { generatePersonalizedPlan } from '../../engine/personalizationEngine';

export const OnboardingWizard: React.FC = () => {
  const { user, completeOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Preferred Name & Language Choices
  const [preferredName, setPreferredName] = useState(user.username || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<InterfaceLanguage>('english');
  const [recitationLanguage, setRecitationLanguage] = useState<ContentLanguage>('sanskrit');

  // Step 2: Primary and Secondary Goals
  const [primaryGoal, setPrimaryGoal] = useState<string>('mindfulness');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>(['memory', 'cultural']);

  // Step 3: Pacing & Recitation Speed
  const [dailyPracticeMinutes, setDailyPracticeMinutes] = useState<number>(7);
  const [recitationSpeed, setRecitationSpeed] = useState<number>(1.0);
  const [practiceTime, setPracticeTime] = useState<'morning' | 'afternoon' | 'evening' | 'flexible'>('morning');
  const [wakePreference, setWakePreference] = useState<'early' | 'moderate' | 'late' | 'variable'>('moderate');

  // Step 4: Self-Reported Targets & Sensory Preferences
  const [targetSleepHours, setTargetSleepHours] = useState<number>(8.0);
  const [targetScreenTimeHours, setTargetScreenTimeHours] = useState<number>(4.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientAudioEnabled, setAmbientAudioEnabled] = useState<boolean>(false);
  const [celebrationEffectsEnabled, setCelebrationEffectsEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [largerText, setLargerText] = useState<boolean>(false);

  const toggleSecondaryGoal = (g: string) => {
    setSecondaryGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const getEstimatedChronotype = (): Chronotype => {
    if (wakePreference === 'early') return 'lion';
    if (wakePreference === 'late') return 'wolf';
    if (wakePreference === 'variable') return 'dolphin';
    return 'bear';
  };

  const validateStep1 = (): boolean => {
    if (!preferredName.trim()) {
      setNameError('Please enter your preferred name so we can address you personally.');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
    }
    setStep(s => Math.min(totalSteps, s + 1));
  };

  const handleSkipToReview = () => {
    setStep(5);
  };

  const handleFinish = () => {
    const allGoals = Array.from(new Set([primaryGoal, ...secondaryGoals]));

    const prefs: OnboardingPreferences = {
      preferredName: preferredName.trim() || 'Practitioner',
      preferredLanguage,
      recitationLanguage,
      primaryGoal,
      secondaryGoals,
      goals: allGoals,
      dailyPracticeMinutes,
      recitationSpeed,
      practiceTime,
      interests: ['games', 'chanting', 'meditation'],
      contentStyle: 'mixed',
      experienceLevel: 'intermediate',
      targetSleepHours,
      targetScreenTimeHours,
      accessibility: {
        largerText,
        reducedMotion,
        soundEnabled,
        ambientAudioEnabled,
        celebrationEffectsEnabled
      }
    };

    const c = getEstimatedChronotype();
    const chronoProfile: ChronotypeProfile = {
      chronotype: c,
      score: 18,
      label: c === 'lion' ? 'Early Lion' : c === 'wolf' ? 'Night Wolf' : c === 'dolphin' ? 'Sensitive Dolphin' : 'Steady Bear',
      tagline: 'Calibrated from onboarding rhythm assessment',
      description: 'Estimated based on your self-reported wake time and peak mental alertness.',
      peakAlertness: c === 'lion' ? '08:00 - 12:00' : c === 'wolf' ? '17:00 - 22:00' : c === 'dolphin' ? '15:00 - 19:00' : '10:00 - 14:00',
      focusWindows: c === 'lion' ? ['08:00 - 10:30', '14:00 - 16:00'] : c === 'wolf' ? ['16:00 - 18:30', '20:00 - 22:00'] : ['10:00 - 12:30', '15:00 - 17:00'],
      sleepAdvice: 'Prioritize a regular sleep window to maximize restorative slow-wave sleep and memory consolidation.',
      schedule: generateScheduleForChronotype(c),
      completedAt: new Date().toISOString()
    };

    completeOnboarding(prefs, chronoProfile);
  };

  const allGoalsList = Array.from(new Set([primaryGoal, ...secondaryGoals]));
  const planPreview = generatePersonalizedPlan({
    preferredName: preferredName.trim() || 'Practitioner',
    preferredLanguage,
    goals: allGoalsList,
    dailyPracticeMinutes,
    practiceTime,
    interests: ['games', 'chanting', 'meditation'],
    contentStyle: 'mixed',
    experienceLevel: 'intermediate',
    accessibility: { largerText, reducedMotion, soundEnabled }
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 20px',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '780px',
        margin: '0 auto 20px',
        width: '100%'
      }}>
        <SmritaraBrand variant="compact" size="md" />
        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Step {step} of {totalSteps}
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '780px',
        margin: '0 auto 24px',
        width: '100%',
        height: '4px',
        background: 'var(--border-subtle)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(step / totalSteps) * 100}%`,
          height: '100%',
          background: 'var(--primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Main Container Card */}
      <div className="clean-card" style={{
        maxWidth: '780px',
        margin: '0 auto',
        width: '100%',
        padding: '36px 40px',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* STEP 1: Name and Languages */}
        {step === 1 && (
          <div className="fade-rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Identity & Language</span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Welcome to SMRITARA. Let's Calibrate Your Experience.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Please provide your preferred name and select your interface and recitation languages.
            </p>

            {nameError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-terracotta-subtle)',
                border: '1px solid rgba(192, 92, 60, 0.3)',
                color: 'var(--accent-terracotta)',
                fontSize: '0.85rem',
                marginBottom: '18px'
              }}>
                <AlertCircle size={16} />
                <span>{nameError}</span>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                Preferred Name <span style={{ color: 'var(--accent-terracotta)' }}>*</span>
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={e => {
                  setPreferredName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="What should we call you? (e.g. Sriraghav)"
                className="input-field"
                style={{ width: '100%', maxWidth: '420px', fontSize: '0.95rem' }}
                autoFocus
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Used only for addressing you warmly inside your private session.
              </div>
            </div>

            {/* Interface Language */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                Interface Navigation Language
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'english', label: 'English', desc: 'Standard UI labels & guides' },
                  { id: 'telugu', label: 'తెలుగు (Telugu)', desc: 'Telugu navigation & context' },
                  { id: 'hindi', label: 'हिन्दी (Hindi)', desc: 'Hindi navigation & context' },
                ].map(l => {
                  const isSel = preferredLanguage === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setPreferredLanguage(l.id as InterfaceLanguage)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isSel ? 'var(--primary-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSel ? 'var(--primary)' : 'var(--text-main)' }}>
                        {l.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {l.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recitation Content Language Focus */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                Cultural Recitation & Content Focus
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'sanskrit', label: 'संस्कृतम् (Sanskrit)', desc: 'Shlokas & Mantras' },
                  { id: 'english', label: 'English Philosophy', desc: 'Stoicism & Reflections' },
                  { id: 'telugu', label: 'తెలుగు (Telugu)', desc: 'Vemana & Sumati Satakam' },
                  { id: 'hindi', label: 'हिन्दी (Hindi)', desc: 'Kabir & Tulsidas Dohe' },
                ].map(c => {
                  const isSel = recitationLanguage === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setRecitationLanguage(c.id as ContentLanguage)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isSel ? 'var(--primary-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSel ? 'var(--primary)' : 'var(--text-main)' }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Primary and Secondary Goals */}
        {step === 2 && (
          <div className="fade-rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Practice Objectives</span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              What is Your Primary Growth Focus?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Select one primary priority to anchor your daily recommendations, plus any optional secondary interests.
            </p>

            {/* Primary Goal Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Primary Goal (Select One)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'mindfulness', title: 'Guided Breathwork', desc: 'Respiratory regulation, coherence, and calm', icon: Wind },
                  { id: 'memory', title: 'Cognitive Memory Gym', desc: 'Working memory, sequence chimes, matrix patterns', icon: Brain },
                  { id: 'cultural', title: 'Cultural Literature', desc: 'Classical verses, Sanskrit shlokas, reflective passages', icon: BookOpen },
                  { id: 'focus', title: 'Daily Deep Work Routine', desc: 'Circadian energy alignment and focused intervals', icon: Target },
                ].map(item => {
                  const Icon = item.icon;
                  const isSel = primaryGoal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isSel ? 'var(--primary-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Icon size={20} color={isSel ? 'var(--primary)' : 'var(--text-secondary)'} />
                        {isSel && <Check size={18} color="var(--primary)" />}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: isSel ? 'var(--primary)' : 'var(--text-main)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Goals */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Secondary Goals (Optional — Select any that interest you)
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'memory', label: 'Memory Gym' },
                  { id: 'mindfulness', label: 'Breathwork' },
                  { id: 'cultural', label: 'Cultural Library' },
                  { id: 'focus', label: 'Focus Routine' },
                ].filter(g => g.id !== primaryGoal).map(sec => {
                  const isSelected = secondaryGoals.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => toggleSecondaryGoal(sec.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isSelected && <Check size={14} />}
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Duration & Recitation Pacing */}
        {step === 3 && (
          <div className="fade-rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Cadence & Pacing</span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Session Duration & Speech Pacing
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Calibrate your practice duration and recitation speed. Consistent short sessions build durable neural memory.
            </p>

            {/* Duration Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
                Preferred Daily Practice Duration
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { mins: 5, label: '5 Minutes', desc: 'Quick cognitive reset' },
                  { mins: 7, label: '7 Minutes', desc: 'Standard balance (Recommended)' },
                  { mins: 10, label: '10 Minutes', desc: 'Deep contemplative practice' },
                ].map(d => (
                  <button
                    key={d.mins}
                    type="button"
                    onClick={() => setDailyPracticeMinutes(d.mins)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${dailyPracticeMinutes === d.mins ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: dailyPracticeMinutes === d.mins ? 'var(--primary-subtle)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: dailyPracticeMinutes === d.mins ? 'var(--primary)' : 'var(--text-main)' }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {d.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recitation Speed */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Recitation Speech Speed (Default: 1.0×)
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {recitationSpeed}×
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Sets natural pacing for audible speech recitations in the Cultural Library.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { rate: 0.85, label: '0.85×', desc: 'Deliberate study pace' },
                  { rate: 1.0, label: '1.0×', desc: 'Natural standard tempo (Default)' },
                  { rate: 1.2, label: '1.2×', desc: 'Fluent fluent flow' },
                ].map(r => (
                  <button
                    key={r.rate}
                    type="button"
                    onClick={() => setRecitationSpeed(r.rate)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${recitationSpeed === r.rate ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: recitationSpeed === r.rate ? 'var(--primary-subtle)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: recitationSpeed === r.rate ? 'var(--primary)' : 'var(--text-main)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Peak Alertness / Chronotype Window */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                When Do You Feel Most Mentally Alert?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'early', label: 'Early Morning (Lion)', sub: '7 AM – 11 AM' },
                  { id: 'moderate', label: 'Mid-Day (Bear)', sub: '10 AM – 2 PM' },
                  { id: 'late', label: 'Evening (Wolf)', sub: '4 PM – 9 PM' },
                  { id: 'variable', label: 'Adaptive (Dolphin)', sub: 'Flexible' },
                ].map(w => (
                  <div
                    key={w.id}
                    onClick={() => setWakePreference(w.id as any)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${wakePreference === w.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: wakePreference === w.id ? 'var(--primary-subtle)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: wakePreference === w.id ? 'var(--primary)' : 'var(--text-main)' }}>
                      {w.label}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {w.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Self-Reported Targets & Sensory Preferences */}
        {step === 4 && (
          <div className="fade-rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Targets & Environment (Optional)</span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Self-Reported Routine Targets & Sensory Settings
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
              Define personal goals and customize audio cues. You can skip this step anytime.
            </p>

            {/* Clear distinction notice */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              marginBottom: '20px'
            }}>
              🔒 <strong>Self-Reported Goals:</strong> SMRITARA strictly distinguishes intentional targets from actual recorded practice. We do not access background device screen-time APIs or medical telemetry.
            </div>

            {/* Routine Targets Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                    <Moon size={15} color="var(--primary)" />
                    <span>Sleep Target (Self-Reported)</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {targetSleepHours}h
                  </span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.5"
                  value={targetSleepHours}
                  onChange={e => setTargetSleepHours(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                    <Smartphone size={15} color="var(--accent-amber)" />
                    <span>Screen Limit Goal (Self-Reported)</span>
                  </div>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {targetScreenTimeHours}h
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={targetScreenTimeHours}
                  onChange={e => setTargetScreenTimeHours(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                />
              </div>
            </div>

            {/* Sensory & Accessibility Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={e => setSoundEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Subtle Audio Feedback</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Chimes on breathe & session cues</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ambientAudioEnabled}
                  onChange={e => setAmbientAudioEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>432Hz Ambient Resonance</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Continuous soothing drone</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={celebrationEffectsEnabled}
                  onChange={e => setCelebrationEffectsEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Celebratory Effects</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confetti on session finish</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={e => setReducedMotion(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Reduced Motion</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mute animations and pulses</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Final Review & Confirmation */}
        {step === 5 && (
          <div className="fade-rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-sage">Calibrated Routine</span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Review Your Practice Calibration
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
              Here is your tailored daily schedule, {preferredName.trim() || 'Practitioner'}:
            </p>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Practitioner</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{preferredName.trim() || 'Practitioner'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Languages</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    UI: {preferredLanguage.toUpperCase()} • Content: {recitationLanguage.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Cadence & Speed</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {dailyPracticeMinutes}m Daily • {recitationSpeed}× Pace
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Self-Reported Targets</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {targetSleepHours}h Sleep Goal • {targetScreenTimeHours}h Screen Limit
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Calibrated Daily Practice Plan ({dailyPracticeMinutes} Minutes):
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {planPreview.map(item => (
                    <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={15} color="var(--primary)" />
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({item.durationMinutes}m)</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>— {item.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <span>You can adjust these preferences or switch languages anytime in Settings.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '10px' }}>
            {step === 4 && (
              <button
                type="button"
                onClick={handleSkipToReview}
                className="btn btn-secondary"
              >
                <span>Skip Optional</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontWeight: 700 }}
              >
                <span>Activate SMRITARA Dashboard</span>
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
