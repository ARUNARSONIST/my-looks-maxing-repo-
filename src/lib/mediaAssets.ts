export const EDITORIAL_MEDIA = {
  beforeSkinGrooming: '/src/assets/images/before_skin_grooming_v2_1794296191094.jpg',
  skinGrooming: '/src/assets/images/journey_skin_grooming_1794293435718.jpg',
  beforeFitnessStyle: '/src/assets/images/before_fitness_style_1794296104004.jpg',
  fitnessStyle: '/src/assets/images/journey_fitness_style_1794293437026.jpg',
  beforeHairPresentation: '/src/assets/images/before_hair_presentation_v2_1794296190990.jpg',
  hairPresentation: '/src/assets/images/journey_hair_presentation_1794293437404.jpg',
  coachAvatar: '/src/assets/images/coach_studio_avatar_1794293437609.jpg',
} as const;

export interface RepresentativeJourney {
  id: string;
  title: string;
  timeframe: string;
  beforeImage: string;
  beforeImageAlt: string;
  afterImage: string;
  afterImageAlt: string;
  beforeSummary: string;
  afterSummary: string;
  dashboardCopy: string;
  disclaimer: string;
}

export const REPRESENTATIVE_JOURNEYS: RepresentativeJourney[] = [
  {
    id: 'journey-skin-grooming',
    title: 'Example 1: Skin & Grooming Reset',
    timeframe: '8 weeks · Illustrative journey',
    beforeImage: EDITORIAL_MEDIA.beforeSkinGrooming,
    beforeImageAlt: 'Before routine: dry skin texture, untrimmed brows and facial hair, unstyled hair, oversized gray tee',
    afterImage: EDITORIAL_MEDIA.skinGrooming,
    afterImageAlt: 'After 8 weeks: hydrated skin, shaped brows, neat short beard, crisp off-white crewneck, natural light',
    beforeSummary: 'Dull-looking skin, uneven skincare routine, overgrown brows, unstyled hair, wrinkled oversized T-shirt.',
    afterSummary: 'Consistent gentle cleanser, moisturizer, daily sunscreen, basic haircut, shaped brows, trimmed beard, fitted neutral outfit, better sleep routine.',
    dashboardCopy: 'Skin-consistency streak: 41 days. Style confidence: improved. Next focus: strength training and posture.',
    disclaimer: 'Results vary. Images are illustrative examples of consistent routine adherence, not guaranteed outcomes.',
  },
  {
    id: 'journey-fitness-style',
    title: 'Example 2: Fitness & Style Upgrade',
    timeframe: '12 weeks · Illustrative journey',
    beforeImage: EDITORIAL_MEDIA.beforeFitnessStyle,
    beforeImageAlt: 'Before routine: slouched posture in baggy hoodie and loose sweatpants under dim indoor lighting',
    afterImage: EDITORIAL_MEDIA.fitnessStyle,
    afterImageAlt: 'After 12 weeks: upright posture in fitted charcoal tee, tailored dark indigo denim, and clean leather sneakers',
    beforeSummary: 'Low activity, poor posture in photos, baggy clothes, inconsistent meals.',
    afterSummary: 'Three strength sessions weekly, daily walks, protein-forward meals, tailored dark denim, fitted tee, clean leather sneakers, upright posture.',
    dashboardCopy: 'Training adherence: 82%. Posture practice: 5 days/week. Wardrobe upgrade completed.',
    disclaimer: 'Results vary. Images are illustrative examples of consistent routine adherence, not guaranteed outcomes.',
  },
  {
    id: 'journey-hair-presentation',
    title: 'Example 3: Hair & Presentation Transformation',
    timeframe: '6 weeks · Illustrative journey',
    beforeImage: EDITORIAL_MEDIA.beforeHairPresentation,
    beforeImageAlt: 'Before routine: grown-out unstyled hair, overhead shadow lighting, and oversized wrinkled zip hoodie',
    afterImage: EDITORIAL_MEDIA.hairPresentation,
    afterImageAlt: 'After 6 weeks: proportioned textured haircut, clean brow grooming, and coordinated camel overshirt palette',
    beforeSummary: 'Product buildup, unclear haircut direction, no styling routine, mismatched colors.',
    afterSummary: 'Barber consultation, face-shape-friendly haircut, simple styling routine, brow cleanup, coordinated outfit palette, improved photo lighting.',
    dashboardCopy: 'Hair routine adherence: 6/7 days. Style confidence: high. Next focus: skincare barrier repair.',
    disclaimer: 'Results vary. Images are illustrative examples of consistent routine adherence, not guaranteed outcomes.',
  },
];

export interface ExpertArticle {
  id: string;
  category: 'Skincare' | 'Hair' | 'Style' | 'Posture' | 'Confidence';
  title: string;
  author: string;
  role: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  minTier: 'Free' | 'Monthly Premium';
}

export const EXPERT_ARTICLES: ExpertArticle[] = [
  {
    id: 'art-barrier-first',
    category: 'Skincare',
    title: 'The 3-Step Barrier Routine That Outperforms 10-Step Shelves',
    author: 'Dr. Maya Patel, MD',
    role: 'Advisory Dermatologist',
    readTime: '5 min read',
    summary: 'Why gentle cleansing, ceramide hydration, and daily broad-spectrum SPF create calmer, clearer skin without barrier irritation.',
    keyTakeaways: [
      'Introduce only one active ingredient at a time, 2 weeks apart.',
      'Patch-test new formulas on your inner forearm for 48 hours.',
      'See a board-certified dermatologist for cystic acne, moles, or scarring.',
    ],
    minTier: 'Free',
  },
  {
    id: 'art-barber-brief',
    category: 'Hair',
    title: 'How to Run a 5-Minute Barber Consultation Using Texture & Proportion',
    author: 'Julian Vance',
    role: 'Master Stylist & Coach',
    readTime: '4 min read',
    summary: 'Communicating hair growth direction, daily styling budget, and neckline taper so your cut grows out cleanly for 4 weeks.',
    keyTakeaways: [
      'Bring 2 photos showing your actual hair texture—not different density.',
      'Ask for scissor-over-comb blending around the parietal ridge.',
      'Wash out heavy matte products before sleep to prevent forehead congestion.',
    ],
    minTier: 'Free',
  },
  {
    id: 'art-capsule-fit',
    category: 'Style',
    title: 'Shoulder Seams, Pant Breaks, and the 12-Piece Smart-Casual Capsule',
    author: 'Elena Rostova',
    role: 'Wardrobe Architect',
    readTime: '6 min read',
    summary: 'How tailoring affordable basics and sticking to 3 core neutrals elevates everyday presentation immediately.',
    keyTakeaways: [
      'Match shoulder seam width to your acromion bone for clean structure.',
      'Hem trousers to a zero-to-quarter break for longer visual proportion.',
      'Rotate 2 clean leather or suede footwear silhouettes.',
    ],
    minTier: 'Free',
  },
  {
    id: 'art-posture-lighting',
    category: 'Posture',
    title: 'Upper-Back Strength & Natural Light: Ethical Photo Confidence Guide',
    author: 'Marcus Chen, CSCS',
    role: 'Performance & Mobility Coach',
    readTime: '5 min read',
    summary: 'Replacing stiff posing and harsh overhead shadows with thoracic mobility, relaxed shoulders, and soft eye-level window light.',
    keyTakeaways: [
      'Face 45 degrees toward open window or outdoor shade for even skin tone.',
      'Keep camera at eye or chest level—never tilted steeply upward.',
      'Build scapular endurance with 3x/week rows and band pull-aparts.',
    ],
    minTier: 'Monthly Premium',
  },
];

export const ROTATING_FOCUS_ITEMS = [
  {
    area: 'Skin',
    headline: 'Barrier-first skincare, zero guesswork',
    detail: 'Cleanser, moisturizer, and broad-spectrum SPF matched to oily, dry, combination, or sensitive skin—with patch-test pacing.',
  },
  {
    area: 'Hair',
    headline: 'Cuts tailored to texture and maintenance budget',
    detail: 'Barber consultation checklists, low-buildup styling routines, and proportion guidance built around your natural hair pattern.',
  },
  {
    area: 'Grooming',
    headline: 'Crisp everyday details in 5 minutes',
    detail: 'Beard neckline symmetry, gentle brow tidying, nail care, oral hygiene, and subtle fragrance layering.',
  },
  {
    area: 'Fitness',
    headline: 'Sustainable strength and athletic posture',
    detail: 'Progressive 3-day resistance plans for home, dumbbells, or full gym—paired with step targets and recovery.',
  },
  {
    area: 'Style',
    headline: 'Fit, fabric weight, and cohesive palettes',
    detail: 'Capsule wardrobe formulas across Minimalist, Smart-Casual, Classic, Streetwear, Athletic, Old Money, and Techwear.',
  },
  {
    area: 'Posture',
    headline: 'Upper-back alignment for desk and camera',
    detail: 'Thoracic extension drills, neck mobility, and natural relaxed carriage without rigid posing.',
  },
  {
    area: 'Sleep',
    headline: 'Recovery that shows in energy and skin',
    detail: 'Consistent wind-down windows, evening screen boundaries, and hydration habits that power daily focus.',
  },
  {
    area: 'Confidence',
    headline: 'Self-respect without comparison traps',
    detail: 'Grounded social micro-reps, digital boundary tools, and a built-in Take-a-Break calm mode whenever needed.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Does Apex Glow give facial attractiveness ratings or scores?',
    a: 'No. We never score facial attractiveness, rank users, or compare people against each other. Instead, our Glow-Up Readiness Score tracks controllable habits like sleep, skincare adherence, grooming, training consistency, and wardrobe fit.',
  },
  {
    q: 'Are progress photos private, and how is AI photo feedback handled?',
    a: 'All progress photos are private by default and require explicit consent before any AI style analysis. You can blur faces automatically in community posts and delete any photo or your entire account immediately.',
  },
  {
    q: 'What does Apex Glow refuse to recommend?',
    a: 'We strictly prohibit instructions for bonesmashing, steroid or SARM misuse, unregulated injectables, off-label hormones, and extreme caloric restriction. Any medical skin concern, hair loss, mole, or cosmetic procedure query is directed to a licensed dermatologist or physician.',
  },
  {
    q: 'How does under-18 safety protection work?',
    a: 'Accounts confirm date of birth at signup. Under-18 members receive age-appropriate coaching focused strictly on gentle skincare, SPF, posture, sleep, school/sports fitness, and style—with medical and procedure-related topics automatically restricted.',
  },
  {
    q: 'Can I pause or cancel anytime?',
    a: 'Yes. Subscriptions cancel anytime with zero penalty, and you can toggle Take-a-Break mode in your dashboard to pause streak pressure whenever you want a calmer pace.',
  },
];
