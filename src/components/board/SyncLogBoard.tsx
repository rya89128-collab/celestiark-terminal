import type { CardLog } from '../../types/card';
import type { DrawCounts } from '../../types/sync';
import { SyncLogCell } from './SyncLogCell';

type SyncLogBoardProps = {
  cards: CardLog[];
  syncedIds: Set<string>;
  drawCounts: DrawCounts;
  onSelect: (card: CardLog) => void;
};

export function SyncLogBoard({ cards, syncedIds, drawCounts, onSelect }: SyncLogBoardProps) {
  return (
    <div className="sync-log-board sync-log-board--catalog">
      {cards.map((card) => (
        <SyncLogCell
          card={card}
          drawCount={drawCounts[card.id] ?? 0}
          key={card.id}
          onSelect={onSelect}
          synced={syncedIds.has(card.id)}
        />
      ))}
    </div>
  );
}
