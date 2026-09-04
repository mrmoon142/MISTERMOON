import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface AdContainerProps {
  slot: 'home' | 'download' | 'blog' | 'project' | 'about' | 'apps' | 'contact' | 'legal';
  format?: 'horizontal' | 'banner' | 'card' | 'sidebar';
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ slot, format = 'horizontal', className = '' }) => {
  const { settings, t } = useApp();
  const adsense = settings.adsense;

  const clientId = 'ca-pub-7366782846848820';
  const slotId = '4869715072';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // safe fallback
    }
  }, [slot]);

  if (!adsense.enabled) return null;

  return (
    <div
      id={`ad-zone-${slot}`}
      className={`my-8 w-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-dashed border-amber-400/25 bg-black/40 backdrop-blur-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between w-full max-w-4xl px-2 mb-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
          {t('advertisement', 'ADVERTISEMENT')}
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          AdSense Unit • Slot {slotId}
        </span>
      </div>

      {/* AdSense Responsive Unit Container */}
      <div
        className={`w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#0C101B]/90 via-[#101626]/80 to-[#0C101B]/90 border border-slate-800 text-center sm:text-left min-h-[95px] ${
          format === 'banner' ? 'min-h-[120px]' : ''
        }`}
      >
        <div className="flex flex-col mb-2 sm:mb-0">
          <span className="text-xs font-semibold text-slate-200">Google AdSense Verified Sponsor Network</span>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
            Client: {clientId} • Slot ID: {slotId}
          </span>
          <span className="text-[10px] text-amber-300/80 mt-1">
            Compliant developer & tech sponsor media placement.
          </span>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30">
          Sponsor Unit
        </div>
      </div>
    </div>
  );
};
