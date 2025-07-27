export const initialWindows = [
  {
    id: 'news',
    title: 'News Hub',
    preview: 'AI-summarized daily digest ready',
    emoji: '📰',
    color: 'from-blue-500 to-indigo-600',
    xp: 12,
    hasNew: true,
    type: 'chat',
    messages: [
      { id: 1, sender: 'ai', text: 'Here\'s your AI-summarized news digest for today:', timestamp: '09:00' },
      { id: 2, sender: 'ai', text: '• Major tech breakthrough in quantum computing\n• Global markets show positive trends\n• New climate policy announced', timestamp: '09:00' }
    ],
    autoNews: true,
    newsTopic: 'technology'
  },
  {
    id: 'workout',
    title: 'Fitness Pro',
    preview: '4-day split plan generated',
    emoji: '💪',
    color: 'from-emerald-500 to-teal-600',
    xp: 8,
    hasNew: false,
    type: 'chat',
    messages: [
      { id: 1, sender: 'ai', text: 'Your personalized 4-day split plan:', timestamp: '08:30' },
      { id: 2, sender: 'ai', text: 'Day 1: Chest & Triceps\nDay 2: Back & Biceps\nDay 3: Legs & Shoulders\nDay 4: Core & Cardio', timestamp: '08:30' }
    ]
  },
  {
    id: 'notes',
    title: 'Block Note',
    preview: 'Personal notes and ideas',
    emoji: '📝',
    color: 'from-amber-400 to-yellow-500',
    xp: 5,
    hasNew: false,
    type: 'notes',
    content: '# Welcome to Block Note\n\nThis is your personal note-taking space.\n\n## Features:\n- Save snippets from chats\n- Organize your thoughts\n- Quick access to important ideas'
  },
  {
    id: 'tasks',
    title: 'Task Manager',
    preview: '3 pending tasks',
    emoji: '✅',
    color: 'from-rose-500 to-pink-600',
    xp: 7,
    hasNew: true,
    type: 'tasks',
    tasks: [
      { id: 1, text: 'Review crypto market trends', completed: false, due: '2023-06-15' },
      { id: 2, text: 'Generate weekly workout plan', completed: false, due: '2023-06-16' },
      { id: 3, text: 'Read latest AI research paper', completed: true, due: '2023-06-14' }
    ]
  }
];

export const presetWindows = [
  { title: 'Productivity Coach', emoji: '📊', color: 'from-red-500 to-pink-600', type: 'chat' },
  { title: 'Travel Planner', emoji: '✈️', color: 'from-cyan-500 to-blue-600', type: 'chat' },
  { title: 'Meal Planner', emoji: '🥗', color: 'from-yellow-500 to-amber-600', type: 'chat' },
  { title: 'Web Research', emoji: '🔍', color: 'from-purple-500 to-indigo-600', type: 'chat' },
  { title: 'Financial Advisor', emoji: '💰', color: 'from-green-500 to-emerald-600', type: 'chat' },
  { title: 'Language Tutor', emoji: '🗣️', color: 'from-indigo-500 to-violet-600', type: 'chat' },
  { title: 'Book Notes', emoji: '📚', color: 'from-orange-500 to-red-600', type: 'notes' },
  { title: 'Project Manager', emoji: '📋', color: 'from-teal-500 to-cyan-600', type: 'tasks' }
];