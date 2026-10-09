import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-100" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                AI Prompt Assistant
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              "Turn Simple Ideas into Powerful AI Prompts." Production-grade prompt engineering SaaS powered by NVIDIA NIM & Meta Llama 3.3.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800">
                <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> 100% Private (Local Browser Storage)
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Powered by NVIDIA NIM API
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Product Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/improve"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Improve Prompt
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Prompt Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Prompt History
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Architecture & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links & Specs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Repository & Info
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Harikrishna559/ai-prompt-assistant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                  Model: Meta Llama 3.3 70B Instruct
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                  Infrastructure: Vercel Serverless
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sky-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 AI Prompt Improvement Assistant. Public Production SaaS.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              How It Works
            </Link>
            <span>•</span>
            <Link to="/history" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Browser Local Storage
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
