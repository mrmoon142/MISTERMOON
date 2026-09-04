import React from 'react';
import { useApp } from '../context/AppContext';
import { AdContainer } from '../components/AdContainer';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  Compass,
  Target,
  Code2,
  Cpu,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe2,
  CheckCircle2,
  HeartHandshake,
  Wrench,
  Scissors,
  Truck,
  HeartPulse,
  Flame,
  BrainCircuit,
  Zap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, t, setCurrentPage } = useApp();

  const primaryRoleBadges = [
    { label: 'AI VIBE CODER', color: 'from-amber-400 to-yellow-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.4)]' },
    { label: 'SOLOPRENEUR', color: 'from-cyan-400 to-blue-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(56,189,248,0.4)]' },
    { label: 'PRODUCT BUILDER', color: 'from-emerald-400 to-teal-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.4)]' },
    { label: 'PROMPT ENGINEER', color: 'from-purple-400 to-indigo-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
    { label: 'SELF-TAUGHT', color: 'from-amber-300 to-orange-400 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(251,146,60,0.4)]' },
  ];

  const workExperience = [
    {
      role: 'Fashion Designer',
      company: 'Boss Baby Clothing Apparel',
      location: 'Johannesburg, South Africa',
      period: 'Jan 2020 – Present',
      icon: Scissors,
      color: 'amber',
      points: [
        'Design, cut, and sew high-fashion bespoke garments for clients and personal collections.',
        'Maintain exceptional client satisfaction through acute attention to detail and precision styling.',
        'Manage end-to-end production timelines effectively to meet custom order deadlines.',
      ],
    },
    {
      role: 'Forklift Operator / General Labourer / Cleaner / Packer / Bricklayer',
      company: 'US Ahamba Construction Company',
      location: 'Johannesburg, South Africa',
      period: 'Oct 2021 – Jun 2025',
      icon: Truck,
      color: 'cyan',
      points: [
        'Operated heavy-duty forklifts: Reach Truck, Bendi, and Counterbalance Forklift (Licensed F4).',
        'Assisted with structural building construction, precision loading/unloading, and material handling.',
        'Ensured rigorous job site safety and cleanliness; organized tools and heavy machinery efficiently.',
        'Participated actively in the construction of residential and commercial structures.',
      ],
    },
    {
      role: 'Delivery Driver & Route Logistics',
      company: 'Uber Eats',
      location: 'Gauteng, South Africa',
      period: 'Feb 2022 – May 2023',
      icon: MapPin,
      color: 'emerald',
      points: [
        'Delivered food and urgent parcel orders with high accuracy, speed, and time management.',
        'Provided top-tier customer service while upholding road safety and food transport hygiene standards.',
      ],
    },
    {
      role: 'Health Care Assistant',
      company: 'Friends of Jesus Hospital and Maternity',
      location: 'Nigeria',
      period: 'Sep 2018 – Aug 2020',
      icon: HeartPulse,
      color: 'purple',
      points: [
        'Provided compassionate, dignified patient care and monitoring under medical supervision.',
        'Assisted registered nurses in daily clinical medical routines, hygiene maintenance, and patient comfort.',
      ],
    },
  ];

  const educationAndCertifications = [
    {
      title: 'Forklift License (F4 Counterbalance)',
      issuer: 'Certified Training Body',
      validity: 'Valid: Sept 2025 to Sept 2027',
      category: 'Heavy Machinery License',
    },
    {
      title: 'Certificate in Health Care (Higher Education)',
      issuer: 'Alison Online Education',
      validity: 'Jun 2025 – Sep 2025',
      category: 'Medical & Healthcare',
    },
    {
      title: 'Certificate in Dental Associate (Higher Education)',
      issuer: 'Alison Online Education',
      validity: 'Jul 2025 – Nov 2025',
      category: 'Dental Sciences',
    },
    {
      title: 'Fashion Design Certificate',
      issuer: 'Professional Design Academy',
      validity: '2014 – Present',
      category: 'Garment Construction',
    },
    {
      title: 'Computer Operation Certificate',
      issuer: 'Information Technology Institute',
      validity: '2016',
      category: 'Computing & Digital Tools',
    },
    {
      title: 'Secondary School Certificate (Science)',
      issuer: 'Community Secondary School, Umuna, Imo State, Nigeria',
      validity: '2008 – 2013',
      category: 'Science & Mathematics',
    },
    {
      title: 'Driving License',
      issuer: 'Department of Transport',
      validity: 'Valid (Light Vehicles & Transport)',
      category: 'Logistics & Mobility',
    },
    {
      title: 'Primary & Secondary School Certificates',
      issuer: 'National Examination Board',
      validity: 'Completed',
      category: 'Foundational Education',
    },
  ];

  return (
    <div id="about-page-root" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <ScrollReveal direction="up" distance={30} duration={0.65}>
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('about_badge', 'CREATOR & SOLOPRENEUR PROFILE')}</span>
          </div>

          <h1 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight">
            Miracle Chibueze <span className="gold-gradient-text">Dike</span>
          </h1>

          {/* Primary Role Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {primaryRoleBadges.map((badge) => (
              <span
                key={badge.label}
                className={`px-3.5 py-1.5 rounded-xl bg-gradient-to-r text-xs font-mono tracking-wide ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto pt-2">
            A relentless self-taught builder bridging real-world craftsmanship, precision logistics, and cutting-edge artificial intelligence to forge high-impact software products and creative digital ecosystems.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Profile & Contact Highlights Card */}
      <ScrollReveal direction="up" distance={35} duration={0.65}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-[#0C0F17] border border-amber-400/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Avatar & Visual Card */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-5">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-500 to-cyan-400 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Miracle Chibueze Dike"
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>

            <div>
              <h2 className="font-brand font-bold text-2xl text-slate-100">Miracle Chibueze Dike</h2>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mt-1 font-semibold">
                MISTERMOON • MIRACLE MOONBOY
              </span>
            </div>

            {/* Quick Status */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Willing to Relocate: Yes, anywhere</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono">
                <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Nationality: Nigerian</span>
              </div>
            </div>
          </div>

          {/* Bio & Direct Contact Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4" />
                <span>Professional Profile & Vision</span>
              </div>
              <h3 className="font-brand font-bold text-2xl text-slate-100">
                The Self-Taught Journey of an AI Vibe Coder
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Results-driven and versatile professional with a broad background in construction, heavy logistics, fashion design, culinary arts, computer operations, and advanced AI engineering. Demonstrates an unshakeable work ethic, agility, and commitment to quality in every role.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                As a self-taught AI Vibe Coder, Solopreneur, and Prompt Engineer, Miracle turns ideas into functional, beautiful digital software products in record time. Combining hands-on physical discipline with modern LLM orchestration and creative sound synthesis, he builds tools that solve real-world problems.
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="mailto:miraclemoonboy@gmail.com"
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Email Address</span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                    miraclemoonboy@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+27657212513"
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Phone / WhatsApp</span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    +27 65 721 2513
                  </span>
                </div>
              </a>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Location</span>
                  <span className="text-xs font-semibold text-slate-200">
                    Johannesburg, Gauteng, South Africa
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Availability</span>
                  <span className="text-xs font-semibold text-slate-200">
                    Ready for Global Remote & Relocation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Work Experience Section */}
      <ScrollReveal direction="up" distance={35} duration={0.65}>
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-brand font-bold text-2xl text-slate-100 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-amber-400" />
                <span>Work Experience</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Proven Record Across Fashion, Logistics, Construction & Healthcare</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workExperience.map((job, idx) => {
              const Icon = job.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0C0F17] border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-800 text-[10px] font-mono">
                        {job.period}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-brand font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                        {job.role}
                      </h4>
                      <span className="text-xs font-mono text-cyan-400 font-medium block mt-0.5">
                        {job.company} • {job.location}
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {job.points.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-start gap-2 text-xs text-slate-300 font-sans leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Education, Certifications & Licenses */}
      <ScrollReveal direction="up" distance={35} duration={0.65}>
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-brand font-bold text-2xl text-slate-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <span>Education, Certifications & Licenses</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Formal Accreditations & Valid Professional Credentials</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {educationAndCertifications.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 flex flex-col justify-between hover:border-cyan-400/40 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="font-brand font-bold text-sm text-slate-200 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">{item.issuer}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">
                    {item.validity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Vision & Mission Cards */}
      <ScrollReveal direction="up" distance={35} duration={0.6}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0F17] border border-amber-400/30 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-brand font-bold text-xl text-slate-100">{t('vision_title', 'Our Vision')}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{settings.vision}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0F17] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-brand font-bold text-xl text-slate-100">{t('mission_title', 'Our Mission')}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{settings.mission}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Skills & Attributes Matrix */}
      <ScrollReveal direction="up" distance={35} duration={0.6}>
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-brand font-bold text-2xl text-slate-100">Technical & Practical Competencies</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Versatile Multidisciplinary Mastery (Code, Machines, Craft & Care)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings.skills.map((skill) => (
              <div key={skill.name} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="font-mono text-amber-400 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{skill.category}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Personal Attributes & Core Work Ethic */}
      <ScrollReveal direction="up" distance={35} duration={0.6}>
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0C0F17] to-[#121622] border border-amber-400/20 space-y-4 shadow-xl">
          <h3 className="font-brand font-bold text-lg text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>Core Personal Attributes & Work Ethic</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Fast Learner</span>
                <span className="text-[11px] text-slate-400">Positive attitude, rapid adaptation to emerging AI tools and workflows.</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Leadership & Solving</span>
                <span className="text-[11px] text-slate-400">Strong problem-solving capability across hardware, code, and team tasks.</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Reliable & Punctual</span>
                <span className="text-[11px] text-slate-400">Safety-conscious, disciplined execution under tight deadlines.</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Quality Craftsmanship</span>
                <span className="text-[11px] text-slate-400">Dedicated to perfection across software, fashion tailoring, and culinary arts.</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* AdSense Unit */}
      <ScrollReveal direction="up" distance={25} duration={0.5}>
        <AdContainer slot="about" format="horizontal" />
      </ScrollReveal>
    </div>
  );
};

