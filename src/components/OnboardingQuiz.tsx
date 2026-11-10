import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, ShieldAlert } from 'lucide-react';
import type { GoalArea, PersonalizedBlueprint, QuizAnswers, StyleArchetype } from '../lib/types';

interface OnboardingQuizProps {
  initialAnswers?: QuizAnswers | null;
  blueprint: PersonalizedBlueprint | null;
  onGenerateBlueprint: (answers: QuizAnswers) => Promise<void>;
  onOpenDashboard: () => void;
  onOpenRoutines: () => void;
}

const ALL_GOALS: GoalArea[] = [
  'Clearer skin',
  'Better haircut & style',
  'Fitness & strength',
  'Posture & mobility',
  'Wardrobe & fit',
  'Grooming & facial hair',
  'Confidence & presence',
  'Dating-profile photos',
  'Sleep & recovery',
  'Overall glow-up',
];

const STYLE_ARCHETYPES: StyleArchetype[] = [
  'Minimalist',
  'Streetwear',
  'Classic',
  'Athletic',
  'Smart-Casual',
  'Old Money',
  'Techwear',
];

const DEFAULT_ANSWERS: QuizAnswers = {
  ageRange: '25-34',
  genderIdentity: 'Male',
  goals: ['Clearer skin', 'Fitness & strength', 'Wardrobe & fit'],
  skinType: 'Combination',
  hairType: 'Wavy',
  fitnessExperience: 'Beginner',
  budget: 'Moderate ($30–$90/mo)',
  minutesPerDay: 30,
  gymAccess: 'Dumbbells / Studio',
  sleepHours: '7–8h',
  dietPreference: 'High-protein',
  sensitivities: '',
  medicalConditions: '',
  culturalPreferences: '',
  currentSkincare: '',
  currentGrooming: '',
  stylePreference: 'Smart-Casual',
  photoConsent: false,
};

export function OnboardingQuiz({
  initialAnswers,
  blueprint,
  onGenerateBlueprint,
  onOpenDashboard,
  onOpenRoutines,
}: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers || DEFAULT_ANSWERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBlueprintResult, setShowBlueprintResult] = useState(Boolean(blueprint));

  const toggleGoal = (goal: GoalArea) => {
    setAnswers((prev) => {
      const exists = prev.goals.includes(goal);
      const nextGoals = exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      return { ...prev, goals: nextGoals };
    });
  };

  const handleSubmit = async () => {
    setError(null);
    if (answers.goals.length === 0) {
      setError('Please select at least one glow-up goal before generating your plan.');
      return;
    }
    setLoading(true);
    try {
      await onGenerateBlueprint(answers);
      setShowBlueprintResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!blueprint) return;
    const text = [
      `APEX GLOW — ${blueprint.headline}`,
      `Generated: ${new Date(blueprint.createdAt).toLocaleDateString()}`,
      `Glow-Up Readiness Score: ${blueprint.readinessScore}/100 (Habit readiness — not an attractiveness score)`,
      '',
      'TOP PRIORITIES:',
      ...blueprint.topPriorities.map((p, i) => `${i + 1}. ${p}`),
      '',
      '30 / 60 / 90-DAY PHASES:',
      ...blueprint.phases.flatMap((ph) => [
        `${ph.phase}: ${ph.focus}`,
        ...ph.weeklyTargets.map((t) => `  - ${t}`),
      ]),
      '',
      'BARBER & STYLIST CHECKLIST:',
      ...blueprint.barberChecklist.map((b) => `- ${b}`),
      '',
      `REALISTIC EXPECTATIONS: ${blueprint.realisticExpectations}`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apex-glow-blueprint.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showBlueprintResult && blueprint) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">Personalized 30/60/90-Day Blueprint</p>
            <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
              {blueprint.headline}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{blueprint.summary}</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowBlueprintResult(false)}
              className="rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              Retake Quiz
            </button>
            <button
              type="button"
              onClick={handleDownloadPlan}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export Plan</span>
            </button>
            <button
              type="button"
              onClick={onOpenDashboard}
              className="rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-5 py-2 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
            >
              Open Daily Dashboard
            </button>
          </div>
        </div>

        {blueprint.medicalReferralNotice && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/25 p-4 text-sm text-zinc-800 dark:text-amber-100 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
            <p>{blueprint.medicalReferralNotice}</p>
          </div>
        )}

        {/* Readiness Score & Top Priorities */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Glow-Up Readiness Score · Habit Index
            </p>
            <p className="font-mono-tabular text-5xl font-semibold text-teal-600 dark:text-teal-400">
              {blueprint.readinessScore}
              <span className="text-lg text-zinc-500 dark:text-zinc-400">/100</span>
            </p>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Calculated from sleep, consistency, skincare adherence, grooming, training, and wardrobe habits—never an
              attractiveness rating.
            </p>
          </div>

          <div className="lg:col-span-8 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Immediate Top Priorities
            </h2>
            <ul className="space-y-3">
              {blueprint.topPriorities.map((priority, i) => (
                <li key={priority} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="font-mono-tabular text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                    0{i + 1}.
                  </span>
                  <span>{priority}</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-stone-200 dark:border-zinc-800 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
              {blueprint.realisticExpectations}
            </p>
          </div>
        </div>

        {/* 30 / 60 / 90-Day Phases */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blueprint.phases.map((phase) => (
            <div
              key={phase.phase}
              className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
            >
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">{phase.phase}</h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{phase.focus}</p>
              <ul className="space-y-2 border-t border-stone-200 dark:border-zinc-800 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
                {phase.weeklyTargets.map((target) => (
                  <li key={target} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                    <span>{target}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs font-medium text-amber-800 dark:text-[#E5BE6E]">{phase.expectedOutcome}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6">
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Explore your 8 modular routines
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Skincare, Hair, Grooming, Fitness, Nutrition, Posture, Style, and Confidence protocols generated for you.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRoutines}
            className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            View All 8 Routines
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-stone-200 dark:border-zinc-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Step {step} of 4 · Personalization Builder
          </p>
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
            Build your 30/60/90-day Glow-Up Blueprint
          </h1>
        </div>
        {blueprint && (
          <button
            type="button"
            onClick={() => setShowBlueprintResult(true)}
            className="text-sm font-medium text-teal-700 dark:text-teal-400 underline underline-offset-4 cursor-pointer self-start"
          >
            View Saved Blueprint
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 sm:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quiz-age" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Age range
                </label>
                <select
                  id="quiz-age"
                  value={answers.ageRange}
                  onChange={(e) => setAnswers({ ...answers, ageRange: e.target.value as QuizAnswers['ageRange'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  <option value="under-18">Under 18 (Protected Youth Safety Mode)</option>
                  <option value="18-24">18–24</option>
                  <option value="25-34">25–34</option>
                  <option value="35-44">35–44</option>
                  <option value="45+">45+</option>
                </select>
              </div>

              <div>
                <label htmlFor="quiz-gender" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Gender identity (for grooming & tailoring)
                </label>
                <input
                  id="quiz-gender"
                  type="text"
                  value={answers.genderIdentity}
                  onChange={(e) => setAnswers({ ...answers, genderIdentity: e.target.value })}
                  placeholder="e.g., Male, Female, Non-binary"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {answers.ageRange === 'under-18' && (
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4 text-sm text-zinc-800 dark:text-zinc-200">
                Youth Safety Active: Your plan focuses strictly on gentle cleansing, sunscreen, posture, balanced sleep,
                and clean style fit. Medical and cosmetic procedure content is restricted.
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                Select your main goals (pick 1 or more)
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ALL_GOALS.map((goal) => {
                  const active = answers.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                        active
                          ? 'border-teal-500 bg-teal-500/10 font-semibold text-teal-800 dark:text-teal-300'
                          : 'border-stone-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-stone-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      <span>{goal}</span>
                      {active && <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="quiz-skin" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Skin type
                </label>
                <select
                  id="quiz-skin"
                  value={answers.skinType}
                  onChange={(e) => setAnswers({ ...answers, skinType: e.target.value as QuizAnswers['skinType'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-hair" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Hair type
                </label>
                <select
                  id="quiz-hair"
                  value={answers.hairType}
                  onChange={(e) => setAnswers({ ...answers, hairType: e.target.value as QuizAnswers['hairType'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Straight', 'Wavy', 'Curly', 'Coily', 'Short / Buzz', 'Thinning / Fine'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-sleep" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Typical sleep
                </label>
                <select
                  id="quiz-sleep"
                  value={answers.sleepHours}
                  onChange={(e) => setAnswers({ ...answers, sleepHours: e.target.value as QuizAnswers['sleepHours'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Under 6h', '6–7h', '7–8h', '8h+'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quiz-curr-skin" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Current skincare products
                </label>
                <input
                  id="quiz-curr-skin"
                  type="text"
                  value={answers.currentSkincare}
                  onChange={(e) => setAnswers({ ...answers, currentSkincare: e.target.value })}
                  placeholder="e.g., Cleanser only, none yet"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label htmlFor="quiz-curr-groom" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Current shaving / hair / beard routine
                </label>
                <input
                  id="quiz-curr-groom"
                  type="text"
                  value={answers.currentGrooming}
                  onChange={(e) => setAnswers({ ...answers, currentGrooming: e.target.value })}
                  placeholder="e.g., Electric trimmer weekly, matte clay"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quiz-fitness" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Fitness experience
                </label>
                <select
                  id="quiz-fitness"
                  value={answers.fitnessExperience}
                  onChange={(e) => setAnswers({ ...answers, fitnessExperience: e.target.value as QuizAnswers['fitnessExperience'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Beginner', 'Intermediate', 'Consistent'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-gym" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Training environment
                </label>
                <select
                  id="quiz-gym"
                  value={answers.gymAccess}
                  onChange={(e) => setAnswers({ ...answers, gymAccess: e.target.value as QuizAnswers['gymAccess'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Home / Bodyweight', 'Dumbbells / Studio', 'Full Gym'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-budget" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Monthly routine budget
                </label>
                <select
                  id="quiz-budget"
                  value={answers.budget}
                  onChange={(e) => setAnswers({ ...answers, budget: e.target.value as QuizAnswers['budget'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {['Budget ($0–$30/mo)', 'Moderate ($30–$90/mo)', 'Flexible ($90+/mo)'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-time" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Daily time available
                </label>
                <select
                  id="quiz-time"
                  value={answers.minutesPerDay}
                  onChange={(e) => setAnswers({ ...answers, minutesPerDay: Number(e.target.value) as QuizAnswers['minutesPerDay'] })}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {[15, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>{m} minutes / day</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quiz-sensitivities" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Skin sensitivities / allergies
                </label>
                <input
                  id="quiz-sensitivities"
                  type="text"
                  value={answers.sensitivities}
                  onChange={(e) => setAnswers({ ...answers, sensitivities: e.target.value })}
                  placeholder="e.g., Fragrance allergy, eczema-prone"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label htmlFor="quiz-cultural" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Cultural / religious grooming preferences
                </label>
                <input
                  id="quiz-cultural"
                  type="text"
                  value={answers.culturalPreferences}
                  onChange={(e) => setAnswers({ ...answers, culturalPreferences: e.target.value })}
                  placeholder="Optional (e.g., keep beard full, modest wardrobe)"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
                Select your target wardrobe aesthetic
              </p>
              <div className="flex flex-wrap gap-2">
                {STYLE_ARCHETYPES.map((arch) => {
                  const selected = answers.stylePreference === arch;
                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => setAnswers({ ...answers, stylePreference: arch })}
                      className={`rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                        selected
                          ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                          : 'border border-stone-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {arch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="quiz-diet" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
                Nutrition preference (no crash diets)
              </label>
              <select
                id="quiz-diet"
                value={answers.dietPreference}
                onChange={(e) => setAnswers({ ...answers, dietPreference: e.target.value as QuizAnswers['dietPreference'] })}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
              >
                {['Balanced omnivore', 'High-protein', 'Vegetarian', 'Vegan', 'Halal / Kosher / Cultural'].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-[#0D0F12] p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.photoConsent}
                  onChange={(e) => setAnswers({ ...answers, photoConsent: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-teal-600"
                />
                <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Optional: Allow private, non-diagnostic AI presentation feedback on photos I choose to upload. I
                  understand Apex Glow does not give medical diagnoses or attractiveness scores, and I can delete any
                  photo immediately.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between border-t border-stone-200 dark:border-zinc-800 pt-6">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-6 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Generating Blueprint...' : 'Generate My Blueprint'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
