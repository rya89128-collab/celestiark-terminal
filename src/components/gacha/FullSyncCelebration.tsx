type FullSyncCelebrationProps = {
  totalCards: number;
  onClose: () => void;
};

export function FullSyncCelebration({ totalCards, onClose }: FullSyncCelebrationProps) {
  return (
    <div className="full-sync-celebration" role="presentation">
      <div className="full-sync-celebration__panel">
        <div className="full-sync-celebration__aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="full-sync-celebration__sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">CONGRATULATIONS</p>
        <p className="full-sync-celebration__supertitle">ARCHIVE ASCENSION</p>
        <h2>FULL SYNC COMPLETE</h2>
        <p>
          ムネモシュネに記録された全 {totalCards} 種の個体ログとの同期が完了しました。
          学苑端末は全件照合状態へ移行します。
        </p>
        <div className="full-sync-celebration__burst" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="full-sync-celebration__rings">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="full-sync-celebration__milestone">
          <strong>{totalCards}</strong>
          <span>ALL LOGS SYNCHRONIZED</span>
        </div>
        <button onClick={onClose} type="button">
          記録を見る
        </button>
      </div>
    </div>
  );
}
