import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  Crown,
  Activity,
  BarChart3,
  Flame,
  ArrowUpRight,
  X,
  CreditCard,
  Lock,
  Key,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UsageStatsProps {
  usedCount: number;
  maxLimit?: number;
  onUpgrade?: () => void;
  className?: string;
}

export const UsageStats: React.FC<UsageStatsProps> = ({
  usedCount,
  maxLimit = 20,
  onUpgrade,
  className = '',
}) => {
  const { subscription, activateSubscription, recoverSubscription, logoutSubscription } = useApp();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'upgrade' | 'recover'>('upgrade');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  // Upgrade form state
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmittingUpgrade, setIsSubmittingUpgrade] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [newlyCreatedCode, setNewlyCreatedCode] = useState<string | null>(null);

  // Recovery form state
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverPaymentRef, setRecoverPaymentRef] = useState('');
  const [recoverCode, setRecoverCode] = useState('');
  const [isSubmittingRecover, setIsSubmittingRecover] = useState(false);
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [recoverSuccess, setRecoverSuccess] = useState(false);

  // Clipboard copy state
  const [copiedCode, setCopiedCode] = useState(false);

  const isPro = subscription.isPro;
  const effectiveMax = isPro ? 99999 : maxLimit;
  const percentage = isPro ? 100 : Math.min(100, Math.round((usedCount / maxLimit) * 100));
  const remaining = isPro ? 'Unlimited' : Math.max(0, maxLimit - usedCount);

  // Determine progress bar color
  const getProgressColor = () => {
    if (isPro) return 'from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.6)]';
    if (percentage >= 90) return 'from-rose-500 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.5)]';
    if (percentage >= 70) return 'from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)]';
    return 'from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.4)]';
  };

  const handleExecuteUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeEmail || !upgradeEmail.includes('@')) {
      setUpgradeError('Please enter a valid billing email address.');
      return;
    }

    setUpgradeError(null);
    setIsSubmittingUpgrade(true);

    const generatedRef = paymentRef.trim() || `PAY-TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = await activateSubscription(upgradeEmail.trim(), selectedPlan, generatedRef);

    setIsSubmittingUpgrade(false);
    if (res.success && res.subscription?.uniqueCode) {
      setNewlyCreatedCode(res.subscription.uniqueCode);
      if (onUpgrade) onUpgrade();
    } else {
      setUpgradeError(res.error || 'Failed to activate subscription. Please try again.');
    }
  };

  const handleExecuteRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail || !recoverEmail.includes('@')) {
      setRecoverError('Please enter your billing email address.');
      return;
    }
    if (!recoverPaymentRef.trim()) {
      setRecoverError('Please enter your transaction reference or payment details.');
      return;
    }
    if (!recoverCode.trim()) {
      setRecoverError('Please enter the Unique Code sent to you.');
      return;
    }

    setRecoverError(null);
    setIsSubmittingRecover(true);

    const res = await recoverSubscription(recoverEmail.trim(), recoverPaymentRef.trim(), recoverCode.trim());

    setIsSubmittingRecover(false);
    if (res.success) {
      setRecoverSuccess(true);
      setTimeout(() => {
        setIsUpgradeModalOpen(false);
        setRecoverSuccess(false);
        if (onUpgrade) onUpgrade();
      }, 1800);
    } else {
      setRecoverError(res.error || 'Security verification failed. Please confirm your details.');
    }
  };

  const copyUniqueCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      id="usage-stats-dashboard-card"
      className={`rounded-2xl bg-gradient-to-b from-[#0F1422] to-[#080B12] border ${
        isPro ? 'border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.15)]' : 'border-cyan-500/20'
      } p-5 sm:p-6 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background ambient glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 ${isPro ? 'bg-amber-400/10' : 'bg-cyan-500/10'} rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isPro ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'} border flex items-center justify-center shadow-inner`}>
            {isPro ? <Crown className="w-5 h-5 fill-amber-300/30" /> : <BarChart3 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-brand font-bold text-base text-slate-100">Daily AI Engine Quota</h3>
              <span className={`px-2.5 py-0.5 rounded-full ${
                isPro
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              } text-[10px] font-mono font-bold uppercase tracking-wider`}>
                {isPro ? 'VIP Pro Unlimited' : 'Free Tier'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPro ? 'Full unmetered access to Gemini 3.7 reasoning & image studio' : 'Reset scheduled automatically at 00:00 UTC'}
            </p>
          </div>
        </div>

        {/* Upgrade / Manage License Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="upgrade-to-pro-btn"
            onClick={() => {
              setModalTab(isPro ? 'upgrade' : 'upgrade');
              setNewlyCreatedCode(null);
              setIsUpgradeModalOpen(true);
            }}
            className={`px-4 py-2 rounded-xl ${
              isPro
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)]'
            } font-mono text-xs flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] cursor-pointer`}
          >
            {isPro ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Manage Pro License</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Upgrade to Pro</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {!isPro && (
            <button
              id="restore-sub-shortcut-btn"
              onClick={() => {
                setModalTab('recover');
                setIsUpgradeModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
              title="Restore an existing subscription with unique code"
            >
              Restore
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric Section */}
      <div className="space-y-3 relative z-10 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
              {usedCount}
            </span>
            <span className="text-sm font-mono text-slate-400">
              {isPro ? ' requests processed (Unlimited)' : ` / ${maxLimit} chats used`}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-xs font-mono font-semibold ${isPro ? 'text-amber-400' : 'text-cyan-400'}`}>
              {isPro ? '⚡ Unlimited Quota Active' : `${remaining} requests remaining`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isPro ? '100%' : `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor()}`}
          />
        </div>
      </div>

      {/* Active License Details (When Pro is active) */}
      {isPro && subscription.uniqueCode && (
        <div className="mb-6 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-300/80 font-bold">
                Unique Security License Code:
              </div>
              <div className="text-xs font-mono font-bold text-slate-100 mt-0.5">
                {subscription.uniqueCode}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyUniqueCode(subscription.uniqueCode || '')}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      )}

      {/* Live System Performance Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            Avg Latency
          </span>
          <span className="text-sm font-mono font-bold text-slate-200 mt-1">240 ms</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Engine Model
          </span>
          <span className="text-sm font-mono font-bold text-amber-300 mt-1 truncate">Gemini 3.7 Flash</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Security
          </span>
          <span className="text-sm font-mono font-bold text-emerald-300 mt-1">Encrypted 256-bit</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-purple-400" />
            Tier
          </span>
          <span className="text-sm font-mono font-bold text-purple-300 mt-1">{isPro ? 'VIP Unlimited' : 'Free 20/day'}</span>
        </div>
      </div>

      {/* Upgrade & Security Recovery Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#111728] via-[#0D121F] to-[#07090F] border border-amber-400/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.25)] relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/40">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-brand font-bold text-lg text-slate-100">
                      MisterMoon Pro Subscription
                    </h3>
                    <span className="text-xs text-amber-300/80 font-mono">
                      {isPro ? 'Manage License & Security Code' : 'Upgrade or Restore Pro License'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Tab Switcher (Upgrade vs Recover) */}
              <div className="my-4 grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setModalTab('upgrade');
                    setUpgradeError(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    modalTab === 'upgrade'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isPro ? 'License Details' : 'Upgrade to Pro'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalTab('recover');
                    setRecoverError(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    modalTab === 'recover'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Restore Subscription
                </button>
              </div>

              {/* TAB 1: UPGRADE FLOW */}
              {modalTab === 'upgrade' && (
                <div className="space-y-4 relative z-10">
                  {/* If newly created code exists */}
                  {newlyCreatedCode ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>

                      <div>
                        <h4 className="font-brand font-bold text-base text-slate-100">
                          Pro Subscription Activated!
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Please copy and safely store your <strong>Unique Security Code</strong>. If you ever need to restore your subscription on any new device or after clearing cache, submit your billing email, payment details, and this code in the Restore tab.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                          {newlyCreatedCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyUniqueCode(newlyCreatedCode)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUpgradeModalOpen(false);
                          setNewlyCreatedCode(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold cursor-pointer transition-colors"
                      >
                        Done & Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleExecuteUpgrade} className="space-y-4">
                      {/* Plan Switcher */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPlan('monthly')}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedPlan === 'monthly'
                              ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[11px] font-mono font-semibold uppercase">Monthly VIP</div>
                          <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">$9 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Billed monthly.</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPlan('yearly')}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            selectedPlan === 'yearly'
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="absolute -top-2 right-2 px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[8px] font-mono font-bold uppercase">
                            Save 35%
                          </span>
                          <div className="text-[11px] font-mono font-semibold uppercase">Yearly Founder</div>
                          <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">$69 <span className="text-xs font-normal text-slate-400">/ yr</span></div>
                          <div className="text-[10px] text-slate-400 mt-0.5">$5.75/month.</div>
                        </button>
                      </div>

                      {/* Billing Email Input */}
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">
                          Billing Email Address <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={upgradeEmail}
                          onChange={(e) => setUpgradeEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2.5 text-xs text-slate-100 font-sans outline-none transition-colors"
                        />
                      </div>

                      {/* Payment / Transaction Details (Optional or Reference) */}
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">
                          Payment Reference / Card Ref (Optional)
                        </label>
                        <input
                          type="text"
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          placeholder="e.g. PAY-TX-88392 or Card ending in 4242"
                          className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2.5 text-xs text-slate-100 font-mono outline-none transition-colors"
                        />
                      </div>

                      {/* Error message */}
                      {upgradeError && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{upgradeError}</span>
                        </div>
                      )}

                      {/* Upgrade Submit */}
                      <button
                        type="submit"
                        disabled={isSubmittingUpgrade}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
                      >
                        {isSubmittingUpgrade ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Authorizing Security Credentials...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Activate Pro & Generate Unique Security Code</span>
                          </>
                        )}
                      </button>

                      {isPro && (
                        <button
                          type="button"
                          onClick={() => {
                            logoutSubscription();
                            setIsUpgradeModalOpen(false);
                          }}
                          className="w-full text-center text-xs font-mono text-slate-400 hover:text-rose-400 py-1 transition-colors cursor-pointer"
                        >
                          Sign out of Pro License on this device
                        </button>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: RECOVER / RESTORE SUBSCRIPTION FLOW */}
              {modalTab === 'recover' && (
                <form onSubmit={handleExecuteRecovery} className="space-y-4 relative z-10">
                  <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200">
                    <span className="font-bold text-amber-300 font-mono block mb-1">Security Recovery Protocol:</span>
                    To restore your subscription on this browser or device, submit your billing email, payment reference / transaction details, and the Unique Code sent to you.
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Billing Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      placeholder="e.g. miraclemoonboy@gmail.com"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2.5 text-xs text-slate-100 font-sans outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Payment Details / Reference ID <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recoverPaymentRef}
                      onChange={(e) => setRecoverPaymentRef(e.target.value)}
                      placeholder="e.g. PAY-MOON-INITIAL-998 or Stripe/PayPal Ref"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2.5 text-xs text-slate-100 font-mono outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Unique Security Code Sent To You <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recoverCode}
                      onChange={(e) => setRecoverCode(e.target.value)}
                      placeholder="e.g. MOON-PRO-7F9A-4B2E-8901"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider outline-none transition-colors uppercase"
                    />
                  </div>

                  {recoverError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{recoverError}</span>
                    </div>
                  )}

                  {recoverSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Subscription verified & restored successfully!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingRecover || recoverSuccess}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
                  >
                    {isSubmittingRecover ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Records...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Verify & Restore Subscription</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-mono text-slate-500">
                <CreditCard className="w-3 h-3" />
                <span>Encrypted 256-bit protocol • Contact support: miraclemoonboy@gmail.com</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
