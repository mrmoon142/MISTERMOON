import React from 'react';
import { useApp } from '../context/AppContext';
import { AdContainer } from '../components/AdContainer';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div
      id="not-found-page-root"
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6 max-w-4xl mx-auto"
    >
      <div className="relative w-24 h-24 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 glow-gold-subtle">
        <Compass className="w-12 h-12 animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          STATUS CODE 404 • SIGNAL LOST
        </span>
        <h1 className="font-brand text-4xl sm:text-6xl font-extrabold text-slate-100">
          Coordinates Not Found in <span className="gold-gradient-text">Orbit</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The trajectory you requested does not exist or has been relocated to another sector of the MisterMoon ecosystem.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => setCurrentPage('home')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Command Center</span>
        </button>
      </div>

      <AdContainer slot="home" format="horizontal" className="mt-8" />
    </div>
  );
};
