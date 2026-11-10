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
