import { useMemo, useState } from 'react';
import { rarityTheme } from '../../features/gacha/rarityTable';
import type { CardLog } from '../../types/card';
import { CardFrame } from './CardFrame';

type PersonaCardProps = {
  card: CardLog;
  compact?: boolean;
  onClick?: () => void;
};

function buildPlaceholder(card: CardLog): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
      <rect width="480" height="640" fill="#06141f"/>
      <rect x="24" y="24" width="432" height="592" rx="22" fill="#0b2233" stroke="#85d7ff" stroke-opacity="0.35"/>
      <path d="M54 418h372" stroke="#85d7ff" stroke-opacity="0.25"/>
      <path d="M54 454h372" stroke="#85d7ff" stroke-opacity="0.15"/>
      <circle cx="240" cy="208" r="112" fill="#13354d" stroke="#85d7ff" stroke-opacity="0.28"/>
      <path d="M176 196l64-56 64 56v84l-64 44-64-44z" fill="#85d7ff" fill-opacity="0.14" stroke="#85d7ff" stroke-opacity="0.4"/>
      <text x="54" y="492" fill="#d8f1ff" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="22">NO VISUAL RECORD</text>
      <text x="54" y="528" fill="#80b8d8" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="18">${card.studentId}</text>
      <text x="54" y="560" fill="#80b8d8" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="18">${card.name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatLore(lore: string): string {
  return lore.trim() === '' || lore === 'ログ断片未設定'
    ? 'ログ断片は未登録です。ムネモシュネ照合後の追記を待っています。'
    : lore;
}

export function PersonaCard({ card, compact = false, onClick }: PersonaCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rarity = rarityTheme[card.rarity];
  const placeholder = useMemo(() => buildPlaceholder(card), [card]);

  return (
    <CardFrame card={card} compact={compact}>
      <button
        className={compact ? 'persona-card is-compact' : 'persona-card'}
        onClick={onClick}
        type="button"
      >
        <div className="persona-card__media">
          <img
            alt={`${card.name} visual log`}
            className="persona-card__image"
            onError={() => setImageFailed(true)}
            src={imageFailed ? placeholder : card.image}
          />
          <div className="persona-card__rarity-tag">{rarity.label}</div>
        </div>
        <div className="persona-card__body">
          <header className="persona-card__header">
            <div>
              <p className="persona-card__student-id">{card.studentId}</p>
              <h3>{card.name}</h3>
              <p className="persona-card__creator">Creator: {card.creator}</p>
            </div>
            <div className="persona-card__pill">{card.rarity}</div>
          </header>
          <dl className="persona-card__meta">
            <div>
              <dt>CLASS</dt>
              <dd>{card.class}</dd>
            </div>
            <div>
              <dt>EIDOLON</dt>
              <dd>{card.eidolon}</dd>
            </div>
          </dl>
          <p className="persona-card__lore">{formatLore(card.lore)}</p>
        </div>
      </button>
    </CardFrame>
  );
}
