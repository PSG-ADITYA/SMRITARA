import React, { useState } from 'react';
import { BookOpen, Check, RotateCcw, Award, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { CULTURAL_LIBRARY } from '../../data/culturalContent';
import { soundEngine } from '../../engine/audioEngine';

export const PassageRecallGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { recordMemorySession, user } = useApp();

  // Find passages with blanks
  const eligibleItems = CULTURAL_LIBRARY.filter(item => item.blanks && item.blanks.length > 0);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentItem = eligibleItems[selectedItemIndex] || eligibleItems[0];
  const blanks = currentItem.blanks || [];

  const startRecall = () => {
    setUserAnswers({});
    setGameState('recall');
    setStartTime(Date.now());
    soundEngine.playCue(600, 0.15);
  };

  const handleSelectWord = (blankId: number, word: string) => {
    setUserAnswers(prev => ({ ...prev, [blankId]: word }));
    soundEngine.playCue(520, 0.1);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    blanks.forEach(b => {
      if (userAnswers[b.id] === b.correct) correctCount += 1;
    });

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const acc = Math.round((correctCount / blanks.length) * 100);
    const calculatedScore = acc;

    setAccuracy(acc);
    setScore(calculatedScore);
    setGameState('result');

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'passages',
      difficulty: 'medium',
      score: calculatedScore,
      accuracy: acc,
      timeSpentSeconds: elapsed,
      notes: `Recalled ${correctCount}/${blanks.length} words in "${currentItem.title}".`
    });

    if (acc >= 75) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      soundEngine.playTempleBell(1.0);
    }
  };

  const handleReciteText = () => {
    soundEngine.speakText(currentItem.originalText, currentItem.language, 0.85);
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>3. Cultural Passage & Missing Word</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Study classical literature, then restore the missing philosophical terms.
          </p>
        </div>

        {/* Passage Selector */}
        <select
          value={selectedItemIndex}
          onChange={e => {
            setSelectedItemIndex(Number(e.target.value));
            setGameState('memorize');
            setUserAnswers({});
          }}
          className="input-field"
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        >
          {eligibleItems.map((item, idx) => (
            <option key={item.id} value={idx}>
              [{item.language.toUpperCase()}] {item.title}
            </option>
          ))}
        </select>
      </div>

      {/* Memorize State */}
      {gameState === 'memorize' && (
        <div>
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '6px' }}>
              {currentItem.source}
            </div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              lineHeight: 1.8,
              color: '#ffffff',
              whiteSpace: 'pre-line',
              fontFamily: 'serif',
              marginBottom: '14px'
            }}>
              {currentItem.originalText}
            </div>
            {currentItem.transliteration && (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '10px' }}>
                {currentItem.transliteration}
              </div>
            )}
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
              <strong>Meaning:</strong> {currentItem.meaning}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleReciteText}
              className="btn btn-secondary"
            >
              <span>🔊 Recite Passage</span>
            </button>
            <button
              onClick={startRecall}
              className="btn btn-primary"
            >
              <Play size={16} />
              <span>Hide Words & Test Recall</span>
            </button>
          </div>
        </div>
      )}

      {/* Recall State */}
      {gameState === 'recall' && (
        <div>
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            textAlign: 'center',
            fontSize: '1.15rem',
            lineHeight: 2
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
              Select the correct term for each missing slot:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
              {blanks.map((b, idx) => (
                <div key={b.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Blank [{idx + 1}]:</span>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1.5px dashed ${userAnswers[b.id] ? '#10b981' : '#f59e0b'}`,
                    background: userAnswers[b.id] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                    fontWeight: 700,
                    color: userAnswers[b.id] ? '#34d399' : '#fbbf24',
                    minWidth: '100px',
                    textAlign: 'center'
                  }}>
                    {userAnswers[b.id] || 'Select Option'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options Palette */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {blanks.map((b, idx) => (
              <div key={b.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Options for Blank [{idx + 1}]:
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {b.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSelectWord(b.id, opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: `1px solid ${userAnswers[b.id] === opt ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: userAnswers[b.id] === opt ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < blanks.length}
              className="btn btn-primary"
              style={{ padding: '12px 32px' }}
            >
              <span>Submit Recall Answers</span>
            </button>
          </div>
        </div>
      )}

      {/* Result State */}
      {gameState === 'result' && (
        <div style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: accuracy >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Award size={28} color={accuracy >= 75 ? '#10b981' : '#f59e0b'} />
          </div>

          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
            {accuracy === 100 ? 'Flawless Verse Recall!' : 'Passage Completed'}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Accuracy: <strong style={{ color: '#ffffff' }}>{accuracy}%</strong> • Score: <strong style={{ color: 'var(--primary-light)' }}>{score} pts</strong>
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => setGameState('memorize')}
              className="btn btn-secondary"
            >
              <RotateCcw size={15} />
              <span>Review Passage</span>
            </button>
            {onComplete && (
              <button
                onClick={onComplete}
                className="btn btn-primary"
              >
                <span>Continue</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
