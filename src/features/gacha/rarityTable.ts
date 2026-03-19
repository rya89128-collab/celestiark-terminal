import type { CardLog, Rarity } from '../../types/card';
import type { RarityAssignments } from '../../types/sync';
import { shuffle } from '../../utils/random';

export const rarityRank: Record<Rarity, number> = {
  N: 0,
  R: 1,
  SR: 2,
  SSR: 3,
  UR: 4,
};

export const rarityTheme: Record<Rarity, { label: string; glow: string; accent: string }> = {
  N: {
    label: 'BASE LOG',
    glow: 'rgba(120, 188, 225, 0.18)',
    accent: '#80b8d8',
  },
  R: {
    label: 'STABLE LOG',
    glow: 'rgba(118, 214, 255, 0.24)',
    accent: '#73d2ff',
  },
  SR: {
    label: 'PRIORITY LOG',
    glow: 'rgba(127, 178, 255, 0.28)',
    accent: '#91b8ff',
  },
  SSR: {
    label: 'ARCHIVE CLASS',
    glow: 'rgba(255, 212, 126, 0.28)',
    accent: '#f6d17b',
  },
  UR: {
    label: 'RESTRICTED CORE',
    glow: 'rgba(255, 222, 164, 0.44)',
    accent: '#ffe0a2',
  },
};

export function getRarityVisualClass(rarity: Rarity): string {
  return `rarity-${rarity.toLowerCase()}`;
}

export function compareRarity(left: Rarity, right: Rarity): number {
  return rarityRank[left] - rarityRank[right];
}

export function getTopRarity(values: readonly Rarity[]): Rarity {
  return values.reduce<Rarity>((top, current) => (
    compareRarity(current, top) > 0 ? current : top
  ), 'N');
}

export function createBaseAssignments(cards: readonly CardLog[]): RarityAssignments {
  return Object.fromEntries(cards.map((card) => [card.id, card.rarity]));
}

export function createRandomizedAssignments(cards: readonly CardLog[]): RarityAssignments {
  const cardIds = shuffle(cards.map((card) => card.id));
  const rarityPool = shuffle(cards.map((card) => card.rarity));

  return Object.fromEntries(cardIds.map((cardId, index) => [cardId, rarityPool[index]]));
}
