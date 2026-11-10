import { useState } from 'react';
import { Eye, EyeOff, Lock, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { EDITORIAL_MEDIA } from '../lib/mediaAssets';
import type { ProgressEntry, SafeUser } from '../lib/types';

interface ProgressTrackerProps {
  user: SafeUser | null;
  entries: ProgressEntry[];
  onEntriesChange: (next: ProgressEntry[]) => void;
  onOpenAuth: () => void;
}

export function ProgressTracker({ user, entries, onEntriesChange, onOpenAuth }: ProgressTrackerProps) {
  const [label, setLabel] = useState('');
  const [chestOrPostureNote, setChestOrPostureNote] = useState('');
  const [waistOrFitNote, setWaistOrFitNote] = useState('');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [notes, setNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [leftId, setLeftId] = useState<string>(entries[1]?.id || entries[0]?.id || '');
  const [rightId, setRightId] = useState<string>(entries[0]?.id || '');

  const leftEntry = entries.find((e) => e.id === leftId) || entries[entries.length - 1];
  const rightEntry = entries.find((e) => e.id === rightId) || entries[0];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setError(null);
    if (!label.trim()) {
      setError('Please enter a milestone label (e.g., Week 4 Check-In).');
      return;
    }
    setSaving(true);
    try {
      const res = await api.addProgressEntry({
        label,
        chestOrPostureNote,
        waistOrFitNote,
        sleepHours,
        photoDataUrl,
        notes,
      });
      onEntriesChange(res.progressEntries);
      setLabel('');
      setChestOrPostureNote('');
      setWaistOrFitNote('');
      setNotes('');
      setPhotoDataUrl(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save progress entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBlur = async (entry: ProgressEntry) => {
    try {
      const res = await api.updateProgressEntry(entry.id, { photoBlurred: !entry.photoBlurred });
      onEntriesChange(res.progressEntries);
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteProgressEntry(id);
      onEntriesChange(res.progressEntries);
    } catch {
      // Ignore
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
          Private Progress Timeline & Side-by-Side Comparison
        </p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Your personal consistency timeline
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          Progress photos are private by default. Results vary based on genetics, consistency, health, and starting
          point. This platform does not guarantee specific physical changes.
        </p>
      </div>

      {/* Side-by-side Comparison */}
      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Side-by-side comparison
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Lock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Private by default · Immediate deletion enabled</span>
          </div>
        </div>

        {entries.length >= 2 && leftEntry && rightEntry ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cmp-left" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Earlier milestone
                </label>
                <select
                  id="cmp-left"
                  value={leftEntry.id}
                  onChange={(e) => setLeftId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                >
                  {entries.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.label} ({ent.date})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cmp-right" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Later milestone
                </label>
                <select
                  id="cmp-right"
                  value={rightEntry.id}
                  onChange={(e) => setRightId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                >
                  {entries.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.label} ({ent.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[leftEntry, rightEntry].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="rounded-lg border border-stone-200 dark:border-zinc-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">{item.label}</p>
                    <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">{item.date}</span>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                    <img
                      src={item.photoDataUrl || (idx === 0 ? EDITORIAL_MEDIA.beforeSkinGrooming : EDITORIAL_MEDIA.skinGrooming)}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover object-top transition-all ${item.photoBlurred ? 'blur-md scale-105' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleBlur(item)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
                    >
                      {item.photoBlurred ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      <span>{item.photoBlurred ? 'Unblur Preview' : 'Blur Photo'}</span>
                    </button>
                  </div>
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <p>Posture: {item.chestOrPostureNote}</p>
                    <p>Wardrobe Fit: {item.waistOrFitNote}</p>
                    <p className="font-mono-tabular">
                      Sleep: {item.sleepHours}h · Streak: {item.streakSnapshot} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Log at least two milestone check-ins below (or sign in as Demo Member) to compare progress side by side.
          </p>
        )}
      </div>

      {/* Add Progress Entry + Timeline */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <form
          onSubmit={handleAddEntry}
          className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
        >
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Add progress check-in
          </h2>

          <div>
            <label htmlFor="prog-label" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Milestone label
            </label>
            <input
              id="prog-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Week 8 Consistency Review"
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="prog-posture" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Posture observation
              </label>
              <input
                id="prog-posture"
                type="text"
                value={chestOrPostureNote}
                onChange={(e) => setChestOrPostureNote(e.target.value)}
                placeholder="e.g., Shoulders relaxed & level"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="prog-fit" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Fit / grooming note
              </label>
              <input
                id="prog-fit"
                type="text"
                value={waistOrFitNote}
                onChange={(e) => setWaistOrFitNote(e.target.value)}
                placeholder="e.g., Tapered jacket fit"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prog-sleep" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Average sleep (hours)
            </label>
            <input
              id="prog-sleep"
              type="number"
              step="0.5"
              min={4}
              max={12}
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="prog-photo" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Optional private photo (stored blurred by default)
            </label>
            <input
              id="prog-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="w-full text-xs text-zinc-600 dark:text-zinc-400"
            />
          </div>

          <div>
            <label htmlFor="prog-notes" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Journal notes
            </label>
            <textarea
              id="prog-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Energy, skin comfort, routine adherence notes..."
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
          >
            {saving ? 'Saving Entry...' : 'Save Private Check-In'}
          </button>
        </form>

        <div className="lg:col-span-7 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Saved Timeline ({entries.length})
          </h2>
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No entries logged yet.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-zinc-800">
              {entries.map((entry) => (
                <div key={entry.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                      {entry.label}{' '}
                      <span className="font-mono-tabular text-xs font-normal text-zinc-500">· {entry.date}</span>
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {entry.chestOrPostureNote} · {entry.waistOrFitNote}
                    </p>
                    {entry.notes && <p className="text-xs text-zinc-700 dark:text-zinc-300">{entry.notes}</p>}
                  </div>
                  {user && (
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      aria-label={`Delete ${entry.label}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
