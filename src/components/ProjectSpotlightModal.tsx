import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem } from '../types';
import { synthEngine } from '../utils/audioSynth';
import { useToast } from './ToastNotification';
import { CommentsSection } from './CommentsSection';
import {
  X,
  ExternalLink,
  Github,
  Star,
  Share2,
  Copy,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  Zap,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Terminal,
  Globe,
  Radio,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';

interface ProjectSpotlightModalProps {
  project: ProjectItem | null;
  allProjects?: ProjectItem[];
  onClose: () => void;
  onSelectProject?: (project: ProjectItem) => void;
  isStarred?: boolean;
  onToggleStar?: (projectId: string) => void;
  starCount?: number;
}

export const ProjectSpotlightModal: React.FC<ProjectSpotlightModalProps> = ({
  project,
  allProjects = [],
  onClose,
  onSelectProject,
  isStarred = false,
  onToggleStar,
  starCount = 0,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'case-study' | 'architecture' | 'prototype' | 'metrics' | 'comments'>('case-study');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Close on Escape key, cycle with Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && allProjects.length > 0 && project && onSelectProject) {
        const currentIndex = allProjects.findIndex((p) => p.id === project.id);
        const nextIndex = (currentIndex + 1) % allProjects.length;
        onSelectProject(allProjects[nextIndex]);
        synthEngine.playUiSound('click');
      } else if (e.key === 'ArrowLeft' && allProjects.length > 0 && project && onSelectProject) {
        const currentIndex = allProjects.findIndex((p) => p.id === project.id);
        const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
        onSelectProject(allProjects[prevIndex]);
        synthEngine.playUiSound('click');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, allProjects, project, onSelectProject]);

  if (!project) return null;

  // Gallery images with high-res fallbacks
  const galleryImages = [
    project.imageUrl,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleCopyProjectLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#projects?id=${project.slug || project.id}`;
    try {
      await navigator.clipboard.writeText(url);
      synthEngine.playUiSound('copy');
      showToast({
        title: 'Project Link Copied! 🔗',
        message: `Direct link for "${project.title}" copied to clipboard.`,
        type: 'link',
      });
    } catch {
      showToast({
        title: 'Copy Failed',
        message: 'Could not access clipboard.',
        type: 'error',
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#projects?id=${project.slug || project.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project.title} | MisterMoon Spotlight`,
          text: project.description,
          url: project.linkUrl || shareUrl,
        });
        synthEngine.playUiSound('success');
      } catch {
        // user cancelled
      }
    } else {
      handleCopyProjectLink();
    }
  };

  return (
    <AnimatePresence>
      <div
        id="project-spotlight-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-b from-[#0F1420] via-[#0B0E17] to-[#07090E] border border-amber-400/40 p-4 sm:p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] flex flex-col space-y-6 text-slate-100 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PROJECT SPOTLIGHT</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                {project.status || 'Live Production'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {allProjects.length > 1 && onSelectProject && (
                <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                  <button
                    onClick={() => {
                      const idx = allProjects.findIndex((p) => p.id === project.id);
                      const prev = (idx - 1 + allProjects.length) % allProjects.length;
                      onSelectProject(allProjects[prev]);
                      synthEngine.playUiSound('click');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                    title="Previous Project (Left Arrow)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 px-1">
                    {allProjects.findIndex((p) => p.id === project.id) + 1} / {allProjects.length}
                  </span>
                  <button
                    onClick={() => {
                      const idx = allProjects.findIndex((p) => p.id === project.id);
                      const next = (idx + 1) % allProjects.length;
                      onSelectProject(allProjects[next]);
                      synthEngine.playUiSound('click');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                    title="Next Project (Right Arrow)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                id="close-spotlight-modal-btn"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Close project spotlight modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project Title & Category Banner */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-brand text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                {project.title}
              </h2>
              <div className="flex items-center gap-2">
                {onToggleStar && (
                  <button
                    onClick={() => onToggleStar(project.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      isStarred
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-amber-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                    <span>{isStarred ? 'Starred ★' : 'Star'}</span>
                    {starCount > 0 && <span className="text-[10px] opacity-80">({starCount})</span>}
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Share Project"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyProjectLink}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Copy Direct Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* High-Resolution Media Showcase & Gallery Tabs */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            <div className="relative h-64 sm:h-96 w-full overflow-hidden">
              <img
                src={galleryImages[activeImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent opacity-80" />

              {/* Bottom Image Info Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/30 text-[11px] font-mono text-amber-300">
                  {project.category} • HD Architecture Render
                </span>

                {/* Gallery Selectors */}
                <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-slate-800">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`View media ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight Navigation Tabs (Case Study, Architecture, Prototype, Metrics) */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('case-study')}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'case-study'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deep-Dive Case Study</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('prototype')}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'prototype'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Prototype</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Telemetry & Benchmarks</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion & Feedback</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="space-y-6">
            {activeTab === 'case-study' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Executive Summary */}
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Summary & Design Vision</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Key Capabilities Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    Core Functional Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-950 border border-slate-800/80 text-xs text-slate-200 font-sans flex items-start gap-2.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-200 block">{feat}</span>
                          <span className="text-[11px] text-slate-400">
                            Production-verified workflow with zero-latency execution.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase">
                      End-to-End Execution Pipeline
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Tier 1 Cloud Architecture</span>
                  </div>

                  {/* Visual Diagram Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono text-xs font-bold">
                        01
                      </div>
                      <h5 className="font-semibold text-xs text-slate-200">Client Ingestion</h5>
                      <p className="text-[11px] text-slate-400">
                        Browser-level state orchestration, reactive inputs, and WebCrypto handshake.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-mono text-xs font-bold">
                        02
                      </div>
                      <h5 className="font-semibold text-xs text-slate-200">Neural Inference Engine</h5>
                      <p className="text-[11px] text-slate-400">
                        Server-side proxy routes dispatch prompt context directly to Gemini 3.7 Flash.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-mono text-xs font-bold">
                        03
                      </div>
                      <h5 className="font-semibold text-xs text-slate-200">Live Synthesis & Output</h5>
                      <p className="text-[11px] text-slate-400">
                        Sub-second rendering of harmonic audio, interactive data structures, or signed assets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prototype' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A0D14] border border-amber-400/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono text-slate-200 font-semibold">
                        Live Sandbox & Prototype Sandbox
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      Sandbox Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Launch the live interactive environment or inspect source code in repository.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={project.linkUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Launch Interactive Prototype</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700 transition-colors"
                      >
                        <Github className="w-4 h-4 text-slate-400" />
                        <span>Inspect GitHub Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Inference Latency</span>
                  <div className="text-xl font-bold font-mono text-amber-400">380ms</div>
                  <span className="text-[10px] text-emerald-400">P95 Global SLA</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Uptime Reliability</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">99.98%</div>
                  <span className="text-[10px] text-slate-500">Autonomous edge routing</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Security Rating</span>
                  <div className="text-xl font-bold font-mono text-cyan-400">A+ Zero-Trust</div>
                  <span className="text-[10px] text-slate-500">SSRF & CSP Hardened</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Architecture</span>
                  <div className="text-xl font-bold font-mono text-purple-400">Full-Stack</div>
                  <span className="text-[10px] text-slate-500">TypeScript & Vite</span>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="animate-in fade-in duration-300">
                <CommentsSection
                  targetId={project.id}
                  targetType="project"
                  targetTitle={project.title}
                />
              </div>
            )}
          </div>

          {/* Technologies Badges */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Engineered Technologies & Frameworks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-slate-900/90 text-slate-200 text-xs font-mono border border-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer border border-slate-800"
            >
              Close Spotlight
            </button>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors border border-slate-800"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}

              <a
                href={project.linkUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
