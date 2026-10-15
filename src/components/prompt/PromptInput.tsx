import React, { useState } from 'react';
import { Sparkles, RotateCcw, AlertCircle, Wand2 } from 'lucide-react';
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
      setValidationError('Please enter a prompt to analyze and improve.');
      return;
    }
    if (prompt.length > maxChars) {
      setValidationError('Your prompt exceeds the 5,000 character limit.');
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-7 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <label
            htmlFor="prompt-textarea"
            className="block text-base font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4 text-forest-700 dark:text-forest-400" />
            Enter Raw Instruction or Concept
          </label>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Describe your rough task, question, or prompt below.
          </p>
        </div>

        {/* Task Type selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="task-type-select" className="text-xs font-semibold text-ink-500 dark:text-ink-400 shrink-0">
            Domain Category:
          </label>
          <select
            id="task-type-select"
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value as TaskType)}
            className="text-xs font-medium bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-ink-900 dark:text-ink-100 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer transition-colors shadow-2xs"
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
          placeholder="e.g. Write a python script to parse CSV files and generate a weekly summary report..."
          className="w-full rounded-xl bg-parchment-50/70 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 p-4 text-sm md:text-base text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-700 focus:bg-white dark:focus:bg-ink-900 transition-all resize-y min-h-[150px] leading-relaxed"
        />

        {/* Character Count & Clear */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span
            className={`text-xs font-mono transition-colors ${
              charCount > maxChars
                ? 'text-terracotta-600 font-bold'
                : charCount > maxChars * 0.9
                ? 'text-amber-600 font-medium'
                : 'text-ink-400 dark:text-ink-500'
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
                className="text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-parchment-100 dark:hover:bg-ink-700"
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
        <div className="mt-3 p-3 rounded-xl bg-terracotta-50 dark:bg-ink-900 border border-terracotta-200 dark:border-terracotta-900/60 flex items-center gap-2 text-xs text-terracotta-800 dark:text-terracotta-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-4 border-t border-parchment-200 dark:border-ink-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400">Try quick samples:</span>
          {[
            { label: 'Build REST API', val: 'Write a Node.js REST API with authentication and rate limiting' },
            { label: 'Blog Outline', val: 'Create an engaging blog post outline about AI prompt engineering' },
            { label: 'Data Analysis', val: 'Analyze customer churn data in Python using Pandas' },
          ].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleInputChange(sample.val)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors border border-parchment-200 dark:border-ink-700"
            >
              "{sample.label}"
            </button>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto font-medium"
        >
          Enhance Prompt Now
        </Button>
      </div>
    </form>
  );
};
