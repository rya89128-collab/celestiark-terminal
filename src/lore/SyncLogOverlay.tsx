import { SyncLogBoard } from '../components/board/SyncLogBoard';
import type { CardLog } from '../types/card';
import type { DrawCounts } from '../types/sync';

type SyncLogOverlayProps = {
  cards: CardLog[];
  syncedIds: Set<string>;
  drawCounts: DrawCounts;
  onClose: () => void;
  onSelect: (card: CardLog) => void;
};

export function SyncLogOverlay({ cards, syncedIds, drawCounts, onClose, onSelect }: SyncLogOverlayProps) {
  const totalDraws = Object.values(drawCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="overlay-backdrop" onClick={onClose} role="presentation">
      <section className="overlay-panel" onClick={(event) => event.stopPropagation()}>
        <header className="overlay-panel__header">
          <div>
            <p className="eyebrow">COLLECTION BOARD</p>
            <h2>ムネモシュネ コレクション一覧</h2>
          </div>
          <div className="overlay-panel__meta">
            <span>
              UNIQUE {syncedIds.size} / {cards.length} | TOTAL DRAWS {totalDraws}
            </span>
            <button onClick={onClose} type="button">
              CLOSE
            </button>
          </div>
        </header>
        <SyncLogBoard cards={cards} drawCounts={drawCounts} onSelect={onSelect} syncedIds={syncedIds} />
      </section>
    </div>
  );
}
