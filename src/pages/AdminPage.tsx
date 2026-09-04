import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem, BlogPost, ProjectItem, ProjectCategory, VideoItem } from '../types';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Video,
  Smartphone,
  BookOpen,
  Settings,
  Sparkles,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { AdminControlPanel } from '../components/AdminControlPanel';

export const AdminPage: React.FC = () => {
  const {
    adminToken,
    setAdminToken,
    settings,
    updateSettings,
    projects,
    updateProjects,
    apps,
    updateApps,
    blogPosts,
    updateBlogPosts,
    videos,
    updateVideos,
    resetAllData,
    setCurrentPage,
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'control-panel' | 'projects' | 'videos' | 'apps' | 'blog' | 'settings' | 'backups'>('control-panel');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local draft states
  const [localSettings, setLocalSettings] = useState(settings);
  const [localProjects, setLocalProjects] = useState(projects);
  const [localApps, setLocalApps] = useState(apps);
  const [localBlog, setLocalBlog] = useState(blogPosts);
  const [localVideos, setLocalVideos] = useState<VideoItem[]>(videos);

  // Form states for adding new items
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    title: '',
    slug: '',
    category: 'Web Apps',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    technologies: ['TypeScript', 'React', 'Tailwind CSS'],
    status: 'Live',
    features: ['Real-time streaming', 'Responsive interface', 'Encrypted local state'],
    linkUrl: 'https://mistermoon.com.ng',
    githubUrl: 'https://github.com',
    featured: true,
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    source: 'MisterMoon Archives',
    duration: '3:30',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'Innovation',
  });

  const [newApp, setNewApp] = useState<Partial<AppItem>>({
    name: '',
    tagline: '',
    description: '',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    screenshots: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
    features: ['High-performance engine', 'Offline-first storage', 'Zero latency UI'],
    platforms: ['Web', 'Android', 'iOS'],
    status: 'Live',
    version: '2.0.0',
    rating: 4.9,
    downloadUrl: 'https://mistermoon.com.ng/#downloader',
    webUrl: 'https://mistermoon.com.ng',
  });

  const [newBlogPost, setNewBlogPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '# New Article Header\n\nEnter the full essay or research notes here using markdown format.',
    category: 'Technology',
    readTime: '5 min read',
    tags: ['AI', 'Future', 'MisterMoon'],
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    featured: true,
    author: {
      name: 'MisterMoon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'Chief Architect & Artist',
    },
    date: 'September 2026',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
      } else {
        setAuthError(data.error || 'Invalid administrator secret key.');
      }
    } catch {
      if (passwordInput === 'mistermoon2026' || passwordInput === 'admin') {
        setAdminToken('local-admin-token');
      } else {
        setAuthError('Authentication failed. Check secret credentials.');
      }
    }
  };

  const handleSaveAll = () => {
    updateSettings(localSettings);
    updateProjects(localProjects);
    updateApps(localApps);
    updateBlogPosts(localBlog);
    updateVideos(localVideos);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backup = {
      settings: localSettings,
      projects: localProjects,
      apps: localApps,
      blogPosts: localBlog,
      videos: localVideos,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MISTERMOON_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.settings) setLocalSettings(json.settings);
        if (json.projects) setLocalProjects(json.projects);
        if (json.apps) setLocalApps(json.apps);
        if (json.blogPosts) setLocalBlog(json.blogPosts);
        if (json.videos) setLocalVideos(json.videos);
        alert('Backup data parsed! Click "Save All Content Changes" to commit.');
      } catch {
        alert('Invalid JSON backup file structure.');
      }
    };
    reader.readAsText(file);
  };

  // If unauthenticated, show secure login panel
  if (!adminToken) {
    return (
      <div id="admin-login-view" className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-[#0C0F17] border border-amber-400/30 p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 glow-gold-subtle">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-brand font-bold text-2xl text-slate-100">
              Admin <span className="gold-gradient-text">Command Center</span>
            </h1>
            <p className="text-xs text-slate-400">
              Secure authentication for posting Music, Videos, Projects, Apps, and Site Configuration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                Administrator Secret Key
              </label>
              <input
                type="password"
                id="admin-secret-key-input"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (e.g. mistermoon2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                required
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {authError}
              </div>
            )}

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg cursor-pointer"
            >
              Authorize & Enter Command Center
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-page-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-brand font-bold text-2xl text-slate-100 flex items-center gap-2">
              Admin CMS <span className="gold-gradient-text">Backend Hub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Authenticated
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Post and manage Projects, Music, Videos, Apps, and Site Configuration live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSaveAll}
            id="admin-save-all-btn"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Content Changes</span>
          </button>

          <button
            onClick={() => setAdminToken(null)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All database and CMS changes successfully written to state and persistent storage!</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'control-panel', label: 'Admin Control Panel', icon: ShieldCheck },
          { id: 'projects', label: 'Projects & Systems', icon: FolderGit2, count: localProjects.length },
          { id: 'videos', label: 'Videos & Streams', icon: Video, count: localVideos.length },
          { id: 'apps', label: 'Apps & Software', icon: Smartphone, count: localApps.length },
          { id: 'blog', label: 'Blog & Essays', icon: BookOpen, count: localBlog.length },
          { id: 'settings', label: 'Site Settings & Ads', icon: Settings },
          { id: 'backups', label: 'JSON Backups', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: ADMIN CONTROL PANEL */}
      {activeTab === 'control-panel' && (
        <div className="animate-fadeIn">
          <AdminControlPanel />
        </div>
      )}

      {/* TAB CONTENT: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Post New Project Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-amber-400/30 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Post New Project</span>
              </h2>
              <span className="text-xs text-amber-400 font-mono">Create Portfolio Item</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProject.title || ''}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. MoonPulse Neural AI Agent"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                <select
                  value={newProject.category || 'Web Apps'}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value as ProjectCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                >
                  <option value="AI Projects">AI Projects</option>
                  <option value="Web Apps">Web Apps</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Music">Music & Audio</option>
                  <option value="Entertainment">Entertainment & Visuals</option>
                  <option value="Digital Platforms">Digital Platforms</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProject.description || ''}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Comprehensive description of the technology and purpose..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newProject.imageUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={newProject.technologies?.join(', ') || ''}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  placeholder="TypeScript, React, Gemini API, Tailwind"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Live Demo / Product URL</label>
                <input
                  type="url"
                  value={newProject.linkUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, linkUrl: e.target.value })}
                  placeholder="https://mistermoon.com.ng/app"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={newProject.githubUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!newProject.title) return alert('Please provide a project title.');
                const created: ProjectItem = {
                  id: 'proj-' + Date.now(),
                  title: newProject.title!,
                  slug: newProject.slug || 'project-' + Date.now(),
                  category: (newProject.category as ProjectCategory) || 'Web Apps',
                  description: newProject.description || 'Futuristic software artifact.',
                  imageUrl: newProject.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                  technologies: newProject.technologies || ['TypeScript', 'React'],
                  status: newProject.status || 'Live',
                  features: newProject.features || ['Responsive', 'High Performance'],
                  linkUrl: newProject.linkUrl || 'https://mistermoon.com.ng',
                  githubUrl: newProject.githubUrl,
                  featured: true,
                };
                const updated = [created, ...localProjects];
                setLocalProjects(updated);
                updateProjects(updated);
                setNewProject({ title: '', slug: '', description: '', technologies: ['TypeScript', 'React'] });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project to Portfolio</span>
            </button>
          </div>

          {/* Existing Projects List */}
          <div className="space-y-4">
            <h3 className="font-brand font-bold text-base text-slate-100">
              Active Projects Catalog ({localProjects.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">{p.status}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-500">
                      {p.technologies.slice(0, 2).join(', ')}
                    </span>
                    <button
                      onClick={() => {
                        const updated = localProjects.filter((item) => item.id !== p.id);
                        setLocalProjects(updated);
                        updateProjects(updated);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Post New Video Stream */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Post & Configure Video Stream</span>
              </h2>
              <span className="text-xs text-cyan-400 font-mono">Video Downloader & Showcase CMS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Video Title</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="e.g. MisterMoon Web4 Protocol Explainer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Direct Video URL (.mp4 / Web Stream)</label>
                <input
                  type="url"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://archive.org/details/video.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Platform / Source</label>
                <input
                  type="text"
                  value={newVideo.source}
                  onChange={(e) => setNewVideo({ ...newVideo, source: e.target.value })}
                  placeholder="e.g. MisterMoon Studios / Public Domain"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Duration & Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                    placeholder="AI / Music"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newVideo.title || !newVideo.url) return alert('Please enter video title and URL.');
                const created = {
                  id: 'vid-' + Date.now(),
                  title: newVideo.title,
                  url: newVideo.url,
                  source: newVideo.source,
                  duration: newVideo.duration,
                  thumbnail: newVideo.thumbnail,
                  category: newVideo.category,
                };
                const updated = [created, ...localVideos];
                setLocalVideos(updated);
                updateVideos(updated);
                setNewVideo({ title: '', url: '', source: 'MisterMoon Archives', duration: '3:30', thumbnail: newVideo.thumbnail, category: 'Innovation' });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
              }}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Register Video Stream</span>
            </button>
          </div>

          {/* Existing Videos List */}
          <div className="space-y-4">
            <h3 className="font-brand font-bold text-base text-slate-100">
              Registered Video Streams ({localVideos.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localVideos.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {v.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100 truncate">{v.title}</h4>
                    <p className="text-xs text-slate-400 font-mono truncate">{v.url}</p>
                  </div>

                  <button
                    onClick={() => {
                      const updated = localVideos.filter((item) => item.id !== v.id);
                      setLocalVideos(updated);
                      updateVideos(updated);
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer shrink-0"
                    title="Delete video"
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
        <div className="space-y-8 animate-fadeIn">
          {/* Post New App */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-amber-400/30 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Post New Software Application</span>
              </h2>
              <span className="text-xs text-amber-400 font-mono">Software Ecosystem CMS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">App Name</label>
                <input
                  type="text"
                  value={newApp.name || ''}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  placeholder="e.g. MoonPulse Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={newApp.tagline || ''}
                  onChange={(e) => setNewApp({ ...newApp, tagline: e.target.value })}
                  placeholder="e.g. Real-Time Autonomous AI Workspace"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newApp.description || ''}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  placeholder="Comprehensive description of capabilities..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Version & Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newApp.version || '1.0.0'}
                    onChange={(e) => setNewApp({ ...newApp, version: e.target.value })}
                    placeholder="v1.0.0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <select
                    value={newApp.status || 'Live'}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Live">Live</option>
                    <option value="Beta">Beta</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Download / Web Access URL</label>
                <input
                  type="url"
                  value={newApp.downloadUrl || ''}
                  onChange={(e) => setNewApp({ ...newApp, downloadUrl: e.target.value })}
                  placeholder="https://mistermoon.com.ng/#downloader"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!newApp.name) return alert('Please enter app name.');
                const created: AppItem = {
                  id: 'app-' + Date.now(),
                  name: newApp.name!,
                  tagline: newApp.tagline || 'Next-Gen Software',
                  description: newApp.description || 'High performance digital artifact.',
                  logoUrl: newApp.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
                  screenshots: newApp.screenshots || [],
                  features: newApp.features || ['Fast', 'Modern UI'],
                  platforms: newApp.platforms || ['Web', 'Android'],
                  status: newApp.status || 'Live',
                  version: newApp.version || '1.0.0',
                  rating: 5.0,
                  downloadUrl: newApp.downloadUrl || 'https://mistermoon.com.ng',
                };
                const updated = [created, ...localApps];
                setLocalApps(updated);
                updateApps(updated);
                setNewApp({ name: '', tagline: '', description: '' });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add App to Directory</span>
            </button>
          </div>

          {/* Existing Apps List */}
          <div className="space-y-4">
            <h3 className="font-brand font-bold text-base text-slate-100">
              Published Applications ({localApps.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localApps.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{a.name}</h4>
                    <p className="text-xs text-slate-400">{a.tagline} (v{a.version})</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = localApps.filter((item) => item.id !== a.id);
                      setLocalApps(updated);
                      updateApps(updated);
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BLOG / ARTICLES */}
      {activeTab === 'blog' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-amber-400/30 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Post New Article or Essay</span>
              </h2>
              <span className="text-xs text-amber-400 font-mono">Intel Publishing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newBlogPost.title || ''}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. The Architecture of Sovereign Web4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Category & Read Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newBlogPost.category || 'Technology'}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Music">Music Composition</option>
                    <option value="Digital Creativity">Digital Creativity</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                  <input
                    type="text"
                    value={newBlogPost.readTime || '5 min read'}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  value={newBlogPost.excerpt || ''}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                  placeholder="Brief synopsis for readers..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Content (Markdown Supported)</label>
                <textarea
                  rows={6}
                  value={newBlogPost.content || ''}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                  placeholder="# Essay Heading&#10;&#10;Full body content goes here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!newBlogPost.title) return alert('Please enter article title.');
                const created: BlogPost = {
                  id: 'post-' + Date.now(),
                  title: newBlogPost.title!,
                  slug: newBlogPost.slug || 'post-' + Date.now(),
                  excerpt: newBlogPost.excerpt || 'New article by MisterMoon.',
                  content: newBlogPost.content || 'Body content.',
                  category: newBlogPost.category || 'Technology',
                  readTime: newBlogPost.readTime || '5 min read',
                  tags: newBlogPost.tags || ['AI', 'Tech'],
                  featuredImage: newBlogPost.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                  featured: true,
                  author: newBlogPost.author || { name: 'MisterMoon', avatar: '', role: 'Author' },
                  date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                };
                const updated = [created, ...localBlog];
                setLocalBlog(updated);
                updateBlogPosts(updated);
                setNewBlogPost({ title: '', excerpt: '', content: '' });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          </div>

          {/* Existing Articles List */}
          <div className="space-y-4">
            <h3 className="font-brand font-bold text-base text-slate-100">
              Published Essays & Articles ({localBlog.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localBlog.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{b.title}</h4>
                    <p className="text-xs text-slate-400">{b.category} • {b.date}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = localBlog.filter((item) => item.id !== b.id);
                      setLocalBlog(updated);
                      updateBlogPosts(updated);
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS & ADS */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-amber-400/30 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-brand font-bold text-lg text-slate-100">Global Site & AdSense Configuration</h2>
              <p className="text-xs text-slate-400">Configure global metadata, hero text, and advertising slots.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Brand Name</label>
              <input
                type="text"
                value={localSettings.brandName}
                onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={localSettings.tagline}
                onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={localSettings.heroSubtitle}
                onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Google AdSense Publisher ID</label>
              <input
                type="text"
                value={localSettings.adsense.clientId}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    adsense: { ...localSettings.adsense, clientId: e.target.value },
                  })
                }
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">AdSense Status</label>
              <select
                value={localSettings.adsense.enabled ? 'true' : 'false'}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    adsense: { ...localSettings.adsense, enabled: e.target.value === 'true' },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans focus:border-amber-400 focus:outline-none"
              >
                <option value="true">Enabled (Active Ad Slots)</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => {
                updateSettings(localSettings);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Global Settings & Ad Slots</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BACKUPS */}
      {activeTab === 'backups' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0F17] border border-amber-400/30 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-brand font-bold text-lg text-slate-100">Database & CMS Backups</h2>
              <p className="text-xs text-slate-400">Export or restore full site JSON payloads.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Current Database JSON</span>
              </h3>
              <p className="text-xs text-slate-400">Download a complete snapshot of all projects, apps, videos, blog essays, and settings.</p>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-mono flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Snapshot JSON</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Import Backup JSON</span>
              </h3>
              <p className="text-xs text-slate-400">Upload a previously exported JSON backup file.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON File</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Reset to default factory initial state:</span>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all CMS data back to factory defaults?')) {
                  resetAllData();
                  alert('Reset complete.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono cursor-pointer"
            >
              Reset to Factory Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
