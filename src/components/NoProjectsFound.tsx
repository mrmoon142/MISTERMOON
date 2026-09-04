import React from 'react';
import { Sparkles, RefreshCw, FolderX, Search, Layers } from 'lucide-react';

interface NoProjectsFoundProps {
  category: string;
  searchQuery: string;
  onReset: () => void;
}

export const NoProjectsFound: React.FC<NoProjectsFoundProps> = ({
  category,
  searchQuery,
  onReset,
}) => {
  return (
    <div
      id="no-projects-found-state"
      className="w-full py-16 px-6 rounded-3xl bg-gradient-to-b from-[#0F131D]/80 to-[#07090F]/90 border border-amber-400/20 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.06)] flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn"
    >
      {/* Subtle Gold Geometric Orbital Graphic */}
      <div className="relative flex items-center justify-center">
        {/* Ambient golden halo pulse */}
        <div className="absolute w-28 h-28 rounded-full bg-amber-400/10 blur-2xl -z-10" />

        {/* Geometric rings SVG */}
        <svg
          className="w-24 h-24 text-amber-400/40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer dashed orbital */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="animate-[spin_40s_linear_infinite]"
          />
          {/* Middle accent ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="rgba(212, 175, 55, 0.6)"
            strokeWidth="1.5"
          />
          {/* Inner orbit */}
          <circle
            cx="50"
            cy="50"
            r="22"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          {/* Hexagonal coordinates */}
          <polygon
            points="50,26 70,38 70,62 50,74 30,62 30,38"
            stroke="rgba(212, 175, 55, 0.4)"
            strokeWidth="1"
          />
          {/* Star nodes */}
          <circle cx="50" cy="26" r="2.5" fill="#FBBF24" />
          <circle cx="70" cy="62" r="2" fill="#F59E0B" />
          <circle cx="30" cy="62" r="2" fill="#FBBF24" />
        </svg>

        {/* Center Icon */}
        <div className="absolute w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <FolderX className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Zero Artifact Matches</span>
        </div>

        <h3 className="font-brand font-bold text-xl sm:text-2xl text-slate-100">
          No Projects Found in Filter
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
          {searchQuery ? (
            <span>
              No artifacts matched your search query{' '}
              <span className="text-amber-300 font-mono">"{searchQuery}"</span>{' '}
              {category !== 'All' ? (
                <>
                  within category{' '}
                  <span className="text-amber-300 font-mono">{category}</span>
                </>
              ) : (
                ''
              )}
              .
            </span>
          ) : (
            <span>
              There are currently no projects categorized under{' '}
              <span className="text-amber-300 font-mono">"{category}"</span>.
            </span>
          )}
        </p>
      </div>

      {/* Suggested Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onReset}
          id="reset-projects-filter-btn"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters & Search</span>
        </button>
      </div>
    </div>
  );
};
