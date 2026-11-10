# Apex Glow — Complete Source Code Bundle

This file contains the complete source code for **Apex Glow** so you can review, recreate, or publish the repository to GitHub.

## Publishing to GitHub

```bash
# 1. Initialize git in your project directory
git init
git add .
git commit -m "Initial commit: Apex Glow platform"

# 2. Push to your GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Local Setup

```bash
npm install
cp .env.example .env   # Add your GEMINI_API_KEY in .env
npm run dev            # Starts Express + Vite on http://localhost:3000
npm run build          # Production build
```

## Image Assets (`src/assets/images/`)

Binary image assets live alongside the source files in `src/assets/images/`:

- `src/assets/images/before_fitness_style_1794296104004.jpg`
- `src/assets/images/before_hair_presentation_v2_1794296190990.jpg`
- `src/assets/images/before_skin_grooming_v2_1794296191094.jpg`
- `src/assets/images/coach_studio_avatar_1794293437609.jpg`
- `src/assets/images/journey_fitness_style_1794293437026.jpg`
- `src/assets/images/journey_hair_presentation_1794293437404.jpg`
- `src/assets/images/journey_skin_grooming_1794293435718.jpg`

---

## Table of Contents

- `.env.example`
- `.gitignore`
- `metadata.json`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `server.ts`
- `src/main.tsx`
- `src/index.css`
- `src/App.tsx`
- `src/lib/types.ts`
- `src/lib/safety.ts`
- `src/lib/safety.test.ts`
- `src/lib/planEngine.ts`
- `src/lib/planEngine.test.ts`
- `src/lib/authValidation.ts`
- `src/lib/mediaAssets.ts`
- `src/lib/api.ts`
- `src/server/store.ts`
- `src/server/gemini.ts`
- `src/components/Navbar.tsx`
- `src/components/LegalModal.tsx`
- `src/components/LandingPage.tsx`
- `src/components/OnboardingQuiz.tsx`
- `src/components/RoutineExplorer.tsx`
- `src/components/AiAssessment.tsx`
- `src/components/DailyDashboard.tsx`
- `src/components/ProgressTracker.tsx`
- `src/components/CommunityHub.tsx`
- `src/components/PricingView.tsx`
- `src/components/AuthAndAccount.tsx`
- `src/components/AdminPanel.tsx`

---

## `.env.example`

````
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
````

## `.gitignore`

````
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
data/
.playwright-cli/
````

## `metadata.json`

````json
{
  "name": "Apex Glow",
  "description": "A safe, evidence-informed personal style, skincare, grooming, fitness, posture, and confidence coaching platform.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
````

## `package.json`

````json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "start": "NODE_ENV=production tsx server.ts",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^3.0.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2",
    "@types/express": "^4.17.21"
  }
}
````

## `tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "exclude": ["dist"]
}
````

## `vite.config.ts`

````ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
````

## `index.html`

````html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Apex Glow — Personal Style, Skincare & Confidence Coaching</title>
    <meta
      name="description"
      content="A safe, evidence-informed personal style, skincare, grooming, fitness, posture, and confidence coaching platform."
    />
    <meta property="og:title" content="Apex Glow — Personal Style, Skincare & Confidence Coaching" />
    <meta
      property="og:description"
      content="A safe, evidence-informed personal style, skincare, grooming, fitness, posture, and confidence coaching platform."
    />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-[#F6F4EF] text-[#14171A] dark:bg-[#0D0F12] dark:text-[#F4F2ED] antialiased selection:bg-teal-500/30 selection:text-teal-200">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## `server.ts`

````ts
import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  createOAuthStyleUser,
  getDb,
  hashPassword,
  issueAuthToken,
  resolveUserFromToken,
  saveDb,
  toSafeUser,
  verifyPassword,
} from './src/server/store';
import { checkPasswordStrength, validateAgeConfirmation, validateEmailFormat } from './src/lib/authValidation';
import { assessSafetyQuery, isMinorDob, sanitizeCommunityPost } from './src/lib/safety';
import { calculateReadinessScore, generateBlueprint, generateDefaultDailyTasks } from './src/lib/planEngine';
import { runCoachMessage, runStylePhotoAssessment } from './src/server/gemini';
import type { QuizAnswers } from './src/lib/types';

const PORT = Number(process.env.PORT) || 3000;

function extractBearer(req: express.Request): string | undefined {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return undefined;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'apex-glow' });
  });

  // --- AUTHENTICATION ---
  app.post('/api/auth/signup', (req, res) => {
    const { fullName, email, password, confirmPassword, dob, country, pronouns } = req.body ?? {};
    if (!fullName || String(fullName).trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!validateEmailFormat(String(email || ''))) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmation do not match.' });
    }
    const strength = checkPasswordStrength(String(password || ''));
    if (!strength.valid) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.',
      });
    }
    const ageCheck = validateAgeConfirmation(String(dob || ''));
    if (!ageCheck.valid) {
      return res.status(400).json({ error: ageCheck.error });
    }

    const db = getDb();
    const exists = db.users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });
    }

    const creds = hashPassword(String(password));
    const verificationCode = String(crypto.randomInt(100000, 999999));
    const defaultQuiz: QuizAnswers = {
      ageRange: ageCheck.isUnder18 ? 'under-18' : '25-34',
      genderIdentity: 'Prefer not to say',
      goals: ['Clearer skin', 'Posture & mobility', 'Confidence & presence'],
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
      stylePreference: 'Smart-Casual',
      photoConsent: false,
    };
    const blueprint = generateBlueprint(defaultQuiz);

    const user = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      role: 'free' as const,
      dob: String(dob),
      isUnder18: ageCheck.isUnder18,
      country: String(country || 'United States').trim(),
      pronouns: pronouns ? String(pronouns).trim() : undefined,
      emailVerified: false,
      twoFactorEnabled: false,
      photoConsent: false,
      privacyMode: 'Private by default' as const,
      notificationsEnabled: true,
      takeABreakMode: false,
      subscriptionTier: 'Free' as const,
      streakDays: 1,
      createdAt: new Date().toISOString(),
      passwordHash: creds.hash,
      passwordSalt: creds.salt,
      verificationCode,
      quizAnswers: defaultQuiz,
      blueprint,
      dailyTasks: generateDefaultDailyTasks(blueprint),
      weeklyCheckIns: [],
      progressEntries: [],
      sessions: [],
    };

    db.users.push(user);
    const { token } = issueAuthToken(user, req.headers['user-agent']?.slice(0, 48) || 'Web Browser');
    saveDb();

    return res.status(201).json({
      token,
      user: toSafeUser(user),
      verificationCodePreview: verificationCode,
      message: 'Account created. Enter your verification code to unlock full features.',
    });
  });

  app.post('/api/auth/verify-email', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const { code } = req.body ?? {};
    if (String(code).trim() !== resolved.user.verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }
    resolved.user.emailVerified = true;
    saveDb();
    return res.json({ user: toSafeUser(resolved.user) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password, provider } = req.body ?? {};
    if (provider === 'Google' || provider === 'Apple') {
      const providerEmail = String(email || `${provider.toLowerCase()}.member@apexglow.app`).trim().toLowerCase();
      const providerName = provider === 'Google' ? 'Alex Rivera' : 'Taylor Brooks';
      const user = createOAuthStyleUser(provider, providerEmail, providerName);
      const { token } = issueAuthToken(user, `${provider} Sign-In · Web`);
      return res.json({ token, user: toSafeUser(user) });
    }

    const db = getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').trim().toLowerCase());
    if (!user || !verifyPassword(String(password || ''), user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.twoFactorEnabled) {
      const code = String(crypto.randomInt(100000, 999999));
      user.pendingTwoFactorCode = code;
      saveDb();
      return res.json({
        requiresTwoFactor: true,
        email: user.email,
        twoFactorCodePreview: code,
      });
    }

    const { token } = issueAuthToken(user, req.headers['user-agent']?.slice(0, 48) || 'Web Browser');
    return res.json({ token, user: toSafeUser(user) });
  });

  app.post('/api/auth/verify-2fa', (req, res) => {
    const { email, code } = req.body ?? {};
    const db = getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').trim().toLowerCase());
    if (!user || !user.pendingTwoFactorCode || user.pendingTwoFactorCode !== String(code || '').trim()) {
      return res.status(401).json({ error: 'Invalid or expired two-factor code.' });
    }
    user.pendingTwoFactorCode = undefined;
    const { token } = issueAuthToken(user, '2FA Verified · Web Browser');
    return res.json({ token, user: toSafeUser(user) });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body ?? {};
    const db = getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').trim().toLowerCase());
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset token has been generated.' });
    }
    const resetToken = crypto.randomBytes(12).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    saveDb();
    return res.json({
      message: 'Expiring password reset token issued (valid for 15 minutes).',
      resetTokenPreview: resetToken,
    });
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { email, resetToken, newPassword } = req.body ?? {};
    const db = getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').trim().toLowerCase());
    if (
      !user ||
      !user.resetToken ||
      user.resetToken !== String(resetToken || '').trim() ||
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < Date.now()
    ) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }
    const strength = checkPasswordStrength(String(newPassword || ''));
    if (!strength.valid) {
      return res.status(400).json({ error: 'New password does not meet complexity requirements.' });
    }
    const creds = hashPassword(String(newPassword));
    user.passwordHash = creds.hash;
    user.passwordSalt = creds.salt;
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    saveDb();
    return res.json({ message: 'Password updated successfully. You may now sign in.' });
  });

  app.get('/api/auth/me', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Not signed in.' });
    const sessions = resolved.user.sessions.map((s) => ({
      ...s,
      current: s.id === resolved.sessionId,
    }));
    return res.json({ user: toSafeUser(resolved.user), sessions });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = extractBearer(req);
    const db = getDb();
    if (token && db.tokens[token]) {
      const entry = db.tokens[token];
      const user = db.users.find((u) => u.id === entry.userId);
      if (user) {
        user.sessions = user.sessions.filter((s) => s.id !== entry.sessionId);
      }
      delete db.tokens[token];
      saveDb();
    }
    return res.json({ ok: true });
  });

  app.post('/api/auth/logout-all', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const db = getDb();
    for (const [tok, meta] of Object.entries(db.tokens)) {
      if (meta.userId === resolved.user.id) {
        delete db.tokens[tok];
      }
    }
    resolved.user.sessions = [];
    saveDb();
    return res.json({ ok: true });
  });

  // --- ACCOUNT SETTINGS & PRIVACY ---
  app.patch('/api/account/profile', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const { photoConsent, privacyMode, notificationsEnabled, takeABreakMode, pronouns, subscriptionTier } = req.body ?? {};
    const u = resolved.user;
    if (typeof photoConsent === 'boolean') u.photoConsent = photoConsent;
    if (privacyMode === 'Private by default' || privacyMode === 'Blurred community sharing') u.privacyMode = privacyMode;
    if (typeof notificationsEnabled === 'boolean') u.notificationsEnabled = notificationsEnabled;
    if (typeof takeABreakMode === 'boolean') u.takeABreakMode = takeABreakMode;
    if (typeof pronouns === 'string') u.pronouns = pronouns.trim() || undefined;
    if (subscriptionTier === 'Free' || subscriptionTier === 'Monthly Premium' || subscriptionTier === 'Annual Premium') {
      u.subscriptionTier = subscriptionTier;
      if (u.role !== 'admin' && u.role !== 'coach') {
        u.role = subscriptionTier === 'Free' ? 'free' : 'premium';
      }
    }
    u.isUnder18 = isMinorDob(u.dob);
    saveDb();
    return res.json({ user: toSafeUser(u) });
  });

  app.post('/api/account/change-password', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const { currentPassword, newPassword } = req.body ?? {};
    if (!verifyPassword(String(currentPassword || ''), resolved.user.passwordHash, resolved.user.passwordSalt)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    const strength = checkPasswordStrength(String(newPassword || ''));
    if (!strength.valid) {
      return res.status(400).json({ error: 'New password does not meet strength requirements.' });
    }
    const creds = hashPassword(String(newPassword));
    resolved.user.passwordHash = creds.hash;
    resolved.user.passwordSalt = creds.salt;
    saveDb();
    return res.json({ ok: true, message: 'Password updated.' });
  });

  app.post('/api/account/toggle-2fa', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    resolved.user.twoFactorEnabled = !resolved.user.twoFactorEnabled;
    saveDb();
    return res.json({ user: toSafeUser(resolved.user) });
  });

  app.get('/api/account/export', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const u = resolved.user;
    return res.json({
      exportedAt: new Date().toISOString(),
      profile: toSafeUser(u),
      quizAnswers: u.quizAnswers,
      blueprint: u.blueprint,
      dailyTasks: u.dailyTasks,
      weeklyCheckIns: u.weeklyCheckIns,
      progressEntries: u.progressEntries,
    });
  });

  app.delete('/api/account', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const db = getDb();
    for (const [tok, meta] of Object.entries(db.tokens)) {
      if (meta.userId === resolved.user.id) delete db.tokens[tok];
    }
    db.users = db.users.filter((u) => u.id !== resolved.user.id);
    saveDb();
    return res.json({ ok: true });
  });

  // --- WORKSPACE: PLANS, TASKS, CHECK-INS, PROGRESS ---
  app.get('/api/workspace', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) {
      return res.json({
        authenticated: false,
        blueprint: null,
        dailyTasks: generateDefaultDailyTasks(null),
        weeklyCheckIns: [],
        progressEntries: [],
      });
    }
    const u = resolved.user;
    return res.json({
      authenticated: true,
      user: toSafeUser(u),
      quizAnswers: u.quizAnswers ?? null,
      blueprint: u.blueprint ?? null,
      dailyTasks: u.dailyTasks,
      weeklyCheckIns: u.weeklyCheckIns,
      progressEntries: u.progressEntries,
    });
  });

  app.post('/api/blueprint', (req, res) => {
    const answers = req.body as QuizAnswers;
    if (!answers || !Array.isArray(answers.goals) || answers.goals.length === 0) {
      return res.status(400).json({ error: 'Please select at least one glow-up goal.' });
    }
    const blueprint = generateBlueprint(answers);
    const dailyTasks = generateDefaultDailyTasks(blueprint);

    const resolved = resolveUserFromToken(extractBearer(req));
    if (resolved) {
      resolved.user.quizAnswers = answers;
      resolved.user.blueprint = blueprint;
      resolved.user.dailyTasks = dailyTasks;
      resolved.user.photoConsent = Boolean(answers.photoConsent);
      if (answers.ageRange === 'under-18') {
        resolved.user.isUnder18 = true;
      }
      saveDb();
    }

    return res.json({ blueprint, dailyTasks });
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Sign in to save daily task progress.' });
    const task = resolved.user.dailyTasks.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    task.completed = typeof req.body?.completed === 'boolean' ? req.body.completed : !task.completed;
    const completedCount = resolved.user.dailyTasks.filter((t) => t.completed).length;
    if (completedCount === resolved.user.dailyTasks.length && !resolved.user.takeABreakMode) {
      resolved.user.streakDays += 1;
    }
    if (resolved.user.blueprint) {
      const readiness = calculateReadinessScore({
        streakDays: resolved.user.streakDays,
        sleepHours: resolved.user.quizAnswers?.sleepHours ?? '7–8h',
        skincareDaysPerWeek: Math.min(7, 3 + completedCount),
        groomingDaysPerWeek: 5,
        trainingDaysPerWeek: 3,
        styleCheckDone: true,
      });
      resolved.user.blueprint.readinessScore = readiness.score;
      resolved.user.blueprint.readinessBreakdown = readiness.breakdown;
    }
    saveDb();
    return res.json({
      dailyTasks: resolved.user.dailyTasks,
      streakDays: resolved.user.streakDays,
      blueprint: resolved.user.blueprint,
    });
  });

  app.post('/api/checkins', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Sign in to log weekly check-ins.' });
    const { sleepAvgHours, trainingSessions, skincareDays, confidenceRating, note } = req.body ?? {};
    const entry = {
      id: `chk_${crypto.randomBytes(4).toString('hex')}`,
      date: new Date().toISOString().slice(0, 10),
      sleepAvgHours: Number(sleepAvgHours) || 7.5,
      trainingSessions: Number(trainingSessions) || 3,
      skincareDays: Number(skincareDays) || 6,
      confidenceRating: Math.max(1, Math.min(5, Number(confidenceRating) || 4)),
      note: String(note || '').trim(),
    };
    resolved.user.weeklyCheckIns.unshift(entry);
    saveDb();
    return res.status(201).json({ weeklyCheckIns: resolved.user.weeklyCheckIns });
  });

  app.post('/api/progress', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Sign in to save private progress entries.' });
    const { label, chestOrPostureNote, waistOrFitNote, sleepHours, photoDataUrl, notes } = req.body ?? {};
    if (!label || !String(label).trim()) {
      return res.status(400).json({ error: 'Please provide a check-in label.' });
    }
    const entry = {
      id: `prog_${crypto.randomBytes(5).toString('hex')}`,
      date: new Date().toISOString().slice(0, 10),
      label: String(label).trim(),
      chestOrPostureNote: String(chestOrPostureNote || 'Neutral shoulder posture').trim(),
      waistOrFitNote: String(waistOrFitNote || 'Consistent garment fit').trim(),
      sleepHours: Number(sleepHours) || 7.5,
      streakSnapshot: resolved.user.streakDays,
      photoDataUrl: typeof photoDataUrl === 'string' && photoDataUrl.startsWith('data:image/') ? photoDataUrl : undefined,
      photoBlurred: true,
      isPrivate: true,
      notes: String(notes || '').trim(),
    };
    resolved.user.progressEntries.unshift(entry);
    saveDb();
    return res.status(201).json({ progressEntries: resolved.user.progressEntries });
  });

  app.patch('/api/progress/:id', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    const entry = resolved.user.progressEntries.find((p) => p.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Progress entry not found.' });
    if (typeof req.body?.photoBlurred === 'boolean') entry.photoBlurred = req.body.photoBlurred;
    if (typeof req.body?.isPrivate === 'boolean') entry.isPrivate = req.body.isPrivate;
    saveDb();
    return res.json({ progressEntries: resolved.user.progressEntries });
  });

  app.delete('/api/progress/:id', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Authentication required.' });
    resolved.user.progressEntries = resolved.user.progressEntries.filter((p) => p.id !== req.params.id);
    saveDb();
    return res.json({ progressEntries: resolved.user.progressEntries });
  });

  // --- COMMUNITY & MODERATION ---
  app.get('/api/community', (_req, res) => {
    const db = getDb();
    const visiblePosts = db.communityPosts.filter((p) => p.status === 'approved');
    return res.json({ posts: visiblePosts });
  });

  app.post('/api/community', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved) return res.status(401).json({ error: 'Sign in to share in the community.' });
    const { category, title, body, blurFaceByDefault, hasPhoto } = req.body ?? {};
    if (!title || String(title).trim().length < 4 || !body || String(body).trim().length < 10) {
      return res.status(400).json({ error: 'Please include a clear title and helpful reflection.' });
    }

    const moderation = sanitizeCommunityPost(String(title), String(body));
    if (!moderation.allowed) {
      return res.status(400).json({ error: moderation.reason });
    }

    const db = getDb();
    const post = {
      id: `post_${crypto.randomBytes(5).toString('hex')}`,
      authorId: resolved.user.id,
      authorName: resolved.user.fullName.split(' ')[0] + ' ' + (resolved.user.fullName.split(' ')[1]?.[0] || '') + '.',
      authorRole: resolved.user.role,
      category: category || 'Routine Win',
      title: String(title).trim(),
      body: String(body).trim(),
      createdAt: new Date().toISOString(),
      blurFaceByDefault: blurFaceByDefault !== false,
      hasPhoto: Boolean(hasPhoto),
      helpfulCount: 0,
      status: moderation.flaggedForModeration ? ('flagged' as const) : ('approved' as const),
      flagReason: moderation.reason,
    };
    db.communityPosts.unshift(post);
    saveDb();
    return res.status(201).json({
      post,
      flaggedForReview: moderation.flaggedForModeration,
      message: moderation.flaggedForModeration
        ? 'Your post mentions medical terms and was sent to a moderator for safety review.'
        : 'Post published to the community.',
    });
  });

  app.post('/api/community/:id/helpful', (req, res) => {
    const db = getDb();
    const post = db.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    post.helpfulCount += 1;
    saveDb();
    return res.json({ post });
  });

  app.post('/api/community/:id/report', (req, res) => {
    const db = getDb();
    const post = db.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    post.status = 'flagged';
    post.flagReason = String(req.body?.reason || 'Reported by community member for safety review.').trim();
    saveDb();
    return res.json({ ok: true, message: 'Report submitted to the moderation queue.' });
  });

  // --- ADMIN PANEL ---
  app.get('/api/admin/overview', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved || resolved.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const db = getDb();
    return res.json({
      users: db.users.map(toSafeUser),
      flaggedPosts: db.communityPosts.filter((p) => p.status === 'flagged'),
      allPostsCount: db.communityPosts.length,
      analytics: {
        totalMembers: db.users.length,
        premiumMembers: db.users.filter((u) => u.subscriptionTier !== 'Free').length,
        under18ProtectedAccounts: db.users.filter((u) => u.isUnder18).length,
        avgStreakDays: Math.round(db.users.reduce((acc, u) => acc + u.streakDays, 0) / Math.max(1, db.users.length)),
      },
    });
  });

  app.post('/api/admin/posts/:id/moderate', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved || resolved.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const db = getDb();
    const post = db.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    const action = req.body?.action;
    if (action === 'approve') {
      post.status = 'approved';
      post.flagReason = undefined;
    } else if (action === 'remove') {
      post.status = 'removed';
    }
    saveDb();
    return res.json({ post });
  });

  app.patch('/api/admin/users/:id/tier', (req, res) => {
    const resolved = resolveUserFromToken(extractBearer(req));
    if (!resolved || resolved.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const db = getDb();
    const target = db.users.find((u) => u.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found.' });
    const { subscriptionTier } = req.body ?? {};
    if (subscriptionTier === 'Free' || subscriptionTier === 'Monthly Premium' || subscriptionTier === 'Annual Premium') {
      target.subscriptionTier = subscriptionTier;
      if (target.role !== 'admin' && target.role !== 'coach') {
        target.role = subscriptionTier === 'Free' ? 'free' : 'premium';
      }
      saveDb();
    }
    return res.json({ user: toSafeUser(target) });
  });

  // --- AI ASSESSMENT & COACH ---
  app.post('/api/ai/assess', async (req, res) => {
    const { notes, goals, stylePreference, consentGiven, imageBase64, imageMimeType, isUnder18 } = req.body ?? {};
    if (imageBase64 && !consentGiven) {
      return res.status(400).json({ error: 'Explicit photo analysis consent is required before uploading an image.' });
    }

    const safety = assessSafetyQuery(String(notes || ''));
    if (!safety.allowProceed) {
      return res.json({
        status: safety.classification === 'medical_boundary' ? 'medical_redirect' : 'safety_redirect',
        safetyBanner: `${safety.headline} — ${safety.guidance}`,
        supportLinks: safety.supportLinks,
        headline: safety.headline,
        photoQualityAndLighting: 'Assessment paused for your safety.',
        groomingAndHairstyleFit: 'Focus strictly on gentle, reversible daily grooming.',
        postureAndOutfitFit: 'Consult a licensed clinician before attempting medical or physical alterations.',
        colorPaletteNote: 'Neutral editorial tones always work calmly and cleanly.',
        strengths: ['Taking time to ask before trying risky methods'],
        improvementOpportunities: ['Partner with a licensed dermatologist or physician for medical questions'],
        priorityActions: ['Stick to gentle cleanser, moisturizer, SPF, sleep, and posture mobility'],
        weeklyRoutineAdjustments: ['Review our Take-a-Break calm mode and mental-health support links if helpful'],
        productCategories: ['Gentle cleanser', 'Broad-spectrum SPF 30+'],
        realisticExpectations: safety.guidance,
        readinessFocus: {
          score: 70,
          label: 'Safety-First Readiness',
          note: 'Consistent safe habits matter far more than risky shortcuts.',
        },
      });
    }

    try {
      const resolved = resolveUserFromToken(extractBearer(req));
      const minorFlag = Boolean(isUnder18 || resolved?.user.isUnder18);
      const assessment = await runStylePhotoAssessment({
        notes: String(notes || ''),
        goals: Array.isArray(goals) ? goals : [],
        stylePreference: String(stylePreference || 'Smart-Casual'),
        isUnder18: minorFlag,
        imageBase64: typeof imageBase64 === 'string' ? imageBase64 : undefined,
        imageMimeType: typeof imageMimeType === 'string' ? imageMimeType : undefined,
      });
      return res.json(assessment);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete AI assessment.';
      return res.status(502).json({ error: message });
    }
  });

  app.post('/api/ai/coach', async (req, res) => {
    const { message, stylePreference, imageBase64, imageMimeType, consentGiven, isUnder18 } = req.body ?? {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Please enter a question for your style & routine coach.' });
    }
    if (imageBase64 && !consentGiven) {
      return res.status(400).json({ error: 'Explicit photo consent is required to analyze a wardrobe photo.' });
    }

    const safety = assessSafetyQuery(String(message));
    if (!safety.allowProceed) {
      return res.json({
        blocked: true,
        classification: safety.classification,
        reply: `${safety.headline}\n\n${safety.guidance}`,
        supportLinks: safety.supportLinks,
      });
    }

    try {
      const resolved = resolveUserFromToken(extractBearer(req));
      const result = await runCoachMessage({
        message: String(message),
        stylePreference: String(stylePreference || 'Smart-Casual'),
        isUnder18: Boolean(isUnder18 || resolved?.user.isUnder18),
        imageBase64: typeof imageBase64 === 'string' ? imageBase64 : undefined,
        imageMimeType: typeof imageMimeType === 'string' ? imageMimeType : undefined,
      });
      return res.json({ blocked: false, reply: result.reply });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unable to reach AI coach.';
      return res.status(502).json({ error: errMsg });
    }
  });

  // --- VITE / STATIC FRONTEND ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex Glow server running on http://localhost:${PORT}`);
  });
}

startServer();
````

## `src/main.tsx`

````tsx
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
````

## `src/index.css`

````css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  :root {
    --font-display: "Cormorant Garamond", Georgia, serif;
    --font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  }

  html {
    font-family: var(--font-sans);
    scroll-behavior: smooth;
  }

  .font-editorial {
    font-family: var(--font-display);
  }

  .font-mono-tabular {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

html.reduce-motion *, html.reduce-motion *::before, html.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
````

## `src/App.tsx`

````tsx
import { useEffect, useState } from 'react';
import { Navbar, type AppView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { RoutineExplorer } from './components/RoutineExplorer';
import { AiAssessment } from './components/AiAssessment';
import { DailyDashboard } from './components/DailyDashboard';
import { ProgressTracker } from './components/ProgressTracker';
import { CommunityHub } from './components/CommunityHub';
import { PricingView } from './components/PricingView';
import { AuthAndAccount } from './components/AuthAndAccount';
import { AdminPanel } from './components/AdminPanel';
import { LegalModal, type LegalTopic } from './components/LegalModal';
import { api, getStoredToken, setStoredToken } from './lib/api';
import type {
  DailyTask,
  PersonalizedBlueprint,
  ProgressEntry,
  QuizAnswers,
  RoutineDomain,
  SafeUser,
  UserSession,
  WeeklyCheckIn,
} from './lib/types';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1') {
      return 'dashboard';
    }
    return 'landing';
  });
  const [routineDomain, setRoutineDomain] = useState<RoutineDomain>('Skincare');
  const [legalTopic, setLegalTopic] = useState<LegalTopic>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [user, setUser] = useState<SafeUser | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [blueprint, setBlueprint] = useState<PersonalizedBlueprint | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  const loadWorkspace = async () => {
    try {
      const ws = await api.getWorkspace();
      setBlueprint(ws.blueprint);
      setQuizAnswers(ws.quizAnswers ?? null);
      setDailyTasks(ws.dailyTasks);
      setWeeklyCheckIns(ws.weeklyCheckIns);
      setProgressEntries(ws.progressEntries);
      if (ws.authenticated && ws.user) {
        setUser(ws.user);
        const me = await api.getMe().catch(() => null);
        if (me) setSessions(me.sessions);
      } else {
        setUser(null);
        setSessions([]);
      }
    } catch {
      // Keep default state if backend unavailable
    } finally {
      setWorkspaceLoaded(true);
    }
  };

  useEffect(() => {
    if (getStoredToken()) {
      loadWorkspace();
    } else {
      loadWorkspace();
    }
  }, []);

  const handleNavigate = (view: AppView, domain?: RoutineDomain) => {
    if (domain) {
      setRoutineDomain(domain);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleAuthSuccess = async (token: string, signedInUser: SafeUser) => {
    setStoredToken(token);
    setUser(signedInUser);
    await loadWorkspace();
    setActiveView('dashboard');
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setStoredToken(null);
    setUser(null);
    setSessions([]);
    await loadWorkspace();
    setActiveView('landing');
  };

  const handleGenerateBlueprint = async (answers: QuizAnswers) => {
    const res = await api.generateBlueprint(answers);
    setQuizAnswers(answers);
    setBlueprint(res.blueprint);
    setDailyTasks(res.dailyTasks);
  };

  const handleToggleTask = async (taskId: string) => {
    const target = dailyTasks.find((t) => t.id === taskId);
    if (!target) return;
    if (!user) {
      setDailyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      return;
    }
    const res = await api.toggleTask(taskId, !target.completed);
    setDailyTasks(res.dailyTasks);
    setUser((prev) => (prev ? { ...prev, streakDays: res.streakDays } : prev));
    if (res.blueprint) setBlueprint(res.blueprint);
  };

  const handleAddCheckIn = async (payload: {
    sleepAvgHours: number;
    trainingSessions: number;
    skincareDays: number;
    confidenceRating: number;
    note: string;
  }) => {
    const res = await api.addCheckIn(payload);
    setWeeklyCheckIns(res.weeklyCheckIns);
  };

  const handleToggleTakeABreak = async () => {
    if (!user) return;
    const res = await api.updateProfile({ takeABreakMode: !user.takeABreakMode });
    setUser(res.user);
  };

  const handleSelectTier = async (tier: SafeUser['subscriptionTier']) => {
    const res = await api.updateProfile({ subscriptionTier: tier });
    setUser(res.user);
  };

  const showWorkspaceToolbar = activeView !== 'landing';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#14171A] dark:bg-[#0D0F12] dark:text-[#F4F2ED]">
      <Navbar activeView={activeView} onNavigate={handleNavigate} user={user} />

      {showWorkspaceToolbar && (
        <div className="border-b border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-[#12151A]">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
            {[
              { label: 'Skin', view: 'routines' as AppView, domain: 'Skincare' as RoutineDomain },
              { label: 'Hair', view: 'routines' as AppView, domain: 'Hair' as RoutineDomain },
              { label: 'Style', view: 'routines' as AppView, domain: 'Style' as RoutineDomain },
              { label: 'Fitness', view: 'routines' as AppView, domain: 'Fitness' as RoutineDomain },
              { label: 'Posture', view: 'routines' as AppView, domain: 'Posture' as RoutineDomain },
              { label: 'AI Assessment', view: 'assessment' as AppView },
              { label: 'Progress', view: 'progress' as AppView },
              { label: 'Pricing', view: 'pricing' as AppView },
              ...(user?.role === 'admin' ? [{ label: 'Admin', view: 'admin' as AppView }] : []),
            ].map((item) => {
              const isSelected =
                activeView === item.view && (!item.domain || routineDomain === item.domain);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.view, item.domain)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                      : 'text-zinc-600 hover:bg-stone-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1">
        {!workspaceLoaded ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="h-64 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/50 dark:bg-[#14171C] animate-pulse" />
          </div>
        ) : (
          <>
            {activeView === 'landing' && (
              <LandingPage
                onNavigate={handleNavigate}
                onOpenLegal={setLegalTopic}
                reducedMotion={reducedMotion}
              />
            )}
            {activeView === 'quiz' && (
              <OnboardingQuiz
                initialAnswers={quizAnswers}
                blueprint={blueprint}
                onGenerateBlueprint={handleGenerateBlueprint}
                onOpenDashboard={() => handleNavigate('dashboard')}
                onOpenRoutines={() => handleNavigate('routines')}
              />
            )}
            {activeView === 'routines' && (
              <RoutineExplorer
                blueprint={blueprint}
                initialDomain={routineDomain}
                onBuildCustomPlan={() => handleNavigate('quiz')}
              />
            )}
            {activeView === 'assessment' && <AiAssessment user={user} quizAnswers={quizAnswers} />}
            {activeView === 'dashboard' && (
              <DailyDashboard
                user={user}
                blueprint={blueprint}
                tasks={dailyTasks}
                weeklyCheckIns={weeklyCheckIns}
                darkMode={darkMode}
                reducedMotion={reducedMotion}
                onToggleDarkMode={() => setDarkMode((d) => !d)}
                onToggleReducedMotion={() => setReducedMotion((r) => !r)}
                onToggleTask={handleToggleTask}
                onAddCheckIn={handleAddCheckIn}
                onToggleTakeABreak={handleToggleTakeABreak}
                onOpenProgress={() => handleNavigate('progress')}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'progress' && (
              <ProgressTracker
                user={user}
                entries={progressEntries}
                onEntriesChange={setProgressEntries}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'community' && (
              <CommunityHub user={user} onOpenAuth={() => handleNavigate('auth')} />
            )}
            {activeView === 'pricing' && (
              <PricingView
                user={user}
                onSelectTier={handleSelectTier}
                onOpenAuth={() => handleNavigate('auth')}
              />
            )}
            {activeView === 'auth' && (
              <AuthAndAccount
                user={user}
                sessions={sessions}
                onAuthSuccess={handleAuthSuccess}
                onUserUpdate={setUser}
                onLogout={handleLogout}
                onOpenAdmin={() => handleNavigate('admin')}
              />
            )}
            {activeView === 'admin' && <AdminPanel user={user} />}
          </>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-zinc-800 bg-[#EFECE5] dark:bg-[#0A0C0E] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-editorial text-xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">Apex Glow</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Become the most confident, polished version of yourself. Reversible, evidence-informed coaching only.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <button type="button" onClick={() => setLegalTopic('terms')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Terms
            </button>
            <button type="button" onClick={() => setLegalTopic('privacy')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={() => setLegalTopic('photo')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Photo/Data Policy
            </button>
            <button type="button" onClick={() => setLegalTopic('contact')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Contact
            </button>
            <button type="button" onClick={() => setLegalTopic('medical')} className="hover:text-zinc-950 dark:hover:text-white cursor-pointer">
              Medical Disclaimer
            </button>
            <button
              type="button"
              onClick={() => setLegalTopic('crisis')}
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Crisis Support
            </button>
          </div>
        </div>
      </footer>

      <LegalModal topic={legalTopic} onClose={() => setLegalTopic(null)} />
    </div>
  );
}
````

## `src/lib/types.ts`

````ts
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
````

## `src/lib/safety.ts`

````ts
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
````

## `src/lib/safety.test.ts`

````ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { assessSafetyQuery, isMinorDob, sanitizeCommunityPost } from './safety';
import { checkPasswordStrength, validateAgeConfirmation, validateEmailFormat } from './authValidation';

test('blocks unsafe practices like bonesmashing, steroids, and extreme fasting', () => {
  const bone = assessSafetyQuery('How do I do bonesmashing for jawline?');
  assert.equal(bone.classification, 'unsafe_practice');
  assert.equal(bone.allowProceed, false);

  const steroids = assessSafetyQuery('Best SARMs or steroid cycle for lean gains');
  assert.equal(steroids.classification, 'unsafe_practice');
  assert.equal(steroids.allowProceed, false);

  const fasting = assessSafetyQuery('Should I try extreme fasting at 500 kcal?');
  assert.equal(fasting.classification, 'unsafe_practice');
  assert.equal(fasting.allowProceed, false);
});

test('redirects medical skin, hair-loss, and cosmetic procedure queries to professionals', () => {
  const acne = assessSafetyQuery('What should I take for severe cystic acne and scarring?');
  assert.equal(acne.classification, 'medical_boundary');
  assert.equal(acne.allowProceed, false);

  const hair = assessSafetyQuery('Should I start finasteride for hair loss?');
  assert.equal(hair.classification, 'medical_boundary');
  assert.equal(hair.allowProceed, false);
});

test('allows safe grooming, style, and posture questions', () => {
  const safe = assessSafetyQuery('What haircut and skincare cleanser fit oily skin and wavy hair?');
  assert.equal(safe.classification, 'safe');
  assert.equal(safe.allowProceed, true);
});

test('rejects rating or mogging language in community posts', () => {
  const badPost = sanitizeCommunityPost('Rate me 1-10', 'Am I mogging or is it over?');
  assert.equal(badPost.allowed, false);

  const goodPost = sanitizeCommunityPost('6-week skincare consistency update', 'Sticking to cleanser and SPF helped a lot.');
  assert.equal(goodPost.allowed, true);
  assert.equal(goodPost.flaggedForModeration, false);
});

test('under-18 DOB detection and auth validation behave accurately', () => {
  const ref = new Date('2026-11-09T00:00:00Z');
  assert.equal(isMinorDob('2010-05-15', ref), true);
  assert.equal(isMinorDob('2000-05-15', ref), false);
  assert.equal(validateEmailFormat('alex@apexglow.app'), true);
  assert.equal(validateEmailFormat('not-an-email'), false);
  assert.equal(checkPasswordStrength('GlowPass2026!').valid, true);
  assert.equal(checkPasswordStrength('weak').valid, false);
  assert.equal(validateAgeConfirmation('2016-01-01', ref).valid, false);
  assert.equal(validateAgeConfirmation('2010-01-01', ref).isUnder18, true);
});
````

## `src/lib/planEngine.ts`

````ts
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
````

## `src/lib/planEngine.test.ts`

````ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadinessScore, generateBlueprint, generateDefaultDailyTasks } from './planEngine';
import type { QuizAnswers } from './types';

test('calculates readiness score within 10..100 without attractiveness scoring', () => {
  const res = calculateReadinessScore({
    streakDays: 14,
    sleepHours: '7–8h',
    skincareDaysPerWeek: 6,
    groomingDaysPerWeek: 5,
    trainingDaysPerWeek: 3,
    styleCheckDone: true,
  });
  assert.ok(res.score >= 70 && res.score <= 95);
  assert.equal(res.breakdown.sleep, 88);
});

test('generates 8 modular routines and 3 phases respecting under-18 safety', () => {
  const answers: QuizAnswers = {
    ageRange: 'under-18',
    genderIdentity: 'Male',
    goals: ['Clearer skin', 'Posture & mobility', 'Confidence & presence'],
    skinType: 'Sensitive',
    hairType: 'Wavy',
    fitnessExperience: 'Beginner',
    budget: 'Budget ($0–$30/mo)',
    minutesPerDay: 30,
    gymAccess: 'Home / Bodyweight',
    sleepHours: '7–8h',
    dietPreference: 'Balanced omnivore',
    sensitivities: 'Fragrance sensitivity',
    medicalConditions: '',
    culturalPreferences: '',
    currentSkincare: 'Water rinse',
    currentGrooming: 'Basic trim',
    stylePreference: 'Minimalist',
    photoConsent: false,
  };

  const bp = generateBlueprint(answers);
  assert.equal(bp.phases.length, 3);
  assert.equal(bp.routines.length, 8);
  const skincare = bp.routines.find((r) => r.domain === 'Skincare');
  assert.ok(skincare?.safetyNote.includes('Avoid harsh acids'));
  assert.ok(generateDefaultDailyTasks(bp).length >= 5);
});
````

## `src/lib/authValidation.ts`

````ts
export interface PasswordStrength {
  valid: boolean;
  score: number;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return {
    valid: checks.minLength && checks.hasUpper && checks.hasLower && checks.hasNumber && checks.hasSymbol,
    score,
    checks,
  };
}

export function validateAgeConfirmation(dob: string, referenceDate = new Date()): {
  valid: boolean;
  age: number | null;
  isUnder18: boolean;
  error?: string;
} {
  if (!dob) {
    return { valid: false, age: null, isUnder18: false, error: 'Date of birth is required for age-appropriate safety.' };
  }
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) {
    return { valid: false, age: null, isUnder18: false, error: 'Please enter a valid date of birth.' };
  }
  let age = referenceDate.getUTCFullYear() - parsed.getUTCFullYear();
  const monthDiff = referenceDate.getUTCMonth() - parsed.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getUTCDate() < parsed.getUTCDate())) {
    age -= 1;
  }
  if (age < 13 || age > 110) {
    return { valid: false, age, isUnder18: age < 18, error: 'Users must be at least 13 years old to create an account.' };
  }
  return { valid: true, age, isUnder18: age < 18 };
}
````

## `src/lib/mediaAssets.ts`

````ts
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
````

## `src/lib/api.ts`

````ts
import type {
  AssessmentResponse,
  CommunityPost,
  DailyTask,
  PersonalizedBlueprint,
  ProgressEntry,
  QuizAnswers,
  SafeUser,
  UserSession,
  WeeklyCheckIn,
} from './types';

const TOKEN_KEY = 'apexglow_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export interface WorkspaceResponse {
  authenticated: boolean;
  user?: SafeUser;
  quizAnswers?: QuizAnswers | null;
  blueprint: PersonalizedBlueprint | null;
  dailyTasks: DailyTask[];
  weeklyCheckIns: WeeklyCheckIn[];
  progressEntries: ProgressEntry[];
}

export const api = {
  getWorkspace: () => apiRequest<WorkspaceResponse>('/api/workspace'),
  getMe: () => apiRequest<{ user: SafeUser; sessions: UserSession[] }>('/api/auth/me'),
  signup: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    country: string;
    pronouns?: string;
  }) =>
    apiRequest<{ token: string; user: SafeUser; verificationCodePreview: string; message: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  verifyEmail: (code: string) =>
    apiRequest<{ user: SafeUser }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  login: (payload: { email?: string; password?: string; provider?: 'Google' | 'Apple' }) =>
    apiRequest<{
      token?: string;
      user?: SafeUser;
      requiresTwoFactor?: boolean;
      email?: string;
      twoFactorCodePreview?: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  verify2fa: (email: string, code: string) =>
    apiRequest<{ token: string; user: SafeUser }>('/api/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string; resetTokenPreview?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (email: string, resetToken: string, newPassword: string) =>
    apiRequest<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, newPassword }),
    }),
  logout: () => apiRequest<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  logoutAll: () => apiRequest<{ ok: boolean }>('/api/auth/logout-all', { method: 'POST' }),
  updateProfile: (payload: Partial<SafeUser>) =>
    apiRequest<{ user: SafeUser }>('/api/account/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ ok: boolean; message: string }>('/api/account/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  toggle2fa: () => apiRequest<{ user: SafeUser }>('/api/account/toggle-2fa', { method: 'POST' }),
  exportData: () => apiRequest<Record<string, unknown>>('/api/account/export'),
  deleteAccount: () => apiRequest<{ ok: boolean }>('/api/account', { method: 'DELETE' }),
  generateBlueprint: (answers: QuizAnswers) =>
    apiRequest<{ blueprint: PersonalizedBlueprint; dailyTasks: DailyTask[] }>('/api/blueprint', {
      method: 'POST',
      body: JSON.stringify(answers),
    }),
  toggleTask: (taskId: string, completed?: boolean) =>
    apiRequest<{ dailyTasks: DailyTask[]; streakDays: number; blueprint?: PersonalizedBlueprint }>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  addCheckIn: (payload: {
    sleepAvgHours: number;
    trainingSessions: number;
    skincareDays: number;
    confidenceRating: number;
    note: string;
  }) =>
    apiRequest<{ weeklyCheckIns: WeeklyCheckIn[] }>('/api/checkins', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  addProgressEntry: (payload: {
    label: string;
    chestOrPostureNote: string;
    waistOrFitNote: string;
    sleepHours: number;
    photoDataUrl?: string;
    notes: string;
  }) =>
    apiRequest<{ progressEntries: ProgressEntry[] }>('/api/progress', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProgressEntry: (id: string, payload: { photoBlurred?: boolean; isPrivate?: boolean }) =>
    apiRequest<{ progressEntries: ProgressEntry[] }>(`/api/progress/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteProgressEntry: (id: string) =>
    apiRequest<{ progressEntries: ProgressEntry[] }>(`/api/progress/${id}`, {
      method: 'DELETE',
    }),
  getCommunity: () => apiRequest<{ posts: CommunityPost[] }>('/api/community'),
  createPost: (payload: {
    category: CommunityPost['category'];
    title: string;
    body: string;
    blurFaceByDefault: boolean;
    hasPhoto: boolean;
  }) =>
    apiRequest<{ post: CommunityPost; flaggedForReview: boolean; message: string }>('/api/community', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  markPostHelpful: (id: string) =>
    apiRequest<{ post: CommunityPost }>(`/api/community/${id}/helpful`, { method: 'POST' }),
  reportPost: (id: string, reason: string) =>
    apiRequest<{ ok: boolean; message: string }>(`/api/community/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getAdminOverview: () =>
    apiRequest<{
      users: SafeUser[];
      flaggedPosts: CommunityPost[];
      allPostsCount: number;
      analytics: {
        totalMembers: number;
        premiumMembers: number;
        under18ProtectedAccounts: number;
        avgStreakDays: number;
      };
    }>('/api/admin/overview'),
  moderatePost: (id: string, action: 'approve' | 'remove') =>
    apiRequest<{ post: CommunityPost }>(`/api/admin/posts/${id}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),
  updateUserTier: (userId: string, subscriptionTier: SafeUser['subscriptionTier']) =>
    apiRequest<{ user: SafeUser }>(`/api/admin/users/${userId}/tier`, {
      method: 'PATCH',
      body: JSON.stringify({ subscriptionTier }),
    }),
  runAiAssessment: (payload: {
    notes: string;
    goals: string[];
    stylePreference: string;
    consentGiven: boolean;
    imageBase64?: string;
    imageMimeType?: string;
    isUnder18?: boolean;
  }) =>
    apiRequest<AssessmentResponse & { supportLinks?: Array<{ label: string; detail: string }> }>('/api/ai/assess', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  askCoach: (payload: {
    message: string;
    stylePreference: string;
    consentGiven?: boolean;
    imageBase64?: string;
    imageMimeType?: string;
    isUnder18?: boolean;
  }) =>
    apiRequest<{ blocked: boolean; classification?: string; reply: string; supportLinks?: Array<{ label: string; detail: string }> }>(
      '/api/ai/coach',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
};
````

## `src/server/store.ts`

````ts
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
````

## `src/server/gemini.ts`

````ts
import { GoogleGenAI, Type } from '@google/genai';
import type { AssessmentResponse } from '../lib/types';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function runStylePhotoAssessment(params: {
  notes: string;
  goals: string[];
  stylePreference: string;
  isUnder18: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<AssessmentResponse> {
  const ai = getGeminiClient();

  const systemInstruction = [
    'You are an encouraging, practical, safety-first personal style, grooming, and presentation coach for Apex Glow.',
    'Analyze ONLY reversible, low-risk presentation elements: lighting, camera framing, grooming neatness, hairstyle suitability, posture cues, outfit fit, and color palette.',
    'CRITICAL ETHICS RULES:',
    '- NEVER output an attractiveness score, 1-10 rating, facial bone critique, or shaming language.',
    '- NEVER recommend bonesmashing, steroids, SARMs, unregulated injectables, extreme fasting, or cosmetic surgery.',
    '- NEVER provide medical diagnoses. If acne, hair loss, moles, or scarring are mentioned, advise seeing a board-certified dermatologist.',
    params.isUnder18
      ? '- The user is under 18: restrict all advice to gentle cleansing, sunscreen, posture, sleep, school-appropriate fitness, and clean wardrobe fit.'
      : '',
    '- Keep tone supportive, realistic, editorial, and concise.',
  ]
    .filter(Boolean)
    .join('\n');

  const promptText = `Please provide a structured, non-diagnostic presentation & style review.
User goals: ${params.goals.join(', ') || 'General polish'}
Preferred aesthetic: ${params.stylePreference || 'Smart-Casual'}
User context & questions: ${params.notes || 'Looking for practical feedback on lighting, grooming, haircut framing, posture, and outfit fit.'}`;

  const contents = params.imageBase64 && params.imageMimeType
    ? {
        parts: [
          {
            inlineData: {
              mimeType: params.imageMimeType,
              data: params.imageBase64,
            },
          },
          { text: promptText },
        ],
      }
    : promptText;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          photoQualityAndLighting: { type: Type.STRING },
          groomingAndHairstyleFit: { type: Type.STRING },
          postureAndOutfitFit: { type: Type.STRING },
          colorPaletteNote: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          weeklyRoutineAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
          productCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
          realisticExpectations: { type: Type.STRING },
          readinessScore: { type: Type.INTEGER },
          readinessNote: { type: Type.STRING },
        },
        required: [
          'headline',
          'photoQualityAndLighting',
          'groomingAndHairstyleFit',
          'postureAndOutfitFit',
          'colorPaletteNote',
          'strengths',
          'improvementOpportunities',
          'priorityActions',
          'weeklyRoutineAdjustments',
          'productCategories',
          'realisticExpectations',
          'readinessScore',
          'readinessNote',
        ],
      },
    },
  });

  const rawText = (response.text ?? '').trim();
  if (!rawText) {
    throw new Error('Empty response from Gemini assessment model.');
  }

  const parsed = JSON.parse(rawText) as {
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
    readinessScore: number;
    readinessNote: string;
  };

  return {
    status: 'ok',
    headline: parsed.headline,
    photoQualityAndLighting: parsed.photoQualityAndLighting,
    groomingAndHairstyleFit: parsed.groomingAndHairstyleFit,
    postureAndOutfitFit: parsed.postureAndOutfitFit,
    colorPaletteNote: parsed.colorPaletteNote,
    strengths: parsed.strengths,
    improvementOpportunities: parsed.improvementOpportunities,
    priorityActions: parsed.priorityActions,
    weeklyRoutineAdjustments: parsed.weeklyRoutineAdjustments,
    productCategories: parsed.productCategories,
    realisticExpectations: parsed.realisticExpectations,
    readinessFocus: {
      score: Math.max(40, Math.min(98, parsed.readinessScore || 78)),
      label: 'Glow-Up Readiness Focus',
      note: parsed.readinessNote,
    },
  };
}

export async function runCoachMessage(params: {
  message: string;
  stylePreference: string;
  isUnder18: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<{ reply: string }> {
  const ai = getGeminiClient();

  const systemInstruction = [
    'You are an encouraging Apex Glow style, skincare-habit, grooming, fitness, and posture coach.',
    'Keep responses concise (3-5 clear bullet points or 2 short paragraphs), practical, and reversible-habit focused.',
    'NEVER provide attractiveness ratings, medical diagnosis, steroid/peptide advice, extreme fasting, or unsafe physical alteration advice.',
    params.isUnder18
      ? 'The user is under 18: stick strictly to gentle hygiene, SPF, posture, balanced nutrition, and age-appropriate style.'
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const promptText = `User style preference: ${params.stylePreference || 'Smart-Casual'}\nQuestion: ${params.message}`;

  const contents = params.imageBase64 && params.imageMimeType
    ? {
        parts: [
          {
            inlineData: {
              mimeType: params.imageMimeType,
              data: params.imageBase64,
            },
          },
          { text: promptText },
        ],
      }
    : promptText;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
    },
  });

  const text = (response.text ?? '').trim();
  if (!text) {
    throw new Error('Empty response from Gemini coach model.');
  }
  return { reply: text };
}
````

## `src/components/Navbar.tsx`

````tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { RoutineDomain, SafeUser } from '../lib/types';

export type AppView =
  | 'landing'
  | 'quiz'
  | 'routines'
  | 'assessment'
  | 'dashboard'
  | 'progress'
  | 'community'
  | 'pricing'
  | 'auth'
  | 'admin';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView, routineDomain?: RoutineDomain) => void;
  user: SafeUser | null;
}

export function Navbar({ activeView, onNavigate, user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryNav: Array<{ label: string; view: AppView }> = [
    { label: 'Home', view: 'landing' },
    { label: 'Glow-Up Plan', view: 'quiz' },
    { label: 'Routines', view: 'routines' },
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Community', view: 'community' },
  ];

  const handleNav = (view: AppView, domain?: RoutineDomain) => {
    setMobileOpen(false);
    onNavigate(view, domain);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-zinc-800/90 bg-[#F6F4EF]/95 dark:bg-[#0D0F12]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-editorial text-2xl font-semibold tracking-tight text-zinc-900 dark:text-[#F4F2ED] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
        >
          Apex Glow
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {primaryNav.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500 ${
                  isActive
                    ? 'border-teal-500 text-zinc-950 dark:text-[#F4F2ED]'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-[#F4F2ED]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action on desktop + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav(user ? 'auth' : 'auth')}
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
          >
            {user ? 'Account' : 'Login'}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-stone-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-stone-200 dark:border-zinc-800 bg-[#F6F4EF] dark:bg-[#0D0F12] px-4 py-4 space-y-1"
        >
          {[
            { label: 'Home', view: 'landing' as AppView },
            { label: 'Glow-Up Plan', view: 'quiz' as AppView },
            { label: 'Skin', view: 'routines' as AppView, domain: 'Skincare' as RoutineDomain },
            { label: 'Hair', view: 'routines' as AppView, domain: 'Hair' as RoutineDomain },
            { label: 'Style', view: 'routines' as AppView, domain: 'Style' as RoutineDomain },
            { label: 'Fitness', view: 'routines' as AppView, domain: 'Fitness' as RoutineDomain },
            { label: 'Posture', view: 'routines' as AppView, domain: 'Posture' as RoutineDomain },
            { label: 'AI Assessment', view: 'assessment' as AppView },
            { label: 'Daily Dashboard', view: 'dashboard' as AppView },
            { label: 'Progress Tracker', view: 'progress' as AppView },
            { label: 'Community', view: 'community' as AppView },
            { label: 'Pricing', view: 'pricing' as AppView },
            ...(user?.role === 'admin' ? [{ label: 'Admin Console', view: 'admin' as AppView }] : []),
            { label: user ? `Account (${user.fullName.split(' ')[0]})` : 'Login / Sign Up', view: 'auth' as AppView },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item.view, item.domain)}
              className="flex w-full items-center justify-between rounded-lg px-3 min-h-[44px] text-left text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-200/70 dark:hover:bg-zinc-800/70 cursor-pointer"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
````

## `src/components/LegalModal.tsx`

````tsx
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
````

## `src/components/LandingPage.tsx`

````tsx
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
````

## `src/components/OnboardingQuiz.tsx`

````tsx
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
````

## `src/components/RoutineExplorer.tsx`

````tsx
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
````

## `src/components/AiAssessment.tsx`

````tsx
import { useState } from 'react';
import { Camera, MessageSquare, ShieldAlert, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { assessSafetyQuery } from '../lib/safety';
import type { AssessmentResponse, QuizAnswers, SafeUser } from '../lib/types';

interface AiAssessmentProps {
  user: SafeUser | null;
  quizAnswers: QuizAnswers | null;
}

export function AiAssessment({ user, quizAnswers }: AiAssessmentProps) {
  const [notes, setNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(Boolean(user?.photoConsent));
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    (AssessmentResponse & { supportLinks?: Array<{ label: string; detail: string }> }) | null
  >(null);

  // Coach Q&A state
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [coachResponse, setCoachResponse] = useState<{
    blocked: boolean;
    reply: string;
    supportLinks?: Array<{ label: string; detail: string }>;
  } | null>(null);

  const liveSafety = assessSafetyQuery(notes);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid PNG or JPG image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        setImagePreviewUrl(dataUrl);
        setImageBase64(dataUrl.slice(commaIdx + 1));
        setImageMimeType(file.type);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setImageBase64(undefined);
    setImageMimeType(undefined);
    setImagePreviewUrl(undefined);
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (imageBase64 && !consentGiven) {
      setError('Please confirm explicit photo analysis consent before submitting an image.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.runAiAssessment({
        notes:
          notes.trim() ||
          'Evaluate natural lighting, camera framing, haircut suitability, posture cues, and smart-casual fit.',
        goals: quizAnswers?.goals || ['Clearer skin', 'Wardrobe & fit', 'Posture & mobility'],
        stylePreference: quizAnswers?.stylePreference || 'Smart-Casual',
        consentGiven,
        imageBase64,
        imageMimeType,
        isUnder18: user?.isUnder18,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoachError(null);
    if (!coachQuestion.trim()) {
      setCoachError('Please enter a question for the coach.');
      return;
    }
    setCoachLoading(true);
    try {
      const res = await api.askCoach({
        message: coachQuestion,
        stylePreference: quizAnswers?.stylePreference || 'Smart-Casual',
        consentGiven,
        isUnder18: user?.isUnder18,
      });
      setCoachResponse(res);
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'Unable to reach AI coach.');
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
          Non-Diagnostic AI Style & Presentation Review
        </p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Lighting, framing, grooming & outfit assessment
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          Upload an optional photo with explicit consent or describe your current routine. We never score facial
          attractiveness or diagnose medical conditions—feedback focuses on controllable lighting, grooming, posture,
          and garment fit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Assessment Input Form */}
        <form
          onSubmit={handleRunAssessment}
          className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-6"
        >
          <div className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Photo & presentation guidelines
            </h2>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Recommended framing: front-facing, side profile, or full-body photo · neutral relaxed expression · soft
              natural window light · zero filters. Photos are processed only for this session and never sold.
            </p>
          </div>

          {/* Optional Photo Upload */}
          <div className="space-y-3">
            <label
              htmlFor="assessment-photo-input"
              className="flex items-center justify-between rounded-lg border border-dashed border-stone-300 dark:border-zinc-700 p-4 cursor-pointer hover:border-teal-500/60"
            >
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {imagePreviewUrl ? 'Replace optional photo' : 'Upload optional photo (JPG / PNG)'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Private session only — clear immediately at any time
                  </p>
                </div>
              </div>
              <input
                id="assessment-photo-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </label>

            {imagePreviewUrl && (
              <div className="flex items-center justify-between rounded-lg border border-stone-200 dark:border-zinc-800 p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded presentation preview"
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Photo attached privately</span>
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Delete uploaded photo immediately"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div>
            <label htmlFor="assessment-notes" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
              What would you like feedback on?
            </label>
            <textarea
              id="assessment-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: Check my smart-casual overshirt fit, wavy hair volume, and window lighting for a natural portrait."
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Real-Time Safety Guardrail Alert */}
          {!liveSafety.allowProceed && (
            <div
              role="alert"
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 space-y-2 text-sm text-zinc-900 dark:text-amber-100"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{liveSafety.headline}</span>
              </div>
              <p className="text-xs leading-relaxed">{liveSafety.guidance}</p>
            </div>
          )}

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-[#0D0F12] p-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-teal-600"
            />
            <span className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              I consent to AI presentation feedback and understand Apex Glow provides non-medical guidance only (no
              attractiveness ratings or diagnostic claims).
            </span>
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Analyzing Presentation...' : 'Run Non-Diagnostic AI Assessment'}
          </button>
        </form>

        {/* Results & Outfit Coach */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-5">
              {result.safetyBanner && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-zinc-900 dark:text-amber-100">
                  {result.safetyBanner}
                </div>
              )}

              <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Assessment Summary</p>
                  <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
                    {result.headline}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{result.readinessFocus.label}</p>
                  <p className="font-mono-tabular text-2xl font-semibold text-teal-600 dark:text-teal-400">
                    {result.readinessFocus.score}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Lighting & Framing</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.photoQualityAndLighting}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Grooming & Hairstyle Fit</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.groomingAndHairstyleFit}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Posture & Outfit Fit</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.postureAndOutfitFit}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Color Palette</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">{result.colorPaletteNote}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-stone-200 dark:border-zinc-800 pt-4 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-semibold text-teal-700 dark:text-teal-400">Strengths</p>
                  <ul className="mt-1.5 space-y-1 text-zinc-700 dark:text-zinc-300">
                    {result.strengths.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-[#E5BE6E]">Priority Actions</p>
                  <ul className="mt-1.5 space-y-1 text-zinc-700 dark:text-zinc-300">
                    {result.priorityActions.map((a) => (
                      <li key={a}>· {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="border-t border-stone-200 dark:border-zinc-800 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {result.realisticExpectations}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-3">
              <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                What your assessment covers
              </h2>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>· Photo quality, camera angle & natural window lighting</li>
                <li>· Haircut proportion & clean beard/brow grooming cues</li>
                <li>· Shoulder alignment, posture carriage & collar/sleeve fit</li>
                <li>· Strengths, next-step weekly actions & realistic timelines</li>
              </ul>
            </div>
          )}

          {/* AI Style & Routine Coach */}
          <form
            onSubmit={handleAskCoach}
            className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                AI Style & Habit Coach
              </h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                aria-label="Ask the AI style and habit coach"
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="Ask about capsule outfits, barber scripts, or evening posture resets..."
                className="flex-1 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={coachLoading}
                className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {coachLoading ? 'Thinking...' : 'Ask Coach'}
              </button>
            </div>
            {coachError && <p className="text-xs text-red-600 dark:text-red-400">{coachError}</p>}
            {coachResponse && (
              <div
                className={`rounded-lg border p-4 text-sm whitespace-pre-line ${
                  coachResponse.blocked
                    ? 'border-amber-500/40 bg-amber-500/10 text-zinc-900 dark:text-amber-100'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-[#0D0F12] text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {coachResponse.reply}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
````

## `src/components/DailyDashboard.tsx`

````tsx
import { useState } from 'react';
import { Check, Moon, PauseCircle, Sun } from 'lucide-react';
import type { DailyTask, PersonalizedBlueprint, SafeUser, WeeklyCheckIn } from '../lib/types';

interface DailyDashboardProps {
  user: SafeUser | null;
  blueprint: PersonalizedBlueprint | null;
  tasks: DailyTask[];
  weeklyCheckIns: WeeklyCheckIn[];
  darkMode: boolean;
  reducedMotion: boolean;
  onToggleDarkMode: () => void;
  onToggleReducedMotion: () => void;
  onToggleTask: (taskId: string) => Promise<void>;
  onAddCheckIn: (payload: {
    sleepAvgHours: number;
    trainingSessions: number;
    skincareDays: number;
    confidenceRating: number;
    note: string;
  }) => Promise<void>;
  onToggleTakeABreak: () => Promise<void>;
  onOpenProgress: () => void;
  onOpenAuth: () => void;
}

export function DailyDashboard({
  user,
  blueprint,
  tasks,
  weeklyCheckIns,
  darkMode,
  reducedMotion,
  onToggleDarkMode,
  onToggleReducedMotion,
  onToggleTask,
  onAddCheckIn,
  onToggleTakeABreak,
  onOpenProgress,
  onOpenAuth,
}: DailyDashboardProps) {
  const [sleepAvgHours, setSleepAvgHours] = useState(7.5);
  const [trainingSessions, setTrainingSessions] = useState(3);
  const [skincareDays, setSkincareDays] = useState(6);
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const adherencePct = Math.round((completedCount / Math.max(1, tasks.length)) * 100);
  const readinessScore = blueprint?.readinessScore ?? 76;
  const breakdown = blueprint?.readinessBreakdown ?? {
    consistency: 74,
    sleep: 84,
    skincareAdherence: adherencePct,
    grooming: 78,
    training: 75,
    styleHabits: 82,
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await onAddCheckIn({
        sleepAvgHours,
        trainingSessions,
        skincareDays,
        confidenceRating,
        note,
      });
      setNote('');
      setFeedback('Weekly check-in saved.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Unable to save check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Daily Habit & Consistency Dashboard
          </p>
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
            {user ? `Welcome back, ${user.fullName.split(' ')[0]}` : 'Daily Habit Workspace'}
          </h1>
        </div>

        {/* Workspace Controls: Dark/Light, Reduced Motion, Take-a-Break */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleReducedMotion}
            className="rounded-lg border border-stone-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {reducedMotion ? 'Motion: Reduced' : 'Reduce Motion'}
          </button>

          <button
            type="button"
            onClick={user ? onToggleTakeABreak : onOpenAuth}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              user?.takeABreakMode
                ? 'bg-amber-500 text-zinc-950'
                : 'border border-amber-500/40 text-amber-800 dark:text-[#E5BE6E] hover:bg-amber-500/10'
            }`}
          >
            <PauseCircle className="h-3.5 w-3.5" />
            <span>{user?.takeABreakMode ? 'Take-a-Break Active' : 'Take a Break Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenProgress}
            className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            Progress Photos & Timeline
          </button>
        </div>
      </div>

      {user?.takeABreakMode && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-zinc-800 dark:text-amber-100">
          Take-a-Break Mode is active. Streak pressure and reminders are paused—rest, step away from mirrors or screens,
          and resume whenever you feel ready.
        </div>
      )}

      {!user && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Preview mode: Sign in or use the Demo Member login to save task streaks and weekly check-ins permanently.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="self-start rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer whitespace-nowrap shrink-0"
          >
            Sign In / Demo Member
          </button>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Glow-Up Readiness Score</p>
          <p className="font-mono-tabular text-4xl font-semibold text-teal-700 dark:text-teal-400 mt-1">
            {readinessScore}
            <span className="text-base text-zinc-500">/100</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Habits & consistency index</p>
        </div>

        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Active Routine Streak</p>
          <p className="font-mono-tabular text-4xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
            {user?.streakDays ?? 1} <span className="text-base font-normal text-zinc-500">days</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {user?.takeABreakMode ? 'Paused gently' : 'Steady daily momentum'}
          </p>
        </div>

        <div className="rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Today’s Adherence</p>
          <p className="font-mono-tabular text-4xl font-semibold text-amber-800 dark:text-[#E5BE6E] mt-1">
            {adherencePct}%
          </p>
          <p className="font-mono-tabular mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {completedCount} of {tasks.length} habits completed
          </p>
        </div>
      </div>

      {/* Main Split: Daily Habit Checklist + Readiness Breakdown / Weekly Check-In */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-stone-300/80 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Today’s Habit Checklist
          </h2>
          <div className="divide-y divide-stone-200 dark:divide-zinc-800">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-pressed={task.completed}
                  className="flex flex-1 items-start gap-3 text-left cursor-pointer group"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      task.completed
                        ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500 dark:text-zinc-950'
                        : 'border-stone-400 dark:border-zinc-600 group-hover:border-teal-500'
                    }`}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    <span
                      className={`block text-sm font-medium ${
                        task.completed
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                      {task.domain} · {task.cadence} · <span className="font-mono-tabular">{task.durationMinutes} min</span>
                      {task.completed ? ' · Completed' : ''}
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Readiness Breakdown */}
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Readiness Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Consistency', val: breakdown.consistency },
                { label: 'Sleep Rhythm', val: breakdown.sleep },
                { label: 'Skincare Adherence', val: breakdown.skincareAdherence },
                { label: 'Grooming & Oral Care', val: breakdown.grooming },
                { label: 'Training & Mobility', val: breakdown.training },
                { label: 'Style & Fit Habits', val: breakdown.styleHabits },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                    <span className="font-mono-tabular text-zinc-600 dark:text-zinc-400">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-teal-600 dark:bg-teal-400"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Check-In Form */}
          <form
            onSubmit={handleCheckInSubmit}
            className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Log Weekly Check-In
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label htmlFor="chk-sleep" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Avg sleep (hrs)
                </label>
                <input
                  id="chk-sleep"
                  type="number"
                  step="0.5"
                  min={4}
                  max={12}
                  value={sleepAvgHours}
                  onChange={(e) => setSleepAvgHours(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-train" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Workouts this week
                </label>
                <input
                  id="chk-train"
                  type="number"
                  min={0}
                  max={7}
                  value={trainingSessions}
                  onChange={(e) => setTrainingSessions(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-skin" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Skincare days (0–7)
                </label>
                <input
                  id="chk-skin"
                  type="number"
                  min={0}
                  max={7}
                  value={skincareDays}
                  onChange={(e) => setSkincareDays(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-conf" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Confidence (1–5)
                </label>
                <input
                  id="chk-conf"
                  type="number"
                  min={1}
                  max={5}
                  value={confidenceRating}
                  onChange={(e) => setConfidenceRating(Number(e.target.value))}
                  className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="chk-note" className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                Reflection note
              </label>
              <input
                id="chk-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What felt easiest to stay consistent with?"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
            {feedback && <p className="text-xs text-teal-600 dark:text-teal-400">{feedback}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save Weekly Check-In'}
            </button>

            {weeklyCheckIns.length > 0 && (
              <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 space-y-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Recent Check-Ins</p>
                {weeklyCheckIns.slice(0, 3).map((chk) => (
                  <div key={chk.id} className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono-tabular font-medium text-zinc-800 dark:text-zinc-200">{chk.date}</span> ·{' '}
                    {chk.sleepAvgHours}h sleep · {chk.trainingSessions} workouts · {chk.note || 'Logged'}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
````

## `src/components/ProgressTracker.tsx`

````tsx
import { useState } from 'react';
import { Eye, EyeOff, Lock, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { EDITORIAL_MEDIA } from '../lib/mediaAssets';
import type { ProgressEntry, SafeUser } from '../lib/types';

interface ProgressTrackerProps {
  user: SafeUser | null;
  entries: ProgressEntry[];
  onEntriesChange: (next: ProgressEntry[]) => void;
  onOpenAuth: () => void;
}

export function ProgressTracker({ user, entries, onEntriesChange, onOpenAuth }: ProgressTrackerProps) {
  const [label, setLabel] = useState('');
  const [chestOrPostureNote, setChestOrPostureNote] = useState('');
  const [waistOrFitNote, setWaistOrFitNote] = useState('');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [notes, setNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [leftId, setLeftId] = useState<string>(entries[1]?.id || entries[0]?.id || '');
  const [rightId, setRightId] = useState<string>(entries[0]?.id || '');

  const leftEntry = entries.find((e) => e.id === leftId) || entries[entries.length - 1];
  const rightEntry = entries.find((e) => e.id === rightId) || entries[0];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setError(null);
    if (!label.trim()) {
      setError('Please enter a milestone label (e.g., Week 4 Check-In).');
      return;
    }
    setSaving(true);
    try {
      const res = await api.addProgressEntry({
        label,
        chestOrPostureNote,
        waistOrFitNote,
        sleepHours,
        photoDataUrl,
        notes,
      });
      onEntriesChange(res.progressEntries);
      setLabel('');
      setChestOrPostureNote('');
      setWaistOrFitNote('');
      setNotes('');
      setPhotoDataUrl(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save progress entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBlur = async (entry: ProgressEntry) => {
    try {
      const res = await api.updateProgressEntry(entry.id, { photoBlurred: !entry.photoBlurred });
      onEntriesChange(res.progressEntries);
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteProgressEntry(id);
      onEntriesChange(res.progressEntries);
    } catch {
      // Ignore
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
          Private Progress Timeline & Side-by-Side Comparison
        </p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Your personal consistency timeline
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          Progress photos are private by default. Results vary based on genetics, consistency, health, and starting
          point. This platform does not guarantee specific physical changes.
        </p>
      </div>

      {/* Side-by-side Comparison */}
      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Side-by-side comparison
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Lock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Private by default · Immediate deletion enabled</span>
          </div>
        </div>

        {entries.length >= 2 && leftEntry && rightEntry ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cmp-left" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Earlier milestone
                </label>
                <select
                  id="cmp-left"
                  value={leftEntry.id}
                  onChange={(e) => setLeftId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                >
                  {entries.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.label} ({ent.date})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cmp-right" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Later milestone
                </label>
                <select
                  id="cmp-right"
                  value={rightEntry.id}
                  onChange={(e) => setRightId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                >
                  {entries.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.label} ({ent.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[leftEntry, rightEntry].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="rounded-lg border border-stone-200 dark:border-zinc-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">{item.label}</p>
                    <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">{item.date}</span>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                    <img
                      src={item.photoDataUrl || (idx === 0 ? EDITORIAL_MEDIA.beforeSkinGrooming : EDITORIAL_MEDIA.skinGrooming)}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover object-top transition-all ${item.photoBlurred ? 'blur-md scale-105' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleBlur(item)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
                    >
                      {item.photoBlurred ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      <span>{item.photoBlurred ? 'Unblur Preview' : 'Blur Photo'}</span>
                    </button>
                  </div>
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <p>Posture: {item.chestOrPostureNote}</p>
                    <p>Wardrobe Fit: {item.waistOrFitNote}</p>
                    <p className="font-mono-tabular">
                      Sleep: {item.sleepHours}h · Streak: {item.streakSnapshot} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Log at least two milestone check-ins below (or sign in as Demo Member) to compare progress side by side.
          </p>
        )}
      </div>

      {/* Add Progress Entry + Timeline */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <form
          onSubmit={handleAddEntry}
          className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4"
        >
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Add progress check-in
          </h2>

          <div>
            <label htmlFor="prog-label" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Milestone label
            </label>
            <input
              id="prog-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Week 8 Consistency Review"
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="prog-posture" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Posture observation
              </label>
              <input
                id="prog-posture"
                type="text"
                value={chestOrPostureNote}
                onChange={(e) => setChestOrPostureNote(e.target.value)}
                placeholder="e.g., Shoulders relaxed & level"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="prog-fit" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Fit / grooming note
              </label>
              <input
                id="prog-fit"
                type="text"
                value={waistOrFitNote}
                onChange={(e) => setWaistOrFitNote(e.target.value)}
                placeholder="e.g., Tapered jacket fit"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prog-sleep" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Average sleep (hours)
            </label>
            <input
              id="prog-sleep"
              type="number"
              step="0.5"
              min={4}
              max={12}
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="font-mono-tabular w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="prog-photo" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Optional private photo (stored blurred by default)
            </label>
            <input
              id="prog-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="w-full text-xs text-zinc-600 dark:text-zinc-400"
            />
          </div>

          <div>
            <label htmlFor="prog-notes" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Journal notes
            </label>
            <textarea
              id="prog-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Energy, skin comfort, routine adherence notes..."
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
          >
            {saving ? 'Saving Entry...' : 'Save Private Check-In'}
          </button>
        </form>

        <div className="lg:col-span-7 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Saved Timeline ({entries.length})
          </h2>
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No entries logged yet.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-zinc-800">
              {entries.map((entry) => (
                <div key={entry.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">
                      {entry.label}{' '}
                      <span className="font-mono-tabular text-xs font-normal text-zinc-500">· {entry.date}</span>
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {entry.chestOrPostureNote} · {entry.waistOrFitNote}
                    </p>
                    {entry.notes && <p className="text-xs text-zinc-700 dark:text-zinc-300">{entry.notes}</p>}
                  </div>
                  {user && (
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      aria-label={`Delete ${entry.label}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
````

## `src/components/CommunityHub.tsx`

````tsx
import { useEffect, useState } from 'react';
import { Flag, ThumbsUp } from 'lucide-react';
import { api } from '../lib/api';
import { EDITORIAL_MEDIA, EXPERT_ARTICLES } from '../lib/mediaAssets';
import type { CommunityPost, SafeUser } from '../lib/types';

interface CommunityHubProps {
  user: SafeUser | null;
  onOpenAuth: () => void;
}

export function CommunityHub({ user, onOpenAuth }: CommunityHubProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [articleFilter, setArticleFilter] = useState<string>('All');
  const [category, setCategory] = useState<CommunityPost['category']>('Routine Win');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [blurFaceByDefault, setBlurFaceByDefault] = useState(true);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      const res = await api.getCommunity();
      setPosts(res.posts);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setError(null);
    setMessage(null);
    setPosting(true);
    try {
      const res = await api.createPost({
        category,
        title,
        body,
        blurFaceByDefault,
        hasPhoto: false,
      });
      setMessage(res.message);
      setTitle('');
      setBody('');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish post.');
    } finally {
      setPosting(false);
    }
  };

  const handleHelpful = async (id: string) => {
    try {
      const res = await api.markPostHelpful(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? res.post : p)));
    } catch {
      // Ignore
    }
  };

  const handleReport = async (id: string) => {
    try {
      const res = await api.reportPost(id, 'Member flagged post for safety or anti-rating review.');
      setMessage(res.message);
      await loadPosts();
    } catch {
      // Ignore
    }
  };

  const filteredArticles =
    articleFilter === 'All' ? EXPERT_ARTICLES : EXPERT_ARTICLES.filter((a) => a.category === articleFilter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Moderated Community & Advisory Coaching
          </p>
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
            Expert guides, habit wins & safe Q&A
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Zero attractiveness rating, zero shaming, and faces blurred by default on community shares.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] px-4 py-3">
          <img
            src={EDITORIAL_MEDIA.coachAvatar}
            alt="Lead style and wellness coach portrait"
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Dr. Maya Patel & Advisory Team</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Moderated Q&A · Safety reviewed</p>
          </div>
        </div>
      </div>

      {/* Expert Articles */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Editorial Guides
          </h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Skincare', 'Hair', 'Style', 'Posture'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setArticleFilter(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                  articleFilter === cat
                    ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-zinc-950'
                    : 'border border-stone-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-3"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {art.category} · {art.readTime} · {art.minTier}
              </p>
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">{art.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{art.summary}</p>
              <ul className="space-y-1 border-t border-stone-200 dark:border-zinc-800 pt-3 text-xs text-zinc-700 dark:text-zinc-300">
                {art.keyTakeaways.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                {art.author} — {art.role}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Community Feed + Composer */}
      <div className="grid grid-cols-1 gap-8 border-t border-stone-200 dark:border-zinc-800 pt-10 lg:grid-cols-12">
        <form
          onSubmit={handleCreatePost}
          className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4 self-start"
        >
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Share a routine win or question
          </h2>
          <div>
            <label htmlFor="comm-cat" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Category
            </label>
            <select
              id="comm-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityPost['category'])}
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            >
              <option value="Routine Win">Routine Win</option>
              <option value="Style Check">Style Check</option>
              <option value="Hair & Grooming">Hair & Grooming</option>
              <option value="Posture & Training">Posture & Training</option>
              <option value="Coach Q&A">Coach Q&A</option>
            </select>
          </div>
          <div>
            <label htmlFor="comm-title" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Title
            </label>
            <input
              id="comm-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 3-week sleep & SPF consistency update"
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="comm-body" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Details
            </label>
            <textarea
              id="comm-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share what habit worked for you or ask for practical style feedback..."
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={blurFaceByDefault}
              onChange={(e) => setBlurFaceByDefault(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            <span>Blur face automatically if photo attached (recommended default)</span>
          </label>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          {message && <p className="text-xs text-teal-600 dark:text-teal-400">{message}</p>}
          <button
            type="submit"
            disabled={posting}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
          >
            {posting ? 'Submitting...' : user ? 'Publish to Community' : 'Sign In to Post'}
          </button>
        </form>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            Community Feed
          </h2>
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5 space-y-3"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {post.category} · {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
                {post.blurFaceByDefault ? ' · Face-blur default' : ''}
              </p>
              <h3 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">{post.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{post.body}</p>
              {post.coachReply && (
                <div className="rounded-lg border border-teal-500/25 bg-teal-500/5 p-3 text-xs text-zinc-700 dark:text-zinc-300">
                  {post.coachReply}
                </div>
              )}
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => handleHelpful(post.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="font-mono-tabular">Helpful ({post.helpfulCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReport(post.id)}
                  aria-label={`Report post ${post.title}`}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
````

## `src/components/PricingView.tsx`

````tsx
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
````

## `src/components/AuthAndAccount.tsx`

````tsx
import { useState } from 'react';
import { Download, Eye, EyeOff, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { checkPasswordStrength, validateAgeConfirmation, validateEmailFormat } from '../lib/authValidation';
import type { SafeUser, UserSession } from '../lib/types';

interface AuthAndAccountProps {
  user: SafeUser | null;
  sessions: UserSession[];
  onAuthSuccess: (token: string, user: SafeUser) => Promise<void>;
  onUserUpdate: (user: SafeUser) => void;
  onLogout: () => Promise<void>;
  onOpenAdmin: () => void;
}

export function AuthAndAccount({
  user,
  sessions,
  onAuthSuccess,
  onUserUpdate,
  onLogout,
  onOpenAdmin,
}: AuthAndAccountProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPass, setShowPass] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFaChallengeEmail, setTwoFaChallengeEmail] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaPreview, setTwoFaPreview] = useState<string | null>(null);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('1999-05-10');
  const [country, setCountry] = useState('United States');
  const [pronouns, setPronouns] = useState('');
  const [verificationCodePreview, setVerificationCodePreview] = useState<string | null>(null);
  const [verifyCodeInput, setVerifyCodeInput] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetTokenPreview, setResetTokenPreview] = useState<string | null>(null);
  const [resetNewPass, setResetNewPass] = useState('');

  // Account security fields
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const emailIsValid = validateEmailFormat(signupEmail);
  const passStrength = checkPasswordStrength(signupPassword);
  const ageCheck = validateAgeConfirmation(dob);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    setBusy(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.requiresTwoFactor && res.email) {
        setTwoFaChallengeEmail(res.email);
        setTwoFaPreview(res.twoFactorCodePreview || null);
        setStatusMsg('Two-factor verification required. Enter the 6-digit code.');
      } else if (res.token && res.user) {
        await onAuthSuccess(res.token, res.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  const handleProviderSignIn = async (provider: 'Google' | 'Apple') => {
    setError(null);
    setBusy(true);
    try {
      const res = await api.login({ provider });
      if (res.token && res.user) {
        await onAuthSuccess(res.token, res.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} sign-in failed.`);
    } finally {
      setBusy(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setError(null);
    setBusy(true);
    try {
      const res = await api.login({ email, password });
      if (res.token && res.user) {
        await onAuthSuccess(res.token, res.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaChallengeEmail) return;
    setError(null);
    setBusy(true);
    try {
      const res = await api.verify2fa(twoFaChallengeEmail, twoFaCode);
      setTwoFaChallengeEmail(null);
      await onAuthSuccess(res.token, res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid 2FA code.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    if (!emailIsValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passStrength.valid) {
      setError('Password must have 8+ characters, uppercase, lowercase, number, and symbol.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!ageCheck.valid) {
      setError(ageCheck.error || 'Please confirm a valid date of birth.');
      return;
    }
    setBusy(true);
    try {
      const res = await api.signup({
        fullName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword,
        dob,
        country,
        pronouns,
      });
      setVerificationCodePreview(res.verificationCodePreview);
      setStatusMsg(res.message);
      await onAuthSuccess(res.token, res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.verifyEmail(verifyCodeInput);
      onUserUpdate(res.user);
      setVerificationCodePreview(null);
      setStatusMsg('Email verified. Full features unlocked.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setResetTokenPreview(res.resetTokenPreview || null);
      setStatusMsg(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset token.');
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.resetPassword(forgotEmail, resetTokenInput, resetNewPass);
      setStatusMsg(res.message);
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setBusy(false);
    }
  };

  const handleExportData = async () => {
    const data = await api.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apex-glow-account-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (user) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              Account, Privacy & Security · Role: {user.role}
            </p>
            <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
              {user.fullName}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email} · {user.subscriptionTier} · {user.emailVerified ? 'Email Verified' : 'Verification Pending'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.role === 'admin' && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-[#E5BE6E] cursor-pointer"
              >
                Open Admin Console
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {!user.emailVerified && (
          <form
            onSubmit={handleVerifyEmail}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 space-y-3"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-amber-100">
              Verify your email to unlock full coaching features
            </p>
            {verificationCodePreview && (
              <p className="font-mono-tabular text-xs text-zinc-700 dark:text-zinc-300">
                Verification code preview: <strong>{verificationCodePreview}</strong>
              </p>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={verifyCodeInput}
                onChange={(e) => setVerifyCodeInput(e.target.value)}
                placeholder="Enter 6-digit verification code"
                className="rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                Verify Email
              </button>
            </div>
          </form>
        )}

        {user.isUnder18 && (
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 flex items-start gap-3 text-sm text-zinc-800 dark:text-zinc-200">
            <ShieldCheck className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
            <span>
              Under-18 Youth Protection Active: Medical, supplement, and cosmetic procedure advice is automatically
              restricted for your safety.
            </span>
          </div>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {statusMsg && <p className="text-sm text-teal-600 dark:text-teal-400">{statusMsg}</p>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Privacy & Safety Preferences */}
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Privacy & Consent Controls
            </h2>

            <label className="flex items-center justify-between gap-4 text-sm cursor-pointer">
              <span>AI photo analysis consent</span>
              <input
                type="checkbox"
                checked={user.photoConsent}
                onChange={async (e) => {
                  const res = await api.updateProfile({ photoConsent: e.target.checked });
                  onUserUpdate(res.user);
                }}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between gap-4 text-sm cursor-pointer">
              <span>Habit reminders & check-in alerts</span>
              <input
                type="checkbox"
                checked={user.notificationsEnabled}
                onChange={async (e) => {
                  const res = await api.updateProfile({ notificationsEnabled: e.target.checked });
                  onUserUpdate(res.user);
                }}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between gap-4 text-sm cursor-pointer">
              <span>Take-a-Break mode (pause streaks)</span>
              <input
                type="checkbox"
                checked={user.takeABreakMode}
                onChange={async (e) => {
                  const res = await api.updateProfile({ takeABreakMode: e.target.checked });
                  onUserUpdate(res.user);
                }}
                className="h-4 w-4 accent-teal-600"
              />
            </label>

            <div>
              <label htmlFor="acc-priv" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Photo sharing default
              </label>
              <select
                id="acc-priv"
                value={user.privacyMode}
                onChange={async (e) => {
                  const res = await api.updateProfile({
                    privacyMode: e.target.value as SafeUser['privacyMode'],
                  });
                  onUserUpdate(res.user);
                }}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              >
                <option value="Private by default">Private by default</option>
                <option value="Blurred community sharing">Blurred community sharing</option>
              </select>
            </div>
          </div>

          {/* Security & Sessions */}
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
              Security & Data Ownership
            </h2>

            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user.twoFactorEnabled ? 'Enabled for email/authenticator code' : 'Currently disabled'}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const res = await api.toggle2fa();
                  onUserUpdate(res.user);
                  setStatusMsg(`Two-factor authentication ${res.user.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
                }}
                className="rounded-lg border border-stone-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium cursor-pointer"
              >
                {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setStatusMsg(null);
                try {
                  const res = await api.changePassword(currPass, newPass);
                  setCurrPass('');
                  setNewPass('');
                  setStatusMsg(res.message);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unable to update password.');
                }
              }}
              className="space-y-2"
            >
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Change password</p>
              <input
                type="password"
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                placeholder="Current password"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs"
              />
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New strong password"
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer"
              >
                Update Password
              </button>
            </form>

            <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 space-y-2">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Active Sessions ({sessions.length})
              </p>
              <div className="space-y-1 max-h-24 overflow-y-auto text-xs text-zinc-500 dark:text-zinc-400">
                {sessions.map((s) => (
                  <p key={s.id}>
                    · {s.deviceLabel} {s.current ? '(Current)' : ''}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await api.logoutAll();
                    await onLogout();
                  }}
                  className="rounded-lg border border-stone-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium cursor-pointer"
                >
                  Logout Everywhere
                </button>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Data</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await api.deleteAccount();
                    await onLogout();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-4">
          <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
            {mode === 'login' ? 'Sign in to Apex Glow' : mode === 'signup' ? 'Create your account' : 'Reset password'}
          </h1>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-2.5 py-1 rounded cursor-pointer ${mode === 'login' ? 'bg-teal-600 text-white' : 'text-zinc-500'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`px-2.5 py-1 rounded cursor-pointer ${mode === 'signup' ? 'bg-teal-600 text-white' : 'text-zinc-500'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        {statusMsg && (
          <div className="rounded-lg border border-teal-500/40 bg-teal-500/10 p-3 text-xs text-teal-800 dark:text-teal-300">
            {statusMsg}
          </div>
        )}

        {twoFaChallengeEmail ? (
          <form onSubmit={handleVerify2fa} className="space-y-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Enter the two-factor code for <strong>{twoFaChallengeEmail}</strong>.
            </p>
            {twoFaPreview && (
              <p className="font-mono-tabular text-xs text-teal-700 dark:text-teal-400">
                Authenticator / Email Code Preview: <strong>{twoFaPreview}</strong>
              </p>
            )}
            <input
              type="text"
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value)}
              placeholder="6-digit code"
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white cursor-pointer"
            >
              Verify & Sign In
            </button>
          </form>
        ) : mode === 'login' ? (
          <div className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="login-pass" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2.5 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-2.5 top-2.5 text-zinc-500 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-teal-600"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-teal-700 dark:text-teal-400 underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 cursor-pointer"
              >
                {busy ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3 border-t border-stone-200 dark:border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => handleProviderSignIn('Google')}
                className="rounded-lg border border-stone-300 dark:border-zinc-700 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleProviderSignIn('Apple')}
                className="rounded-lg border border-stone-300 dark:border-zinc-700 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Continue with Apple
              </button>
            </div>

            <div className="border-t border-stone-200 dark:border-zinc-800 pt-4 space-y-2">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Quick demo access (pre-populated journey):</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('demo@apexglow.app', 'GlowPass2026!')}
                  className="rounded-lg border border-teal-500/40 py-2 text-xs font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"
                >
                  Demo Member
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@apexglow.app', 'AdminGlow2026!')}
                  className="rounded-lg border border-amber-500/40 py-2 text-xs font-medium text-amber-800 dark:text-[#E5BE6E] hover:bg-amber-500/10 cursor-pointer"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        ) : mode === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="su-name" className="block text-xs font-medium mb-1">Full name</label>
              <input
                id="su-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="su-email" className="block text-xs font-medium mb-1">Email</label>
              <input
                id="su-email"
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
              {signupEmail && !emailIsValid && (
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">Enter a valid email format.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="su-pass" className="block text-xs font-medium mb-1">Password</label>
                <input
                  id="su-pass"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="su-confirm" className="block text-xs font-medium mb-1">Confirm password</label>
                <input
                  id="su-confirm"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Password strength: <span className="font-mono-tabular">{passStrength.score}/5</span> (8+ chars, upper,
              lower, number, symbol)
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="su-dob" className="block text-xs font-medium mb-1">Date of birth</label>
                <input
                  id="su-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="su-country" className="block text-xs font-medium mb-1">Country</label>
                <input
                  id="su-country"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="su-pronouns" className="block text-xs font-medium mb-1">Pronouns (opt.)</label>
                <input
                  id="su-pronouns"
                  type="text"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  placeholder="they/them"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
              </div>
            </div>

            {ageCheck.isUnder18 && (
              <p className="text-xs text-teal-700 dark:text-teal-400">
                Under-18 protection will be enabled automatically (restricting medical/procedure content).
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 py-2.5 text-sm font-semibold text-white cursor-pointer"
            >
              {busy ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleForgotRequest} className="space-y-3">
              <label htmlFor="fp-email" className="block text-xs font-medium">Account email</label>
              <input
                id="fp-email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-zinc-900 dark:bg-[#F4F2ED] px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 cursor-pointer"
              >
                Request Expiring Reset Token
              </button>
            </form>

            {resetTokenPreview && (
              <form onSubmit={handleResetPassword} className="space-y-3 border-t border-stone-200 dark:border-zinc-800 pt-4">
                <p className="font-mono-tabular text-xs text-teal-700 dark:text-teal-400">
                  Reset Token Preview: <strong>{resetTokenPreview}</strong>
                </p>
                <input
                  type="text"
                  value={resetTokenInput}
                  onChange={(e) => setResetTokenInput(e.target.value)}
                  placeholder="Paste reset token"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
                <input
                  type="password"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="New strong password"
                  className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white cursor-pointer"
                >
                  Confirm Password Reset
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
````

## `src/components/AdminPanel.tsx`

````tsx
import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { api } from '../lib/api';
import type { CommunityPost, SafeUser } from '../lib/types';

interface AdminPanelProps {
  user: SafeUser | null;
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<CommunityPost[]>([]);
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    premiumMembers: 0,
    under18ProtectedAccounts: 0,
    avgStreakDays: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminOverview();
      setUsers(res.users);
      setFlaggedPosts(res.flaggedPosts);
      setAnalytics(res.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOverview();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="font-editorial text-3xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in with an Admin account to review safety moderation queues and subscription analytics.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-semibold text-amber-700 dark:text-[#E5BE6E]">Trust, Safety & Operations</p>
        <h1 className="font-editorial text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] sm:text-4xl mt-1">
          Admin Moderation & Analytics Console
        </h1>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Analytics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Members', value: analytics.totalMembers },
          { label: 'Premium Subscriptions', value: analytics.premiumMembers },
          { label: 'Under-18 Protected', value: analytics.under18ProtectedAccounts },
          { label: 'Avg Consistency Streak', value: `${analytics.avgStreakDays}d` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            <p className="font-mono-tabular text-3xl font-semibold text-zinc-950 dark:text-[#F4F2ED] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Flagged / Safety Queue */}
      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
          Safety & Report Moderation Queue ({flaggedPosts.length})
        </h2>
        {loading ? (
          <p className="text-sm text-zinc-500">Loading moderation queue...</p>
        ) : flaggedPosts.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Zero flagged items pending review.</p>
        ) : (
          <div className="divide-y divide-stone-200 dark:divide-zinc-800">
            {flaggedPosts.map((post) => (
              <div key={post.id} className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-[#F4F2ED]">{post.title}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{post.body}</p>
                  <p className="text-xs text-amber-700 dark:text-[#E5BE6E]">Reason: {post.flagReason}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      await api.moderatePost(post.id, 'approve');
                      await loadOverview();
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await api.moderatePost(post.id, 'remove');
                      await loadOverview();
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member & Subscription Table */}
      <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#14171C] p-6 space-y-4 overflow-x-auto">
        <h2 className="font-editorial text-2xl font-semibold text-zinc-950 dark:text-[#F4F2ED]">
          Member & Subscription Management
        </h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
              <th className="py-2 pr-4">Member</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Youth Mode</th>
              <th className="py-2 pr-4">Streak</th>
              <th className="py-2">Subscription Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{u.fullName}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                </td>
                <td className="py-3 pr-4 text-xs">{u.role}</td>
                <td className="py-3 pr-4 text-xs">{u.isUnder18 ? 'Under-18 Protected' : 'Adult'}</td>
                <td className="py-3 pr-4 font-mono-tabular text-xs">{u.streakDays}d</td>
                <td className="py-3">
                  <select
                    aria-label={`Subscription tier for ${u.fullName}`}
                    value={u.subscriptionTier}
                    onChange={async (e) => {
                      await api.updateUserTier(u.id, e.target.value as SafeUser['subscriptionTier']);
                      await loadOverview();
                    }}
                    className="rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 text-xs"
                  >
                    <option value="Free">Free</option>
                    <option value="Monthly Premium">Monthly Premium</option>
                    <option value="Annual Premium">Annual Premium</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
````
