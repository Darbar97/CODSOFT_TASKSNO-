import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { CreateQuizView } from './views/CreateQuizView';
import { TakeQuizView } from './views/TakeQuizView';
import { ResultsView } from './views/ResultsView';
import { ProfileView } from './views/ProfileView';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { DeveloperModal } from './components/DeveloperModal';
import { Quiz, QuizAttempt } from './types/quiz';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { quizzes, deleteQuiz } = useQuiz();
  const { user } = useAuth();

  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'create' | 'take' | 'results' | 'profile'>('home');
  const [profileTab, setProfileTab] = useState<'created' | 'history' | 'bookmarks'>('history');
  const [exploreCategory, setExploreCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Take / Results state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<{ quiz: Quiz; scoreText?: string } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check URL params on initial mount for direct quiz share links
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const quizParam = urlParams.get('quiz');
      if (quizParam) {
        const found = quizzes.find(q => q.id === quizParam);
        if (found) {
          setActiveQuizId(quizParam);
          setCurrentView('take');
        }
      }
    } catch {
      // ignore
    }
  }, [quizzes]);

  // Handlers
  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') {
      setCurrentView('home');
    } else if (view === 'explore') {
      if (param) setExploreCategory(param);
      else setExploreCategory('ALL');
      setCurrentView('explore');
    } else if (view === 'create') {
      setCurrentView('create');
    } else if (view === 'profile') {
      if (param === 'created' || param === 'history' || param === 'bookmarks') {
        setProfileTab(param);
      }
      setCurrentView('profile');
    }
  };

  const handleStartTakeQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentView('take');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteAttempt = (attempt: QuizAttempt) => {
    setLatestAttempt(attempt);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Quiz submitted! Check out your instant results.', 'success');
  };

  const handleQuizCreated = (newQuizId: string) => {
    showToast('Quiz published successfully! Ready to take or share.', 'success');
    handleStartTakeQuiz(newQuizId);
  };

  const handleShareQuiz = (quiz: Quiz, scoreText?: string) => {
    setShareModalData({ quiz, scoreText });
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(quizId);
      showToast('Quiz deleted successfully.');
    }
  };

  const activeQuiz = activeQuizId ? quizzes.find(q => q.id === activeQuizId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDeveloper={() => setIsDeveloperModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onTakeQuiz={handleStartTakeQuiz}
            onShareQuiz={handleShareQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialCategory={exploreCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTakeQuiz={handleStartTakeQuiz}
            onShareQuiz={handleShareQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'create' && (
          <CreateQuizView
            onQuizCreated={handleQuizCreated}
            onCancel={() => handleNavigate('explore')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'take' && activeQuiz && (
          <TakeQuizView
            quiz={activeQuiz}
            onComplete={handleCompleteAttempt}
            onExit={() => handleNavigate('explore')}
          />
        )}

        {currentView === 'results' && latestAttempt && (
          <ResultsView
            quiz={quizzes.find(q => q.id === latestAttempt.quizId) || quizzes[0]}
            attempt={latestAttempt}
            onRetake={() => handleStartTakeQuiz(latestAttempt.quizId)}
            onShare={handleShareQuiz}
            onExplore={() => handleNavigate('explore')}
            onCreateQuiz={() => handleNavigate('create')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            initialTab={profileTab}
            onTakeQuiz={handleStartTakeQuiz}
            onShareQuiz={handleShareQuiz}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDeveloper={() => setIsDeveloperModalOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Share Modal */}
      <ShareModal
        quiz={shareModalData?.quiz || null}
        scoreText={shareModalData?.scoreText}
        isOpen={!!shareModalData}
        onClose={() => setShareModalData(null)}
      />

      {/* Developer Info Modal */}
      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <AppContent />
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
