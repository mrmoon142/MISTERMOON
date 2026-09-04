import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost, ProjectItem, AppItem, VideoItem } from '../types';
import { synthEngine } from '../utils/audioSynth';
import { useToast } from './ToastNotification';
import {
  ShieldCheck,
  Lock,
  PlusCircle,
  FileText,
  Briefcase,
  Video,
  Grid,
  Trash2,
  CheckCircle2,
  Download,
  Upload,
  Search,
  ExternalLink,
  Sparkles,
  Eye,
  RefreshCw,
  Save,
} from 'lucide-react';

interface AdminControlPanelProps {
  onClose?: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ onClose }) => {
  const {
    blogPosts,
    updateBlogPosts,
    projects,
    updateProjects,
    videos,
    updateVideos,
    apps,
    updateApps,
    settings,
    updateSettings,
    t,
  } = useApp();

  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mistermoon_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'articles' | 'projects' | 'videos' | 'apps'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Form States
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Engineering & AI',
    readTime: '4 min read',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Vibe Coding', 'Architecture', 'Web4'],
  });

  const [newProject, setNewProject] = useState({
    title: '',
    slug: '',
    description: '',
    technologies: ['TypeScript', 'React', 'Gemini AI', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    linkUrl: 'https://mistermoon.com.ng',
    githubUrl: 'https://github.com/mistermoon',
    featured: true,
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    source: 'MisterMoon Official',
    duration: '04:20',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    category: 'Architecture & Coding',
  });

  const [newApp, setNewApp] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'AI & Developer Tools',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    version: '1.0.0',
    platform: ['Web', 'PWA', 'Desktop'],
    status: 'Live' as const,
    downloadUrl: 'https://mistermoon.com.ng',
  });

  // Handle Passcode Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized default passkeys
    if (passcode.trim() === 'mistermoon2026' || passcode.trim() === 'admin' || passcode.trim() === 'moon') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('mistermoon_admin_session', 'true');
      } catch {}
      synthEngine.playUiSound('success');
      showToast({
        title: 'Admin Authenticated 🛡️',
        message: 'Master control panel unlocked with live write access.',
        type: 'success',
      });
      setAuthError(null);
    } else {
      synthEngine.playUiSound('error');
      setAuthError('Invalid passcode. Use your authorized admin credential.');
    }
  };

  // 1. Create Article Handler
  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) {
      showToast({ title: 'Missing Information', message: 'Title and content are required.', type: 'error' });
      return;
    }

    setIsPublishing(true);
    synthEngine.playUiSound('click');

    const slug = newArticle.slug || newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const created: BlogPost = {
      id: 'post-' + Date.now(),
      title: newArticle.title,
      slug,
      excerpt: newArticle.excerpt || newArticle.content.slice(0, 160) + '...',
      content: newArticle.content,
      category: newArticle.category,
      readTime: newArticle.readTime,
      featuredImage: newArticle.featuredImage,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: {
        name: 'Miracle Chibueze Dike (MisterMoon)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Founder & AI Architect',
      },
      tags: newArticle.tags,
    };

    const updated = [created, ...blogPosts];
    updateBlogPosts(updated);

    setTimeout(() => {
      setIsPublishing(false);
      synthEngine.playUiSound('success');
      showToast({
        title: 'Article Published Live ✨',
        message: `"${created.title}" is now dynamically visible across the website.`,
        type: 'success',
      });
      setNewArticle({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Engineering & AI',
        readTime: '4 min read',
        featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        tags: ['AI Vibe Coding', 'Architecture', 'Web4'],
      });
    }, 400);
  };

  // 2. Create Project Handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      showToast({ title: 'Missing Information', message: 'Title and description are required.', type: 'error' });
      return;
    }

    setIsPublishing(true);
    synthEngine.playUiSound('click');

    const slug = newProject.slug || newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const created: ProjectItem = {
      id: 'proj-' + Date.now(),
      title: newProject.title,
      slug,
      category: 'AI Projects',
      description: newProject.description,
      technologies: newProject.technologies,
      imageUrl: newProject.imageUrl,
      linkUrl: newProject.linkUrl,
      githubUrl: newProject.githubUrl,
      featured: newProject.featured,
      status: 'Live',
      features: ['Real-time Streaming', 'Full-Stack Architecture'],
    };

    const updated = [created, ...projects];
    updateProjects(updated);

    setTimeout(() => {
      setIsPublishing(false);
      synthEngine.playUiSound('success');
      showToast({
        title: 'Project Added 🚀',
        message: `"${created.title}" is now featured in the project catalog.`,
        type: 'success',
      });
      setNewProject({
        title: '',
        slug: '',
        description: '',
        technologies: ['TypeScript', 'React', 'Gemini AI', 'Tailwind'],
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        linkUrl: 'https://mistermoon.com.ng',
        githubUrl: 'https://github.com/mistermoon',
        featured: true,
      });
    }, 400);
  };

  // 3. Create Video Handler
  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) {
      showToast({ title: 'Missing Information', message: 'Title and media URL are required.', type: 'error' });
      return;
    }

    setIsPublishing(true);
    synthEngine.playUiSound('click');

    const created: VideoItem = {
      id: 'vid-' + Date.now(),
      title: newVideo.title,
      url: newVideo.url,
      source: newVideo.source,
      duration: newVideo.duration,
      thumbnail: newVideo.thumbnail,
      category: newVideo.category,
    };

    const updated = [created, ...videos];
    updateVideos(updated);

    setTimeout(() => {
      setIsPublishing(false);
      synthEngine.playUiSound('success');
      showToast({
        title: 'Video Stream Registered 🎬',
        message: `"${created.title}" added to Downloader & Media Showcase.`,
        type: 'success',
      });
      setNewVideo({
        title: '',
        url: '',
        source: 'MisterMoon Official',
        duration: '04:20',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        category: 'Architecture & Coding',
      });
    }, 400);
  };

  // 4. Create App Handler
  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.name || !newApp.tagline) {
      showToast({ title: 'Missing Information', message: 'App name and tagline are required.', type: 'error' });
      return;
    }

    setIsPublishing(true);
    synthEngine.playUiSound('click');

    const created: AppItem = {
      id: 'app-' + Date.now(),
      name: newApp.name,
      tagline: newApp.tagline,
      description: newApp.description || newApp.tagline,
      logoUrl: newApp.iconUrl,
      screenshots: [newApp.iconUrl],
      features: [newApp.tagline, 'Offline PWA Support'],
      version: newApp.version,
      platforms: ['Web'],
      status: 'Live',
      rating: 5.0,
      downloadUrl: newApp.downloadUrl,
    };

    const updated = [created, ...apps];
    updateApps(updated);

    setTimeout(() => {
      setIsPublishing(false);
      synthEngine.playUiSound('success');
      showToast({
        title: 'App Published 📱',
        message: `"${created.name}" is now live in the Software Directory.`,
        type: 'success',
      });
      setNewApp({
        name: '',
        tagline: '',
        description: '',
        category: 'AI & Developer Tools',
        iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        version: '1.0.0',
        platform: ['Web', 'PWA', 'Desktop'],
        status: 'Live',
        downloadUrl: 'https://mistermoon.com.ng',
      });
    }, 400);
  };

  // Export JSON Database
  const handleExportBackup = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      brand: 'MISTERMOON.COM.NG',
      settings,
      projects,
      apps,
      videos,
      blogPosts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mistermoon_cms_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    synthEngine.playUiSound('download');
    showToast({
      title: 'Backup Downloaded 💾',
      message: 'Full CMS database exported successfully.',
      type: 'success',
    });
  };

  // If not authenticated, render the high-security lock screen
  if (!isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0E17] border border-amber-400/30 max-w-md mx-auto shadow-2xl space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-brand font-bold text-2xl text-slate-100">
            Admin <span className="gold-gradient-text">Control Panel</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter authorized security credentials to manage content dynamically across MISTERMOON.COM.NG.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">Admin Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. mistermoon2026)"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
              autoFocus
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-400 font-mono bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate Master Session</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="admin-control-panel" className="space-y-8 animate-fadeIn">
      {/* Top Header & Session Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0B0E17] border border-amber-400/30 shadow-[0_0_50px_rgba(212,175,55,0.06)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
              LIVE WRITE SESSION ACTIVE
            </span>
            <span className="text-xs font-mono text-slate-400">Zero Latency Persistence</span>
          </div>
          <h2 className="font-brand font-bold text-2xl text-slate-100 flex items-center gap-2">
            Admin <span className="gold-gradient-text">Control Panel</span>
          </h2>
          <p className="text-xs text-slate-400">
            Publish new articles, register projects, add video streams, or deploy software updates with instant site-wide propagation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-xs font-mono text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download JSON Database"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('mistermoon_admin_session');
              setIsAuthenticated(false);
              showToast({ title: 'Session Locked', message: 'Logged out of Admin Control Panel.', type: 'info' });
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono hover:bg-rose-500/25 transition-colors cursor-pointer"
          >
            Lock Session
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'articles'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles & Insights ({blogPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Streams ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apps'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Software Suite ({apps.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ARTICLES */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Creator Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-amber-400/20 space-y-5">
            <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Create New Article / Essay</span>
            </h3>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Article Title *</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. Architecting Autonomous AI Agent Frameworks"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Engineering & AI">Engineering & AI</option>
                    <option value="Vibe Coding">Vibe Coding</option>
                    <option value="Web4 & Cryptography">Web4 & Cryptography</option>
                    <option value="Audio DSP & Synthesizers">Audio DSP & Synthesizers</option>
                    <option value="Solopreneurship">Solopreneurship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Read Time</label>
                  <input
                    type="text"
                    value={newArticle.readTime}
                    onChange={(e) => setNewArticle({ ...newArticle, readTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newArticle.featuredImage}
                  onChange={(e) => setNewArticle({ ...newArticle, featuredImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="Short brief summarizing the article..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Article Body (Markdown Supported) *</label>
                <textarea
                  rows={6}
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Write your article in Markdown..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Article Live to Website</span>
              </button>
            </form>
          </div>

          {/* Manage Existing Articles */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-brand font-bold text-base text-slate-100">Live Articles ({blogPosts.length})</h3>
                <span className="text-[11px] font-mono text-amber-300">Synchronized</span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-400/30 flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          {post.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{post.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{post.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{post.excerpt}</p>
                    </div>

                    <button
                      onClick={() => {
                        const updated = blogPosts.filter((p) => p.id !== post.id);
                        updateBlogPosts(updated);
                        showToast({ title: 'Article Deleted', message: `Removed "${post.title}".`, type: 'info' });
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-amber-400/20 space-y-5">
            <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Register New Project</span>
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Project Title *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. PulseWeb Neural Synthesizer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project overview and architectural capabilities..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Live URL</label>
                  <input
                    type="url"
                    value={newProject.linkUrl}
                    onChange={(e) => setNewProject({ ...newProject, linkUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Image Thumbnail URL</label>
                <input
                  type="url"
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Briefcase className="w-4 h-4" />
                <span>Feature Project in Catalog</span>
              </button>
            </form>
          </div>

          {/* Manage Existing Projects */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-brand font-bold text-base text-slate-100">Catalog Projects ({projects.length})</h3>
              <span className="text-[11px] font-mono text-amber-300">Live</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-400/30 flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = projects.filter((p) => p.id !== proj.id);
                      updateProjects(updated);
                      showToast({ title: 'Project Removed', message: `Removed "${proj.title}".`, type: 'info' });
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-cyan-500/20 space-y-5">
            <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              <span>Register Video Stream</span>
            </h3>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Video Title *</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="e.g. Miracle Chibueze Dike - Engineering Architecture 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Media Stream / YouTube / Vimeo URL *</label>
                <input
                  type="text"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or direct .mp4"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Source / Channel</label>
                  <input
                    type="text"
                    value={newVideo.source}
                    onChange={(e) => setNewVideo({ ...newVideo, source: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Thumbnail Cover URL</label>
                <input
                  type="url"
                  value={newVideo.thumbnail}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Video className="w-4 h-4" />
                <span>Publish to Downloader Showcase</span>
              </button>
            </form>
          </div>

          {/* Manage Existing Videos */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-brand font-bold text-base text-slate-100">Live Video Showcase ({videos.length})</h3>
              <span className="text-[11px] font-mono text-cyan-300">Synchronized</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-400/30 flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100">{vid.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{vid.source} • {vid.duration}</p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {vid.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const updated = videos.filter((v) => v.id !== vid.id);
                      updateVideos(updated);
                      showToast({ title: 'Video Removed', message: `Removed "${vid.title}".`, type: 'info' });
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPS */}
      {activeTab === 'apps' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-amber-400/20 space-y-5">
            <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-400" />
              <span>Deploy New Application</span>
            </h3>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">App Name *</label>
                <input
                  type="text"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  placeholder="e.g. HyperStream Downloader Pro"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Tagline *</label>
                <input
                  type="text"
                  value={newApp.tagline}
                  onChange={(e) => setNewApp({ ...newApp, tagline: e.target.value })}
                  placeholder="Zero-latency universal media scraper"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Version</label>
                  <input
                    type="text"
                    value={newApp.version}
                    onChange={(e) => setNewApp({ ...newApp, version: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Download / Web URL</label>
                  <input
                    type="url"
                    value={newApp.downloadUrl}
                    onChange={(e) => setNewApp({ ...newApp, downloadUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Grid className="w-4 h-4" />
                <span>Deploy to Software Directory</span>
              </button>
            </form>
          </div>

          {/* Manage Existing Apps */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0B0E17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-brand font-bold text-base text-slate-100">Live Apps ({apps.length})</h3>
              <span className="text-[11px] font-mono text-amber-300">Synchronized</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-400/30 flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100">{app.name}</h4>
                    <p className="text-[11px] text-slate-400">{app.tagline}</p>
                    <span className="text-[9px] font-mono text-slate-500">v{app.version} • {app.status}</span>
                  </div>

                  <button
                    onClick={() => {
                      const updated = apps.filter((a) => a.id !== app.id);
                      updateApps(updated);
                      showToast({ title: 'App Removed', message: `Removed "${app.name}".`, type: 'info' });
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
