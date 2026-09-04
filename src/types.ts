export type PageTab =
  | 'home'
  | 'about'
  | 'projects'
  | 'apps'
  | 'downloader'
  | 'ai-studio'
  | 'blog'
  | 'contact'
  | 'admin'
  | 'legal-privacy'
  | 'legal-terms'
  | 'legal-cookies'
  | 'not-found';

export type LanguageCode =
  | 'en'
  | 'fr'
  | 'es'
  | 'pt'
  | 'de'
  | 'ar'
  | 'zh'
  | 'sw'
  | 'ig'
  | 'yo';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export type ProjectCategory =
  | 'AI Projects'
  | 'Web Apps'
  | 'Mobile Apps'
  | 'Solopreneur Tools'
  | 'Web4 & Cryptography'
  | 'Digital Platforms';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSec?: number;
  coverUrl: string;
  audioUrl?: string;
  genre: string;
  year?: number;
  featured?: boolean;
  releaseDate?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  isPopular?: boolean;
  isSingle?: boolean;
  bpm?: number;
  key?: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  coverUrl: string;
  trackCount: number;
  genre: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  type?: string;
  description?: string;
  tracks?: (string | MusicTrack)[] | any;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  source: string;
  duration: string;
  thumbnail: string;
  category: string;
  description?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  category: string;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  imageUrl: string;
  technologies: string[];
  status: 'Live' | 'Beta' | 'In Development' | 'Concept';
  features: string[];
  linkUrl: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  screenshots: string[];
  features: string[];
  platforms: ('Android' | 'iOS' | 'Web')[];
  status: 'Live' | 'Beta' | 'Coming Soon' | 'In Development';
  version: string;
  rating?: number;
  downloadUrl: string;
  webUrl?: string;
  badge?: string;
}

export interface CommentItem {
  id: string;
  targetId: string; // ID or slug of the blog post, project, or app
  targetType: 'blog' | 'project' | 'app' | 'general';
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  avatarSeed?: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  parentId?: string | null; // For nested reply threads
  replies?: CommentItem[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  category:
    | 'Technology'
    | 'Tech'
    | 'AI'
    | 'Web4'
    | 'Apps'
    | 'Web Development'
    | 'Entrepreneurship'
    | 'Prompt Engineering'
    | 'Tutorials'
    | (string & {});
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface VideoProviderCapabilities {
  canEmbed: boolean;
  canStream: boolean;
  canDownload: boolean;
  supportsCaptions: boolean;
  supportsLive: boolean;
  supportsMetadata: boolean;
  supportsTranslation: boolean;
}

export type PlaybackAudioMode = 'ORIGINAL' | 'AI DUB' | 'SUBTITLES';

export interface TranslationSegment {
  id: string;
  startTime: number;
  endTime: number;
  speakerId: string;
  speakerName?: string;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  audioDuration?: number;
  confidence?: number;
}

export interface VideoTranscript {
  segments: TranslationSegment[];
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  isAiGenerated: boolean;
}

export interface DownloadJob {
  id: string;
  title: string;
  sourceUrl: string;
  resolution: string;
  format: string;
  quality: string;
  status: 'QUEUED' | 'PROCESSING' | 'ENCODING' | 'READY' | 'FAILED' | 'EXPIRED';
  progress: number;
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
  fileSize: string;
  dubbedLanguage?: string;
}

export interface VideoDownloadOption {
  formatId: string;
  quality: string;
  resolution?: string;
  ext: string;
  fileSizeEstimate: string;
  type: 'video' | 'audio' | 'subtitle';
  downloadUrl: string;
  isPermitted: boolean;
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  duration: string;
  thumbnail: string;
  source: string;
  author: string;
  authorAvatar?: string;
  isPermitted: boolean;
  legalNotice?: string;
  provider: string;
  capabilities: VideoProviderCapabilities;
  detectedLanguage?: string;
  isLive?: boolean;
  options: VideoDownloadOption[];
  transcript?: VideoTranscript;
}

export interface DownloadHistoryItem {
  id: string;
  url: string;
  title: string;
  source?: string;
  thumbnail?: string;
  date: string;
  fileType?: string;
  resolution?: string;
  format?: string;
  fileSize?: string;
  downloadUrl?: string;
  translatedLanguage?: string;
  mode?: string;
}

export interface AdSenseConfig {
  clientId: string;
  homeSlot: string;
  downloadSlot: string;
  blogSlot: string;
  enabled: boolean;
}

export interface SiteSettings {
  brandName: string;
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutBio: string;
  vision: string;
  mission: string;
  skills: { name: string; level: number; category: string }[];
  journey: { year: string; title: string; description: string }[];
  interests: string[];
  socialLinks: { platform: string; url: string; icon: string }[];
  adsense: AdSenseConfig;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  decided: boolean;
}

export interface UserSubscription {
  isPro: boolean;
  tier: 'free' | 'monthly' | 'yearly' | 'founder';
  email?: string;
  paymentReference?: string;
  uniqueCode?: string;
  activatedAt?: string;
  expiresAt?: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  previewUrl?: string;
  isImage: boolean;
  content?: string;
}

export interface MultimodalEditResult {
  id: string;
  originalFileName: string;
  isImage: boolean;
  prompt: string;
  editedImageUrl?: string;
  editedText?: string;
  summary?: string;
  timestamp: string;
}
