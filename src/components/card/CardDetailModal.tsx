import type { CardLog } from '../../types/card';
import { PersonaCard } from './PersonaCard';

type CardDetailModalProps = {
  card: CardLog | null;
  drawCount?: number;
  onClose: () => void;
};

export function CardDetailModal({ card, drawCount = 0, onClose }: CardDetailModalProps) {
  if (!card) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-label="同期ログ詳細"
        className="modal-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-panel__header">
          <div>
            <p className="eyebrow">SYNCHRONIZED LOG DETAIL</p>
            <h2>{card.name}</h2>
          </div>
          <button onClick={onClose} type="button">
            CLOSE
          </button>
        </header>
        <div className="modal-panel__content">
          <PersonaCard card={card} />
          <div className="modal-panel__notes">
            <div className="terminal-detail">
              <span>ARCHIVE ID</span>
              <strong>{card.id}</strong>
            </div>
            <div className="terminal-detail">
              <span>GLYPH ID</span>
              <strong>{card.studentId}</strong>
            </div>
            <div className="terminal-detail">
              <span>CREATOR</span>
              <strong>{card.creator}</strong>
            </div>
            <div className="terminal-detail">
              <span>DRAW COUNT</span>
              <strong>{drawCount} 回</strong>
            </div>
            <div className="terminal-detail">
              <span>CLASS</span>
              <strong>{card.class}</strong>
            </div>
            <div className="terminal-detail">
              <span>EIDOLON</span>
              <strong>{card.eidolon}</strong>
            </div>
            <div className="terminal-detail">
              <span>RARITY</span>
              <strong>{card.rarity}</strong>
            </div>
            <div className="terminal-detail is-block">
              <span>LOG FRAGMENT</span>
              <strong>
                {card.lore === 'ログ断片未設定'
                  ? 'ログ断片は未登録です。追加入力待機。'
                  : card.lore}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
