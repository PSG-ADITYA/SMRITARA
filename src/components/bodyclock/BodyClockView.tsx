import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  CheckCircle, 
  Edit3, 
  RotateCcw, 
  Sparkles, 
  Info,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { CHRONOTYPE_QUESTIONS, evaluateChronotype } from '../../engine/chronotype';
import type { DailyScheduleBlock } from '../../types';

export const BodyClockView: React.FC = () => {
  const { user, saveChronotypeResult, todaySchedule, updateSchedule, setActiveTab } = useApp();

  const [isQuizMode, setIsQuizMode] = useState<boolean>(!user.chronotypeProfile);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [commitments, setCommitments] = useState<string>('Standard college / work morning schedule (08:30 AM)');
  const [isEditingSchedule, setIsEditingSchedule] = useState<boolean>(false);
  const [editableBlocks, setEditableBlocks] = useState<DailyScheduleBlock[]>(todaySchedule);

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentStep < CHRONOTYPE_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate and save result
      const result = evaluateChronotype(answers, commitments);
      saveChronotypeResult(result);
      setEditableBlocks(result.schedule);
      setIsQuizMode(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsQuizMode(true);
  };

  const handleBlockChange = (index: number, field: keyof DailyScheduleBlock, value: any) => {
    const updated = [...editableBlocks];
    updated[index] = { ...updated[index], [field]: value };
    setEditableBlocks(updated);
  };

  const handleSaveSchedule = () => {
    updateSchedule(editableBlocks);
    setIsEditingSchedule(false);
  };

  const handleToggleComplete = (index: number) => {
    const updated = [...editableBlocks];
    updated[index] = { ...updated[index], isCompleted: !updated[index].isCompleted };
    setEditableBlocks(updated);
    updateSchedule(updated);
  };

  const handleAddBlock = () => {
    const newBlock: DailyScheduleBlock = {
      id: 'block_' + Date.now(),
      title: 'New Focus Window',
      startTime: '14:00',
      endTime: '15:00',
      category: 'deep_work',
      notes: 'Custom block'
    };
    const updated = [...editableBlocks, newBlock];
    setEditableBlocks(updated);
    updateSchedule(updated);
  };

  const handleDeleteBlock = (index: number) => {
    const updated = editableBlocks.filter((_, i) => i !== index);
    setEditableBlocks(updated);
    updateSchedule(updated);
  };

  const currentQ = CHRONOTYPE_QUESTIONS[currentStep];
  const isCurrentAnswered = answers[currentQ?.id] !== undefined;

  return (
    <div>
      {/* Disclaimer Alert */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(20, 184, 166, 0.08)',
        border: '1px solid rgba(20, 184, 166, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '24px'
      }}>
        <Info size={18} color="#2dd4bf" />
        <span style={{ fontSize: '0.85rem', color: '#ccfbf1' }}>
          <strong>Transparency Notice:</strong> This assessment evaluates your subjective morningness-eveningness chronotype preference. It is an educational circadian alignment tool, not a medical or clinical polysomnography diagnosis.
        </span>
      </div>

      {isQuizMode ? (
        /* Questionnaire Card */
        <div className="glass-card" style={{ maxWidth: '820px', margin: '0 auto', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={22} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Free Chronotype Assessment</h3>
            </div>
            <span className="badge badge-purple">
              Question {currentStep + 1} of {CHRONOTYPE_QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', marginBottom: '32px' }}>
            <div style={{
              width: `${((currentStep + 1) / CHRONOTYPE_QUESTIONS.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-teal) 100%)',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Question Body */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
              {currentQ.question}
            </h4>
            {currentQ.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                {currentQ.description}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt.score;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, opt.score)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'var(--bg-card-inner)',
                      border: `1px solid ${isSelected ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {opt.text}
                      </div>
                      {opt.detail && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {opt.detail}
                        </div>
                      )}
                    </div>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--primary-light)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-light)' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Constraints Input on Last Step */}
          {currentStep === CHRONOTYPE_QUESTIONS.length - 1 && (
            <div style={{ marginBottom: '28px' }} className="glass-card-inner">
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                Enter Your Real-World Commitments / Schedule Constraints:
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. College starts at 08:30 AM, or Night shift work..."
                value={commitments}
                onChange={e => setCommitments(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                SMRITARA will shape your schedule realistically so you aren't recommended late awakenings when you have mandatory classes.
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="btn btn-secondary"
              style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className="btn btn-primary"
              style={{ opacity: !isCurrentAnswered ? 0.5 : 1 }}
            >
              {currentStep < CHRONOTYPE_QUESTIONS.length - 1 ? 'Next Question' : 'Compute Chronotype Profile'}
            </button>
          </div>
        </div>
      ) : (
        /* Results & Adaptive Daily Schedule View */
        <div>
          {/* Top Profile Card */}
          {user.chronotypeProfile && (
            <div className="glass-card" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
                      Identified Chronotype
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Score: {user.chronotypeProfile.score}/27
                    </span>
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>
                    {user.chronotypeProfile.label}
                  </h3>
                  <p style={{ color: 'var(--primary-light)', fontSize: '1.05rem', fontWeight: 600, marginTop: '4px' }}>
                    "{user.chronotypeProfile.tagline}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleRetakeQuiz} className="btn btn-secondary btn-sm">
                    <RotateCcw size={14} />
                    <span>Retake Assessment</span>
                  </button>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '20px 0' }}>
                {user.chronotypeProfile.description}
              </p>

              {/* Core Insights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="glass-card-inner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Sun size={16} />
                    <span>PEAK COGNITIVE CLARITY</span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {user.chronotypeProfile.peakAlertness}
                  </div>
                </div>

                <div className="glass-card-inner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#14b8a6', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Clock size={16} />
                    <span>OPTIMAL FOCUS WINDOWS</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {user.chronotypeProfile.focusWindows.join(' & ')}
                  </div>
                </div>

                <div className="glass-card-inner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Moon size={16} />
                    <span>SLEEP RECOVERY PROTOCOL</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {user.chronotypeProfile.sleepAdvice}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Engine Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--primary-light)" />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Personalized Daily Routine</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  Physiologically aligned to your chronotype with full flexibility to customize.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {isEditingSchedule ? (
                  <button onClick={handleSaveSchedule} className="btn btn-teal btn-sm">
                    <CheckCircle size={15} />
                    <span>Save Schedule</span>
                  </button>
                ) : (
                  <button onClick={() => setIsEditingSchedule(true)} className="btn btn-secondary btn-sm">
                    <Edit3 size={15} />
                    <span>Edit Schedule</span>
                  </button>
                )}
                <button onClick={handleAddBlock} className="btn btn-secondary btn-sm">
                  <Plus size={15} />
                  <span>Add Block</span>
                </button>
              </div>
            </div>

            {/* Schedule Blocks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {editableBlocks.map((block, idx) => {
                const getCategoryBadge = (cat: DailyScheduleBlock['category']) => {
                  switch (cat) {
                    case 'deep_work': return 'badge-purple';
                    case 'exercise': return 'badge-emerald';
                    case 'wind_down': return 'badge-amber';
                    case 'sleep': return 'badge-rose';
                    default: return 'badge-teal';
                  }
                };

                return (
                  <div
                    key={block.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: block.isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card-inner)',
                      border: `1px solid ${block.isCompleted ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                      transition: 'all 0.2s ease',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={() => handleToggleComplete(idx)}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: `2px solid ${block.isCompleted ? '#10b981' : 'var(--text-muted)'}`,
                        background: block.isCompleted ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {block.isCompleted && <CheckCircle size={14} color="#ffffff" />}
                    </div>

                    {/* Time Window */}
                    {isEditingSchedule ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={block.startTime}
                          onChange={e => handleBlockChange(idx, 'startTime', e.target.value)}
                          style={{ width: '70px', padding: '4px 6px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px', fontSize: '0.85rem' }}
                        />
                        <span>–</span>
                        <input
                          type="text"
                          value={block.endTime}
                          onChange={e => handleBlockChange(idx, 'endTime', e.target.value)}
                          style={{ width: '70px', padding: '4px 6px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px', fontSize: '0.85rem' }}
                        />
                      </div>
                    ) : (
                      <div className="font-mono" style={{ width: '130px', fontSize: '0.88rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                        {block.startTime} – {block.endTime}
                      </div>
                    )}

                    {/* Block Info */}
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      {isEditingSchedule ? (
                        <input
                          type="text"
                          value={block.title}
                          onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                          style={{ width: '100%', padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}
                        />
                      ) : (
                        <div style={{
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          textDecoration: block.isCompleted ? 'line-through' : 'none',
                          color: block.isCompleted ? 'var(--text-secondary)' : '#ffffff'
                        }}>
                          {block.title}
                        </div>
                      )}

                      {isEditingSchedule ? (
                        <input
                          type="text"
                          value={block.notes}
                          onChange={e => handleBlockChange(idx, 'notes', e.target.value)}
                          style={{ width: '100%', padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '4px', fontSize: '0.8rem' }}
                        />
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {block.notes}
                        </div>
                      )}
                    </div>

                    {/* Category Tag */}
                    <div>
                      <span className={`badge ${getCategoryBadge(block.category)}`}>
                        {block.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Delete block when editing */}
                    {isEditingSchedule && (
                      <button
                        onClick={() => handleDeleteBlock(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
