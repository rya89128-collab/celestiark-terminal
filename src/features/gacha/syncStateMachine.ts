import type { CardLog, Rarity } from '../../types/card';
import type { SequenceStep } from '../../types/sync';

type SequenceOptions = {
  rarity: Rarity;
  forced: boolean;
  mode: 'single' | 'batch';
};

const baseSteps: Record<'normal' | 'ssr' | 'ur', SequenceStep[]> = {
  normal: [
    { phase: 'authentication', label: 'GLYPH AUTHENTICATION', durationMs: 480 },
    { phase: 'interference', label: 'MNEMOSYNE LINK', durationMs: 620 },
    { phase: 'reconstruction', label: 'LOG RECONSTRUCTION', durationMs: 720 },
    { phase: 'window', label: 'SYNC WINDOW FORMING', durationMs: 520 },
    { phase: 'reveal', label: 'LOG MANIFESTATION', durationMs: 980 },
    { phase: 'complete', label: 'SYNC COMPLETE', durationMs: 0 },
  ],
  ssr: [
    { phase: 'authentication', label: 'GLYPH AUTHENTICATION', durationMs: 560 },
    { phase: 'interference', label: 'DATA DEFECT DETECTED', durationMs: 760 },
    { phase: 'reconstruction', label: 'LOG RECONSTRUCTION', durationMs: 880 },
    { phase: 'window', label: 'ARCHIVE PLAYBACK FRAME', durationMs: 760 },
    { phase: 'video', label: 'MNEMOSYNE PLAYBACK', durationMs: 3_200 },
    { phase: 'hold', label: 'FRAME STABILIZATION', durationMs: 320 },
    { phase: 'reveal', label: 'SYNC COMPLETE', durationMs: 1_120 },
    { phase: 'complete', label: 'RESULT MANIFEST', durationMs: 0 },
  ],
  ur: [
    { phase: 'authentication', label: 'GLYPH AUTHENTICATION', durationMs: 620 },
    { phase: 'interference', label: 'VEIL INTERFERENCE', durationMs: 900 },
    { phase: 'reconstruction', label: 'RECONSTRUCTION RING', durationMs: 980 },
    { phase: 'window', label: 'HIGH OUTPUT LOG FRAME', durationMs: 800 },
    { phase: 'video', label: 'RESTRICTED PLAYBACK', durationMs: 3_000 },
    { phase: 'hold', label: 'SYNC OVERRUN', durationMs: 420 },
    { phase: 'reveal', label: 'SYNC COMPLETE', durationMs: 1_300 },
    { phase: 'complete', label: 'RESULT MANIFEST', durationMs: 0 },
  ],
};

function getSequenceKey(rarity: Rarity): 'normal' | 'ssr' | 'ur' {
  if (rarity === 'UR') {
    return 'ur';
  }

  if (rarity === 'SSR') {
    return 'ssr';
  }

  return 'normal';
}

export function buildSequenceSteps({ rarity, forced, mode }: SequenceOptions): SequenceStep[] {
  const template = baseSteps[getSequenceKey(rarity)];
  const scalar = forced ? 0.42 : mode === 'batch' ? 0.88 : 1;

  return template.map((step) => ({
    ...step,
    durationMs: step.phase === 'complete' ? 0 : Math.max(180, Math.round(step.durationMs * scalar)),
    label: forced && step.phase === 'authentication' ? 'FORCED SYNC' : step.label,
  }));
}

export function getHighlight(results: readonly CardLog[]): CardLog {
  return [...results].sort((left, right) => {
    const rank = ['N', 'R', 'SR', 'SSR', 'UR'];
    return rank.indexOf(right.rarity) - rank.indexOf(left.rarity);
  })[0];
}
