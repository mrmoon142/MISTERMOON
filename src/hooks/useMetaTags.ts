import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export interface MetaTagOptions {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

export function setHtmlMetaTag(attribute: string, attrValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function setCanonicalUrl(url: string): void {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const useMetaTags = (customOptions?: MetaTagOptions): void => {
  const { currentPage, selectedArticleId, blogPosts, settings } = useApp();

  useEffect(() => {
    let title = customOptions?.title || `${settings.brandName || 'MisterMoon'} • Technology • AI • Digital Innovation`;
    let description =
      customOptions?.description ||
      settings.heroSubtitle ||
      'Building the future, one idea at a time. Discover apps, software systems, and AI tools by MisterMoon.';
    let ogImage =
      customOptions?.image ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';
    const pageUrl =
      customOptions?.url || (typeof window !== 'undefined' ? window.location.href : 'https://mistermoon.com.ng');

    if (!customOptions?.title) {
      if (currentPage === 'home') {
        title = `MISTERMOON.COM.NG — AI Vibe Coding • Product Building • Web4`;
        description = `The official personal brand and futuristic digital ecosystem of MisterMoon (mistermoon.com.ng). Exploring autonomous AI systems, Web4 platforms, and software tools.`;
        ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'about') {
        title = `About Miracle Chibueze Dike (MisterMoon) — AI Vibe Coder & Creator`;
        description = `Biography, professional journey, certifications, and multidisciplinary skills of Miracle Chibueze Dike (MisterMoon) across software, AI, and systems engineering.`;
        ogImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'projects') {
        title = `Systems & Software Architecture Portfolio | MISTERMOON.COM.NG`;
        description = `Explore production-grade software applications, artificial intelligence agents, and decentralized Web4 protocols by MisterMoon.`;
        ogImage = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'apps') {
        title = `Digital Software Suite & Web Utilities | MISTERMOON.COM.NG`;
        description = `Intuitive web applications, prompt engineering tools, media converters, and productivity apps engineered by MisterMoon.`;
        ogImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'ai-studio') {
        title = `AI Studio, Copilot & Image Prompt Assistant | MISTERMOON.COM.NG`;
        description = `Full-page AI Studio powered by Gemini 2.5. Code generation, image prompt refinement, creative editing, and quota tracking.`;
        ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'downloader') {
        title = `Universal Video & Media Downloader Pro | MISTERMOON.COM.NG`;
        description = `Zero-latency video & audio extractor supporting all major social networks, direct streams, MP4/MP3 downloads, and browser streaming without ads.`;
        ogImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'blog') {
        if (selectedArticleId) {
          const activeArticle = blogPosts.find((p) => p.slug === selectedArticleId || p.id === selectedArticleId);
          if (activeArticle) {
            title = `${activeArticle.title} | MISTERMOON.COM.NG`;
            description = activeArticle.excerpt;
            if (activeArticle.featuredImage) {
              ogImage = activeArticle.featuredImage;
            }
          }
        } else {
          title = `Essays, Research & Insights | MISTERMOON.COM.NG`;
          description = `Essays exploring Web4 infrastructure, low-latency AI architectures, modular audio engineering, and solopreneurship.`;
          ogImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=630&q=80';
        }
      } else if (currentPage === 'admin') {
        title = `Admin Control Center | MISTERMOON.COM.NG`;
        description = `Secure administration panel for Miracle Chibueze Dike to manage content, projects, and systems live.`;
      } else if (currentPage === 'contact') {
        title = `Contact & Collaborative Inquiries | MISTERMOON.COM.NG`;
        description = `Get in touch with Miracle Chibueze Dike (MisterMoon) for product building collaborations, custom prompt engineering, bespoke software, or audio production.`;
        ogImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=630&q=80';
      } else if (currentPage === 'legal-privacy' || currentPage === 'legal-terms' || currentPage === 'legal-cookies') {
        title = `Privacy Policy & Terms of Service | MISTERMOON.COM.NG`;
        description = `Legal disclaimers, cookie policies, and AdSense compliance standards for MISTERMOON.COM.NG.`;
      }
    }

    // Update document.title
    document.title = title;

    // Standard meta tags
    setHtmlMetaTag('name', 'description', description);
    setCanonicalUrl(pageUrl);

    // OpenGraph
    setHtmlMetaTag('property', 'og:title', title);
    setHtmlMetaTag('property', 'og:description', description);
    setHtmlMetaTag('property', 'og:image', ogImage);
    setHtmlMetaTag('property', 'og:url', pageUrl);
    setHtmlMetaTag('property', 'og:type', customOptions?.type || (currentPage === 'blog' && selectedArticleId ? 'article' : 'website'));
    setHtmlMetaTag('property', 'og:site_name', settings.siteName || 'MISTERMOON.COM.NG');

    // Twitter Card
    setHtmlMetaTag('name', 'twitter:card', 'summary_large_image');
    setHtmlMetaTag('name', 'twitter:title', title);
    setHtmlMetaTag('name', 'twitter:description', description);
    setHtmlMetaTag('name', 'twitter:image', ogImage);
  }, [currentPage, selectedArticleId, blogPosts, settings, customOptions]);
};
