export type UserRole = 'guest' | 'free' | 'premium' | 'coach' | 'admin';

export type GoalArea =
  | 'Clearer skin'
  | 'Better haircut & style'
  | 'Fitness & strength'
  | 'Posture & mobility'
  | 'Wardrobe & fit'
  | 'Grooming & facial hair'
  | 'Confidence & presence'
  | 'Dating-profile photos'
  | 'Sleep & recovery'
  | 'Overall glow-up';

export type RoutineDomain =
  | 'Skincare'
  | 'Hair'
  | 'Grooming'
  | 'Fitness'
  | 'Nutrition'
  | 'Posture'
  | 'Style'
  | 'Confidence';

export type StyleArchetype =
  | 'Minimalist'
  | 'Streetwear'
  | 'Classic'
  | 'Athletic'
  | 'Smart-Casual'
  | 'Old Money'
  | 'Techwear';

export interface QuizAnswers {
  ageRange: 'under-18' | '18-24' | '25-34' | '35-44' | '45+';
  genderIdentity: string;
  goals: GoalArea[];
  skinType: 'Normal' | 'Oily' | 'Dry' | 'Combination' | 'Sensitive';
  hairType: 'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Short / Buzz' | 'Thinning / Fine';
  fitnessExperience: 'Beginner' | 'Intermediate' | 'Consistent';
  budget: 'Budget ($0–$30/mo)' | 'Moderate ($30–$90/mo)' | 'Flexible ($90+/mo)';
  minutesPerDay: 15 | 30 | 45 | 60;
  gymAccess: 'Home / Bodyweight' | 'Dumbbells / Studio' | 'Full Gym';
  sleepHours: 'Under 6h' | '6–7h' | '7–8h' | '8h+';
  dietPreference: 'Balanced omnivore' | 'High-protein' | 'Vegetarian' | 'Vegan' | 'Halal / Kosher / Cultural';
  sensitivities: string;
  medicalConditions: string;
  culturalPreferences: string;
  currentSkincare: string;
  currentGrooming: string;
  stylePreference: StyleArchetype;
  photoConsent: boolean;
}

export interface ReadinessBreakdown {
  consistency: number;
  sleep: number;
  skincareAdherence: number;
  grooming: number;
  training: number;
  styleHabits: number;
}

export interface RoutineModule {
  domain: RoutineDomain;
  priority: 'Core' | 'Secondary' | 'Maintenance';
  summary: string;
  morningSteps: string[];
  eveningOrSessionSteps: string[];
  weeklyActions: string[];
  productCategories: string[];
  safetyNote: string;
}

export interface PhaseMilestone {
  phase: 'Days 1–30: Foundation' | 'Days 31–60: Refinement' | 'Days 61–90: Signature Polish';
  focus: string;
  weeklyTargets: string[];
  expectedOutcome: string;
}

export interface PersonalizedBlueprint {
  id: string;
  createdAt: string;
  headline: string;
  summary: string;
  readinessScore: number;
  readinessBreakdown: ReadinessBreakdown;
  topPriorities: string[];
  phases: PhaseMilestone[];
  routines: RoutineModule[];
  barberChecklist: string[];
  realisticExpectations: string;
  medicalReferralNotice?: string;
}

export interface DailyTask {
  id: string;
  domain: RoutineDomain;
  title: string;
  cadence: 'Morning' | 'Daytime' | 'Evening';
  durationMinutes: number;
  completed: boolean;
}

export interface WeeklyCheckIn {
  id: string;
  date: string;
  sleepAvgHours: number;
  trainingSessions: number;
  skincareDays: number;
  confidenceRating: number;
  note: string;
}

export interface ProgressEntry {
  id: string;
  date: string;
  label: string;
  chestOrPostureNote: string;
  waistOrFitNote: string;
  sleepHours: number;
  streakSnapshot: number;
  photoDataUrl?: string;
  photoBlurred: boolean;
  isPrivate: boolean;
  notes: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  category: 'Routine Win' | 'Style Check' | 'Hair & Grooming' | 'Posture & Training' | 'Coach Q&A';
  title: string;
  body: string;
  createdAt: string;
  blurFaceByDefault: boolean;
  hasPhoto: boolean;
  helpfulCount: number;
  status: 'approved' | 'flagged' | 'removed';
  flagReason?: string;
  coachReply?: string;
}

export interface UserSession {
  id: string;
  deviceLabel: string;
  createdAt: string;
  lastActiveAt: string;
  current?: boolean;
}

export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  dob: string;
  isUnder18: boolean;
  country: string;
  pronouns?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  photoConsent: boolean;
  privacyMode: 'Private by default' | 'Blurred community sharing';
  notificationsEnabled: boolean;
  takeABreakMode: boolean;
  subscriptionTier: 'Free' | 'Monthly Premium' | 'Annual Premium';
  streakDays: number;
  createdAt: string;
}

export interface AssessmentResponse {
  status: 'ok' | 'safety_redirect' | 'medical_redirect';
  safetyBanner?: string;
  headline: string;
  photoQualityAndLighting: string;
  groomingAndHairstyleFit: string;
  postureAndOutfitFit: string;
  colorPaletteNote: string;
  strengths: string[];
  improvementOpportunities: string[];
  priorityActions: string[];
  weeklyRoutineAdjustments: string[];
  productCategories: string[];
  realisticExpectations: string;
  readinessFocus: {
    score: number;
    label: string;
    note: string;
  };
}
