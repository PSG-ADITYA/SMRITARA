import React, { useState, useEffect } from 'react';
import { Award, RotateCcw, Play, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { MEMORY_MATCH_CARDS } from '../../data/culturalContent';
import { soundEngine } from '../../engine/audioEngine';

interface CardState {
  instanceId: number;
  pairId: number;
  symbol: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { recordMemorySession } = useApp();

  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardState[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const initGame = () => {
    // Generate pairs (6 pairs = 12 cards)
    const deck: CardState[] = [];
    MEMORY_MATCH_CARDS.forEach((c, idx) => {
      deck.push({
        instanceId: idx * 2,
        pairId: c.pairId,
        symbol: c.symbol,
        icon: c.icon,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        instanceId: idx * 2 + 1,
        pairId: c.pairId,
        symbol: c.symbol,
        icon: c.icon,
        isFlipped: false,
        isMatched: false
      });
    });

    const shuffled = deck.sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsCompleted(false);
    setStartTime(Date.now());
    soundEngine.playTempleBell(1.1);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: CardState) => {
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    soundEngine.playCue(520, 0.1);
    const newFlipped = [...flippedCards, card];

    setCards(prev =>
      prev.map(c => c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c)
    );
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;

      if (first.pairId === second.pairId) {
        // Matched!
        soundEngine.playCue(780, 0.2);
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setMatchedPairs(p => {
            const next = p + 1;
            if (next === MEMORY_MATCH_CARDS.length) {
              handleGameComplete();
            }
            return next;
          });
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.instanceId === first.instanceId || c.instanceId === second.instanceId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const handleGameComplete = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const totalPairs = MEMORY_MATCH_CARDS.length;
    // Perfect moves = totalPairs (6 moves). If 6 moves -> 100% accuracy.
    const idealMoves = totalPairs;
    const finalMoves = moves + 1;
    const acc = Math.max(40, Math.min(100, Math.round((idealMoves / finalMoves) * 100)));
    const calculatedScore = Math.max(50, Math.round(100 - (finalMoves - idealMoves) * 4));

    setScore(calculatedScore);
    setIsCompleted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    soundEngine.playTempleBell(1.0);

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'pairs',
      difficulty: 'medium',
      score: calculatedScore,
      accuracy: acc,
      timeSpentSeconds: elapsed,
      notes: `Matched all 6 pairs in ${finalMoves} turns (${elapsed}s).`
    });
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>2. Memory Match Pairs</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Flip cards to discover and pair ancient conceptual symbols.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem' }}>
          <span>Pairs: <strong style={{ color: 'var(--primary-light)' }}>{matchedPairs} / {MEMORY_MATCH_CARDS.length}</strong></span>
          <span>Moves: <strong style={{ color: '#f59e0b' }}>{moves}</strong></span>
          <button
            onClick={initGame}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          {cards.map(card => {
            const visible = card.isFlipped || card.isMatched;
            return (
              <div
                key={card.instanceId}
                onClick={() => handleCardClick(card)}
                style={{
                  height: '110px',
                  borderRadius: 'var(--radius-md)',
                  background: card.isMatched 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : visible 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1.5px solid ${
                    card.isMatched 
                      ? '#10b981' 
                      : visible 
                      ? 'var(--primary-light)' 
                      : 'var(--border-subtle)'
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: visible ? 'default' : 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: visible ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: visible ? '0 4px 14px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {visible ? (
                  <>
                    <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', marginTop: '4px', textAlign: 'center', padding: '0 4px' }}>
                      {card.symbol}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>
                    ☸️
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Award size={28} color="#10b981" />
          </div>

          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
            Board Cleared! All Pairs Unified.
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Completed in <strong style={{ color: '#ffffff' }}>{moves} moves</strong> • Score: <strong style={{ color: 'var(--primary-light)' }}>{score} pts</strong>
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={initGame}
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
