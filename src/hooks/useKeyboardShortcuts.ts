import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface KeyboardShortcutsOptions {
  onToggleShortcutsModal?: () => void;
  onCloseModals?: () => void;
}

export const useKeyboardShortcuts = ({
  onToggleShortcutsModal,
  onCloseModals,
}: KeyboardShortcutsOptions = {}) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    isAdminOpen,
    setIsAdminOpen,
    theme,
    setTheme,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // 1. Search: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        return;
      }

      // 2. Admin Dashboard: Alt + A or Ctrl + Shift + A
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen(!isAdminOpen);
        return;
      }

      // 3. Escape: Close open modals
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isAdminOpen) setIsAdminOpen(false);
        if (onCloseModals) onCloseModals();
        return;
      }

      // Remaining shortcuts only if not focused in an input field
      if (isInput) return;

      // 4. Theme Mode Toggle: 'T' or 't'
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        return;
      }

      // 5. Help / Keyboard Shortcuts Modal: '?' or 'Shift + /'
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (onToggleShortcutsModal) {
          onToggleShortcutsModal();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSearchOpen,
    setIsSearchOpen,
    isAdminOpen,
    setIsAdminOpen,
    theme,
    setTheme,
    onToggleShortcutsModal,
    onCloseModals,
  ]);
};
