import { useEffect, useState } from 'react';
import { Check, Scissors, ShieldCheck } from 'lucide-react';
import type { PersonalizedBlueprint, RoutineDomain } from '../lib/types';
import { generateBlueprint } from '../lib/planEngine';

interface RoutineExplorerProps {
  blueprint: PersonalizedBlueprint | null;
  initialDomain?: RoutineDomain;
  onBuildCustomPlan: () => void;
}

const DOMAINS: RoutineDomain[] = [
  'Skincare',
  'Hair',
  'Grooming',
  'Fitness',
  'Nutrition',
  'Posture',
  'Style',
  'Confidence',
];

const FALLBACK_BLUEPRINT = generateBlueprint({
  ageRange: '25-34',
  genderIdentity: 'Prefer not to say',
  goals: ['Clearer skin', 'Better haircut & style', 'Fitness & strength', 'Posture & mobility', 'Wardrobe & fit'],
  skinType: 'Combination',
  hairType: 'Wavy',
  fitnessExperience: 'Beginner',
  budget: 'Moderate ($30–$90/mo)',
  minutesPerDay: 30,
  gymAccess: 'Dumbbells / Studio',
  sleepHours: '7–8h',
  dietPreference: 'Balanced omnivore',
  sensitivities: '',
  medicalConditions: '',
  culturalPreferences: '',
  currentSkincare: '',
  currentGrooming: '',
  stylePreference: 'Smart-Casual',
  photoConsent: false,
});

export function RoutineExplorer({ blueprint, initialDomain, onBuildCustomPlan }: RoutineExplorerProps) {
  const [activeDomain, setActiveDomain] = useState<RoutineDomain>(initialDomain || 'Skincare');

  useEffect(() => {
    if (initialDomain) {
      setActiveDomain(initialDomain);
    }
  }, [initialDomain]);

  const activePlan = blueprint || FALLBACK_BLUEPRINT;
  const activeModule = activePlan.routines.find((r) => r.domain === activeDomain) || activePlan.routines[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Modular Routine Library · {blueprint ? 'Personalized to your blueprint' : 'Standard reference protocol'}
          </p>
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
            Daily & weekly coaching protocols
          </h1>
        </div>
        {!blueprint && (
          <button
            type="button"
            onClick={onBuildCustomPlan}
            className="self-start rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            Personalize This Plan
          </button>
        )}
      </div>

      {/* Domain Selector Tabs */}
      <div role="tablist" aria-label="Routine areas" className="flex flex-wrap gap-2">
        {DOMAINS.map((domain) => {
          const selected = domain === activeDomain;
          return (
            <button
              key={domain}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveDomain(domain)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selected
                  ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                  : 'border border-stone-300 dark:border-zinc-800 bg-white dark:bg-[#14171C] text-zinc-700 dark:text-zinc-300 hover:border-teal-500/60'
              }`}
            >
              {domain}
            </button>
          );
        })}
      </div>

      {/* Active Routine Detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-zinc-800 pb-4">
            <p className="text-xs font-medium text-amber-800 dark:text-[#E5BE6E]">
              {activeModule.domain} · {activeModule.priority} Priority
            </p>
            <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              {activeModule.domain} Protocol
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{activeModule.summary}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">Morning Steps</h3>
              <ul className="space-y-2.5">
                {activeModule.morningSteps.map((stepText) => (
                  <li key={stepText} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                    <span>{stepText}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">Evening / Session Steps</h3>
              <ul className="space-y-2.5">
                {activeModule.eveningOrSessionSteps.map((stepText) => (
                  <li key={stepText} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                    <span>{stepText}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-zinc-800 pt-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">Weekly Maintenance Actions</h3>
            <ul className="space-y-2">
              {activeModule.weeklyActions.map((act) => (
                <li key={act} className="text-sm text-zinc-600 dark:text-zinc-400">
                  · {act}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-50/70 dark:bg-[#0D0F12] p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-amber-700 dark:text-[#E5BE6E] mt-0.5" />
            <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{activeModule.safetyNote}</p>
          </div>
        </div>

        {/* Right Sidebar: Product Categories + Barber/Stylist Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Suggested Categories
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Brand-agnostic essentials aligned to your routine—avoid overspending on hype.
            </p>
            <ul className="divide-y divide-stone-200 dark:divide-zinc-800 text-sm">
              {activeModule.productCategories.map((cat) => (
                <li key={cat} className="py-2.5 text-zinc-800 dark:text-zinc-200">
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                Barber & Stylist Checklist
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {activePlan.barberChecklist.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
