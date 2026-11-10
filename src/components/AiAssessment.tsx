import { useState } from 'react';
import { Camera, MessageSquare, ShieldAlert, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { assessSafetyQuery } from '../lib/safety';
import type { AssessmentResponse, QuizAnswers, SafeUser } from '../lib/types';

interface AiAssessmentProps {
  user: SafeUser | null;
  quizAnswers: QuizAnswers | null;
}

export function AiAssessment({ user, quizAnswers }: AiAssessmentProps) {
  const [notes, setNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(Boolean(user?.photoConsent));
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    (AssessmentResponse & { supportLinks?: Array<{ label: string; detail: string }> }) | null
  >(null);

  // Coach Q&A state
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [coachResponse, setCoachResponse] = useState<{
    blocked: boolean;
    reply: string;
    supportLinks?: Array<{ label: string; detail: string }>;
  } | null>(null);

  const liveSafety = assessSafetyQuery(notes);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid PNG or JPG image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        setImagePreviewUrl(dataUrl);
        setImageBase64(dataUrl.slice(commaIdx + 1));
        setImageMimeType(file.type);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setImageBase64(undefined);
    setImageMimeType(undefined);
    setImagePreviewUrl(undefined);
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (imageBase64 && !consentGiven) {
      setError('Please confirm explicit photo analysis consent before submitting an image.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.runAiAssessment({
        notes:
          notes.trim() ||
          'Evaluate natural lighting, camera framing, haircut suitability, posture cues, and smart-casual fit.',
        goals: quizAnswers?.goals || ['Clearer skin', 'Wardrobe & fit', 'Posture & mobility'],
        stylePreference: quizAnswers?.stylePreference || 'Smart-Casual',
        consentGiven,
        imageBase64,
        imageMimeType,
        isUnder18: user?.isUnder18,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoachError(null);
    if (!coachQuestion.trim()) {
      setCoachError('Please enter a question for the coach.');
      return;
    }
    setCoachLoading(true);
    try {
      const res = await api.askCoach({
        message: coachQuestion,
        stylePreference: quizAnswers?.stylePreference || 'Smart-Casual',
        consentGiven,
        isUnder18: user?.isUnder18,
      });
      setCoachResponse(res);
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'Unable to reach AI coach.');
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
          Non-Diagnostic AI Style & Presentation Review
        </p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Lighting, framing, grooming & outfit assessment
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          Upload an optional photo with explicit consent or describe your current routine. We never score facial
          attractiveness or diagnose medical conditions—feedback focuses on controllable lighting, grooming, posture,
          and garment fit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Assessment Input Form */}
        <form
          onSubmit={handleRunAssessment}
          className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-6"
        >
          <div className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Photo & presentation guidelines
            </h2>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Recommended framing: front-facing, side profile, or full-body photo · neutral relaxed expression · soft
              natural window light · zero filters. Photos are processed only for this session and never sold.
            </p>
          </div>

          {/* Optional Photo Upload */}
          <div className="space-y-3">
            <label
              htmlFor="assessment-photo-input"
              className="flex items-center justify-between rounded-lg border border-dashed border-stone-300 dark:border-zinc-700 p-4 cursor-pointer hover:border-teal-500/60"
            >
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {imagePreviewUrl ? 'Replace optional photo' : 'Upload optional photo (JPG / PNG)'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Private session only — clear immediately at any time
                  </p>
                </div>
              </div>
              <input
                id="assessment-photo-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </label>

            {imagePreviewUrl && (
              <div className="flex items-center justify-between rounded-lg border border-stone-200 dark:border-zinc-800 p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded presentation preview"
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Photo attached privately</span>
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Delete uploaded photo immediately"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div>
            <label htmlFor="assessment-notes" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
              What would you like feedback on?
            </label>
            <textarea
              id="assessment-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: Check my smart-casual overshirt fit, wavy hair volume, and window lighting for a natural portrait."
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Real-Time Safety Guardrail Alert */}
          {!liveSafety.allowProceed && (
            <div
              role="alert"
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 space-y-2 text-sm text-zinc-900 dark:text-amber-100"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{liveSafety.headline}</span>
              </div>
              <p className="text-xs leading-relaxed">{liveSafety.guidance}</p>
            </div>
          )}

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-[#0D0F12] p-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-teal-600"
            />
            <span className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              I consent to AI presentation feedback and understand Apex Glow provides non-medical guidance only (no
              attractiveness ratings or diagnostic claims).
            </span>
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Analyzing Presentation...' : 'Run Non-Diagnostic AI Assessment'}
          </button>
        </form>

        {/* Results & Outfit Coach */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-5">
              {result.safetyBanner && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-zinc-900 dark:text-amber-100">
                  {result.safetyBanner}
                </div>
              )}

              <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Assessment Summary</p>
                  <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
                    {result.headline}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{result.readinessFocus.label}</p>
                  <p className="font-mono-tabular text-2xl font-semibold text-teal-600 dark:text-teal-400">
                    {result.readinessFocus.score}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Lighting & Framing</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.photoQualityAndLighting}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Grooming & Hairstyle Fit</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.groomingAndHairstyleFit}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Posture & Outfit Fit</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.postureAndOutfitFit}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Color Palette</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.colorPaletteNote}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-stone-200 dark:border-zinc-800 pt-4 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-semibold text-teal-700 dark:text-teal-400">Strengths</p>
                  <ul className="mt-1.5 space-y-1 text-zinc-700 dark:text-zinc-300">
                    {result.strengths.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-[#E5BE6E]">Priority Actions</p>
                  <ul className="mt-1.5 space-y-1 text-zinc-700 dark:text-zinc-300">
                    {result.priorityActions.map((a) => (
                      <li key={a}>· {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="border-t border-stone-200 dark:border-zinc-800 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {result.realisticExpectations}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-3">
              <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                What your assessment covers
              </h2>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>· Photo quality, camera angle & natural window lighting</li>
                <li>· Haircut proportion & clean beard/brow grooming cues</li>
                <li>· Shoulder alignment, posture carriage & collar/sleeve fit</li>
                <li>· Strengths, next-step weekly actions & realistic timelines</li>
              </ul>
            </div>
          )}

          {/* AI Style & Routine Coach */}
          <form
            onSubmit={handleAskCoach}
            className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                AI Style & Habit Coach
              </h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                aria-label="Ask the AI style and habit coach"
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="Ask about capsule outfits, barber scripts, or evening posture resets..."
                className="flex-1 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={coachLoading}
                className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {coachLoading ? 'Thinking...' : 'Ask Coach'}
              </button>
            </div>
            {coachError && <p className="text-xs text-red-600 dark:text-red-400">{coachError}</p>}
            {coachResponse && (
              <div
                className={`rounded-lg border p-4 text-sm whitespace-pre-line ${
                  coachResponse.blocked
                    ? 'border-amber-500/40 bg-amber-500/10 text-zinc-900 dark:text-amber-100'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-[#0D0F12] text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {coachResponse.reply}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
