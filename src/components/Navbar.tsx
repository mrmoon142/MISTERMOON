import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import {
  Moon,
  Sun,
  Search,
  Menu,
  X,
  Sparkles,
  DownloadCloud,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    t,
    theme,
    setTheme,
    setIsSearchOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; labelKey: string; icon?: React.ReactNode }[] = [
    { id: 'home', labelKey: 'nav_home' },
    { id: 'about', labelKey: 'nav_about' },
    { id: 'projects', labelKey: 'nav_projects' },
    { id: 'apps', labelKey: 'nav_apps' },
    { id: 'ai-studio', labelKey: 'nav_ai_studio' },
    { id: 'downloader', labelKey: 'nav_downloader' },
    { id: 'blog', labelKey: 'nav_blog' },
    { id: 'contact', labelKey: 'nav_contact' },
  ];

  const handleNav = (tab: PageTab) => {
    setCurrentPage(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation"
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08090D]/85 dark:bg-[#08090D]/85 light:bg-white/90 border-b border-amber-400/15 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          aria-label="MISTERMOON.COM.NG Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 glow-gold-subtle transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#08090D] rounded-[10px] flex items-center justify-center overflow-hidden">
              <span className="font-brand text-xl font-black gold-gradient-text tracking-tighter">M</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-brand font-black text-lg sm:text-xl tracking-wider text-slate-100 dark:text-slate-100 group-hover:text-amber-300 transition-colors">
              MISTER<span className="gold-gradient-text">MOON</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/35 font-mono font-bold tracking-tight">
                .COM.NG
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono hidden sm:inline">
              TECH • AI • INNOVATION
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all cursor-pointer relative ${
                  active
                    ? 'text-amber-300 bg-amber-400/10 border border-amber-400/25 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t(item.labelKey)}
                {item.id === 'downloader' && (
                  <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">
                    PRO
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            id="nav-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
            aria-label="Search"
            title="Global Search (Cmd + K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px] font-mono text-slate-400">Search</span>
          </button>

          {/* Simple Language Toggle (English / French) */}
          <div
            id="nav-language-toggle"
            className="flex items-center p-0.5 rounded-lg bg-slate-900/70 border border-slate-700/60 font-mono text-xs shadow-inner"
            role="group"
            aria-label="Language selector: English or French"
          >
            <button
              id="nav-lang-en-btn"
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={language === 'en'}
              title="Switch to English"
            >
              EN
            </button>
            <button
              id="nav-lang-fr-btn"
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={language === 'fr'}
              title="Passer en Français"
            >
              FR
            </button>
          </div>

          {/* Theme Mode Switch */}
          <button
            id="nav-theme-toggle"
            type="button"
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
            }}
            className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900/80 hover:bg-slate-800 border-amber-400/40 text-amber-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
            }`}
            aria-label={`Current mode is ${theme}. Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Toggle global theme (${theme === 'dark' ? 'Light Mode' : 'Dark Mode'})`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-amber-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-amber-400/15 bg-[#08090D]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    active
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 font-semibold'
                      : 'text-slate-300 bg-slate-900/40 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{t(item.labelKey)}</span>
                  {item.id === 'downloader' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                      PRO
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Language:</span>
              <div
                className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs"
                role="group"
                aria-label="Mobile language selector"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    language === 'fr'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  FR
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono flex items-center gap-1.5 text-slate-300"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dark</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
