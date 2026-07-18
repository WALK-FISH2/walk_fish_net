import { Assets, type Texture } from "pixi.js";
import bubbleClustersUrl from "../../assets/m5-5/bubble-clusters.png";
import foamBandFrontUrl from "../../assets/m5-5/foam-band-front.png";
import foamBandMidUrl from "../../assets/m5-5/foam-band-mid.png";
import waveBackUrl from "../../assets/m5-5/wave-back.png";
import waveFrontUrl from "../../assets/m5-5/wave-front.png";
import waveMidUrl from "../../assets/m5-5/wave-mid.png";

export type M55WaveTextures = {
  waveBack: Texture;
  waveMid: Texture;
  waveFront: Texture;
  foamBandFront: Texture;
  foamBandMid: Texture;
  bubbleClusters: Texture;
};

export async function loadM55WaveTextures(): Promise<M55WaveTextures> {
  const [waveBack, waveMid, waveFront, foamBandFront, foamBandMid, bubbleClusters] = await Promise.all([
    Assets.load<Texture>(waveBackUrl),
    Assets.load<Texture>(waveMidUrl),
    Assets.load<Texture>(waveFrontUrl),
    Assets.load<Texture>(foamBandFrontUrl),
    Assets.load<Texture>(foamBandMidUrl),
    Assets.load<Texture>(bubbleClustersUrl),
  ]);

  return { waveBack, waveMid, waveFront, foamBandFront, foamBandMid, bubbleClusters };
}
