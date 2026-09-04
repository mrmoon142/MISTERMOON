import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Wand2,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Layers,
  Camera,
  Palette,
  Sun,
  Eye,
  ArrowRight,
  Zap,
} from 'lucide-react';

export interface PromptSuggestion {
  id: string;
  category: 'lighting' | 'style' | 'camera' | 'details' | 'atmosphere';
  label: string;
  modifierText: string;
  icon: React.ReactNode;
}

interface ImagePromptAssistantProps {
  currentPrompt: string;
  onApplyPrompt: (newPrompt: string) => void;
  isEditMode?: boolean;
  onToggleEditMode?: (mode: boolean) => void;
  className?: string;
}

const CREATIVE_REFINEMENTS: PromptSuggestion[] = [
  {
    id: 'light-1',
    category: 'lighting',
    label: 'Golden Hour & Volumetric Light',
    modifierText: ', cinematic golden hour lighting, volumetric rays, soft ambient occlusion, warm lens flare',
    icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    id: 'light-2',
    category: 'lighting',
    label: 'Cyberpunk Neon Glow',
    modifierText: ', dark obsidian background, vibrant cyan and magenta neon rim lighting, reflective wet asphalt',
    icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    id: 'style-1',
    category: 'style',
    label: 'Luxury Obsidian & Gold 3D',
    modifierText: ', luxury minimalist 3D render, polished obsidian matte textures, electroplated 24k gold filigree accents, Octane Render 8K',
    icon: <Palette className="w-3.5 h-3.5 text-yellow-400" />,
  },
  {
    id: 'style-2',
    category: 'style',
    label: 'Futuristic Sci-Fi Concept Art',
    modifierText: ', futuristic sleek industrial design, holographic telemetry displays, clean aerospace alloy surfaces, Unreal Engine 5 render',
    icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
  },
  {
    id: 'camera-1',
    category: 'camera',
    label: '85mm Portrait Bokeh',
    modifierText: ', shot on Hasselblad H6D-100c, 85mm f/1.4 lens, shallow depth of field, creamy bokeh, ultra sharp foreground details',
    icon: <Camera className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    id: 'details-1',
    category: 'details',
    label: 'Hyper-Detailed Micro Textures',
    modifierText: ', intricate micro surface details, photorealistic 8K resolution, dynamic range, physically based rendering (PBR)',
    icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
  },
];

export const ImagePromptAssistant: React.FC<ImagePromptAssistantProps> = ({
  currentPrompt,
  onApplyPrompt,
  isEditMode = false,
  onToggleEditMode,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const handleApplyModifier = (modifier: string) => {
    let base = currentPrompt.trim();
    if (!base) {
      base = 'Futuristic high-tech visual composition';
    }
    // Prevent duplicate modifiers
    if (base.includes(modifier.trim())) return;
    const combined = base + modifier;
    onApplyPrompt(combined);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSuggestions = activeCategory === 'all'
    ? CREATIVE_REFINEMENTS
    : CREATIVE_REFINEMENTS.filter((s) => s.category === activeCategory);

  return (
    <div
      id="image-prompt-assistant-container"
      className={`rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D18] border border-amber-400/25 p-4 sm:p-5 shadow-lg space-y-4 ${className}`}
    >
      {/* Header with Title & Edit Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-brand font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Image Prompt Assistant</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono">
                AI Refine
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Transform ideas into high-definition photorealistic visual prompts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleEditMode && (
            <button
              type="button"
              onClick={() => onToggleEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-400/50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Edit Mode ON' : 'Toggle Edit Mode'}</span>
            </button>
          )}

          {currentPrompt && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Copy current prompt"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Refinements' },
          { id: 'lighting', label: 'Lighting & FX' },
          { id: 'style', label: 'Styles & Textures' },
          { id: 'camera', label: 'Optics & Lenses' },
          { id: 'details', label: 'Render Details' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Suggestion Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredSuggestions.map((sug) => (
          <button
            key={sug.id}
            type="button"
            onClick={() => handleApplyModifier(sug.modifierText)}
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/40 text-left flex items-start gap-2.5 transition-all group cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-black/40 border border-slate-800 group-hover:border-amber-400/30 shrink-0 mt-0.5">
              {sug.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 flex items-center justify-between">
                <span>{sug.label}</span>
                <Sparkles className="w-3 h-3 text-slate-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                {sug.modifierText.replace(/^, /, '')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
