import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Wand2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageMeta = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Overview', breadcrumb: 'Studio / Home' };
      case '/improve':
        return { title: 'Prompt Improver', breadcrumb: 'Studio / Optimize' };
      case '/templates':
        return { title: 'Templates Library', breadcrumb: 'Studio / Templates' };
      case '/dashboard':
        return { title: 'Dashboard & Metrics', breadcrumb: 'Studio / Analytics' };
      case '/history':
        return { title: 'Local Prompt History', breadcrumb: 'Studio / History' };
      case '/about':
        return { title: 'Architecture & System', breadcrumb: 'Studio / About' };
      default:
        return { title: 'Prompt Studio', breadcrumb: 'Studio' };
    }
  };

  const pageMeta = getPageMeta(location.pathname);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-parchment-200 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 backdrop-blur-md transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu trigger + Contextual Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl text-ink-700 dark:text-ink-300 hover:bg-parchment-200/60 dark:hover:bg-ink-800 md:hidden focus-visible:ring-2 focus-visible:ring-forest-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-500 dark:text-ink-400 hidden sm:block">
              {pageMeta.breadcrumb}
            </span>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">
              {pageMeta.title}
            </h1>
          </div>
        </div>

        {/* Right: Theme Toggle & Quick CTA */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-parchment-200/60 dark:hover:bg-ink-800 transition-colors border border-parchment-200/60 dark:border-ink-700/60"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-ink-700" />
            )}
          </button>

          {/* Quick Enhance Prompt CTA */}
          {location.pathname !== '/improve' && (
            <Link to="/improve">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Wand2 className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                Enhance Prompt
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
