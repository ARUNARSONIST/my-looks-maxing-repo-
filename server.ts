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
