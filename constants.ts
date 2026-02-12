import { SubjectType } from './types';

export const COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#8b5cf6', // violet-500
  accent: '#06b6d4', // cyan-500
  background: '#020617', // slate-950
  surface: '#1e293b', // slate-800
  surfaceHighlight: '#334155', // slate-700
};

export const SUBJECT_COLORS: Record<string, string> = {
  Math: 'from-blue-500 to-cyan-400',
  Science: 'from-emerald-500 to-green-400',
  History: 'from-amber-500 to-orange-400',
  Language: 'from-purple-500 to-pink-400',
  Art: 'from-rose-500 to-red-400',
  General: 'from-indigo-500 to-violet-400',
};

export const MOCK_CONVERSATION_FLOW = [
  { text: "Hello! I'm your AI Receptionist. Let's get you set up. What is your name?", field: 'name' },
  { text: "Nice to meet you. How old are you?", field: 'age' },
  { text: "Great. What is your current academic level?", field: 'academicLevel' },
  { text: "Understood. Which subject would you like to study today?", field: 'subject' },
  { text: "Excellent choice. Is there a specific topic within that subject?", field: 'topic' },
  { text: "Finally, what is your preferred language for this session?", field: 'language' },
];
