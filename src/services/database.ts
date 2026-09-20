import { supabase } from '../lib/supabase';
import type {
  PromptAnalysis,
  PromptHistoryItem,
  DashboardStats,
  UserProfile,
  TaskType,
  ScoreBreakdown,
} from '../types';

export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
}

interface PromptHistoryRow {
  id: string;
  user_id: string;
  original_prompt: string;
  improved_prompt: string;
  task_type: string;
  quality_score: number;
  analysis: {
    detailedScore?: ScoreBreakdown;
    problems?: string[];
    whyBetter?: string[];
    suggestions?: string[];
  };
  created_at: string;
  updated_at: string;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Helper to map a database row (snake_case) to PromptHistoryItem (camelCase)
 */
function mapRowToHistoryItem(row: PromptHistoryRow): PromptHistoryItem {
  return {
    id: row.id,
    originalPrompt: row.original_prompt,
    improvedPrompt: row.improved_prompt,
    taskType: (row.task_type as TaskType) || 'General',
    score: row.quality_score,
    createdAt: row.created_at,
    detailedScore: row.analysis?.detailedScore,
    problems: row.analysis?.problems,
    whyBetter: row.analysis?.whyBetter,
    suggestions: row.analysis?.suggestions,
  };
}

/**
 * Helper to map a database profile row (snake_case) to UserProfile (camelCase)
 */
function mapRowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Save a completed PromptAnalysis result to Supabase prompt_history
 */
export async function savePromptHistory(
  analysis: PromptAnalysis
): Promise<DatabaseResponse<PromptHistoryItem>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        data: null,
        error: 'You must be signed in to save prompts to your history.',
      };
    }

    const insertPayload = {
      user_id: user.id,
      original_prompt: analysis.originalPrompt,
      improved_prompt: analysis.improvedPrompt,
      task_type: analysis.taskType,
      quality_score: analysis.score?.overall ?? 0,
      analysis: {
        detailedScore: analysis.score,
        problems: analysis.problems,
        whyBetter: analysis.whyBetter,
        suggestions: analysis.suggestions,
      },
      created_at: analysis.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('prompt_history')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('[Save Prompt History Error]:', {
        table: 'prompt_history',
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        data: null,
        error: 'Failed to save prompt to history. Please try again.',
      };
    }

    return {
      data: mapRowToHistoryItem(data as PromptHistoryRow),
      error: null,
    };
  } catch (err) {
    console.error(
      '[Save Prompt History Unexpected Error]:',
      err instanceof Error ? err.message : 'Unknown error'
    );
    return {
      data: null,
      error: 'An unexpected error occurred while saving to history.',
    };
  }
}

/**
 * Fetch the authenticated user's prompt history ordered by created_at DESC
 */
export async function getPromptHistory(
  userId?: string
): Promise<DatabaseResponse<PromptHistoryItem[]>> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          data: null,
          error: 'You must be signed in to view your prompt history.',
        };
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Prompt History Error]:', {
        table: 'prompt_history',
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        data: null,
        error: 'Failed to load prompt history. Please try again.',
      };
    }

    const mappedItems: PromptHistoryItem[] = ((data as PromptHistoryRow[]) || []).map(
      mapRowToHistoryItem
    );

    return {
      data: mappedItems,
      error: null,
    };
  } catch (err) {
    console.error('[Prompt History Unexpected Error]:', err);
    return {
      data: null,
      error: 'An unexpected error occurred while loading prompt history.',
    };
  }
}

/**
 * Delete a specific prompt history item belonging to the authenticated user
 */
export async function deletePromptHistory(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'You must be signed in to delete prompt history.',
      };
    }

    const { error } = await supabase
      .from('prompt_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Delete Prompt History Error]:', {
        table: 'prompt_history',
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        success: false,
        error: 'Failed to delete prompt history item. Please try again.',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    console.error(
      '[Delete Prompt History Unexpected Error]:',
      err instanceof Error ? err.message : 'Unknown error'
    );
    return {
      success: false,
      error: 'An unexpected error occurred while deleting prompt history item.',
    };
  }
}

export interface DashboardData {
  stats: DashboardStats;
  recentPrompts: PromptHistoryItem[];
}

/**
 * Provide calculated statistics and recent prompts for the Dashboard
 */
export async function getDashboardStats(
  userId?: string
): Promise<DatabaseResponse<DashboardData>> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          data: null,
          error: 'You must be signed in to view dashboard statistics.',
        };
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Dashboard Stats Error]:', {
        table: 'prompt_history',
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        data: null,
        error: 'Failed to load dashboard statistics. Please try again.',
      };
    }

    const rows = (data as PromptHistoryRow[]) || [];
    const totalPrompts = rows.length;

    if (totalPrompts === 0) {
      return {
        data: {
          stats: {
            totalPrompts: 0,
            averageScore: 0,
            improvedPrompts: 0,
            templatesUsed: 0,
          },
          recentPrompts: [],
        },
        error: null,
      };
    }

    const sumScore = rows.reduce((acc, r) => acc + (r.quality_score || 0), 0);
    const averageScore = Math.round(sumScore / totalPrompts);
    const improvedPrompts = rows.filter((r) => r.quality_score >= 70).length;

    // Distinct task types used
    const uniqueTaskTypes = new Set(rows.map((r) => r.task_type).filter(Boolean));
    const templatesUsed = uniqueTaskTypes.size;

    const recentPrompts = rows.slice(0, 5).map(mapRowToHistoryItem);

    return {
      data: {
        stats: {
          totalPrompts,
          averageScore,
          improvedPrompts,
          templatesUsed,
        },
        recentPrompts,
      },
      error: null,
    };
  } catch (err) {
    console.error('[Dashboard Stats Unexpected Error]:', err);
    return {
      data: null,
      error: 'An unexpected error occurred while loading dashboard statistics.',
    };
  }
}

/**
 * Fetch the authenticated user's profile row from public.profiles
 */
export async function getProfile(): Promise<DatabaseResponse<UserProfile>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        data: null,
        error: 'You must be signed in to view your profile.',
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      return {
        data: null,
        error: 'Failed to load user profile. Please try again.',
      };
    }

    if (!data) {
      // If profile row doesn't exist yet, attempt to auto-create from auth user
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: (user.user_metadata?.full_name as string) || null,
          email: user.email || null,
        })
        .select()
        .single();

      if (insertError || !newProfile) {
        return {
          data: {
            id: user.id,
            fullName: (user.user_metadata?.full_name as string) || null,
            email: user.email || null,
            createdAt: user.created_at || new Date().toISOString(),
            updatedAt: user.created_at || new Date().toISOString(),
          },
          error: null,
        };
      }

      return {
        data: mapRowToProfile(newProfile as ProfileRow),
        error: null,
      };
    }

    return {
      data: mapRowToProfile(data as ProfileRow),
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'An unexpected error occurred while loading your profile.',
    };
  }
}

/**
 * Update the authenticated user's profile
 */
export async function updateProfile(
  fullName: string
): Promise<DatabaseResponse<UserProfile>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        data: null,
        error: 'You must be signed in to update your profile.',
      };
    }

    const trimmedName = fullName.trim();

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: trimmedName,
        email: user.email || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: 'Failed to update profile. Please try again.',
      };
    }

    // Keep auth user_metadata synchronized
    await supabase.auth.updateUser({
      data: { full_name: trimmedName },
    });

    return {
      data: mapRowToProfile(data as ProfileRow),
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'An unexpected error occurred while updating your profile.',
    };
  }
}

/**
 * Create a profile row for the authenticated user
 */
export async function createProfile(
  fullName?: string
): Promise<DatabaseResponse<UserProfile>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        data: null,
        error: 'You must be signed in to create a profile.',
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName ? fullName.trim() : null,
        email: user.email || null,
      })
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: 'Failed to create profile. Please try again.',
      };
    }

    return {
      data: mapRowToProfile(data as ProfileRow),
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'An unexpected error occurred while creating profile.',
    };
  }
}
