import React from 'react';
import { X, Mail, Github, Globe, Code, Sparkles, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-2xl text-white shadow-md">
              PP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-white">Prem Parmar</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Lead Developer
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">Software Engineer & Creator of QuizCraft</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">About Developer</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Prem Parmar is a passionate software engineer specializing in interactive modern web applications, scalable frontend architecture, and delightful user experiences. QuizCraft was designed to make learning and knowledge testing engaging, accessible, and fast.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Direct Contact</h4>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Email Address</p>
                  <a
                    href="mailto:premparmar9161@gmail.com"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
                  >
                    premparmar9161@gmail.com
                  </a>
                </div>
              </div>
              <a
                href="mailto:premparmar9161@gmail.com"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0"
              >
                Send Email
              </a>
            </div>
          </div>

          {/* Tech Stack used */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Platform Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React 19',
                'TypeScript',
                'Tailwind CSS',
                'Lucide Icons',
                'Vite',
                'Canvas Confetti',
                'Dark Mode',
                'Keyboard Accessibility',
                'Speech Synthesis'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer inside modal */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verified Developer
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
