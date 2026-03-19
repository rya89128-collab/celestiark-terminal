type ResidualGlowProps = {
  active: boolean;
  tone?: 'cool' | 'warm';
  intensity?: 'base' | 'high' | 'extreme';
  prismatic?: boolean;
};

export function ResidualGlow({
  active,
  tone = 'cool',
  intensity = 'base',
  prismatic = false,
}: ResidualGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'effect-residual-glow',
        active ? 'is-active' : '',
        tone === 'warm' ? 'is-warm' : '',
        intensity === 'high' ? 'is-high' : '',
        intensity === 'extreme' ? 'is-extreme' : '',
        prismatic ? 'is-prismatic' : '',
      ].join(' ').trim()}
    />
  );
}
