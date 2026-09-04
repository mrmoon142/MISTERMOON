import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Star,
  Bot,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  DownloadCloud,
  Music,
} from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error' | 'star' | 'link' | 'ai' | 'download';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'> | string) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (toastInput: Omit<ToastItem, 'id'> | string): string => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const newToast: ToastItem =
        typeof toastInput === 'string'
          ? { id, message: toastInput, type: 'info', duration: 3500 }
          : {
              id,
              type: 'info',
              duration: 3500,
              ...toastInput,
            };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep up to 4 toasts at once

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container & Presentation Component
interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const getToastIcon = (type?: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'star':
      return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
    case 'link':
      return <Copy className="w-4 h-4 text-cyan-400" />;
    case 'ai':
      return <Bot className="w-4 h-4 text-amber-300" />;
    case 'download':
      return <DownloadCloud className="w-4 h-4 text-cyan-400" />;
    case 'error':
      return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    case 'info':
    default:
      return <Sparkles className="w-4 h-4 text-amber-400" />;
  }
};

const getToastBorderGlow = (type?: ToastType) => {
  switch (type) {
    case 'star':
      return 'border-amber-400/50 shadow-[0_10px_30px_rgba(212,175,55,0.25)]';
    case 'link':
    case 'download':
      return 'border-cyan-500/50 shadow-[0_10px_30px_rgba(6,182,212,0.25)]';
    case 'ai':
      return 'border-amber-400/60 shadow-[0_10px_35px_rgba(212,175,55,0.3)] bg-gradient-to-br from-[#0F131D]/98 to-[#090C14]/98';
    case 'error':
      return 'border-rose-500/50 shadow-[0_10px_30px_rgba(244,63,94,0.2)]';
    case 'success':
      return 'border-emerald-500/50 shadow-[0_10px_30px_rgba(16,185,129,0.2)]';
    case 'info':
    default:
      return 'border-amber-400/40 shadow-[0_10px_30px_rgba(212,175,55,0.2)]';
  }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-notification-dock"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[90vw] sm:w-auto pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.18 } }}
            layout
            className={`pointer-events-auto relative rounded-2xl bg-[#0B0E17]/95 backdrop-blur-xl border p-3.5 sm:p-4 text-xs font-sans text-slate-200 transition-all ${getToastBorderGlow(
              toast.type
            )}`}
          >
            {/* Top glowing ambient accent */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
              </div>

              <div className="flex-1 min-w-0 pr-2 space-y-0.5">
                {toast.title && (
                  <h4 className="font-brand font-bold text-slate-100 text-xs sm:text-sm tracking-wide">
                    {toast.title}
                  </h4>
                )}
                <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed break-words font-sans">
                  {toast.message}
                </p>

                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      onDismiss(toast.id);
                    }}
                    className="mt-1.5 text-[11px] font-mono text-amber-300 hover:text-amber-200 underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{toast.action.label}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
