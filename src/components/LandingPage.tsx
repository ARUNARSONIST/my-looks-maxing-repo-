import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import {
  FAQ_ITEMS,
  REPRESENTATIVE_JOURNEYS,
  ROTATING_FOCUS_ITEMS,
} from '../lib/mediaAssets';
import type { RoutineDomain } from '../lib/types';
import type { AppView } from './Navbar';
import type { LegalTopic } from './LegalModal';

interface LandingPageProps {
  onNavigate: (view: AppView, domain?: RoutineDomain) => void;
  onOpenLegal: (topic: LegalTopic) => void;
  reducedMotion: boolean;
}

const DOMAIN_LINK_MAP: Record<string, RoutineDomain> = {
  Skin: 'Skincare',
  Hair: 'Hair',
  Grooming: 'Grooming',
  Fitness: 'Fitness',
  Style: 'Style',
  Posture: 'Posture',
  Sleep: 'Confidence',
  Confidence: 'Confidence',
};

export function LandingPage({ onNavigate, onOpenLegal, reducedMotion }: LandingPageProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [heroJourneyIdx, setHeroJourneyIdx] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % ROTATING_FOCUS_ITEMS.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const activeFocus = ROTATING_FOCUS_ITEMS[focusIndex];
  const heroJourney = REPRESENTATIVE_JOURNEYS[heroJourneyIdx] || REPRESENTATIVE_JOURNEYS[0];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <p className="text-sm font-medium tracking-wide text-teal-700 dark:text-teal-400">
              Evidence-informed coaching · Skincare · Grooming · Style · Fitness
            </p>

            <h1 className="font-editorial text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-950 dark:text-[#F4F2ED] sm:text-5xl lg:text-[3.5rem] [text-wrap:balance]">
              Look sharper. Feel stronger. Build a routine that actually lasts.
            </h1>

            <p className="text-lg font-medium text-amber-800 dark:text-[#E5BE6E] [text-wrap:balance]">
              “Your glow-up should make you feel more like yourself—not less.”
            </p>

            <p className="max-w-xl text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              Personalized skincare, grooming, fitness, style, and confidence plans designed around your goals—not
              unrealistic standards. Reversible, low-risk habits built for your real schedule and budget.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-950 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Build My Personalized Glow-Up Plan</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-stone-300 dark:border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-200/60 dark:hover:bg-zinc-800/70 transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex h-full flex-col justify-between rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    Before & After Routine Result
                  </p>
                  <p className="font-editorial text-xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                    {heroJourney.title}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {REPRESENTATIVE_JOURNEYS.map((j, idx) => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setHeroJourneyIdx(idx)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                        heroJourneyIdx === idx
                          ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                          : 'border border-stone-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-teal-500/60'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <figure className="space-y-1.5">
                  <figcaption className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Before · Day 1
                  </figcaption>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 dark:border-zinc-800 bg-zinc-900">
                    <img
                      src={heroJourney.beforeImage}
                      alt={heroJourney.beforeImageAlt}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </figure>

                <figure className="space-y-1.5">
                  <figcaption className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    After · {heroJourney.timeframe.split('·')[0].trim()}
                  </figcaption>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-teal-500/40 bg-zinc-900">
                    <img
                      src={heroJourney.afterImage}
                      alt={heroJourney.afterImageAlt}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </figure>
              </div>

              <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 space-y-1">
                <p className="font-mono-tabular text-xs text-amber-800 dark:text-[#E5BE6E]">
                  {heroJourney.dashboardCopy}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {heroJourney.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Safety Banner */}
        <div className="mt-8 rounded-xl border border-amber-600/30 dark:border-amber-500/25 bg-amber-50/70 dark:bg-[#14171C] px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-[#E5BE6E]" />
              <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                Apex Glow focuses on sustainable, reversible improvements. We do not provide medical diagnosis or
                encourage unsafe procedures. For skin, hair, medications, or cosmetic treatments, consult a qualified
                professional.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLegal('medical')}
              className="self-start sm:self-center text-xs font-semibold text-teal-700 dark:text-teal-400 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Read Safety Standard
            </button>
          </div>
        </div>
      </section>

      {/* 2. ROTATING GLOW-UP FOCUS & QUICK DOMAIN LAUNCHER */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-stone-200 dark:border-zinc-800 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl">
                Eight reversible pillars, one cohesive plan
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                Select any focus area to preview what your 30/60/90-day routine builds—then open its full protocol.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('assessment')}
              className="self-start rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-200/70 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              Try AI Presentation Check
            </button>
          </div>

          {/* Segmented Interactive Focus Tabs */}
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Glow-up focus pillars">
            {ROTATING_FOCUS_ITEMS.map((item, idx) => {
              const selected = idx === focusIndex;
              return (
                <button
                  key={item.area}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFocusIndex(idx)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                      : 'border border-stone-300 dark:border-zinc-800 bg-white dark:bg-[#14171C] text-zinc-700 dark:text-zinc-300 hover:border-teal-500/60'
                  }`}
                >
                  {item.area}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-2">
              <p className="text-xs font-semibold tracking-wide text-teal-700 dark:text-teal-400">
                0{focusIndex + 1}. {activeFocus.area} Focus
              </p>
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                {activeFocus.headline}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{activeFocus.detail}</p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('routines', DOMAIN_LINK_MAP[activeFocus.area])}
                className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
              >
                Explore {activeFocus.area} Routine
              </button>
              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                Personalize Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ILLUSTRATIVE BEFORE & AFTER JOURNEYS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-stone-200 dark:border-zinc-800 pt-12">
          <div className="max-w-3xl">
            <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl">
              Representative before & after transformations
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Illustrative side-by-side examples showing what 6–12 weeks of consistent, reversible daily habits look like
              inside Apex Glow—never extreme claims or fake guarantees.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {REPRESENTATIVE_JOURNEYS.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5 space-y-4"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <figure className="space-y-1">
                    <figcaption className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Before
                    </figcaption>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                      <img
                        src={item.beforeImage}
                        alt={item.beforeImageAlt}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </figure>
                  <figure className="space-y-1">
                    <figcaption className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                      After
                    </figcaption>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                      <img
                        src={item.afterImage}
                        alt={item.afterImageAlt}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </figure>
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.timeframe}</p>
                    <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                      {item.title}
                    </h3>
                    <div className="space-y-2 border-t border-stone-200 dark:border-zinc-800 pt-3 text-sm">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-200">Before: </span>
                        {item.beforeSummary}
                      </p>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        <span className="font-semibold text-teal-700 dark:text-teal-400">After: </span>
                        {item.afterSummary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-stone-200 dark:border-zinc-800 pt-3">
                    <p className="font-mono-tabular text-xs text-amber-800 dark:text-[#E5BE6E]">{item.dashboardCopy}</p>
                    <p className="text-[11px] leading-normal text-zinc-500 dark:text-zinc-400">{item.disclaimer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST PILLARS & PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-t border-stone-200 dark:border-zinc-800 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Built with clinical & ethical guardrails
            </h2>
            <div className="divide-y divide-stone-200 dark:divide-zinc-800 border-y border-stone-200 dark:border-zinc-800">
              {[
                {
                  title: 'Privacy-first photo controls',
                  desc: 'Progress photos stay private by default, face blur is active in community feeds, and you can delete any photo immediately.',
                },
                {
                  title: 'No crash diets or extreme fasting',
                  desc: 'Nutrition guidance focuses on protein adequacy, hydration, and colorful produce—never severe caloric deprivation.',
                },
                {
                  title: 'No unsafe procedures',
                  desc: 'Zero tolerance for bonesmashing, steroids, SARMs, or unregulated injectables. Medical topics route directly to licensed care.',
                },
                {
                  title: 'Evidence-informed guidance & cancel anytime',
                  desc: 'Clear expectations, Readiness Score tracking (never facial ratings), and one-click Take-a-Break pause mode.',
                },
              ].map((trust, idx) => (
                <div key={trust.title} className="py-4">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                    0{idx + 1}. {trust.title}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{trust.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-[#E5BE6E]">Membership & Coaching</p>
              <h3 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                Start free. Upgrade only if you want deeper tools.
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Your 30/60/90-day plan, daily habit dashboard, and core routine library are free. Premium unlocks AI
                wardrobe outfit checks, printable PDF plans, weekly coach reviews, and dating-profile photo lighting feedback.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
              >
                Build My Free Plan
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="rounded-lg border border-stone-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                Compare Tiers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-stone-200 dark:border-zinc-800 pt-12">
          <h2 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-stone-200 dark:divide-zinc-800 border-y border-stone-200 dark:border-zinc-800">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left cursor-pointer py-1"
                  >
                    <span className="text-base font-medium text-zinc-950 dark:text-[#F4F2ED]">{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
