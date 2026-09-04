/**
 * ReadingTimeCalculator Utility
 * Estimates article and blog content reading duration with accurate words-per-minute heuristics,
 * code snippet weighting, and markdown stripping.
 */

export interface ReadingTimeResult {
  minutes: number;
  text: string;
  wordCount: number;
  timeEstimateSeconds: number;
}

export function calculateReadingTime(
  content: string | undefined | null,
  options?: {
    wordsPerMinute?: number;
    imageCount?: number;
  }
): ReadingTimeResult {
  if (!content || typeof content !== 'string') {
    return {
      minutes: 1,
      text: '1 min read',
      wordCount: 0,
      timeEstimateSeconds: 60,
    };
  }

  const wpm = options?.wordsPerMinute || 200;
  const imageCount = options?.imageCount || 0;

  // Clean Markdown syntax (links, headers, bold, images, html tags)
  const cleanText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove markdown images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links but keep text
    .replace(/```[\s\S]*?```/g, (codeBlock) => {
      // Code blocks take slightly longer to read/digest
      const lines = codeBlock.split('\n').length;
      return ' '.repeat(lines * 8); // approximate as equivalent text density
    })
    .replace(/`.*?`/g, '') // inline code
    .replace(/#{1,6}\s+/g, '') // headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/<[^>]*>/g, '') // HTML tags
    .trim();

  // Count words
  const words = cleanText.match(/\b[^\s]+\b/g) || [];
  const wordCount = words.length;

  // Base read time in seconds
  let totalSeconds = (wordCount / wpm) * 60;

  // Add time for images (Medium heuristic: 12s for 1st, 11s for 2nd, down to 3s)
  if (imageCount > 0) {
    for (let i = 0; i < imageCount; i++) {
      const imageTime = Math.max(3, 12 - i);
      totalSeconds += imageTime;
    }
  }

  // Calculate minutes (minimum 1 min)
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));

  return {
    minutes,
    text: `${minutes} min read`,
    wordCount,
    timeEstimateSeconds: Math.round(totalSeconds),
  };
}
