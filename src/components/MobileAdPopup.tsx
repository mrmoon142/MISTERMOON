import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, ExternalLink, ArrowRight, Clock, Coffee } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of inactivity

export const MobileAdPopup: React.FC = () => {
  const { settings, subscription, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const adsense = settings.adsense;

  const startInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Only arm timer if ads are enabled and user is not Pro
    if (!adsense.enabled || subscription.isPro) return;

    timerRef.current = setTimeout(() => {
      // User has been completely inactive for 5 full minutes
      setIsOpen(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [adsense.enabled, subscription.isPro]);

  useEffect(() => {
    if (!adsense.enabled || subscription.isPro) return;

    // Reset inactivity timer whenever any user activity happens
    const handleUserActivity = () => {
      // If modal is not already open, reset the 5m countdown
      if (!isOpen) {
        startInactivityTimer();
      }
    };

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
      'wheel',
      'click',
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Start initial 5-minute timer
    startInactivityTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [adsense.enabled, subscription.isPro, isOpen, startInactivityTimer]);

  const handleClose = () => {
    setIsOpen(false);
    // Restart another 5 minutes of inactivity before showing again
    startInactivityTimer();
  };

  if (!adsense.enabled || subscription.isPro) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="inactivity-ad-popup-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#101420] via-[#0C0F17] to-[#07080C] border border-amber-400/40 p-5 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col space-y-4 text-slate-100 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Close Button */}
            <div className="flex items-center justify-between relative z-10 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono uppercase font-bold tracking-widest">
                  {t('advertisement', 'SPONSOR NOTICE')}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>{t('idle_notice', '5m Idle Pause')}</span>
                </span>
              </div>

              <button
                id="close-inactivity-ad-btn"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close sponsor advertisement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ad Content Unit */}
            <div className="space-y-3 relative z-10">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Sparkles className="w-3 h-3" />
                    <span>AdSense Partner Slot</span>
                  </span>
                  <span>Slot: {adsense.homeSlot || '4869715072'}</span>
                </div>

                <h3 className="font-brand font-bold text-base text-slate-100 leading-snug">
                  {t('ad_popup_title', 'Explore High-Performance AI & Cloud Systems')}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {t(
                    'ad_popup_desc',
                    'Notice shown only when inactive for 5+ minutes. Support MisterMoon’s free open-source software and solopreneur platforms.'
                  )}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500">Google Verified Partner</span>
                  <a
                    href="https://google.com/adsense"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>{t('visit_sponsor', 'Visit Sponsor')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-1 flex flex-col gap-2 relative z-10">
              <button
                id="continue-to-site-btn"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>{t('resume_session', 'Resume MisterMoon Session')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                className="w-full py-1 text-center text-[11px] font-mono text-slate-500 hover:text-slate-400 transition-colors cursor-pointer"
              >
                {t('dismiss', 'Dismiss')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
