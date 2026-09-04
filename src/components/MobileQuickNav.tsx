import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import { synthEngine } from '../utils/audioSynth';
import {
  Home,
  Briefcase,
  Layers,
  Download,
  Sparkles,
  BookOpen,
  Search,
} from 'lucide-react';

export const MobileQuickNav: React.FC = () => {
  const { currentPage, setCurrentPage, setIsSearchOpen, t } = useApp();

  const navItems: { id: PageTab; labelKey: string; fallback: string; icon: React.ReactNode }[] = [
    { id: 'home', labelKey: 'nav_home', fallback: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'projects', labelKey: 'nav_projects', fallback: 'Projects', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'apps', labelKey: 'nav_apps', fallback: 'Apps', icon: <Layers className="w-5 h-5" /> },
    { id: 'ai-studio', labelKey: 'nav_ai_studio', fallback: 'AI Studio', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'downloader', labelKey: 'nav_downloader_short', fallback: 'Downloader', icon: <Download className="w-5 h-5" /> },
    { id: 'blog', labelKey: 'nav_blog', fallback: 'Blog', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const handleNavClick = (page: PageTab) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    synthEngine.playUiSound('click');
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    synthEngine.playUiSound('click');
  };

  return (
    <nav
      id="mobile-quick-bottom-nav"
      aria-label="Mobile Quick Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#07090E]/95 backdrop-blur-2xl border-t border-amber-400/20 px-1 py-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer relative flex-1 ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
              )}
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 text-amber-400' : 'text-slate-400'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[9px] font-mono tracking-tight mt-0.5 whitespace-nowrap">
                {t(item.labelKey, item.fallback)}
              </span>
            </button>
          );
        })}

        {/* Quick Search Button */}
        <button
          id="mobile-nav-search"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-amber-400 transition-colors cursor-pointer flex-1"
          aria-label={t('search_title', 'Search')}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-0.5 whitespace-nowrap">
            {t('search', 'Search')}
          </span>
        </button>
      </div>
    </nav>
  );
};
