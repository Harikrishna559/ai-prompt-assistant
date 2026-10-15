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

export interface UserCredits {
  allowance: number; // 1000
  used: number;
  remaining: number;
  resetAt?: string;
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
  source?: string;
  credits?: UserCredits;
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

export type Theme = 'light' | 'dark';
