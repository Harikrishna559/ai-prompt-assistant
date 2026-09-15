import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                AI Prompt Assistant
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              "Turn vague prompts into clear, powerful AI instructions."
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Designed for developers, researchers, and creators looking to unlock the full potential of large language models.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/improve"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Improve Prompt
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 AI Prompt Improvement Assistant</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-600 dark:hover:text-slate-300">
              Architecture & Vision
            </Link>
            <span>Phase 1 Frontend Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
