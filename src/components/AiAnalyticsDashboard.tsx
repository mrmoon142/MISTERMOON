import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Zap,
  Activity,
  Smile,
  Clock,
  Database,
  RefreshCw,
  Layers,
  Cpu,
} from 'lucide-react';
import { synthEngine } from '../utils/audioSynth';

interface PatternData {
  category: string;
  prompts: number;
  tokens: number;
  successRate: number;
}

interface SentimentData {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface TimelineData {
  time: string;
  latency: number;
  tokens: number;
  confidence: number;
}

const INITIAL_PROMPT_PATTERNS: PatternData[] = [
  { category: 'AI Vibe Coding', prompts: 428, tokens: 194200, successRate: 99.2 },
  { category: 'DSP Synth & Audio', prompts: 216, tokens: 88400, successRate: 98.4 },
  { category: 'UI / UX Prototyping', prompts: 382, tokens: 142800, successRate: 97.9 },
  { category: 'Web4 & Cryptography', prompts: 174, tokens: 71900, successRate: 99.5 },
  { category: 'Solopreneur Strategy', prompts: 290, tokens: 112000, successRate: 98.8 },
  { category: 'Multimodal Image Gen', prompts: 345, tokens: 168000, successRate: 96.7 },
];

const INITIAL_SENTIMENTS: SentimentData[] = [
  { name: 'Visionary & Ambitious', value: 38, color: '#D4AF37', description: 'Product concept expansion, high-level roadmaps' },
  { name: 'Analytical & Technical', value: 29, color: '#06B6D4', description: 'Code optimization, bug diagnosis, architecture' },
  { name: 'Creative & Experimental', value: 18, color: '#A855F7', description: 'Audio loops, novel UI aesthetics, prompt variations' },
  { name: 'Pragmatic & Focused', value: 11, color: '#10B981', description: 'Quick queries, conversion utilities, JSON export' },
  { name: 'Inquisitive & Curious', value: 4, color: '#F59E0B', description: 'Learning concepts, prompt feedback loops' },
];

const INITIAL_TIMELINE: TimelineData[] = [
  { time: '00:00', latency: 420, tokens: 1200, confidence: 96 },
  { time: '04:00', latency: 380, tokens: 1850, confidence: 98 },
  { time: '08:00', latency: 510, tokens: 3400, confidence: 94 },
  { time: '12:00', latency: 640, tokens: 6800, confidence: 97 },
  { time: '16:00', latency: 590, tokens: 5900, confidence: 99 },
  { time: '20:00', latency: 460, tokens: 4100, confidence: 98 },
  { time: '23:59', latency: 390, tokens: 2300, confidence: 99 },
];

export const AiAnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [promptData, setPromptData] = useState<PatternData[]>(INITIAL_PROMPT_PATTERNS);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>(INITIAL_SENTIMENTS);
  const [timelineData, setTimelineData] = useState<TimelineData[]>(INITIAL_TIMELINE);
  const [isSimulating, setIsSimulating] = useState(false);

  // Quick refresh / simulate new interaction stream
  const handleSimulate = () => {
    synthEngine.playUiSound('click');
    setIsSimulating(true);

    setTimeout(() => {
      // Perturb data slightly to reflect live streaming telemetry
      setPromptData((prev) =>
        prev.map((item) => ({
          ...item,
          prompts: item.prompts + Math.floor(Math.random() * 14) + 1,
          tokens: item.tokens + Math.floor(Math.random() * 5000) + 1000,
        }))
      );

      setTimelineData((prev) =>
        prev.map((item) => ({
          ...item,
          latency: Math.max(280, item.latency + Math.floor((Math.random() - 0.5) * 60)),
          tokens: item.tokens + Math.floor(Math.random() * 300),
        }))
      );

      setIsSimulating(false);
      synthEngine.playUiSound('success');
    }, 600);
  };

  const totalPrompts = promptData.reduce((acc, curr) => acc + curr.prompts, 0);
  const totalTokens = promptData.reduce((acc, curr) => acc + curr.tokens, 0);

  return (
    <div id="ai-analytics-dashboard" className="space-y-8 animate-fadeIn">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0C0F17] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.06)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-brand font-bold text-xl text-slate-100 flex items-center gap-2">
              Gemini AI Studio <span className="gold-gradient-text">Prompt Analytics</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry of user prompt patterns, sentiment distributions, and LLM inference performance.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Timeframe selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  synthEngine.playUiSound('click');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh AI Telemetry Stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Sync Metrics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-amber-400/40 transition-colors space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Queries Parsed</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-brand font-bold text-2xl text-slate-100">
            {totalPrompts.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% vs previous window</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Token Volume Velocity</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-brand font-bold text-2xl text-slate-100">
            {(totalTokens / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
            <Activity className="w-3 h-3" />
            <span>Avg 420 tokens / response</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-purple-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Avg Inference Latency</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-brand font-bold text-2xl text-slate-100">
            485 ms
          </div>
          <div className="text-[11px] text-purple-300 flex items-center gap-1 font-mono">
            <Cpu className="w-3 h-3" />
            <span>Gemini 3.7 Flash Engine</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Heuristic Cache Hit Rate</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-brand font-bold text-2xl text-slate-100">
            94.2%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3" />
            <span>Zero-latency local fallback</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: User Prompt Patterns */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0C0F17] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h4 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Common User Prompt Patterns</span>
              </h4>
              <p className="text-xs text-slate-400">
                Frequency and token complexity across AI interaction clusters
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Categorized
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={promptData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                />
                <Bar
                  dataKey="prompts"
                  fill="#D4AF37"
                  radius={[6, 6, 0, 0]}
                  name="Prompt Invocations"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart: Sentiment Analysis */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0C0F17] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h4 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
                <Smile className="w-4 h-4 text-cyan-400" />
                <span>Prompt Sentiment Breakdown</span>
              </h4>
              <p className="text-xs text-slate-400">
                Emotion and intent classification from prompt semantics
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              NLP Classified
            </span>
          </div>

          <div className="w-full h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latency & Token Flow Timeline */}
      <div className="p-6 rounded-3xl bg-[#0C0F17] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h4 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Token Generation & Latency Velocity Timeline</span>
            </h4>
            <p className="text-xs text-slate-400">
              Streaming inference timeline across global diurnal cycles (UTC)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Latency (ms)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Tokens Generated
            </span>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="#D4AF37"
                fillOpacity={1}
                fill="url(#colorTokens)"
                name="Tokens Generated"
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#06B6D4"
                fillOpacity={1}
                fill="url(#colorLatency)"
                name="Inference Latency (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
