import type { PromptHistoryItem, TaskType } from '../types';

const HISTORY_STORAGE_KEY = 'ai_prompt_assistant_history_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Get all saved prompt history items from local storage safely.
 */
export const getHistory = (): PromptHistoryItem[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error('Failed to read prompt history from local storage:', error);
    return [];
  }
};

/**
 * Save a new item to prompt history.
 */
export const saveHistoryItem = (
  item: Omit<PromptHistoryItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): PromptHistoryItem => {
  const history = getHistory();

  const newItem: PromptHistoryItem = {
    id: item.id || `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    originalPrompt: item.originalPrompt,
    improvedPrompt: item.improvedPrompt,
    taskType: item.taskType || 'General',
    score: typeof item.score === 'number' ? item.score : 80,
    createdAt: item.createdAt || new Date().toISOString(),
    detailedScore: item.detailedScore,
    problems: item.problems || [],
    whyBetter: item.whyBetter || [],
    suggestions: item.suggestions || [],
  };

  // Prepend new item and enforce maximum limit
  const updatedHistory = [newItem, ...history.filter(h => h.id !== newItem.id)].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to save to local storage (quota likely exceeded):', error);
  }

  return newItem;
};

/**
 * Delete a specific history item by ID.
 */
export const deleteHistoryItem = (id: string): PromptHistoryItem[] => {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to update local storage after deletion:', error);
  }
  return filtered;
};

/**
 * Clear all prompt history.
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear local storage:', error);
  }
};

/**
 * Calculate basic usage statistics from local storage.
 */
export const getHistoryStats = () => {
  const items = getHistory();
  if (items.length === 0) {
    return {
      totalPrompts: 0,
      averageScore: 0,
      topCategory: 'General',
      categoryCounts: {} as Record<string, number>,
    };
  }

  const totalPrompts = items.length;
  const sumScore = items.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = Math.round(sumScore / totalPrompts);

  const categoryCounts: Record<string, number> = {};
  items.forEach(item => {
    const cat = item.taskType || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  let topCategory: TaskType = 'General';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat as TaskType;
    }
  });

  return {
    totalPrompts,
    averageScore,
    topCategory,
    categoryCounts,
  };
};
