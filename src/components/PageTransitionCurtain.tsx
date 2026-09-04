import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionCurtainProps {
  pageKey: string;
}

export const PageTransitionCurtain: React.FC<PageTransitionCurtainProps> = ({ pageKey }) => {
  return (
    <>
      {/* Primary Obsidian Luxury Curtain with Gold Border */}
      <motion.div
        key={`curtain-primary-${pageKey}`}
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: [0, 1, 1, 0],
          originY: ['bottom', 'bottom', 'top', 'top'],
        }}
        transition={{
          duration: 0.62,
          times: [0, 0.42, 0.58, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[100] pointer-events-none bg-gradient-to-b from-[#080B14] via-[#0E1322] to-[#06080E] border-b-2 border-amber-400 shadow-[0_0_80px_rgba(212,175,55,0.45)] flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.95] }}
          transition={{ duration: 0.62, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3 select-none"
        >
          {/* Glowing Emblem */}
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md">
            <span className="font-brand font-black text-2xl tracking-tighter text-amber-400">MM</span>
          </div>

          {/* Progress Aware Gold Beam */}
          <div className="w-36 h-1 rounded-full bg-slate-900/90 overflow-hidden border border-amber-400/20">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.9)]"
            />
          </div>

          <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase font-bold">
            MISTERMOON.COM.NG
          </span>
        </motion.div>
      </motion.div>
    </>
  );
};
