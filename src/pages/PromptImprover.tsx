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

  // Initial state check from location navigation (e.g. coming from Templates or History)
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
        text: 'Prompt saved to your browser session history!',
      });
      return true;
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save prompt to browser storage.',
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-800 dark:text-forest-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
          <span>Interactive Prompt Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
          Enhance & Refine Your Prompt
        </h1>
        <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400">
          Turn your raw thought into a structured, production-grade AI prompt blueprint.
        </p>
      </div>

      {/* Template applied indicator banner */}
      {location.state?.templateTitle && (
        <div className="p-3.5 rounded-xl bg-forest-50 dark:bg-ink-900 border border-forest-200 dark:border-ink-700 flex items-center justify-between text-xs text-forest-800 dark:text-forest-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-700 dark:text-forest-400" />
            <span>
              Loaded Blueprint: <strong>{location.state.templateTitle}</strong>
            </span>
          </div>
          <span className="font-semibold text-forest-700 dark:text-forest-400">Ready to customize</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-terracotta-50 dark:bg-ink-900 border border-terracotta-200 dark:border-terracotta-900/60 flex items-center gap-3 text-sm text-terracotta-800 dark:text-terracotta-300 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Save Status Notification */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm animate-fade-in ${
            saveMessage.type === 'error'
              ? 'bg-terracotta-50 dark:bg-ink-900 border border-terracotta-200 dark:border-terracotta-900/60 text-terracotta-800 dark:text-terracotta-300'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
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
        <div className="bg-white dark:bg-ink-800 border border-dashed border-parchment-300 dark:border-ink-700 rounded-2xl p-8 sm:p-12 text-center animate-fade-in shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 flex items-center justify-center mx-auto mb-3.5 border border-forest-100 dark:border-ink-700">
            <Wand2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-ink-900 dark:text-ink-50 mb-1">
            Ready to optimize your prompt?
          </h3>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
            Enter a rough instruction above and click "Enhance Prompt Now" to inspect structured improvements and quality grades.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-forest-800 dark:text-forest-300 bg-forest-50/80 dark:bg-ink-900 px-3.5 py-1.5 rounded-full border border-forest-200/60 dark:border-ink-700">
            <span>Tip: Select a domain category like Coding or Business for tailored persona framing</span>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {!isLoading && analysis && (
        <div className="space-y-8 animate-fade-in pt-3">
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
