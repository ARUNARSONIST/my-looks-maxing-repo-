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
