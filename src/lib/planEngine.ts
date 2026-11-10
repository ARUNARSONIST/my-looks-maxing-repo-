import type {
  DailyTask,
  PersonalizedBlueprint,
  QuizAnswers,
  ReadinessBreakdown,
  RoutineDomain,
  RoutineModule,
  StyleArchetype,
} from './types';
import { assessSafetyQuery } from './safety';

export interface ReadinessInput {
  streakDays: number;
  sleepHours: string;
  skincareDaysPerWeek: number;
  groomingDaysPerWeek: number;
  trainingDaysPerWeek: number;
  styleCheckDone: boolean;
}

export function calculateReadinessScore(input: ReadinessInput): {
  score: number;
  breakdown: ReadinessBreakdown;
} {
  const consistency = Math.min(100, Math.round(45 + input.streakDays * 1.3));
  const sleepMap: Record<string, number> = {
    'Under 6h': 48,
    '6–7h': 68,
    '7–8h': 88,
    '8h+': 94,
  };
  const sleep = sleepMap[input.sleepHours] ?? 72;
  const skincareAdherence = Math.min(100, Math.round((Math.max(0, Math.min(7, input.skincareDaysPerWeek)) / 7) * 100));
  const grooming = Math.min(100, Math.round((Math.max(0, Math.min(7, input.groomingDaysPerWeek)) / 7) * 100));
  const training = Math.min(100, Math.round((Math.max(0, Math.min(5, input.trainingDaysPerWeek)) / 4) * 100));
  const styleHabits = input.styleCheckDone ? 86 : 62;

  const score = Math.round(
    consistency * 0.2 +
      sleep * 0.18 +
      skincareAdherence * 0.18 +
      grooming * 0.15 +
      training * 0.17 +
      styleHabits * 0.12
  );

  return {
    score: Math.max(10, Math.min(100, score)),
    breakdown: {
      consistency,
      sleep,
      skincareAdherence,
      grooming,
      training,
      styleHabits,
    },
  };
}

const STYLE_FORMULAS: Record<StyleArchetype, { palette: string; pieces: string[] }> = {
  Minimalist: {
    palette: 'Charcoal, warm stone, optic white, and deep navy',
    pieces: ['Heavyweight crewneck tee', 'Relaxed tapered wool-blend trouser', 'Clean leather low-top sneaker'],
  },
  Streetwear: {
    palette: 'Washed slate, ecru, forest olive, and matte black',
    pieces: ['Boxy structured overshirt', 'Straight-leg heavyweight denim', 'Retro suede runner'],
  },
  Classic: {
    palette: 'Navy, heather gray, Oxford blue, and espresso leather',
    pieces: ['Tailored Oxford button-down', 'Mid-rise chino with clean break', 'Goodyear-welted loafer or derby'],
  },
  Athletic: {
    palette: 'Graphite, teal slate, sand, and crisp white',
    pieces: ['Breathable structured knit polo', 'Stretch tapered utility pant', 'Minimalist performance trainer'],
  },
  'Smart-Casual': {
    palette: 'Midnight navy, camel, charcoal, and ivory',
    pieces: ['Fine merino knit polo', 'Tailored dark selvedge denim', 'Suede Chelsea boot or minimal sneaker'],
  },
  'Old Money': {
    palette: 'Ivory, navy, camel, olive, and burgundy accents',
    pieces: ['Structured linen-cotton shirt', 'Pleated tailored trouser', 'Belgian loafer & understated dress watch'],
  },
  Techwear: {
    palette: 'Matte obsidian, gunmetal, slate teal, and bone',
    pieces: ['Articulated weather-resistant shell', 'Tapered technical cargo pant', 'All-weather trail-inspired sneaker'],
  },
};

export function generateBlueprint(answers: QuizAnswers): PersonalizedBlueprint {
  const isMinor = answers.ageRange === 'under-18';
  const safetyNote = isMinor
    ? 'Under-18 Safety Active: Guidance focuses strictly on gentle cleansing, SPF, posture, sleep, age-appropriate activity, and wardrobe fit—no medical procedures or restrictive dieting.'
    : 'Reversible habit guidance only. Consult a licensed dermatologist or physician for persistent skin, hair-loss, or medical concerns.';

  const medicalScan = assessSafetyQuery(`${answers.sensitivities} ${answers.medicalConditions}`);
  const medicalReferralNotice =
    medicalScan.classification !== 'safe'
      ? `${medicalScan.headline}: ${medicalScan.guidance}`
      : undefined;

  const { score, breakdown } = calculateReadinessScore({
    streakDays: 7,
    sleepHours: answers.sleepHours,
    skincareDaysPerWeek: answers.currentSkincare.trim() ? 4 : 2,
    groomingDaysPerWeek: answers.currentGrooming.trim() ? 4 : 3,
    trainingDaysPerWeek: answers.fitnessExperience === 'Consistent' ? 4 : answers.fitnessExperience === 'Intermediate' ? 3 : 2,
    styleCheckDone: true,
  });

  const styleInfo = STYLE_FORMULAS[answers.stylePreference] ?? STYLE_FORMULAS['Smart-Casual'];
  const isSensitiveSkin = answers.skinType === 'Sensitive' || answers.sensitivities.trim().length > 0;

  const routines: RoutineModule[] = [
    {
      domain: 'Skincare',
      priority: answers.goals.includes('Clearer skin') ? 'Core' : 'Secondary',
      summary: `Barrier-first ${answers.skinType.toLowerCase()} skin plan calibrated for ${answers.budget.toLowerCase()} and ${answers.minutesPerDay} min/day.`,
      morningSteps: [
        answers.skinType === 'Dry' || isSensitiveSkin
          ? 'Lukewarm water rinse or ultra-gentle non-foaming cream cleanser'
          : 'Gentle pH-balanced gel cleanser (30 seconds, no hot water)',
        'Lightweight ceramide or hyaluronic moisturizer on slightly damp skin',
        'Broad-spectrum SPF 30+ sunscreen (two-finger rule on face & neck)',
      ],
      eveningOrSessionSteps: [
        'Gentle cleanser to remove sunscreen, sweat, and daily buildup',
        isSensitiveSkin
          ? 'Soothing barrier moisturizer with niacinamide (2–5%) or panthenol — patch-test any new product first'
          : 'Hydrating moisturizer; introduce only one gentle exfoliant or active at a time (2 nights/week)',
      ],
      weeklyActions: [
        'Change pillowcase twice weekly',
        'Patch-test any new formula on inner forearm for 48 hours before facial use',
      ],
      productCategories: ['Gentle pH-balanced cleanser', 'Fragrance-free barrier moisturizer', 'Broad-spectrum SPF 30–50'],
      safetyNote: isMinor
        ? 'Stick to gentle cleanser, moisturizer, and daily SPF. Avoid harsh acids or unprescribed actives.'
        : 'Avoid stacking multiple harsh exfoliants. Consult a dermatologist for persistent acne, scarring, or moles.',
    },
    {
      domain: 'Hair',
      priority: answers.goals.includes('Better haircut & style') ? 'Core' : 'Secondary',
      summary: `Low-buildup care and proportion-aware styling for ${answers.hairType.toLowerCase()} hair.`,
      morningSteps: [
        'Dampen hair lightly rather than re-washing daily if scalp feels balanced',
        answers.hairType === 'Curly' || answers.hairType === 'Coily'
          ? 'Apply pea-sized leave-in conditioner and define curl pattern with fingers'
          : 'Apply light matte paste or sea-salt mist for natural texture without shine buildup',
      ],
      eveningOrSessionSteps: [
        'Rinse out heavy styling products before sleep to protect skin and pillow hygiene',
        'Scalp massage for 60 seconds during shampoo days (2–3x/week)',
      ],
      weeklyActions: [
        'Clarifying wash once every 10–14 days if using styling clay/pomade',
        'Book maintenance trim every 3–5 weeks to keep neckline and sideburns crisp',
      ],
      productCategories: ['Sulfate-free gentle shampoo', 'Lightweight conditioner', 'Matte clay or curl cream'],
      safetyNote: 'If experiencing sudden hair thinning or scalp irritation, consult a dermatologist rather than self-treating.',
    },
    {
      domain: 'Grooming',
      priority: answers.goals.includes('Grooming & facial hair') ? 'Core' : 'Maintenance',
      summary: `Clean, intentional detail work${answers.culturalPreferences ? ` respecting ${answers.culturalPreferences}` : ''}.`,
      morningSteps: [
        'Two-minute oral hygiene: brush, floss/interdental clean, gentle tongue scraper',
        'Check brow center and stray edges (trim length only—avoid over-plucking)',
        'Apply subtle fragrance to pulse points (1–2 sprays max on moisturized skin)',
      ],
      eveningOrSessionSteps: [
        'Trim neckline two fingers above Adam’s apple or keep clean-shaven with sharp single/double-blade pass',
        'Apply soothing alcohol-free aftershave balm after shaving',
      ],
      weeklyActions: ['Trim and file fingernails cleanly', 'Sanitize trimmer guards and replace dull razor blades'],
      productCategories: ['Precision trimmer', 'Alcohol-free soothing balm', 'Interdental floss & fresh daily scent'],
      safetyNote: 'Never dry-shave irritated skin; shave with hair grain to minimize ingrown hairs.',
    },
    {
      domain: 'Fitness',
      priority: answers.goals.includes('Fitness & strength') ? 'Core' : 'Secondary',
      summary: `${answers.fitnessExperience} training plan built for ${answers.gymAccess.toLowerCase()} with progressive, joint-friendly volume.`,
      morningSteps: ['10-minute brisk outdoor walk for morning light and circulation'],
      eveningOrSessionSteps: [
        answers.gymAccess === 'Full Gym'
          ? '3x/week full-body resistance: Goblet or barbell squat, incline press, chest-supported row, RDL, overhead carry (45 min)'
          : answers.gymAccess === 'Dumbbells / Studio'
          ? '3x/week dumbbell compound circuit: Split squat, floor/bench press, single-arm row, lateral raise, plank (35 min)'
          : '3x/week bodyweight progression: Push-up variation, Bulgarian split squat, inverted row/band pull, dead bug (30 min)',
      ],
      weeklyActions: ['Aim for 7,500–9,500 daily steps', 'Log reps and rest 2 full recovery days per week'],
      productCategories: ['Supportive training shoes', 'Resistance band for warmups', 'Refillable water bottle'],
      safetyNote: isMinor
        ? 'Focus on movement quality, bodyweight mastery, and sports/play without heavy max-out lifting.'
        : 'Prioritize controlled form over ego weight; stop immediately on sharp joint pain.',
    },
    {
      domain: 'Nutrition',
      priority: 'Secondary',
      summary: `Sustainable, ${answers.dietPreference.toLowerCase()} fuel without extreme deficits or rigid bans.`,
      morningSteps: ['500ml water on waking + protein-anchoring breakfast (eggs, Greek yogurt, tofu scramble, or oats with protein)'],
      eveningOrSessionSteps: [
        'Plate template: 1 palm protein, 2 fists colorful vegetables, 1 cupped hand slow carbs, 1 thumb healthy fats',
        'Finish heavy meals 2–3 hours before sleep for better overnight recovery',
      ],
      weeklyActions: ['Prep 2–3 simple high-protein staple meals', 'Include omega-3 and colorful produce daily for skin barrier support'],
      productCategories: ['Whole-food protein staples', 'Electrolyte/hydration bottle', 'High-fiber produce'],
      safetyNote: 'Zero crash diets or extreme fasting. Adequate calories and micronutrients are essential for healthy skin, hair, and mood.',
    },
    {
      domain: 'Posture',
      priority: answers.goals.includes('Posture & mobility') ? 'Core' : 'Secondary',
      summary: 'Desk mobility, thoracic extension, and calm camera-ready alignment.',
      morningSteps: ['60-second wall angels + chin tucks (gentle lengthening, never forced clenching)'],
      eveningOrSessionSteps: [
        'Thoracic extension over rolled towel (2 minutes) + doorway pec stretch (45 seconds/side)',
        'Set monitor at eye level to reduce forward-head screen slump',
      ],
      weeklyActions: ['2x/week rear-delt band pull-aparts & scapular stability drills'],
      productCategories: ['Laptop riser / stand', 'Light resistance band', 'Supportive ergonomic pillow'],
      safetyNote: 'Posture improves through upper-back strength and gentle mobility—never force unnatural jaw clenching or neck strain.',
    },
    {
      domain: 'Style',
      priority: answers.goals.includes('Wardrobe & fit') ? 'Core' : 'Secondary',
      summary: `${answers.stylePreference} capsule built around proportion, shoulder seam fit, and ${styleInfo.palette}.`,
      morningSteps: [
        'Steam or press collared/knit pieces for 2 minutes',
        'Check pant hem break and shoe cleanliness before stepping out',
      ],
      eveningOrSessionSteps: ['Audit 1 ill-fitting garment per week for tailoring or donation'],
      weeklyActions: [
        `Build outfits from core palette: ${styleInfo.palette}`,
        'Brush suede/wipe sneaker midsoles every Sunday',
      ],
      productCategories: styleInfo.pieces,
      safetyNote: 'Great fit beats expensive logos—tailoring a $40 trouser often outperforms a $300 off-the-rack piece.',
    },
    {
      domain: 'Confidence',
      priority: answers.goals.includes('Confidence & presence') || answers.goals.includes('Dating-profile photos') ? 'Core' : 'Maintenance',
      summary: 'Grounded communication, relaxed photo presence, and healthy digital boundaries.',
      morningSteps: ['Set one small social micro-rep: warm eye contact and unhurried greeting'],
      eveningOrSessionSteps: [
        '2-minute evening check-in: note 1 action kept today (process over appearance perfection)',
        'Screens off 30 minutes before bed to protect sleep quality and mood',
      ],
      weeklyActions: [
        'Capture any progress or dating-profile photos in soft outdoor shade at eye level (relaxed smile, natural posture)',
        'Limit mirror-checking or comparison scrolling to protect mental clarity',
      ],
      productCategories: ['Pocket notebook or daily check-in log', 'Natural window/shade photo checklist'],
      safetyNote: 'Confidence grows from kept promises and self-respect, not perfection or external comparison.',
    },
  ];

  return {
    id: `bp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    headline: `${answers.stylePreference} 90-Day Glow-Up Blueprint`,
    summary: `Tailored for ${answers.minutesPerDay} minutes/day (${answers.budget}), prioritizing ${answers.goals.slice(0, 3).join(', ') || 'sustainable daily habits'}.`,
    readinessScore: score,
    readinessBreakdown: breakdown,
    topPriorities: [
      `Lock in a 3-step morning & evening ${answers.skinType.toLowerCase()} skincare barrier routine.`,
      `Establish 3x/week ${answers.gymAccess.toLowerCase()} training + daily posture mobility breaks.`,
      `Upgrade fit and cohesion using your ${answers.stylePreference} color palette (${styleInfo.palette}).`,
    ],
    phases: [
      {
        phase: 'Days 1–30: Foundation',
        focus: 'Consistency over intensity: sleep rhythm, gentle cleanser + SPF, hydration, and 2–3 baseline workouts/week.',
        weeklyTargets: ['Complete 5/7 morning & evening skin resets', 'Hit 3 mobility + posture resets', 'Schedule a proportion-aware haircut'],
        expectedOutcome: 'Noticeably calmer routine friction, fresher daily grooming, and steadier energy.',
      },
      {
        phase: 'Days 31–60: Refinement',
        focus: 'Wardrobe fit audit, progressive training load, and camera-ready natural lighting practice.',
        weeklyTargets: ['Refine 3 go-to capsule outfits', 'Maintain 7–8h sleep window', 'Complete weekly progress check-in'],
        expectedOutcome: 'Cleaner clothing silhouettes, stronger upper-back posture, and reliable habit momentum.',
      },
      {
        phase: 'Days 61–90: Signature Polish',
        focus: 'Automate habits into effortless maintenance, refine grooming cadence, and practice social confidence.',
        weeklyTargets: ['Sustain 80%+ weekly habit adherence', 'Update progress timeline notes', 'Review 90-day reflection'],
        expectedOutcome: 'Sustainable, self-directed routine that fits your real schedule without burnout.',
      },
    ],
    routines,
    barberChecklist: [
      'Bring 2 reference photos with similar hair texture and density to yours.',
      `Ask for proportions suited to your ${answers.hairType.toLowerCase()} hair and natural growth direction.`,
      'Specify how much time you spend styling each morning (under 3 minutes vs. blow-dry).',
      'Request natural tapered edges rather than overly harsh pushed-back hairlines.',
    ],
    realisticExpectations:
      'Results vary based on genetics, sleep, health, and consistency. Expect steadier skin hydration in 2–4 weeks, improved posture awareness in 3–6 weeks, and visible wardrobe/fitness polish over 8–12 weeks.',
    medicalReferralNotice,
  };
}

export function generateDefaultDailyTasks(blueprint?: PersonalizedBlueprint | null): DailyTask[] {
  const skincareNote = blueprint?.routines.find((r) => r.domain === 'Skincare')?.morningSteps[0] ?? 'Gentle cleanser, moisturizer & broad-spectrum SPF 30+';
  return [
    {
      id: 'task_skin_am',
      domain: 'Skincare',
      title: skincareNote,
      cadence: 'Morning',
      durationMinutes: 4,
      completed: true,
    },
    {
      id: 'task_posture_am',
      domain: 'Posture',
      title: '60s wall angels & chin-tuck posture reset + 10 min daylight walk',
      cadence: 'Morning',
      durationMinutes: 11,
      completed: false,
    },
    {
      id: 'task_groom_day',
      domain: 'Grooming',
      title: 'Oral hygiene, hair styling check & steamed outfit proportion check',
      cadence: 'Morning',
      durationMinutes: 5,
      completed: true,
    },
    {
      id: 'task_fitness_day',
      domain: 'Fitness',
      title: '35 min compound resistance session or 8,500-step walk target',
      cadence: 'Daytime',
      durationMinutes: 35,
      completed: false,
    },
    {
      id: 'task_nutrition_day',
      domain: 'Nutrition',
      title: 'Hit protein-forward meal template & 2.5L water hydration',
      cadence: 'Daytime',
      durationMinutes: 5,
      completed: false,
    },
    {
      id: 'task_skin_pm',
      domain: 'Skincare',
      title: 'Evening cleanse & barrier moisturizer + screens off 30m before sleep',
      cadence: 'Evening',
      durationMinutes: 5,
      completed: false,
    },
  ];
}
