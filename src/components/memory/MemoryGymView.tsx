import React, { useState } from 'react';
import { 
  Brain, 
  RotateCcw, 
  Play, 
  Award, 
  BookOpen, 
  Grid3X3, 
  Layers, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import type { MemoryGameType } from '../../types';

// Cultural and philosophical passages for verbal memory
const CULTURAL_PASSAGES = [
  {
    id: 'thirukkural',
    origin: 'Thirukkural (Tamil Philosophy)',
    quote: 'Knowledge is that which discerns the truth from whatever is heard from whomever.',
    maskedQuote: 'Knowledge is that which [1] the [2] from whatever is [3] from whomever.',
    blanks: [
      { id: 1, correct: 'discerns', options: ['discerns', 'creates', 'ignores'] },
      { id: 2, correct: 'truth', options: ['truth', 'rumor', 'wealth'] },
      { id: 3, correct: 'heard', options: ['heard', 'hidden', 'bought'] }
    ]
  },
  {
    id: 'upanishad',
    origin: 'Katha Upanishad (Universal Wisdom)',
    quote: 'Know the Self as the rider in the chariot, and the body as simply the chariot.',
    maskedQuote: 'Know the [1] as the [2] in the chariot, and the [3] as simply the chariot.',
    blanks: [
      { id: 1, correct: 'Self', options: ['Self', 'World', 'Mind'] },
      { id: 2, correct: 'rider', options: ['rider', 'soldier', 'guest'] },
      { id: 3, correct: 'body', options: ['body', 'chariot', 'armor'] }
    ]
  },
  {
    id: 'marcus_aurelius',
    origin: 'Meditations (Stoic Resilience)',
    quote: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
    maskedQuote: 'You have power over your [1], not outside [2]. Realize this, and you will find [3].',
    blanks: [
      { id: 1, correct: 'mind', options: ['mind', 'future', 'friends'] },
      { id: 2, correct: 'events', options: ['events', 'weapons', 'desires'] },
      { id: 3, correct: 'strength', options: ['strength', 'wealth', 'excuses'] }
    ]
  }
];

export const MemoryGymView: React.FC = () => {
  const { recordMemorySession, memorySessions } = useApp();

  const [activeGame, setActiveGame] = useState<MemoryGameType>('matrix');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameState, setGameState] = useState<'idle' | 'memorize' | 'recall' | 'result'>('idle');

  // Exercise 1: Pattern Matrix State
  const gridSize = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const targetTilesCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [userSelectedTiles, setUserSelectedTiles] = useState<number[]>([]);
  const [matrixTimer, setMatrixTimer] = useState<number>(3);

  // Exercise 2: Sequence Recall State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [flashingPad, setFlashingPad] = useState<number | null>(null);

  // Exercise 3: Cultural Passage State
  const [selectedPassageIdx, setSelectedPassageIdx] = useState<number>(0);
  const [passageAnswers, setPassageAnswers] = useState<Record<number, string>>({});

  // Performance Results
  const [gameScore, setGameScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  // ---- 1. Matrix Grid Game Logic ----
  const startMatrixGame = () => {
    const totalCells = gridSize * gridSize;
    const randomTiles: number[] = [];
    while (randomTiles.length < targetTilesCount) {
      const r = Math.floor(Math.random() * totalCells);
      if (!randomTiles.includes(r)) randomTiles.push(r);
    }

    setActiveTiles(randomTiles);
    setUserSelectedTiles([]);
    setGameState('memorize');
    setMatrixTimer(3);
    setStartTime(Date.now());

    let countdown = 3;
    const interval = setInterval(() => {
      countdown -= 1;
      setMatrixTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        setGameState('recall');
      }
    }, 1000);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'recall') return;
    if (userSelectedTiles.includes(index)) return;

    const newSelected = [...userSelectedTiles, index];
    setUserSelectedTiles(newSelected);

    if (newSelected.length === activeTiles.length) {
      // Validate
      const correctHits = newSelected.filter(t => activeTiles.includes(t)).length;
      const acc = Math.round((correctHits / activeTiles.length) * 100);
      const score = Math.round(acc * (difficulty === 'hard' ? 1.2 : difficulty === 'medium' ? 1.0 : 0.8));
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      setAccuracy(acc);
      setGameScore(score);
      setGameState('result');

      recordMemorySession({
        date: new Date().toISOString().split('T')[0],
        gameType: 'matrix',
        difficulty,
        score,
        accuracy: acc,
        timeSpentSeconds: elapsed
      });

      if (acc >= 80) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  // ---- 2. Sequence Game Logic ----
  const startSequenceGame = () => {
    const seqLen = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const newSeq: number[] = [];
    for (let i = 0; i < seqLen; i++) {
      newSeq.push(Math.floor(Math.random() * 4)); // 4 pads: 0, 1, 2, 3
    }

    setSequence(newSeq);
    setUserSequence([]);
    setGameState('memorize');
    setStartTime(Date.now());

    // Playback sequence flashes
    newSeq.forEach((pad, index) => {
      setTimeout(() => {
        setFlashingPad(pad);
        setTimeout(() => setFlashingPad(null), 400);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setGameState('recall');
    }, (newSeq.length + 1) * 700);
  };

  const handlePadClick = (padIndex: number) => {
    if (gameState !== 'recall') return;

    setFlashingPad(padIndex);
    setTimeout(() => setFlashingPad(null), 250);

    const nextUserSeq = [...userSequence, padIndex];
    setUserSequence(nextUserSeq);

    const currentIndex = nextUserSeq.length - 1;
    if (nextUserSeq[currentIndex] !== sequence[currentIndex]) {
      // Wrong tap
      finishSequenceGame(nextUserSeq, false);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      // Success!
      finishSequenceGame(nextUserSeq, true);
    }
  };

  const finishSequenceGame = (finalSeq: number[], isPerfect: boolean) => {
    const correctSteps = finalSeq.filter((v, i) => v === sequence[i]).length;
    const acc = Math.round((correctSteps / sequence.length) * 100);
    const score = isPerfect ? 100 : Math.round(acc * 0.8);
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    setAccuracy(acc);
    setGameScore(score);
    setGameState('result');

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'sequence',
      difficulty,
      score,
      accuracy: acc,
      timeSpentSeconds: elapsed
    });

    if (isPerfect) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // ---- 3. Cultural Passage Logic ----
  const startPassageGame = () => {
    setPassageAnswers({});
    setGameState('memorize');
    setStartTime(Date.now());
  };

  const handlePassageAnswer = (blankId: number, selectedText: string) => {
    setPassageAnswers(prev => ({ ...prev, [blankId]: selectedText }));
  };

  const submitPassageGame = () => {
    const passage = CULTURAL_PASSAGES[selectedPassageIdx];
    let correctCount = 0;
    passage.blanks.forEach(b => {
      if (passageAnswers[b.id] === b.correct) correctCount++;
    });

    const acc = Math.round((correctCount / passage.blanks.length) * 100);
    const score = acc;
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    setAccuracy(acc);
    setGameScore(score);
    setGameState('result');

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'passages',
      difficulty,
      score,
      accuracy: acc,
      timeSpentSeconds: elapsed
    });

    if (acc === 100) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div>
      {/* Disclaimer Alert */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '24px'
      }}>
        <AlertCircle size={18} color="var(--primary-light)" />
        <span style={{ fontSize: '0.85rem', color: '#e9d5ff' }}>
          <strong>Cognitive Engagement Notice:</strong> Memory Gym exercises provide healthy working memory and attention stimulation inspired by Smriti Veda. They are deterministic skill challenges and do not claim to prevent, treat, or diagnose clinical dementia.
        </span>
      </div>

      {/* Game Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveGame('matrix'); setGameState('idle'); }}
          className={`btn ${activeGame === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Grid3X3 size={16} />
          <span>Pattern Matrix Recall</span>
        </button>
        <button
          onClick={() => { setActiveGame('sequence'); setGameState('idle'); }}
          className={`btn ${activeGame === 'sequence' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={16} />
          <span>Chime Sequence Recall</span>
        </button>
        <button
          onClick={() => { setActiveGame('passages'); setGameState('idle'); }}
          className={`btn ${activeGame === 'passages' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          <span>Cultural Passage Recall</span>
        </button>
      </div>

      {/* Main Game Card */}
      <div className="glass-card" style={{ maxWidth: '820px', margin: '0 auto', padding: '36px', textAlign: 'center' }}>
        {/* Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={22} color="var(--primary-light)" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {activeGame === 'matrix' ? 'Spatial Matrix Memory' : activeGame === 'sequence' ? 'Sequential Sound & Color Memory' : 'Verbal & Philosophical Retention'}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => { setDifficulty(diff); setGameState('idle'); }}
                className={`btn btn-sm ${difficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', padding: '4px 10px', fontSize: '0.75rem' }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 1. MATRIX GRID GAME */}
        {activeGame === 'matrix' && (
          <div>
            {gameState === 'idle' && (
              <div style={{ padding: '32px 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                  A pattern of highlighted tiles will illuminate for <strong>3 seconds</strong>. Once they vanish, tap the matching grid tiles from working memory.
                </p>
                <button onClick={startMatrixGame} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                  <Play size={18} />
                  <span>Begin Challenge</span>
                </button>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall') && (
              <div>
                <div style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 700, color: gameState === 'memorize' ? '#f59e0b' : '#34d399' }}>
                  {gameState === 'memorize' ? `Memorize the tiles! (${matrixTimer}s)` : 'Tap all the illuminated tiles from memory!'}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gap: '10px',
                  maxWidth: '380px',
                  margin: '0 auto 28px auto'
                }}>
                  {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                    const isTarget = activeTiles.includes(idx);
                    const isSelected = userSelectedTiles.includes(idx);
                    const showTile = (gameState === 'memorize' && isTarget) || (gameState === 'recall' && isSelected);

                    return (
                      <div
                        key={idx}
                        onClick={() => handleTileClick(idx)}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '12px',
                          background: showTile
                            ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent-teal) 100%)'
                            : 'var(--bg-card-inner)',
                          border: `2px solid ${showTile ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                          cursor: gameState === 'recall' ? 'pointer' : 'default',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: showTile ? '0 0 16px var(--primary-glow)' : 'none'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. SEQUENCE CHIME GAME */}
        {activeGame === 'sequence' && (
          <div>
            {gameState === 'idle' && (
              <div style={{ padding: '32px 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                  Watch the illuminated sequence of colored pads. Once the playback completes, reproduce the exact rhythm and order without mistakes.
                </p>
                <button onClick={startSequenceGame} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                  <Play size={18} />
                  <span>Start Sequence</span>
                </button>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall') && (
              <div>
                <div style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: 700, color: gameState === 'memorize' ? '#f59e0b' : '#34d399' }}>
                  {gameState === 'memorize' ? 'Observing Sequence...' : `Your turn! Tap sequence (${userSequence.length} / ${sequence.length})`}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '320px', margin: '0 auto 28px auto' }}>
                  {[
                    { id: 0, color: '#8b5cf6', label: 'Violet' },
                    { id: 1, color: '#14b8a6', label: 'Teal' },
                    { id: 2, color: '#f59e0b', label: 'Amber' },
                    { id: 3, color: '#f43f5e', label: 'Rose' },
                  ].map(pad => {
                    const isLit = flashingPad === pad.id;
                    return (
                      <div
                        key={pad.id}
                        onClick={() => handlePadClick(pad.id)}
                        style={{
                          height: '130px',
                          borderRadius: '16px',
                          background: isLit ? pad.color : 'var(--bg-card-inner)',
                          border: `2px solid ${isLit ? '#ffffff' : 'var(--border-subtle)'}`,
                          boxShadow: isLit ? `0 0 30px ${pad.color}` : 'none',
                          transform: isLit ? 'scale(1.04)' : 'scale(1)',
                          cursor: gameState === 'recall' ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pad.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CULTURAL PASSAGE GAME */}
        {activeGame === 'passages' && (
          <div>
            {gameState === 'idle' && (
              <div style={{ padding: '24px 0', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {CULTURAL_PASSAGES.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPassageIdx(idx)}
                      className={`btn btn-sm ${selectedPassageIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {p.origin.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="glass-card-inner" style={{ padding: '24px', marginBottom: '24px' }}>
                  <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
                    {CULTURAL_PASSAGES[selectedPassageIdx].origin}
                  </span>
                  <blockquote style={{ fontSize: '1.25rem', fontStyle: 'italic', color: '#ffffff', margin: '14px 0', lineHeight: 1.6 }}>
                    "{CULTURAL_PASSAGES[selectedPassageIdx].quote}"
                  </blockquote>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Read carefully. When ready, click "Begin Recall" to test retention of core concepts.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button onClick={startPassageGame} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                    <Play size={18} />
                    <span>Begin Recall Challenge</span>
                  </button>
                </div>
              </div>
            )}

            {gameState === 'memorize' && (
              <div style={{ textAlign: 'left', padding: '16px 0' }}>
                <div style={{ marginBottom: '20px' }}>
                  <span className="badge badge-purple">
                    {CULTURAL_PASSAGES[selectedPassageIdx].origin}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', marginTop: '10px', color: 'var(--text-secondary)' }}>
                    Fill in the missing words from memory:
                  </h4>
                  <div style={{ fontSize: '1.3rem', lineHeight: 1.7, margin: '20px 0', color: '#ffffff' }}>
                    {CULTURAL_PASSAGES[selectedPassageIdx].maskedQuote}
                  </div>
                </div>

                {/* Multiple choice selection blanks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  {CULTURAL_PASSAGES[selectedPassageIdx].blanks.map(blank => (
                    <div key={blank.id} className="glass-card-inner">
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '8px' }}>
                        Blank [{blank.id}] Selection:
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {blank.options.map(opt => {
                          const isPicked = passageAnswers[blank.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handlePassageAnswer(blank.id, opt)}
                              className={`btn btn-sm ${isPicked ? 'btn-teal' : 'btn-secondary'}`}
                              style={{ padding: '8px 16px' }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={submitPassageGame}
                    disabled={Object.keys(passageAnswers).length < 3}
                    className="btn btn-primary"
                    style={{ padding: '12px 32px', opacity: Object.keys(passageAnswers).length < 3 ? 0.4 : 1 }}
                  >
                    Submit Retrieval
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'result' && (
          <div style={{ padding: '28px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Award size={36} color="#34d399" />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px' }}>Exercise Complete!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your cognitive engagement metrics have been saved to your personal history.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399' }}>
                  {accuracy}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score Earned</div>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-light)' }}>
                  {gameScore}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => setGameState('idle')} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent History Table */}
      <div className="glass-card" style={{ maxWidth: '820px', margin: '28px auto 0 auto' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Session History</h4>
        {memorySessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No sessions played yet. Choose a game above to calibrate your baseline!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {memorySessions.slice(0, 5).map(s => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-inner)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Brain size={16} color="var(--primary-light)" />
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{s.gameType} Exercise</span>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{s.difficulty}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{s.accuracy}% Acc</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.score} pts</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
