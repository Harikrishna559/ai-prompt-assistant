import React, { useState } from 'react';
import {
  Code,
  GraduationCap,
  BarChart3,
  PenTool,
  Share2,
  Briefcase,
  Mail,
  Search,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import type { PromptTemplate } from '../../types';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/clipboard';

interface TemplateCardProps {
  template: PromptTemplate;
  onUseTemplate: (template: PromptTemplate) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUseTemplate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyExample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(template.examplePrompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 shadow-xs hover:border-parchment-400 dark:hover:border-ink-600 transition-all duration-150 group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-forest-50 text-forest-700 dark:bg-ink-900 dark:text-forest-300 border border-forest-100 dark:border-ink-700 transition-transform">
            {ICON_MAP[template.iconName] || <Sparkles className="w-5 h-5" />}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-parchment-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300 border border-parchment-200 dark:border-ink-700">
            {template.category}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-1.5">
          {template.title}
        </h3>
        <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mb-4 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Example Prompt Box */}
        <div className="relative mb-5 p-3.5 rounded-xl bg-parchment-50 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-700/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
              Pattern Blueprint
            </span>
            <button
              onClick={handleCopyExample}
              title="Copy sample prompt"
              className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors p-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs text-ink-800 dark:text-ink-200 line-clamp-3 italic font-sans leading-relaxed">
            "{template.examplePrompt}"
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-parchment-200 dark:border-ink-700/80">
        <Button
          onClick={() => onUseTemplate(template)}
          variant="secondary"
          size="sm"
          className="w-full group-hover:bg-forest-700 group-hover:text-parchment-50 dark:group-hover:bg-forest-600 dark:group-hover:text-parchment-50 transition-colors font-medium"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Use Blueprint
        </Button>
      </div>
    </div>
  );
};
