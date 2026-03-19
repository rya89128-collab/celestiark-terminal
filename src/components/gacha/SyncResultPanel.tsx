import { useState } from 'react';
import { getRarityVisualClass } from '../../features/gacha/rarityTable';
import type { SyncSession } from '../../types/sync';

type SyncResultPanelProps = {
  session: SyncSession;
  onInspect: (cardId: string) => void;
  onDownload: () => Promise<void>;
};

export function SyncResultPanel({ session, onInspect, onDownload }: SyncResultPanelProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) {
      return;
    }

    try {
      setDownloading(true);
      await onDownload();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className={['sync-result-panel', getRarityVisualClass(session.topRarity)].join(' ')}>
      <header className="sync-result-panel__header">
        <div>
          <p className="eyebrow">SYNC COMPLETE</p>
          <h3>{session.mode === 'batch' ? '10件の同期が完了しました' : '1件の同期が完了しました'}</h3>
        </div>
        <div className="sync-result-panel__header-actions" data-export-ignore="true">
          <div className="sync-result-panel__stats">
            <span>{session.results.length} LOGS</span>
            <span>{session.newSyncCount} NEW</span>
            <span>{session.topRarity}</span>
          </div>
          <button className="ghost-button" onClick={handleDownload} type="button">
            {downloading ? '画像化中...' : '結果画像を保存'}
          </button>
        </div>
      </header>
      <div className="sync-result-panel__grid">
        {session.results.map((card, index) => (
          <button
            className={[
              'result-chip',
              getRarityVisualClass(card.rarity),
              card.id === session.highlight.id ? 'is-highlight' : '',
            ].join(' ').trim()}
            key={`${session.sessionId}-${index}-${card.id}`}
            onClick={() => onInspect(card.id)}
            type="button"
          >
            <span className={['rarity-badge', getRarityVisualClass(card.rarity)].join(' ')}>{card.rarity}</span>
            <strong>{card.name}</strong>
            <small>{card.creator}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
