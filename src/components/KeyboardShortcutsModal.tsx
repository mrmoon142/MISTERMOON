import React from 'react';
import { X, Command, Music, SunMoon, Search, Shield, CornerDownLeft, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['⌘', 'K'],
      altKeys: ['Ctrl', 'K'],
      label: 'Universal AI Search & Command Palette',
      icon: Search,
      category: 'Navigation',
    },
    {
      keys: ['M'],
      label: 'Toggle Cyberpunk Synthesizer Audio (Play / Pause)',
      icon: Music,
      category: 'Audio Player',
    },
    {
      keys: ['['],
      altKeys: ['P'],
      label: 'Previous Track',
      icon: Music,
      category: 'Audio Player',
    },
    {
      keys: [']'],
      altKeys: ['N'],
      label: 'Next Track',
      icon: Music,
      category: 'Audio Player',
    },
    {
      keys: ['T'],
      label: 'Toggle Light / Dark Mode Theme',
      icon: SunMoon,
      category: 'Appearance',
    },
    {
      keys: ['Alt', 'A'],
      altKeys: ['Ctrl', 'Shift', 'A'],
      label: 'Open Admin Management CMS',
      icon: Shield,
      category: 'Administration',
    },
    {
      keys: ['?'],
      altKeys: ['Shift', '/'],
      label: 'Display Keyboard Shortcuts Guide',
      icon: Sparkles,
      category: 'Help',
    },
    {
      keys: ['ESC'],
      label: 'Close Active Dialog or Inspector',
      icon: CornerDownLeft,
      category: 'Navigation',
    },
  ];

  return (
    <div
      id="keyboard-shortcuts-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="keyboard-shortcuts-modal"
        className="w-full max-w-lg rounded-3xl bg-[#0C0F17] border border-amber-400/30 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
                Keyboard Shortcuts
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Power User
                </span>
              </h2>
              <p className="text-xs text-slate-400">Quick keys to navigate MISTERMOON.COM seamlessly</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-200 font-medium block">{sc.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sc.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {sc.keys.map((k, ki) => (
                    <kbd
                      key={ki}
                      className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 shadow-sm min-w-[24px] text-center"
                    >
                      {k}
                    </kbd>
                  ))}
                  {sc.altKeys && (
                    <>
                      <span className="text-[10px] text-slate-400 font-mono">or</span>
                      {sc.altKeys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="px-1.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[10px] font-mono text-slate-300"
                        >
                          {k}
                        </kbd>
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300">?</kbd> anywhere</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-semibold hover:bg-amber-400/30 transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
