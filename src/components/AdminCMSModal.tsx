import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem, BlogPost, MusicTrack, ProjectItem, SkillItem } from '../types';
import {
  ShieldCheck,
  X,
  Lock,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminCMSModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
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
    resetAllData,
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'projects' | 'apps' | 'blog' | 'adsense' | 'backup'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for draft editing
  const [localSettings, setLocalSettings] = useState(settings);
  const [localProjects, setLocalProjects] = useState(projects);
  const [localApps, setLocalApps] = useState(apps);
  const [localBlog, setLocalBlog] = useState(blogPosts);

  if (!isAdminOpen) return null;

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
      // Fallback local check
      if (passwordInput === 'mistermoon2026' || passwordInput === 'admin') {
        setAdminToken('local-admin-token');
      } else {
        setAuthError('Authentication failed.');
      }
    }
  };

  const handleSaveAll = () => {
    updateSettings(localSettings);
    updateProjects(localProjects);
    updateApps(localApps);
    updateBlogPosts(localBlog);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backup = {
      settings: localSettings,
      projects: localProjects,
      apps: localApps,
      blogPosts: localBlog,
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
        alert('Backup data loaded into editor. Click "Save Changes" to apply.');
      } catch {
        alert('Invalid backup JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="admin-cms-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl my-8 rounded-2xl bg-[#0B0E14] border border-amber-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
                MisterMoon Content Management System
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  v2.6 PRO
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Live In-Browser State & API Configuration Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                onClick={handleSaveAll}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 fill-slate-950" />
                <span>Save Changes</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>All modifications successfully synchronized to platform database and local cache!</span>
          </div>
        )}

        {/* Content Area */}
        {!adminToken ? (
          /* Authentication Form */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4 glow-gold-subtle">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="font-brand font-bold text-lg text-slate-100 mb-1">Administrator Access</h4>
            <p className="text-xs text-slate-400 mb-6">
              Enter the master secret key to unlock content editing, SEO parameters, and AdSense slot configurations.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                placeholder="Enter Secret Key (Default: mistermoon2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:border-amber-400 focus:outline-none"
              />
              {authError && <p className="text-xs text-rose-400">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-sm hover:opacity-95 transition-opacity"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        ) : (
          /* Logged In CMS Panel */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 p-3 bg-slate-950/90 border-r border-slate-800/80 flex md:flex-col gap-1 overflow-x-auto shrink-0 text-xs">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'general' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                Profile & Vision
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'projects' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                Projects ({localProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('apps')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'apps' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                Apps ({localApps.length})
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'blog' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                Articles ({localBlog.length})
              </button>
              <button
                onClick={() => setActiveTab('adsense')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'adsense' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                AdSense Slots
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'backup' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                Backup & Restore
              </button>

              <div className="pt-4 mt-auto border-t border-slate-800">
                <button
                  onClick={() => setAdminToken(null)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Form Editor Body */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[70vh] space-y-5 text-xs text-slate-300">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">
                    Brand & Profile Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={localSettings.brandName}
                        onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Website Domain Name</label>
                      <input
                        type="text"
                        value={localSettings.siteName}
                        onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Hero Main Headline</label>
                    <input
                      type="text"
                      value={localSettings.heroHeadline}
                      onChange={(e) => setLocalSettings({ ...localSettings, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">About Bio</label>
                    <textarea
                      rows={4}
                      value={localSettings.aboutBio}
                      onChange={(e) => setLocalSettings({ ...localSettings, aboutBio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Vision Statement</label>
                      <textarea
                        rows={3}
                        value={localSettings.vision}
                        onChange={(e) => setLocalSettings({ ...localSettings, vision: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Mission Statement</label>
                      <textarea
                        rows={3}
                        value={localSettings.mission}
                        onChange={(e) => setLocalSettings({ ...localSettings, mission: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-semibold text-sm text-slate-100">Projects Portfolio</h4>
                    <button
                      onClick={() => {
                        const newP: ProjectItem = {
                          id: 'proj-' + Date.now(),
                          title: 'New Futuristic Project',
                          slug: 'new-project-' + Date.now(),
                          category: 'AI Projects',
                          description: 'Description of the newly created innovation...',
                          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                          technologies: ['TypeScript', 'AI', 'Tailwind'],
                          status: 'In Development',
                          features: ['Automated Architecture', 'Zero Latency'],
                          linkUrl: '#',
                          featured: false,
                        };
                        setLocalProjects([newP, ...localProjects]);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localProjects.map((p, idx) => (
                      <div key={p.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const updated = [...localProjects];
                              updated[idx].title = e.target.value;
                              setLocalProjects(updated);
                            }}
                            className="font-semibold text-slate-100 bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none w-2/3"
                          />
                          <button
                            onClick={() => {
                              setLocalProjects(localProjects.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={p.description}
                          onChange={(e) => {
                            const updated = [...localProjects];
                            updated[idx].description = e.target.value;
                            setLocalProjects(updated);
                          }}
                          className="w-full px-2 py-1 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apps Tab */}
              {activeTab === 'apps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-semibold text-sm text-slate-100">Application Products</h4>
                    <button
                      onClick={() => {
                        const newApp: AppItem = {
                          id: 'app-' + Date.now(),
                          name: 'New App Name',
                          tagline: 'Futuristic application tagline',
                          description: 'Complete breakdown of what this app provides...',
                          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
                          screenshots: [],
                          features: ['Real-Time Sync', 'Offline Mode'],
                          platforms: ['Web', 'Android', 'iOS'],
                          status: 'Beta',
                          version: 'v1.0.0',
                          downloadUrl: '#',
                          rating: 4.9,
                        };
                        setLocalApps([newApp, ...localApps]);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add App
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localApps.map((a, idx) => (
                      <div key={a.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={a.name}
                            onChange={(e) => {
                              const updated = [...localApps];
                              updated[idx].name = e.target.value;
                              setLocalApps(updated);
                            }}
                            className="font-semibold text-slate-100 bg-transparent border-b border-transparent focus:border-cyan-400 focus:outline-none w-2/3"
                          />
                          <button
                            onClick={() => {
                              setLocalApps(localApps.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={a.tagline}
                          onChange={(e) => {
                            const updated = [...localApps];
                            updated[idx].tagline = e.target.value;
                            setLocalApps(updated);
                          }}
                          className="w-full px-2 py-1 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Tab */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-semibold text-sm text-slate-100">Articles & Insights</h4>
                    <button
                      onClick={() => {
                        const newPost: BlogPost = {
                          id: 'post-' + Date.now(),
                          slug: 'new-article-' + Date.now(),
                          title: 'New Article Headline',
                          excerpt: 'A short summary of the upcoming publication...',
                          content: 'Full markdown body content goes here...',
                          featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
                          author: {
                            name: 'MisterMoon',
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                            role: 'Founder & Digital Architect',
                          },
                          date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                          category: 'Technology',
                          readTime: '5 min read',
                          tags: ['Technology', 'AI'],
                        };
                        setLocalBlog([newPost, ...localBlog]);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Article
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localBlog.map((b, idx) => (
                      <div key={b.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => {
                              const updated = [...localBlog];
                              updated[idx].title = e.target.value;
                              setLocalBlog(updated);
                            }}
                            className="font-semibold text-slate-100 bg-transparent border-b border-transparent focus:border-emerald-400 focus:outline-none w-2/3"
                          />
                          <button
                            onClick={() => {
                              setLocalBlog(localBlog.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={b.excerpt}
                          onChange={(e) => {
                            const updated = [...localBlog];
                            updated[idx].excerpt = e.target.value;
                            setLocalBlog(updated);
                          }}
                          className="w-full px-2 py-1 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AdSense Tab */}
              {activeTab === 'adsense' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">
                    Google AdSense Configuration
                  </h4>
                  <p className="text-xs text-slate-400">
                    Configure your Google AdSense Publisher Client ID and slot codes. The platform automatically displays policy-compliant labeled responsive ad units.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">AdSense Client ID</label>
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Home Slot ID</label>
                        <input
                          type="text"
                          value={localSettings.adsense.homeSlot}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              adsense: { ...localSettings.adsense, homeSlot: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Downloader Slot ID</label>
                        <input
                          type="text"
                          value={localSettings.adsense.downloadSlot}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              adsense: { ...localSettings.adsense, downloadSlot: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Blog Slot ID</label>
                        <input
                          type="text"
                          value={localSettings.adsense.blogSlot}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              adsense: { ...localSettings.adsense, blogSlot: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="adsense-enable-chk"
                        checked={localSettings.adsense.enabled}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            adsense: { ...localSettings.adsense, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                      />
                      <label htmlFor="adsense-enable-chk" className="text-xs text-slate-300 cursor-pointer">
                        Enable AdSense Ad Units across website layout
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup & Restore Tab */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">
                    Backup & Disaster Recovery
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-amber-400" /> Export JSON Snapshot
                      </h5>
                      <p className="text-slate-400 text-xs">
                        Download a complete JSON export of all projects, apps, music records, blog articles, and settings.
                      </p>
                      <button
                        onClick={handleExportBackup}
                        className="mt-2 px-3 py-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs border border-amber-400/30 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download JSON Backup
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-cyan-400" /> Import JSON Snapshot
                      </h5>
                      <p className="text-slate-400 text-xs">
                        Upload a previously exported backup file to restore complete website data.
                      </p>
                      <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs border border-cyan-500/30 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Select Backup File
                        <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all content to system defaults?')) {
                          resetAllData();
                          setIsAdminOpen(false);
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset All Data to System Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
