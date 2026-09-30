import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  BookOpen, 
  Trophy, 
  BookmarkCheck, 
  Sparkles,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: () => void;
  onOpenDeveloper?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenDeveloper,
  searchQuery,
  onSearchChange
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
              aria-label="QuizCraft Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Quiz<span className="text-indigo-600 dark:text-indigo-400">Craft</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 hidden sm:inline-block">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5 font-medium">Accessible Quiz Maker</p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Search className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'explore' && currentView !== 'home') {
                    onNavigate('explore');
                  }
                }}
                placeholder="Search topics, trivia, science, coding..."
                aria-label="Search quizzes"
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-800 text-sm rounded-full border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('explore')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'explore'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <CompassIcon className="w-4 h-4" />
              Explore Quizzes
            </button>

            <button
              onClick={() => handleNav('profile', 'created')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'profile'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              My Quizzes
            </button>

            {onOpenDeveloper && (
              <button
                onClick={onOpenDeveloper}
                className="px-3.5 py-2 text-sm font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Developer</span>
              </button>
            )}
          </nav>

          {/* Actions: Dark Mode Toggle, Create, User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Create Quiz Primary CTA */}
            <button
              onClick={() => handleNav('create')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 shadow-sm shadow-indigo-600/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create Quiz</span>
              <span className="sm:hidden">Create</span>
            </button>

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 transition-all"
                  aria-label="User account menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile & Stats
                    </button>

                    <button
                      onClick={() => handleNav('profile', 'history')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Quiz History & Scores
                    </button>

                    <button
                      onClick={() => handleNav('profile', 'bookmarks')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-indigo-500" />
                      Saved Quizzes ({user.bookmarkedQuizIds.length})
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'explore') onNavigate('explore');
              }}
              placeholder="Search quizzes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 ${
                currentView === 'home' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => handleNav('explore')}
              className={`px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 ${
                currentView === 'explore' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <CompassIcon className="w-4 h-4" />
              Explore Quizzes
            </button>

            <button
              onClick={() => handleNav('create')}
              className={`px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 ${
                currentView === 'create' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Create a Quiz
            </button>

            <button
              onClick={toggleTheme}
              className="px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>

            {onOpenDeveloper && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDeveloper();
                }}
                className="px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Developer Info
              </button>
            )}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('profile')}
                  className="px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile & Quizzes
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-left text-sm font-medium rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full mt-2 py-2.5 text-center text-sm font-semibold rounded-xl bg-indigo-600 text-white shadow-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const CompassIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
