import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  AlertCircle,
  Eye,
  Sliders,
  Palette,
  Lightbulb,
  FileQuestion
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Question, Quiz, Category, Difficulty } from '../types/quiz';
import { CATEGORIES, COLOR_THEMES } from '../data/sampleQuizzes';
import { IconRenderer } from '../components/IconRenderer';

interface CreateQuizViewProps {
  onQuizCreated: (newQuizId: string) => void;
  onCancel: () => void;
  onOpenAuth: () => void;
}

const AVAILABLE_ICONS = [
  'Sparkles',
  'Code2',
  'Landmark',
  'Film',
  'Brain',
  'Globe',
  'BookOpen',
  'Palette',
  'Trophy',
  'Flame',
  'Compass',
  'Zap'
];

export const CreateQuizView: React.FC<CreateQuizViewProps> = ({
  onQuizCreated,
  onCancel,
  onOpenAuth
}) => {
  const { createQuiz } = useQuiz();
  const { isAuthenticated, user } = useAuth();

  // Quiz Meta State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('General Knowledge');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);
  const [coverColor, setCoverColor] = useState('from-indigo-600 to-blue-800');
  const [icon, setIcon] = useState('Sparkles');
  const [tagsInput, setTagsInput] = useState('');

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-' + Date.now() + '-1',
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      points: 10
    }
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Question manipulation
  const handleAddQuestion = () => {
    const newQ: Question = {
      id: 'q-' + Date.now() + '-' + (questions.length + 1),
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      points: 10
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  const handleDuplicateQuestion = (idx: number) => {
    const target = questions[idx];
    const duplicated: Question = {
      ...target,
      id: 'q-' + Date.now() + '-dup',
      text: `${target.text} (Copy)`,
      options: [...target.options]
    };
    const nextList = [...questions];
    nextList.splice(idx + 1, 0, duplicated);
    setQuestions(nextList);
    setActiveQuestionIndex(idx + 1);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('A quiz must have at least 1 question.');
      return;
    }
    const nextList = questions.filter((_, i) => i !== idx);
    setQuestions(nextList);
    setActiveQuestionIndex(Math.max(0, idx - 1));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const nextList = [...questions];
    const temp = nextList[idx];
    nextList[idx] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setQuestions(nextList);
    setActiveQuestionIndex(targetIdx);
  };

  const handleUpdateQuestion = (idx: number, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map((q, i) => (i === idx ? { ...q, ...updates } : q))
    );
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i === qIdx) {
          const nextOpts = [...q.options];
          nextOpts[optIdx] = val;
          return { ...q, options: nextOpts };
        }
        return q;
      })
    );
  };

  const handleAddOption = (qIdx: number) => {
    if (questions[qIdx].options.length >= 6) return;
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i === qIdx) {
          return { ...q, options: [...q.options, ''] };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    if (questions[qIdx].options.length <= 2) {
      alert('A question must have at least 2 options.');
      return;
    }
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i === qIdx) {
          const nextOpts = q.options.filter((_, oIdx) => oIdx !== optIdx);
          let nextCorrect = q.correctOptionIndex;
          if (nextCorrect === optIdx) {
            nextCorrect = 0;
          } else if (nextCorrect > optIdx) {
            nextCorrect -= 1;
          }
          return { ...q, options: nextOpts, correctOptionIndex: nextCorrect };
        }
        return q;
      })
    );
  };

  // Load starter questions helper
  const handleLoadSampleTemplate = () => {
    setTitle('General Knowledge & Trivia Sprint');
    setDescription('A fast-paced trivia challenge to test your worldly knowledge across multiple domains.');
    setCategory('General Knowledge');
    setDifficulty('medium');
    setTimeLimitMinutes(5);
    setCoverColor('from-indigo-600 to-blue-800');
    setIcon('Sparkles');
    setQuestions([
      {
        id: 'samp-1',
        text: 'What is the rarest blood type in the global human population?',
        options: ['O Negative', 'AB Negative', 'B Positive', 'A Negative'],
        correctOptionIndex: 1,
        explanation: 'AB Negative is the rarest of the major blood types, present in less than 1% of the world population.',
        points: 10
      },
      {
        id: 'samp-2',
        text: 'Which chemical element has the highest melting point of all known metals (3,422°C)?',
        options: ['Titanium', 'Platinum', 'Tungsten', 'Osmium'],
        correctOptionIndex: 2,
        explanation: 'Tungsten (chemical symbol W) has the highest melting point of all metallic elements.',
        points: 10
      },
      {
        id: 'samp-3',
        text: 'In which year did the Apollo 11 mission successfully land the first humans on the Moon?',
        options: ['1965', '1969', '1971', '1972'],
        correctOptionIndex: 1,
        explanation: 'Neil Armstrong and Buzz Aldrin landed the Apollo 11 Lunar Module Eagle on the Moon on July 20, 1969.',
        points: 10
      }
    ]);
    setActiveQuestionIndex(0);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!title.trim()) {
      errors.push('Quiz Title is required.');
    }
    if (!description.trim()) {
      errors.push('Quiz Description is required.');
    }
    if (questions.length === 0) {
      errors.push('You must have at least one question.');
    }

    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.text.trim()) {
        errors.push(`Question #${qNum} is missing its question prompt.`);
      }
      if (q.options.some(opt => !opt.trim())) {
        errors.push(`Question #${qNum} has empty answer options.`);
      }
      if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
        errors.push(`Question #${qNum} does not have a valid correct answer selected.`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublish = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [category, difficulty];

    const created = createQuiz({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      timeLimitMinutes: Number(timeLimitMinutes) || 0,
      coverColor,
      icon,
      tags,
      questions
    });

    onQuizCreated(created.id);
  };

  const currentQ = questions[activeQuestionIndex];

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadSampleTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Sample Questions Template</span>
            <span className="sm:hidden">Template</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
          Quiz Builder Studio
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Create a New Quiz
        </h1>
        <p className="text-sm text-slate-500">
          Design your questions, set multiple-choice options, mark correct answers, and publish instantly.
        </p>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Please address the following before publishing:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Mode View */}
      {previewMode ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className={`p-6 rounded-2xl bg-gradient-to-r ${coverColor} text-white flex items-center justify-between`}>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 border border-white/20">
                {category} • {difficulty.toUpperCase()}
              </span>
              <h2 className="text-2xl font-black mt-3">{title || 'Untitled Quiz Preview'}</h2>
              <p className="text-xs text-white/80 mt-1 max-w-xl">{description || 'No description provided yet.'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <IconRenderer name={icon} className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800">
              Questions ({questions.length})
            </h3>
            {questions.map((q, qIndex) => (
              <div key={q.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600">Question {qIndex + 1} of {questions.length}</span>
                  <span className="text-xs text-slate-500 font-semibold">{q.points} points</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {q.text || <span className="text-slate-400 italic">Empty question prompt</span>}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {q.options.map((opt, optIndex) => {
                    const isCorrect = optIndex === q.correctOptionIndex;
                    return (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt || <span className="text-slate-300 italic">Option {optIndex + 1}</span>}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 font-medium">
                    💡 <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setPreviewMode(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Return to Editing
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode: Quiz Setup & Question Builder */
        <div className="space-y-8">
          
          {/* Section 1: General Quiz Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 1: General Quiz Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quiz Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Modern JavaScript: ES2024 & TypeScript"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 outline-none transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give a quick overview of what this quiz covers and who it's for..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 outline-none transition-all font-normal"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name} className="dark:bg-slate-800">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        difficulty === diff
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Time Limit (Minutes)
                  <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(0 = Untimed)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-32 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {timeLimitMinutes === 0 ? 'No time pressure' : `${timeLimitMinutes} minutes total`}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Science, Biology, Exams, Cells"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              {/* Theme Color & Icon */}
              <div className="md:col-span-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Banner Color Theme & Icon
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {COLOR_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCoverColor(theme.class)}
                      className={`h-8 px-3 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${theme.class} border-2 transition-transform ${
                        coverColor === theme.class ? 'border-indigo-600 scale-105 shadow-sm' : 'border-transparent opacity-85 hover:opacity-100'
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1">Icon:</span>
                  {AVAILABLE_ICONS.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={`p-2 rounded-xl border transition-all ${
                        icon === iconName
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                      title={iconName}
                    >
                      <IconRenderer name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Questions Builder */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 2: Questions & Answers</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Provide questions, options, and select the correct answer.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Questions Tabs Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
              {questions.map((q, idx) => {
                const isActive = idx === activeQuestionIndex;
                const hasPrompt = q.text.trim().length > 0;
                const hasOptions = q.options.every(o => o.trim().length > 0);
                const isComplete = hasPrompt && hasOptions;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all border ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : isComplete
                        ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {isComplete ? (
                      <CheckCircle2 className={`w-3 h-3 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-1 flex-shrink-0 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            {/* Current Active Question Editor */}
            {currentQ && (
              <div className="space-y-6 pt-2">
                {/* Question Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Question {activeQuestionIndex + 1} of {questions.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={activeQuestionIndex === 0}
                        onClick={() => handleMoveQuestion(activeQuestionIndex, 'up')}
                        title="Move Up"
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={activeQuestionIndex === questions.length - 1}
                        onClick={() => handleMoveQuestion(activeQuestionIndex, 'down')}
                        title="Move Down"
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Points input */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Points:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={currentQ.points}
                        onChange={(e) => handleUpdateQuestion(activeQuestionIndex, { points: Math.max(1, parseInt(e.target.value) || 10) })}
                        className="w-12 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(activeQuestionIndex)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Duplicate Question"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={questions.length <= 1}
                      onClick={() => handleDeleteQuestion(activeQuestionIndex)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-30 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Question Prompt <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={currentQ.text}
                    onChange={(e) => handleUpdateQuestion(activeQuestionIndex, { text: e.target.value })}
                    placeholder="Enter the question here (e.g. Which planet has the highest surface temperature?)"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 outline-none transition-all font-medium"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Multiple-Choice Options & Correct Answer <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Click the radio button next to the option that is the correct answer.
                      </p>
                    </div>

                    {currentQ.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => handleAddOption(activeQuestionIndex)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {currentQ.options.map((optionText, optIdx) => {
                      const isCorrect = currentQ.correctOptionIndex === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          {/* Radio button to select as correct */}
                          <button
                            type="button"
                            onClick={() => handleUpdateQuestion(activeQuestionIndex, { correctOptionIndex: optIdx })}
                            className={`flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs transition-all flex-shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-indigo-400'
                            }`}
                            title="Mark as correct answer"
                          >
                            {isCorrect ? <Check className="w-4 h-4" /> : letter}
                          </button>

                          {/* Text input */}
                          <input
                            type="text"
                            value={optionText}
                            onChange={(e) => handleOptionChange(activeQuestionIndex, optIdx, e.target.value)}
                            placeholder={`Option ${letter} text...`}
                            className={`flex-1 px-3 py-1.5 text-xs sm:text-sm bg-transparent outline-none font-medium ${
                              isCorrect ? 'text-emerald-950 dark:text-emerald-200 font-bold' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          />

                          {/* Correct answer label */}
                          {isCorrect && (
                            <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 flex-shrink-0">
                              Correct Answer
                            </span>
                          )}

                          {/* Remove option button */}
                          {currentQ.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(activeQuestionIndex, optIdx)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors flex-shrink-0"
                              title="Remove option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Answer Explanation & Insight <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional, displayed on results)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.explanation || ''}
                    onChange={(e) => handleUpdateQuestion(activeQuestionIndex, { explanation: e.target.value })}
                    placeholder="Explain why this answer is correct to help students and quiz-takers learn..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Publish / Cancel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Total: <strong className="text-slate-800">{questions.length} Questions</strong> •{' '}
              <strong className="text-slate-800">
                {questions.reduce((a, b) => a + (Number(b.points) || 0), 0)} Total Points
              </strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Quiz</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
