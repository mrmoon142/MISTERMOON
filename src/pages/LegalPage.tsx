import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import { AdContainer } from '../components/AdContainer';
import {
  Shield,
  FileText,
  Cookie,
  CheckCircle2,
  Lock,
  Eye,
  Search,
  Scale,
  ExternalLink,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'cookies';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const { currentPage, setCurrentPage, t } = useApp();

  const getActiveFromCurrent = () => {
    if (currentPage === 'legal-terms') return 'terms';
    if (currentPage === 'legal-cookies') return 'cookies';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(getActiveFromCurrent());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentPage === 'legal-terms') setActiveTab('terms');
    else if (currentPage === 'legal-cookies') setActiveTab('cookies');
    else if (currentPage === 'legal-privacy') setActiveTab('privacy');
  }, [currentPage]);

  const handleTabChange = (tab: 'privacy' | 'terms' | 'cookies') => {
    setActiveTab(tab);
    if (tab === 'privacy') setCurrentPage('legal-privacy');
    if (tab === 'terms') setCurrentPage('legal-terms');
    if (tab === 'cookies') setCurrentPage('legal-cookies');
  };

  return (
    <div id="legal-page-root" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono uppercase border border-slate-700">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Governance, Privacy & AdSense Compliance</span>
        </div>

        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Terms, Privacy & <span className="gold-gradient-text">Policies</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Effective Date: February 2026 • Official Operating Standard for MISTERMOON.COM.NG
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-[#0C0F17] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            id="tab-privacy-policy"
            onClick={() => handleTabChange('privacy')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            id="tab-terms-conditions"
            onClick={() => handleTabChange('terms')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            id="tab-cookie-policy"
            onClick={() => handleTabChange('cookies')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'cookies'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* Quick Search within Legal Document */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            id="legal-search-filter"
            placeholder="Search clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Policy Content Card */}
      <div className="rounded-3xl bg-[#0C0F17] border border-slate-800 p-6 sm:p-10 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* ========================================== */}
        {/* PRIVACY POLICY */}
        {/* ========================================== */}
        {activeTab === 'privacy' && (
          <div className="space-y-8">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Lock className="w-4 h-4" />
                <span>GLOBAL DATA PRIVACY DISCLOSURE</span>
              </div>
              <h2 className="font-brand font-bold text-2xl text-slate-100">
                Privacy Policy & Data Sovereign Governance
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                MISTERMOON.COM.NG operates with an absolute commitment to user privacy, data minimization, and transparent ad-supported service practices. We do not sell or monetize your personally identifiable information.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">1.</span> Information We Collect & Process
              </h3>
              <p className="text-slate-300">
                We collect information only when strictly necessary to provide interactive software tools, secure communications, and high-performance WebAudio experiences:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li>
                  <strong className="text-slate-200">Voluntary Inquiries:</strong> Contact information (name, email address, and message content) submitted through the Transceiver form. This is used solely to respond to your strategic, technical, or licensing inquiries.
                </li>
                <li>
                  <strong className="text-slate-200">Client-Side Local Storage:</strong> User interface preferences, selected language, local video downloader session logs, audio playback volume, and synthesizer filters. These values reside 100% inside your local device browser and are never transmitted to external databases.
                </li>
                <li>
                  <strong className="text-slate-200">Ephemeral Technical Telemetry:</strong> Anonymized server-side rate limiting hashes and IP-based timestamp counters stored in ephemeral memory buffers to safeguard API endpoints against denial-of-service and SSRF abuse.
                </li>
              </ul>
            </div>

            {/* Section 2 - AdSense & Advertising */}
            <div className="space-y-3 p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-amber-400/20">
              <h3 className="font-semibold text-base text-amber-300 flex items-center gap-2">
                <span className="text-amber-400 font-mono">2.</span> Google AdSense & Third-Party Advertising Disclosures
              </h3>
              <p className="text-slate-300">
                MISTERMOON.COM.NG may serve advertising units powered by Google AdSense and accredited advertising networks to sponsor free software utilities:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li>
                  Third-party vendors, including Google, use cookies (such as the DoubleClick cookie) to serve ads based on prior visits to our website or other internet sites.
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </li>
                <li>
                  <strong>Opt-Out of Personalized Advertising:</strong> You may opt out of personalized advertising at any time by visiting Google Ad Settings at{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-mono inline-flex items-center gap-1"
                  >
                    adssettings.google.com <ExternalLink className="w-3 h-3" />
                  </a>
                  , or opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-mono inline-flex items-center gap-1"
                  >
                    aboutads.info <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </li>
              </ul>
            </div>

            {/* Section 3 - Video Processing & Zero Storage */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">3.</span> MoonDownloader Media Processing Privacy
              </h3>
              <p className="text-slate-300">
                When using the MoonDownloader Pro utility, video URLs provided for analysis are checked against real-time SSRF firewalls and resolved in memory. We do not maintain server-side copies of downloaded media, nor do we track user viewing logs. Processing streams are piped ephemerally directly to the client browser.
              </p>
            </div>

            {/* Section 4 - GDPR / CCPA */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">4.</span> Your Legal Rights (GDPR, CCPA & UK DPA)
              </h3>
              <p className="text-slate-300">
                Regardless of your geographic jurisdiction, you have the right to request confirmation of whether we hold any personal correspondence, request a copy, or instruct permanent erasure. To exercise your rights, transmit a message to{' '}
                <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">contact@mistermoon.com.ng</code>.
              </p>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TERMS AND CONDITIONS */}
        {/* ========================================== */}
        {activeTab === 'terms' && (
          <div className="space-y-8">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Scale className="w-4 h-4" />
                <span>LEGAL AGREEMENT & ACCEPTABLE USE</span>
              </div>
              <h2 className="font-brand font-bold text-2xl text-slate-100">
                Terms and Conditions of Service
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                These Terms and Conditions govern your access to and usage of MISTERMOON.COM.NG, its Web4 cryptographic credentials, AI applications, and software utilities.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">1.</span> Acceptance of Terms
              </h3>
              <p className="text-slate-300">
                By entering or utilizing MISTERMOON.COM.NG, you agree to be bound by these terms. If you disagree with any portion of these provisions, you must cease using the platform immediately.
              </p>
            </div>

            {/* Section 2 - Media Processing Tool Usage */}
            <div className="space-y-3 p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
              <h3 className="font-semibold text-base text-cyan-300 flex items-center gap-2">
                <span className="text-cyan-400 font-mono">2.</span> MoonDownloader Pro & Permissible Media Processing
              </h3>
              <p className="text-slate-300">
                The MoonDownloader Pro tool is designed strictly for processing creator-owned videos, Creative Commons assets, and permissible public domain media archives:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li>
                  <strong className="text-slate-200">No DRM Circumvention:</strong> You may not use our services to bypass digital rights management, copy protections, or access controls.
                </li>
                <li>
                  <strong className="text-slate-200">Copyright Compliance:</strong> You warrant that you hold legitimate licenses or ownership for any media stream you request to analyze or transcode.
                </li>
                <li>
                  <strong className="text-slate-200">Prohibited Content:</strong> Utilizing the tool to process unlawful, defamatory, or infringing content is strictly prohibited and subject to immediate IP blacklisting.
                </li>
              </ul>
            </div>

            {/* Section 3 - Intellectual Property */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">3.</span> Intellectual Property & Software Rights
              </h3>
              <p className="text-slate-300">
                All algorithmic models, application architecture, brand typography, research essays, and source code on MISTERMOON.COM.NG are the exclusive intellectual property of MisterMoon. Commercial reproduction, public broadcast, or unauthorized redistribution without written consent is prohibited.
              </p>
            </div>

            {/* Section 4 - Disclaimers */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono">4.</span> Disclaimer of Warranties & Limitation of Liability
              </h3>
              <p className="text-slate-300">
                All services, code libraries, and audio streams are provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis without warranties of any kind. MISTERMOON.COM.NG disclaims all implied warranties, including merchantability and fitness for a particular purpose. In no event shall MisterMoon be liable for any direct or consequential damages resulting from tool usage.
              </p>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* COOKIE POLICY */}
        {/* ========================================== */}
        {activeTab === 'cookies' && (
          <div className="space-y-8">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Cookie className="w-4 h-4" />
                <span>COOKIE DECLARATION & LOCAL STORAGE</span>
              </div>
              <h2 className="font-brand font-bold text-2xl text-slate-100">
                Cookie Policy & Consent Controls
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Understand how cookies, web storage, and advertising tags operate across MISTERMOON.COM.NG.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base text-slate-100">Storage Categories</h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-100 text-xs sm:text-sm">1. Strictly Necessary Storage</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Essential
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Required to maintain language selections, local theme preferences, and security tokens. Cannot be disabled.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-100 text-xs sm:text-sm">2. Google AdSense / Sponsor Cookies</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Advertising
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Placed by advertising partners to deliver compliant, relevant, and non-intrusive sponsor units.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-100 text-xs sm:text-sm">3. WebAudio Synthesis Cache</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Performance
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Caches synthesizer waveforms and filter positions in local device memory for ultra-low audio latency.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Manage or Revoke Cookie Preferences</span>
              <button
                onClick={() => {
                  const banner = document.getElementById('cookie-consent-banner');
                  if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                  alert('Cookie consent preferences are synchronized across your local browser storage.');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono hover:bg-amber-400/30 cursor-pointer"
              >
                Reset Preferences
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded AdSense Unit for Compliance */}
      <AdContainer slot="legal" format="horizontal" />
    </div>
  );
};

