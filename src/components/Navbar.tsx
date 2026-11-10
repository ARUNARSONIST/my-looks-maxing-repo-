import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { RoutineDomain, SafeUser } from '../lib/types';

export type AppView =
  | 'landing'
  | 'quiz'
  | 'routines'
  | 'assessment'
  | 'dashboard'
  | 'progress'
  | 'community'
  | 'pricing'
  | 'auth'
  | 'admin';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView, routineDomain?: RoutineDomain) => void;
  user: SafeUser | null;
}

export function Navbar({ activeView, onNavigate, user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryNav: Array<{ label: string; view: AppView }> = [
    { label: 'Home', view: 'landing' },
    { label: 'Glow-Up Plan', view: 'quiz' },
    { label: 'Routines', view: 'routines' },
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Community', view: 'community' },
  ];

  const handleNav = (view: AppView, domain?: RoutineDomain) => {
    setMobileOpen(false);
    onNavigate(view, domain);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-zinc-800/90 bg-[#F6F4EF]/95 dark:bg-[#0D0F12]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-editorial text-2xl font-semibold tracking-tight text-zinc-900 dark:text-[#F4F2ED] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
        >
          Apex Glow
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {primaryNav.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500 ${
                  isActive
                    ? 'border-teal-500 text-zinc-950 dark:text-[#F4F2ED]'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-[#F4F2ED]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action on desktop + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav(user ? 'auth' : 'auth')}
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
          >
            {user ? 'Account' : 'Login'}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-stone-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-stone-200 dark:border-zinc-800 bg-[#F6F4EF] dark:bg-[#0D0F12] px-4 py-4 space-y-1"
        >
          {[
            { label: 'Home', view: 'landing' as AppView },
            { label: 'Glow-Up Plan', view: 'quiz' as AppView },
            { label: 'Skin', view: 'routines' as AppView, domain: 'Skincare' as RoutineDomain },
            { label: 'Hair', view: 'routines' as AppView, domain: 'Hair' as RoutineDomain },
            { label: 'Style', view: 'routines' as AppView, domain: 'Style' as RoutineDomain },
            { label: 'Fitness', view: 'routines' as AppView, domain: 'Fitness' as RoutineDomain },
            { label: 'Posture', view: 'routines' as AppView, domain: 'Posture' as RoutineDomain },
            { label: 'AI Assessment', view: 'assessment' as AppView },
            { label: 'Daily Dashboard', view: 'dashboard' as AppView },
            { label: 'Progress Tracker', view: 'progress' as AppView },
            { label: 'Community', view: 'community' as AppView },
            { label: 'Pricing', view: 'pricing' as AppView },
            ...(user?.role === 'admin' ? [{ label: 'Admin Console', view: 'admin' as AppView }] : []),
            { label: user ? `Account (${user.fullName.split(' ')[0]})` : 'Login / Sign Up', view: 'auth' as AppView },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item.view, item.domain)}
              className="flex w-full items-center justify-between rounded-lg px-3 min-h-[44px] text-left text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-200/70 dark:hover:bg-zinc-800/70 cursor-pointer"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
