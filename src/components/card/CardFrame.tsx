import type { CSSProperties, PropsWithChildren } from 'react';
import { getRarityVisualClass, rarityTheme } from '../../features/gacha/rarityTable';
import type { CardLog } from '../../types/card';
import { getClassPalette } from '../../utils/classColor';

type CardFrameProps = PropsWithChildren<{
  card: CardLog;
  compact?: boolean;
}>;

export function CardFrame({ card, compact = false, children }: CardFrameProps) {
  const palette = getClassPalette(card.class);
  const rarity = rarityTheme[card.rarity];
  const style = {
    '--card-accent': palette.accent,
    '--card-glow': palette.glow,
    '--card-muted': palette.muted,
    '--rarity-accent': rarity.accent,
    '--rarity-glow': rarity.glow,
  } as CSSProperties;

  return (
    <article
      className={[
        compact ? 'persona-card-frame is-compact' : 'persona-card-frame',
        getRarityVisualClass(card.rarity),
      ].join(' ')}
      style={style}
    >
      {children}
    </article>
  );
}
