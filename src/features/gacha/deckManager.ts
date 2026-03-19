import type { CardLog } from '../../types/card';
import type { SyncDeckState } from '../../types/sync';
import { shuffle } from '../../utils/random';

function buildFullDeck(cards: readonly CardLog[]): string[] {
  return shuffle(cards.map((card) => card.id));
}

export function createInitialDeck(cards: readonly CardLog[]): SyncDeckState {
  return {
    queue: buildFullDeck(cards),
    cycle: 1,
  };
}

export function ensureDeckCapacity(
  deck: SyncDeckState,
  cards: readonly CardLog[],
  minimumCount: number,
): SyncDeckState {
  let nextDeck = { ...deck, queue: [...deck.queue] };

  while (nextDeck.queue.length < minimumCount) {
    nextDeck = {
      queue: [...nextDeck.queue, ...buildFullDeck(cards)],
      cycle: nextDeck.cycle + 1,
    };
  }

  return nextDeck;
}

export function drawFromDeck(
  deck: SyncDeckState,
  cards: readonly CardLog[],
  count: number,
): { deck: SyncDeckState; cardIds: string[] } {
  const replenished = ensureDeckCapacity(deck, cards, count);

  return {
    deck: {
      ...replenished,
      queue: replenished.queue.slice(count),
    },
    cardIds: replenished.queue.slice(0, count),
  };
}
