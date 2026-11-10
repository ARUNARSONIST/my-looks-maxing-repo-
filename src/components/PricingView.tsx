import { useState } from 'react';
import { Check } from 'lucide-react';
import type { SafeUser } from '../lib/types';

interface PricingViewProps {
  user: SafeUser | null;
  onSelectTier: (tier: SafeUser['subscriptionTier']) => Promise<void>;
  onOpenAuth: () => void;
}

export function PricingView({ user, onSelectTier, onOpenAuth }: PricingViewProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleChoose = async (tier: SafeUser['subscriptionTier']) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setUpdating(tier);
    setNotice(null);
    try {
      await onSelectTier(tier);
      setNotice(`Membership updated to ${tier}. Cancel or switch anytime.`);
    } finally {
      setUpdating(null);
    }
  };

  const tiers: Array<{
    name: SafeUser['subscriptionTier'];
    audience: string;
    price: string;
    cadence: string;
    features: string[];
  }> = [
    {
      name: 'Free',
      audience: 'For starting sustainable daily habits',
      price: '$0',
      cadence: 'Forever free',
      features: [
        'Personalized 30/60/90-day onboarding blueprint',
        '8 core routine modules (Skin, Hair, Grooming, Fitness, Nutrition, Posture, Style, Confidence)',
        'Daily habit checklist & Readiness Score tracking',
        'Private progress timeline & free expert guides',
      ],
    },
    {
      name: 'Monthly Premium',
      audience: 'For structured 90-day accountability',
      price: '$19',
      cadence: 'per month · cancel anytime',
      features: [
        'Everything in Free plus full 90-day transformation roadmap',
        'AI wardrobe & dating-profile photo lighting feedback (consent-based)',
        'Downloadable plan export & barber/stylist consultation checklist',
        'Weekly coach feedback prompts & accountability Q&A',
      ],
    },
    {
      name: 'Annual Premium',
      audience: 'For year-round style & performance',
      price: '$149',
      cadence: 'per year (35% annual savings)',
      features: [
        'All Monthly Premium features unlocked for 12 months',
        'Priority advisory Q&A & seasonal capsule wardrobe refreshes',
        'Coach marketplace member discount (1-on-1 wardrobe & posture sessions)',
        'Zero penalty pause or Take-a-Break mode anytime',
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">Transparent Membership & Coach Access</p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Simple plans, zero dark-pattern lock-in
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Every core safety tool, daily habit tracker, and routine baseline stays accessible on Free. Cancel or switch
          tiers anytime.
        </p>
      </div>

      {notice && (
        <div className="rounded-lg border border-teal-500/40 bg-teal-500/10 p-4 text-sm text-teal-800 dark:text-teal-300">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const isCurrent = user?.subscriptionTier === tier.name;
          return (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-xl border p-6 space-y-6 ${
                tier.name === 'Annual Premium'
                  ? 'border-amber-500/50 bg-white dark:bg-[#14171C]'
                  : 'border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C]'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{tier.audience}</p>
                  <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
                    {tier.name}
                  </h2>
                </div>
                <div>
                  <span className="font-mono-tabular text-4xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                    {tier.price}
                  </span>
                  <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{tier.cadence}</span>
                </div>
                <ul className="space-y-2.5 border-t border-stone-200 dark:border-zinc-800 pt-4 text-sm text-zinc-700 dark:text-zinc-300">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent || updating === tier.name}
                onClick={() => handleChoose(tier.name)}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold cursor-pointer ${
                  isCurrent
                    ? 'border border-teal-500/40 text-teal-700 dark:text-teal-400 cursor-default'
                    : 'bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-zinc-950'
                }`}
              >
                {isCurrent ? 'Current Plan' : updating === tier.name ? 'Updating...' : `Select ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
