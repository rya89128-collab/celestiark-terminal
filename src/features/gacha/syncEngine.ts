import type { CardLog, Rarity } from '../../types/card';
import type { StorageSnapshot, SyncExecution, SyncMetrics, SyncMode } from '../../types/sync';
import { clamp, randomBetween } from '../../utils/random';
import { getTopRarity } from './rarityTable';
import { buildSequenceSteps, getHighlight } from './syncStateMachine';

function buildMetrics(topRarity: Rarity, forced: boolean): SyncMetrics {
  const baseRate = {
    N: 61,
    R: 68,
    SR: 78,
    SSR: 88,
    UR: 96,
  }[topRarity];

  const baseStability = {
    N: 92,
    R: 87,
    SR: 80,
    SSR: 72,
    UR: 58,
  }[topRarity];

  const syncRate = clamp(Math.round(baseRate + randomBetween(-5, 6)), 24, 99);
  const stability = clamp(Math.round(baseStability + randomBetween(-8, 8) - (forced ? 9 : 0)), 18, 100);

  return {
    syncRate,
    stability,
    interference: clamp(100 - stability + Math.round(randomBetween(-4, 5)), 5, 94),
  };
}

function buildHistoryId(): string {
  return `sync-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function pickRandomCard(cards: readonly CardLog[]): CardLog {
  return cards[Math.floor(Math.random() * cards.length)];
}

export function executeSync(
  cards: readonly CardLog[],
  storage: StorageSnapshot,
  count: number,
  forced: boolean,
): SyncExecution {
  const mode: SyncMode = count >= 10 ? 'batch' : 'single';
  const results = Array.from({ length: count }, () => pickRandomCard(cards));
  const newIds = results
    .map((card) => card.id)
    .filter((id) => !storage.syncedLogs.includes(id));

  const syncedLogs = [...new Set([...storage.syncedLogs, ...results.map((card) => card.id)])];
  const drawCounts = { ...storage.drawCounts };

  results.forEach((card) => {
    drawCounts[card.id] = (drawCounts[card.id] ?? 0) + 1;
  });

  const topRarity = getTopRarity(results.map((card) => card.rarity));
  const highlight = getHighlight(results);
  const metrics = buildMetrics(topRarity, forced);

  const nextStorage: StorageSnapshot = {
    ...storage,
    syncedLogs,
    drawCounts,
    lastSyncResult: results.map((card) => card.id),
    syncHistory: [
      {
        historyId: buildHistoryId(),
        timestamp: new Date().toISOString(),
        mode,
        count,
        resultIds: results.map((card) => card.id),
        topRarity,
        forced,
        newSyncs: newIds.length,
      },
      ...storage.syncHistory,
    ].slice(0, 24),
    seenCutscenes: storage.seenCutscenes.includes(topRarity) || (topRarity !== 'SSR' && topRarity !== 'UR')
      ? storage.seenCutscenes
      : [...storage.seenCutscenes, topRarity],
  };

  return {
    storage: nextStorage,
    session: {
      sessionId: buildHistoryId(),
      mode,
      forced,
      results,
      highlight,
      topRarity,
      newSyncCount: newIds.length,
      metrics,
      steps: buildSequenceSteps({ rarity: topRarity, forced, mode }),
      videoKey: topRarity === 'UR' ? 'ur' : topRarity === 'SSR' ? 'ssr' : null,
    },
  };
}
