import React from 'react';
import { Sparkles, Heart, Github, Award, CheckCircle, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenDeveloper?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDeveloper }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Quiz<span className="text-indigo-400">Craft</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier interactive quiz creation and challenge platform. Build custom quizzes, test your knowledge, and track your learning progress.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Free to play
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Instant grading
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Home & Featured
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Explore All Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Create New Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile', 'history')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Scores & History
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Featured Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Technology & Coding')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Technology & Coding
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Science & Nature')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Science & Nature
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'History & Civics')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  History & Civics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Mathematics & Logic')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Mathematics & Logic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'Pop Culture & Movies')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Pop Culture & Movies
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Highlight & Developer */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Developer Info</h4>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center font-bold text-white text-sm">
                  PP
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Prem Parmar</p>
                  <p className="text-xs text-indigo-400">Software Developer</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed & built by Prem Parmar with focus on interactive learning, instant score feedback, and responsive UI.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href="mailto:premparmar9161@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Contact Dev
                </a>
                {onOpenDeveloper && (
                  <button
                    onClick={onOpenDeveloper}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} QuizCraft. Developed by <strong className="text-slate-300">Prem Parmar</strong> (<a href="mailto:premparmar9161@gmail.com" className="text-indigo-400 hover:underline">premparmar9161@gmail.com</a>).</p>
          <div className="flex items-center gap-2">
            <span>Built with passion for interactive learning</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
