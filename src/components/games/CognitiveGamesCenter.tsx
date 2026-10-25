import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FruitPathGame } from './FruitPathGame';
import { MemoryMelodyGame } from './MemoryMelodyGame';
import { PatternMemoryGame } from './PatternMemoryGame';
import { DiceMemoryGame } from './DiceMemoryGame';
import { NumberSequenceGame } from './NumberSequenceGame';
import { MemoryMatchGame } from '../smritiveda/MemoryMatchGame';
import { ObjectMemoryGame } from '../smritiveda/ObjectMemoryGame';
import { PassageRecallGame } from '../smritiveda/PassageRecallGame';
import { GameBadgeSVG } from '../common/icons/GameBadges';
import { speakGameInstruction, speakRoundFeedback } from '../../engine/spokenGuideService';
import {
  Brain,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Clock,
  Award,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Filter,
  History,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './CognitiveGamesCenter.css';

export type GameCategory = 'all' | 'visual' | 'audio' | 'working-memory' | 'cultural';

interface GameCatalogueItem {
  id: string;
  badgeKey: 'fruit-path' | 'melody' | 'pattern' | 'dice-3d' | 'adaptive' | 'default';
  title: string;
  category: 'visual' | 'audio' | 'working-memory' | 'cultural';
  categoryLabel: string;
  cognitiveDomain: string;
  description: string;
  durationLabel: string;
  isProcedural: boolean;
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
}

const CATALOGUE: GameCatalogueItem[] = [
  {
    id: 'fruit-path',
    badgeKey: 'fruit-path',
    title: 'Fruit Memory Path',
    category: 'visual',
    categoryLabel: 'Visual & Spatial',
    cognitiveDomain: 'Visuospatial path sequencing & distractor inhibition',
    description: 'Memorize sequential stepping stones of indigenous fruits across the orchard board.',
    durationLabel: '3–5 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'memory-melody',
    badgeKey: 'melody',
    title: 'Memory Melody',
    category: 'audio',
    categoryLabel: 'Audio & Rhythm',
    cognitiveDomain: 'Acoustic working memory & tonal discrimination',
    description: 'Listen to pure acoustic harmonic tone sequences (Sa–Sa\') synthesized via Web Audio and reproduce them.',
    durationLabel: '3–5 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'pattern-memory',
    badgeKey: 'pattern',
    title: 'Sacred Pattern Memory',
    category: 'visual',
    categoryLabel: 'Visual & Spatial',
    cognitiveDomain: 'Sacred geometric matrix reconstruction & spatial orientation',
    description: 'Observe procedurally calibrated arrangements of sacred symbols and reconstruct the grid with diagnostic error feedback.',
    durationLabel: '4–6 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'dice-memory',
    badgeKey: 'dice-3d',
    title: '3D Dice Memory',
    category: 'visual',
    categoryLabel: 'Visual & Spatial',
    cognitiveDomain: '3D spatial perspective, rotation recall & numerical summing',
    description: 'Inspect authentic 3D dice positions and pip orientations in perspective space with accessible 2D toggle.',
    durationLabel: '3–5 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'number-sequence',
    badgeKey: 'adaptive',
    title: 'Digit Span & Reverse Recall',
    category: 'working-memory',
    categoryLabel: 'Working Memory',
    cognitiveDomain: 'Central executive working memory & digit transposition',
    description: 'Train digit span memory with both forward reproduction and high-load reverse working memory recall.',
    durationLabel: '3–5 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'object-memory',
    badgeKey: 'default',
    title: 'Cultural Object Memory',
    category: 'cultural',
    categoryLabel: 'Cultural & Semantic',
    cognitiveDomain: 'Categorical encoding & visual-semantic retention',
    description: 'Retain collections of auspicious cultural instruments, diyas, bells, and manuscripts with original SVG vector art.',
    durationLabel: '4–6 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'memory-match',
    badgeKey: 'default',
    title: 'Philosophical Values Match',
    category: 'cultural',
    categoryLabel: 'Cultural & Semantic',
    cognitiveDomain: 'Associative memory & philosophical concept mapping',
    description: 'Uncover paired cards of Dharma, Satya, Shanti, and Prana to strengthen associative recall paths.',
    durationLabel: '3–5 min',
    isProcedural: true,
    recommendedDifficulty: 'medium',
  },
  {
    id: 'passage-recall',
    badgeKey: 'default',
    title: 'Sacred Passage Recall',
    category: 'cultural',
    categoryLabel: 'Cultural & Semantic',
    cognitiveDomain: 'Verbal memory & contextual cloze retrieval',
    description: 'Recall missing philosophical keywords from the Thirukkural, Katha Upanishad, and Meditations.',
    durationLabel: '5–8 min',
    isProcedural: false,
    recommendedDifficulty: 'medium',
  },
];

export const CognitiveGamesCenter: React.FC = () => {
  const { recordMemorySession, memorySessions, soundEnabled, celebrationsEnabled } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Result dialog
  const [lastResult, setLastResult] = useState<{
    gameId: string;
    gameTitle: string;
    score: number;
    accuracy: number;
    difficulty: string;
    durationSeconds: number;
    details: string;
  } | null>(null);

  const filteredCatalogue = CATALOGUE.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleLaunchGame = (gameId: string) => {
    setActiveGameId(gameId);
    setLastResult(null);
    speakGameInstruction(gameId);
  };

  const handleGameComplete = (result: {
    gameId: string;
    gameTitle: string;
    score: number;
    accuracy: number;
    difficulty: 'easy' | 'medium' | 'hard';
    durationSeconds: number;
    details: string;
  }) => {
    setLastResult(result);

    // Save session to user's real progress
    recordMemorySession({
      date: new Date().toISOString().split('T')[0],
      gameType: result.gameId as any,
      difficulty: result.difficulty as any,
      score: result.score,
      accuracy: result.accuracy,
      timeSpentSeconds: result.durationSeconds,
      notes: result.details,
    });

    if (celebrationsEnabled && result.accuracy >= 70) {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleExitGame = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setActiveGameId(null);
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className="cgc-wrapper">
      {/* 1. TOP HERO BANNER (Shown when viewing catalogue) */}
      {!activeGameId && (
        <section className="cgc-hero" aria-label="Cognitive Games Hub Header">
          <div className="cgc-hero-bg-icon" aria-hidden="true">
            <Brain size={280} color="#FFFFFF" />
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div className="cgc-hero-badge">
              <Sparkles size={14} />
              <span>SMRITARA 3.3 Cognitive Training Platform</span>
            </div>

            <h1 className="cgc-hero-title">
              Cognitive Games Centre
            </h1>

            <p className="cgc-hero-desc">
              Scientifically grounded, procedurally generated cognitive exercises designed to strengthen
              visuospatial working memory, tone discrimination, digit span, and associative recall.
            </p>

            <div className="cgc-hero-features">
              <div className="cgc-hero-feat-item">
                <CheckCircle2 size={15} color="#6EE7B7" />
                <span>Procedural Generation</span>
              </div>
              <div className="cgc-hero-feat-item">
                <CheckCircle2 size={15} color="#6EE7B7" />
                <span>Web Audio Tone Synthesizer</span>
              </div>
              <div className="cgc-hero-feat-item">
                <CheckCircle2 size={15} color="#6EE7B7" />
                <span>3D Spatial Perspective</span>
              </div>
              <div className="cgc-hero-feat-item">
                <CheckCircle2 size={15} color="#6EE7B7" />
                <span>Adaptive Difficulty Calibration</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ACTIVE GAMEPLAY VIEW */}
      {activeGameId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Navigation & Return Bar */}
          <nav className="cgc-hud-bar" aria-label="Game Session Navigation">
            <div className="cgc-hud-left">
              <button
                onClick={handleExitGame}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Return to the games catalogue"
              >
                <ArrowLeft size={14} />
                <span>Back to Catalogue</span>
              </button>
              <span style={{ color: 'var(--border-medium)', fontSize: '0.85rem' }}>|</span>
              <span className="cgc-hud-title">
                {CATALOGUE.find(c => c.id === activeGameId)?.title}
              </span>
            </div>

            <div className="cgc-hud-right">
              <button
                onClick={() => speakGameInstruction(activeGameId)}
                className="btn btn-teal btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Hear rules spoken aloud"
              >
                <Volume2 size={15} />
                <span>Spoken Rules</span>
              </button>
            </div>
          </nav>

          {/* Mount Selected Game Component */}
          {activeGameId === 'fruit-path' && (
            <FruitPathGame onComplete={handleGameComplete} onExit={handleExitGame} />
          )}
          {activeGameId === 'memory-melody' && (
            <MemoryMelodyGame onComplete={handleGameComplete} onExit={handleExitGame} />
          )}
          {activeGameId === 'pattern-memory' && (
            <PatternMemoryGame onComplete={handleGameComplete} onExit={handleExitGame} />
          )}
          {activeGameId === 'dice-memory' && (
            <DiceMemoryGame onComplete={handleGameComplete} onExit={handleExitGame} />
          )}
          {activeGameId === 'number-sequence' && (
            <NumberSequenceGame onComplete={handleGameComplete} onExit={handleExitGame} />
          )}
          {activeGameId === 'object-memory' && (
            <ObjectMemoryGame onComplete={() => setActiveGameId(null)} />
          )}
          {activeGameId === 'memory-match' && (
            <MemoryMatchGame onComplete={() => setActiveGameId(null)} />
          )}
          {activeGameId === 'passage-recall' && (
            <PassageRecallGame onComplete={() => setActiveGameId(null)} />
          )}
        </div>
      ) : (
        /* 3. CATALOGUE CARDS GRID VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category Filter Tabs */}
          <div className="cgc-filter-bar">
            <div className="cgc-filter-label">
              <Filter size={15} color="var(--primary)" />
              <span>Category Filter</span>
            </div>

            <div className="cgc-filter-group" role="tablist">
              {(
                [
                  { id: 'all', label: 'All 8 Games' },
                  { id: 'visual', label: 'Visual & Spatial' },
                  { id: 'audio', label: 'Audio & Rhythm' },
                  { id: 'working-memory', label: 'Working Memory' },
                  { id: 'cultural', label: 'Cultural & Semantic' },
                ] as { id: GameCategory; label: string }[]
              ).map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cgc-filter-btn ${isActive ? 'active' : ''}`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive Games Grid */}
          <div className="cgc-grid" role="list">
            {filteredCatalogue.map(game => (
              <article key={game.id} className="cgc-card" role="listitem">
                <div>
                  {/* Card Header with Custom SVG Badge */}
                  <div className="cgc-card-top">
                    <div className="cgc-card-badge-box" aria-hidden="true">
                      <GameBadgeSVG badgeKey={game.badgeKey} size={42} />
                    </div>

                    <div className="cgc-card-tags">
                      <span className={`badge ${
                        game.category === 'audio'
                          ? 'badge-amber'
                          : game.category === 'working-memory'
                          ? 'badge-terracotta'
                          : game.category === 'cultural'
                          ? 'badge-sage'
                          : 'badge-teal'
                      }`}>
                        {game.categoryLabel}
                      </span>
                      {game.isProcedural && (
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', color: 'var(--accent-amber)' }}>
                          Procedural
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Title & Content */}
                  <div className="cgc-card-body">
                    <h2 className="cgc-card-title">{game.title}</h2>
                    <p className="cgc-card-domain">{game.cognitiveDomain}</p>
                    <p className="cgc-card-desc">{game.description}</p>
                  </div>
                </div>

                {/* Card Footer with Duration & Action Button */}
                <div className="cgc-card-footer">
                  <div className="cgc-card-time">
                    <Clock size={14} />
                    <span>{game.durationLabel}</span>
                  </div>

                  <button
                    onClick={() => handleLaunchGame(game.id)}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                    aria-label={`Play session of ${game.title}`}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Play Session</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Verified Cognitive Session History Log */}
          <section className="cgc-history-box" aria-label="Verified Cognitive History">
            <div className="cgc-history-header">
              <div className="cgc-history-title-group">
                <History size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Verified Session Progress Log
                </h2>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
                {memorySessions.length} {memorySessions.length === 1 ? 'session' : 'sessions'} completed
              </span>
            </div>

            {memorySessions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: 'var(--text-muted)',
                fontSize: '0.86rem',
                background: 'var(--bg-card-inner)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                No game sessions recorded yet. Launch a session above to establish your verified cognitive baseline.
              </div>
            ) : (
              <div>
                {memorySessions.slice(0, 6).map((sess, idx) => (
                  <div key={sess.id || idx} className="cgc-history-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        <Award size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                          {sess.gameType.replace('-', ' ')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                          <span style={{ textTransform: 'capitalize' }}>{sess.difficulty}</span>
                          <span>•</span>
                          <span>{sess.timeSpentSeconds}s elapsed</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.94rem' }}>
                        +{sess.score} pts
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sess.accuracy}% Acc • {sess.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Discard Active Session Confirmation Modal */}
      {showExitConfirm && (
        <div className="cgc-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-exit-title">
          <div className="cgc-modal-card">
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-amber-subtle)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertTriangle size={26} />
            </div>

            <h3 id="modal-exit-title" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Discard Active Session?
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '22px', lineHeight: 1.5 }}>
              Your current exercise round is in progress. If you exit now, this round will not be recorded to your progress history.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={cancelExit}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                Resume Game
              </button>
              <button
                onClick={confirmExit}
                className="btn btn-terracotta"
                style={{ flex: 1, padding: '10px' }}
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Completion Modal */}
      {lastResult && (
        <div className="cgc-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-complete-title">
          <div className="cgc-modal-card" style={{ maxWidth: '480px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Award size={34} />
            </div>

            <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
              Session Completed
            </span>
            <h2 id="modal-complete-title" style={{ fontSize: '1.45rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>
              {lastResult.gameTitle}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              {lastResult.details}
            </p>

            <div className="cgc-result-stats-grid">
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Score</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginTop: '2px' }}>
                  +{lastResult.score}
                </span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Accuracy</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                  {lastResult.accuracy}%
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Duration</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                  {lastResult.durationSeconds}s
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setLastResult(null);
                  setActiveGameId(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                Catalogue
              </button>
              <button
                onClick={() => {
                  const curr = lastResult.gameId;
                  setLastResult(null);
                  handleLaunchGame(curr);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px' }}
              >
                Play Another Round
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
