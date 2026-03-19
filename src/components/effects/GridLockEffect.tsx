type GridLockEffectProps = {
  active: boolean;
  severe?: boolean;
};

export function GridLockEffect({ active, severe = false }: GridLockEffectProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'effect-grid-lock',
        active ? 'is-active' : '',
        severe ? 'is-severe' : '',
      ].join(' ').trim()}
    />
  );
}
