import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuizAttempt } from '../types/quiz';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  toggleBookmark: (quizId: string) => void;
  toggleLike: (quizId: string) => void;
  recordAttempt: (attempt: QuizAttempt) => void;
}

const STORAGE_KEY_AUTH = 'quizcraft_auth_user';
const STORAGE_KEY_USERS = 'quizcraft_registered_users';

const DEFAULT_DEMO_USER: User = {
  id: 'user-demo-1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Quiz enthusiast, full-stack engineer, and trivia nerd.',
  joinedAt: '2026-09-01T00:00:00.000Z',
  createdQuizIds: ['quiz-web-dev', 'quiz-pop-culture'],
  attempts: [
    {
      id: 'att-1',
      quizId: 'quiz-astronomy',
      quizTitle: 'Cosmic Wonders: Astrophysics & Space',
      quizCategory: 'Science & Nature',
      userId: 'user-demo-1',
      userName: 'Alex Rivera',
      answers: { 'astro-q1': 1, 'astro-q2': 1, 'astro-q3': 1, 'astro-q4': 1, 'astro-q5': 1 },
      score: 5,
      totalQuestions: 5,
      totalPoints: 50,
      earnedPoints: 50,
      percentage: 100,
      timeSpentSeconds: 140,
      completedAt: '2026-09-26T14:30:00.000Z',
      mode: 'exam'
    }
  ],
  bookmarkedQuizIds: ['quiz-astronomy', 'quiz-brain-busters'],
  likedQuizIds: ['quiz-astronomy', 'quiz-geography']
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEMO_USER; // Default logged in as demo user for great UX, can also logout or switch!
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [user]);

  const login = async (email: string, name?: string): Promise<boolean> => {
    // Check registered users list or auto-create account
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [DEFAULT_DEMO_USER];
    
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      existing = {
        id: 'user-' + Date.now(),
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        bio: 'Avid quiz player & knowledge seeker',
        joinedAt: new Date().toISOString(),
        createdQuizIds: [],
        attempts: [],
        bookmarkedQuizIds: [],
        likedQuizIds: []
      };
      users.push(existing);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    setUser(existing);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    return login(email, name);
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [DEFAULT_DEMO_USER];
    
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing && email.toLowerCase() !== DEFAULT_DEMO_USER.email.toLowerCase()) {
      return { 
        success: false, 
        message: `No account found with email "${email}". Please verify your email or register a new account.` 
      };
    }

    // In local simulated auth, password update succeeds
    return { 
      success: true, 
      message: 'Your password has been successfully reset! You can now sign in with your new password.' 
    };
  };

  const logout = () => {
    setUser(null);
  };

  const quickDemoLogin = () => {
    setUser(DEFAULT_DEMO_USER);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...updatedData } : null));
  };

  const toggleBookmark = (quizId: string) => {
    if (!user) return;
    const isBookmarked = user.bookmarkedQuizIds.includes(quizId);
    const updated = isBookmarked
      ? user.bookmarkedQuizIds.filter(id => id !== quizId)
      : [...user.bookmarkedQuizIds, quizId];
    setUser({ ...user, bookmarkedQuizIds: updated });
  };

  const toggleLike = (quizId: string) => {
    if (!user) return;
    const isLiked = user.likedQuizIds.includes(quizId);
    const updated = isLiked
      ? user.likedQuizIds.filter(id => id !== quizId)
      : [...user.likedQuizIds, quizId];
    setUser({ ...user, likedQuizIds: updated });
  };

  const recordAttempt = (attempt: QuizAttempt) => {
    if (!user) return;
    const updatedAttempts = [attempt, ...user.attempts];
    setUser({
      ...user,
      attempts: updatedAttempts
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        resetPassword,
        logout,
        quickDemoLogin,
        updateProfile,
        toggleBookmark,
        toggleLike,
        recordAttempt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
