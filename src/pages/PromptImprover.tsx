import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, AlertCircle, Layers } from 'lucide-react';
import type { PromptAnalysis, TaskType } from '../types';
import { analyzePrompt } from '../services/api';
import { PromptInput } from '../components/prompt/PromptInput';
import { ScoreCard } from '../components/prompt/ScoreCard';
import { AnalysisCard } from '../components/prompt/AnalysisCard';
import { ImprovedPromptCard } from '../components/prompt/ImprovedPromptCard';
import { LoadingState } from '../components/ui/LoadingState';

export const PromptImprover: React.FC = () => {
  const location = useLocation();

  // Initial state check from location navigation (e.g. coming from Templates)
  const initialPrompt = location.state?.templatePrompt || '';
  const initialTaskType = (location.state?.taskType as TaskType) || 'General';

  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [taskType, setTaskType] = useState<TaskType>(initialTaskType);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If redirected with template state, update input
  useEffect(() => {
    if (location.state?.templatePrompt) {
      setPrompt(location.state.templatePrompt);
    }
    if (location.state?.taskType) {
      setTaskType(location.state.taskType);
    }
  }, [location.state]);

  const [variation, setVariation] = useState<number>(0);

  const handleImprove = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to analyze and improve.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      setVariation(0);
      const result = await analyzePrompt(prompt, taskType, 0);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!prompt.trim()) return;
    setIsRegenerating(true);
    try {
      const nextVar = variation + 1;
      setVariation(nextVar);
      const result = await analyzePrompt(prompt, taskType, nextVar);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate prompt. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = (isSaved: boolean) => {
    if (!analysis) return;
    try {
      const existing = JSON.parse(localStorage.getItem('saved_prompts') || '[]');
      if (isSaved) {
        const newEntry = {
          id: analysis.id,
          originalPrompt: analysis.originalPrompt,
          improvedPrompt: analysis.improvedPrompt,
          taskType: analysis.taskType,
          score: analysis.score.overall,
          createdAt: analysis.createdAt,
        };
        localStorage.setItem('saved_prompts', JSON.stringify([newEntry, ...existing]));
      }
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Improve Your Prompt
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Turn your idea into a clear and effective AI instruction.
        </p>
      </div>

      {/* Template applied indicator banner */}
      {location.state?.templateTitle && (
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>
              Loaded Template: <strong>{location.state.templateTitle}</strong>
            </span>
          </div>
          <span className="text-indigo-500 font-medium">Ready to customize</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-sm text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Section */}
      <PromptInput
        prompt={prompt}
        onChange={(val) => {
          setPrompt(val);
          if (error) setError(null);
        }}
        taskType={taskType}
        onTaskTypeChange={setTaskType}
        onSubmit={handleImprove}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Loading Skeleton during Mock Processing */}
      {isLoading && <LoadingState />}

      {/* Intentional Empty State before first improvement */}
      {!isLoading && !analysis && (
        <div className="bg-white/80 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center animate-fade-in shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Ready to improve your prompt?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter a rough idea above and we'll show you how it can be structured more effectively.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 px-3.5 py-1.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
            <span>Tip: Try selecting a task category or picking a quick idea</span>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {!isLoading && analysis && (
        <div className="space-y-8 animate-fade-in pt-4">
          {/* Main Improved Prompt Card */}
          <ImprovedPromptCard
            improvedPrompt={analysis.improvedPrompt}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
            onSave={handleSave}
          />

          {/* Quality Score Progress Bars */}
          <ScoreCard score={analysis.score} />

          {/* Identified Problems, Why It's Better, and Suggestions */}
          <AnalysisCard
            problems={analysis.problems}
            whyBetter={analysis.whyBetter}
            suggestions={analysis.suggestions}
          />
        </div>
      )}
    </div>
  );
};
