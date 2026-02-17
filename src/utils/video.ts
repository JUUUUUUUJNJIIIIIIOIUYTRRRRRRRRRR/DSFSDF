import type { VideoConfig } from '../types';

const YOUTUBE_WATCH = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{6,})/i;
const YOUTUBE_SHORT = /^https?:\/\/(?:www\.)?youtu\.be\/([\w-]{6,})/i;
const VIMEO = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i;

export const toEmbeddableUrl = (rawUrl: string): string => {
  const url = rawUrl.trim();

  const youtubeWatchMatch = url.match(YOUTUBE_WATCH);
  if (youtubeWatchMatch) {
    return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
  }

  const youtubeShortMatch = url.match(YOUTUBE_SHORT);
  if (youtubeShortMatch) {
    return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`;
  }

  const vimeoMatch = url.match(VIMEO);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
};

export const buildVideoRegistry = (configs: VideoConfig[]): Record<string, string> =>
  configs.reduce<Record<string, string>>((acc, entry) => {
    acc[entry.code] = toEmbeddableUrl(entry.url);
    return acc;
  }, {});
