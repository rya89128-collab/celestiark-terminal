import { useState } from 'react';
import type { Rarity } from '../../types/card';
import { getVideoPath } from '../../utils/video';

type GachaVideoProps = {
  rarity: Rarity;
  onFallback: () => void;
};

export function GachaVideo({ rarity, onFallback }: GachaVideoProps) {
  const [failed, setFailed] = useState(false);
  const src = getVideoPath(rarity);

  if (!src || failed) {
    return (
      <div className="gacha-video gacha-video--fallback">
        <div className="gacha-video__chrome">
          <span>PLAYBACK SUBSTITUTE</span>
          <strong>{rarity} LOG</strong>
        </div>
        <div className="gacha-video__fallback-body">
          <div className="gacha-video__fallback-core" />
          <p>映像記録に接続できません。残留フレームから再構成を継続します。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gacha-video">
      <div className="gacha-video__chrome">
        <span>MNEMOSYNE PLAYBACK</span>
        <strong>{rarity} LOG</strong>
      </div>
      <video
        autoPlay
        className="gacha-video__player"
        muted
        onError={() => {
          setFailed(true);
          onFallback();
        }}
        playsInline
        src={src}
      />
      <div className="gacha-video__hud">
        <span>ARCHIVE TRACE ACTIVE</span>
        <span>RECONSTRUCTION CHANNEL OPEN</span>
      </div>
    </div>
  );
}
