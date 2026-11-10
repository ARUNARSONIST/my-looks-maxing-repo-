import { useState } from 'react';
import { Check, Moon, PauseCircle, Sun } from 'lucide-react';
import type { DailyTask, PersonalizedBlueprint, SafeUser, WeeklyCheckIn } from '../lib/types';

interface DailyDashboardProps {
  user: SafeUser | null;
  blueprint: PersonalizedBlueprint | null;
  tasks: DailyTask[];
  weeklyCheckIns: WeeklyCheckIn[];
  darkMode: boolean;
  reducedMotion: boolean;
  onToggleDarkMode: () => void;
  onToggleReducedMotion: () => void;
  onToggleTask: (taskId: string) => Promise<void>;
  onAddCheckIn: (payload: {
    sleepAvgHours: number;
    trainingSessions: number;
    skincareDays: number;
    confidenceRating: number;
    note: string;
  }) => Promise<void>;
  onToggleTakeABreak: () => Promise<void>;
  onOpenProgress: () => void;
  onOpenAuth: () => void;
}

export function DailyDashboard({
  user,
  blueprint,
  tasks,
  weeklyCheckIns,
  darkMode,
  reducedMotion,
  onToggleDarkMode,
  onToggleReducedMotion,
  onToggleTask,
  onAddCheckIn,
  onToggleTakeABreak,
  onOpenProgress,
  onOpenAuth,
}: DailyDashboardProps) {
  const [sleepAvgHours, setSleepAvgHours] = useState(7.5);
  const [trainingSessions, setTrainingSessions] = useState(3);
  const [skincareDays, setSkincareDays] = useState(6);
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const adherencePct = Math.round((completedCount / Math.max(1, tasks.length)) * 100);
  const readinessScore = blueprint?.readinessScore ?? 76;
  const breakdown = blueprint?.readinessBreakdown ?? {
    consistency: 74,
    sleep: 84,
    skincareAdherence: adherencePct,
    grooming: 78,
    training: 75,
    styleHabits: 82,
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await onAddCheckIn({
        sleepAvgHours,
        trainingSessions,
        skincareDays,
        confidenceRating,
        note,
      });
      setNote('');
      setFeedback('Weekly check-in saved.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Unable to save check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Daily Habit & Consistency Dashboard
          </p>
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
            {user ? `Welcome back, ${user.fullName.split(' ')[0]}` : 'Daily Habit Workspace'}
          </h1>
        </div>

        {/* Workspace Controls: Dark/Light, Reduced Motion, Take-a-Break */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleReducedMotion}
            className="rounded-lg border border-stone-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {reducedMotion ? 'Motion: Reduced' : 'Reduce Motion'}
          </button>

          <button
            type="button"
            onClick={user ? onToggleTakeABreak : onOpenAuth}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              user?.takeABreakMode
                ? 'bg-amber-500 text-zinc-950'
                : 'border border-amber-500/40 text-amber-800 dark:text-[#E5BE6E] hover:bg-amber-500/10'
            }`}
          >
            <PauseCircle className="h-3.5 w-3.5" />
            <span>{user?.takeABreakMode ? 'Take-a-Break Active' : 'Take a Break Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenProgress}
            className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            Progress Photos & Timeline
          </button>
        </div>
      </div>

      {user?.takeABreakMode && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-zinc-800 dark:text-amber-100">
          Take-a-Break Mode is active. Streak pressure and reminders are paused—rest, step away from mirrors or screens,
          and resume whenever you feel ready.
        </div>
      )}

      {!user && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Preview mode: Sign in or use the Demo Member login to save task streaks and weekly check-ins permanently.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="self-start rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            Sign In / Demo Member
          </button>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Glow-Up Readiness Score</p>
          <p className="font-mono-tabular text-4xl font-semibold text-teal-700 dark:text-teal-400 mt-1">
            {readinessScore}
            <span className="text-base text-zinc-500">/100</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Habits & consistency index</p>
        </div>

        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Active Routine Streak</p>
          <p className="font-mono-tabular text-4xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
            {user?.streakDays ?? 1} <span className="text-base font-normal text-zinc-500">days</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {user?.takeABreakMode ? 'Paused gently' : 'Steady daily momentum'}
          </p>
        </div>

        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Today’s Adherence</p>
          <p className="font-mono-tabular text-4xl font-semibold text-amber-800 dark:text-[#E5BE6E] mt-1">
            {adherencePct}%
          </p>
          <p className="font-mono-tabular mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {completedCount} of {tasks.length} habits completed
          </p>
        </div>
      </div>

      {/* Main Split: Daily Habit Checklist + Readiness Breakdown / Weekly Check-In */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Today’s Habit Checklist
          </h2>
          <div className="divide-y divide-stone-200 dark:divide-zinc-800">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-pressed={task.completed}
                  className="flex flex-1 items-start gap-3 text-left cursor-pointer group"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      task.completed
                        ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500 dark:text-zinc-950'
                        : 'border-stone-400 dark:border-zinc-600 group-hover:border-teal-500'
                    }`}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    <span
                      className={`block text-sm font-medium ${
                        task.completed
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                      {task.domain} · {task.cadence} · <span className="font-mono-tabular">{task.durationMinutes} min</span>
                      {task.completed ? ' · Completed' : ''}
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Readiness Breakdown */}
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Readiness Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Consistency', val: breakdown.consistency },
                { label: 'Sleep Rhythm', val: breakdown.sleep },
                { label: 'Skincare Adherence', val: breakdown.skincareAdherence },
                { label: 'Grooming & Oral Care', val: breakdown.grooming },
                { label: 'Training & Mobility', val: breakdown.training },
                { label: 'Style & Fit Habits', val: breakdown.styleHabits },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                    <span className="font-mono-tabular text-zinc-600 dark:text-zinc-400">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-teal-600 dark:bg-teal-400"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Check-In Form */}
          <form
            onSubmit={handleCheckInSubmit}
            className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Log Weekly Check-In
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label htmlFor="chk-sleep" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Avg sleep (hrs)
                </label>
                <input
                  id="chk-sleep"
                  type="number"
                  step="0.5"
                  min={4}
                  max={12}
                  value={sleepAvgHours}
                  onChange={(e) => setSleepAvgHours(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-train" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Workouts this week
                </label>
                <input
                  id="chk-train"
                  type="number"
                  min={0}
                  max={7}
                  value={trainingSessions}
                  onChange={(e) => setTrainingSessions(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-skin" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Skincare days (0–7)
                </label>
                <input
                  id="chk-skin"
                  type="number"
                  min={0}
                  max={7}
                  value={skincareDays}
                  onChange={(e) => setSkincareDays(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-conf" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Confidence (1–5)
                </label>
                <input
                  id="chk-conf"
                  type="number"
                  min={1}
                  max={5}
                  value={confidenceRating}
                  onChange={(e) => setConfidenceRating(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="chk-note" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                Reflection note
              </label>
              <input
                id="chk-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What felt easiest to stay consistent with?"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
            {feedback && <p className="text-xs text-teal-600 dark:text-teal-400">{feedback}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save Weekly Check-In'}
            </button>

            {weeklyCheckIns.length > 0 && (
              <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 space-y-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Recent Check-Ins</p>
                {weeklyCheckIns.slice(0, 3).map((chk) => (
                  <div key={chk.id} className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono-tabular font-medium text-zinc-800 dark:text-zinc-200">{chk.date}</span> ·{' '}
                    {chk.sleepAvgHours}h sleep · {chk.trainingSessions} workouts · {chk.note || 'Logged'}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
