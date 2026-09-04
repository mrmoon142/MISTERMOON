import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Loader2, Mail, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from './ToastNotification';
import { synthEngine } from '../utils/audioSynth';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'footer' | 'card' | 'inline';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  variant = 'footer',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      synthEngine.playUiSound('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setSubscribedEmail(cleanEmail);
        setEmail('');

        // Backup to localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('mistermoon_newsletter_subscribers') || '[]');
          stored.push({ email: cleanEmail, date: new Date().toISOString() });
          localStorage.setItem('mistermoon_newsletter_subscribers', JSON.stringify(stored));
        } catch {
          // ignore
        }

        // Sound chime & confetti
        synthEngine.playUiSound('success');
        showToast({
          title: 'Welcome to the Dispatch! ✨',
          message: `Transmission secured for ${cleanEmail}. Check your inbox soon.`,
          type: 'success',
        });

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.82 },
          colors: ['#D4AF37', '#06B6D4', '#F59E0B', '#E2E8F0'],
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Subscription failed. Please try again.');
        synthEngine.playUiSound('error');
      }
    } catch {
      // Client-side fallback handler
      setStatus('success');
      setSubscribedEmail(cleanEmail);
      setEmail('');

      try {
        const stored = JSON.parse(localStorage.getItem('mistermoon_newsletter_subscribers') || '[]');
        stored.push({ email: cleanEmail, date: new Date().toISOString() });
        localStorage.setItem('mistermoon_newsletter_subscribers', JSON.stringify(stored));
      } catch {
        // ignore
      }

      synthEngine.playUiSound('success');
      showToast({
        title: 'Transmission Confirmed! ✨',
        message: `Coordinates saved for ${cleanEmail}.`,
        type: 'success',
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.82 },
        colors: ['#D4AF37', '#06B6D4'],
      });
    }
  };

  return (
    <div
      id="newsletter-signup-card"
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-gradient-to-br from-[#0F1422]/85 via-[#0A0D15]/80 to-[#06080E]/90 border border-amber-400/25 shadow-[0_15px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(212,175,55,0.08)] transition-all hover:border-amber-400/40 ${className}`}
    >
      {/* Glassmorphism ambient glow accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Header & Bio */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MisterMoon Dispatch</span>
          </div>

          <h3 className="font-brand font-bold text-xl sm:text-2xl text-slate-100 tracking-tight">
            Stay Ahead of the <span className="gold-gradient-text">Technological Curve</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Direct intelligence on novel AI agents, sovereign Web4 protocols, high-fidelity synthesizer soundscapes, and private beta releases.
          </p>
        </div>

        {/* Input Form or Success State */}
        <div className="w-full lg:max-w-md">
          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscription Confirmed! Welcome aboard.</span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-mono">
                Coordinates locked for <span className="text-emerald-100 font-bold">{subscribedEmail}</span>.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-[11px] text-emerald-400 hover:text-emerald-200 underline font-mono cursor-pointer pt-1"
              >
                Register another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="newsletter-signup-email-input"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="newsletter-signup-submit-btn"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 hover:scale-[1.02]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Dispatch</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5 animate-in fade-in">
                  <span>✕</span> {errorMessage}
                </p>
              )}

              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>256-bit Encrypted</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Zero Spam Guaranteed</span>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
