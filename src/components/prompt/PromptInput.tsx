import React, { useState } from 'react';
import { Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
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
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setValidationError('Enter a prompt before improving it.');
      return;
    }
    if (prompt.length > maxChars) {
      setValidationError('Your prompt exceeds the 5000 character limit.');
      return;
    }
    setValidationError(null);
    onSubmit();
  };

  const handleInputChange = (val: string) => {
    onChange(val);
    if (validationError && val.trim().length > 0) {
      setValidationError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <label
            htmlFor="prompt-textarea"
            className="block text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            Your Prompt
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Describe your task, question, or draft prompt below.
          </p>
        </div>

        {/* Task Type selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="task-type-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Task Type:
          </label>
          <select
            id="task-type-select"
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value as TaskType)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors shadow-xs"
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
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Describe what you want the AI to help you with..."
          className="w-full rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y min-h-[150px] leading-relaxed"
        />

        {/* Character Count & Clear */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span
            className={`text-xs font-mono transition-colors ${
              charCount > maxChars
                ? 'text-rose-500 font-bold'
                : charCount > maxChars * 0.9
                ? 'text-amber-500 font-medium'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {charCount} / {maxChars}
          </span>

          <div className="flex items-center gap-2">
            {prompt && onReset && (
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setValidationError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Quick ideas:</span>
          {['make a website', 'explain machine learning', 'write a pitch email'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => handleInputChange(sample)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
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
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-md shadow-indigo-500/10 font-semibold"
        >
          Improve Prompt
        </Button>
      </div>
    </form>
  );
};
