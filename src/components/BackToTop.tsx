import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { synthEngine } from '../utils/audioSynth';

export const BackToTop: React.FC = () => {
  const { t } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Show button only after user scrolls past 500px
      setIsVisible(scrollY > 500);

      // Compute scroll percentage for the circular progress ring
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max((scrollY / scrollHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    try {
      synthEngine.playUiSound('click');
    } catch {
      // Audio synth optional
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="back-to-top-container"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed bottom-40 right-5 sm:right-7 z-40"
        >
          <button
            id="back-to-top-btn"
            type="button"
            onClick={scrollToTop}
            aria-label={t('back_to_top', 'Back to top')}
            title={t('back_to_top', 'Back to top')}
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0a0d14]/90 hover:bg-slate-900 border border-amber-400/40 hover:border-amber-400 text-amber-400 hover:text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_22px_rgba(245,158,11,0.4)] backdrop-blur-md transition-all active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {/* Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 44 44"
            >
              <circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-slate-800/80"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-amber-400 transition-all duration-100"
                strokeWidth="2.2"
                strokeDasharray={119.38} // 2 * pi * 19
                strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Up Arrow Icon with hover float */}
            <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />

            {/* Hover Tooltip on desktop */}
            <span className="sr-only sm:not-sr-only pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-slate-950/95 px-2.5 py-1 text-[10px] font-mono text-slate-200 border border-slate-800 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              {t('back_to_top', 'Back to top')}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
