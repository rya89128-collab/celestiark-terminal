import type { Rarity } from '../types/card';

export function getVideoPath(rarity: Rarity): string | null {
  switch (rarity) {
    case 'UR':
      return '/videos/ur.mp4';
    case 'SSR':
      return '/videos/ssr.mp4';
    default:
      return null;
  }
}
