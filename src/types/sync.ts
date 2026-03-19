import type { CardLog, Rarity } from './card';

export type SyncMode = 'single' | 'batch';

export type SequencePhase =
  | 'idle'
  | 'authentication'
  | 'interference'
  | 'reconstruction'
  | 'window'
  | 'video'
  | 'hold'
  | 'reveal'
  | 'complete';

export type SequenceStep = {
  phase: SequencePhase;
  label: string;
  durationMs: number;
};

export type SyncDeckState = {
  queue: string[];
  cycle: number;
};

export type RarityAssignments = Record<string, Rarity>;
export type DrawCounts = Record<string, number>;

export type SyncHistoryEntry = {
  historyId: string;
  timestamp: string;
  mode: SyncMode;
  count: number;
  resultIds: string[];
  topRarity: Rarity;
  forced: boolean;
  newSyncs: number;
};

export type StorageSnapshot = {
  syncedLogs: string[];
  syncDeck: SyncDeckState;
  rarityAssignments: RarityAssignments;
  drawCounts: DrawCounts;
  lastSyncResult: string[];
  syncHistory: SyncHistoryEntry[];
  seenCutscenes: Rarity[];
  fullSyncCelebrated: boolean;
};

export type SyncMetrics = {
  syncRate: number;
  stability: number;
  interference: number;
};

export type SyncSession = {
  sessionId: string;
  mode: SyncMode;
  forced: boolean;
  results: CardLog[];
  highlight: CardLog;
  topRarity: Rarity;
  newSyncCount: number;
  metrics: SyncMetrics;
  steps: SequenceStep[];
  videoKey: 'ssr' | 'ur' | null;
};

export type SyncExecution = {
  storage: StorageSnapshot;
  session: SyncSession;
};
