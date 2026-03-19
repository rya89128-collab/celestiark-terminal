import { getRarityVisualClass } from '../../features/gacha/rarityTable';
import type { SyncSession } from '../../types/sync';
import { CardReveal3D } from '../card/CardReveal3D';
import { ChromaShift } from '../effects/ChromaShift';
import { GridLockEffect } from '../effects/GridLockEffect';
import { ParticleField } from '../effects/ParticleField';
import { ResidualGlow } from '../effects/ResidualGlow';
import { ScanlineOverlay } from '../effects/ScanlineOverlay';
import { ScreenFlash } from '../effects/ScreenFlash';
import { ScreenShake } from '../effects/ScreenShake';
import { VeilDistortion } from '../effects/VeilDistortion';
import { GachaVideo } from './GachaVideo';

type GachaSequenceProps = {
  session: SyncSession;
  currentPhase: SyncSession['steps'][number];
  phaseIndex: number;
  onInspect: (cardId: string) => void;
  onVideoFallback: () => void;
};

export function GachaSequence({
  session,
  currentPhase,
  phaseIndex,
  onInspect,
  onVideoFallback,
}: GachaSequenceProps) {
  const showVideo = currentPhase.phase === 'video' || currentPhase.phase === 'hold';
  const showReveal = currentPhase.phase === 'reveal' || currentPhase.phase === 'complete';
  const showBurst = currentPhase.phase === 'interference' || currentPhase.phase === 'hold' || currentPhase.phase === 'reveal';
  const warmTone = session.topRarity === 'SSR' || session.topRarity === 'UR';
  const premiumOutput = session.topRarity === 'SSR' || session.topRarity === 'UR';
  const ultraOutput = session.topRarity === 'UR';
  const rareOutput = session.topRarity === 'SR' || premiumOutput;
  const flashIntensity = ultraOutput ? 'extreme' : premiumOutput ? 'high' : 'base';
  const glowIntensity = ultraOutput ? 'extreme' : premiumOutput ? 'high' : 'base';

  return (
    <section
      className={[
        'gacha-sequence',
        `phase-${currentPhase.phase.toLowerCase()}`,
        getRarityVisualClass(session.topRarity),
        premiumOutput ? 'is-premium-output' : '',
        ultraOutput ? 'is-ultra-output' : '',
      ].join(' ')}
    >
      <ScreenFlash
        active={showBurst}
        intensity={flashIntensity}
        prismatic={ultraOutput}
        tone={warmTone ? 'warm' : 'cool'}
      />
      <VeilDistortion active={currentPhase.phase === 'interference'} severe={session.topRarity === 'UR'} />
      <GridLockEffect active={currentPhase.phase !== 'idle'} severe={session.topRarity === 'UR'} />
      <ResidualGlow
        active={showReveal || currentPhase.phase === 'hold' || currentPhase.phase === 'video'}
        intensity={glowIntensity}
        prismatic={ultraOutput}
        tone={warmTone ? 'warm' : 'cool'}
      />
      <ParticleField
        active
        burst={showBurst}
        dense={rareOutput}
        prismatic={ultraOutput}
        warm={warmTone}
      />
      <ScreenShake active={session.topRarity === 'UR' && currentPhase.phase === 'hold'}>
        <ChromaShift
          active={currentPhase.phase === 'interference' || currentPhase.phase === 'hold'}
          intense={premiumOutput}
        >
          <div className="gacha-sequence__frame">
            <ScanlineOverlay />
            <div className={['gacha-sequence__rarity-aura', getRarityVisualClass(session.topRarity)].join(' ')} />
            {rareOutput && (
              <div
                className={[
                  'gacha-sequence__energy-rings',
                  premiumOutput ? 'is-premium' : '',
                  ultraOutput ? 'is-ultra' : '',
                ].join(' ').trim()}
              >
                <span />
                <span />
                <span />
                {premiumOutput && <span />}
              </div>
            )}
            <header className="gacha-sequence__header">
              <div>
                <span className="eyebrow">MNEMOSYNE ARCHIVE LINK</span>
                <strong>{currentPhase.label}</strong>
              </div>
              <div className="gacha-sequence__progress">
                <span>{String(phaseIndex + 1).padStart(2, '0')}</span>
                <small>/{String(session.steps.length).padStart(2, '0')}</small>
              </div>
            </header>

            <div className="gacha-sequence__viewport">
              {!showVideo && !showReveal && (
                <div className="gacha-sequence__diagnostics">
                  <div className="diagnostic-circle" />
                  <div className="diagnostic-bars">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>
                    ヴェイル干渉下のログ断片を照合し、再構成フレームを形成しています。
                  </p>
                </div>
              )}
              {showVideo && (
                <GachaVideo onFallback={onVideoFallback} rarity={session.topRarity} />
              )}
              {showReveal && (
                <CardReveal3D
                  active
                  card={session.highlight}
                  onInspect={() => onInspect(session.highlight.id)}
                />
              )}
            </div>

            <footer className="gacha-sequence__footer">
              {currentPhase.phase === 'complete' ? (
                <>
                  <span>TOP LOG: {session.highlight.name}</span>
                  <span>RECONSTRUCTED OUTPUT: {session.topRarity}</span>
                </>
              ) : (
                <>
                  <span>LOG RECONSTRUCTION IN PROGRESS</span>
                  <span>RESULT HIDDEN UNTIL SYNC COMPLETE</span>
                </>
              )}
            </footer>
          </div>
        </ChromaShift>
      </ScreenShake>
    </section>
  );
}
