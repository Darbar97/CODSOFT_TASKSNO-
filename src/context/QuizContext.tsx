import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quiz, QuizAttempt, Question } from '../types/quiz';
import { SAMPLE_QUIZZES } from '../data/sampleQuizzes';
import { useAuth } from './AuthContext';

interface QuizContextType {
  quizzes: Quiz[];
  createQuiz: (newQuizData: {
    title: string;
    description: string;
    category: Quiz['category'];
    difficulty: Quiz['difficulty'];
    timeLimitMinutes: number;
    coverColor: string;
    icon: string;
    tags: string[];
    questions: Question[];
  }) => Quiz;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  getQuizById: (id: string) => Quiz | undefined;
  recordQuizPlay: (quizId: string, percentageScore: number) => void;
  recentAttempts: QuizAttempt[];
  addAttemptRecord: (attempt: QuizAttempt) => void;
  resetToSampleData: () => void;
}

const STORAGE_KEY_QUIZZES = 'quizcraft_quizzes_v1';
const STORAGE_KEY_ATTEMPTS = 'quizcraft_global_attempts_v1';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, recordAttempt: recordUserAttempt, updateProfile } = useAuth();

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_QUIZZES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SAMPLE_QUIZZES;
  });

  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    } catch (e) {
      console.error('Failed to save quizzes to localStorage', e);
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(recentAttempts));
    } catch (e) {
      console.error('Failed to save attempts to localStorage', e);
    }
  }, [recentAttempts]);

  const createQuiz = (data: {
    title: string;
    description: string;
    category: Quiz['category'];
    difficulty: Quiz['difficulty'];
    timeLimitMinutes: number;
    coverColor: string;
    icon: string;
    tags: string[];
    questions: Question[];
  }): Quiz => {
    const authorId = user?.id || 'guest-user';
    const authorName = user?.name || 'Anonymous Creator';

    const newQuiz: Quiz = {
      id: 'quiz-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      difficulty: data.difficulty,
      timeLimitMinutes: data.timeLimitMinutes,
      coverColor: data.coverColor || 'from-indigo-600 to-blue-700',
      icon: data.icon || 'Sparkles',
      tags: data.tags.length > 0 ? data.tags : [data.category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId,
      authorName,
      playsCount: 0,
      averageScore: 0,
      likesCount: 0,
      isPublished: true,
      questions: data.questions
    };

    setQuizzes(prev => [newQuiz, ...prev]);

    // If user is logged in, attach to created quizzes
    if (user) {
      updateProfile({
        createdQuizIds: [...user.createdQuizIds, newQuiz.id]
      });
    }

    return newQuiz;
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return q;
      })
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    if (user) {
      updateProfile({
        createdQuizIds: user.createdQuizIds.filter(qId => qId !== id),
        bookmarkedQuizIds: user.bookmarkedQuizIds.filter(qId => qId !== id)
      });
    }
  };

  const getQuizById = (id: string): Quiz | undefined => {
    return quizzes.find(q => q.id === id);
  };

  const recordQuizPlay = (quizId: string, percentageScore: number) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id === quizId) {
          const newPlays = q.playsCount + 1;
          const currentAvg = q.averageScore || 0;
          const newAvg = Math.round((currentAvg * q.playsCount + percentageScore) / newPlays);
          return {
            ...q,
            playsCount: newPlays,
            averageScore: newAvg
          };
        }
        return q;
      })
    );
  };

  const addAttemptRecord = (attempt: QuizAttempt) => {
    setRecentAttempts(prev => [attempt, ...prev.slice(0, 49)]); // keep last 50
    recordQuizPlay(attempt.quizId, attempt.percentage);
    if (user) {
      recordUserAttempt(attempt);
    }
  };

  const resetToSampleData = () => {
    setQuizzes(SAMPLE_QUIZZES);
    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(SAMPLE_QUIZZES));
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        getQuizById,
        recordQuizPlay,
        recentAttempts,
        addAttemptRecord,
        resetToSampleData
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
