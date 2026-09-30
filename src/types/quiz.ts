export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = 
  | 'General Knowledge'
  | 'Science & Nature'
  | 'Technology & Coding'
  | 'History & Civics'
  | 'Pop Culture & Movies'
  | 'Geography & Travel'
  | 'Mathematics & Logic'
  | 'Literature & Art';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  timeLimitMinutes: number; // 0 means no time limit
  coverColor: string; // Tailwind gradient/color class or hex
  icon: string; // Lucide icon name
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  playsCount: number;
  averageScore: number; // percentage 0 - 100
  likesCount: number;
  tags: string[];
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  quizCategory: Category;
  userId: string;
  userName: string;
  answers: Record<string, number>; // questionId -> chosenOptionIndex (-1 if unanswered)
  score: number; // total correct
  totalQuestions: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  mode: 'exam' | 'practice';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
  createdQuizIds: string[];
  attempts: QuizAttempt[];
  bookmarkedQuizIds: string[];
  likedQuizIds: string[];
}
