import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  HelpCircle, 
  Trophy, 
  PlusCircle, 
  Layers,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { CATEGORIES } from '../data/sampleQuizzes';
import { Quiz, Category, Difficulty } from '../types/quiz';

interface ExploreViewProps {
  initialCategory?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTakeQuiz: (quizId: string) => void;
  onShareQuiz: (quiz: Quiz) => void;
  onDeleteQuiz?: (quizId: string) => void;
  onNavigate: (view: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialCategory,
  searchQuery,
  onSearchChange,
  onTakeQuiz,
  onShareQuiz,
  onDeleteQuiz,
  onNavigate
}) => {
  const { quizzes } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'questions'>('popular');

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Category filter
      if (selectedCategory !== 'ALL' && quiz.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && quiz.difficulty !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = quiz.title.toLowerCase().includes(query);
        const matchesDesc = quiz.description.toLowerCase().includes(query);
        const matchesCategory = quiz.category.toLowerCase().includes(query);
        const matchesAuthor = quiz.authorName.toLowerCase().includes(query);
        const matchesTags = quiz.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesCategory || matchesAuthor || matchesTags;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.playsCount - a.playsCount;
      if (sortBy === 'rating') return b.averageScore - a.averageScore;
      if (sortBy === 'questions') return b.questions.length - a.questions.length;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [quizzes, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800">
            Browse All Quizzes
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Quiz Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover community quizzes across sciences, coding, history, and trivia. Open and accessible to all.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by quiz title, topic, author or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <ArrowUpDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="popular" className="dark:bg-slate-800">Most Popular</option>
                <option value="rating" className="dark:bg-slate-800">Top Rated</option>
                <option value="newest" className="dark:bg-slate-800">Newest First</option>
                <option value="questions" className="dark:bg-slate-800">Most Questions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills horizontal scroll */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-750'
              }`}
            >
              All Categories ({quizzes.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = quizzes.filter(q => q.category === cat.name).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.name
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.name ? 'bg-indigo-700 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Difficulty:</span>
          {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 dark:bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters Badges */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredQuizzes.length}</strong> {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
        </span>

        {(selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedDifficulty('ALL');
              onSearchChange('');
            }}
            className="text-indigo-600 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTakeQuiz={onTakeQuiz}
              onShare={onShareQuiz}
              onDelete={onDeleteQuiz}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No quizzes found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any quizzes matching your search or filter criteria. Try clearing filters or create the first quiz for this topic!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedDifficulty('ALL');
                onSearchChange('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('create')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
