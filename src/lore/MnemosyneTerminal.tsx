import { useEffect, useMemo, useState } from 'react';
import rawCards from '../../data/cards.json';
import rawCardSources from '../../data/cards_source.json';
import { CardDetailModal } from '../components/card/CardDetailModal';
import { GachaCore } from '../components/gacha/GachaCore';
import { getRarityVisualClass } from '../features/gacha/rarityTable';
import { loadStorage, persistStorage } from '../features/gacha/storage';
import { classNames, rarityOrder } from '../types/card';
import type { CardLog } from '../types/card';
import { SyncLogOverlay } from './SyncLogOverlay';

type CardSource = {
  id: string;
  creator?: string;
};

function isCardLogBase(value: unknown): value is Omit<CardLog, 'creator'> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string'
    && typeof entry.studentId === 'string'
    && typeof entry.name === 'string'
    && typeof entry.eidolon === 'string'
    && typeof entry.lore === 'string'
    && typeof entry.image === 'string'
    && classNames.includes(entry.class as CardLog['class'])
    && rarityOrder.includes(entry.rarity as CardLog['rarity']);
}

function isCardSource(value: unknown): value is CardSource {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string';
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MnemosyneTerminal() {
  const baseCards = useMemo(() => {
    const sourceMap = new Map(
      rawCardSources
        .filter(isCardSource)
        .map((entry) => [entry.id, entry]),
    );

    return rawCards
      .filter(isCardLogBase)
      .map((card) => ({
        ...card,
        creator: sourceMap.get(card.id)?.creator ?? 'Creator Unknown',
      }));
  }, []);

  const [storage, setStorage] = useState(() => loadStorage(baseCards));
  const [displayStorage, setDisplayStorage] = useState(() => loadStorage(baseCards));
  const [syncPresentationLocked, setSyncPresentationLocked] = useState(false);
  const cards = useMemo(
    () => baseCards.map((card) => ({
      ...card,
      rarity: storage.rarityAssignments[card.id] ?? card.rarity,
    })),
    [baseCards, storage.rarityAssignments],
  );
  const [selectedCard, setSelectedCard] = useState<CardLog | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);

  useEffect(() => {
    persistStorage(storage);
  }, [storage]);

  useEffect(() => {
    if (!syncPresentationLocked) {
      setDisplayStorage(storage);
    }
  }, [storage, syncPresentationLocked]);

  const syncedIds = useMemo(() => new Set(storage.syncedLogs), [storage.syncedLogs]);
  const syncedCount = storage.syncedLogs.length;
  const completionRate = cards.length === 0 ? 0 : Math.round((syncedCount / cards.length) * 100);
  const recentHistory = displayStorage.syncHistory.slice(0, 5);
  const totalDraws = Object.values(storage.drawCounts).reduce((sum, count) => sum + count, 0);
  const displayCards = useMemo(
    () => baseCards.map((card) => ({
      ...card,
      rarity: displayStorage.rarityAssignments[card.id] ?? card.rarity,
    })),
    [baseCards, displayStorage.rarityAssignments],
  );
  const lastResultCards = displayStorage.lastSyncResult
    .map((id) => displayCards.find((card) => card.id === id))
    .filter((card): card is CardLog => Boolean(card));
  const rarityRates = useMemo(() => (
    rarityOrder.map((rarity) => {
      const count = cards.filter((card) => card.rarity === rarity).length;
      const rate = cards.length === 0 ? 0 : (count / cards.length) * 100;

      return {
        rarity,
        count,
        rate,
      };
    })
  ), [cards]);

  return (
    <main className="terminal-shell">
      <div className="terminal-shell__backdrop" />
      <section className="terminal-hero">
        <div className="terminal-hero__copy">
          <p className="eyebrow">霧幻学苑セレスティアーク</p>
          <h1>
            <span className="terminal-hero__line">ムネモシュネ・</span>
            <span className="terminal-hero__line">アーカイブ同期端末</span>
          </h1>
          <p className="terminal-hero__lead">
            ムネモシュネに保管された個体ログを呼び出し、再構成して表示するための端末です。
            レアリティは現在の割り振りに基づいて表示され、同じカードが重複して出ることがあります。
          </p>
        </div>

        <div className="terminal-hero__stats">
          <article className="terminal-stat-card">
            <span>UNIQUE LOGS</span>
            <strong>{syncedCount}</strong>
            <small>{cards.length} kinds collected</small>
          </article>
          <article className="terminal-stat-card">
            <span>ARCHIVE COVERAGE</span>
            <strong>{completionRate}%</strong>
            <small>unique collection progress</small>
          </article>
          <article className="terminal-stat-card">
            <span>TOTAL DRAWS</span>
            <strong>{totalDraws}</strong>
            <small>重複を含む累計出現回数</small>
          </article>
        </div>
      </section>

      <div className="terminal-layout">
        <GachaCore
          cards={cards}
          onInspectCard={setSelectedCard}
          onOpenLogBoard={() => setBoardOpen(true)}
          onStorageChange={setStorage}
          onSyncVisibilityChange={setSyncPresentationLocked}
          storage={storage}
        />

        <aside className="terminal-side-column">
          <section className="terminal-panel">
            <header className="terminal-panel__header">
              <div>
                <p className="eyebrow">LAST SYNCHRONIZATION</p>
                <h2>直近ログ</h2>
              </div>
            </header>
            <div className="last-result-list">
              {lastResultCards.length > 0 ? (
                lastResultCards.map((card, index) => (
                  <button
                    className={['last-result-chip', getRarityVisualClass(card.rarity)].join(' ')}
                    key={`${card.id}-${index}`}
                    onClick={() => setSelectedCard(card)}
                    type="button"
                  >
                    <span className={['rarity-badge', getRarityVisualClass(card.rarity)].join(' ')}>{card.rarity}</span>
                    <strong>{card.name}</strong>
                    <small>{card.creator}</small>
                  </button>
                ))
              ) : (
                <p className="muted-copy">まだ同期履歴がありません。まずは「1回同期」を押してください。</p>
              )}
            </div>
          </section>

          <section className="terminal-panel">
            <header className="terminal-panel__header">
              <div>
                <p className="eyebrow">RARITY RATES</p>
                <h2>固定排出率</h2>
              </div>
            </header>
            <div className="rarity-rate-list">
              {rarityRates.map((entry) => (
                <article className="rarity-rate-row" key={entry.rarity}>
                  <span className={['rarity-badge', getRarityVisualClass(entry.rarity)].join(' ')}>
                    {entry.rarity}
                  </span>
                  <div className="rarity-rate-row__details">
                    <strong>{entry.rate.toFixed(1)}%</strong>
                    <small>{entry.count} / {cards.length} logs</small>
                  </div>
                </article>
              ))}
            </div>
            <p className="muted-copy">
              レアリティリセットでは「どのカードがそのレアになるか」だけが変わります。
              排出率そのものはこの固定比率のままです。
            </p>
          </section>

          <section className="terminal-panel">
            <header className="terminal-panel__header">
              <div>
                <p className="eyebrow">SYNC HISTORY</p>
                <h2>履歴</h2>
              </div>
            </header>
            <div className="history-list">
              {recentHistory.length > 0 ? (
                recentHistory.map((entry) => (
                  <article className="history-entry" key={entry.historyId}>
                    <div>
                      <strong>{entry.mode === 'batch' ? '10回同期' : '1回同期'}</strong>
                      <small>{formatTimestamp(entry.timestamp)}</small>
                    </div>
                    <div>
                      <span>{entry.topRarity}</span>
                      <small>{entry.count} draw</small>
                    </div>
                  </article>
                ))
              ) : (
                <p className="muted-copy">同期履歴はここに表示されます。</p>
              )}
            </div>
          </section>

          <section className="terminal-panel">
            <header className="terminal-panel__header">
              <div>
                <p className="eyebrow">QUICK GUIDE</p>
                <h2>使い方</h2>
              </div>
            </header>
            <ul className="keyword-list">
              <li>1回同期: まずは1枚ずつ演出を楽しむ</li>
              <li>10回同期: まとめて結果を見たい時に使う</li>
              <li>コレクション一覧: これまで確認したカードと出現回数を見る</li>
              <li>レアリティリセット: カードごとのレアリティ割り振りを作り直す</li>
              <li>ガチャを初期化: 履歴と出現回数を消して最初から遊び直す</li>
              <li>一覧では x回 表示で重複回数を確認できる</li>
            </ul>
          </section>
        </aside>
      </div>

      {boardOpen && (
        <SyncLogOverlay
          cards={cards}
          drawCounts={storage.drawCounts}
          onClose={() => setBoardOpen(false)}
          onSelect={(card) => {
            setSelectedCard(card);
            setBoardOpen(false);
          }}
          syncedIds={syncedIds}
        />
      )}

      <CardDetailModal
        card={selectedCard}
        drawCount={selectedCard ? storage.drawCounts[selectedCard.id] ?? 0 : 0}
        onClose={() => setSelectedCard(null)}
      />
    </main>
  );
}
