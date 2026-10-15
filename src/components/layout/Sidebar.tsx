import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Wand2,
  Layers,
  LayoutDashboard,
  History,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Compass },
    { label: 'Improve Prompt', path: '/improve', icon: Wand2 },
    { label: 'Templates', path: '/templates', icon: Layers },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Prompt History', path: '/history', icon: History },
    { label: 'About', path: '/about', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-parchment-100/90 dark:bg-ink-900 border-r border-parchment-200 dark:border-ink-800 transition-colors">
      {/* Brand Header */}
      <div className={`p-4 border-b border-parchment-200 dark:border-ink-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-forest-700 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-700 dark:bg-forest-600 text-parchment-50 flex items-center justify-center shadow-xs shrink-0 group-hover:bg-forest-800 transition-colors">
            <Sparkles className="w-5 h-5 text-parchment-100" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-ink-900 dark:text-ink-50 truncate">
                AI Prompt Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700 dark:text-forest-400">
                Editorial v2.0
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100 hover:bg-parchment-200/60 dark:hover:bg-ink-800 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar Navigation">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-forest-700 dark:bg-forest-600 text-parchment-50 font-semibold shadow-xs'
                  : 'text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-parchment-200/70 dark:hover:bg-ink-800'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-parchment-100' : 'text-ink-500 dark:text-ink-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.path === '/improve' && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-900/60 dark:text-terracotta-200">
                  Tool
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Privacy & Collapse Control Section */}
      <div className="p-3 border-t border-parchment-200 dark:border-ink-800 space-y-2">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 shadow-2xs text-xs space-y-1.5">
            <div className="flex items-center justify-between text-ink-700 dark:text-ink-300">
              <span className="font-bold flex items-center gap-1.5 text-forest-700 dark:text-forest-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Local & Private
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active session" />
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-tight">
              Stored 100% in your browser. No server tracking.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Local & Private session" />
          </div>
        )}

        {/* Desktop Collapse / Expand Button */}
        <div className="hidden md:flex items-center justify-between pt-1">
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-parchment-200/60 dark:hover:bg-ink-800 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen z-30 transition-all duration-200 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay & Panel */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden animate-fade-in"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink-950/60 backdrop-blur-2xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl animate-slide-up">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
