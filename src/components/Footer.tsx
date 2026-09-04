import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import { NewsletterSignup } from './NewsletterSignup';
import {
  Twitter,
  Github,
  Music2,
  Youtube,
  Linkedin,
  Instagram,
  Shield,
  FileText,
  Cookie,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, t, saveCookiePrefs } = useApp();

  const handleNav = (page: PageTab) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="relative mt-20 border-t border-amber-400/20 bg-[#06070A] text-slate-400 text-sm overflow-hidden z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        {/* Glassmorphism Newsletter Subscription Component */}
        <NewsletterSignup />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 glow-gold-subtle flex items-center justify-center">
                <div className="w-full h-full bg-[#08090D] rounded-[10px] flex items-center justify-center">
                  <span className="font-brand text-lg font-black gold-gradient-text">M</span>
                </div>
              </div>
              <span className="font-brand font-black text-xl tracking-wider text-slate-100 dark:text-slate-100">
                MISTER<span className="gold-gradient-text">MOON</span>
                <span className="text-xs ml-1 text-amber-400 font-mono font-bold">.COM.NG</span>
              </span>
            </div>

            <p className="font-mono text-xs text-amber-400/90 tracking-widest uppercase">
              INNOVATE • INSPIRE • EMPOWER
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The official personal brand and futuristic digital ecosystem of MisterMoon. Advancing artificial intelligence, generative copilots, resilient web applications, and Web4 digital identity.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://x.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-400/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-800"
                aria-label="X (Twitter) @MISTERMOON142"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-400/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-800"
                aria-label="GitHub @MISTERMOON142"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-400/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-800"
                aria-label="YouTube @MISTERMOON142"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-400/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-800"
                aria-label="LinkedIn @MISTERMOON142"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-400/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-800"
                aria-label="Instagram @MISTERMOON142"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-tech font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4 text-amber-400">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-300 transition-colors">
                  {t('nav_home')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-300 transition-colors">
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('projects')} className="hover:text-amber-300 transition-colors">
                  {t('nav_projects')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('apps')} className="hover:text-amber-300 transition-colors">
                  {t('nav_apps')}
                </button>
              </li>
            </ul>
          </div>

          {/* Media & Tools */}
          <div>
            <h4 className="font-tech font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4 text-amber-400">
              AI Tools & Media
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('ai-studio')} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>AI Studio</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('downloader')} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>{t('nav_downloader')}</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">PRO</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-amber-300 transition-colors">
                  {t('nav_blog')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-amber-300 transition-colors">
                  {t('nav_contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="font-tech font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4 text-amber-400">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('legal-privacy')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-amber-400/80" />
                  <span>{t('privacy_policy')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-terms')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-amber-400/80" />
                  <span>{t('terms_of_service')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legal-cookies')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Cookie className="w-3 h-3 text-amber-400/80" />
                  <span>{t('cookie_policy')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => saveCookiePrefs({ decided: false })}
                  className="text-slate-500 hover:text-amber-400 transition-colors font-mono text-[11px]"
                >
                  Manage Cookie Consent
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 font-mono text-[11px]">
            © {new Date().getFullYear()} <span className="text-slate-200 font-semibold">MISTERMOON.COM.NG</span>. {t('all_rights_reserved')}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Production Web4 Platform</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 transition-colors border border-slate-800 flex items-center gap-1 text-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
