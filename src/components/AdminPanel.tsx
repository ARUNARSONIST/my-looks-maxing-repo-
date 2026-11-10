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
