import React from 'react';
import { Clock, HelpCircle, Trophy, Bookmark, Play, Share2, MoreVertical, Trash2, Edit3, User, CheckCircle } from 'lucide-react';
import { Quiz } from '../types/quiz';
import { IconRenderer } from './IconRenderer';
import { useAuth } from '../context/AuthContext';

interface QuizCardProps {
  quiz: Quiz;
  onTakeQuiz: (quizId: string) => void;
  onShare: (quiz: Quiz) => void;
  onEdit?: (quizId: string) => void;
  onDelete?: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onTakeQuiz,
  onShare,
  onEdit,
  onDelete
}) => {
  const { user, toggleBookmark } = useAuth();
  const isBookmarked = user?.bookmarkedQuizIds.includes(quiz.id);
  const isAuthor = user?.id === quiz.authorId;

  const getDifficultyColor = (diff: Quiz['difficulty']) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Card Header Gradient Banner */}
      <div className={`h-24 bg-gradient-to-r ${quiz.coverColor || 'from-indigo-600 to-blue-700'} p-4 relative flex items-start justify-between text-white overflow-hidden`}>
        <div className="absolute -right-4 -bottom-4 opacity-15 transform rotate-12 scale-150 pointer-events-none">
          <IconRenderer name={quiz.icon} className="w-28 h-28" />
        </div>

        {/* Icon & Category Pill */}
        <div className="flex items-center gap-2 z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm">
            <IconRenderer name={quiz.icon} className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-white truncate max-w-[140px]">
            {quiz.category}
          </span>
        </div>

        {/* Difficulty Pill */}
        <div className="z-10 flex items-center gap-1.5">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(quiz.id);
            }}
            aria-label="Bookmark quiz"
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onTakeQuiz(quiz.id)}
            className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
            title={quiz.title}
          >
            {quiz.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {quiz.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{quiz.questions.length} Qs</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{quiz.timeLimitMinutes > 0 ? `${quiz.timeLimitMinutes} min` : 'No limit'}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{quiz.averageScore > 0 ? `${quiz.averageScore}% avg` : 'New'}</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Creator info + Play button */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 text-xs font-bold">
              {quiz.authorName ? quiz.authorName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {quiz.authorName || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onShare(quiz)}
              title="Share Quiz"
              aria-label="Share Quiz"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isAuthor && onDelete && (
              <button
                onClick={() => onDelete(quiz.id)}
                title="Delete Quiz"
                aria-label="Delete Quiz"
                className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onTakeQuiz(quiz.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 text-white text-xs font-semibold shadow-xs shadow-indigo-500/25 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
