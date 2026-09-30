import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Trophy, 
  Layers, 
  BookmarkCheck, 
  Clock, 
  Calendar, 
  PlusCircle, 
  Trash2, 
  Play, 
  Share2, 
  Sparkles, 
  Award, 
  RotateCcw,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { Quiz } from '../types/quiz';

interface ProfileViewProps {
  initialTab?: 'created' | 'history' | 'bookmarks';
  onTakeQuiz: (quizId: string) => void;
  onShareQuiz: (quiz: Quiz) => void;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialTab = 'history',
  onTakeQuiz,
  onShareQuiz,
  onNavigate,
  onOpenAuth
}) => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { quizzes, deleteQuiz } = useQuiz();
  const [activeTab, setActiveTab] = useState<'created' | 'history' | 'bookmarks'>(initialTab);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Personalized Dashboard</h2>
          <p className="text-xs text-slate-500">
            Sign in or register to track your scores, view attempt histories, save bookmarked quizzes, and manage challenges you've authored.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Quizzes created by user
  const userQuizzes = quizzes.filter(q => q.authorId === user.id || user.createdQuizIds.includes(q.id));
  
  // Bookmarked quizzes
  const bookmarkedQuizzes = quizzes.filter(q => user.bookmarkedQuizIds.includes(q.id));

  // Compute profile stats
  const totalAttempts = user.attempts.length;
  const avgScore = totalAttempts > 0 
    ? Math.round(user.attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts) 
    : 0;
  const perfectScores = user.attempts.filter(a => a.percentage === 100).length;

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-8">
      
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-50 dark:ring-slate-800 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white border-2 border-white dark:border-slate-900 shadow-sm" title="Active">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
              </div>

              <button
                onClick={() => onNavigate('create')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all self-center sm:self-start"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Quiz</span>
              </button>
            </div>

            {/* Bio Editor */}
            {isEditingBio ? (
              <div className="flex items-center gap-2 pt-1 max-w-md">
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell others about your quiz interests..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
                <button
                  onClick={handleSaveBio}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "{user.bio || 'Quiz lover & knowledge enthusiast'}"
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Edit bio"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/60 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Quizzes Taken</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalAttempts}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-900/60 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Average Score</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgScore}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100/80 dark:border-amber-900/60 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Perfect Scores</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{perfectScores}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Quizzes Created</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{userQuizzes.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Quiz History & Scores ({user.attempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'created'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>My Created Quizzes ({userQuizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bookmarks'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 text-emerald-500" />
          <span>Saved Bookmarks ({bookmarkedQuizzes.length})</span>
        </button>
      </div>

      {/* Tab 1: Quiz History & Attempts */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {user.attempts.length > 0 ? (
            <div className="space-y-3">
              {user.attempts.map((att) => {
                const targetQuiz = quizzes.find(q => q.id === att.quizId);
                return (
                  <div
                    key={att.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-200 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          {att.quizCategory}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(att.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {att.quizTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Answered {att.score} of {att.totalQuestions} questions correctly • Time spent: {att.timeSpentSeconds}s
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Score Tag */}
                      <div className="text-right">
                        <span className={`text-lg font-black ${
                          att.percentage >= 80 ? 'text-emerald-600' : att.percentage >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {att.percentage}%
                        </span>
                        <p className="text-[11px] font-semibold text-slate-400">{att.earnedPoints} pts</p>
                      </div>

                      {/* Retake action */}
                      {targetQuiz && (
                        <button
                          onClick={() => onTakeQuiz(targetQuiz.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No quiz attempts yet</h3>
              <p className="text-xs text-slate-500">Explore the library and complete your first quiz to track scores and history.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Browse Quizzes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Created Quizzes */}
      {activeTab === 'created' && (
        <div className="space-y-6">
          {userQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onTakeQuiz={onTakeQuiz}
                  onShare={onShareQuiz}
                  onDelete={deleteQuiz}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">You haven't built any quizzes yet</h3>
              <p className="text-xs text-slate-500">Design multiple-choice quizzes on any topic and challenge friends or students.</p>
              <button
                onClick={() => onNavigate('create')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Create Your First Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          {bookmarkedQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onTakeQuiz={onTakeQuiz}
                  onShare={onShareQuiz}
                  onDelete={deleteQuiz}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
              <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No bookmarked quizzes</h3>
              <p className="text-xs text-slate-500">Click the bookmark icon on any quiz card to save it for quick practice later.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Explore Quizzes
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
