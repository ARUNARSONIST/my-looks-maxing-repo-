import { X } from 'lucide-react';
import { CRISIS_AND_WELLBEING_RESOURCES } from '../lib/safety';

export type LegalTopic = 'terms' | 'privacy' | 'photo' | 'medical' | 'contact' | 'crisis' | null;

interface LegalModalProps {
  topic: LegalTopic;
  onClose: () => void;
}

const TOPIC_COPY: Record<Exclude<LegalTopic, null>, { title: string; body: string[] }> = {
  terms: {
    title: 'Terms of Service',
    body: [
      'Apex Glow provides educational personal-style, skincare-habit, grooming, fitness, posture, and confidence coaching.',
      'By using the platform, you agree to uphold our non-harassment standard: no attractiveness rating, shaming, or unsafe procedural advice.',
      'Subscriptions may be canceled anytime from your Account Settings.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only the profile, routine, and check-in preferences you provide to generate your plan.',
      'We never sell biometric data, facial geometry, or personal photographs to third parties or advertisers.',
      'You may export all account data in JSON format or permanently delete your account at any time.',
    ],
  },
  photo: {
    title: 'Photo & Data Policy',
    body: [
      'All progress photos are private by default and stored solely for your personal comparison timeline.',
      'AI presentation feedback requires explicit consent prior to submission and focuses strictly on lighting, framing, grooming, posture, and wardrobe fit.',
      'Community uploads automatically enable face blur by default and can be removed immediately by the author.',
    ],
  },
  medical: {
    title: 'Medical & Professional Care Disclaimer',
    body: [
      'Apex Glow is not a medical provider and does not diagnose, treat, cure, or prevent any skin, hair, hormonal, or orthopedic condition.',
      'For persistent acne, hair loss, moles, scarring, prescription medications, supplements, or cosmetic procedures, consult a board-certified dermatologist or licensed physician.',
      'Never follow unverified viral practices such as bonesmashing, unregulated injectables, steroid misuse, or extreme caloric restriction.',
    ],
  },
  contact: {
    title: 'Contact & Safety Team',
    body: [
      'General Coaching & Support: support@apexglow.app',
      'Trust, Safety & Moderation Reports: safety@apexglow.app',
      'Press & Advisory Board Inquiries: editorial@apexglow.app',
    ],
  },
  crisis: {
    title: 'Crisis & Body-Image Support Resources',
    body: [
      'Your worth is never measured by a mirror, photo, or metric. If appearance stress, anxiety, or low mood feels heavy, free confidential support is available right now.',
      'Use our built-in "Take a Break" mode inside your Dashboard or Account Settings anytime to pause streaks and notifications.',
    ],
  },
};

export function LegalModal({ topic, onClose }: LegalModalProps) {
  if (!topic) return null;
  const content = TOPIC_COPY[topic];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-4">
          <h2 id="legal-modal-title" className="font-editorial text-2xl font-semibold text-zinc-900 dark:text-[#F4F2ED]">
            {content.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {topic === 'crisis' && (
            <div className="mt-4 space-y-2 border-t border-stone-200 dark:border-zinc-800 pt-4">
              {CRISIS_AND_WELLBEING_RESOURCES.map((item) => (
                <div key={item.label} className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                  <p className="font-semibold text-zinc-900 dark:text-[#F4F2ED]">{item.label}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
