import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { Button } from '../ui/Button';

interface ImprovedPromptCardProps {
  improvedPrompt: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  onSave?: () => Promise<boolean> | boolean | void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export const ImprovedPromptCard: React.FC<ImprovedPromptCardProps> = ({
  improvedPrompt,
  onRegenerate,
  isRegenerating = false,
  onSave,
  isSaving = false,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(improvedPrompt);
    if (success) {
      setCopied(true);
      showToast('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('Failed to copy. Please copy manually.');
    }
  };

  const handleSaveClick = async () => {
    if (isSaving) return;
    if (onSave) {
      const result = await onSave();
      if (result === true) {
        showToast('Saved to browser session history!');
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-ink-800 border-2 border-forest-600/60 dark:border-forest-500/50 rounded-2xl p-6 shadow-xs">
      {/* Toast notification */}
      {feedbackToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-ink-900 text-parchment-50 text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in border border-forest-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-parchment-200 dark:border-ink-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Optimized Deliverable
          </h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 dark:bg-ink-900 dark:text-forest-300 border border-forest-200 dark:border-ink-700">
            Production Ready
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            className={copied ? 'border-emerald-600 text-emerald-700' : ''}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Regenerate
          </Button>

          <Button
            type="button"
            variant={isSaved ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleSaveClick}
            isLoading={isSaving}
            disabled={isSaving}
            leftIcon={
              isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-forest-700 dark:text-forest-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )
            }
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Output Content Container */}
      <div className="relative group">
        <div className="p-5 rounded-xl bg-parchment-50 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-700 text-sm md:text-base leading-relaxed text-ink-900 dark:text-ink-100 font-normal whitespace-pre-wrap select-all font-sans">
          {improvedPrompt}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
        <span>Ready to paste directly into ChatGPT, Claude, Gemini, or Meta Llama.</span>
        <span className="font-mono text-ink-600 dark:text-ink-300">{improvedPrompt.length} characters</span>
      </div>
    </div>
  );
};
