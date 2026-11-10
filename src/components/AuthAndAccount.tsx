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
