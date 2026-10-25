import React, { useState, useEffect, useRef } from 'react';
import { Die3DCube, DieFaceSVG } from '../common/icons/DiceSVGs';
import {
  generateDiceRound,
  calculateDiceScore,
  type DiceRound,
  type DiceQuestion,
  type GameDifficulty,
} from '../../engine/games/diceMemoryEngine';
import { evaluateAdaptiveDifficulty } from '../../engine/games/adaptiveDifficultyEngine';
import { spokenGuideService, speakGameInstruction, speakRoundFeedback } from '../../engine/spokenGuideService';
import { Play, RotateCcw, ArrowRight, Eye, CheckCircle2, XCircle, Info, Sparkles, Volume2, Layers } from 'lucide-react';

interface DiceMemoryGameProps {
  onComplete?: (result: {
    gameId: string;
    gameTitle: string;
    score: number;
    accuracy: number;
    difficulty: GameDifficulty;
    durationSeconds: number;
    details: string;
  }) => void;
  onExit?: () => void;
  initialDifficulty?: GameDifficulty;
}

type Phase = 'ready' | 'inspect' | 'question' | 'result';

export const DiceMemoryGame: React.FC<DiceMemoryGameProps> = ({
  onComplete,
  onExit,
  initialDifficulty = 'medium',
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [round, setRound] = useState<DiceRound>(() => generateDiceRound(initialDifficulty));
  const [phase, setPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [use2DMode, setUse2DMode] = useState<boolean>(false);

  // Question answering state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const timerRef = useRef<any>(null);

  const startNewRound = (diff: GameDifficulty = difficulty, seed?: string) => {
    spokenGuideService.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    const newRound = generateDiceRound(diff, seed);
    setRound(newRound);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSelectedOption(null);
    setQuestionAnswered(false);
    setPhase('ready');
    setTimeLeft(newRound.memorizeSeconds);
  };

  const handleDifficultyChange = (newDiff: GameDifficulty) => {
    setDifficulty(newDiff);
    startNewRound(newDiff);
  };

  const beginInspection = () => {
    spokenGuideService.stop();
    setPhase('inspect');
    setTimeLeft(round.memorizeSeconds);
    setStartTime(Date.now());

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('question');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionSelect = (opt: number | string) => {
    if (questionAnswered) return;
    setSelectedOption(opt);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || questionAnswered) return;

    const currentQ = round.questions[currentQuestionIdx];
    const newAnswers = { ...userAnswers, [currentQ.id]: selectedOption };
    setUserAnswers(newAnswers);
    setQuestionAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < round.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setQuestionAnswered(false);
    } else {
      // Completed all questions
      finishRound();
    }
  };

  const finishRound = () => {
    const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setElapsedTime(durationSec);

    let correctCount = 0;
    round.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / round.questions.length) * 100);
    const calculated = calculateDiceScore(round, accuracy, durationSec);
    const calculatedScore = calculated.points;

    setScore(calculatedScore);
    setPhase('result');

    const adaptive = evaluateAdaptiveDifficulty({
      gameId: 'dice-memory',
      currentDifficulty: difficulty,
      accuracy,
      averageResponseTimeSeconds: durationSec / round.questions.length,
      consecutiveSuccesses: accuracy === 100 ? 1 : 0,
      recentMistakes: round.questions.length - correctCount,
    });

    if (onComplete) {
      onComplete({
        gameId: 'dice-memory',
        gameTitle: '3D Dice Memory',
        score: calculatedScore,
        accuracy,
        difficulty,
        durationSeconds: durationSec,
        details: `${correctCount}/${round.questions.length} questions answered correctly in ${durationSec}s. ${adaptive.explanation}`,
      });
    }
  };

  useEffect(() => {
    return () => {
      spokenGuideService.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ: DiceQuestion | undefined = round.questions[currentQuestionIdx];

  return (
    <div className="clean-card" style={{ maxWidth: '860px', margin: '0 auto', background: '#FFFFFF', padding: '32px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-teal">3D Spatial Recall</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {round.id.slice(-6)}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 2px 0', color: 'var(--text-main)' }}>3D Dice Memory</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            Observe the dice positions, pip values, and color themes in 3D space, then answer recall challenges.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 2D Accessible Mode Toggle */}
          <button
            onClick={() => setUse2DMode(!use2DMode)}
            className={`btn btn-sm ${use2DMode ? 'btn-teal' : 'btn-secondary'}`}
            title="Toggle between 3D transforms and high-contrast 2D view"
          >
            <Layers size={14} />
            <span>{use2DMode ? '2D View Active' : '3D View Active'}</span>
          </button>

          {/* Difficulty */}
          <div style={{ display: 'flex', background: 'var(--bg-card-inner)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'inspect'}
                className={`btn btn-sm ${difficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', padding: '4px 10px', fontSize: '0.76rem' }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (spokenGuideService.getState() === 'speaking') {
                spokenGuideService.stop();
              } else {
                speakGameInstruction('dice-memory');
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Listen to spoken instructions (Click to stop)"
          >
            <Volume2 size={16} />
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="btn btn-secondary btn-sm"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: Ready */}
      {phase === 'ready' && (
        <div style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <Die3DCube frontValue={3} colorTheme="emerald" size={68} rotateX={-15} rotateY={30} />
            <Die3DCube frontValue={5} colorTheme="amber" size={68} rotateX={-10} rotateY={-25} />
            <Die3DCube frontValue={6} colorTheme="ruby" size={68} rotateX={20} rotateY={35} />
          </div>

          <div style={{ maxWidth: '480px', margin: '0 auto 24px auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Spatial Dice Challenge</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Observe <strong style={{ color: 'var(--primary)' }}>{round.diceCount} colored dice</strong>{' '}
              rendered in 3D perspective for{' '}
              <strong style={{ color: 'var(--accent-amber)' }}>{round.memorizeSeconds} seconds</strong>. Remember their
              values, order, and colors.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={beginInspection}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="currentColor" />
              <span>Begin Inspection ({round.memorizeSeconds}s)</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Inspect */}
      {phase === 'inspect' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <Eye size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              Memorize Scene: {timeLeft}s remaining
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '260px', height: '6px', background: 'var(--bg-card-inner)', borderRadius: '9999px', margin: '0 auto 24px auto', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--accent-amber)',
                transition: 'width 1s linear',
                width: `${(timeLeft / round.memorizeSeconds) * 100}%`
              }}
            />
          </div>

          {/* 3D Dice Display Scene */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              minHeight: '220px',
              padding: '32px',
              background: 'var(--bg-card-inner)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '640px',
              margin: '0 auto'
            }}
          >
            {round.dice.map(die => (
              <div key={die.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: '#FFFFFF', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>
                  Die #{die.id}
                </span>

                {use2DMode ? (
                  <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                    <DieFaceSVG value={die.value} size={70} />
                  </div>
                ) : (
                  <div style={{ padding: '8px' }}>
                    <Die3DCube
                      frontValue={die.value}
                      colorTheme={die.colorTheme}
                      rotateX={die.rotateX}
                      rotateY={die.rotateY}
                      size={76}
                    />
                  </div>
                )}

                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {die.colorTheme}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Questions */}
      {phase === 'question' && currentQ && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '580px', margin: '0 auto', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <span>
              Question {currentQuestionIdx + 1} of {round.questions.length}
            </span>
            <span className="badge badge-neutral">Dice Hidden</span>
          </div>

          {/* Question Prompt */}
          <div style={{ background: 'var(--bg-card-inner)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{currentQ.prompt}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Select the option you recall from the 3D scene.</p>
          </div>

          {/* Multiple Choice Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnBg = '#FFFFFF';
              let btnBorder = 'var(--border-subtle)';
              let btnColor = 'var(--text-main)';

              if (questionAnswered) {
                if (isCorrect) {
                  btnBg = 'var(--primary-subtle)';
                  btnBorder = 'var(--primary)';
                  btnColor = 'var(--primary)';
                } else if (isSelected && !isCorrect) {
                  btnBg = '#FFF1F2';
                  btnBorder = '#F43F5E';
                  btnColor = '#9F1239';
                } else {
                  btnBg = 'var(--bg-card-inner)';
                  btnBorder = 'var(--border-subtle)';
                  btnColor = 'var(--text-muted)';
                }
              } else if (isSelected) {
                btnBg = 'var(--primary-subtle)';
                btnBorder = 'var(--primary)';
                btnColor = 'var(--primary)';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={questionAnswered}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${btnBorder}`,
                    background: btnBg,
                    color: btnColor,
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: questionAnswered ? 'default' : 'pointer',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {questionAnswered && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-800">Incorrect.</span>
                  </>
                )}
              </div>
              <p className="text-xs text-stone-700">{currentQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            {!questionAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-900/10"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                {currentQuestionIdx + 1 < round.questions.length ? 'Next Question' : 'View Session Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: Summary Result */}
      {phase === 'result' && (
        <div className="space-y-6 text-center py-4">
          <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm">
              <Sparkles className="w-7 h-7 text-emerald-700" />
            </div>

            <h3 className="text-2xl font-bold text-stone-800 font-serif">Spatial Memory Evaluated</h3>
            <p className="text-sm text-stone-700">
              You correctly resolved{' '}
              {round.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length} of {round.questions.length}{' '}
              spatial recall challenges.
            </p>

            <div className="flex justify-center gap-6 pt-2">
              <div>
                <span className="text-xs text-stone-600 block">Score</span>
                <span className="text-xl font-bold text-emerald-800">+{score} pts</span>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <span className="text-xs text-stone-600 block">Time</span>
                <span className="text-xl font-bold text-stone-800">{elapsedTime}s</span>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <span className="text-xs text-stone-600 block">Difficulty</span>
                <span className="text-xl font-bold text-stone-800 capitalize">{difficulty}</span>
              </div>
            </div>
          </div>

          {/* Reveal original dice scene for verification */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-stone-700 block">Original Scene Reference</span>
            <div className="flex flex-wrap items-center justify-center gap-6 py-2">
              {round.dice.map(die => (
                <div key={die.id} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] text-stone-600 font-semibold uppercase">Die #{die.id}</span>
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
                    <DieFaceSVG value={die.value} size={48} />
                  </div>
                  <span className="text-[10px] text-stone-600 capitalize">
                    {die.value} pips ({die.colorTheme})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => startNewRound(difficulty)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              New Dice Scene
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-medium rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all text-sm"
              >
                Back to Catalogue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
