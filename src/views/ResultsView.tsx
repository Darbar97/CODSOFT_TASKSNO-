import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Award, 
  Compass, 
  PlusCircle, 
  Sparkles,
  Check,
  X,
  BookOpen
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types/quiz';

interface ResultsViewProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake: () => void;
  onShare: (quiz: Quiz, scoreText?: string) => void;
  onExplore: () => void;
  onCreateQuiz: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quiz,
  attempt,
  onRetake,
  onShare,
  onExplore,
  onCreateQuiz
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Trigger celebration confetti if score is >= 70%
  useEffect(() => {
    if (attempt.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [attempt.percentage]);

  const getGradeInfo = (percentage: number) => {
    if (percentage === 100) return { grade: 'A+', label: 'Flawless Victory!', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (percentage >= 90) return { grade: 'A', label: 'Outstanding!', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (percentage >= 80) return { grade: 'B', label: 'Great Job!', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    if (percentage >= 70) return { grade: 'C', label: 'Good Effort!', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (percentage >= 60) return { grade: 'D', label: 'Passed!', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', label: 'Keep Practicing!', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const gradeInfo = getGradeInfo(attempt.percentage);
  const correctCount = attempt.score;
  const incorrectCount = attempt.totalQuestions - correctCount;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} seconds`;
    return `${mins}m ${secs}s`;
  };

  // Filter review questions
  const filteredQuestions = quiz.questions.filter(q => {
    const userAnswer = attempt.answers[q.id];
    const isCorrect = userAnswer === q.correctOptionIndex;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto space-y-10">
      
      {/* Score Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 sm:p-12 text-center space-y-6 transition-colors">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>Quiz Completed: {quiz.title}</span>
        </div>

        {/* Circular / Large Score Display */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-8 border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/40 dark:to-slate-900 shadow-inner">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {attempt.percentage}%
            </span>
            <span className={`text-xs font-black uppercase tracking-wider ${gradeInfo.color}`}>
              Grade {gradeInfo.grade}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {gradeInfo.label}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            You scored {attempt.score} out of {attempt.totalQuestions} questions correctly in {formatTime(attempt.timeSpentSeconds)}.
          </p>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60">
            <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <p className="text-xl font-extrabold text-emerald-950 dark:text-emerald-200">{correctCount}</p>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/60">
            <div className="flex items-center justify-center gap-1 text-rose-700 dark:text-rose-400 font-bold mb-1">
              <XCircle className="w-4 h-4" />
              <span>Incorrect</span>
            </div>
            <p className="text-xl font-extrabold text-rose-950 dark:text-rose-200">{incorrectCount}</p>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/60">
            <div className="flex items-center justify-center gap-1 text-indigo-700 dark:text-indigo-400 font-bold mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Points Earned</span>
            </div>
            <p className="text-xl font-extrabold text-indigo-950 dark:text-indigo-200">
              {attempt.earnedPoints} <span className="text-xs text-indigo-400 font-normal">/ {attempt.totalPoints}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 font-bold mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Time Spent</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{formatTime(attempt.timeSpentSeconds)}</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => onShare(quiz, `${attempt.percentage}% (${attempt.score}/${attempt.totalQuestions})`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm transition-all shadow-sm shadow-indigo-500/25 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Browse More Quizzes</span>
          </button>
        </div>
      </div>

      {/* Question-By-Question In-Depth Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Answer Review & Explanations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              See what you got right, where you slipped, and learn the correct answers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold self-start sm:self-auto border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({quiz.questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'correct' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'incorrect' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, qIndex) => {
            const chosenOption = attempt.answers[q.id];
            const isCorrect = chosenOption === q.correctOptionIndex;
            const originalIndex = quiz.questions.findIndex(item => item.id === q.id);

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-7 space-y-4 shadow-xs transition-all ${
                  isCorrect 
                    ? 'border-emerald-200/90 dark:border-emerald-900/60' 
                    : 'border-rose-200/90 dark:border-rose-900/60'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                      #{originalIndex + 1}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}</span>
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Worth {q.points || 10} pts
                  </span>
                </div>

                {/* Prompt */}
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {q.text}
                </h4>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((optText, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isUserChoice = chosenOption === optIdx;
                    const isRightAnswer = optIdx === q.correctOptionIndex;

                    let optStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';

                    if (isRightAnswer) {
                      optStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                    } else if (isUserChoice && !isRightAnswer) {
                      optStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2.5 ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                            isRightAnswer
                              ? 'bg-emerald-600 text-white'
                              : isUserChoice && !isRightAnswer
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {isRightAnswer ? <Check className="w-3.5 h-3.5" /> : letter}
                          </span>
                          <span className="leading-snug truncate">{optText}</span>
                        </div>

                        {/* Labels */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isUserChoice && !isRightAnswer && (
                            <span className="text-[10px] uppercase font-bold bg-rose-200/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-full">
                              Your Answer
                            </span>
                          )}
                          {isRightAnswer && (
                            <span className="text-[10px] uppercase font-bold bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Explanation:
                    </span>
                    <p className="leading-relaxed text-indigo-900/90 dark:text-indigo-200/90 pl-5">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Inspired to make your own quiz?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Share your passion, test your peers, or design classroom assessments.</p>
        </div>
        <button
          onClick={onCreateQuiz}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create a Quiz</span>
        </button>
      </div>

    </div>
  );
};
