import { Quiz } from '../types/quiz';

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-web-dev',
    title: 'Modern Web Development Mastery',
    description: 'Test your knowledge on modern JavaScript, CSS flexbox/grid, React fundamentals, and web standards.',
    category: 'Technology & Coding',
    difficulty: 'medium',
    timeLimitMinutes: 8,
    coverColor: 'from-blue-600 to-indigo-700',
    icon: 'Code2',
    tags: ['JavaScript', 'React', 'CSS', 'Frontend'],
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-15T10:00:00.000Z',
    authorId: 'user-demo-1',
    authorName: 'Alex Rivera',
    playsCount: 342,
    averageScore: 78,
    likesCount: 56,
    isPublished: true,
    questions: [
      {
        id: 'wd-q1',
        text: 'Which array method in JavaScript creates a new array populated with the results of calling a provided function on every element?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctOptionIndex: 1,
        explanation: 'map() creates a brand new array containing the results of invoking the callback on each element, unlike forEach() which returns undefined.',
        points: 10
      },
      {
        id: 'wd-q2',
        text: 'In CSS Grid Layout, which property defines the size of rows and columns on the grid tracks?',
        options: ['grid-template-areas', 'grid-template-rows & grid-template-columns', 'grid-auto-flow', 'grid-gap'],
        correctOptionIndex: 1,
        explanation: 'grid-template-columns and grid-template-rows specify the exact track sizing for grid layout columns and rows.',
        points: 10
      },
      {
        id: 'wd-q3',
        text: 'In React, what is the primary purpose of the useMemo hook?',
        options: [
          'To persist values across page reloads in localStorage',
          'To memoize the result of an expensive calculation between renders',
          'To trigger asynchronous fetch requests after render',
          'To create a mutable reference that does not trigger re-renders'
        ],
        correctOptionIndex: 1,
        explanation: 'useMemo caches and returns the memoized result of a calculation, recomputing it only when specified dependencies change.',
        points: 10
      },
      {
        id: 'wd-q4',
        text: 'What does the HTTP 429 Status Code indicate?',
        options: [
          'Resource Not Found',
          'Internal Server Crash',
          'Too Many Requests (Rate Limiting)',
          'Unauthorized Access'
        ],
        correctOptionIndex: 2,
        explanation: 'HTTP 429 indicates that the client has sent too many requests in a given amount of time (rate limiting).',
        points: 10
      },
      {
        id: 'wd-q5',
        text: 'Which JavaScript operator provides a fallback value strictly when the left-hand operand is null or undefined (nullish)?',
        options: ['|| (Logical OR)', '&& (Logical AND)', '?? (Nullish Coalescing)', '?: (Ternary)'],
        correctOptionIndex: 2,
        explanation: 'The nullish coalescing operator (??) only falls back if the left operand is null or undefined, unlike || which also falls back for falsy values like 0, false, or "".',
        points: 10
      }
    ]
  },
  {
    id: 'quiz-astronomy',
    title: 'Cosmic Wonders: Astrophysics & Space',
    description: 'Explore the mysteries of the universe, planetary systems, black holes, and historic space missions.',
    category: 'Science & Nature',
    difficulty: 'medium',
    timeLimitMinutes: 10,
    coverColor: 'from-violet-700 to-purple-950',
    icon: 'Sparkles',
    tags: ['Space', 'Astronomy', 'Planets', 'NASA'],
    createdAt: '2026-09-18T14:30:00.000Z',
    updatedAt: '2026-09-18T14:30:00.000Z',
    authorId: 'user-demo-2',
    authorName: 'Dr. Elena Vance',
    playsCount: 289,
    averageScore: 72,
    likesCount: 88,
    isPublished: true,
    questions: [
      {
        id: 'astro-q1',
        text: 'What is the theoretical boundary around a black hole beyond which nothing, not even light, can escape?',
        options: ['Accretion Disk', 'Event Horizon', 'Photon Sphere', 'Singularity'],
        correctOptionIndex: 1,
        explanation: 'The event horizon is the boundary where the escape velocity of the gravitational field exceeds the speed of light.',
        points: 10
      },
      {
        id: 'astro-q2',
        text: 'Which planet in our solar system has the highest surface temperature despite not being the closest to the Sun?',
        options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
        correctOptionIndex: 1,
        explanation: 'Venus has an extreme greenhouse atmosphere of thick carbon dioxide and sulfuric acid clouds, holding temperatures around 465°C (869°F).',
        points: 10
      },
      {
        id: 'astro-q3',
        text: 'Approximately how long does light from the Sun take to reach the Earth?',
        options: ['8 seconds', '8 minutes and 20 seconds', '1 hour', 'Instantaneous'],
        correctOptionIndex: 1,
        explanation: 'At a distance of approximately 149.6 million kilometers and the speed of light (300,000 km/s), sunlight takes roughly 8 minutes and 20 seconds.',
        points: 10
      },
      {
        id: 'astro-q4',
        text: 'What is the name of the NASA space observatory launched in December 2021 that operates in the infrared spectrum?',
        options: ['Hubble Space Telescope', 'James Webb Space Telescope', 'Spitzer Telescope', 'Chandra X-ray Observatory'],
        correctOptionIndex: 1,
        explanation: 'The James Webb Space Telescope (JWST) was launched on December 25, 2021, and observes primarily in infrared wavelengths.',
        points: 10
      },
      {
        id: 'astro-q5',
        text: 'What causes the phenomenon known as an Aurora (Borealis or Australis)?',
        options: [
          'Moonlight refracting through upper atmospheric ice crystals',
          'Solar wind particles interacting with gases in Earth’s magnetic field',
          'Volcanic ash entering the stratosphere',
          'Ocean reflections bouncing off the ozone layer'
        ],
        correctOptionIndex: 1,
        explanation: 'Auroras occur when charged particles from solar coronal mass ejections collide with atmospheric atoms (oxygen and nitrogen) guided by Earth’s magnetic field.',
        points: 10
      }
    ]
  },
  {
    id: 'quiz-world-history',
    title: 'World History & Pivotal Milestones',
    description: 'Journey through ancient empires, monumental revolutions, and world-shaping inventions.',
    category: 'History & Civics',
    difficulty: 'hard',
    timeLimitMinutes: 12,
    coverColor: 'from-amber-600 to-orange-800',
    icon: 'Landmark',
    tags: ['History', 'Civilizations', 'World', 'Culture'],
    createdAt: '2026-09-20T08:15:00.000Z',
    updatedAt: '2026-09-20T08:15:00.000Z',
    authorId: 'user-demo-3',
    authorName: 'Marcus Aurelius',
    playsCount: 215,
    averageScore: 64,
    likesCount: 42,
    isPublished: true,
    questions: [
      {
        id: 'hist-q1',
        text: 'In which ancient Mesopotamian city was the famous Code of Hammurabi established?',
        options: ['Babylon', 'Ur', 'Nineveh', 'Persepolis'],
        correctOptionIndex: 0,
        explanation: 'The Code of Hammurabi was promulgated by King Hammurabi of Babylon around 1754 BC.',
        points: 10
      },
      {
        id: 'hist-q2',
        text: 'Which European invention by Johannes Gutenberg in the 1440s ignited the European Renaissance and information revolution?',
        options: ['The Astrolabe', 'The Movable Type Printing Press', 'The Mechanical Pocket Clock', 'The Steam Engine'],
        correctOptionIndex: 1,
        explanation: 'Johannes Gutenberg invented the movable type printing press in Mainz, Germany, dramatically accelerating literacy and science.',
        points: 10
      },
      {
        id: 'hist-q3',
        text: 'What was the decisive 1815 battle that marked the final defeat of French Emperor Napoleon Bonaparte?',
        options: ['Battle of Austerlitz', 'Battle of Trafalgar', 'Battle of Waterloo', 'Battle of Leipzig'],
        correctOptionIndex: 2,
        explanation: 'The Battle of Waterloo in Belgium took place on June 18, 1815, where Anglo-allied and Prussian armies defeated Napoleon.',
        points: 10
      },
      {
        id: 'hist-q4',
        text: 'Who was the first woman to win a Nobel Prize, and the only person to win Nobel Prizes in two distinct scientific fields?',
        options: ['Rosalind Franklin', 'Ada Lovelace', 'Marie Curie', 'Dorothy Hodgkin'],
        correctOptionIndex: 2,
        explanation: 'Marie Curie won the Nobel Prize in Physics (1903) and the Nobel Prize in Chemistry (1911).',
        points: 10
      },
      {
        id: 'hist-q5',
        text: 'The Silk Road primarily connected which two major ancient regions?',
        options: ['China and the Mediterranean / Roman Empire', 'Scandinavia and North Africa', 'Japan and South America', 'Sub-Saharan Africa and India'],
        correctOptionIndex: 0,
        explanation: 'The Silk Road was an expansive network of Eurasian trade routes connecting East Asia (China) with Western Asia and the Mediterranean world.',
        points: 10
      }
    ]
  },
  {
    id: 'quiz-pop-culture',
    title: 'Pop Culture, Cinema & Music Trivia',
    description: 'From classic blockbuster cinema to chart-topping hits and gaming legends. Are you an entertainment buff?',
    category: 'Pop Culture & Movies',
    difficulty: 'easy',
    timeLimitMinutes: 6,
    coverColor: 'from-pink-600 to-rose-700',
    icon: 'Film',
    tags: ['Movies', 'Music', 'Cinema', 'Trivia'],
    createdAt: '2026-09-22T19:00:00.000Z',
    updatedAt: '2026-09-22T19:00:00.000Z',
    authorId: 'user-demo-1',
    authorName: 'Alex Rivera',
    playsCount: 512,
    averageScore: 84,
    likesCount: 110,
    isPublished: true,
    questions: [
      {
        id: 'pop-q1',
        text: 'Which film was the first animated feature to be nominated for the Academy Award for Best Picture in 1991?',
        options: ['The Lion King', 'Beauty and the Beast', 'Aladdin', 'Toy Story'],
        correctOptionIndex: 1,
        explanation: 'Disney’s "Beauty and the Beast" made history in 1991 as the first animated film nominated for Best Picture at the Oscars.',
        points: 10
      },
      {
        id: 'pop-q2',
        text: 'In the Lord of the Rings trilogy, what is the fictional Elvish bread that provides nourishment for a full day with one bite?',
        options: ['Miruvor', 'Lembas', 'Cram', 'Bannock'],
        correctOptionIndex: 1,
        explanation: 'Lembas bread, also known as waybread, was made by the Elves and sustained Frodo and Sam on their trek to Mordor.',
        points: 10
      },
      {
        id: 'pop-q3',
        text: 'Which British rock band famously recorded albums titled "Abbey Road", "Revolver", and "Rubber Soul"?',
        options: ['The Rolling Stones', 'Pink Floyd', 'The Beatles', 'Queen'],
        correctOptionIndex: 2,
        explanation: 'The Beatles released these legendary studio albums in the 1960s.',
        points: 10
      },
      {
        id: 'pop-q4',
        text: 'Which fictional city is the home of superhero Batman?',
        options: ['Metropolis', 'Star City', 'Gotham City', 'Central City'],
        correctOptionIndex: 2,
        explanation: 'Gotham City is the dark, gothic urban metropolis protected by Batman.',
        points: 10
      }
    ]
  },
  {
    id: 'quiz-brain-busters',
    title: 'Brain Busters: Logic & Lateral Puzzles',
    description: 'Sharpen your deductive reasoning, pattern recognition, and lateral thinking skills.',
    category: 'Mathematics & Logic',
    difficulty: 'hard',
    timeLimitMinutes: 10,
    coverColor: 'from-emerald-600 to-teal-800',
    icon: 'Brain',
    tags: ['Logic', 'Puzzles', 'Math', 'Reasoning'],
    createdAt: '2026-09-24T12:00:00.000Z',
    updatedAt: '2026-09-24T12:00:00.000Z',
    authorId: 'user-demo-4',
    authorName: 'Sophie Germain',
    playsCount: 198,
    averageScore: 59,
    likesCount: 63,
    isPublished: true,
    questions: [
      {
        id: 'logic-q1',
        text: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
        options: ['$0.10', '$0.05', '$0.01', '$0.55'],
        correctOptionIndex: 1,
        explanation: 'Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 => 2x = 0.10 => x = $0.05. The bat is $1.05 and ball is $0.05.',
        points: 10
      },
      {
        id: 'logic-q2',
        text: 'What comes next in the sequence: 2, 3, 5, 9, 17, 33, ...?',
        options: ['49', '50', '65', '67'],
        correctOptionIndex: 2,
        explanation: 'The difference doubles each step: +1, +2, +4, +8, +16, so the next difference is +32. 33 + 32 = 65. (Alternatively, 2n - 1: 2*33 - 1 = 65).',
        points: 10
      },
      {
        id: 'logic-q3',
        text: 'If five machines can manufacture five widgets in five minutes, how many minutes does it take 100 machines to make 100 widgets?',
        options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'],
        correctOptionIndex: 1,
        explanation: 'Each machine takes 5 minutes to produce 1 widget. With 100 machines working simultaneously in parallel, they still produce 100 widgets in 5 minutes.',
        points: 10
      },
      {
        id: 'logic-q4',
        text: 'You enter a dark room with a single match. There is a candle, an oil lamp, and a wood fireplace. Which do you light first?',
        options: ['The candle', 'The oil lamp', 'The fireplace', 'The match'],
        correctOptionIndex: 3,
        explanation: 'You must light the match first before you can ignite any of the other sources!',
        points: 10
      }
    ]
  },
  {
    id: 'quiz-geography',
    title: 'Global Geography & World Wonders',
    description: 'Explore country capitals, famous mountain ranges, majestic rivers, and geographical trivia.',
    category: 'Geography & Travel',
    difficulty: 'easy',
    timeLimitMinutes: 7,
    coverColor: 'from-cyan-600 to-blue-800',
    icon: 'Globe',
    tags: ['Geography', 'Capitals', 'Landmarks', 'Travel'],
    createdAt: '2026-09-25T16:00:00.000Z',
    updatedAt: '2026-09-25T16:00:00.000Z',
    authorId: 'user-demo-2',
    authorName: 'Dr. Elena Vance',
    playsCount: 421,
    averageScore: 81,
    likesCount: 75,
    isPublished: true,
    questions: [
      {
        id: 'geo-q1',
        text: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctOptionIndex: 2,
        explanation: 'Canberra was chosen in 1908 as a compromise between Sydney and Melbourne as the capital city of Australia.',
        points: 10
      },
      {
        id: 'geo-q2',
        text: 'Which is the longest river in the world by general consensus?',
        options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
        correctOptionIndex: 1,
        explanation: 'The Nile River in Africa measures approximately 6,650 kilometers (4,132 miles), making it traditionally recognized as the longest.',
        points: 10
      },
      {
        id: 'geo-q3',
        text: 'Which country has the largest number of natural islands in the world (over 260,000 islands)?',
        options: ['Indonesia', 'Philippines', 'Sweden', 'Canada'],
        correctOptionIndex: 2,
        explanation: 'Sweden holds the world record with approximately 267,570 islands.',
        points: 10
      },
      {
        id: 'geo-q4',
        text: 'Which desert is the largest hot desert on Earth?',
        options: ['Gobi Desert', 'Sahara Desert', 'Arabian Desert', 'Kalahari Desert'],
        correctOptionIndex: 1,
        explanation: 'The Sahara Desert covers roughly 9.2 million square kilometers across North Africa.',
        points: 10
      }
    ]
  }
];

export const CATEGORIES: { name: Quiz['category']; iconName: string; color: string }[] = [
  { name: 'Technology & Coding', iconName: 'Code2', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Science & Nature', iconName: 'Sparkles', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'History & Civics', iconName: 'Landmark', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Pop Culture & Movies', iconName: 'Film', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Mathematics & Logic', iconName: 'Brain', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Geography & Travel', iconName: 'Globe', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'General Knowledge', iconName: 'BookOpen', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Literature & Art', iconName: 'Palette', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
];

export const COLOR_THEMES = [
  { id: 'indigo', label: 'Indigo Night', class: 'from-indigo-600 to-blue-800' },
  { id: 'purple', label: 'Cosmic Violet', class: 'from-violet-600 to-purple-900' },
  { id: 'rose', label: 'Sunset Rose', class: 'from-pink-600 to-rose-700' },
  { id: 'emerald', label: 'Emerald Sage', class: 'from-emerald-600 to-teal-800' },
  { id: 'amber', label: 'Golden Amber', class: 'from-amber-600 to-orange-700' },
  { id: 'cyan', label: 'Ocean Breeze', class: 'from-cyan-600 to-blue-700' },
  { id: 'slate', label: 'Modern Slate', class: 'from-slate-700 to-slate-900' },
];
