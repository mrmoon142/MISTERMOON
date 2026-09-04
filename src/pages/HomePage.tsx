import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBackground } from '../components/HeroBackground';
import { AdContainer } from '../components/AdContainer';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProjectSpotlightModal } from '../components/ProjectSpotlightModal';
import { SocialFeedSection } from '../components/SocialFeedSection';
import { ProjectItem } from '../types';
import { CardSkeleton, ArticleSkeleton } from '../components/SkeletonLoader';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  DownloadCloud,
  FileText,
  ShieldCheck,
  Cpu,
  Zap,
  Bot,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    projects,
    apps,
    blogPosts,
    setCurrentPage,
    setSelectedArticleId,
    t,
  } = useApp();

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const featuredApps = apps.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);
  const [spotlightProject, setSpotlightProject] = useState<ProjectItem | null>(null);

  return (
    <div id="home-page-root" className="relative space-y-24">
      {/* ========================================== */}
      {/* 1. HERO SECTION WITH INTERACTIVE PARTICLES */}
      {/* ========================================== */}
      <section
        id="hero-section"
        className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 overflow-hidden"
      >
        <HeroBackground />

        <ScrollReveal direction="up" distance={30} duration={0.7} className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase glow-gold-subtle animate-in fade-in zoom-in-95 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('hero_badge', 'MISTERMOON DIGITAL ECOSYSTEM')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-brand text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.1] sm:leading-[1.1]">
            {t('hero_headline', 'BUILDING THE FUTURE, ONE IDEA AT A TIME.')}
          </h1>

          {/* Subtitle / Bio */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-sans">
            {t('hero_subtitle', 'Technology • Artificial Intelligence • Sovereign Digital Innovation')}
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-cta-projects"
              onClick={() => setCurrentPage('projects')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t('hero_explore_projects', 'Explore Projects')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-cta-studio"
              onClick={() => setCurrentPage('ai-studio')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-amber-400/30 hover:border-amber-400 font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{t('hero_open_studio', 'AI Studio')}</span>
            </button>

            <button
              id="hero-cta-downloader"
              onClick={() => setCurrentPage('downloader')}
              className="px-5 py-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs flex items-center gap-2 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <DownloadCloud className="w-4 h-4 text-cyan-400" />
              <span>{t('hero_downloader_pro', 'Video Downloader PRO')}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <span className="font-brand font-bold text-xl sm:text-2xl text-amber-400">100%</span>
              <span className="block text-[11px] text-slate-400 font-mono uppercase mt-0.5">
                {t('hero_sovereign_identity', 'Sovereign Web4')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <span className="font-brand font-bold text-xl sm:text-2xl text-cyan-400">&lt;100ms</span>
              <span className="block text-[11px] text-slate-400 font-mono uppercase mt-0.5">
                AI Inference Latency
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <span className="font-brand font-bold text-xl sm:text-2xl text-amber-400">8+</span>
              <span className="block text-[11px] text-slate-400 font-mono uppercase mt-0.5">
                {t('hero_production_apps', 'Production Apps')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <span className="font-brand font-bold text-xl sm:text-2xl text-emerald-400">Global</span>
              <span className="block text-[11px] text-slate-400 font-mono uppercase mt-0.5">
                {t('hero_global_reach', 'Global Reach')}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================== */}
      {/* 2. FEATURED PROJECTS SHOWCASE */}
      {/* ========================================== */}
      <section id="featured-projects-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={40} duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{t('featured_innovations', 'Featured Innovations')}</span>
              </div>
              <h2 className="font-brand font-bold text-2xl sm:text-3xl text-slate-100">
                {t('featured_craft', 'Pioneering Technological Craft')}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('projects')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{t('view_full_portfolio', 'View Full Portfolio')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.length === 0 ? (
              <CardSkeleton count={3} />
            ) : (
              featuredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSpotlightProject(project)}
                  className="group relative rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] cursor-pointer"
                >
                {/* Project Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 text-[10px] font-mono text-amber-300">
                    {project.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">
                    {project.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-brand font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSpotlightProject(project);
                      }}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('detailed_specs', 'Spotlight & Specs')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================== */}
      {/* 3. AI & SOVEREIGN ECOSYSTEM SPOTLIGHT */}
      {/* ========================================== */}
      <section id="ai-ecosystem-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={40} duration={0.65}>
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0B1220] via-[#080E18] to-[#111726] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{t('ai_ecosystem_title', 'Intelligent AI Architecture & Tools')}</span>
                </div>

                <h2 className="font-brand font-bold text-3xl sm:text-4xl text-slate-100">
                  Autonomous Reasoning & Generative Copilots
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t('ai_ecosystem_subtitle', 'Advancing autonomous reasoning, generative copilots, and resilient media engines.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Gemini 2.5 Flash Native Reasoning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Real-time Code & Stack Synthesis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Private SSRF Network Defenses</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Universal High-Speed Media Analysis</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCurrentPage('ai-studio')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>{t('open_ai_studio', 'Launch AI Studio')}</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('apps')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{t('explore_tools', 'Explore All Tools')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Architecture Showcase */}
              <div className="lg:col-span-5 rounded-2xl bg-black/60 border border-slate-800 p-5 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-500">
                  <span>MOON_CORE_KERNEL</span>
                  <span className="text-emerald-400">ONLINE</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="text-amber-400">$ sysctl --verify-security</div>
                  <div className="text-slate-400">&gt; SSRF Blacklist: Active (RFC-1918)</div>
                  <div className="text-slate-400">&gt; Media Router: Ephemeral Memory Buffer</div>
                  <div className="text-cyan-300">&gt; AI Engine: Gemini 2.5 Flash Connected</div>
                  <div className="text-emerald-400">&gt; Status: All Systems Operational</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================== */}
      {/* 4. ADVERTISEMENT CONTAINER */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={25} duration={0.5}>
          <AdContainer slot="home" format="horizontal" />
        </ScrollReveal>
      </section>

      {/* ========================================== */}
      {/* 5. APPS & TOOLS SHOWCASE */}
      {/* ========================================== */}
      <section id="apps-showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={40} duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t('apps_suite', 'Digital Software Suite')}</span>
              </div>
              <h2 className="font-brand font-bold text-2xl sm:text-3xl text-slate-100">
                {t('apps_heading', 'Engineered Applications & Tools')}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('apps')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{t('view_all_apps', 'Open App Catalog')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <img
                      src={app.logoUrl}
                      alt={app.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                    />
                    {app.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-brand font-bold text-base text-slate-100">{app.name}</h3>
                    <p className="text-xs text-cyan-400/90 font-mono mt-0.5">{app.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                    {app.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {app.platforms.map((p) => (
                      <span
                        key={p}
                        className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px] font-mono border border-slate-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (app.id === 'app-1') {
                        setCurrentPage('downloader');
                      } else {
                        setCurrentPage('apps');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================== */}
      {/* 5.5 RECENT SOCIAL MEDIA ACTIVITY (@MISTERMOON142) - WEB VIEW ONLY */}
      {/* ========================================== */}
      <ScrollReveal direction="up" distance={35} duration={0.6} className="hidden md:block">
        <SocialFeedSection />
      </ScrollReveal>

      {/* ========================================== */}
      {/* 6. LATEST ARTICLES & INSIGHTS */}
      {/* ========================================== */}
      <section id="latest-articles-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={40} duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{t('latest_insights', 'Publications & Insights')}</span>
              </div>
              <h2 className="font-brand font-bold text-2xl sm:text-3xl text-slate-100">
                {t('latest_heading', 'Essays on Web4, AI & Technology')}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('blog')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{t('read_all_articles', 'Read All Articles')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.length === 0 ? (
              <ArticleSkeleton count={3} />
            ) : (
              latestPosts.map((post) => (
                <div
                  key={post.id}
                onClick={() => {
                  setSelectedArticleId(post.slug);
                  setCurrentPage('blog');
                }}
                className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-brand font-bold text-base text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">{post.date}</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-semibold">
                    <span>{t('read_essay', 'Read Essay')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
          </div>
        </ScrollReveal>
      </section>

      {/* Full-Screen Glassmorphic Project Spotlight Modal */}
      <ProjectSpotlightModal
        project={spotlightProject}
        allProjects={featuredProjects}
        onClose={() => setSpotlightProject(null)}
        onSelectProject={(p) => setSpotlightProject(p)}
      />
    </div>
  );
};
