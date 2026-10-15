import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-parchment-200 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-900/60 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-forest-700 text-parchment-50 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-parchment-100" />
              </div>
              <span className="font-bold text-lg text-ink-900 dark:text-ink-50">
                AI Prompt Studio
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 max-w-sm leading-relaxed">
              "Turn Simple Ideas into Powerful AI Prompts." Mature, editorial-grade prompt engineering powered by Groq Cloud API.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-ink-600 dark:text-ink-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700">
                <Shield className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" /> 100% Private Local Storage
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700">
                <Cpu className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" /> Groq Cloud (GPT-OSS 120B)
              </span>
            </div>
          </div>

          {/* Product Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-ink-50 mb-3">
              Studio Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/improve"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Prompt Improver
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Pattern Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Usage Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Session History
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                >
                  Architecture & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Repository & Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-ink-50 mb-3">
              Infrastructure
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="https://github.com/Harikrishna559/ai-prompt-assistant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-600 dark:text-ink-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
              <li>
                <span className="text-ink-400 dark:text-ink-500 text-xs">
                  Model: openai/gpt-oss-120b
                </span>
              </li>
              <li>
                <span className="text-ink-400 dark:text-ink-500 text-xs">
                  Host: Vercel Serverless
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-parchment-200 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500 dark:text-ink-400">
          <p>© 2026 AI Prompt Assistant. Editorial developer edition.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-forest-700 dark:hover:text-forest-300 transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <Link to="/history" className="hover:text-forest-700 dark:hover:text-forest-300 transition-colors">
              Browser Storage
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
