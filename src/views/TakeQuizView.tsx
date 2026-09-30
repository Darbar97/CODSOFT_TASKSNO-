import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Clock, 
  HelpCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RotateCcw, 
  Flame, 
  Award,
  Zap,
  Layers,
  Sparkles,
  Check,
  Volume2,
  VolumeX,
  Type,
  Keyboard,
  Info
} from 'lucide-react';
import { Quiz, QuizAttempt, Question } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';

interface TakeQuizViewProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const TakeQuizView: React.FC<TakeQuizViewProps> = ({
  quiz,
  onComplete,
  onExit
}) => {
  const { user } = useAuth();
  const { addAttemptRecord } = useQuiz();

  // Mode: Practice (instant feedback after picking) vs Exam (standard timed test)
  const [mode, setMode] = useState<'exam' | 'practice'>('exam');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  
  // Accessibility Features
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(true);

  // Timer state
  const totalSecondsInitial = quiz.timeLimitMinutes > 0 ? quiz.timeLimitMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSecondsInitial);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Modals & drawers
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Practice mode revealed state
  const [practiceAnswerRevealed, setPracticeAnswerRevealed] = useState(false);

  const timerRef = useRef<any>(null);

  const currentQ: Question = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const selectedOption = userAnswers[currentQ.id];
  const isAnswered = selectedOption !== undefined;
  const isFlagged = !!flaggedQuestions[currentQ.id];

  // Stop speech synthesis when question changes or on unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentQuestionIndex]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);

      if (quiz.timeLimitMinutes > 0) {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz.timeLimitMinutes]);

  // Text-To-Speech (Accessible Read Aloud)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const optionsText = currentQ.options
      .map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${opt}`)
      .join('. ');
    const fullText = `Question ${currentQuestionIndex + 1}: ${currentQ.text}. ${optionsText}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Keyboard navigation & Shortcuts for Accessible Quiz Taking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Option 1-6 or A-F
      const key = e.key.toUpperCase();
      const numKey = parseInt(e.key);

      if (numKey >= 1 && numKey <= currentQ.options.length) {
        e.preventDefault();
        handleSelectOption(numKey - 1);
        return;
      }

      const letterIndex = key.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, ...
      if (letterIndex >= 0 && letterIndex < currentQ.options.length) {
        e.preventDefault();
        handleSelectOption(letterIndex);
        return;
      }

      // Next: ArrowRight
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Prev: ArrowLeft
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        return;
      }

      // Flag: 'F'
      if (key === 'F') {
        e.preventDefault();
        handleToggleFlag();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, currentQ, userAnswers]);

  // Handle Option Click
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));

    if (mode === 'practice') {
      setPracticeAnswerRevealed(true);
    }
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setPracticeAnswerRevealed(false);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setPracticeAnswerRevealed(false);
    }
  };

  // Submit Logic
  const handleFinalSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    let score = 0;
    let earnedPoints = 0;
    let totalPoints = 0;

    quiz.questions.forEach(q => {
      const pts = Number(q.points) || 10;
      totalPoints += pts;
      if (userAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
        earnedPoints += pts;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const attempt: QuizAttempt = {
      id: 'att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      quizId: quiz.id,
      quizTitle: quiz.title,
      quizCategory: quiz.category,
      userId: user?.id || 'guest-taker',
      userName: user?.name || 'Guest Explorer',
      answers: userAnswers,
      score,
      totalQuestions,
      totalPoints,
      earnedPoints,
      percentage,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      mode
    };

    addAttemptRecord(attempt);
    onComplete(attempt);
  };

  const handleAutoSubmitOnTimeOut = () => {
    handleFinalSubmit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  // Font size classes
  const getPromptSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-xl sm:text-3xl';
      case 'xlarge':
        return 'text-2xl sm:text-4xl';
      default:
        return 'text-lg sm:text-2xl';
    }
  };

  const getOptionSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base sm:text-lg';
      case 'xlarge':
        return 'text-lg sm:text-xl';
      default:
        return 'text-sm sm:text-base';
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-4 max-w-4xl mx-auto space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 transition-colors">
        {/* Quiz Title & Back */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsExitModalOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit Quiz"
            aria-label="Exit Quiz"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800/60">
              {quiz.category}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
              {quiz.title}
            </h2>
          </div>
        </div>

        {/* Center / Right: Accessibility & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Read Aloud Text-to-Speech (Accessibility) */}
          <button
            onClick={handleToggleSpeech}
            className={`p-2 rounded-xl border transition-colors ${
              isSpeaking
                ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title={isSpeaking ? 'Stop voice reading' : 'Read question and options aloud (Text-to-Speech)'}
            aria-label={isSpeaking ? 'Stop read aloud' : 'Read question aloud'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Font Size Adjuster (Accessibility) */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                fontSize === 'normal' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Standard font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg transition-all text-sm ${
                fontSize === 'large' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Large font size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded-lg transition-all text-base ${
                fontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Extra large font size"
            >
              A++
            </button>
          </div>

          {/* Mode switch */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setMode('exam'); setPracticeAnswerRevealed(false); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === 'exam' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Exam Mode
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === 'practice' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Practice
            </button>
          </div>

          {/* Timer Display */}
          {quiz.timeLimitMinutes > 0 ? (
            <div 
              aria-live="polite"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
                secondsRemaining < 60
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          )}

          {/* Question Grid Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Question navigator palette"
            aria-label="Open question navigator"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            Question <span className="text-slate-900 dark:text-white font-black">{currentQuestionIndex + 1}</span> of {totalQuestions}
          </span>
          <span>{answeredCount} of {totalQuestions} Answered ({progressPercent}%)</span>
        </div>

        {/* Bar */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Keyboard Shortcut Ribbon */}
      <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
          <span>Keyboard enabled: Press <strong>1-4</strong> or <strong>A-D</strong> to choose • <strong>Arrows</strong> to navigate • <strong>F</strong> to flag</span>
        </div>
        <button
          onClick={() => setShowKeyboardHints(!showKeyboardHints)}
          className="hover:text-indigo-500 underline hidden sm:inline"
        >
          {showKeyboardHints ? 'Hide key hints' : 'Show key hints'}
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 flex-1 flex flex-col justify-between transition-colors">
        <div className="space-y-6">
          
          {/* Question Meta Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                #{currentQuestionIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Worth {currentQ.points || 10} points
              </span>
            </div>

            {/* Flag for review button */}
            <button
              onClick={handleToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                isFlagged
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
              aria-label={isFlagged ? 'Unflag question' : 'Flag question for review'}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFlagged ? 'Flagged' : 'Flag for review'}</span>
            </button>
          </div>

          {/* Question Text */}
          <h1 className={`font-extrabold text-slate-900 dark:text-white leading-snug ${getPromptSizeClass()}`}>
            {currentQ.text}
          </h1>

          {/* Options Grid */}
          <div 
            className="space-y-3 pt-2"
            role="radiogroup"
            aria-label={`Options for Question ${currentQuestionIndex + 1}`}
          >
            {currentQ.options.map((optionText, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOption === optIdx;
              
              const showPracticeResult = mode === 'practice' && (practiceAnswerRevealed || isAnswered);
              const isCorrectOption = optIdx === currentQ.correctOptionIndex;

              let cardStyle = 'bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50/40 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200';

              if (showPracticeResult) {
                if (isCorrectOption) {
                  cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectOption) {
                  cardStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200';
                }
              } else if (isSelected) {
                cardStyle = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-500 ${cardStyle}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      showPracticeResult && isCorrectOption
                        ? 'bg-emerald-600 text-white'
                        : showPracticeResult && isSelected && !isCorrectOption
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 group-hover:border-indigo-400'
                    }`}>
                      {showPracticeResult && isCorrectOption ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className={`leading-snug ${getOptionSizeClass()}`}>
                      {optionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {showKeyboardHints && (
                      <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                        {letter} / {optIdx + 1}
                      </kbd>
                    )}

                    {showPracticeResult && isCorrectOption && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                        Correct
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Practice Mode Explanation Box */}
          {mode === 'practice' && (practiceAnswerRevealed || isAnswered) && currentQ.explanation && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Explanation:</span>
              </div>
              <p className="leading-relaxed text-indigo-900/90 dark:text-indigo-200/90 pl-6">
                {currentQ.explanation}
              </p>
            </div>
          )}

        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={handlePrev}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs sm:text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Palette Modal/Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Question Navigator</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close navigator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 max-h-64 overflow-y-auto p-1">
              {quiz.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAns = userAnswers[q.id] !== undefined;
                const isFlg = !!flaggedQuestions[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsDrawerOpen(false);
                      setPracticeAnswerRevealed(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-black relative flex items-center justify-center transition-all border ${
                      isCurrent
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-750'
                    } ${
                      isAns
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlg && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border border-white dark:border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600" /> Unanswered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Flagged
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Ready to Submit?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You have answered <strong className="text-slate-800 dark:text-slate-200">{answeredCount}</strong> of{' '}
                <strong className="text-slate-800 dark:text-slate-200">{totalQuestions}</strong> questions.
              </p>
            </div>

            {answeredCount < totalQuestions && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>You have {totalQuestions - answeredCount} unanswered questions!</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Keep Reviewing
              </button>

              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base text-center">Leave Quiz?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Your current progress in this session will not be graded. Are you sure you want to exit?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Stay
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
