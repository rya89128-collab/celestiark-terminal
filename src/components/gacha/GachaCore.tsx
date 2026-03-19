import { useEffect, useMemo, useRef, useState } from 'react';
import { createEmptyStorage, resetRarityState } from '../../features/gacha/storage';
import { executeSync } from '../../features/gacha/syncEngine';
import type { CardLog } from '../../types/card';
import type { StorageSnapshot, SyncSession } from '../../types/sync';
import { downloadNodeAsPng } from '../../utils/export';
import { FullSyncCelebration } from './FullSyncCelebration';
import { GachaSequence } from './GachaSequence';
import { SyncResultPanel } from './SyncResultPanel';

type GachaCoreProps = {
  cards: CardLog[];
  storage: StorageSnapshot;
  onStorageChange: (next: StorageSnapshot) => void;
  onInspectCard: (card: CardLog) => void;
  onOpenLogBoard: () => void;
  onSyncVisibilityChange: (isRunning: boolean) => void;
};

const RESULT_LOG_DELAY_MS = 900;

function getCardById(cards: readonly CardLog[], cardId: string): CardLog | null {
  return cards.find((card) => card.id === cardId) ?? null;
}

export function GachaCore({
  cards,
  storage,
  onStorageChange,
  onInspectCard,
  onOpenLogBoard,
  onSyncVisibilityChange,
}: GachaCoreProps) {
  const [session, setSession] = useState<SyncSession | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [tempo, setTempo] = useState(1);
  const [videoFallback, setVideoFallback] = useState(false);
  const [showFullSyncCelebration, setShowFullSyncCelebration] = useState(false);
  const resultCaptureRef = useRef<HTMLDivElement | null>(null);

  const currentStep = session?.steps[Math.min(phaseIndex, (session?.steps.length ?? 1) - 1)] ?? null;
  const isRunning = Boolean(session && currentStep && currentStep.phase !== 'complete');
  const lastResultCards = useMemo(
    () => storage.lastSyncResult
      .map((id) => getCardById(cards, id))
      .filter((card): card is CardLog => Boolean(card)),
    [cards, storage.lastSyncResult],
  );
  const totalDraws = useMemo(
    () => Object.values(storage.drawCounts).reduce((sum, count) => sum + count, 0),
    [storage.drawCounts],
  );

  useEffect(() => {
    if (!session || !currentStep || currentStep.phase === 'complete') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPhaseIndex((current) => Math.min(current + 1, session.steps.length - 1));
    }, Math.max(120, Math.round(currentStep.durationMs * tempo)));

    return () => window.clearTimeout(timeoutId);
  }, [currentStep, session, tempo]);

  useEffect(() => {
    if (!session || !currentStep) {
      onSyncVisibilityChange(false);
      return undefined;
    }

    if (currentStep.phase !== 'complete') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onSyncVisibilityChange(false);
    }, RESULT_LOG_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [currentStep, onSyncVisibilityChange, session]);

  const startSync = (count: number, forced: boolean) => {
    if (cards.length === 0 || isRunning) {
      return;
    }

    onSyncVisibilityChange(true);
    const execution = executeSync(cards, storage, count, forced);
    const justCompletedAll = storage.syncedLogs.length < cards.length
      && execution.storage.syncedLogs.length === cards.length
      && !storage.fullSyncCelebrated;
    const nextStorage = justCompletedAll
      ? { ...execution.storage, fullSyncCelebrated: true }
      : execution.storage;

    onStorageChange(nextStorage);
    setSession(execution.session);
    setPhaseIndex(0);
    setTempo(1);
    setVideoFallback(false);
    setShowFullSyncCelebration(justCompletedAll);
  };

  const inspectResult = (cardId: string) => {
    const target = getCardById(cards, cardId);

    if (target) {
      onInspectCard(target);
    }
  };

  const resetRarity = () => {
    if (isRunning || !window.confirm('カードごとのレアリティ割り振りを作り直します。現在の進行状態は残ります。続けますか？')) {
      return;
    }

    onStorageChange(resetRarityState(storage, cards));
    setSession(null);
    setPhaseIndex(0);
    setTempo(1);
    setVideoFallback(false);
    setShowFullSyncCelebration(false);
  };

  const resetEverything = () => {
    if (isRunning || !window.confirm('ガチャ履歴、出現回数、既読演出をすべて初期化します。続けますか？')) {
      return;
    }

    onStorageChange(createEmptyStorage(cards));
    setSession(null);
    setPhaseIndex(0);
    setTempo(1);
    setVideoFallback(false);
    setShowFullSyncCelebration(false);
  };

  const handleDownloadResult = async () => {
    if (!session || !resultCaptureRef.current) {
      return;
    }

    await downloadNodeAsPng(
      resultCaptureRef.current,
      `celestiark-result-${session.topRarity}-${session.sessionId}`,
    );
  };

  const lastSummary = lastResultCards.length > 0
    ? `${lastResultCards.length}件の結果を保存中`
    : 'まだ同期していません';
  const showMobileFollowupActions = Boolean(session && currentStep?.phase === 'complete');

  return (
    <section className="gacha-core">
      <div
        className={[
          'terminal-panel',
          'terminal-panel--main',
          showMobileFollowupActions ? 'has-mobile-followup-actions' : '',
        ].join(' ')}
      >
        <header className="terminal-panel__header">
          <div>
            <p className="eyebrow">MNEMOSYNE ARCHIVE TERMINAL</p>
            <h2>同期を始める</h2>
          </div>
        </header>

        <p className="control-copy">
          1回同期は1件ずつの照合、10回同期は一括で複数ログを呼び出すモードです。
        </p>

        <div className="mobile-sync-summary">
          <article className="mobile-sync-summary__item">
            <span>集めた種類</span>
            <strong>{storage.syncedLogs.length} / {cards.length}</strong>
          </article>
          <article className="mobile-sync-summary__item">
            <span>累計出現</span>
            <strong>{totalDraws} 回</strong>
          </article>
        </div>

        <div className="control-guide">
          <article className="control-guide__stat">
            <span>集めた種類</span>
            <strong>{storage.syncedLogs.length} / {cards.length}</strong>
          </article>
          <article className="control-guide__stat">
            <span>累計出現回数</span>
            <strong>{totalDraws} 回</strong>
          </article>
          <article className="control-guide__stat">
            <span>前回の状態</span>
            <strong>{lastSummary}</strong>
          </article>
        </div>

        <div className="terminal-actions terminal-actions--primary">
          <button disabled={isRunning} onClick={() => startSync(1, false)} type="button">
            1回同期
          </button>
          <button disabled={isRunning} onClick={() => startSync(10, false)} type="button">
            10回同期
          </button>
          <button className="ghost-button" onClick={onOpenLogBoard} type="button">
            コレクション一覧
          </button>
        </div>

        {isRunning && (
          <div className="terminal-actions terminal-actions--secondary">
            <button className="ghost-button" onClick={() => setTempo(0.16)} type="button">
              演出を短縮
            </button>
            <p className="action-note">
              結果は変わりません。今動いている演出だけを短くします。
            </p>
          </div>
        )}

        {session && currentStep && (
          <>
            {currentStep.phase === 'complete' && (
              <div className="result-export-stage" aria-hidden="true">
                <div className="result-export-shot" ref={resultCaptureRef}>
                  <GachaSequence
                    currentPhase={currentStep}
                    onInspect={() => {}}
                    onVideoFallback={() => {}}
                    phaseIndex={phaseIndex}
                    session={session}
                  />
                </div>
              </div>
            )}

            <div className="result-capture">
              <GachaSequence
                currentPhase={currentStep}
                onInspect={inspectResult}
                onVideoFallback={() => setVideoFallback(true)}
                phaseIndex={phaseIndex}
                session={session}
              />

              {currentStep.phase === 'complete' && (
                <div className="terminal-actions terminal-actions--primary mobile-followup-actions">
                  <button onClick={() => startSync(1, false)} type="button">
                    1回同期
                  </button>
                  <button onClick={() => startSync(10, false)} type="button">
                    10回同期
                  </button>
                  <button className="ghost-button" onClick={onOpenLogBoard} type="button">
                    コレクション一覧
                  </button>
                </div>
              )}

              {currentStep.phase === 'complete' && (
                <SyncResultPanel
                  onDownload={handleDownloadResult}
                  onInspect={inspectResult}
                  session={session}
                />
              )}
            </div>

            {currentStep.phase === 'complete' && showFullSyncCelebration && (
              <FullSyncCelebration
                onClose={() => setShowFullSyncCelebration(false)}
                totalCards={cards.length}
              />
            )}
          </>
        )}

        <div className="terminal-actions terminal-actions--maintenance">
          <button className="ghost-button" disabled={isRunning} onClick={resetRarity} type="button">
            レアリティリセット
          </button>
          <button className="ghost-button" disabled={isRunning} onClick={resetEverything} type="button">
            ガチャを初期化
          </button>
        </div>

        <p className="action-note">
          レアリティリセットは「どのカードが UR / SSR / SR になるか」を作り直します。
          ガチャを初期化は出現履歴と回数を消して最初から遊び直します。
        </p>
        <p className="action-note">
          映像演出が読み込めない場合は、自動で簡易演出に切り替わります。
          現在の状態: {videoFallback ? '簡易演出' : '通常演出'}
        </p>

        <details className="mobile-utility-drawer">
          <summary>詳細設定を開く</summary>
          <div className="terminal-actions terminal-actions--maintenance">
            <button className="ghost-button" disabled={isRunning} onClick={resetRarity} type="button">
              レアリティリセット
            </button>
            <button className="ghost-button" disabled={isRunning} onClick={resetEverything} type="button">
              ガチャを初期化
            </button>
          </div>
          <p className="action-note">
            レアリティリセットは「どのカードが UR / SSR / SR になるか」を作り直します。
          </p>
          <p className="action-note">
            ガチャを初期化は出現履歴と回数を消して最初から遊び直します。
          </p>
          <p className="action-note">
            現在の状態: {videoFallback ? '簡易演出' : '通常演出'}
          </p>
        </details>
      </div>
    </section>
  );
}
