export type TaskType =
  | 'General'
  | 'Coding'
  | 'Education'
  | 'Writing'
  | 'Data Analysis'
  | 'Career'
  | 'Business'
  | 'Research'
  | 'Social Media'
  | 'Email'
  | 'Image Generation';

export interface ScoreBreakdown {
  overall: number;
  clarity: number;
  context: number;
  specificity: number;
  completeness: number;
}

export interface PromptProblem {
  id: string;
  text: string;
  type?: 'warning' | 'info';
}

export interface PromptAnalysis {
  id: string;
  originalPrompt: string;
  taskType: TaskType;
  score: ScoreBreakdown;
  problems: string[];
  improvedPrompt: string;
  whyBetter: string[];
  suggestions: string[];
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  examplePrompt: string;
  taskType: TaskType;
  iconName: string;
}

export interface PromptHistoryItem {
  id: string;
  originalPrompt: string;
  improvedPrompt: string;
  taskType: TaskType;
  score: number;
  createdAt: string;
  detailedScore?: ScoreBreakdown;
  problems?: string[];
  whyBetter?: string[];
  suggestions?: string[];
}

export interface DashboardStats {
  totalPrompts: number;
  averageScore: number;
  improvedPrompts: number;
  templatesUsed: number;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Theme = 'light' | 'dark';
