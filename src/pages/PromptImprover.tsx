import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, AlertCircle, Layers, CheckCircle2, Wand2 } from 'lucide-react';
import type { PromptAnalysis, TaskType } from '../types';
import { analyzePrompt } from '../services/api';
import { saveHistoryItem } from '../services/localStorage';
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

  const [variation, setVariation] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'error' | 'info' | 'success';
    text: string;
  } | null>(null);

  // If redirected with template state, update input
  useEffect(() => {
    if (location.state?.templatePrompt) {
      setPrompt(location.state.templatePrompt);
    }
    if (location.state?.taskType) {
      setTaskType(location.state.taskType);
    }
  }, [location.state]);

  const handleImprove = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to analyze and improve.');
      return;
    }

    setError(null);
    setSaveMessage(null);
    setIsSaved(false);
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
    setSaveMessage(null);
    setIsSaved(false);

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

  const handleSave = async (): Promise<boolean> => {
    if (!analysis) return false;
    if (isSaving) return false;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      saveHistoryItem({
        id: analysis.id,
        originalPrompt: analysis.originalPrompt,
        improvedPrompt: analysis.improvedPrompt,
        taskType: analysis.taskType,
        score: analysis.score.overall,
        createdAt: analysis.createdAt || new Date().toISOString(),
        detailedScore: analysis.score,
        problems: analysis.problems,
        whyBetter: analysis.whyBetter,
        suggestions: analysis.suggestions,
      });

      setIsSaved(true);
      setSaveMessage({
        type: 'success',
        text: 'Prompt saved to your browser history!',
      });
      return true;
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save prompt. Please try again.',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setAnalysis(null);
    setError(null);
    setIsSaved(false);
    setSaveMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Interactive AI Prompt Improver</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Enhance & Refine Your Prompt
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Transform your vague request into a high-performance, structured AI prompt.
        </p>
      </div>

      {/* Template applied indicator banner */}
      {location.state?.templateTitle && (
        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs text-sky-700 dark:text-sky-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>
              Loaded Template: <strong>{location.state.templateTitle}</strong>
            </span>
          </div>
          <span className="text-sky-600 font-medium">Ready to customize</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-sm text-rose-700 dark:text-rose-400 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Save Status Notification */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm animate-fade-in ${
            saveMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span>{saveMessage.text}</span>
          </div>
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

      {/* Loading Skeleton during Processing */}
      {isLoading && <LoadingState />}

      {/* Intentional Empty State before first improvement */}
      {!isLoading && !analysis && (
        <div className="bg-white/80 dark:bg-slate-900/80 border border-dashed border-sky-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center animate-fade-in shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-100 dark:border-sky-900/40">
            <Wand2 className="w-6 h-6 text-sky-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Ready to enhance your prompt?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter a rough idea above and click "Enhance Prompt Now" to see structured recommendations and quality scores.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50/80 dark:bg-sky-950/40 px-3.5 py-1.5 rounded-full border border-sky-200/60 dark:border-sky-800/60">
            <span>Tip: Select a specific category like Coding or Business for best results</span>
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
            isSaving={isSaving}
            isSaved={isSaved}
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
