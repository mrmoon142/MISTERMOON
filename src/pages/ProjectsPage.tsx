import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ProjectItem } from '../types';
import { AdContainer } from '../components/AdContainer';
import { NoProjectsFound } from '../components/NoProjectsFound';
import { ProjectSpotlightModal } from '../components/ProjectSpotlightModal';
import { useToast } from '../components/ToastNotification';
import { synthEngine } from '../utils/audioSynth';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProjectGridSkeleton } from '../components/SkeletonLoader';
import {
  Layers,
  Search,
  ExternalLink,
  Github,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Code2,
  Palette,
  Music2,
  Filter,
  ArrowUpDown,
  Share2,
  Copy,
  Check,
  Star,
  Link,
  Bot,
  Loader2,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, getCommentsForTarget, t } = useApp();
  const { showToast } = useToast();
  // Category Filter Chips
  type FilterCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Development' | 'Design';
  type SortOption = 'newest' | 'popularity' | 'alphabetical';

  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [inspectProject, setInspectProject] = useState<ProjectItem | null>(null);

  // Starred state & counts for Quick Actions
  const [starredProjects, setStarredProjects] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mistermoon_starred_projects');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [starCounts, setStarCounts] = useState<Record<string, number>>(() => {
    // Initial mock base counts based on project id seed
    const initial: Record<string, number> = {};
    projects.forEach((p, idx) => {
      initial[p.id] = (idx + 1) * 37 + (p.featured ? 80 : 20);
    });
    return initial;
  });

  // Dynamic AI-Generated Tech Stacks map
  const [aiTechStacks, setAiTechStacks] = useState<Record<string, { badges: string[]; loading: boolean; source?: string }>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Toggle Star Handler
  const handleToggleStar = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willBeStarred = !starredProjects[projectId];
    const project = projects.find((p) => p.id === projectId);

    setStarredProjects((prev) => {
      const updated = { ...prev, [projectId]: willBeStarred };
      try {
        localStorage.setItem('mistermoon_starred_projects', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setStarCounts((prev) => {
      const current = prev[projectId] || 50;
      return {
        ...prev,
        [projectId]: willBeStarred ? current + 1 : Math.max(0, current - 1),
      };
    });

    if (willBeStarred) {
      synthEngine.playUiSound('star');
      showToast({
        title: 'Project Starred! ★',
        message: `Saved "${project?.title || 'Project'}" to your favorites.`,
        type: 'star',
      });
    } else {
      synthEngine.playUiSound('click');
      showToast({
        title: 'Star Removed',
        message: `Removed "${project?.title || 'Project'}" from favorites.`,
        type: 'info',
      });
    }
  };

  // Copy Project Link Handler
  const handleCopyLink = async (project: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const projectUrl = `${window.location.origin}${window.location.pathname}#projects?id=${project.slug || project.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      synthEngine.playUiSound('copy');
      showToast({
        title: 'Project Link Copied! 🔗',
        message: `Direct link for "${project.title}" copied to clipboard.`,
        type: 'link',
      });
    } catch {
      showToast({
        title: 'Copy Failed',
        message: 'Could not access system clipboard.',
        type: 'error',
      });
    }
  };

  // Generate Tech Stack Badges via Gemini API
  const handleGenerateTechStack = async (project: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (aiTechStacks[project.id]?.loading) return;

    synthEngine.playUiSound('click');
    setAiTechStacks((prev) => ({
      ...prev,
      [project.id]: { badges: prev[project.id]?.badges || project.technologies, loading: true },
    }));

    try {
      const res = await fetch('/api/gemini/tech-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          category: project.category,
          currentTech: project.technologies,
        }),
      });
      const data = await res.json();
      if (data.technologies && Array.isArray(data.technologies)) {
        setAiTechStacks((prev) => ({
          ...prev,
          [project.id]: { badges: data.technologies, loading: false, source: data.source },
        }));
        synthEngine.playUiSound('success');
        showToast({
          title: 'AI Tech Stack Generated ✨',
          message: `Badges generated for "${project.title}" via Gemini 3.7 Flash.`,
          type: 'ai',
        });
      } else {
        throw new Error('No technologies returned');
      }
    } catch (err) {
      console.error('Failed to generate tech stack with Gemini:', err);
      setAiTechStacks((prev) => ({
        ...prev,
        [project.id]: { badges: project.technologies, loading: false },
      }));
      synthEngine.playUiSound('error');
      showToast({
        title: 'AI Generation Fallback',
        message: 'Loaded standard heuristics for tech stack.',
        type: 'info',
      });
    }
  };

  // Auto-Generate All Tech Stacks
  const handleGenerateAllStacks = async () => {
    setIsGeneratingAll(true);
    synthEngine.playUiSound('click');
    showToast({
      title: 'Analyzing Portfolio',
      message: 'Parsing project descriptions with Gemini API...',
      type: 'ai',
    });

    for (const project of filteredProjects) {
      try {
        const res = await fetch('/api/gemini/tech-stack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            category: project.category,
            currentTech: project.technologies,
          }),
        });
        const data = await res.json();
        if (data.technologies && Array.isArray(data.technologies)) {
          setAiTechStacks((prev) => ({
            ...prev,
            [project.id]: { badges: data.technologies, loading: false, source: data.source },
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    setIsGeneratingAll(false);
    synthEngine.playUiSound('success');
    showToast({
      title: 'AI Portfolio Optimization Complete ✨',
      message: 'All visible project badges parsed with Gemini AI.',
      type: 'ai',
    });
  };

  // Primary Interactive Category Filter Buttons
  const categoryChips: { id: FilterCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'All', label: 'All Projects', icon: Layers },
    { id: 'AI', label: 'AI & Neural', icon: Sparkles },
    { id: 'Web', label: 'Web Apps', icon: Code2 },
    { id: 'Mobile', label: 'Mobile Apps', icon: Filter },
    { id: 'Development', label: 'Development', icon: Code2 },
    { id: 'Design', label: 'Design & UI', icon: Palette },
  ];

  const matchesCategoryGroup = (project: ProjectItem, category: FilterCategory) => {
    if (category === 'All') return true;

    if (category === 'AI') {
      return (
        project.category === 'AI Projects' ||
        project.title.toLowerCase().includes('ai') ||
        project.title.toLowerCase().includes('pulse') ||
        project.technologies.some((t) =>
          ['AI', 'Gemini', 'Neural', 'Machine Learning', 'LLM', 'GPT'].some((k) =>
            t.toLowerCase().includes(k.toLowerCase())
          )
        ) ||
        project.description.toLowerCase().includes('intelligence') ||
        project.description.toLowerCase().includes('ai')
      );
    }

    if (category === 'Web') {
      return (
        project.category === 'Web Apps' ||
        project.category === 'Digital Platforms' ||
        project.technologies.some((t) =>
          ['React', 'Next.js', 'Vite', 'TypeScript', 'Node.js', 'Express', 'Tailwind'].some((k) =>
            t.toLowerCase().includes(k.toLowerCase())
          )
        )
      );
    }

    if (category === 'Mobile') {
      return (
        project.category === 'Mobile Apps' ||
        project.technologies.some((t) =>
          ['React Native', 'Flutter', 'Android', 'iOS', 'PWA', 'Mobile'].some((k) =>
            t.toLowerCase().includes(k.toLowerCase())
          )
        ) ||
        project.description.toLowerCase().includes('mobile') ||
        project.description.toLowerCase().includes('phone')
      );
    }

    if (category === 'Development') {
      return (
        project.category === 'AI Projects' ||
        project.category === 'Digital Platforms' ||
        project.category === 'Web Apps' ||
        project.category === 'Mobile Apps' ||
        project.technologies.some((tech) =>
          ['TypeScript', 'React', 'Node.js', 'Express', 'Gemini', 'Docker', 'Web Crypto API'].some((k) =>
            tech.toLowerCase().includes(k.toLowerCase())
          )
        )
      );
    }

    if (category === 'Design') {
      return (
        project.category === 'Digital Platforms' ||
        project.title.toLowerCase().includes('stage') ||
        project.title.toLowerCase().includes('visual') ||
        project.description.toLowerCase().includes('design') ||
        project.description.toLowerCase().includes('cinema') ||
        project.description.toLowerCase().includes('interface')
      );
    }

    return true;
  };

  const filteredProjects = projects
    .filter((project) => {
      const matchesCat = matchesCategoryGroup(project, selectedCategory);
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'popularity') {
        const starA = starCounts[a.id] || 0;
        const starB = starCounts[b.id] || 0;
        const scoreA = (a.featured ? 10 : 0) + (a.status === 'Live' ? 5 : 2) + starA;
        const scoreB = (b.featured ? 10 : 0) + (b.status === 'Live' ? 5 : 2) + starB;
        return scoreB - scoreA;
      }
      // 'newest' default
      return b.id.localeCompare(a.id);
    });

  const handleShareProject = async (project: ProjectItem) => {
    const shareUrl = window.location.origin ? `${window.location.origin}#projects?id=${project.slug || project.id}` : window.location.href;
    const shareData = {
      title: `${project.title} | MisterMoon Portfolio`,
      text: `${project.title}: ${project.description.slice(0, 120)}... Built by MisterMoon.`,
      url: project.linkUrl || shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        synthEngine.playUiSound('success');
        showToast({
          title: 'Shared Successfully! ✨',
          message: `Shared "${project.title}" via native share dialog.`,
          type: 'success',
        });
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          // Fallback to clipboard copy
          try {
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
            synthEngine.playUiSound('copy');
            showToast({
              title: 'Link Copied! 🔗',
              message: `Share details copied for "${project.title}".`,
              type: 'link',
            });
          } catch {
            showToast({
              title: 'Share Failed',
              message: 'Could not complete sharing operation.',
              type: 'error',
            });
          }
        }
      }
    } else {
      // Direct clipboard fallback
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        synthEngine.playUiSound('copy');
        showToast({
          title: 'Project Link Copied! 🔗',
          message: `Share details copied for "${project.title}".`,
          type: 'link',
        });
      } catch {
        showToast({
          title: 'Copy Failed',
          message: 'Could not access clipboard.',
          type: 'error',
        });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Motion Variants for Staggered Children Grid
  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div id="projects-page-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('projects_badge', 'INNOVATION PORTFOLIO')}</span>
        </div>

        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Next-Generation <span className="gold-gradient-text">Systems & Software</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          Explore production-grade software applications, artificial intelligence agents, audio engineering suites, and decentralized Web4 protocols.
        </p>

        {/* AI Stack Auto-Enhance Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerateAllStacks}
            disabled={isGeneratingAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 via-yellow-500/20 to-cyan-400/20 hover:from-amber-400/30 hover:to-cyan-400/30 border border-amber-400/40 text-amber-300 text-xs font-mono transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.15)] disabled:opacity-50"
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Parsing Stacks with Gemini 3.7 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>✨ Auto-Generate Tech Badges with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Filter Chips, Dropdown Sort, and Search Controls */}
      <div className="space-y-4">
        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none p-2 rounded-2xl bg-[#0C0F17] border border-slate-800">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            const isSelected = selectedCategory === chip.id;
            const count = projects.filter((p) => matchesCategoryGroup(p, chip.id)).length;

            return (
              <button
                key={chip.id}
                id={`project-filter-chip-${chip.id.toLowerCase()}`}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400/25 to-yellow-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.2)] font-semibold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-amber-400/30 text-amber-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Controls Bar: Live Search & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0C0F17] border border-slate-800 shadow-xl">
          {/* Live Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              id="project-search-input"
              placeholder="Search projects by title, description, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 px-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Sort:</span>
            </div>
            <div className="relative">
              <select
                id="project-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none px-4 py-2.5 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm"
              >
                <option value="newest">⚡ Newest Releases</option>
                <option value="popularity">🔥 Most Popular (Stars)</option>
                <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid with Framer Motion Staggered Entrance */}
      {projects.length === 0 ? (
        <ProjectGridSkeleton count={6} />
      ) : filteredProjects.length > 0 ? (
        <motion.div
          key={`${selectedCategory}-${sortBy}-${searchQuery}`}
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => {
            const isStarred = Boolean(starredProjects[project.id]);
            const stars = starCounts[project.id] || 0;
            const currentAiState = aiTechStacks[project.id];
            const displayTechBadges = currentAiState?.badges || project.technologies;
            const isAiEnhanced = Boolean(currentAiState?.source);

            return (
              <motion.div
                key={project.id}
                variants={cardItemVariants}
                className="group relative rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between overflow-hidden hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
              >
                {/* Floating 'Quick Actions' Menu on Card Hover */}
                <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/90 backdrop-blur-md border border-amber-400/50 shadow-2xl">
                    {/* Copy Link Button */}
                    <button
                      onClick={(e) => handleCopyLink(project, e)}
                      title="Copy Project Link"
                      className="p-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Star Project Button */}
                    <button
                      onClick={(e) => handleToggleStar(project.id, e)}
                      title={isStarred ? 'Unstar Project' : 'Star Project'}
                      className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-[10px] font-mono cursor-pointer ${
                        isStarred
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                          : 'bg-slate-900/90 text-slate-300 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                      <span className="pr-1">{stars}</span>
                    </button>

                    {/* View Repository Button */}
                    <a
                      href={project.githubUrl || `https://github.com/MISTERMOON142?tab=repositories&q=${encodeURIComponent(project.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="View Repository"
                      className="p-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Project Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/30 text-[10px] font-mono text-amber-300">
                    {project.category}
                  </span>
                  <span className="absolute top-12 left-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">
                    {project.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-brand font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                        {project.title}
                      </h3>
                      {stars > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Star className={`w-3 h-3 ${isStarred ? 'fill-amber-400' : ''}`} />
                          <span>{stars}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Features snippet */}
                  <div className="space-y-1 py-1">
                    {project.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Tech Stack Badges generated with Gemini API */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        <span>Tech Stack</span>
                        {isAiEnhanced && (
                          <span className="inline-flex items-center gap-0.5 text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded-full border border-amber-400/30">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>AI Parsed</span>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleGenerateTechStack(project, e)}
                        disabled={currentAiState?.loading}
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Parse project description with Gemini AI to generate stack badges"
                      >
                        {currentAiState?.loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span>{currentAiState?.loading ? 'Analyzing...' : 'AI Stack'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {displayTechBadges.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[10px] font-mono border border-slate-800 hover:border-amber-400/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setInspectProject(project)}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Detailed Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectProject(project);
                        }}
                        className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono border border-slate-800"
                        title="View technical discussion & comments"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>{getCommentsForTarget(project.id).length}</span>
                      </button>

                      <button
                        onClick={() => handleShareProject(project)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer border border-slate-800"
                        title="Share Project"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                          title="GitHub Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Custom Gold-Themed Zero-State Illustration Component */
        <NoProjectsFound
          category={selectedCategory}
          searchQuery={searchQuery}
          onReset={handleResetFilters}
        />
      )}

      {/* AdSense Unit */}
      <AdContainer slot="project" format="horizontal" />

      {/* Full-Screen Glassmorphic Project Spotlight Modal */}
      <ProjectSpotlightModal
        project={inspectProject}
        allProjects={projects}
        onClose={() => setInspectProject(null)}
        onSelectProject={(p) => setInspectProject(p)}
        isStarred={inspectProject ? !!starredProjects[inspectProject.id] : false}
        onToggleStar={handleToggleStar}
        starCount={inspectProject ? starCounts[inspectProject.id] || 0 : 0}
      />
    </div>
  );
};

