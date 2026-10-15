import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon, Wand2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Improve Prompt', path: '/improve' },
    { label: 'Templates', path: '/templates' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-parchment-200 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 backdrop-blur-md transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group rounded-xl p-1 focus-visible:ring-2 focus-visible:ring-forest-700"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-700 dark:bg-forest-600 flex items-center justify-center text-parchment-50 shadow-xs group-hover:bg-forest-800 transition-colors">
            <Sparkles className="w-5 h-5 text-parchment-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-ink-900 dark:text-ink-50 flex items-center gap-2">
              AI Prompt Studio
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 dark:bg-ink-900 dark:text-forest-300 border border-forest-200 dark:border-ink-700">
                Editorial
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-forest-700 text-parchment-50 dark:bg-forest-600 font-semibold shadow-xs'
                    : 'text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-parchment-100 dark:hover:bg-ink-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors border border-parchment-200 dark:border-ink-700"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-ink-700" />}
          </button>

          <Link to="/improve">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Wand2 className="w-4 h-4" />}
            >
              Enhance Prompt
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:bg-parchment-100 dark:hover:bg-ink-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded-xl text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-parchment-200 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-forest-700 text-parchment-50 font-semibold'
                    : 'text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-parchment-200 dark:border-ink-800">
            <Link
              to="/improve"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" size="md" className="w-full justify-center">
                Enhance Prompt Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
