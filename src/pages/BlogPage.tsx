import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { AdContainer } from '../components/AdContainer';
import { CommentsSection } from '../components/CommentsSection';
import { calculateReadingTime } from '../utils/readingTimeCalculator';
import { ArticleSkeleton } from '../components/SkeletonLoader';
import {
  FileText,
  Search,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  Check,
  Sparkles,
  MessageSquare,
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  Rocket,
  Filter,
} from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { blogPosts, selectedArticleId, setSelectedArticleId, getCommentsForTarget, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Tab definitions
  const topicTabs = [
    { id: 'All', label: 'All Topics', icon: Sparkles },
    { id: 'AI', label: 'AI & Copilots', icon: Cpu },
    { id: 'Web4', label: 'Web4 & Cryptography', icon: ShieldCheck },
    { id: 'Tech', label: 'Tech & Architecture', icon: Terminal },
    { id: 'Solopreneurship', label: 'Solopreneurship', icon: Rocket },
    { id: 'Web Development', label: 'Web Development', icon: Layers },
  ];

  // Matching logic
  const matchesTopic = (post: BlogPost, topicId: string) => {
    if (topicId === 'All') return true;
    if (topicId === 'AI') {
      return (
        post.category === 'AI' ||
        post.category.toLowerCase().includes('ai') ||
        post.tags.some((t) => t.toLowerCase() === 'ai' || t.toLowerCase().includes('gemini'))
      );
    }
    if (topicId === 'Web4') {
      return (
        post.category === 'Web4' ||
        post.category.toLowerCase().includes('web4') ||
        post.tags.some((t) =>
          ['web4', 'cryptography', 'zero-knowledge', 'identity', 'sovereignty'].includes(t.toLowerCase())
        )
      );
    }
    if (topicId === 'Tech') {
      return (
        post.category === 'Technology' ||
        post.category === 'Tech' ||
        post.category === 'Web Development' ||
        post.tags.some((t) =>
          ['tech', 'technology', 'architecture', 'security', 'node.js', 'typescript', 'ssrf'].includes(t.toLowerCase())
        )
      );
    }
    if (topicId === 'Solopreneurship') {
      return (
        post.category === 'Entrepreneurship' ||
        post.category === 'Solopreneurship' ||
        post.tags.some((t) => t.toLowerCase().includes('solopreneur') || t.toLowerCase().includes('startup'))
      );
    }
    if (topicId === 'Web Development') {
      return (
        post.category === 'Web Development' ||
        post.tags.some((t) =>
          ['web', 'development', 'react', 'typescript', 'node.js'].includes(t.toLowerCase())
        )
      );
    }
    return post.category.toLowerCase() === topicId.toLowerCase();
  };

  // Compute counts per topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topicTabs.forEach((tab) => {
      counts[tab.id] = blogPosts.filter((p) => matchesTopic(p, tab.id)).length;
    });
    return counts;
  }, [blogPosts]);

  // Active single article view
  const activePost = selectedArticleId
    ? blogPosts.find((p) => p.slug === selectedArticleId || p.id === selectedArticleId)
    : null;

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat = matchesTopic(post, selectedCategory);
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleShare = () => {
    if (!activePost) return;
    navigator.clipboard.writeText(`https://mistermoon.com.ng/#blog/${activePost.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="blog-page-root" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {activePost ? (
        /* ========================================== */
        /* SINGLE ARTICLE VIEW */
        /* ========================================== */
        <article className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Back button */}
          <button
            onClick={() => setSelectedArticleId(null)}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Publications</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-mono">
                {activePost.category}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{calculateReadingTime(activePost.content, { imageCount: 1 }).text}</span>
              </span>
            </div>

            <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight">
              {activePost.title}
            </h1>

            {/* Author info & Share */}
            <div className="flex items-center justify-between py-4 border-y border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">{activePost.author.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{activePost.author.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono hidden sm:inline">{activePost.date}</span>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={activePost.featuredImage}
              alt={activePost.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>

          {/* Markdown Content Body */}
          <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-4 font-sans prose prose-invert max-w-none">
            <ReactMarkdown>{activePost.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            {activePost.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* In-Article AdSense Unit */}
          <AdContainer slot="blog" format="horizontal" />

          {/* Universal Comments and Technical Discussion Section */}
          <CommentsSection
            targetId={activePost.id}
            targetType="blog"
            targetTitle={activePost.title}
          />
        </article>
      ) : (
        /* ========================================== */
        /* BLOG INDEX VIEW */
        /* ========================================== */
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-widest uppercase">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('blog_badge', 'PUBLICATIONS & ARCHITECTURAL ESSAYS')}</span>
            </div>

            <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
              Essays, Insights & <span className="gold-gradient-text">Research</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              Critical essays exploring Web4 infrastructure, low-latency AI architectures, modular audio engineering, and digital entrepreneurship.
            </p>
          </div>

          {/* Tab-Based Navigation Component */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#0C0F17] border border-slate-800 shadow-xl">
              {/* Tab Navigation */}
              <div
                role="tablist"
                aria-label="Filter blog posts by category"
                className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin"
              >
                {topicTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;
                  const count = topicCounts[tab.id] || 0;

                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-400 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by topic, keyword, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Active filter summary if filtered */}
            {(selectedCategory !== 'All' || searchQuery) && (
              <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
                <span>
                  Showing {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'} in{' '}
                  <strong className="text-emerald-400 font-semibold">{selectedCategory}</strong>
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Grid or Empty State */}
          {blogPosts.length === 0 ? (
            <ArticleSkeleton count={4} />
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0C0F17] border border-slate-800 space-y-4">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">No articles found in this category</h3>
                <p className="text-xs text-slate-400">Try switching tabs or resetting your search term.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono cursor-pointer hover:bg-emerald-500/30"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedArticleId(post.slug)}
                  className="group rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer overflow-hidden flex flex-col justify-between hover:shadow-[0_15px_35px_rgba(16,185,129,0.1)]"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                      {post.category}
                    </span>
                    <span className="absolute top-3 right-3 text-[11px] font-mono text-emerald-300 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{calculateReadingTime(post.content, { imageCount: 1 }).text}</span>
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-slate-500">{post.date}</span>
                      <h3 className="font-brand font-bold text-xl text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-slate-300 font-medium">{post.author.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-xs flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span>{getCommentsForTarget(post.id).length}</span>
                        </span>
                        <span className="text-emerald-400 font-mono text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform font-semibold">
                          <span>Read & Comment</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AdSense Unit on Blog List */}
          <AdContainer slot="blog" format="horizontal" />
        </div>
      )}
    </div>
  );
};
