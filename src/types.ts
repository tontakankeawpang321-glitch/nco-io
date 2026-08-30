export type BranchType = 'army' | 'police' | 'both';

export type SubjectId = 
  | 'math' 
  | 'thai' 
  | 'english' 
  | 'law' 
  | 'science' 
  | 'computer' 
  | 'society' 
  | 'interview' 
  | 'general';

export interface ExamQuestion {
  id: string;
  branch: BranchType;
  subjectId: SubjectId;
  subjectName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formula?: string;
  difficulty?: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  year?: string;
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortDesc: string;
  iconName: string;
  branch: 'army' | 'police' | 'both';
  color: string;
  accentColor: string;
  weightPercent: number;
  totalTopics: number;
  summaryNotes: string[];
  keyFormulas: { title: string; detail: string }[];
  sampleQuestionsCount: number;
  externalLink?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  subject: string;
  content: string;
  image?: string;
  likes: number;
  time: string;
  likedByMe?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
}

export interface ScannedResult {
  questionText: string;
  subject: string;
  choices: string[];
  correctAnswer: string;
  steps: string[];
  formula?: string;
  tip?: string;
  rawExplanation?: string;
}

export type ActiveTab = 
  | 'home'
  | 'random-quiz'
  | 'books'
  | 'scanner'
  | 'scratchpad'
  | 'community'
  | 'subjects-army'
  | 'subjects-police';

export interface BookItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  embedUrl?: string;
  pageCount?: string;
  author?: string;
  badge?: string;
}

export interface ShortVideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  embedUrl: string;
  videoId?: string;
  duration?: string;
  views?: string;
}
