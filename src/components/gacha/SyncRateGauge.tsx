type SyncRateGaugeProps = {
  label: string;
  value: number;
  tone?: 'cool' | 'warm';
};

export function SyncRateGauge({ label, value, tone = 'cool' }: SyncRateGaugeProps) {
  return (
    <div className="sync-rate-gauge">
      <div className="sync-rate-gauge__header">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className={tone === 'warm' ? 'sync-rate-gauge__track is-warm' : 'sync-rate-gauge__track'}>
        <div className="sync-rate-gauge__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
