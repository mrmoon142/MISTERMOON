import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Twitter,
  Youtube,
  Github,
  Instagram,
  ExternalLink,
  MessageCircle,
  Heart,
  Repeat,
  Eye,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Share2,
  Bookmark,
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'youtube' | 'github' | 'instagram';
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  tags: string[];
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    views?: string;
  };
  link: string;
  mediaSnippet?: {
    type: 'code' | 'video_thumb' | 'repo';
    title: string;
    detail: string;
  };
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'soc-1',
    platform: 'twitter',
    author: 'Miracle Dike (MisterMoon)',
    handle: '@MISTERMOON142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timestamp: '3 hours ago',
    content:
      'Vibe coding in 2026 isn’t about generating raw code blindly—it is about orchestrating high-fidelity prompts, understanding edge system boundaries, and keeping your core architecture zero-trust. Shipping the new Web4 identity protocol on mistermoon.com.ng! 🚀⚡',
    tags: ['#VibeCoding', '#AIArchitecture', '#Web4', '#Solopreneur'],
    metrics: {
      likes: 342,
      shares: 89,
      comments: 47,
      views: '12.4K',
    },
    link: 'https://x.com/MISTERMOON142',
    mediaSnippet: {
      type: 'code',
      title: 'Local WebCrypto Enclave Primitive',
      detail: 'const keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);',
    },
  },
  {
    id: 'soc-2',
    platform: 'youtube',
    author: 'MisterMoon Studio',
    handle: '@MISTERMOON142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timestamp: '1 day ago',
    content:
      'NEW WORKSHOP: Building an SSRF-hardened Universal Media Downloader with Node.js & ephemeral memory buffers. Complete architectural teardown and stream debugging.',
    tags: ['#WebDev', '#Security', '#NodeJS', '#Architecture'],
    metrics: {
      likes: 820,
      shares: 114,
      comments: 92,
      views: '8.9K',
    },
    link: 'https://youtube.com/@MISTERMOON142',
    mediaSnippet: {
      type: 'video_thumb',
      title: 'SSRF Mitigation & Stream Transcoding Masterclass',
      detail: 'Duration: 34:12 • Full HD 1080p • 60 FPS',
    },
  },
  {
    id: 'soc-3',
    platform: 'github',
    author: 'Miracle Dike',
    handle: '@MISTERMOON142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timestamp: '2 days ago',
    content:
      'Pushed v2.4.0 release of the mistermoon-ecosystem: zero-latency multimodal prompting orchestrator, dark/light CSS variable sync, and multilingual dictionary modules.',
    tags: ['#OpenSource', '#TypeScript', '#React', '#Vite'],
    metrics: {
      likes: 195,
      shares: 52,
      comments: 18,
      views: '4.2K',
    },
    link: 'https://github.com/MISTERMOON142',
    mediaSnippet: {
      type: 'repo',
      title: 'MISTERMOON142 / mistermoon-core',
      detail: 'TypeScript 98.4% • MIT License • 248 Stars',
    },
  },
  {
    id: 'soc-4',
    platform: 'twitter',
    author: 'Miracle Dike (MisterMoon)',
    handle: '@MISTERMOON142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timestamp: '3 days ago',
    content:
      'If you can operate a counterbalance forklift under high-pressure warehouse logistics, you can debug an asynchronous race condition. Discipline and precision translate everywhere in life. Never let your background limit your scope.',
    tags: ['#Mindset', '#Creator', '#Discipline', '#Software'],
    metrics: {
      likes: 612,
      shares: 140,
      comments: 63,
      views: '24.1K',
    },
    link: 'https://x.com/MISTERMOON142',
  },
  {
    id: 'soc-5',
    platform: 'instagram',
    author: 'MisterMoon Lifestyle & Tech',
    handle: '@MISTERMOON142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timestamp: '4 days ago',
    content:
      'Late-night vibe coding lab setup. Dual 4K monitors, local LLM telemetry, mechanical tactile switches, and high-frequency creative focus.',
    tags: ['#DeskSetup', '#Solopreneur', '#VibeCoding', '#TechLife'],
    metrics: {
      likes: 489,
      shares: 34,
      comments: 29,
    },
    link: 'https://instagram.com/MISTERMOON142',
  },
];

export const SocialFeedSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const current = !!prev[postId];
      return { ...prev, [postId]: !current };
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isNowLiked = !likedPosts[postId];
          return {
            ...p,
            metrics: {
              ...p.metrics,
              likes: isNowLiked ? p.metrics.likes + 1 : p.metrics.likes - 1,
            },
          };
        }
        return p;
      })
    );
  };

  const filteredPosts =
    activePlatform === 'all'
      ? posts
      : posts.filter((p) => p.platform === activePlatform);

  const platformBadge = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'twitter':
        return {
          icon: Twitter,
          name: 'X (Twitter)',
          color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        };
      case 'youtube':
        return {
          icon: Youtube,
          name: 'YouTube',
          color: 'text-red-400 bg-red-500/10 border-red-500/30',
        };
      case 'github':
        return {
          icon: Github,
          name: 'GitHub',
          color: 'text-slate-300 bg-slate-800 border-slate-700',
        };
      case 'instagram':
        return {
          icon: Instagram,
          name: 'Instagram',
          color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        };
    }
  };

  return (
    <section
      id="social-feed-section"
      className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      aria-label="Recent Social Media Activity for MISTERMOON142"
    >
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE BROADCAST & PULSE</span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="font-brand font-extrabold text-2xl sm:text-4xl text-slate-100 tracking-tight">
                Social Activity <span className="gold-gradient-text">@MISTERMOON142</span>
              </h2>
              <div
                title="Verified Creator Badge"
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
              Real-time updates, engineering breakdowns, vibe coding logs, and open-source releases straight from creator Miracle Dike.
            </p>
          </div>

          {/* Social Follow Links & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="refresh-feed-btn"
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
                isRefreshing ? 'animate-spin text-amber-400' : ''
              }`}
              title="Refresh social media feed"
              aria-label="Refresh Feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              id="follow-x-btn"
              href="https://x.com/MISTERMOON142"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 hover:border-sky-400 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Follow on X</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              id="subscribe-yt-btn"
              href="https://youtube.com/@MISTERMOON142"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 hover:border-red-400 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              id="github-profile-btn"
              href="https://github.com/MISTERMOON142"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
            { id: 'youtube', label: 'YouTube Demos', icon: Youtube },
            { id: 'github', label: 'GitHub Commits', icon: Github },
            { id: 'instagram', label: 'Studio Log', icon: Instagram },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePlatform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePlatform(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Social Feed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => {
              const badge = platformBadge(post.platform);
              const Icon = badge.icon;
              const isLiked = !!likedPosts[post.id];

              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl bg-[#0C0F17] border border-slate-800/90 hover:border-amber-400/35 p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all group"
                >
                  {/* Top Bar: Author & Platform Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-1">
                            {post.author}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{post.handle}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono border ${badge.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{badge.name}</span>
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {post.content}
                  </p>

                  {/* Media / Code Snippet */}
                  {post.mediaSnippet && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 overflow-hidden">
                      <div className="flex items-center justify-between text-[11px] text-amber-400">
                        <span className="font-bold">{post.mediaSnippet.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">
                          {post.mediaSnippet.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 select-all">
                        {post.mediaSnippet.detail}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-amber-400/80 hover:text-amber-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">{post.timestamp}</span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1 text-[11px] font-mono transition-colors cursor-pointer ${
                          isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                        }`}
                        title="Like update"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400' : ''}`} />
                        <span>{post.metrics.likes}</span>
                      </button>

                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{post.metrics.shares}</span>
                      </span>

                      {post.metrics.views && (
                        <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.metrics.views}</span>
                        </span>
                      )}

                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                        title="Open on platform"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
