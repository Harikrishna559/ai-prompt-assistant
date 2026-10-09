import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
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
        showToast('Prompt saved to browser history!');
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border-2 border-sky-400/40 dark:border-sky-500/40 rounded-2xl p-6 shadow-md shadow-sky-500/5">
      {/* Toast notification */}
      {feedbackToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in border border-sky-400/30">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-sky-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Optimized Deliverable
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
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
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            className={copied ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : ''}
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
                <BookmarkCheck className="w-4 h-4 text-sky-600" />
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
        <div className="p-5 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-normal whitespace-pre-wrap select-all font-sans">
          {improvedPrompt}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Ready to copy directly into ChatGPT, Claude, Gemini, or Meta Llama.</span>
        <span className="font-mono">{improvedPrompt.length} characters</span>
      </div>
    </div>
  );
};
