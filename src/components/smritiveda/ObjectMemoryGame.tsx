import React, { useState, useEffect } from 'react';
import { Brain, Play, RotateCcw, Check, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { OBJECT_MEMORY_ITEMS } from '../../data/culturalContent';
import { soundEngine } from '../../engine/audioEngine';

export const ObjectMemoryGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { recordMemorySession } = useApp();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameState, setGameState] = useState<'intro' | 'memorize' | 'recall' | 'result'>('intro');
  const [targetItems, setTargetItems] = useState<typeof OBJECT_MEMORY_ITEMS>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(5);
  const [startTime, setStartTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  const targetCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const memorizeSeconds = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 5 : 4;

  const startGame = () => {
    // Shuffle and pick target items
    const shuffled = [...OBJECT_MEMORY_ITEMS].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, targetCount);
    setTargetItems(targets);
    setSelectedItemIds([]);
    setGameState('memorize');
    setCountdown(memorizeSeconds);
    setStartTime(Date.now());
    soundEngine.playTempleBell(1.2);

    let sec = memorizeSeconds;
    const interval = setInterval(() => {
      sec -= 1;
      setCountdown(sec);
      if (sec <= 0) {
        clearInterval(interval);
        setGameState('recall');
        soundEngine.playCue(660, 0.2);
      }
    }, 1000);
  };

  const handleSelectItem = (id: string) => {
    if (gameState !== 'recall') return;
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(prev => prev.filter(x => x !== id));
      soundEngine.playCue(440, 0.1);
    } else {
      if (selectedItemIds.length >= targetItems.length) return;
      setSelectedItemIds(prev => [...prev, id]);
      soundEngine.playCue(580, 0.1);
    }
  };

  const handleSubmitRecall = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const targetIds = targetItems.map(t => t.id);
    const correctHits = selectedItemIds.filter(id => targetIds.includes(id)).length;
    const acc = Math.round((correctHits / targetItems.length) * 100);
    const calculatedScore = Math.round(acc * (difficulty === 'hard' ? 1.25 : difficulty === 'medium' ? 1.0 : 0.8));

    setAccuracy(acc);
    setScore(calculatedScore);
    setGameState('result');

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'object_memory',
      difficulty,
      score: calculatedScore,
      accuracy: acc,
      timeSpentSeconds: elapsed,
      notes: `Identified ${correctHits}/${targetItems.length} objects correctly in ${elapsed}s.`
    });

    if (acc >= 80) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      soundEngine.playTempleBell(1.0);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>1. Object Memory Recall</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Observe cultural objects, remember them before they disappear, and identify them from the pool.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setGameState('intro'); }}
              disabled={gameState === 'memorize' || gameState === 'recall'}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${difficulty === d ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: difficulty === d ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: '#ffffff',
                textTransform: 'capitalize',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {d} ({d === 'easy' ? '4' : d === 'medium' ? '6' : '8'} items)
            </button>
          ))}
        </div>
      </div>

      {/* Intro State */}
      {gameState === 'intro' && (
        <div style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            fontSize: '2rem'
          }}>
            🪔
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
            Ready to test visual working memory?
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            You will have <strong>{memorizeSeconds} seconds</strong> to observe and remember <strong>{targetCount} items</strong>. Then select them from a 12-item pool.
          </p>
          <button
            onClick={startGame}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <Play size={16} />
            <span>Start Memorizing</span>
          </button>
        </div>
      )}

      {/* Memorize State */}
      {gameState === 'memorize' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#f59e0b',
            marginBottom: '16px'
          }}>
            Memorize these {targetItems.length} items: {countdown}s
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))`,
            gap: '14px',
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            {targetItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '20px 10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1.5px solid var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.3s'
                }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recall State */}
      {gameState === 'recall' && (
        <div data-testid="recall-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Select the items you remembered ({selectedItemIds.length}/{targetItems.length}):
            </span>
            <button
              onClick={handleSubmitRecall}
              disabled={selectedItemIds.length === 0}
              className="btn btn-primary btn-sm"
              data-testid="submit-recall-btn"
            >
              <span>Submit Recall</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {OBJECT_MEMORY_ITEMS.map(item => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  data-testid="object-choice-card"
                  onClick={() => handleSelectItem(item.id)}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1.5px solid ${isSelected ? '#14b8a6' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isSelected ? '#34d399' : 'var(--text-main)' }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
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
            background: accuracy >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Award size={28} color={accuracy >= 80 ? '#10b981' : '#f59e0b'} />
          </div>

          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
            {accuracy >= 80 ? 'Excellent Recall!' : 'Good Effort!'}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Accuracy: <strong style={{ color: '#ffffff' }}>{accuracy}%</strong> • Score: <strong style={{ color: 'var(--primary-light)' }}>{score} pts</strong>
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={startGame}
              className="btn btn-secondary"
            >
              <RotateCcw size={15} />
              <span>Play Again</span>
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
