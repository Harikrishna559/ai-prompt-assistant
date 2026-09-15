import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import type { TaskType } from '../../types';
import { TASK_TYPES } from '../../data/mockPrompts';
import { Button } from '../ui/Button';

interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  taskType: TaskType;
  onTaskTypeChange: (type: TaskType) => void;
  onSubmit: () => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onChange,
  taskType,
  onTaskTypeChange,
  onSubmit,
  onReset,
  isLoading = false,
}) => {
  const maxChars = 5000;
  const charCount = prompt.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <label
            htmlFor="prompt-textarea"
            className="block text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            Your Prompt
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Type your rough concept, question, or raw instructions below.
          </p>
        </div>

        {/* Task Type selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="task-type-select" className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Task Type:
          </label>
          <select
            id="task-type-select"
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value as TaskType)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="prompt-textarea"
          rows={6}
          value={prompt}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onChange(e.target.value);
            }
          }}
          placeholder="Enter your prompt here... (e.g. 'make a website' or 'write an email asking for a raise')"
          className="w-full rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y min-h-[140px]"
        />

        {/* Character Count */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span
            className={`text-xs ${
              charCount > maxChars * 0.9
                ? 'text-rose-500 font-semibold'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {charCount} / {maxChars}
          </span>

          <div className="flex items-center gap-2">
            {prompt && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">Quick ideas:</span>
          {['make a website', 'explain machine learning', 'write a pitch email'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => onChange(sample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!prompt.trim() || isLoading}
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Improve Prompt
        </Button>
      </div>
    </form>
  );
};
