import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/ToastNotification';
import { TopHeaderAdBanner } from './components/TopHeaderAdBanner';
import { MobileAdPopup } from './components/MobileAdPopup';
import { MobileQuickNav } from './components/MobileQuickNav';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import { MetaTagManager } from './components/MetaTagManager';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AppsPage } from './pages/AppsPage';
import { DownloaderPage } from './pages/DownloaderPage';
import { AIStudioPage } from './pages/AIStudioPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { PageTransitionCurtain } from './components/PageTransitionCurtain';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);

  // Dynamic Document Title based on currentPage for SEO and UX awareness
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      home: 'MisterMoon | AI Vibe Coder & Full-Stack Web4 Systems Architect',
      about: 'About Miracle Chibueze Dike (MisterMoon) | AI Engineer & Builder',
      projects: 'Projects & Innovations | MisterMoon Portfolio',
      apps: 'Software & Digital Apps Suite | MisterMoon Tools',
      downloader: 'MisterMoon Video Stream & AI Translation | Watch & Dub Anything',
      'ai-studio': 'AI Studio & Prompt Assistant | MisterMoon Copilot',
      blog: 'Insights & Technical Publications | MisterMoon AI & Web4 Articles',
      contact: 'Contact & Booking | MisterMoon (Miracle Chibueze Dike)',
      'legal-privacy': 'Privacy Policy | MISTERMOON.COM.NG',
      'legal-terms': 'Terms of Service | MISTERMOON.COM.NG',
      'legal-cookies': 'Cookie Preferences | MISTERMOON.COM.NG',
    };

    const newTitle = pageTitles[currentPage] || 'MISTERMOON.COM.NG — Technology • AI • Digital Innovation';
    document.title = newTitle;
  }, [currentPage]);

  // Activate global keyboard shortcuts (Cmd+K, Esc, ?, etc.)
  useKeyboardShortcuts({
    onToggleShortcutsModal: () => setIsShortcutsOpen((prev) => !prev),
    onCloseModals: () => setIsShortcutsOpen(false),
  });

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'apps':
        return <AppsPage />;
      case 'downloader':
        return <DownloaderPage />;
      case 'ai-studio':
        return <AIStudioPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'legal-privacy':
        return <LegalPage initialTab="privacy" />;
      case 'legal-terms':
        return <LegalPage initialTab="terms" />;
      case 'legal-cookies':
        return <LegalPage initialTab="cookies" />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080C] text-slate-100 font-sans selection:bg-amber-400/30 selection:text-amber-200 transition-colors duration-300">
      {/* Dynamic SEO Meta Tags & OpenGraph Injector */}
      <MetaTagManager />

      {/* Persistent Push-Up Header AdSense Sponsor Banner */}
      <TopHeaderAdBanner />

      {/* Top Gold Reading Progress Bar */}
      <ReadingProgressBar />

      <Navbar />

      {/* Progress-Aware Luxury Curtain Exit & Entry Animation */}
      <PageTransitionCurtain pageKey={currentPage} />

      <main className="flex-1 w-full pb-20 md:pb-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Quick Mobile Navigation Bar */}
      <MobileQuickNav />

      {/* Global Modals, Floating AI Assistant, Custom Luxury Cursor & Notifications */}
      <CustomCursor />
      <GlobalSearchModal />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <FloatingAIAssistant />
      <BackToTop />
      <CookieConsentBanner />
      <MobileAdPopup />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
