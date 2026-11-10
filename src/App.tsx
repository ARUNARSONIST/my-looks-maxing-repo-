import { useEffect, useState } from 'react';
import { Navbar, type AppView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { RoutineExplorer } from './components/RoutineExplorer';
import { AiAssessment } from './components/AiAssessment';
import { DailyDashboard } from './components/DailyDashboard';
import { ProgressTracker } from './components/ProgressTracker';
import { CommunityHub } from './components/CommunityHub';
import { PricingView } from './components/PricingView';
import { AuthAndAccount } from './components/AuthAndAccount';
import { AdminPanel } from './components/AdminPanel';
import { LegalModal, type LegalTopic } from './components/LegalModal';
import { api, getStoredToken, setStoredToken } from './lib/api';
import type {
  DailyTask,
  PersonalizedBlueprint,
  ProgressEntry,
  QuizAnswers,
  RoutineDomain,
  SafeUser,
  UserSession,
  WeeklyCheckIn,
} from './lib/types';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1') {
      return 'dashboard';
    }
    return 'landing';
  });
  const [routineDomain, setRoutineDomain] = useState<RoutineDomain>('Skincare');
  const [legalTopic, setLegalTopic] = useState<LegalTopic>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [user, setUser] = useState<SafeUser | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [blueprint, setBlueprint] = useState<PersonalizedBlueprint | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  const loadWorkspace = async () => {
    try {
      const ws = await api.getWorkspace();
      setBlueprint(ws.blueprint);
      setQuizAnswers(ws.quizAnswers ?? null);
      setDailyTasks(ws.dailyTasks);
      setWeeklyCheckIns(ws.weeklyCheckIns);
      setProgressEntries(ws.progressEntries);
      if (ws.authenticated && ws.user) {
        setUser(ws.user);
        const me = await api.getMe().catch(() => null);
        if (me) setSessions(me.sessions);
      } else {
        setUser(null);
        setSessions([]);
      }
    } catch {
      // Keep default state if backend unavailable
    } finally {
      setWorkspaceLoaded(true);
    }
  };

  useEffect(() => {
    if (getStoredToken()) {
      loadWorkspace();
    } else {
      loadWorkspace();
    }
  }, []);

  const handleNavigate = (view: AppView, domain?: RoutineDomain) => {
    if (domain) {
      setRoutineDomain(domain);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleAuthSuccess = async (token: string, signedInUser: SafeUser) => {
    setStoredToken(token);
    setUser(signedInUser);
    await loadWorkspace();
    setActiveView('dashboard');
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setStoredToken(null);
    setUser(null);
    setSessions([]);
    await loadWorkspace();
    setActiveView('landing');
  };

  const handleGenerateBlueprint = async (answers: QuizAnswers) => {
    const res = await api.generateBlueprint(answers);
    setQuizAnswers(answers);
    setBlueprint(res.blueprint);
    setDailyTasks(res.dailyTasks);
  };

  const handleToggleTask = async (taskId: string) => {
    const target = dailyTasks.find((t) => t.id === taskId);
    if (!target) return;
    if (!user) {
      setDailyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      return;
    }
    const res = await api.toggleTask(taskId, !target.completed);
    setDailyTasks(res.dailyTasks);
    setUser((prev) => (prev ? { ...prev, streakDays: res.streakDays } : prev));
    if (res.blueprint) setBlueprint(res.blueprint);
  };

  const handleAddCheckIn = async (payload: {
    sleepAvgHours: number;
    trainingSessions: number;
    skincareDays: number;
    confidenceRating: number;
    note: string;
  }) => {
    const res = await api.addCheckIn(payload);
    setWeeklyCheckIns(res.weeklyCheckIns);
  };

  const handleToggleTakeABreak = async () => {
    if (!user) return;
    const res = await api.updateProfile({ takeABreakMode: !user.takeABreakMode });
    setUser(res.user);
  };

  const handleSelectTier = async (tier: SafeUser['subscriptionTier']) => {
    const res = await api.updateProfile({ subscriptionTier: tier });
    setUser(res.user);
  };

  const showWorkspaceToolbar = activeView !== 'landing';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#14171A] dark:bg-[#0D0F12] dark:text-[#F4F2ED]">
      <Navbar activeView={activeView} onNavigate={handleNavigate} user={user} />

      {showWorkspaceToolbar && (
        <div className="border-b border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-[#12151A]">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
            {[
              { label: 'Skin', view: 'routines' as AppView, domain: 'Skincare' as RoutineDomain },
              { label: 'Hair', view: 'routines' as AppView, domain: 'Hair' as RoutineDomain },
              { label: 'Style', view: 'routines' as AppView, domain: 'Style' as RoutineDomain },
              { label: 'Fitness', view: 'routines' as AppView, domain: 'Fitness' as RoutineDomain },
              { label: 'Posture', view: 'routines' as AppView, domain: 'Posture' as RoutineDomain },
              { label: 'AI Assessment', view: 'assessment' as AppView },
              { label: 'Progress', view: 'progress' as AppView },
              { label: 'Pricing', view: 'pricing' as AppView },
              ...(user?.role === 'admin' ? [{ label: 'Admin', view: 'admin' as AppView }] : []),
            ].map((item) => {
              const isSelected =
                activeView === item.view && (!item.domain || routineDomain === item.domain);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.view, item.domain)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                      : 'text-zinc-600 hover:bg-stone-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1">
        {!workspaceLoaded ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="h-64 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/50 dark:bg-[#14171C] animate-pulse" />
          </div>
        ) : (
          <>
            {activeView === 'landing' && (
              <LandingPage
                onNavigate={handleNavigate}
                onOpenLegal={setLegalTopic}
                reducedMotion={reducedMotion}
              />
            )}
            {activeView === 'quiz' && (
              <OnboardingQuiz
                initialAnswers={quizAnswers}
                blueprint={blueprint}
                onGenerateBlueprint={handleGenerateBlueprint}
                onOpenDashboard={() => handleNavigate('dashboard')}
                onOpenRoutines={() => handleNavigate('routines')}
              />
            )}
            {activeView === 'routines' && (
              <RoutineExplorer
                blueprint={blueprint}
                initialDomain={routineDomain}
                onBuildCustomPlan={() => handleNavigate('quiz')}
              />
            )}
            {activeView === 'assessment' && <AiAssessment user={user} quizAnswers={quizAnswers} />}
            {activeView === 'dashboard' && (
              <DailyDashboard
                user={user}
                blueprint={blueprint}
                tasks={dailyTasks}
                weeklyCheckIns={weeklyCheckIns}
                darkMode={darkMode}
                reducedMotion={reducedMotion}
                onToggleDarkMode={() => setDarkMode((d) => !d)}
                onToggleReducedMotion={() => setReducedMotion((r) => !r)}
                onToggleTask={handleToggleTask}
                onAddCheckIn={handleAddCheckIn}
                onToggleTakeABreak={handleToggleTakeABreak}
                onOpenProgress={() => handleNavigate('progress')}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'progress' && (
              <ProgressTracker
                user={user}
                entries={progressEntries}
                onEntriesChange={setProgressEntries}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'community' && (
              <CommunityHub user={user} onOpenAuth={() => handleNavigate('auth')} />
            )}
            {activeView === 'pricing' && (
              <PricingView
                user={user}
                onSelectTier={handleSelectTier}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'auth' && (
              <AuthAndAccount
                user={user}
                sessions={sessions}
                onAuthSuccess={handleAuthSuccess}
                onUserUpdate={setUser}
                onLogout={handleLogout}
                onOpenAdmin={() => handleNavigate('admin')}
              />
            )}
            {activeView === 'admin' && <AdminPanel user={user} />}
          </>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-zinc-800 bg-[#EFECE5] dark:bg-[#0A0C0E] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-editorial text-xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">Apex Glow</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Become the most confident, polished version of yourself. Reversible, evidence-informed coaching only.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <button type="button" onClick={() => setLegalTopic('terms')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Terms
            </button>
            <button type="button" onClick={() => setLegalTopic('privacy')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={() => setLegalTopic('photo')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Photo/Data Policy
            </button>
            <button type="button" onClick={() => setLegalTopic('contact')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Contact
            </button>
            <button type="button" onClick={() => setLegalTopic('medical')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Medical Disclaimer
            </button>
            <button
              type="button"
              onClick={() => setLegalTopic('crisis')}
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Crisis Support
            </button>
          </div>
        </div>
      </footer>

      <LegalModal topic={legalTopic} onClose={() => setLegalTopic(null)} />
    </div>
  );
}
