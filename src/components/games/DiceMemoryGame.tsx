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
import { speakGameInstruction, speakRoundFeedback } from '../../engine/spokenGuideService';
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
    setPhase('inspect');
    setTimeLeft(round.memorizeSeconds);
    setStartTime(Date.now());

    speakGameInstruction('dice-memory');

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

    speakRoundFeedback(
      accuracy === 100 ? 'high' : accuracy >= 50 ? 'medium' : 'low',
      'dice-memory'
    );

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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ: DiceQuestion | undefined = round.questions[currentQuestionIdx];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
              3D Spatial Recall
            </span>
            <span className="text-xs text-stone-600">ID: {round.id.slice(-6)}</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 font-serif mt-1">3D Dice Memory</h2>
          <p className="text-xs text-stone-600">
            Observe the dice positions, pip values, and color themes in 3D space, then answer recall challenges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 2D Accessible Mode Toggle */}
          <button
            onClick={() => setUse2DMode(!use2DMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              use2DMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle between 3D transforms and high-contrast 2D view"
          >
            <Layers className="w-3.5 h-3.5" />
            {use2DMode ? '2D View Active' : '3D View Active'}
          </button>

          {/* Difficulty */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                disabled={phase === 'inspect'}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  difficulty === d
                    ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => speakGameInstruction('dice-memory')}
            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Listen to spoken instructions"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: Ready */}
      {phase === 'ready' && (
        <div className="text-center py-10 px-4 space-y-6">
          <div className="flex justify-center gap-4 py-2">
            <Die3DCube frontValue={3} colorTheme="emerald" size={68} rotateX={-15} rotateY={30} />
            <Die3DCube frontValue={5} colorTheme="amber" size={68} rotateX={-10} rotateY={-25} />
            <Die3DCube frontValue={6} colorTheme="ruby" size={68} rotateX={20} rotateY={35} />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-stone-800 font-serif">Spatial Dice Challenge</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Observe <strong className="text-emerald-800 font-semibold">{round.diceCount} colored dice</strong>{' '}
              rendered in 3D perspective for{' '}
              <strong className="text-amber-800 font-semibold">{round.memorizeSeconds} seconds</strong>. Remember their
              values, order, and colors.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={beginInspection}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Begin Inspection ({round.memorizeSeconds}s)
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Inspect */}
      {phase === 'inspect' && (
        <div className="space-y-6 text-center py-6">
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-5 h-5 text-amber-800 animate-pulse" />
            <span className="text-sm font-semibold text-amber-800">Memorize Scene: {timeLeft}s remaining</span>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-stone-100 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(timeLeft / round.memorizeSeconds) * 100}%` }}
            />
          </div>

          {/* 3D Dice Display Scene */}
          <div className="p-8 bg-gradient-to-b from-stone-50 to-stone-100/60 rounded-3xl border border-stone-200 shadow-inner max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-8 min-h-[220px]">
            {round.dice.map(die => (
              <div key={die.id} className="flex flex-col items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200 shadow-xs uppercase tracking-wider">
                  Die #{die.id}
                </span>

                {use2DMode ? (
                  <div className="p-2 bg-white rounded-2xl shadow-md border-2 border-emerald-600">
                    <DieFaceSVG value={die.value} size={70} />
                  </div>
                ) : (
                  <div className="p-3">
                    <Die3DCube
                      frontValue={die.value}
                      colorTheme={die.colorTheme}
                      rotateX={die.rotateX}
                      rotateY={die.rotateY}
                      size={76}
                    />
                  </div>
                )}

                <span className="text-[11px] font-medium text-stone-600 capitalize">{die.colorTheme}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: Questions */}
      {phase === 'question' && currentQ && (
        <div className="space-y-6 max-w-xl mx-auto py-4">
          <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-100 pb-3">
            <span>
              Question {currentQuestionIdx + 1} of {round.questions.length}
            </span>
            <span className="px-2.5 py-0.5 bg-stone-100 rounded-full font-medium">Dice Hidden</span>
          </div>

          {/* Question Prompt */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center space-y-2">
            <h3 className="text-lg font-bold text-stone-800">{currentQ.prompt}</h3>
            <p className="text-xs text-stone-600">Select the option you recall from the 3D scene.</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:border-emerald-500';
              if (questionAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 text-stone-600 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-emerald-50 border-emerald-700 text-emerald-900 font-semibold ring-2 ring-emerald-600/30';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={questionAnswered}
                  className={`p-4 rounded-2xl border text-sm md:text-base font-medium transition-all shadow-xs cursor-pointer flex items-center justify-center ${btnStyle}`}
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
