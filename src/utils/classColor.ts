import type { ClassName } from '../types/card';

type ClassPalette = {
  accent: string;
  glow: string;
  muted: string;
};

const classPalette: Record<ClassName, ClassPalette> = {
  Eldam: {
    accent: '#d5b56f',
    glow: 'rgba(213, 181, 111, 0.34)',
    muted: '#665438',
  },
  Valkein: {
    accent: '#71b8ff',
    glow: 'rgba(113, 184, 255, 0.34)',
    muted: '#294867',
  },
  Speculato: {
    accent: '#a88cff',
    glow: 'rgba(168, 140, 255, 0.32)',
    muted: '#4d3878',
  },
  Novalt: {
    accent: '#ff7d67',
    glow: 'rgba(255, 125, 103, 0.34)',
    muted: '#733229',
  },
  Profeil: {
    accent: '#78daa1',
    glow: 'rgba(120, 218, 161, 0.32)',
    muted: '#2d6244',
  },
};

export function getClassPalette(className: ClassName): ClassPalette {
  return classPalette[className];
}
