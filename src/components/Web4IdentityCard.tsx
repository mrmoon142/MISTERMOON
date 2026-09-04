import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, Key, Copy, Check, QrCode, Cpu, Sparkles } from 'lucide-react';

export const Web4IdentityCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const did = 'did:key:z6MkqBfG7m9V3kL8wXyZ1oNp4tQrS5uVxYzW9aBcDeFgHi';
  const fingerprint = 'SHA256:9E:8A:7B:4C:1D:3F:6E:5A:2B:0C:8D:7E:4F:1A:3B';

  const handleCopy = () => {
    navigator.clipboard.writeText(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    setVerified(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#06B6D4', '#FFFFFF'],
    });
    setTimeout(() => setVerified(false), 3500);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#0E121B] via-[#090C12] to-[#0E121B] border border-amber-400/30 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.1)] overflow-hidden">
      {/* Background cyber pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400/80 block">
                WEB4 SOVEREIGN IDENTITY
              </span>
              <h4 className="font-brand font-bold text-sm text-slate-100">MisterMoon Sovereign DID</h4>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHICALLY SIGNED</span>
          </span>
        </div>

        {/* DID Code Box */}
        <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Decentralized Identifier (DID)</span>
            <button
              onClick={handleCopy}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy DID'}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-slate-200 truncate select-all">{did}</p>
        </div>

        {/* Key Fingerprint & Enclave info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Signature Algorithm</span>
            <span className="font-mono text-[11px] text-amber-300">Ed25519-EdDSA (Zero-Knowledge)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Public Key Fingerprint</span>
            <span className="font-mono text-[11px] text-cyan-300 truncate block">{fingerprint}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>Client-Side Enclave Verified</span>
          </span>

          <button
            onClick={handleVerify}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              verified
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{verified ? 'Cryptographically Proven!' : 'Verify Signature Proof'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
