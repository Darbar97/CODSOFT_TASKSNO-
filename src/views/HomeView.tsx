import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  Compass, 
  Trophy, 
  HelpCircle, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { CATEGORIES } from '../data/sampleQuizzes';
import { IconRenderer } from '../components/IconRenderer';
import { Quiz } from '../types/quiz';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onTakeQuiz: (quizId: string) => void;
  onShareQuiz: (quiz: Quiz) => void;
  onDeleteQuiz?: (quizId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onTakeQuiz,
  onShareQuiz,
  onDeleteQuiz
}) => {
  const { quizzes } = useQuiz();

  // Highlighted quizzes
  const featuredQuizzes = quizzes.slice(0, 3);
  const trendingQuizzes = [...quizzes].sort((a, b) => b.playsCount - a.playsCount).slice(0, 3);

  const totalPlays = quizzes.reduce((acc, q) => acc + q.playsCount, 0);
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-2xl p-8 sm:p-12 lg:p-16 border border-indigo-700/30">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>The Modern Quiz & Trivia Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Create, Challenge & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-indigo-200">Master Any Subject</span>
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed font-normal max-w-2xl">
            Build customized multiple-choice quizzes with timer controls and rich explanations, or test your skills against community-crafted challenges with instant feedback.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 hover:shadow-lg hover:shadow-white/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Create a Quiz</span>
            </button>

            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-sm border border-indigo-500/40 backdrop-blur-sm active:scale-95 transition-all"
            >
              <Compass className="w-5 h-5 text-indigo-200" />
              <span>Take a Quiz Now</span>
            </button>
          </div>

          {/* Key Metrics Row */}
          <div className="pt-6 sm:pt-8 border-t border-indigo-700/40 grid grid-cols-3 gap-4 max-w-lg text-indigo-200">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{quizzes.length}</p>
              <p className="text-xs text-indigo-300 font-medium">Available Quizzes</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalPlays.toLocaleString()}+</p>
              <p className="text-xs text-indigo-300 font-medium">Quiz Attempts</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalQuestions}+</p>
              <p className="text-xs text-indigo-300 font-medium">Curated Questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories Carousel/Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Explore by Topic</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Pick a subject to challenge yourself</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const count = quizzes.filter(q => q.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigate('explore', cat.name)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-left flex items-start gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color} dark:bg-slate-800 dark:text-indigo-400 dark:border-slate-700 group-hover:scale-105 transition-transform`}>
                  <IconRenderer name={cat.iconName} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {count} {count === 1 ? 'quiz' : 'quizzes'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accessibility For All Highlight Banner */}
      <section className="rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider bg-white dark:bg-indigo-900/60 px-3 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Inclusive Learning Platform
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Accessible for Everyone
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              QuizCraft is open to all. No login required to test your knowledge. Built with keyboard controls (keys 1-4 & A-D), Voice Read-Aloud (Text-to-Speech), scalable typography, and high-contrast Dark & Light mode.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs w-full md:w-auto flex-shrink-0">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Free Guest Play</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Voice Read-Aloud</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Keyboard Controls</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Dark & Light Themes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Featured Quizzes</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Staff-picked challenges for curious minds</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTakeQuiz={onTakeQuiz}
              onShare={onShareQuiz}
              onDelete={onDeleteQuiz}
            />
          ))}
        </div>
      </section>

      {/* How it Works / Value Pillars */}
      <section className="rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800">
            Simple & Powerful
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How QuizCraft Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A seamless workflow designed for educators, students, and trivia enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-800">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Craft Your Quiz</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add custom multiple-choice questions, set time limits, adjust point values, and add helpful explanations for every answer.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-800">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Take & Test Yourself</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Experience one-question-at-a-time focus with live timers, progress bars, flag-for-review navigation, and practice modes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-800">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Feedback & Mastery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get immediate scoring, letter grade breakdown, and in-depth question explanations to turn every quiz into a learning opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Community Most Popular */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Most Popular Challenges</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">The most attempted quizzes across the community</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Browse Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTakeQuiz={onTakeQuiz}
              onShare={onShareQuiz}
              onDelete={onDeleteQuiz}
            />
          ))}
        </div>
      </section>

      {/* Create Call To Action Box */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-700 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/20">
        <div className="space-y-2 max-w-lg text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Have a topic you want to quiz others on?</h2>
          <p className="text-indigo-100 text-sm">
            It takes under 2 minutes to create and share your first interactive quiz. No setup required!
          </p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 shadow-lg active:scale-95 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <span>Launch Quiz Creator</span>
        </button>
      </section>

    </div>
  );
};
