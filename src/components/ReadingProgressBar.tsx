import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReadingProgressBar: React.FC = () => {
  const { currentPage } = useApp();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check if current page is a long-form content page (Blog, Privacy, Terms, Cookies, etc.)
  const isLongFormPage =
    currentPage === 'blog' ||
    currentPage === 'legal-privacy' ||
    currentPage === 'legal-terms' ||
    currentPage === 'legal-cookies' ||
    currentPage === 'about';

  useEffect(() => {
    // Reset progress on page switch
    setScrollProgress(0);

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, [currentPage]);

  if (!isLongFormPage) return null;

  return (
    <div
      id="reading-progress-bar-container"
      className="fixed top-0 left-0 right-0 h-[3px] bg-slate-900/30 z-[100] pointer-events-none"
      aria-hidden="true"
    >
      <div
        id="reading-progress-bar"
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.9),0_0_4px_rgba(212,175,55,1)] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
