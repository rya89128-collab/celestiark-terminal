export const classNames = [
  'Eldam',
  'Valkein',
  'Speculato',
  'Novalt',
  'Profeil',
] as const;

export const rarityOrder = ['N', 'R', 'SR', 'SSR', 'UR'] as const;

export type ClassName = (typeof classNames)[number];
export type Rarity = (typeof rarityOrder)[number];

export type CardLog = {
  id: string;
  studentId: string;
  name: string;
  creator: string;
  eidolon: string;
  class: ClassName;
  rarity: Rarity;
  lore: string;
  image: string;
};
