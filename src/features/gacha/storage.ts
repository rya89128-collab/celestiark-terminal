import type { CardLog } from '../../types/card';
import type { DrawCounts, StorageSnapshot } from '../../types/sync';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage';
import { createInitialDeck } from './deckManager';
import { createBaseAssignments, createRandomizedAssignments } from './rarityTable';

const storageKeys = {
  syncedLogs: 'syncedLogs',
  syncDeck: 'syncDeck',
  rarityAssignments: 'rarityAssignments',
  drawCounts: 'drawCounts',
  lastSyncResult: 'lastSyncResult',
  syncHistory: 'syncHistory',
  seenCutscenes: 'seenCutscenes',
  fullSyncCelebrated: 'fullSyncCelebrated',
} as const;

function createEmptyCounts(cards: readonly CardLog[]): DrawCounts {
  return Object.fromEntries(cards.map((card) => [card.id, 0]));
}

export function createEmptyStorage(cards: readonly CardLog[]): StorageSnapshot {
  return {
    syncedLogs: [],
    syncDeck: createInitialDeck(cards),
    rarityAssignments: createBaseAssignments(cards),
    drawCounts: createEmptyCounts(cards),
    lastSyncResult: [],
    syncHistory: [],
    seenCutscenes: [],
    fullSyncCelebrated: false,
  };
}

export function resetRarityState(snapshot: StorageSnapshot, cards: readonly CardLog[]): StorageSnapshot {
  return {
    ...snapshot,
    rarityAssignments: createRandomizedAssignments(cards),
  };
}

export function loadStorage(cards: readonly CardLog[]): StorageSnapshot {
  const validIds = new Set(cards.map((card) => card.id));
  const defaults = createEmptyStorage(cards);

  const syncedLogs = safeLocalStorageGet<string[]>(storageKeys.syncedLogs, []).filter((id) => validIds.has(id));
  const lastSyncResult = safeLocalStorageGet<string[]>(storageKeys.lastSyncResult, []).filter((id) => validIds.has(id));
  const syncHistory = safeLocalStorageGet<StorageSnapshot['syncHistory']>(storageKeys.syncHistory, []).filter(
    (entry) => Array.isArray(entry.resultIds),
  );
  const seenCutscenes = safeLocalStorageGet<StorageSnapshot['seenCutscenes']>(storageKeys.seenCutscenes, []).filter(
    (rarity) => rarity === 'SSR' || rarity === 'UR',
  );
  const syncDeckRaw = safeLocalStorageGet<StorageSnapshot['syncDeck']>(storageKeys.syncDeck, defaults.syncDeck);
  const rarityAssignmentsRaw = safeLocalStorageGet<StorageSnapshot['rarityAssignments']>(
    storageKeys.rarityAssignments,
    defaults.rarityAssignments,
  );
  const drawCountsRaw = safeLocalStorageGet<StorageSnapshot['drawCounts']>(storageKeys.drawCounts, defaults.drawCounts);
  const fullSyncCelebrated = safeLocalStorageGet<boolean>(storageKeys.fullSyncCelebrated, false);

  const syncDeck = Array.isArray(syncDeckRaw?.queue) && typeof syncDeckRaw.cycle === 'number'
    ? {
        queue: syncDeckRaw.queue.filter((id) => validIds.has(id)),
        cycle: syncDeckRaw.cycle,
      }
    : defaults.syncDeck;

  const rarityAssignments = Object.fromEntries(
    cards.map((card) => {
      const rarity = rarityAssignmentsRaw?.[card.id];
      return [card.id, rarity ?? defaults.rarityAssignments[card.id]];
    }),
  );

  const drawCounts = Object.fromEntries(
    cards.map((card) => {
      const count = drawCountsRaw?.[card.id];
      return [card.id, typeof count === 'number' && count >= 0 ? count : 0];
    }),
  );

  return {
    syncedLogs,
    syncDeck: syncDeck.queue.length > 0 ? syncDeck : defaults.syncDeck,
    rarityAssignments,
    drawCounts,
    lastSyncResult,
    syncHistory,
    seenCutscenes,
    fullSyncCelebrated,
  };
}

export function persistStorage(snapshot: StorageSnapshot): void {
  safeLocalStorageSet(storageKeys.syncedLogs, snapshot.syncedLogs);
  safeLocalStorageSet(storageKeys.syncDeck, snapshot.syncDeck);
  safeLocalStorageSet(storageKeys.rarityAssignments, snapshot.rarityAssignments);
  safeLocalStorageSet(storageKeys.drawCounts, snapshot.drawCounts);
  safeLocalStorageSet(storageKeys.lastSyncResult, snapshot.lastSyncResult);
  safeLocalStorageSet(storageKeys.syncHistory, snapshot.syncHistory);
  safeLocalStorageSet(storageKeys.seenCutscenes, snapshot.seenCutscenes);
  safeLocalStorageSet(storageKeys.fullSyncCelebrated, snapshot.fullSyncCelebrated);
}
