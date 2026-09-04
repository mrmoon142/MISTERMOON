import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { synthEngine } from '../utils/audioSynth';
import {
  Bot,
  Mic,
  MicOff,
  Sparkles,
  X,
  Send,
  Volume2,
  VolumeX,
  ExternalLink,
  Radio,
  RotateCcw,
  Play,
  Pause,
  Square,
  Sliders,
  Check,
  Headphones,
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Browser SpeechRecognition interface declaration
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

// Cleans markdown and syntax for natural, fluent speech read-back
function cleanTextForSpeech(text: string): string {
  return text
    // Replace markdown links [label](url) with label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks with clean note
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers #, ##, etc.
    .replace(/^#+\s+/gm, '')
    // Remove bold/italics asterisks or underscores
    .replace(/[*_~]/g, '')
    // Replace bullet points or list markers with gentle pauses
    .replace(/^\s*[-*+]\s+/gm, ', ')
    .replace(/^\s*\d+\.\s+/gm, ', ')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, 'link')
    // Normalize extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Split into natural sentence chunks to prevent Chrome/Safari Web Speech timeout
function splitIntoSentences(text: string): string[] {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];
  const matches = clean.match(/[^.!?;\n]+[.!?;\n]+|[^.!?;\n]+$/g);
  if (!matches) return [clean];
  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

// Audio Equalizer Waveform Animation Component
const AudioWaveform: React.FC<{ isPaused?: boolean; size?: 'sm' | 'md' }> = ({
  isPaused,
  size = 'sm',
}) => {
  return (
    <div
      className={`flex items-center gap-0.5 ${size === 'md' ? 'h-4' : 'h-3'}`}
      title={isPaused ? 'Speech Paused' : 'Synthesizer Audio Active'}
    >
      {[0.5, 1.0, 0.4, 0.9, 0.65].map((scale, i) => (
        <span
          key={i}
          className={`w-0.5 rounded-full bg-gradient-to-t from-amber-400 via-amber-300 to-yellow-200 transition-all ${
            isPaused ? 'h-1 opacity-50' : 'animate-pulse'
          }`}
          style={{
            height: isPaused ? '3px' : `${Math.max(3, scale * (size === 'md' ? 15 : 11))}px`,
            animationDuration: `${0.35 + i * 0.12}s`,
            animationDelay: `${i * 0.07}s`,
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
};

export const FloatingAIAssistant: React.FC = () => {
  const { currentPage, setCurrentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [handsFreeMode, setHandsFreeMode] = useState(true);
  const [speechOutputEnabled, setSpeechOutputEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Web Speech API Text-to-Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am your hands-free MisterMoon AI Voice Assistant. Tap the microphone or say "Go to projects", "Who is MisterMoon", or ask any question! I can read all responses back to you.',
      timestamp: 'Now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Speech Queue references for robust multi-sentence playback
  const utteranceQueueRef = useRef<string[]>([]);
  const currentSentenceIdxRef = useRef<number>(0);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  // 1. Initialize Web Speech API Speech Synthesis & Voice List
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTtsSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          // Filter to preferred voices (English first, or all)
          setVoices(available);

          setSelectedVoiceURI((prev) => {
            if (prev && available.some((v) => v.voiceURI === prev)) return prev;

            // Automatically pick the most natural English voice
            const highQualityEn = available.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Natural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Neural') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('Premium'))
            );
            const standardEn = available.find((v) => v.lang.startsWith('en'));
            const fallback = highQualityEn || standardEn || available[0];
            return fallback ? fallback.voiceURI : '';
          });
        }
      } catch (err) {
        console.warn('[Web Speech TTS] Failed to retrieve system voices:', err);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      stopSpeaking();
    };
  }, []);

  // 2. Initialize Speech Recognition (Speech-to-Text)
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        synthEngine.playUiSound('click');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalChunk) {
          setTranscript((prev) => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
          setInterimText('');

          // In hands-free mode, trigger query submission after 1.4s of silence
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            handleVoiceCommandTrigger(finalChunk.trim());
          }, 1400);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // Auto scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Stop listening & speaking when assistant closes
  const toggleOpen = () => {
    synthEngine.playUiSound('click');
    if (isOpen) {
      if (isListening) stopListening();
      if (isSpeaking) stopSpeaking();
    }
    setIsOpen(!isOpen);
  };

  const startListening = () => {
    if (!speechSupported) return;
    // Stop any speech playback so AI voice does not bleed into mic input
    stopSpeaking();

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      // already active
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
    setInterimText('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Web Speech API Core: Stop active synthesis
  const stopSpeaking = () => {
    isSpeakingRef.current = false;
    utteranceQueueRef.current = [];
    currentSentenceIdxRef.current = 0;
    currentUtteranceRef.current = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    setIsSpeaking(false);
    setIsSpeechPaused(false);
    setSpeakingMessageId(null);
  };

  // Web Speech API Core: Pause/Resume active synthesis
  const togglePauseSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeechPaused) {
      window.speechSynthesis.resume();
      setIsSpeechPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsSpeechPaused(true);
    }
  };

  // Web Speech API Core: Multi-Sentence Chained Playback
  const playNextSentence = () => {
    if (!isSpeakingRef.current) return;

    if (currentSentenceIdxRef.current >= utteranceQueueRef.current.length) {
      // Finished all sentences
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setSpeakingMessageId(null);
      setIsSpeechPaused(false);
      currentUtteranceRef.current = null;

      // In hands-free mode, resume listening for user's next question!
      if (handsFreeMode && isOpen) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
      return;
    }

    const sentence = utteranceQueueRef.current[currentSentenceIdxRef.current];
    try {
      const utterance = new SpeechSynthesisUtterance(sentence);
      currentUtteranceRef.current = utterance;

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

      // Assign selected voice
      if (selectedVoiceURI && voices.length > 0) {
        const found = voices.find((v) => v.voiceURI === selectedVoiceURI);
        if (found) utterance.voice = found;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsSpeechPaused(false);
      };

      utterance.onend = () => {
        currentSentenceIdxRef.current++;
        playNextSentence();
      };

      utterance.onerror = (event: any) => {
        console.warn('[Web Speech TTS] Utterance error:', event.error);
        if (event.error === 'canceled' || event.error === 'interrupted') {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          setSpeakingMessageId(null);
        } else {
          currentSentenceIdxRef.current++;
          playNextSentence();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[Web Speech TTS] Speak error:', e);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setSpeakingMessageId(null);
    }
  };

  // Speak response back using browser speech synthesis
  const speakText = (text: string, messageId?: string) => {
    if (!speechOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel existing utterance immediately
    stopSpeaking();

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) return;

    utteranceQueueRef.current = sentences;
    currentSentenceIdxRef.current = 0;
    isSpeakingRef.current = true;
    setSpeakingMessageId(messageId || null);
    setIsSpeaking(true);
    setIsSpeechPaused(false);

    playNextSentence();
  };

  // Quick voice tester
  const testVoiceSample = () => {
    speakText(
      'MisterMoon AI speech synthesis calibrated. High velocity AI systems online.',
      'test-sample'
    );
  };

  // Process voice command or prompt text
  const handleVoiceCommandTrigger = async (rawQuery?: string) => {
    const query = (rawQuery || transcript || interimText).trim();
    if (!query || isThinking) return;

    setTranscript('');
    setInterimText('');
    stopListening();
    stopSpeaking();

    const userMsg: VoiceMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    synthEngine.playUiSound('click');

    // 1. Check Voice Navigation Shortcuts
    const lower = query.toLowerCase();

    if (lower.includes('project') || lower.includes('portfolio') || lower.includes('show projects')) {
      setCurrentPage('projects');
      const reply = "Navigating you to MisterMoon's Projects and Innovation Portfolio.";
      addAssistantReply(reply);
      return;
    }

    if (
      lower.includes('download') ||
      lower.includes('video') ||
      lower.includes('downloader') ||
      lower.includes('stream')
    ) {
      setCurrentPage('downloader');
      const reply = 'Opening the Authorized Video Downloader and Stream Inspector for you.';
      addAssistantReply(reply);
      return;
    }

    if (
      lower.includes('blog') ||
      lower.includes('article') ||
      lower.includes('insights') ||
      lower.includes('essay')
    ) {
      setCurrentPage('blog');
      const reply = 'Opening Insights and Publications by MisterMoon.';
      addAssistantReply(reply);
      return;
    }

    if (lower.includes('app') || lower.includes('software') || lower.includes('tools')) {
      setCurrentPage('apps');
      const reply = 'Switching to the Software Ecosystem and published digital tools.';
      addAssistantReply(reply);
      return;
    }

    if (
      lower.includes('about') ||
      lower.includes('who is mistermoon') ||
      lower.includes('miracle') ||
      lower.includes('bio')
    ) {
      setCurrentPage('about');
      const reply =
        'Miracle Chibueze Dike (MisterMoon) is a self-taught AI Vibe Coder, Solopreneur, and Product Builder based in Johannesburg, South Africa. He merges multidisciplinary grit with high-velocity AI engineering to ship transformative products.';
      addAssistantReply(reply);
      return;
    }

    if (
      lower.includes('contact') ||
      lower.includes('hire') ||
      lower.includes('email') ||
      lower.includes('book')
    ) {
      setCurrentPage('contact');
      const reply = 'Taking you to the Contact and Collaboration Dispatch console.';
      addAssistantReply(reply);
      return;
    }

    if (lower.includes('studio') || lower.includes('full page') || lower.includes('editor')) {
      setCurrentPage('ai-studio');
      const reply = 'Launching the comprehensive Full Page AI Studio.';
      addAssistantReply(reply);
      return;
    }

    // 2. Query Server API or Fallback AI
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        addAssistantReply(data.response || data.text || 'I have processed your query.');
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Smart Fallback Response
      const fallbackReply = generateSmartFallbackReply(query);
      addAssistantReply(fallbackReply);
    }
  };

  const addAssistantReply = (text: string) => {
    setIsThinking(false);
    const newId = 'ast-' + Date.now();
    const assistantMsg: VoiceMessage = {
      id: newId,
      sender: 'assistant',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    synthEngine.playUiSound('success');

    // Automatically read response back using Web Speech API if enabled
    if (speechOutputEnabled) {
      speakText(text, newId);
    }
  };

  // Local knowledge-base fallback when server is building or on static host
  const generateSmartFallbackReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('vibe coding')) {
      return 'AI Vibe Coding is the practice of orchestrating LLM prompt workflows with precision, allowing solopreneurs to ship full-stack web applications at 10x velocity while maintaining architectural integrity.';
    }
    if (q.includes('downloader')) {
      return 'The Video Downloader on mistermoon.com.ng allows you to paste video links, preview streams live without website ads, and download authorized audio or video files directly.';
    }
    if (q.includes('admin')) {
      return 'The Admin Command Center can be accessed by pressing Ctrl+Alt+A or visiting the admin portal to manage projects, articles, and applications.';
    }
    return `MisterMoon AI received: "${query}". You can ask me to navigate pages, inspect media, or explain Miracle Dike's AI and software systems!`;
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div id="floating-ai-assistant-container" className="fixed bottom-24 right-4 sm:right-6 z-40">
        <motion.button
          id="ask-ai-floating-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className={`relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.35)] border transition-all cursor-pointer ${
            isOpen
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
              : isSpeaking
              ? 'bg-gradient-to-r from-[#141A29] via-[#1C1608] to-[#0A0D14] text-amber-300 border-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.5)]'
              : 'bg-gradient-to-r from-[#0E131F] via-[#141A29] to-[#0A0D14] text-amber-300 border-amber-400/50 hover:border-amber-400'
          }`}
          aria-label="Open Voice AI Assistant"
          title="Hands-Free Voice AI Copilot with Web Speech API"
        >
          {/* Animated Mic, Speaker & Bot Icon */}
          <div className="relative flex items-center justify-center">
            {isListening ? (
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <Mic className="relative w-5 h-5 text-rose-500 animate-pulse" />
              </span>
            ) : isSpeaking ? (
              <div className="flex items-center gap-1">
                <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            ) : (
              <Bot className={`w-5 h-5 ${isOpen ? 'text-slate-950' : 'text-amber-400'}`} />
            )}
            {!isListening && !isSpeaking && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <span className="font-mono text-xs tracking-wider uppercase font-semibold flex items-center gap-1.5">
            {isOpen
              ? 'Voice Copilot'
              : isListening
              ? 'Listening...'
              : isSpeaking
              ? 'Reading AI...'
              : 'Voice AI'}
            {isSpeaking && !isOpen && <AudioWaveform isPaused={isSpeechPaused} />}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono border flex items-center gap-1 ${
              isOpen
                ? 'bg-slate-950/20 text-slate-950 border-slate-950/30'
                : isSpeaking
                ? 'bg-amber-400/30 text-amber-200 border-amber-400/60'
                : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
            }`}
          >
            {isSpeaking ? (
              <Headphones className="w-2.5 h-2.5 text-amber-400 animate-bounce" />
            ) : (
              <Mic className="w-2.5 h-2.5 text-amber-400" />
            )}
            <span>{isSpeaking ? 'Speaking' : 'Hands-Free'}</span>
          </span>
        </motion.button>
      </div>

      {/* Expandable Voice AI Assistant Drawer / Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="voice-ai-assistant-modal"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-40 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-h-[80vh] flex flex-col rounded-3xl bg-[#0B0E17]/95 backdrop-blur-xl border border-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.25)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-brand font-bold text-xs text-slate-100 tracking-wide">
                      MisterMoon Voice AI
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono border border-amber-400/30">
                      TTS READY
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    {isListening ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Listening to your voice...
                      </span>
                    ) : isSpeaking ? (
                      <span className="text-amber-300 flex items-center gap-1.5">
                        <AudioWaveform isPaused={isSpeechPaused} />
                        {isSpeechPaused ? 'Speech Paused' : 'Reading response aloud...'}
                      </span>
                    ) : (
                      <span>Web Speech & Synthesizer Active</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Speech Settings Drawer Toggle */}
                {ttsSupported && (
                  <button
                    onClick={() => setShowSpeechSettings(!showSpeechSettings)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      showSpeechSettings
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="TTS Voice & Speed Settings"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Global Speech output toggle */}
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setSpeechOutputEnabled(!speechOutputEnabled);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    speechOutputEnabled
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
                      : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:text-slate-300'
                  }`}
                  title={speechOutputEnabled ? 'Mute AI Voice Output' : 'Enable AI Voice Output'}
                >
                  {speechOutputEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Open full studio page */}
                <button
                  onClick={() => {
                    setCurrentPage('ai-studio');
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Open Full Page AI Studio"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Active Speech Control Bar (When Speaking) */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border-b border-amber-400/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <AudioWaveform isPaused={isSpeechPaused} size="md" />
                  <span className="text-[11px] font-mono text-amber-300 font-medium">
                    {isSpeechPaused ? 'Playback Paused' : 'Reading Response...'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePauseSpeaking}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isSpeechPaused ? (
                      <>
                        <Play className="w-2.5 h-2.5 fill-amber-300" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-2.5 h-2.5" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="px-2 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Square className="w-2.5 h-2.5 fill-rose-300" />
                    <span>Stop</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Speech Settings Accordion Panel */}
            <AnimatePresence>
              {showSpeechSettings && ttsSupported && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-slate-900/95 border-b border-slate-800 space-y-3 text-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <Sliders className="w-3 h-3" />
                      Web Speech Synthesis Tuning
                    </span>
                    <button
                      type="button"
                      onClick={testVoiceSample}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-amber-300" />
                      <span>Test Voice</span>
                    </button>
                  </div>

                  {/* Voice Selector Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono block">
                      Synthesizer Voice ({voices.length} detected):
                    </label>
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-400 focus:outline-none font-sans cursor-pointer"
                    >
                      {voices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang}) {v.default ? '★' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Speech Rate:</span>
                    <div className="flex items-center gap-1">
                      {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setSpeechRate(rate)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                            speechRate === rate
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pitch Selector */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Pitch:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { label: 'Deep', val: 0.85 },
                        { label: 'Natural', val: 1.0 },
                        { label: 'Bright', val: 1.15 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setSpeechPitch(item.val)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                            speechPitch === item.val
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-read Toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-[10px] text-slate-300 font-mono">
                      Auto-read new AI responses:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpeechOutputEnabled(!speechOutputEnabled)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1 cursor-pointer transition-colors ${
                        speechOutputEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {speechOutputEnabled && <Check className="w-2.5 h-2.5" />}
                      <span>{speechOutputEnabled ? 'ENABLED' : 'MUTED'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs max-h-60 sm:max-h-72">
              {messages.map((m) => {
                const isThisMessageSpeaking = speakingMessageId === m.id && isSpeaking;

                return (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed transition-all ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-medium rounded-br-none shadow-md'
                          : isThisMessageSpeaking
                          ? 'bg-slate-900 text-slate-100 border-2 border-amber-400/80 rounded-bl-none font-sans shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none font-sans shadow-inner'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Footer: Timestamp and Web Speech API Read-Aloud Controls */}
                      <div className="mt-2 pt-1.5 flex items-center justify-between border-t border-slate-800/60 text-[9px] font-mono">
                        <span className={m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'}>
                          {m.timestamp}
                        </span>

                        {m.sender === 'assistant' && ttsSupported && (
                          <div className="flex items-center gap-1.5 ml-2">
                            {isThisMessageSpeaking ? (
                              <div className="flex items-center gap-1.5">
                                <AudioWaveform isPaused={isSpeechPaused} />
                                <button
                                  type="button"
                                  onClick={togglePauseSpeaking}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                                  title={isSpeechPaused ? 'Resume reading' : 'Pause speech'}
                                >
                                  {isSpeechPaused ? (
                                    <Play className="w-2.5 h-2.5 fill-amber-300" />
                                  ) : (
                                    <Pause className="w-2.5 h-2.5" />
                                  )}
                                  <span>{isSpeechPaused ? 'Resume' : 'Pause'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={stopSpeaking}
                                  className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 cursor-pointer transition-colors"
                                  title="Stop reading"
                                >
                                  <Square className="w-2.5 h-2.5 fill-rose-300" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => speakText(m.text, m.id)}
                                className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                                title="Read this response aloud using Web Speech API"
                              >
                                <Volume2 className="w-2.5 h-2.5 text-amber-400" />
                                <span>Read Aloud</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Interim Real-time Transcription Stream */}
              {(interimText || (isListening && !transcript)) && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2 bg-amber-400/20 border border-amber-400/40 text-amber-200 font-mono text-[11px] animate-pulse">
                    <span>{interimText || 'Listening for your voice...'}</span>
                  </div>
                </div>
              )}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-3.5 py-2 bg-slate-900 border border-amber-400/30 text-amber-300 font-mono text-[11px] flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>MisterMoon AI is reasoning...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Live Hands-Free Control Bar */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2.5">
              {/* Voice-to-Text Action Center */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <button
                    onClick={() => setHandsFreeMode(!handsFreeMode)}
                    className={`px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer transition-colors ${
                      handsFreeMode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Hands-Free Auto-Send: {handsFreeMode ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {transcript && (
                  <button
                    onClick={() => setTranscript('')}
                    className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Main Microphone Button & Input Bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="voice-ai-mic-btn"
                  onClick={toggleListening}
                  className={`relative p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  }`}
                  aria-label={isListening ? 'Stop Listening' : 'Speak to Voice Assistant'}
                  title={isListening ? 'Listening... Tap to pause' : 'Tap to speak hands-free'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Text or Voice Input Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="voice-ai-text-input"
                    value={transcript || interimText}
                    onChange={(e) => setTranscript(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVoiceCommandTrigger();
                      }
                    }}
                    placeholder={
                      isListening
                        ? 'Listening to speech...'
                        : 'Speak hands-free or type query...'
                    }
                    className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none font-sans"
                  />

                  {(transcript || interimText) && (
                    <button
                      type="button"
                      onClick={() => handleVoiceCommandTrigger()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Voice Prompt Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {[
                  { label: '🚀 Projects', prompt: 'Show me featured projects' },
                  { label: '⚡ Downloader', prompt: 'Open video downloader' },
                  { label: '👤 Who is MisterMoon', prompt: 'Who is MisterMoon?' },
                  { label: '✍️ Insights', prompt: 'Read latest articles' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVoiceCommandTrigger(item.prompt)}
                    className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

