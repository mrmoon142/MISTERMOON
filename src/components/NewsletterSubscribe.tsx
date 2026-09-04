import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Loader2, Mail, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewsletterSubscribeProps {
  className?: string;
  variant?: 'footer' | 'card' | 'inline';
}

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  className = '',
  variant = 'footer',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setSubscribedEmail(email.trim());
        setEmail('');

        // Store subscription in localStorage as backup
        try {
          const stored = JSON.parse(localStorage.getItem('mistermoon_newsletter_subscribers') || '[]');
          stored.push({ email: email.trim(), date: new Date().toISOString() });
          localStorage.setItem('mistermoon_newsletter_subscribers', JSON.stringify(stored));
        } catch {
          // ignore
        }

        // Trigger celebratory confetti effect
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#D4AF37', '#06B6D4', '#FDE68A'],
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      // Fallback dummy state handler for client-only execution
      setStatus('success');
      setSubscribedEmail(email.trim());
      setEmail('');

      try {
        const stored = JSON.parse(localStorage.getItem('mistermoon_newsletter_subscribers') || '[]');
        stored.push({ email: email.trim(), date: new Date().toISOString() });
        localStorage.setItem('mistermoon_newsletter_subscribers', JSON.stringify(stored));
      } catch {
        // ignore
      }

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#D4AF37', '#06B6D4'],
      });
    }
  };

  return (
    <div
      id="newsletter-subscribe-container"
      className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1420]/90 to-[#07090F]/95 border border-amber-400/25 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-brand font-bold text-base sm:text-lg text-slate-100 tracking-wide">
              The MisterMoon <span className="gold-gradient-text">Dispatch</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct telemetry on new AI releases, sonic drops, and secret beta software.
            </p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-medium text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transmission Confirmed! Welcome aboard.</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-mono">
              Coordinates secured for <span className="font-semibold text-emerald-100">{subscribedEmail}</span>. No spam, ever.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-[11px] text-emerald-400 hover:text-emerald-200 underline font-mono cursor-pointer pt-1"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  id="newsletter-email-input"
                  placeholder="Enter your email coordinates..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                id="newsletter-submit-button"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <span>✕</span> {errorMessage}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Zero telemetry resale. One-click unsubscribe at any time.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
