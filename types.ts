export type PageState = 'welcome' | 'reception' | 'master';

export interface UserPreferences {
  name: string;
  age: string;
  academicLevel: string;
  subject: string;
  topic: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export type SubjectType = 'Math' | 'Science' | 'History' | 'Language' | 'Art' | 'General';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  type: 'notes' | 'whiteboard' | 'visuals';
}
