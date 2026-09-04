import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cookie, Shield, Check, X, Settings2 } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const { cookiePrefs, saveCookiePrefs, setCurrentPage, t } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(cookiePrefs.analytics);
  const [adsConsent, setAdsConsent] = useState(cookiePrefs.advertising);

  if (cookiePrefs.decided) return null;

  const handleAcceptAll = () => {
    saveCookiePrefs({ essential: true, analytics: true, advertising: true });
  };

  const handleRejectNonEssential = () => {
    saveCookiePrefs({ essential: true, analytics: false, advertising: false });
  };

  const handleSaveCustom = () => {
    saveCookiePrefs({ essential: true, analytics: analyticsConsent, advertising: adsConsent });
  };

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0F17]/95 backdrop-blur-2xl border border-amber-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.15)] text-slate-300">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Privacy & Cookie Preferences</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              MISTERMOON.COM uses essential and performance cookies to maintain audio synthesis, security tokens, and responsive experiences.
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <div>
                <span className="font-semibold text-slate-200 block">Strictly Necessary</span>
                <span className="text-[10px] text-slate-400">Essential navigation, security & audio buffer state</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Required
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <div>
                <span className="font-semibold text-slate-200 block">Analytics & Performance</span>
                <span className="text-[10px] text-slate-400">Zero PII aggregate system telemetry</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <div>
                <span className="font-semibold text-slate-200 block">Advertising & AdSense</span>
                <span className="text-[10px] text-slate-400">Non-intrusive sponsor content delivery</span>
              </div>
              <input
                type="checkbox"
                checked={adsConsent}
                onChange={(e) => setAdsConsent(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </div>

            <div className="pt-1 text-[11px] text-slate-400">
              Read our{' '}
              <button
                onClick={() => setCurrentPage('legal-privacy')}
                className="text-amber-400 hover:underline"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                onClick={() => setCurrentPage('legal-cookies')}
                className="text-amber-400 hover:underline"
              >
                Cookie Policy
              </button>.
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!showDetails ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs hover:opacity-95 shadow-md flex-1 text-center"
              >
                {t('cookie_accept_all', 'Accept All')}
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs flex-1 text-center"
              >
                {t('cookie_reject_all', 'Reject Non-Essential')}
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800"
                title="Customize Preferences"
                aria-label="Customize Cookie Preferences"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveCustom}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex-1 text-center"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
