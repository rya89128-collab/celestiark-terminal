type ScreenFlashProps = {
  active: boolean;
  tone?: 'cool' | 'warm';
  intensity?: 'base' | 'high' | 'extreme';
  prismatic?: boolean;
};

export function ScreenFlash({
  active,
  tone = 'cool',
  intensity = 'base',
  prismatic = false,
}: ScreenFlashProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'effect-screen-flash',
        active ? 'is-active' : '',
        tone === 'warm' ? 'is-warm' : '',
        intensity === 'high' ? 'is-high' : '',
        intensity === 'extreme' ? 'is-extreme' : '',
        prismatic ? 'is-prismatic' : '',
      ].join(' ').trim()}
    />
  );
}
