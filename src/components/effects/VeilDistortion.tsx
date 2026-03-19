type VeilDistortionProps = {
  active: boolean;
  severe?: boolean;
};

export function VeilDistortion({ active, severe = false }: VeilDistortionProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'effect-veil-distortion',
        active ? 'is-active' : '',
        severe ? 'is-severe' : '',
      ].join(' ').trim()}
    />
  );
}
