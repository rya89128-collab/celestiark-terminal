import type { PropsWithChildren } from 'react';

type ChromaShiftProps = PropsWithChildren<{
  active: boolean;
  intense?: boolean;
}>;

export function ChromaShift({ active, intense = false, children }: ChromaShiftProps) {
  return (
    <div
      className={[
        'effect-chroma-shift',
        active ? 'is-active' : '',
        intense ? 'is-intense' : '',
      ].join(' ').trim()}
    >
      {children}
    </div>
  );
}
