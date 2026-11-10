export type SafetyClassification = 'safe' | 'unsafe_practice' | 'medical_boundary' | 'harassment_or_rating';

export interface SafetyAssessment {
  classification: SafetyClassification;
  matchedTerms: string[];
  headline: string;
  guidance: string;
  supportLinks: Array<{ label: string; detail: string }>;
  allowProceed: boolean;
}

const UNSAFE_PRACTICE_PATTERNS: Array<{ term: string; pattern: RegExp }> = [
  { term: 'bonesmashing', pattern: /\bbone\s*smash(ing|ed|es)?\b/i },
  { term: 'steroids / SARMs', pattern: /\b(steroids?|anabolic|sarms?|trenbolone|testosterone\s*cycle|clenbuterol)\b/i },
  { term: 'unregulated injectables', pattern: /\b(diy\s*filler|unregulated\s*injectable|hyaluron\s*pen|synthol|gray[-\s]?market\s*(peptide|hormone|injectable)|off[-\s]?label\s*hormone)\b/i },
  { term: 'extreme fasting / restriction', pattern: /\b(extreme\s*fast(ing)?|starv(e|ing)|water\s*fast\s*for\s*\d+\s*days|pro\s*ana|purge|purging|800\s*kcal|500\s*kcal)\b/i },
  { term: 'unsafe DIY facial trauma', pattern: /\b(hammer\s*(jaw|cheek)|fracture\s*my\s*(jaw|cheekbone)|diy\s*surgery)\b/i },
];

const MEDICAL_BOUNDARY_PATTERNS: Array<{ term: string; pattern: RegExp }> = [
  { term: 'acne / prescription skin concerns', pattern: /\b(cystic\s*acne|severe\s*acne|acne|isotretinoin|accutane|tretinoin|rosacea|eczema|psoriasis)\b/i },
  { term: 'hair loss / hair medications', pattern: /\b(hair\s*loss|alopecia|receding\s*hairline|finasteride|dutasteride|minoxidil)\b/i },
  { term: 'moles or scarring', pattern: /\b(mole|moles|melanoma|keloid|deep\s*scarring|atrophic\s*scar)\b/i },
  { term: 'cosmetic procedures or injectables', pattern: /\b(botox|dermal\s*filler|filler|rhinoplasty|blepharoplasty|genioplasty|cosmetic\s*surgery|plastic\s*surgery|microneedling\s*depth|injectables?)\b/i },
  { term: 'supplements or medications', pattern: /\b(prescription|medication|hormone\s*therapy|supplement\s*stack)\b/i },
];

const HARASSMENT_OR_RATING_PATTERNS: Array<{ term: string; pattern: RegExp }> = [
  { term: 'ranking or mogging language', pattern: /\b(mogging|mogs|subhuman|truecel|psl\s*score|rate\s*(me|him|her)\s*(out\s*of\s*10|1-10)|canthal\s*tilt\s*fail)\b/i },
  { term: 'appearance shaming', pattern: /\b(ugly\s*face|genetic\s*trash|over\s*for\s*you|ropefuel)\b/i },
];

export const CRISIS_AND_WELLBEING_RESOURCES = [
  {
    label: '988 Suicide & Crisis Lifeline (US & Canada)',
    detail: 'Call or text 988 — free, confidential support 24/7.',
  },
  {
    label: 'Crisis Text Line',
    detail: 'Text HOME to 741741 to connect with a trained crisis counselor.',
  },
  {
    label: 'Body Dysmorphic Disorder Foundation / NEDA',
    detail: 'Evidence-based body-image and eating-concern support resources.',
  },
];

export function assessSafetyQuery(input: string): SafetyAssessment {
  const normalized = (input || '').trim();
  if (!normalized) {
    return {
      classification: 'safe',
      matchedTerms: [],
      headline: 'Safe coaching mode active',
      guidance: 'Focused on reversible, sustainable habits.',
      supportLinks: [],
      allowProceed: true,
    };
  }

  const unsafeMatches = UNSAFE_PRACTICE_PATTERNS.filter((p) => p.pattern.test(normalized)).map((p) => p.term);
  if (unsafeMatches.length > 0) {
    return {
      classification: 'unsafe_practice',
      matchedTerms: unsafeMatches,
      headline: 'Safety Boundary: Unsafe Practices Are Not Supported',
      guidance:
        'Apex Glow never provides instructions for bonesmashing, steroid or hormone misuse, unregulated injectables, or extreme caloric restriction. These practices carry serious injury and health risks. Your appearance and confidence can improve sustainably through safe skincare, grooming, posture, resistance training, and nutrition—and if appearance distress feels overwhelming, please speak with a healthcare professional or support counselor.',
      supportLinks: CRISIS_AND_WELLBEING_RESOURCES,
      allowProceed: false,
    };
  }

  const harassmentMatches = HARASSMENT_OR_RATING_PATTERNS.filter((p) => p.pattern.test(normalized)).map((p) => p.term);
  if (harassmentMatches.length > 0) {
    return {
      classification: 'harassment_or_rating',
      matchedTerms: harassmentMatches,
      headline: 'Community Standard: No Rating, Ranking, or Shaming',
      guidance:
        'Apex Glow rejects attractiveness scoring, ranking people against one another, and shaming terminology. Our platform tracks controllable consistency habits—never numerical facial ratings.',
      supportLinks: CRISIS_AND_WELLBEING_RESOURCES,
      allowProceed: false,
    };
  }

  const medicalMatches = MEDICAL_BOUNDARY_PATTERNS.filter((p) => p.pattern.test(normalized)).map((p) => p.term);
  if (medicalMatches.length > 0) {
    return {
      classification: 'medical_boundary',
      matchedTerms: medicalMatches,
      headline: 'Licensed Professional Care Recommended',
      guidance:
        'You mentioned a topic related to medical skin conditions, hair loss, moles, scarring, medications, supplements, or cosmetic procedures. Apex Glow provides general non-diagnostic style, grooming, and habit coaching only. Please consult a board-certified dermatologist, physician, or licensed clinician for personalized medical evaluation before starting treatments.',
      supportLinks: [
        {
          label: 'American Academy of Dermatology Guidance',
          detail: 'Consult a board-certified dermatologist for acne, scarring, moles, or hair loss.',
        },
      ],
      allowProceed: false,
    };
  }

  return {
    classification: 'safe',
    matchedTerms: [],
    headline: 'Reversible, Evidence-Informed Guidance',
    guidance: 'All recommendations prioritize gentle, reversible habits.',
    supportLinks: [],
    allowProceed: true,
  };
}

export function isMinorDob(dob: string, referenceDate = new Date()): boolean {
  if (!dob) return false;
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return false;
  let age = referenceDate.getUTCFullYear() - parsed.getUTCFullYear();
  const monthDiff = referenceDate.getUTCMonth() - parsed.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getUTCDate() < parsed.getUTCDate())) {
    age -= 1;
  }
  return age < 18;
}

export function sanitizeCommunityPost(title: string, body: string): {
  allowed: boolean;
  flaggedForModeration: boolean;
  reason?: string;
} {
  const combined = `${title} ${body}`;
  const assessment = assessSafetyQuery(combined);
  if (assessment.classification === 'unsafe_practice' || assessment.classification === 'harassment_or_rating') {
    return {
      allowed: false,
      flaggedForModeration: true,
      reason: assessment.headline,
    };
  }
  if (assessment.classification === 'medical_boundary') {
    return {
      allowed: true,
      flaggedForModeration: true,
      reason: `Contains medical/procedure terms (${assessment.matchedTerms.join(', ')}) — queued for moderator review.`,
    };
  }
  return { allowed: true, flaggedForModeration: false };
}
