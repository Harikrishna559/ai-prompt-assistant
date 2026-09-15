import type {
  DashboardStats,
  PromptAnalysis,
  PromptHistoryItem,
  PromptTemplate,
  TaskType,
} from '../types';
import { generateMockAnalysis, MOCK_RECENT_PROMPTS } from '../data/mockPrompts';
import { MOCK_TEMPLATES } from '../data/templates';

// Helper to simulate 300-600ms latency for realistic SaaS UI interaction
const simulateDelay = (ms: number = 450): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyze an input prompt and generate improvement suggestions
 *
 * // TODO PHASE 10:
 * // Replace mock implementation with Gemini API.
 * // Example:
 * // const response = await geminiClient.models.generateContent({
 * //   model: 'gemini-2.0-flash',
 * //   contents: buildPromptAnalysisPrompt(prompt, taskType)
 * // });
 */
export async function analyzePrompt(
  prompt: string,
  taskType: TaskType = 'General',
  variation: number = 0
): Promise<PromptAnalysis> {
  await simulateDelay(450);

  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  const analysis = generateMockAnalysis(prompt, taskType, variation);
  return analysis;
}

/**
 * Improve an input prompt
 *
 * // TODO PHASE 10:
 * // Replace mock implementation with Gemini API.
 */
export async function improvePrompt(
  prompt: string,
  taskType: TaskType = 'General',
  variation: number = 0
): Promise<PromptAnalysis> {
  return analyzePrompt(prompt, taskType, variation);
}

/**
 * Fetch prompt history
 *
 * // TODO FUTURE PHASE:
 * // Connect Supabase database for user history persistence.
 */
export async function getHistory(): Promise<PromptHistoryItem[]> {
  await simulateDelay(300);
  return [...MOCK_RECENT_PROMPTS];
}

/**
 * Delete a prompt from history
 *
 * // TODO FUTURE PHASE:
 * // Connect Supabase database to delete records.
 */
export async function deleteHistoryItem(id: string): Promise<boolean> {
  await simulateDelay(300);
  console.log(`Mock deletion of prompt history item: ${id}`);
  return true;
}

/**
 * Fetch prompt templates
 *
 * // TODO FUTURE PHASE:
 * // Connect Supabase to fetch dynamic community templates.
 */
export async function getTemplates(): Promise<PromptTemplate[]> {
  await simulateDelay(300);
  return [...MOCK_TEMPLATES];
}

/**
 * Fetch dashboard overview statistics
 *
 * // TODO FUTURE PHASE:
 * // Connect Supabase to query analytics and user metrics.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await simulateDelay(300);
  return {
    totalPrompts: 27,
    averageScore: 78,
    improvedPrompts: 23,
    templatesUsed: 12,
  };
}
