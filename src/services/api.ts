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
 * // Phase 3 Step 1: Secure server-side endpoint integration
 * Calls POST /api/improve without exposing secrets to client code.
 */
export async function analyzePrompt(
  prompt: string,
  taskType: TaskType = 'General',
  variation: number = 0
): Promise<PromptAnalysis> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  // Call the secure server-side endpoint POST /api/improve
  try {
    const response = await fetch('/api/improve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        taskType,
        variation,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data as PromptAnalysis;
    }

    console.warn(`[API] /api/improve responded with HTTP ${response.status}, using local fallback.`);
  } catch (error) {
    console.warn('[API] /api/improve is unreachable, using local fallback:', error);
  }

  // Fallback to local mock analysis for offline resilience
  await simulateDelay(450);
  return generateMockAnalysis(prompt, taskType, variation);
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
