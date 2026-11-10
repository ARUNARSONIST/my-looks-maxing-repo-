import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  CommunityPost,
  DailyTask,
  PersonalizedBlueprint,
  ProgressEntry,
  QuizAnswers,
  SafeUser,
  UserRole,
  UserSession,
  WeeklyCheckIn,
} from '../lib/types';
import { generateBlueprint, generateDefaultDailyTasks } from '../lib/planEngine';
import { isMinorDob } from '../lib/safety';

export interface StoredUser extends SafeUser {
  passwordHash: string;
  passwordSalt: string;
  verificationCode: string;
  resetToken?: string;
  resetTokenExpiresAt?: number;
  pendingTwoFactorCode?: string;
  quizAnswers?: QuizAnswers;
  blueprint?: PersonalizedBlueprint;
  dailyTasks: DailyTask[];
  weeklyCheckIns: WeeklyCheckIn[];
  progressEntries: ProgressEntry[];
  sessions: UserSession[];
}

export interface DatabaseState {
  users: StoredUser[];
  communityPosts: CommunityPost[];
  tokens: Record<string, { userId: string; sessionId: string; expiresAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'apexglow-db.json');

export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}

export function toSafeUser(user: StoredUser): SafeUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    dob: user.dob,
    isUnder18: user.isUnder18,
    country: user.country,
    pronouns: user.pronouns,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
    photoConsent: user.photoConsent,
    privacyMode: user.privacyMode,
    notificationsEnabled: user.notificationsEnabled,
    takeABreakMode: user.takeABreakMode,
    subscriptionTier: user.subscriptionTier,
    streakDays: user.streakDays,
    createdAt: user.createdAt,
  };
}

function createInitialState(): DatabaseState {
  const demoQuiz: QuizAnswers = {
    ageRange: '25-34',
    genderIdentity: 'Male',
    goals: ['Clearer skin', 'Fitness & strength', 'Wardrobe & fit', 'Posture & mobility'],
    skinType: 'Combination',
    hairType: 'Wavy',
    fitnessExperience: 'Intermediate',
    budget: 'Moderate ($30–$90/mo)',
    minutesPerDay: 30,
    gymAccess: 'Full Gym',
    sleepHours: '7–8h',
    dietPreference: 'High-protein',
    sensitivities: 'Avoids heavy fragrance',
    medicalConditions: '',
    culturalPreferences: '',
    currentSkincare: 'Gentle cleanser + SPF',
    currentGrooming: 'Trimmed beard weekly',
    stylePreference: 'Smart-Casual',
    photoConsent: true,
  };

  const demoBlueprint = generateBlueprint(demoQuiz);
  const demoCreds = hashPassword('GlowPass2026!');
  const adminCreds = hashPassword('AdminGlow2026!');

  const demoUser: StoredUser = {
    id: 'usr_demo_member',
    fullName: 'Jordan Ellis',
    email: 'demo@apexglow.app',
    role: 'premium',
    dob: '1997-04-12',
    isUnder18: false,
    country: 'United States',
    pronouns: 'he/him',
    emailVerified: true,
    twoFactorEnabled: false,
    photoConsent: true,
    privacyMode: 'Private by default',
    notificationsEnabled: true,
    takeABreakMode: false,
    subscriptionTier: 'Annual Premium',
    streakDays: 18,
    createdAt: '2026-09-14T10:00:00.000Z',
    passwordHash: demoCreds.hash,
    passwordSalt: demoCreds.salt,
    verificationCode: 'verified',
    quizAnswers: demoQuiz,
    blueprint: demoBlueprint,
    dailyTasks: generateDefaultDailyTasks(demoBlueprint),
    weeklyCheckIns: [
      {
        id: 'chk_1',
        date: '2026-10-26',
        sleepAvgHours: 7.4,
        trainingSessions: 3,
        skincareDays: 6,
        confidenceRating: 4,
        note: 'Swapped harsh scrub for gentle cleanser; skin feels noticeably calmer.',
      },
      {
        id: 'chk_2',
        date: '2026-11-02',
        sleepAvgHours: 7.7,
        trainingSessions: 3,
        skincareDays: 7,
        confidenceRating: 5,
        note: 'Hemmed dark indigo denim and dialed in morning posture mobility.',
      },
    ],
    progressEntries: [
      {
        id: 'prog_1',
        date: '2026-09-20',
        label: 'Week 1 Baseline',
        chestOrPostureNote: 'Desk slouch noticed in side profile; started wall angels',
        waistOrFitNote: 'Relaxed fit tees bunched at waist; measured shoulder width',
        sleepHours: 6.5,
        streakSnapshot: 4,
        photoBlurred: true,
        isPrivate: true,
        notes: 'Focused on consistency only: cleanser, SPF, and 3 gym days.',
      },
      {
        id: 'prog_2',
        date: '2026-11-03',
        label: 'Week 7 Check-In',
        chestOrPostureNote: 'Shoulders sit further back naturally; less upper-neck tightness',
        waistOrFitNote: 'Tailored overshirt + clean pant break feels sharp',
        sleepHours: 7.7,
        streakSnapshot: 18,
        photoBlurred: true,
        isPrivate: true,
        notes: '41-day cumulative skin calm streak; energy steadier before noon.',
      },
    ],
    sessions: [
      {
        id: 'sess_seed_demo',
        deviceLabel: 'Desktop Browser · San Francisco, US',
        createdAt: '2026-11-09T12:00:00.000Z',
        lastActiveAt: '2026-11-09T22:00:00.000Z',
      },
    ],
  };

  const adminUser: StoredUser = {
    id: 'usr_admin',
    fullName: 'Elena Rostova (Admin)',
    email: 'admin@apexglow.app',
    role: 'admin',
    dob: '1992-08-19',
    isUnder18: false,
    country: 'United States',
    pronouns: 'she/her',
    emailVerified: true,
    twoFactorEnabled: false,
    photoConsent: true,
    privacyMode: 'Private by default',
    notificationsEnabled: true,
    takeABreakMode: false,
    subscriptionTier: 'Annual Premium',
    streakDays: 32,
    createdAt: '2026-08-01T09:00:00.000Z',
    passwordHash: adminCreds.hash,
    passwordSalt: adminCreds.salt,
    verificationCode: 'verified',
    quizAnswers: demoQuiz,
    blueprint: demoBlueprint,
    dailyTasks: generateDefaultDailyTasks(demoBlueprint),
    weeklyCheckIns: [],
    progressEntries: [],
    sessions: [],
  };

  const communityPosts: CommunityPost[] = [
    {
      id: 'post_1',
      authorId: 'usr_demo_member',
      authorName: 'Jordan E.',
      authorRole: 'premium',
      category: 'Routine Win',
      title: 'Cutting my skincare down to 3 gentle steps cleared up tightness in 3 weeks',
      body: 'Stopped using two exfoliating acids together and stuck strictly to pH-balanced cleanser, ceramide lotion, and SPF 50 every morning. Zero flakiness now.',
      createdAt: '2026-11-06T16:20:00.000Z',
      blurFaceByDefault: true,
      hasPhoto: false,
      helpfulCount: 29,
      status: 'approved',
      coachReply: 'Dr. Maya Patel (Advisory Derm): Great call simplifying—most irritation improves once you protect your moisture barrier first.',
    },
    {
      id: 'post_2',
      authorId: 'usr_coach_1',
      authorName: 'Julian Vance',
      authorRole: 'coach',
      category: 'Hair & Grooming',
      title: 'Barber script: how to ask for natural texture without over-thinning',
      body: 'Ask your barber to leave weight through the crown and use point-cutting instead of aggressive thinning shears if your hair is wavy or fine.',
      createdAt: '2026-11-07T11:10:00.000Z',
      blurFaceByDefault: true,
      hasPhoto: false,
      helpfulCount: 44,
      status: 'approved',
    },
    {
      id: 'post_3',
      authorId: 'usr_member_2',
      authorName: 'Samira K.',
      authorRole: 'free',
      category: 'Style Check',
      title: 'Tailoring one pair of navy trousers made 5 outfits look intentional',
      body: 'Spent $18 hemming my trousers to sit cleanly at the top of my sneakers. Proportion change was night and day without buying new clothes.',
      createdAt: '2026-11-08T14:45:00.000Z',
      blurFaceByDefault: true,
      hasPhoto: true,
      helpfulCount: 37,
      status: 'approved',
    },
    {
      id: 'post_flagged_demo',
      authorId: 'usr_member_9',
      authorName: 'Alex M.',
      authorRole: 'free',
      category: 'Coach Q&A',
      title: 'Question about starting prescription hair medication vs styling',
      body: 'Has anyone tried finasteride or minoxidil for early temple recession? Looking for advice before seeing a doctor.',
      createdAt: '2026-11-08T18:05:00.000Z',
      blurFaceByDefault: true,
      hasPhoto: false,
      helpfulCount: 4,
      status: 'flagged',
      flagReason: 'Auto-flagged medical boundary: hair loss medication requires licensed physician consultation.',
    },
  ];

  return {
    users: [demoUser, adminUser],
    communityPosts,
    tokens: {},
  };
}

let cachedDb: DatabaseState | null = null;

export function getDb(): DatabaseState {
  if (cachedDb) return cachedDb;
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      cachedDb = JSON.parse(raw) as DatabaseState;
      return cachedDb;
    }
  } catch {
    // Recreate clean state if corrupted
  }
  cachedDb = createInitialState();
  saveDb();
  return cachedDb;
}

export function saveDb(): void {
  if (!cachedDb) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(cachedDb, null, 2), 'utf8');
}

export function issueAuthToken(user: StoredUser, deviceLabel: string): { token: string; session: UserSession } {
  const db = getDb();
  const token = crypto.randomBytes(24).toString('hex');
  const session: UserSession = {
    id: `sess_${crypto.randomBytes(8).toString('hex')}`,
    deviceLabel,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
  user.sessions.unshift(session);
  user.sessions = user.sessions.slice(0, 8);
  db.tokens[token] = {
    userId: user.id,
    sessionId: session.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  saveDb();
  return { token, session };
}

export function resolveUserFromToken(token?: string): { user: StoredUser; sessionId: string } | null {
  if (!token) return null;
  const db = getDb();
  const entry = db.tokens[token];
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) {
      delete db.tokens[token];
      saveDb();
    }
    return null;
  }
  const user = db.users.find((u) => u.id === entry.userId);
  if (!user) return null;
  const session = user.sessions.find((s) => s.id === entry.sessionId);
  if (session) {
    session.lastActiveAt = new Date().toISOString();
  }
  return { user, sessionId: entry.sessionId };
}

export function createOAuthStyleUser(provider: 'Google' | 'Apple', email: string, fullName: string): StoredUser {
  const db = getDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const creds = hashPassword(crypto.randomBytes(16).toString('hex'));
  const defaultQuiz: QuizAnswers = {
    ageRange: '25-34',
    genderIdentity: 'Prefer not to say',
    goals: ['Overall glow-up', 'Clearer skin', 'Style' as never].slice(0, 2) as QuizAnswers['goals'],
    skinType: 'Normal',
    hairType: 'Wavy',
    fitnessExperience: 'Beginner',
    budget: 'Moderate ($30–$90/mo)',
    minutesPerDay: 30,
    gymAccess: 'Home / Bodyweight',
    sleepHours: '7–8h',
    dietPreference: 'Balanced omnivore',
    sensitivities: '',
    medicalConditions: '',
    culturalPreferences: '',
    currentSkincare: '',
    currentGrooming: '',
    stylePreference: 'Minimalist',
    photoConsent: false,
  };
  const bp = generateBlueprint(defaultQuiz);
  const newUser: StoredUser = {
    id: `usr_${crypto.randomBytes(6).toString('hex')}`,
    fullName,
    email,
    role: 'free' as UserRole,
    dob: '1998-01-15',
    isUnder18: isMinorDob('1998-01-15'),
    country: 'United States',
    emailVerified: true,
    twoFactorEnabled: false,
    photoConsent: false,
    privacyMode: 'Private by default',
    notificationsEnabled: true,
    takeABreakMode: false,
    subscriptionTier: 'Free',
    streakDays: 1,
    createdAt: new Date().toISOString(),
    passwordHash: creds.hash,
    passwordSalt: creds.salt,
    verificationCode: `${provider.toLowerCase()}-verified`,
    quizAnswers: defaultQuiz,
    blueprint: bp,
    dailyTasks: generateDefaultDailyTasks(bp),
    weeklyCheckIns: [],
    progressEntries: [],
    sessions: [],
  };
  db.users.push(newUser);
  saveDb();
  return newUser;
}
