import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ChevronUp, ChevronDown, Sparkles, ExternalLink } from 'lucide-react';

export const TopHeaderAdBanner: React.FC = () => {
  const { settings, t } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const adsense = settings.adsense;

  if (!adsense.enabled) return null;

  return (
    <div id="persistent-top-header-ad-root" className="w-full relative z-40 bg-[#050608] border-b border-amber-400/20">
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-cyan-500/10 border border-amber-400/30 backdrop-blur-md">
                {/* Left Badge & Sponsor Details */}
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="hidden sm:flex w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono uppercase font-bold tracking-widest border border-amber-400/40">
                        {t('advertisement', 'SPONSORED')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 font-semibold">
                        Google AdSense Premium Partner Slot
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans hidden md:inline">
                      Discover curated developer tools, cloud infrastructure & AI hardware sponsors.
                    </span>
                  </div>
                </div>

                {/* Right Actions & Push-Up Toggle */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 hidden lg:block">
                    Slot: 4869715072
                  </div>

                  <a
                    href="https://google.com/adsense"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-[11px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <span>Partner Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Push Up Button */}
                  <button
                    id="push-up-top-ad-btn"
                    onClick={() => setIsCollapsed(true)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    title="Push up sponsor banner"
                  >
                    <span>Push Up</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Mini Tab (Allows pulling back down) */}
      {isCollapsed && (
        <div className="flex justify-center py-0.5 bg-[#08090D]">
          <button
            id="expand-top-ad-btn"
            onClick={() => setIsCollapsed(false)}
            className="px-3 py-0.5 rounded-b-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border-x border-b border-amber-400/20 text-[9px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            title="Expand top sponsor banner"
          >
            <span>Show Sponsor Banner</span>
            <ChevronDown className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
};
