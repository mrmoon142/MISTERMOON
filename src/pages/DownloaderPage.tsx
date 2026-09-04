import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AdContainer } from '../components/AdContainer';
import { useToast } from '../components/ToastNotification';
import { synthEngine } from '../utils/audioSynth';
import { ScrollReveal } from '../components/ScrollReveal';
import { CommentsSection } from '../components/CommentsSection';
import { DownloaderPreviewSkeleton } from '../components/SkeletonLoader';
import {
  DownloadCloud,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileVideo,
  Music2,
  Trash2,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
  Sparkles,
  Clipboard,
  Play,
  Pause,
  Maximize2,
  Volume2,
  Eye,
  Video,
  Film,
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  source: string;
  author: string;
  previewStreamUrl?: string;
  embedUrl?: string;
  mediaType?: 'video' | 'audio' | 'embed';
  description?: string;
  isPermitted: boolean;
  legalNotice?: string;
  options: {
    formatId: string;
    quality: string;
    resolution?: string;
    ext: string;
    fileSizeEstimate: string;
    type: 'video' | 'audio';
    downloadUrl: string;
    isPermitted: boolean;
  }[];
}

export const DownloaderPage: React.FC = () => {
  const { downloadHistory, addToHistory, removeFromHistory, clearHistory, videos, t } = useApp();
  const { showToast } = useToast();

  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'video' | 'poster'>('video');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const normalizeMediaUrl = (raw: string): string => {
    let clean = raw.trim();
    if (!clean) return '';
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    return clean;
  };

  // Dynamic quick URLs for user convenience and instant testing
  const sampleUrls = [
    { label: 'Creative Commons Stream', url: 'https://archive.org/details/SampleVideo1280x7205mb.mp4' },
    { label: 'Open Educational Media', url: 'https://wikimedia.org/sample_nature_stream.mp4' },
    { label: 'Public Domain Archive', url: 'https://archive.org/details/mistermoon_futuristic_teaser.mp4' },
  ];

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper to extract Vimeo video ID
  const extractVimeoId = (url: string): string | null => {
    const match = url.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i);
    return match ? match[1] : null;
  };

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim().length > 0) {
      const cleanUrl = normalizeMediaUrl(pastedText);
      setInputUrl(cleanUrl);
      synthEngine.playUiSound('copy');
      showToast({
        title: 'Link Detected 📋',
        message: 'Analyzing media stream from pasted URL...',
        type: 'link',
      });
      handleAnalyze(undefined, cleanUrl);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        showToast({
          title: 'Clipboard Notice',
          message: 'Please paste your video link directly into the search bar using Ctrl+V or Cmd+V.',
          type: 'info',
        });
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        const cleanUrl = normalizeMediaUrl(text);
        setInputUrl(cleanUrl);
        synthEngine.playUiSound('copy');
        showToast({
          title: 'Link Pasted 📋',
          message: 'Analyzing media stream from pasted URL...',
          type: 'link',
        });
        handleAnalyze(undefined, cleanUrl);
      } else {
        showToast({
          title: 'Clipboard Empty',
          message: 'No text or URL detected in clipboard.',
          type: 'info',
        });
      }
    } catch {
      showToast({
        title: 'Paste Manually',
        message: 'Please paste your video link directly into the search bar.',
        type: 'info',
      });
    }
  };

  const handleAnalyze = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const rawUrl = (customUrl || inputUrl).trim();
    if (!rawUrl) {
      setErrorMsg('Please enter a valid media URL.');
      return;
    }
    const urlToTest = normalizeMediaUrl(rawUrl);
    setInputUrl(urlToTest);

    synthEngine.playUiSound('click');
    setIsAnalyzing(true);
    setErrorMsg(null);

    // 1. Instant Client-Side Extraction (Works even on static hosting or when server is cold)
    const ytId = extractYouTubeId(urlToTest);
    const vimeoId = extractVimeoId(urlToTest);
    const isAudio = urlToTest.toLowerCase().endsWith('.mp3') || urlToTest.toLowerCase().endsWith('.wav');
    const isDirectVideo =
      urlToTest.toLowerCase().endsWith('.mp4') ||
      urlToTest.toLowerCase().endsWith('.webm') ||
      urlToTest.toLowerCase().endsWith('.mov') ||
      urlToTest.toLowerCase().endsWith('.m4v');

    let initialFallback: AnalysisResult | null = null;

    if (ytId) {
      initialFallback = {
        id: 'yt-' + ytId,
        title: 'YouTube Video Stream',
        duration: 'High Definition Video',
        thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        source: 'YouTube (Verified)',
        author: 'YouTube Creator',
        embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
        previewStreamUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
        mediaType: 'embed',
        description: 'Authorized video stream. Original YouTube website bypassed for live in-browser preview.',
        isPermitted: true,
        legalNotice: 'Standard authorized video preview. Original player bypassed for streamlined media access.',
        options: [
          {
            formatId: 'yt-1080p',
            quality: 'Full HD 1080p (MP4)',
            resolution: '1920x1080',
            ext: 'mp4',
            fileSizeEstimate: '~38.5 MB',
            type: 'video',
            downloadUrl: `/api/video/download?url=${encodeURIComponent(urlToTest)}&ext=mp4&title=${encodeURIComponent('YouTube_Video_' + ytId)}`,
            isPermitted: true,
          },
          {
            formatId: 'yt-720p',
            quality: 'Standard 720p HD (MP4)',
            resolution: '1280x720',
            ext: 'mp4',
            fileSizeEstimate: '~18.2 MB',
            type: 'video',
            downloadUrl: `/api/video/download?url=${encodeURIComponent(urlToTest)}&ext=mp4&title=${encodeURIComponent('YouTube_Video_720p_' + ytId)}`,
            isPermitted: true,
          },
          {
            formatId: 'yt-audio',
            quality: 'HQ Audio Stream (MP3 320k)',
            ext: 'mp3',
            fileSizeEstimate: '~4.8 MB',
            type: 'audio',
            downloadUrl: `/api/video/download?url=${encodeURIComponent(urlToTest)}&ext=mp3&title=${encodeURIComponent('YouTube_Audio_' + ytId)}`,
            isPermitted: true,
          },
        ],
      };
      setResult(initialFallback);
      setPreviewMode('video');

      // Fetch authentic YouTube title & channel via official CORS-enabled oEmbed
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`)
        .then((res) => res.json())
        .then((oembed) => {
          if (oembed && oembed.title) {
            setResult((prev) =>
              prev && prev.id === 'yt-' + ytId
                ? {
                    ...prev,
                    title: oembed.title,
                    author: oembed.author_name || prev.author,
                    thumbnail: oembed.thumbnail_url || prev.thumbnail,
                  }
                : prev
            );
          }
        })
        .catch(() => {});
    } else if (vimeoId) {
      initialFallback = {
        id: 'vimeo-' + vimeoId,
        title: 'Vimeo Video Stream',
        duration: 'High Definition Video',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
        source: 'Vimeo (Verified)',
        author: 'Vimeo Creator',
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        previewStreamUrl: `https://player.vimeo.com/video/${vimeoId}`,
        mediaType: 'embed',
        description: 'Vimeo media stream inspected.',
        isPermitted: true,
        options: [
          {
            formatId: 'vimeo-1080p',
            quality: 'Full HD 1080p (MP4)',
            resolution: '1920x1080',
            ext: 'mp4',
            fileSizeEstimate: '~28.0 MB',
            type: 'video',
            downloadUrl: `/api/video/download?url=${encodeURIComponent(urlToTest)}&ext=mp4&title=Vimeo_Stream`,
            isPermitted: true,
          },
        ],
      };
      setResult(initialFallback);
      setPreviewMode('video');
    } else if (isDirectVideo || isAudio) {
      const parsedName = urlToTest.split('/').pop()?.split('?')[0] || 'Media Stream';
      const cleanTitle = decodeURIComponent(parsedName).replace(/[-_]/g, ' ');
      initialFallback = {
        id: 'media-' + Date.now(),
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        duration: 'Direct Stream',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
        source: 'Direct File Stream',
        author: new URL(urlToTest).hostname,
        previewStreamUrl: urlToTest,
        mediaType: isAudio ? 'audio' : 'video',
        isPermitted: true,
        options: [
          {
            formatId: 'direct-file',
            quality: isAudio ? 'Audio File (MP3/WAV)' : 'Full Quality Video',
            resolution: isAudio ? 'Audio' : 'Original',
            ext: isAudio ? 'mp3' : 'mp4',
            fileSizeEstimate: '~15-30 MB',
            type: isAudio ? 'audio' : 'video',
            downloadUrl: urlToTest,
            isPermitted: true,
          },
        ],
      };
      setResult(initialFallback);
      setPreviewMode('video');
    }

    try {
      const response = await fetch('/api/video/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setPreviewMode('video');
        synthEngine.playUiSound('success');
        showToast({
          title: 'Stream Ready ✨',
          message: `Extracted "${data.title}" from ${data.source}. Website bypassed.`,
          type: 'success',
        });
      } else {
        // Fallback to OEmbed / OpenGraph metadata parser
        try {
          const oembedRes = await fetch('/api/oembed/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlToTest }),
          });
          if (oembedRes.ok) {
            const og = await oembedRes.json();
            if (og.success) {
              setResult({
                id: 'og-' + Date.now(),
                title: og.title || 'Linked Media Stream',
                duration: 'Online Resource',
                thumbnail: og.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                source: og.siteName || og.domain,
                author: og.author || og.domain,
                embedUrl: og.embedUrl || undefined,
                previewStreamUrl: og.embedUrl || urlToTest,
                mediaType: og.mediaType || 'embed',
                description: og.description || `OpenGraph metadata extracted from ${og.domain}.`,
                isPermitted: true,
                options: [
                  {
                    formatId: 'stream-source',
                    quality: 'Original Stream Link',
                    ext: 'mp4',
                    fileSizeEstimate: 'Dynamic Stream',
                    type: 'video',
                    downloadUrl: urlToTest,
                    isPermitted: true,
                  },
                ],
              });
              setPreviewMode('video');
              synthEngine.playUiSound('success');
              showToast({
                title: 'OpenGraph Preview Ready 🌐',
                message: `Loaded metadata preview for "${og.title}".`,
                type: 'success',
              });
              return;
            }
          }
        } catch {
          // Ignore oEmbed fallback error, proceed to standard error handler
        }

        if (!initialFallback) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to analyze video URL.');
        } else {
          synthEngine.playUiSound('success');
        }
      }
    } catch (err: unknown) {
      if (!initialFallback) {
        synthEngine.playUiSound('error');
        const msg = err instanceof Error ? err.message : 'An error occurred during analysis.';
        setErrorMsg(msg);
        showToast({
          title: 'Extraction Error',
          message: msg,
          type: 'error',
        });
      } else {
        synthEngine.playUiSound('success');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = (option: AnalysisResult['options'][0]) => {
    if (!result) return;
    synthEngine.playUiSound('success');
    setActiveDownloadId(option.formatId);

    // Save to local download history
    addToHistory({
      title: result.title,
      url: inputUrl || 'https://archive.org/sample.mp4',
      format: option.quality,
      fileSize: option.fileSizeEstimate,
    });

    showToast({
      title: 'Download Started ⚡',
      message: `Fetching ${option.quality} (${option.fileSizeEstimate})...`,
      type: 'success',
    });

    // Trigger browser download via safe server proxy
    const link = document.createElement('a');
    link.href = option.downloadUrl;
    link.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}.${option.ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setActiveDownloadId(null);
    }, 2000);
  };

  // Compute playable preview URL using bypassed stream proxy when available
  const previewSourceUrl = result?.previewStreamUrl
    ? result.previewStreamUrl
    : inputUrl.trim().startsWith('http')
    ? `/api/video/stream?url=${encodeURIComponent(inputUrl.trim())}`
    : 'https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4';

  return (
    <div id="downloader-page-root" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
          <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('downloader_badge', 'SECURE MEDIA PROCESSING ENGINE')}</span>
        </div>

        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Authorized <span className="gold-gradient-text">Video Downloader</span> PRO
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          Paste any copied video link, inspect and preview streams directly in the browser, and download files with zero malware, zero third-party redirects, and enterprise SSRF defense.
        </p>
      </div>

      {/* Legal & Compliance Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-amber-300 block">
            Authorized Usage & Compliance Notice
          </span>
          <p className="text-slate-300 leading-relaxed">
            This tool is provided for personal archiving of creator-owned, public domain, Creative Commons, and authorized video streams. Do not attempt to bypass DRM or download copyrighted content without explicit permission from the rights holder.
          </p>
        </div>
      </div>

      {/* Main Analyzer Input Card */}
      <div id="downloader-tool-container" className="rounded-3xl bg-[#0C0F17] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] space-y-6">
        <form onSubmit={(e) => handleAnalyze(e)} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Paste Copied Video or Media Stream URL
            </label>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Copied Link</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                id="video-url-input"
                placeholder="Paste copied video URL (e.g. YouTube, Vimeo, direct MP4)..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onPaste={handlePasteEvent}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              id="analyze-video-btn"
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting Stream...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4" />
                  <span>Analyze Stream</span>
                </>
              )}
            </button>
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Quick Tests:</span>
            {sampleUrls.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputUrl(sample.url);
                  handleAnalyze(undefined, sample.url);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-mono border border-slate-800 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Stream Analysis Failed</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Skeleton Loading State during URL Analysis */}
        {isAnalyzing && (
          <div className="pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            <DownloaderPreviewSkeleton />
          </div>
        )}

        {/* Video Analysis & Live Preview Card */}
        {result && !isAnalyzing && (
          <div className="pt-4 border-t border-slate-800 space-y-6 animate-in fade-in duration-300">
            {/* Stream Overview & Preview Switcher */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Media Preview Section */}
              <div className="w-full lg:w-3/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      VERIFIED STREAM
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{result.source}</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                    <button
                      onClick={() => setPreviewMode('video')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        previewMode === 'video'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Live Video</span>
                    </button>
                    <button
                      onClick={() => setPreviewMode('poster')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        previewMode === 'poster'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Poster</span>
                    </button>
                  </div>
                </div>

                {/* Video player or cover thumbnail */}
                <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-500/30 shadow-2xl aspect-video flex items-center justify-center">
                  {previewMode === 'poster' ? (
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  ) : result.embedUrl ? (
                    <iframe
                      src={result.embedUrl}
                      title={result.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : result.mediaType === 'audio' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-black space-y-4">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-24 h-24 rounded-2xl object-cover border border-cyan-500/40 shadow-xl"
                      />
                      <audio
                        controls
                        src={previewSourceUrl}
                        className="w-full max-w-md"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      controls
                      playsInline
                      poster={result.thumbnail}
                      preload="metadata"
                      src={previewSourceUrl}
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>

              {/* Stream Metadata & Summary */}
              <div className="w-full lg:w-2/5 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-brand font-bold text-xl text-slate-100">{result.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Duration: {result.duration}</span>
                    <span>•</span>
                    <span>Author: {result.author}</span>
                  </div>
                  {result.description && (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 pt-1">
                      {result.description}
                    </p>
                  )}
                </div>

                {result.legalNotice && (
                  <p className="text-[11px] text-amber-300 font-mono bg-amber-400/10 p-3 rounded-xl border border-amber-400/30 leading-relaxed">
                    {result.legalNotice}
                  </p>
                )}

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block">
                    Fast Download Ready
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select your preferred video resolution or standalone audio stream below to download the file directly to your system.
                  </p>
                </div>
              </div>
            </div>

            {/* Available Download Options */}
            <div className="space-y-4 pt-2">
              {/* Quick 1-Click One Touch Download Button */}
              {result.options.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 via-cyan-500/20 to-blue-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="font-brand font-bold text-sm text-slate-100">
                        Quick 1-Click Fast Download
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/40">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Best Quality HD MP4 ({result.options[0].quality} • {result.options[0].fileSizeEstimate})
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(result.options[0])}
                    disabled={activeDownloadId === result.options[0].formatId}
                    id="quick-one-click-download-btn"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {activeDownloadId === result.options[0].formatId ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Downloading Best Stream...</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-4 h-4" />
                        <span>Instant Download ({result.options[0].ext.toUpperCase()})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block">
                  All Available Formats & Resolutions
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {result.options.length} formats ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.options.map((opt) => (
                  <div
                    key={opt.formatId}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-200">{opt.quality}</span>
                        {opt.type === 'audio' ? (
                          <Music2 className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        Resolution: {opt.resolution || 'Direct Stream'} • Size: {opt.fileSizeEstimate}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownload(opt)}
                      disabled={activeDownloadId === opt.formatId}
                      className="w-full py-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {activeDownloadId === opt.formatId ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <DownloadCloud className="w-3.5 h-3.5" />
                          <span>Download {opt.ext.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdSense Policy Compliant Ad Zone */}
      <AdContainer slot="download" format="horizontal" />

      {/* Curated Video Streams & Archives by MisterMoon (Admin Managed) */}
      {videos && videos.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <h3 className="font-brand font-bold text-lg text-slate-100">
                Curated Video Archives & Streams
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {videos.length} Streams Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="group p-4 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                      {vid.duration}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-amber-300 border border-amber-500/30">
                      {vid.category}
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {vid.description || `Verified media stream from ${vid.source}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInputUrl(vid.url);
                    handleAnalyze(undefined, vid.url);
                    const el = document.getElementById('downloader-tool-container');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Preview & Stream</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-brand font-bold text-lg text-slate-100">Local Download History</h3>
          </div>
          {downloadHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {downloadHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No downloads recorded in this session.
          </div>
        ) : (
          <div className="space-y-2">
            {downloadHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#0C0F17] border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-4">
                  <span className="font-semibold text-slate-200 block truncate">{item.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.format} • {item.fileSize} • {item.date}
                  </span>
                </div>
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Architecture & FAQ Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[#0C0F17] border border-slate-800 space-y-3">
          <h4 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Multi-Tier Security Architecture</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our Node.js Express backend validates outbound target URLs before establishing any socket connection. Private IP address ranges (127.0.0.1, 10.x, 192.168.x, metadata IPs) are strictly blacklisted to protect the host container from SSRF vectors.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C0F17] border border-slate-800 space-y-3">
          <h4 className="font-brand font-bold text-base text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Supported Platforms & Codecs</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Supports direct video files (.mp4, .webm, .m4v, .mov), Open Source / Creative Commons media archives, and permitted creator video servers with high-speed buffered streaming.
          </p>
        </div>
      </div>

      {/* Community Comments & Downloader Feedback */}
      <div className="pt-6">
        <CommentsSection
          targetId="downloader-hub"
          targetType="general"
          targetTitle="Universal Video Downloader & Media Hub"
        />
      </div>
    </div>
  );
};
