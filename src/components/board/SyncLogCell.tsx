import { getRarityVisualClass } from '../../features/gacha/rarityTable';
import { useMemo, useState } from 'react';
import type { CardLog } from '../../types/card';

type SyncLogCellProps = {
  card: CardLog;
  synced: boolean;
  drawCount: number;
  onSelect: (card: CardLog) => void;
};

export function SyncLogCell({ card, synced, drawCount, onSelect }: SyncLogCellProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
        <rect width="320" height="240" fill="#07131d"/>
        <rect x="14" y="14" width="292" height="212" rx="18" fill="#0d2436" stroke="#83d4ff" stroke-opacity="0.25"/>
        <circle cx="160" cy="98" r="54" fill="#14344d" stroke="#83d4ff" stroke-opacity="0.3"/>
        <path d="M132 92l28-22 28 22v38l-28 20-28-20z" fill="#83d4ff" fill-opacity="0.16" stroke="#83d4ff" stroke-opacity="0.35"/>
        <text x="26" y="196" fill="#d8f1ff" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="16">UNRESOLVED VISUAL</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, []);

  if (!synced) {
    return (
      <div className="sync-log-cell is-locked">
        <span>UNSYNCED</span>
        <strong>{card.studentId}</strong>
      </div>
    );
  }

  return (
    <button
      className={['sync-log-cell', getRarityVisualClass(card.rarity)].join(' ')}
      onClick={() => onSelect(card)}
      type="button"
    >
      <img alt="" onError={() => setImageFailed(true)} src={imageFailed ? fallback : card.image} />
      <div>
        <div className="sync-log-cell__row">
          <span className={['rarity-badge', getRarityVisualClass(card.rarity)].join(' ')}>{card.rarity}</span>
          <small>x{drawCount}</small>
        </div>
        <strong>{card.name}</strong>
        <small>{card.creator}</small>
      </div>
    </button>
  );
}
