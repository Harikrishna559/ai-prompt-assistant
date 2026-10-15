import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import { MOCK_TEMPLATES, PROMPT_CATEGORIES } from '../data/templates';
import type { PromptTemplate } from '../types';
import { TemplateCard } from '../components/templates/TemplateCard';
import { EmptyState } from '../components/ui/EmptyState';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        template.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.examplePrompt.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleUseTemplate = (template: PromptTemplate) => {
    navigate('/improve', {
      state: {
        templatePrompt: template.examplePrompt,
        taskType: template.taskType,
        templateTitle: template.title,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-800 dark:text-forest-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
          <span>Curated Blueprint Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
          Prompt Templates
        </h1>
        <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400">
          Start with proven, battle-tested prompt architectures for any discipline.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blueprints by keyword, category, or role..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 text-sm text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-700 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar px-2">
          {['All', ...PROMPT_CATEGORIES.filter((c) => c !== 'All')].map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-forest-700 dark:bg-forest-600 text-parchment-50 shadow-2xs'
                    : 'bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid or Empty State */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No blueprints found"
          description="Try modifying your search keywords or switching category filters."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
};
