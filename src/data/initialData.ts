import { AppItem, BlogPost, CommentItem, ProjectItem, SiteSettings } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'MISTERMOON',
  siteName: 'MISTERMOON.COM.NG',
  tagline: 'AI VIBE CODER • SOLOPRENEUR • PRODUCT BUILDER • PROMPT ENGINEER',
  heroHeadline: 'BUILDING THE FUTURE, ONE IDEA AT A TIME.',
  heroSubtitle: 'AI Vibe Coding • Solopreneurship • Product Building • Prompt Engineering • Web4 Systems',
  aboutBio:
    'Miracle Chibueze Dike (professionally known as MisterMoon / Miracle Moonboy) is a self-taught AI Vibe Coder, Solopreneur, Product Builder, Prompt Engineer, and multidisciplinary creator based in Johannesburg, South Africa. With a versatile background spanning precision fashion design, heavy logistics and counterbalance forklift operations, healthcare support, and digital website engineering, Miracle channels a relentless work ethic into building high-velocity AI-powered software products, creative digital platforms, and high-impact web utilities.',
  vision:
    'To pioneer the next wave of solopreneur product building where self-taught prompt engineering, rapid AI vibe coding, and multidisciplinary human grit converge to ship transformative software worldwide.',
  mission:
    'To build intuitive, high-performance web and mobile applications through relentless iteration, human-centric prompt engineering, and versatile craftsmanship—empowering creators, businesses, and global users without limits.',
  skills: [
    { name: 'AI Vibe Coding & LLM Prompt Engineering', level: 98, category: 'AI & Engineering' },
    { name: 'Product Building & Full-Stack Web Development', level: 95, category: 'Solopreneurship' },
    { name: 'Fashion Design & Garment Construction', level: 92, category: 'Creative Artistry' },
    { name: 'Forklift Logistics (Reach Truck, Bendi, Counterbalance)', level: 96, category: 'Operations & Safety' },
    { name: 'Systems Architecture & Cloud Deployments', level: 93, category: 'Engineering' },
    { name: 'Blogging, Content Strategy & Web Architecture', level: 91, category: 'Digital Media' },
    { name: 'Health Care & Dental Clinical Support', level: 88, category: 'Healthcare' },
    { name: 'Culinary Arts & Baking (10+ Yrs Experience)', level: 94, category: 'Craftsmanship' },
  ],
  journey: [
    {
      year: '2026 - Present',
      title: 'AI Vibe Coder, Solopreneur & Founder — MISTERMOON Ecosystem',
      description: 'Engineering cutting-edge AI web applications, prompt pipelines, decentralized Web4 tools, and futuristic digital platforms as a self-taught product builder.',
    },
    {
      year: '2020 - Present',
      title: 'Fashion Designer — Boss Baby Clothing Apparel (Johannesburg, SA)',
      description: 'Designing, cutting, and precision-sewing bespoke garments for clients. Managing custom fashion lines with meticulous attention to detail and tight turnaround deadlines.',
    },
    {
      year: '2021 - 2025',
      title: 'Forklift Operator / General Builder & Logistics — US Ahamba Construction',
      description: 'Operating Reach Trucks, Bendi, and Counterbalance Forklifts (Licensed F4). Directing material handling, job site safety, bricklaying, and residential building logistics.',
    },
    {
      year: '2022 - 2023',
      title: 'Logistics Delivery Driver — Uber Eats (Gauteng, South Africa)',
      description: 'Executed high-precision on-time deliveries, maintaining exceptional customer satisfaction ratings and route optimization across Gauteng.',
    },
    {
      year: '2018 - 2020',
      title: 'Health Care Assistant — Friends of Jesus Hospital & Maternity',
      description: 'Delivered compassionate patient care under clinical supervision, assisted nursing teams in daily medical routines, and maintained strict sterile environments.',
    },
  ],
  interests: [
    'AI Vibe Coding & Agentic Workflow Orchestration',
    'Advanced Prompt Engineering & LLM Architecture',
    'Solopreneur Product Strategy & Rapid Prototyping',
    'Fashion Pattern Cutting & Avant-Garde Garment Design',
    'Logistics Automation & Heavy Equipment Safety',
    'Blogging, SEO & Digital Media Monetization',
  ],
  socialLinks: [
    { platform: 'Email', url: 'mailto:miraclemoonboy@gmail.com', icon: 'Mail' },
    { platform: 'Phone', url: 'tel:+27657212513', icon: 'Phone' },
    { platform: 'X (Twitter)', url: 'https://x.com/MISTERMOON142', icon: 'Twitter' },
    { platform: 'Facebook', url: 'https://facebook.com/MISTERMOON142', icon: 'Facebook' },
    { platform: 'TikTok', url: 'https://tiktok.com/@MISTERMOON142', icon: 'Music2' },
    { platform: 'GitHub', url: 'https://github.com/MISTERMOON142', icon: 'Github' },
    { platform: 'YouTube', url: 'https://youtube.com/@MISTERMOON142', icon: 'Youtube' },
    { platform: 'Instagram', url: 'https://instagram.com/MISTERMOON142', icon: 'Instagram' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/MISTERMOON142', icon: 'Linkedin' },
  ],
  adsense: {
    clientId: 'ca-pub-7366782846848820',
    homeSlot: '4869715072',
    downloadSlot: '4869715072',
    blogSlot: '4869715072',
    enabled: true,
  },
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'MoonPulse AI Studio',
    slug: 'moonpulse-ai-studio',
    category: 'AI Projects',
    description: 'An autonomous multi-agent creative orchestration suite that synchronizes real-time multimodal image editing, code refactoring, and AI prompt engineering.',
    longDescription: 'MoonPulse combines real-time streaming LLM architectures with zero-latency image synthesis and file analysis to refactor code and produce visual masterworks on demand.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    technologies: ['TypeScript', 'Gemini 3.7 Flash', 'React 19', 'Tailwind CSS', 'Node.js'],
    status: 'Live',
    features: [
      'Multi-Agent Neural Workflows',
      'Multimodal Drag-and-Drop Editor',
      'Studio-Grade Image Synthesis',
      'Clean Type-Safe Code Generation',
    ],
    linkUrl: '#ai-studio',
    githubUrl: 'https://github.com/MISTERMOON142/moonpulse-ai-studio',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'LunarVault Web4 Identity',
    slug: 'lunarvault-web4-identity',
    category: 'Web4 & Cryptography',
    description: 'A self-sovereign digital identity and verifiable credentials vault engineered for cross-platform creator authentication without third-party tracking.',
    longDescription: 'Built with cryptographically signed decentralized identifiers (DIDs) and zero-knowledge claim proofs to grant instantaneous, privacy-preserving portal access.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    technologies: ['Web Crypto API', 'React 19', 'TypeScript', 'Ed25519 Keys', 'IndexedDB'],
    status: 'Live',
    features: [
      'Client-Side Key Generation',
      'Zero-Knowledge Verification',
      'Universal QR Handshake',
      'Tamper-Proof Audit Trail',
    ],
    linkUrl: '#about',
    githubUrl: 'https://github.com/MISTERMOON142/lunar-vault',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'MoonDownloader Core Stream Router',
    slug: 'moondownloader-core',
    category: 'Web Apps',
    description: 'A secure, high-throughput media proxy and authorized format analyzer designed with SSRF protection, rate limiting, and adaptive bandwidth optimization.',
    longDescription: 'Processes permissible streaming formats, performs strict URL validation against cloud metadata endpoints, and caches temporary buffers with automated ephemeral cleanup.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    technologies: ['Express', 'Node.js Streams', 'DNS Validation', 'Rate Limiter', 'Docker'],
    status: 'Live',
    features: [
      'Strict IP Blacklisting & Anti-SSRF',
      'Adaptive Transcoding Queue',
      'Automatic Ephemeral Cleanup',
      'Granular Rate Guard',
    ],
    linkUrl: '#downloader',
    githubUrl: 'https://github.com/MISTERMOON142/moondownloader-pro',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Solopreneur SaaS Engine',
    slug: 'solopreneur-saas-engine',
    category: 'Solopreneur Tools',
    description: 'A production scaffolding engine for launching full-stack subscription apps with cryptographic license keys, Stripe payment webhooks, and zero-maintenance architecture.',
    longDescription: 'Engineered specifically for single-founder product builders to ship secure, revenue-generating SaaS platforms in days with built-in subscription recovery and usage quotas.',
    imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'Web Crypto'],
    status: 'Live',
    features: [
      '3-Factor Subscription Security',
      'Zero-Storage User Verification',
      'Automated Quota & Rate Limit Tracking',
      'Instant Deployment Readiness',
    ],
    linkUrl: '#ai-studio',
    githubUrl: 'https://github.com/MISTERMOON142/solopreneur-saas-engine',
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'CosmicGrid Spatial Canvas',
    slug: 'cosmicgrid-spatial-canvas',
    category: 'Digital Platforms',
    description: 'An infinite 3D spatial workspace for architectural planning, code mind-mapping, and multi-agent AI knowledge graphs with real-time responsive rendering.',
    longDescription: 'Features infinite panning, mathematical step-grid snapping, dynamic node connections, and live markdown documentation previews in a dark obsidian aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    technologies: ['Canvas2D', 'React 19', 'TypeScript', 'Web Workers', 'Tailwind CSS'],
    status: 'Live',
    features: [
      'Infinite 60FPS Spatial Grid',
      'Node Hierarchies & Vector Connectors',
      'Instant JSON Import / Export',
      'Zero-Latency Canvas Calculations',
    ],
    linkUrl: '#projects',
    githubUrl: 'https://github.com/MISTERMOON142/cosmic-grid',
  },
  {
    id: 'proj-6',
    title: 'NeuralKey Mobile Security App',
    slug: 'neuralkey-mobile',
    category: 'Mobile Apps',
    description: 'A cross-platform mobile security companion providing hardware-grade biometric authentication, cryptographic passkeys, and remote session revocation.',
    longDescription: 'Built with React Native and native biometric APIs to deliver military-grade cryptographic key management directly in the palm of your hand.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    technologies: ['React Native', 'TypeScript', 'Biometrics API', 'Secure Enclave'],
    status: 'Beta',
    features: [
      'Biometric Fingerprint & Face ID',
      'Offline Cryptographic Signatures',
      'Instant Remote Session Lockout',
      'Universal QR Code Authentication',
    ],
    linkUrl: '#apps',
    githubUrl: 'https://github.com/MISTERMOON142/neuralkey-mobile',
  },
];

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'app-1',
    name: 'MoonDownloader Pro',
    tagline: 'Secure, Fast & Legally Compliant Authorized Video Downloader',
    description:
      'The definitive media archiving tool for creators. Validate permissible stream URLs, inspect available resolutions up to 4K, and download authorized audio and video files with zero bloat.',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    ],
    features: [
      'Instant URL Permission & Availability Verification',
      'Multi-Format Transcoding (1080p, 720p, MP3 Audio)',
      'Zero Ads inside Download Controls',
      'Strict Server-Side SSRF & Malware Shield',
      'Automatic Ephemeral Buffer Destruction',
    ],
    platforms: ['Web', 'Android', 'iOS'],
    status: 'Live',
    version: 'v2.4.0',
    rating: 4.9,
    downloadUrl: '#downloader',
    webUrl: '#downloader',
    badge: 'Flagship Tool',
  },
  {
    id: 'app-2',
    name: 'MoonPulse AI Studio',
    tagline: 'Multimodal AI Copilot, Image Transformer & Code Refactor Hub',
    description:
      'All-in-one AI workspace featuring streaming intelligent chat, multimodal image-to-image editing, prompt studio with golden aesthetic enhancement, and automated file editing.',
    logoUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    ],
    features: [
      'Gemini 3.7 Flash Reasoning Backend',
      'Drag-and-Drop Multimodal File Uploader',
      'Zero-Latency Code Refactoring',
      'Cryptographic Subscription Recovery',
    ],
    platforms: ['Web'],
    status: 'Live',
    version: 'v2.1.0',
    rating: 5.0,
    downloadUrl: '#ai-studio',
    webUrl: '#ai-studio',
    badge: 'Flagship AI',
  },
  {
    id: 'app-3',
    name: 'NeuralKey Web4 Pass',
    tagline: 'Cryptographic Identity & Decentralized Authorization Wallet',
    description:
      'Manage your digital persona, credentials, and creator access keys with client-side zero-knowledge encryption. No passwords or tracking cookies required.',
    logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    ],
    features: [
      'Hardware-Grade Cryptographic Enclave Support',
      'Decentralized Identifier (DID) Management',
      'Biometric Verification Integration',
      'Zero Server-Side Key Custody',
    ],
    platforms: ['Web', 'iOS', 'Android'],
    status: 'Beta',
    version: 'v1.0.2',
    rating: 4.8,
    downloadUrl: '#about',
    webUrl: '#about',
    badge: 'Web4',
  },
  {
    id: 'app-4',
    name: 'CosmicGrid Workspace',
    tagline: 'Infinite 3D Spatial Canvas for Mind-Mapping & Architecture',
    description:
      'Organize ideas, code diagrams, and engineering schematics on an infinite futuristic node graph with real-time multi-agent AI copilot support.',
    logoUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
    ],
    features: [
      'Infinite Node-Based Graph System',
      'Real-Time Collaborative Live Sync',
      'Integrated Code Sandbox & Markdown Engine',
      'AI-Powered Auto-Structuring',
    ],
    platforms: ['Web'],
    status: 'Live',
    version: 'v1.2.0',
    rating: 4.9,
    downloadUrl: '#projects',
    webUrl: '#projects',
    badge: 'Pro Suite',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'architecting-web4-and-autonomous-creator-systems',
    title: 'Architecting Web4: Beyond Centralization to Autonomous Creator Systems',
    excerpt:
      'Why the next iteration of the digital landscape is defined by client-side intelligence, self-sovereign cryptographic identity, and decentralized compute rather than speculative finance.',
    content: `
### The Transition to Sovereign Digital Platforms

For the past decade, internet architecture has oscillated between hyper-centralized monolithic cloud platforms and cumbersome distributed ledgers. However, the emerging paradigm—what we term **Web4**—is driven by three core pillars:

1. **Local-First, Zero-Trust Compute**: Data belongs to the individual's cryptographic enclave. Local machine learning models and edge caching allow apps to function instantly and reliably offline.
2. **Self-Sovereign Identity (SSI)**: Universal authorization without corporate surveillance. You hold the private keys to your digital existence.
3. **Multi-Agent Collaborative Orchestration**: AI models acting as autonomous facilitators that synthesize data, generate assets, and compile applications on demand.

### Building Resilient Digital Artifacts

When engineering tools for MISTERMOON.COM, our priority is always durability and latency reduction. By leveraging Web Crypto primitives, strict server-side sandboxing, and modern streaming protocols, creators maintain absolute sovereignty over their output.

> "True digital luxury is speed, privacy, and uncompromising creative control."
    `,
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Miracle Chibueze Dike (MisterMoon)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'AI Vibe Coder & Solopreneur',
    },
    date: 'February 24, 2026',
    category: 'Technology',
    readTime: '6 min read',
    tags: ['Web4', 'Architecture', 'Digital Identity', 'AI', 'Security'],
    featured: true,
  },
  {
    id: 'post-2',
    slug: 'safe-video-downloading-and-ssrf-defense',
    title: 'Engineering a Bulletproof Media Downloader: SSRF Defense & Ephemeral Processing',
    excerpt:
      'How to build a high-performance media transcoding pipeline that guarantees server security, enforces rate limits, and protects private networks.',
    content: `
### Why Client-Only Downloading Fails

Many naive video downloaders attempt to fetch remote streams directly in client-side JavaScript. This immediately runs into CORS restrictions, browser memory limits, and format incompatibilities.

However, moving download processing to the server introduces critical attack vectors:
1. **Server-Side Request Forgery (SSRF)**: Malicious actors passing \`http://169.254.169.254/latest/meta-data/\` or \`http://127.0.0.1:8080/admin\`.
2. **Resource Exhaustion**: Gigabyte-sized video streams flooding server RAM and disk.
3. **Path Traversal & Shell Injection**: Unsanitized filenames containing \`../../\` or bash metacharacters.

### The MisterMoon Architecture
Our backend implements strict pre-flight DNS lookups, verifies non-private IPv4/IPv6 ranges before initiating any outbound socket, streams chunks through bounded buffers, and enforces automatic file deletion immediately upon download completion.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Miracle Chibueze Dike (MisterMoon)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'AI Vibe Coder & Full-Stack Architect',
    },
    date: 'February 12, 2026',
    category: 'Web Development',
    readTime: '7 min read',
    tags: ['Security', 'Node.js', 'SSRF', 'Architecture', 'TypeScript'],
    featured: true,
  },
  {
    id: 'post-3',
    slug: 'generative-ai-in-production-real-time-tool-calling',
    title: 'Generative AI in Production: Real-Time Multimodal Workflows with Gemini 3.7 Flash',
    excerpt:
      'Leveraging modern reasoning models with low latency to power real-time multimodal image transformation, prompt engineering, and automated file editing.',
    content: `
### Beyond Static Chatbots

The current frontier in artificial intelligence is not raw parameter count—it is latency, reasoning depth, and deterministic tool execution.

With Gemini 3.7 Flash, we achieve instantaneous semantic reasoning and multimodal file analysis across our platform. By providing structured schemas and strict response validation, the model delivers actionable JSON payloads directly to our React component tree with sub-second feedback.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Miracle Chibueze Dike (MisterMoon)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'AI Vibe Coder & Solopreneur',
    },
    date: 'January 28, 2026',
    category: 'AI',
    readTime: '5 min read',
    tags: ['AI', 'Gemini', 'TypeScript', 'Innovation', 'Multimodal'],
    featured: true,
  },
  {
    id: 'post-4',
    slug: 'solopreneur-vibe-coding-shipping-production-apps-alone',
    title: 'The Solopreneur Playbook: Vibe Coding and Shipping High-Impact Software Fast',
    excerpt:
      'How modern solopreneurs use AI copilots, strict component modularity, and rapid prototyping to build and monetize full-scale applications single-handedly.',
    content: `
### The New Era of the Single-Person Tech Venture

Building a software venture no longer requires an army of 50 developers. With modern AI vibe coding techniques:

- **Mathematical UI Scaling**: Designing with rigorous optical hierarchy and pure contrast ratios.
- **Decoupled Business Logic**: Structuring applications with clean TypeScript interfaces and robust server proxies.
- **Cryptographic Security**: Securing user subscriptions and quotas with zero-trust cryptographic codes.

By treating AI as an elite junior engineering pair, a single creator can conceptualize, build, test, and ship production-ready web apps in record time.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Miracle Chibueze Dike (MisterMoon)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'AI Vibe Coder & Solopreneur',
    },
    date: 'January 15, 2026',
    category: 'Entrepreneurship',
    readTime: '5 min read',
    tags: ['Solopreneur', 'Vibe Coding', 'Startups', 'Productivity'],
  },
  {
    id: 'post-5',
    slug: 'the-web4-paradigm-autonomous-agents-and-edge-cryptography',
    title: 'The Web4 Paradigm: Autonomous Agents, Edge Cryptography, and Zero-Knowledge Identity',
    excerpt:
      'Exploring the architectural bridge from Web3 financial decentralization to Web4 sovereign AI agents, client-side enclaves, and cryptographic access tiers.',
    content: `
### Beyond Blockchain Hype: What Is Web4?

While Web3 focused primarily on distributed ledgers, tokens, and smart contracts on public blockchains, **Web4** represents the fusion of:
1. **Local-First Cryptographic Enclaves**: Zero-trust key generation using browser-native WebCrypto APIs (ECDSA, AES-GCM) that never transmit private seed phrases to any cloud server.
2. **Autonomous Edge Agents**: Client-side AI assistants and background workers operating on local memory, executing deterministic tools on user hardware.
3. **Decentralized Storage & Interoperability**: Ephemeral, zero-knowledge sync across user nodes without centralized database surveillance.

### The MisterMoon Web4 Implementation

On \`mistermoon.com.ng\`, our Web4 framework generates cryptographic identity hashes directly inside the browser sandbox. User tiers, premium feature tokens, and access verification operate offline-first with military-grade SHA-256 integrity proofs.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Miracle Chibueze Dike (MisterMoon)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'AI Vibe Coder & Full-Stack Architect',
    },
    date: 'March 01, 2026',
    category: 'Web4',
    readTime: '6 min read',
    tags: ['Web4', 'Cryptography', 'Zero-Knowledge', 'Autonomous Agents', 'Digital Sovereignty'],
    featured: true,
  },
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'comm-1',
    targetId: 'post-1',
    targetType: 'blog',
    authorName: 'Sarah Lin',
    authorRole: 'Web3 & AI Researcher',
    content: 'The perspective on client-side cryptographic enclaves vs cloud centralization is spot on. Sub-500ms latency with zero-knowledge keys makes all the difference!',
    timestamp: '2 days ago',
    likes: 14,
    userLiked: false,
    replies: [
      {
        id: 'comm-1-1',
        targetId: 'post-1',
        targetType: 'blog',
        authorName: 'MisterMoon',
        authorRole: 'Author',
        content: 'Thanks Sarah! Combining client-side WebCrypto with edge-cached AI pipelines gives creators true autonomy without vendor lock-in.',
        timestamp: '1 day ago',
        likes: 9,
        userLiked: false,
        parentId: 'comm-1',
      },
    ],
  },
  {
    id: 'comm-2',
    targetId: 'post-2',
    targetType: 'blog',
    authorName: 'Marcus Vance',
    authorRole: 'SecOps Engineer',
    content: 'Pre-flight DNS validation to block 169.254.169.254 and private IPv4 subnets is mandatory for media downloaders. Great job sharing this implementation architecture.',
    timestamp: '3 days ago',
    likes: 18,
    userLiked: true,
  },
  {
    id: 'comm-3',
    targetId: 'post-3',
    targetType: 'blog',
    authorName: 'Alex Rivera',
    authorRole: 'Solopreneur Founder',
    content: 'The 10x multiplier of combining LLM prompt synthesis with manual craft discipline is the real secret of modern vibe coding.',
    timestamp: '5 days ago',
    likes: 11,
    userLiked: false,
  },
  {
    id: 'comm-4',
    targetId: 'proj-1',
    targetType: 'project',
    authorName: 'Elena Rostova',
    authorRole: 'Design Engineer',
    content: 'The drag-and-drop multimodal image editor in MoonPulse AI Studio is incredibly fast. The golden theme and prompt engineering pipeline work seamlessly!',
    timestamp: '4 days ago',
    likes: 12,
    userLiked: false,
  },
  {
    id: 'comm-5',
    targetId: 'proj-2',
    targetType: 'project',
    authorName: 'Tariq Al-Mansoor',
    authorRole: 'Full Stack Architect',
    content: 'Sub-50ms local verification on the NeuralKey Web4 protocol is impressive. Great code structure and clear privacy docs.',
    timestamp: '1 week ago',
    likes: 8,
    userLiked: false,
  },
  {
    id: 'comm-6',
    targetId: 'app-1',
    targetType: 'app',
    authorName: 'David K.',
    authorRole: 'Content Producer',
    content: 'MoonDownloader Pro is the cleanest tool I have used. Zero annoying ad redirects inside the download controls and instant resolution analysis.',
    timestamp: '5 days ago',
    likes: 21,
    userLiked: false,
  },
  {
    id: 'comm-7',
    targetId: 'app-2',
    targetType: 'app',
    authorName: 'Claire Dupond',
    authorRole: 'Creative Director',
    content: 'The AI Studio prompt refactor tools save hours every day. Perfect for preparing structured prompts for production models.',
    timestamp: '3 days ago',
    likes: 16,
    userLiked: false,
  },
  {
    id: 'comm-8',
    targetId: 'downloader-hub',
    targetType: 'general',
    authorName: 'Jordan Reed',
    authorRole: 'Video Editor',
    content: 'Downloaded several 1080p open-license clips without lag or unwanted watermarks. Super reliable streamer!',
    timestamp: '1 day ago',
    likes: 10,
    userLiked: false,
  },
];

