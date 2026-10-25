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
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner / Hero */}
      {!activeGameId && (
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
            <Brain className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SMRITARA 3.3 Cognitive Training Platform</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight text-white">
              Cognitive Games Centre
            </h1>

            <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
              Scientifically grounded, procedurally generated cognitive exercises designed to strengthen
              visuospatial working memory, tone discrimination, digit span, and associative recall.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Procedural Generation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Web Audio Tone Synthesizer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 3D Spatial Transforms
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Real Adaptive Difficulty
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE GAME HUD & VIEW */}
      {activeGameId ? (
        <div className="space-y-6">
          {/* Active Navigation & Return Bar */}
          <div className="flex items-center justify-between bg-stone-50 px-6 py-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExitGame}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 bg-white shadow-xs transition-colors"
              >
                ← Back to Catalogue
              </button>
              <span className="text-xs text-stone-400">|</span>
              <span className="text-sm font-bold text-stone-800">
                {CATALOGUE.find(c => c.id === activeGameId)?.title}
              </span>
            </div>

            <button
              onClick={() => speakGameInstruction(activeGameId)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Voice Guide Rules</span>
            </button>
          </div>

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
        /* CATALOGUE GRID VIEW */
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Categories</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'all', label: 'All Games' },
                  { id: 'visual', label: 'Visual & Spatial' },
                  { id: 'audio', label: 'Audio & Rhythm' },
                  { id: 'working-memory', label: 'Working Memory' },
                  { id: 'cultural', label: 'Cultural & Semantic' },
                ] as { id: GameCategory; label: string }[]
              ).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Games Catalogue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalogue.map(game => (
              <div
                key={game.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-500/60 transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Header with Custom SVG Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 group-hover:scale-105 transition-transform">
                      <GameBadgeSVG badgeKey={game.badgeKey} size={42} />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        {game.categoryLabel}
                      </span>
                      {game.isProcedural && (
                        <span className="text-[10px] text-amber-700 font-medium">Procedural</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-stone-800 font-serif group-hover:text-emerald-900 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">{game.cognitiveDomain}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{game.description}</p>
                </div>

                <div className="pt-6 border-t border-stone-100 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{game.durationLabel}</span>
                  </div>

                  <button
                    onClick={() => handleLaunchGame(game.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs group-hover:translate-x-0.5 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Genuine Verified Memory Progress History */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-bold text-stone-800 font-serif">Verified Session Progress Log</h3>
              </div>
              <span className="text-xs text-stone-500">
                {memorySessions.length} completed {memorySessions.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>

            {memorySessions.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs bg-stone-50 rounded-2xl border border-stone-100">
                No game sessions recorded yet. Launch a session above to establish your verified cognitive baseline.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {memorySessions.slice(0, 6).map(sess => (
                  <div key={sess.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800 capitalize">
                          {sess.gameType.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="capitalize">{sess.difficulty}</span>
                          <span>•</span>
                          <span>{sess.timeSpentSeconds}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-bold text-emerald-800 block text-sm">+{sess.score} pts</span>
                        <span className="text-[10px] text-stone-500">{sess.accuracy}% Acc</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">{sess.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discard Active Session Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-stone-800">Discard Active Session?</h4>
              <p className="text-xs text-stone-600">
                Your current round in progress will not be recorded to your history.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelExit}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Resume Game
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Completion Modal */}
      {lastResult && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl border border-stone-200 text-center animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                Session Completed
              </span>
              <h3 className="text-2xl font-bold text-stone-800 font-serif">{lastResult.gameTitle}</h3>
              <p className="text-xs text-stone-600">{lastResult.details}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Score</span>
                <span className="text-xl font-bold text-emerald-800 block">+{lastResult.score}</span>
              </div>
              <div className="border-x border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Accuracy</span>
                <span className="text-xl font-bold text-stone-800 block">{lastResult.accuracy}%</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Time</span>
                <span className="text-xl font-bold text-stone-800 block">{lastResult.durationSeconds}s</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setLastResult(null);
                  setActiveGameId(null);
                }}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Catalogue
              </button>
              <button
                onClick={() => {
                  const curr = lastResult.gameId;
                  setLastResult(null);
                  handleLaunchGame(curr);
                }}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
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
