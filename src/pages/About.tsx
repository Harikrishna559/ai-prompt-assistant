import React from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Cpu,
  Info,
  MapPin,
  Database,
  KeyRound,
  Rocket,
  Code2,
  Terminal,
  SlidersHorizontal,
  AlertCircle,
  Wand2,
  Award,
} from 'lucide-react';
import { Card } from '../components/ui/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About the Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Engineering Better Human-to-AI Communication
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          "Turn vague prompts into clear, powerful AI instructions."
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-rose-200/70 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Problem
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Many users struggle to write effective AI prompts, resulting in vague, incomplete, or inconsistent AI responses.
            Without explicit personas, scope boundaries, output formatting instructions, and constraints, even frontier LLMs frequently hallucinate or produce generic, low-value answers.
          </p>
        </Card>

        <Card className="border-emerald-200/70 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Solution
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            AI Prompt Improvement Assistant analyzes prompt quality and provides an improved version with explanations and suggestions.
            By applying cognitive scaffolding, structured parameters, and role-based prompt engineering principles, it elevates ambiguous one-liners into deterministic, high-impact instructions.
          </p>
        </Card>
      </div>

      {/* How It Works 5-Step Process */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            How It Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Our systematic five-stage optimization lifecycle:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Enter Prompt',
              desc: 'Provide your initial thought, brief question, or raw task request.',
              icon: <Terminal className="w-4 h-4 text-indigo-500" />,
            },
            {
              step: '2',
              title: 'Analyze Prompt',
              desc: 'Evaluated across four core dimensions: clarity, context, specificity, and completeness.',
              icon: <SlidersHorizontal className="w-4 h-4 text-blue-500" />,
            },
            {
              step: '3',
              title: 'Identify Weaknesses',
              desc: 'Missing targets, ambiguous instructions, and lack of constraints are highlighted with actionable alerts.',
              icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
            },
            {
              step: '4',
              title: 'Improve Prompt',
              desc: 'Synthesizes an augmented prompt containing context, persona, structure, and guardrails.',
              icon: <Wand2 className="w-4 h-4 text-purple-500" />,
            },
            {
              step: '5',
              title: 'Get Better Results',
              desc: 'Receive a clearer and more effective prompt ready for copy-paste with practical craftsmanship suggestions.',
              icon: <Award className="w-4 h-4 text-emerald-500" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                    Step {item.step}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            Technologies Used
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Built using modern, type-safe frontend web standards:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: 'React', badge: 'v19' },
            { name: 'TypeScript', badge: 'Strict' },
            { name: 'Vite', badge: 'v8' },
            { name: 'Tailwind CSS', badge: 'v3.4' },
            { name: 'Lucide React', badge: 'Icons' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center"
            >
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                {tech.name}
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                {tech.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Roadmap Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-500" />
            Future Roadmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Five sequential phases of product development:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              phase: 'Phase 1',
              title: 'Frontend',
              desc: 'Production-quality UI/UX design, mock API layer, local state, responsive layouts, and light/dark theme.',
              status: 'Completed',
              icon: <Code2 className="w-4 h-4 text-emerald-500" />,
              badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
            },
            {
              phase: 'Phase 2',
              title: 'Gemini AI',
              desc: 'Direct integration with Google DeepMind Gemini API models for automated prompt analysis and multi-modal refinement.',
              status: 'Planned',
              icon: <Sparkles className="w-4 h-4 text-blue-500" />,
              badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
            },
            {
              phase: 'Phase 3',
              title: 'Supabase',
              desc: 'Cloud Postgres database for real-time prompt synchronization, template tagging, and prompt versioning.',
              status: 'Planned',
              icon: <Database className="w-4 h-4 text-indigo-500" />,
              badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
            },
            {
              phase: 'Phase 4',
              title: 'Authentication',
              desc: 'Secure user login, OAuth 2.0 single sign-on, profile management, and role-based access control.',
              status: 'Planned',
              icon: <KeyRound className="w-4 h-4 text-amber-500" />,
              badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
            },
            {
              phase: 'Phase 5',
              title: 'Production Deployment',
              desc: 'Edge deployment on Vercel/Cloudflare, rate limiting, security auditing, and automated analytics.',
              status: 'Planned',
              icon: <Rocket className="w-4 h-4 text-purple-500" />,
              badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
            },
          ].map((item) => (
            <div
              key={item.phase}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.phase}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 1 Notice Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-blue-900 dark:text-blue-200">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-semibold">
            Phase 1 Frontend Prototype Notice
          </p>
          <p>
            Gemini API, Supabase, authentication, and backend are intentionally NOT implemented in this phase. The application is structured with decoupled service layers to support seamless Gemini API and Supabase integration without UI redesigns.
          </p>
        </div>
      </div>
    </div>
  );
};
