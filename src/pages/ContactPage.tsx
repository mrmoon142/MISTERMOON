import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { AdContainer } from '../components/AdContainer';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  MessageSquare,
  Globe,
  MapPin,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Strategic Partnership',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to transmit message.');
      }

      setSuccessMsg(data.message || 'Message transmitted successfully.');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#06B6D4', '#FFFFFF'],
      });

      setFormData({
        name: '',
        email: '',
        category: 'Strategic Partnership',
        subject: '',
        message: '',
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page-root" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('contact_badge', 'SECURE TRANSMISSION CHANNEL')}</span>
        </div>

        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Initialize <span className="gold-gradient-text">Connection</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          Direct communication channel for technology inquiries, software engineering, Web4 advisory, and strategic collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0C0F17] border border-amber-400/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-brand font-bold text-xl text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Transceiver Terminal</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">End-to-End Validated Transmission</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Transmission Confirmed</span>
                <p>{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Validation Error</span>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Sector Classification
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-amber-400 focus:outline-none font-sans cursor-pointer"
                >
                  <option value="Strategic Partnership">Strategic Partnership</option>
                  <option value="AI & Software Architecture">AI & Software Architecture</option>
                  <option value="Music Licensing & Sonic Art">Music Licensing & Sonic Art</option>
                  <option value="Press & Media Inquiries">Press & Media Inquiries</option>
                  <option value="General Transmission">General Transmission</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry regarding..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Transmission Payload (Message) *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Detail your request, project timeline, or strategic proposition..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs leading-relaxed focus:border-amber-400 focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Payload...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Transmission</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Channels & Location Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0C0F17] border border-slate-800 p-6 sm:p-8 space-y-4">
            <h3 className="font-brand font-bold text-lg text-slate-100">Direct Inquiries</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MisterMoon operates internationally, delivering cross-disciplinary technology and audio projects globally.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Official Dispatch</span>
                  <span className="text-slate-200 font-mono font-semibold">contact@mistermoon.com.ng</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Time Zone Coverage</span>
                  <span className="text-slate-200 font-mono font-semibold">UTC-5 to UTC+1 (Global Sync)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Security Protocol</span>
                  <span className="text-slate-200 font-mono font-semibold">Anti-Spam Rate Limit Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Social Media Connections */}
          <div className="rounded-3xl bg-[#0C0F17] border border-amber-400/20 p-6 sm:p-8 space-y-4">
            <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
              <span className="gold-gradient-text">Social Connections</span>
              <span className="text-[10px] font-mono text-amber-400/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
                @MISTERMOON142
              </span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Connect directly across verified official social networks for collabs, discussions, and developer updates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="https://x.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">X</span>
                  <span>@MISTERMOON142</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://github.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">GitHub</span>
                  <span>MISTERMOON142</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://youtube.com/@MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-400">YouTube</span>
                  <span>@MISTERMOON142</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://linkedin.com/in/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-400">LinkedIn</span>
                  <span>MISTERMOON142</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://instagram.com/MISTERMOON142"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-slate-300 transition-colors sm:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pink-400">Instagram</span>
                  <span>@MISTERMOON142</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* AdSense Unit */}
      <AdContainer slot="contact" format="horizontal" />
    </div>
  );
};
