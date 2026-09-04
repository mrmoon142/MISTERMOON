import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';
import { AdContainer } from '../components/AdContainer';
import { CommentsSection } from '../components/CommentsSection';
import {
  Smartphone,
  Star,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  DownloadCloud,
  MessageSquare,
  X,
} from 'lucide-react';

export const AppsPage: React.FC = () => {
  const { apps, setCurrentPage, getCommentsForTarget, t } = useApp();
  const [selectedAppForComments, setSelectedAppForComments] = useState<AppItem | null>(null);

  const handleLaunchApp = (app: AppItem) => {
    if (app.id === 'app-1') {
      setCurrentPage('downloader');
    } else if (app.id === 'app-2') {
      setCurrentPage('ai-studio');
    } else {
      setSelectedAppForComments(app);
    }
  };

  return (
    <div id="apps-page-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('apps_badge', 'SOFTWARE SUITE & ECOSYSTEM')}</span>
        </div>

        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Production <span className="gold-gradient-text">Applications</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          Engineered for creative professionals, producers, and sovereign digital citizens across Web, Android, and iOS.
        </p>
      </div>

      {/* Featured Flagship App Hero: MoonDownloader Pro */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1524] via-[#080E1A] to-[#0E121B] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
              FLAGSHIP TOOL
            </span>
            <span className="text-xs text-slate-400 font-mono">v2.4.0 Live</span>
          </div>

          <h2 className="font-brand font-bold text-2xl sm:text-4xl text-slate-100">
            MoonDownloader PRO
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            A secure, high-throughput media analysis and permissible video downloader engine. Built with robust SSRF defenses, zero client-side bottlenecks, and multi-format conversion (1080p, 720p, MP3 Audio).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Anti-SSRF Private Network Shield</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Instant Resolution Analyzer</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero-Storage Ephemeral Buffer</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>100% Policy Compliant</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('downloader')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Launch Video Downloader Web App</span>
            </button>

            <button
              onClick={() => setSelectedAppForComments(apps[0])}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>App Reviews & Comments ({getCommentsForTarget('app-1').length})</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl p-1 bg-gradient-to-tr from-cyan-500 to-blue-600">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
              alt="MoonDownloader Interface"
              className="w-full h-64 sm:h-72 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-slate-100 space-y-1">
                <span className="text-[10px] font-mono text-cyan-300 uppercase">Interactive Terminal</span>
                <p className="text-xs font-semibold">Real-Time Media Stream Router</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => {
          const appCommentsCount = getCommentsForTarget(app.id).length;
          return (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-6 hover:shadow-[0_15px_35px_rgba(6,182,212,0.1)]"
            >
              <div className="space-y-4">
                {/* App Icon & Badge */}
                <div className="flex items-center justify-between">
                  <img
                    src={app.logoUrl}
                    alt={app.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-cyan-500/30 shadow-md"
                  />
                  <div className="flex flex-col items-end gap-1">
                    {app.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                        {app.badge}
                      </span>
                    )}
                    {app.rating && (
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{app.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-brand font-bold text-lg text-slate-100">{app.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{app.tagline}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">{app.description}</p>

                {/* Feature Checklist */}
                <div className="space-y-1.5 pt-1">
                  {app.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms, Comments & Launch Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {app.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>

                  {/* Comment trigger */}
                  <button
                    onClick={() => setSelectedAppForComments(app)}
                    className="text-[11px] font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comments ({appCommentsCount})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchApp(app)}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{app.id === 'app-1' ? 'Launch Tool' : app.id === 'app-2' ? 'Open Studio' : 'App Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedAppForComments(app)}
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Leave a comment or review"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* App Comments & Feedback Modal */}
      {selectedAppForComments && (
        <div
          id="app-comments-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedAppForComments(null)}
        >
          <div
            id="app-comments-modal-container"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B0E17] border border-amber-400/30 p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAppForComments.logoUrl}
                  alt={selectedAppForComments.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400/30"
                />
                <div>
                  <h3 className="font-brand font-bold text-xl text-slate-100">
                    {selectedAppForComments.name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    {selectedAppForComments.tagline}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppForComments(null)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments Component for this specific app */}
            <CommentsSection
              targetId={selectedAppForComments.id}
              targetType="app"
              targetTitle={selectedAppForComments.name}
            />
          </div>
        </div>
      )}

      {/* AdSense Unit */}
      <AdContainer slot="apps" format="horizontal" />
    </div>
  );
};
