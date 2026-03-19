import type { PropsWithChildren } from 'react';

type ScreenShakeProps = PropsWithChildren<{
  active: boolean;
}>;

export function ScreenShake({ active, children }: ScreenShakeProps) {
  return (
    <div className={active ? 'effect-screen-shake is-active' : 'effect-screen-shake'}>
      {children}
    </div>
  );
}
