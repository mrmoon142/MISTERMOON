import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppItem,
  BlogPost,
  CommentItem,
  CookiePreferences,
  DownloadHistoryItem,
  LanguageCode,
  PageTab,
  ProjectItem,
  SiteSettings,
  ThemeMode,
  UserSubscription,
  VideoItem,
} from '../types';
import {
  INITIAL_APPS,
  INITIAL_BLOG_POSTS,
  INITIAL_COMMENTS,
  INITIAL_PROJECTS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';
import { synthEngine } from '../utils/audioSynth';

interface AppContextType {
  currentPage: PageTab;
  setCurrentPage: (page: PageTab) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Internationalization
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Universal Comments System
  comments: CommentItem[];
  addComment: (comment: {
    targetId: string;
    targetType: 'blog' | 'project' | 'app' | 'general';
    authorName: string;
    authorEmail?: string;
    authorRole?: string;
    content: string;
    parentId?: string | null;
  }) => void;
  toggleLikeComment: (commentId: string) => void;
  getCommentsForTarget: (targetId: string) => CommentItem[];

  // Video Downloader Local History
  downloadHistory: DownloadHistoryItem[];
  addToHistory: (item: Omit<DownloadHistoryItem, 'id' | 'date'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Dynamic CMS Data
  settings: SiteSettings;
  projects: ProjectItem[];
  apps: AppItem[];
  blogPosts: BlogPost[];
  videos: VideoItem[];
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  updateApps: (apps: AppItem[]) => void;
  updateBlogPosts: (posts: BlogPost[]) => void;
  updateVideos: (videos: VideoItem[]) => void;
  resetAllData: () => void;

  // Modals & Triggers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  cookiePrefs: CookiePreferences;
  saveCookiePrefs: (prefs: Partial<CookiePreferences>) => void;

  // Pro Subscription & Security
  subscription: UserSubscription;
  activateSubscription: (email: string, plan: 'monthly' | 'yearly', paymentReference?: string) => Promise<{ success: boolean; subscription?: UserSubscription; error?: string }>;
  recoverSubscription: (email: string, paymentReference: string, uniqueCode: string) => Promise<{ success: boolean; subscription?: UserSubscription; error?: string }>;
  logoutSubscription: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  LANG: 'mistermoon_lang',
  THEME: 'mistermoon_theme',
  HISTORY: 'mistermoon_download_history',
  SETTINGS: 'mistermoon_settings_v1',
  PROJECTS: 'mistermoon_projects_v1',
  APPS: 'mistermoon_apps_v1',
  BLOG: 'mistermoon_blog_v1',
  VIDEOS: 'mistermoon_videos_v1',
  COMMENTS: 'mistermoon_comments_v1',
  COOKIES: 'mistermoon_cookie_prefs',
  ADMIN_TOKEN: 'mistermoon_admin_auth',
  SUBSCRIPTION: 'mistermoon_user_sub_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View state
  const [currentPage, setCurrentPageState] = useState<PageTab>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Sync hash routing on initial load and change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash || hash === 'home') {
        setCurrentPageState('home');
      } else if (hash.startsWith('blog/')) {
        const slug = hash.replace('blog/', '');
        setSelectedArticleId(slug);
        setCurrentPageState('blog');
      } else if (hash.startsWith('projects?id=')) {
        const id = hash.replace('projects?id=', '');
        setSelectedProjectId(id);
        setCurrentPageState('projects');
      } else if (
        [
          'about',
          'projects',
          'apps',
          'downloader',
          'ai-studio',
          'blog',
          'contact',
          'admin',
          'legal-privacy',
          'legal-terms',
          'legal-cookies',
        ].includes(hash)
      ) {
        setCurrentPageState(hash as PageTab);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentPage = (page: PageTab) => {
    setCurrentPageState(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (saved as ThemeMode) || 'dark';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, mode);
    applyThemeClass(mode);
  };

  const applyThemeClass = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Dynamic CMS Data
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingLinks = parsed.socialLinks || [];
        const hasFacebook = existingLinks.some((l: { platform?: string }) => l.platform?.toLowerCase() === 'facebook');
        const hasTikTok = existingLinks.some((l: { platform?: string }) => l.platform?.toLowerCase() === 'tiktok');
        if (!hasFacebook || !hasTikTok) {
          const updatedLinks = [...existingLinks];
          if (!hasFacebook) {
            updatedLinks.push({ platform: 'Facebook', url: 'https://facebook.com/MISTERMOON142', icon: 'Facebook' });
          }
          if (!hasTikTok) {
            updatedLinks.push({ platform: 'TikTok', url: 'https://tiktok.com/@MISTERMOON142', icon: 'Music2' });
          }
          parsed.socialLinks = updatedLinks;
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.APPS);
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BLOG);
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEOS);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'vid-1',
              title: 'MisterMoon Cybernetic Vision 2026',
              url: 'https://archive.org/details/SampleVideo1280x7205mb.mp4',
              source: 'MisterMoon Studios',
              duration: '4:20',
              thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
              category: 'AI Visuals',
              description: 'Autonomous synthetic visual workflows crafted by Miracle Dike.',
            },
            {
              id: 'vid-2',
              title: 'Odyssey Synthesis Live Performance',
              url: 'https://archive.org/details/mistermoon_futuristic_teaser.mp4',
              source: 'MisterMoon Sonic Vault',
              duration: '5:45',
              thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
              category: 'Electronic Music',
              description: 'Real-time sonic performance and harmonic frequency synthesis.',
            },
          ];
    } catch {
      return [];
    }
  });

  // Universal Comments State
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const addComment = (newCommentData: {
    targetId: string;
    targetType: 'blog' | 'project' | 'app' | 'general';
    authorName: string;
    authorEmail?: string;
    authorRole?: string;
    content: string;
    parentId?: string | null;
  }) => {
    const newComment: CommentItem = {
      id: 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      targetId: newCommentData.targetId,
      targetType: newCommentData.targetType,
      authorName: newCommentData.authorName.trim() || 'Anonymous Explorer',
      authorEmail: newCommentData.authorEmail?.trim(),
      authorRole: newCommentData.authorRole?.trim() || 'Community Member',
      content: newCommentData.content.trim(),
      timestamp: 'Just now',
      likes: 0,
      userLiked: false,
      parentId: newCommentData.parentId || null,
      replies: [],
    };

    setComments((prev) => {
      let updated: CommentItem[];
      if (newCommentData.parentId) {
        // Add as reply
        updated = prev.map((c) => {
          if (c.id === newCommentData.parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        });
      } else {
        // Add as top-level comment
        updated = [newComment, ...prev];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save comments', e);
      }
      return updated;
    });
  };

  const toggleLikeComment = (commentId: string) => {
    setComments((prev) => {
      const updateList = (list: CommentItem[]): CommentItem[] => {
        return list.map((c) => {
          if (c.id === commentId) {
            const userLiked = !c.userLiked;
            return {
              ...c,
              likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
              userLiked,
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateList(c.replies),
            };
          }
          return c;
        });
      };

      const updated = updateList(prev);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update comment likes', e);
      }
      return updated;
    });
  };

  const getCommentsForTarget = (targetId: string): CommentItem[] => {
    if (!targetId) return [];
    const post = blogPosts.find((p) => p.id === targetId || p.slug === targetId);
    const validIds = new Set<string>([targetId]);
    if (post) {
      validIds.add(post.id);
      validIds.add(post.slug);
    }
    return comments.filter((c) => validIds.has(c.targetId) && !c.parentId);
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    });
  };

  const updateProjects = (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
  };

  const updateApps = (newApps: AppItem[]) => {
    setApps(newApps);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPS, JSON.stringify(newApps));
  };

  const updateBlogPosts = (newPosts: BlogPost[]) => {
    setBlogPosts(newPosts);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOG, JSON.stringify(newPosts));
  };

  const updateVideos = (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIDEOS, JSON.stringify(newVideos));
  };

  const resetAllData = () => {
    setSettings(INITIAL_SETTINGS);
    setProjects(INITIAL_PROJECTS);
    setApps(INITIAL_APPS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setVideos([]);
    setComments(INITIAL_COMMENTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.APPS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.BLOG);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.COMMENTS);
  };

  // Video Downloader Local History
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (item: Omit<DownloadHistoryItem, 'id' | 'date'>) => {
    const newItem: DownloadHistoryItem = {
      ...item,
      id: 'dl-' + Date.now(),
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
    setDownloadHistory((prev) => {
      const updated = [newItem, ...prev.filter((h) => h.url !== item.url)].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (id: string) => {
    setDownloadHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.HISTORY);
  };

  // Modals & Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN);
  });

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN);
    }
  };

  // Cookies
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COOKIES);
      return saved
        ? JSON.parse(saved)
        : { essential: true, analytics: true, advertising: true, decided: false };
    } catch {
      return { essential: true, analytics: true, advertising: true, decided: false };
    }
  });

  const saveCookiePrefs = (prefs: Partial<CookiePreferences>) => {
    setCookiePrefs((prev) => {
      const updated = { ...prev, ...prefs, decided: true };
      localStorage.setItem(LOCAL_STORAGE_KEYS.COOKIES, JSON.stringify(updated));
      return updated;
    });
  };

  // User Pro Subscription & License Security
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse subscription state', e);
    }
    return {
      isPro: false,
      tier: 'free',
    };
  });

  // Verify stored subscription on startup if uniqueCode is present
  useEffect(() => {
    if (subscription.uniqueCode && subscription.isPro) {
      fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueCode: subscription.uniqueCode }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid && data.subscription) {
            setSubscription(data.subscription);
            localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(data.subscription));
          }
        })
        .catch(() => {});
    }
  }, []);

  const activateSubscription = async (
    email: string,
    plan: 'monthly' | 'yearly',
    paymentReference?: string
  ): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> => {
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan, paymentReference }),
      });
      const data = await res.json();
      if (data.success && data.subscription) {
        setSubscription(data.subscription);
        localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(data.subscription));
        return { success: true, subscription: data.subscription };
      }
      return { success: false, error: data.error || 'Failed to activate subscription' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during upgrade.' };
    }
  };

  const recoverSubscription = async (
    email: string,
    paymentReference: string,
    uniqueCode: string
  ): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> => {
    try {
      const res = await fetch('/api/subscription/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, paymentReference, uniqueCode }),
      });
      const data = await res.json();
      if (data.success && data.subscription) {
        setSubscription(data.subscription);
        localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(data.subscription));
        return { success: true, subscription: data.subscription };
      }
      return { success: false, error: data.error || 'Invalid credentials or unique code' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during subscription recovery.' };
    }
  };

  const logoutSubscription = () => {
    setSubscription({ isPro: false, tier: 'free' });
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedArticleId,
        setSelectedArticleId,
        selectedProjectId,
        setSelectedProjectId,
        language,
        setLanguage,
        t,
        isRtl,
        theme,
        setTheme,
        comments,
        addComment,
        toggleLikeComment,
        getCommentsForTarget,
        downloadHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        settings,
        projects,
        apps,
        blogPosts,
        videos,
        updateSettings,
        updateProjects,
        updateApps,
        updateBlogPosts,
        updateVideos,
        resetAllData,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminToken,
        setAdminToken,
        cookiePrefs,
        saveCookiePrefs,
        subscription,
        activateSubscription,
        recoverSubscription,
        logoutSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
