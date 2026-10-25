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
import { audioService } from '../../engine/audioService';
import type { MemoryGameType } from '../../types';
import { CognitiveGamesCenter } from '../games/CognitiveGamesCenter';

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
  const { recordMemorySession, memorySessions, soundEnabled, celebrationsEnabled } = useApp();

  const [viewMode, setViewMode] = useState<'centre' | 'quick_drills'>('centre');
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

  // Sound triggers
  const playInteractionClick = () => {
    if (soundEnabled) audioService.playClick();
  };

  const playSuccess = () => {
    if (soundEnabled) audioService.playSuccessBell();
  };

  const playMistake = () => {
    if (soundEnabled) audioService.playSoftMistake();
  };

  // ---- 1. Matrix Grid Game Logic ----
  const startMatrixGame = () => {
    if (soundEnabled) audioService.playStartChime();
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

    playInteractionClick();
    const newSelected = [...userSelectedTiles, index];
    setUserSelectedTiles(newSelected);

    if (newSelected.length === activeTiles.length) {
      const correctHits = newSelected.filter(t => activeTiles.includes(t)).length;
      const acc = Math.round((correctHits / activeTiles.length) * 100);
      const score = Math.round(acc * (difficulty === 'hard' ? 1.2 : difficulty === 'medium' ? 1.0 : 0.8));
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      setAccuracy(acc);
      setGameScore(score);
      setGameState('result');

      if (acc >= 70) {
        playSuccess();
        if (celebrationsEnabled) confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        playMistake();
      }

      recordMemorySession({
        date: new Date().toISOString().split('T')[0],
        gameType: 'matrix',
        difficulty,
        score,
        accuracy: acc,
        timeSpentSeconds: elapsed
      });
    }
  };

  // ---- 2. Sequence Game Logic ----
  const startSequenceGame = () => {
    if (soundEnabled) audioService.playStartChime();
    const seqLen = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const newSeq: number[] = [];
    for (let i = 0; i < seqLen; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }

    setSequence(newSeq);
    setUserSequence([]);
    setGameState('memorize');
    setStartTime(Date.now());

    newSeq.forEach((pad, index) => {
      setTimeout(() => {
        setFlashingPad(pad);
        playInteractionClick();
        setTimeout(() => setFlashingPad(null), 400);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setGameState('recall');
    }, (newSeq.length + 1) * 700);
  };

  const handlePadClick = (padIndex: number) => {
    if (gameState !== 'recall') return;

    playInteractionClick();
    setFlashingPad(padIndex);
    setTimeout(() => setFlashingPad(null), 250);

    const nextUserSeq = [...userSequence, padIndex];
    setUserSequence(nextUserSeq);

    const currentIndex = nextUserSeq.length - 1;
    if (nextUserSeq[currentIndex] !== sequence[currentIndex]) {
      playMistake();
      finishSequenceGame(nextUserSeq, false);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      playSuccess();
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

    if (isPerfect && celebrationsEnabled) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ---- 3. Cultural Passage Logic ----
  const startPassageGame = () => {
    if (soundEnabled) audioService.playStartChime();
    setPassageAnswers({});
    setGameState('memorize');
    setStartTime(Date.now());
  };

  const handlePassageAnswer = (blankId: number, selectedText: string) => {
    playInteractionClick();
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

    if (acc === 100) {
      playSuccess();
      if (celebrationsEnabled) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      playMistake();
    }

    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: 'passages',
      difficulty,
      score,
      accuracy: acc,
      timeSpentSeconds: elapsed
    });
  };

  if (viewMode === 'centre') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end px-2">
          <button
            onClick={() => setViewMode('quick_drills')}
            className="text-xs text-stone-500 hover:text-emerald-800 transition-colors py-1 px-3 rounded-lg border border-stone-200 bg-white shadow-xs"
          >
            Classic Matrix & Sound Drills →
          </button>
        </div>
        <CognitiveGamesCenter />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="flex justify-start">
        <button
          onClick={() => setViewMode('centre')}
          className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
        >
          ← Back to Cognitive Games Centre
        </button>
      </div>

      {/* Disclaimer Alert */}
      <div className="clean-card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#FFFFFF',
        borderColor: 'var(--border-subtle)',
        padding: '12px 18px'
      }}>
        <AlertCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Cognitive Engagement Notice: </strong> Memory Gym exercises provide focused working memory and attention practice inspired by Smriti Veda. They are deterministic skill challenges and do not claim to treat, prevent, or diagnose medical conditions.
        </span>
      </div>

      {/* Game Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'matrix', label: 'Pattern Matrix Recall', icon: Grid3X3 },
          { id: 'sequence', label: 'Chime Sequence Recall', icon: Layers },
          { id: 'passages', label: 'Cultural Passage Recall', icon: BookOpen }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeGame === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveGame(t.id as MemoryGameType); setGameState('idle'); }}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Game Container */}
      <div className="clean-card" style={{ padding: '32px', textAlign: 'center', background: '#FFFFFF' }}>
        {/* Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {activeGame === 'matrix' ? 'Spatial Matrix Memory' : activeGame === 'sequence' ? 'Sequential Sound & Color Memory' : 'Verbal & Philosophical Retention'}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => { setDifficulty(diff); setGameState('idle'); }}
                className={`btn btn-sm ${difficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', padding: '4px 10px', fontSize: '0.74rem' }}
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
              <div style={{ padding: '24px 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                  A pattern of illuminated tiles will appear for <strong>3 seconds</strong>. Once they vanish, tap the matching grid locations from working memory.
                </p>
                <button onClick={startMatrixGame} className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '0.88rem' }}>
                  <Play size={16} />
                  <span>Begin Challenge</span>
                </button>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall') && (
              <div>
                <div style={{ marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, color: gameState === 'memorize' ? 'var(--accent-amber)' : 'var(--primary)' }}>
                  {gameState === 'memorize' ? `Memorize the tiles! (${matrixTimer}s)` : 'Tap all the target tiles from memory!'}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gap: '8px',
                  maxWidth: '320px',
                  margin: '0 auto 24px auto'
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
                          borderRadius: '8px',
                          background: showTile ? 'var(--primary)' : 'var(--bg-card-inner)',
                          border: `2px solid ${showTile ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                          cursor: gameState === 'recall' ? 'pointer' : 'default',
                          transition: 'all 0.15s ease'
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
              <div style={{ padding: '24px 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                  Watch the illuminated sequence of colored pads. Once the playback completes, reproduce the exact order without mistakes.
                </p>
                <button onClick={startSequenceGame} className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '0.88rem' }}>
                  <Play size={16} />
                  <span>Start Sequence</span>
                </button>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall') && (
              <div>
                <div style={{ marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, color: gameState === 'memorize' ? 'var(--accent-amber)' : 'var(--primary)' }}>
                  {gameState === 'memorize' ? 'Observing Sequence...' : `Your turn! Tap sequence (${userSequence.length} / ${sequence.length})`}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto 24px auto' }}>
                  {[
                    { id: 0, color: '#285443', label: 'Sage' },
                    { id: 1, color: '#1E7065', label: 'Teal' },
                    { id: 2, color: '#C68019', label: 'Amber' },
                    { id: 3, color: '#A04332', label: 'Terracotta' },
                  ].map(pad => {
                    const isLit = flashingPad === pad.id;
                    return (
                      <div
                        key={pad.id}
                        onClick={() => handlePadClick(pad.id)}
                        style={{
                          height: '110px',
                          borderRadius: '12px',
                          background: isLit ? pad.color : 'var(--bg-card-inner)',
                          border: `2px solid ${isLit ? '#FFFFFF' : 'var(--border-subtle)'}`,
                          transform: isLit ? 'scale(1.03)' : 'scale(1)',
                          cursor: gameState === 'recall' ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isLit ? '#FFFFFF' : 'var(--text-main)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
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
              <div style={{ padding: '16px 0', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {CULTURAL_PASSAGES.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPassageIdx(idx)}
                      className={`btn btn-sm ${selectedPassageIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      {p.origin.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                  <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
                    {CULTURAL_PASSAGES[selectedPassageIdx].origin}
                  </span>
                  <blockquote style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-main)', margin: '12px 0', lineHeight: 1.6 }}>
                    "{CULTURAL_PASSAGES[selectedPassageIdx].quote}"
                  </blockquote>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Read carefully. When ready, click "Begin Recall Challenge" to test concept retention.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button onClick={startPassageGame} className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '0.88rem' }}>
                    <Play size={16} />
                    <span>Begin Recall Challenge</span>
                  </button>
                </div>
              </div>
            )}

            {gameState === 'memorize' && (
              <div style={{ textAlign: 'left', padding: '10px 0' }}>
                <div style={{ marginBottom: '18px' }}>
                  <span className="badge badge-teal">
                    {CULTURAL_PASSAGES[selectedPassageIdx].origin}
                  </span>
                  <h4 style={{ fontSize: '1rem', marginTop: '10px', color: 'var(--text-secondary)' }}>
                    Fill in the missing words from memory:
                  </h4>
                  <div style={{ fontSize: '1.15rem', lineHeight: 1.7, margin: '16px 0', color: 'var(--text-main)' }}>
                    {CULTURAL_PASSAGES[selectedPassageIdx].maskedQuote}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {CULTURAL_PASSAGES[selectedPassageIdx].blanks.map(blank => (
                    <div key={blank.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                        Blank [{blank.id}] Selection:
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {blank.options.map(opt => {
                          const isPicked = passageAnswers[blank.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handlePassageAnswer(blank.id, opt)}
                              className={`btn btn-sm ${isPicked ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
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
                    style={{ padding: '10px 28px', fontSize: '0.88rem', opacity: Object.keys(passageAnswers).length < 3 ? 0.4 : 1 }}
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
          <div style={{ padding: '24px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-subtle)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              color: 'var(--primary)'
            }}>
              <Award size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Session Recorded</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Your performance measures have been saved to your verified session log.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Accuracy</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {accuracy}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Score</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {gameScore}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => setGameState('idle')} className="btn btn-primary" style={{ padding: '8px 22px', fontSize: '0.84rem' }}>
                <RotateCcw size={15} />
                <span>Practice Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent History Table */}
      <div className="clean-card" style={{ padding: '20px 24px' }}>
        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>Recent Memory Sessions</h4>
        {memorySessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            No sessions played yet. Complete a game above to establish your baseline.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {memorySessions.slice(0, 4).map(s => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card-inner)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={14} color="var(--primary)" />
                  <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-main)' }}>{s.gameType}</span>
                  <span className="badge badge-teal" style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}>{s.difficulty}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{s.accuracy}% Acc</span>
                  <span style={{ color: 'var(--text-muted)' }}>{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
