import type { CardLog } from '../../types/card';
import { PersonaCard } from './PersonaCard';

type CardReveal3DProps = {
  card: CardLog;
  active: boolean;
  onInspect?: () => void;
};

export function CardReveal3D({ card, active, onInspect }: CardReveal3DProps) {
  return (
    <div className={active ? 'card-reveal-3d is-active' : 'card-reveal-3d'}>
      <div className="card-reveal-3d__halo" />
      <PersonaCard card={card} onClick={onInspect} />
    </div>
  );
}
