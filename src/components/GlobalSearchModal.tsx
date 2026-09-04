import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Layers,
  Smartphone,
  FileText,
  Loader2,
  Send,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    projects,
    apps,
    blogPosts,
    setCurrentPage,
    setSelectedArticleId,
    t,
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'projects' | 'apps' | 'blog'>('all');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search Results
  const matchedProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.technologies.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  const matchedApps = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(normalizedQuery) ||
      a.tagline.toLowerCase().includes(normalizedQuery) ||
      a.description.toLowerCase().includes(normalizedQuery) ||
      a.features.some((f) => f.toLowerCase().includes(normalizedQuery))
  );

  const matchedArticles = blogPosts.filter(
    (b) =>
      b.title.toLowerCase().includes(normalizedQuery) ||
      b.excerpt.toLowerCase().includes(normalizedQuery) ||
      b.category.toLowerCase().includes(normalizedQuery) ||
      b.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );

  const totalResults =
    (filterCategory === 'all' || filterCategory === 'projects' ? matchedProjects.length : 0) +
    (filterCategory === 'all' || filterCategory === 'apps' ? matchedApps.length : 0) +
    (filterCategory === 'all' || filterCategory === 'blog' ? matchedArticles.length : 0);

  const handleSelect = (page: PageTab, articleSlug?: string) => {
    if (articleSlug) {
      setSelectedArticleId(articleSlug);
    }
    setCurrentPage(page);
    setIsSearchOpen(false);
  };

  const handleAskAi = async () => {
    if (!query.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/search/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'MisterMoon builds cutting-edge technology and sovereign Web4 software.');
    } catch {
      setAiAnswer('MisterMoon ecosystem features autonomous AI tools, video streaming infrastructure, and Web4 sovereign identities.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-container"
        className="w-full max-w-2xl rounded-2xl bg-[#0B0E14] border border-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskAi();
            }}
            placeholder={t('search_placeholder')}
            autoFocus
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setAiAnswer(null);
              }}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            ESC
          </span>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              filterCategory === 'all'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setFilterCategory('projects')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterCategory === 'projects'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" /> Projects ({matchedProjects.length})
          </button>
          <button
            onClick={() => setFilterCategory('apps')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterCategory === 'apps'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" /> Apps ({matchedApps.length})
          </button>
          <button
            onClick={() => setFilterCategory('blog')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterCategory === 'blog'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3 h-3" /> Blog ({matchedArticles.length})
          </button>
        </div>

        {/* AI Answer Card if queried */}
        {query.trim().length > 2 && (
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-cyan-500/10 border-b border-amber-400/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>MisterMoon AI Assistant</span>
              </span>
              <button
                onClick={handleAskAi}
                disabled={isAiLoading}
                className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-mono border border-amber-400/40 flex items-center gap-1 cursor-pointer"
              >
                {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                <span>Ask Copilot</span>
              </button>
            </div>
            {aiAnswer ? (
              <p className="text-xs text-slate-200 leading-relaxed mt-1 font-sans">{aiAnswer}</p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Press Enter or click &quot;Ask Copilot&quot; to receive tailored recommendations from MisterMoon&apos;s intelligent agent.
              </p>
            )}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResults === 0 && query.trim().length > 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">{t('search_no_results')}</p>
              <p className="text-xs text-slate-600 mt-1">Try querying terms like &quot;AI&quot;, &quot;Downloader&quot;, &quot;React&quot;, &quot;Web4&quot;.</p>
            </div>
          )}

          {/* Matched Projects */}
          {(filterCategory === 'all' || filterCategory === 'projects') && matchedProjects.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400 mb-2 block">
                Projects ({matchedProjects.length})
              </span>
              <div className="space-y-1.5">
                {matchedProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('projects')}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-400/10 border border-slate-800/80 hover:border-amber-400/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-amber-300">
                          {p.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Apps */}
          {(filterCategory === 'all' || filterCategory === 'apps') && matchedApps.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 mb-2 block">
                Applications ({matchedApps.length})
              </span>
              <div className="space-y-1.5">
                {matchedApps.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect('apps')}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-400/10 border border-slate-800/80 hover:border-cyan-400/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300">
                          {a.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono">
                          {a.version}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{a.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Articles */}
          {(filterCategory === 'all' || filterCategory === 'blog') && matchedArticles.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-400 mb-2 block">
                Articles & Essays ({matchedArticles.length})
              </span>
              <div className="space-y-1.5">
                {matchedArticles.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('blog', b.slug)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-emerald-400/10 border border-slate-800/80 hover:border-emerald-400/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{b.readTime}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{b.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
