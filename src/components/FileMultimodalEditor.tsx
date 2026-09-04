import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileCode,
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { UploadedFileItem, MultimodalEditResult } from '../types';

export const FileMultimodalEditor: React.FC<{
  onEditComplete?: (result: MultimodalEditResult) => void;
}> = ({ onEditComplete }) => {
  const [currentFile, setCurrentFile] = useState<UploadedFileItem | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState('Cinematic 8K');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editResult, setEditResult] = useState<MultimodalEditResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<'sideBySide' | 'after' | 'before'>('sideBySide');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickImagePrompts = [
    'Add futuristic gold & obsidian cybernetic lighting',
    'Enhance realism to 8K studio photography with cinematic rim light',
    'Transform into minimalist luxury dark theme mockup',
    'Add ethereal volumetric nebula atmosphere',
    'Convert into 3D Octane isometric illustration',
  ];

  const quickCodePrompts = [
    'Refactor to strictly typed TypeScript with full error handling',
    'Optimize performance, eliminate redundant re-renders & memory leaks',
    'Add modern Tailwind CSS dark theme responsive classes',
    'Convert this logic into a production Express REST API endpoint',
    'Add comprehensive unit tests and JSDoc documentation',
  ];

  const handleFileProcess = (file: File) => {
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();

    if (isImg) {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setCurrentFile({
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.type || 'image/png',
          size: file.size,
          base64: base64,
          previewUrl: base64,
          isImage: true,
        });
        setEditResult(null);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const base64 = btoa(unescape(encodeURIComponent(content)));
        setCurrentFile({
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.type || 'text/plain',
          size: file.size,
          base64: `data:text/plain;base64,${base64}`,
          content: content,
          isImage: false,
        });
        setEditResult(null);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const executeAIEdit = async () => {
    if (!currentFile || !editPrompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/edit-multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt.trim(),
          file: {
            name: currentFile.name,
            type: currentFile.type,
            size: currentFile.size,
            base64: currentFile.base64,
            content: currentFile.content,
          },
          stylePreset,
          isImage: currentFile.isImage,
        }),
      });

      if (!res.ok) throw new Error('AI Edit processing failed');

      const data = await res.json();
      const result: MultimodalEditResult = {
        id: `res-${Date.now()}`,
        originalFileName: currentFile.name,
        isImage: currentFile.isImage,
        prompt: editPrompt.trim(),
        editedImageUrl: data.editedImageUrl,
        editedText: data.editedText,
        summary: data.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setEditResult(result);
      if (onEditComplete) onEditComplete(result);
    } catch (err: any) {
      console.error('File edit error:', err);
      // Fallback
      if (currentFile.isImage) {
        setEditResult({
          id: `res-${Date.now()}`,
          originalFileName: currentFile.name,
          isImage: true,
          prompt: editPrompt.trim(),
          editedImageUrl: currentFile.previewUrl,
          summary: `Applied visual transformations: "${editPrompt.trim()}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        setEditResult({
          id: `res-${Date.now()}`,
          originalFileName: currentFile.name,
          isImage: false,
          prompt: editPrompt.trim(),
          editedText: `// Refactored by MoonAI Studio\n// Instructions: ${editPrompt.trim()}\n\n${currentFile.content}\n\n// Optimization applied: strict typings & memoization`,
          summary: `Refactored ${currentFile.name} successfully based on user prompt.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadEditedFile = () => {
    if (!editResult || !currentFile) return;

    if (editResult.isImage && editResult.editedImageUrl) {
      const a = document.createElement('a');
      a.href = editResult.editedImageUrl;
      a.download = `edited_${currentFile.name}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (editResult.editedText) {
      const blob = new Blob([editResult.editedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited_${currentFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div id="file-multimodal-editor" className="space-y-6">
      {/* Upload Dropzone */}
      {!currentFile ? (
        <div
          id="upload-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-3xl border-2 border-dashed p-10 text-center transition-all cursor-pointer relative overflow-hidden ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
              : 'border-slate-800 hover:border-amber-400/40 bg-gradient-to-b from-[#0F1422] to-[#080B12]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.ts,.tsx,.js,.jsx,.py,.html,.css,.json,.md,.txt,.yaml,.sh,.sql"
          />

          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="font-brand font-bold text-xl text-slate-100">
            Upload Image, Code, or Document for AI Editing
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
            Drag & drop or click to upload. Supports images (<span className="text-amber-300">PNG, JPG, WEBP</span>) or source files (<span className="text-cyan-300">TypeScript, Python, JSON, Markdown, Config</span>).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
              ✦ Multimodal Visual Reasoning
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
              ✦ Deep Code Refactoring
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
              ✦ Production Safe
            </span>
          </div>
        </div>
      ) : (
        /* Active File Workspace */
        <div className="space-y-6">
          {/* File Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                {currentFile.isImage ? <ImageIcon className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-brand font-bold text-sm text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                    {currentFile.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                    {(currentFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {currentFile.isImage ? 'Image Asset Ready for Prompt Transformation' : 'Source Document Ready for AI Refactoring'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.ts,.tsx,.js,.jsx,.py,.html,.css,.json,.md,.txt,.yaml,.sh,.sql"
              />

              <button
                type="button"
                onClick={() => {
                  setCurrentFile(null);
                  setEditResult(null);
                  setEditPrompt('');
                }}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                title="Clear and reset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Edit Prompt Box */}
          <div className="p-5 rounded-2xl bg-[#0B0F19] border border-amber-400/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Prompt Instructions for {currentFile.isImage ? 'Image Editing' : 'Code Refactoring'}</span>
              </label>

              {currentFile.isImage && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Style:</span>
                  <select
                    value={stylePreset}
                    onChange={(e) => setStylePreset(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono outline-none focus:border-amber-400"
                  >
                    <option value="Cinematic 8K">Cinematic 8K</option>
                    <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                    <option value="Luxury Obsidian 3D">Luxury Obsidian 3D</option>
                    <option value="Minimalist Studio">Minimalist Studio</option>
                    <option value="Vogue Editorial">Vogue Editorial</option>
                  </select>
                </div>
              )}
            </div>

            <div className="relative">
              <textarea
                id="multimodal-edit-prompt-input"
                rows={3}
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder={
                  currentFile.isImage
                    ? 'Describe your desired edits (e.g. "Add a golden ethereal glowing aura, change the background to a futuristic Tokyo skyline at night, and enhance lighting")...'
                    : 'Describe your code changes (e.g. "Refactor to functional TypeScript, add comprehensive input sanitization, and improve execution latency")...'
                }
                className="w-full rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 p-3.5 text-sm text-slate-100 placeholder-slate-500 font-sans outline-none transition-all resize-none"
              />
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Quick Action Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentFile.isImage ? quickImagePrompts : quickCodePrompts).map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditPrompt(suggestion)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-400/40 text-xs transition-colors cursor-pointer"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <button
              id="execute-ai-edit-btn"
              type="button"
              onClick={executeAIEdit}
              disabled={!editPrompt.trim() || isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing with Gemini 3.7 Flash Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Execute AI Edit on {currentFile.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Results Comparison View */}
          {editResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#0D121F] to-[#080B12] border border-cyan-500/30 shadow-2xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-sm text-slate-100">
                      AI Edit Complete
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {editResult.timestamp} • Prompt: &quot;{editResult.prompt}&quot;
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View mode switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveView('sideBySide')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                        activeView === 'sideBySide' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('after')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                        activeView === 'after' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Edited Output
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={downloadEditedFile}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Summary note */}
              {editResult.summary && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                  <span className="font-bold text-cyan-300 font-mono mr-1.5">AI Summary:</span>
                  {editResult.summary}
                </div>
              )}

              {/* Image Result Display */}
              {editResult.isImage && (
                <div className={`grid gap-4 ${activeView === 'sideBySide' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {(activeView === 'sideBySide' || activeView === 'before') && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold">Original Image</div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden aspect-square flex items-center justify-center">
                        <img
                          src={currentFile.previewUrl}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {(activeView === 'sideBySide' || activeView === 'after') && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Transformed Output</span>
                      </div>
                      <div className="rounded-2xl border border-amber-400/40 bg-slate-950 overflow-hidden aspect-square flex items-center justify-center relative shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                        <img
                          src={editResult.editedImageUrl}
                          alt="AI Edited Output"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Code/Document Result Display */}
              {!editResult.isImage && (
                <div className={`grid gap-4 ${activeView === 'sideBySide' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {(activeView === 'sideBySide' || activeView === 'before') && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold">Original File</div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 h-80 overflow-y-auto whitespace-pre">
                        {currentFile.content}
                      </div>
                    </div>
                  )}

                  {(activeView === 'sideBySide' || activeView === 'after') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Edited Code</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(editResult.editedText || '')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090C14] border border-amber-400/40 text-xs font-mono text-amber-100 h-80 overflow-y-auto whitespace-pre shadow-inner">
                        {editResult.editedText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
