'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 491:59 上 Mock up 2/3/4 的 x 座標是相對於 1440 參考寬度算的，
// 三張裡有兩張超出 1440 的畫布邊界（往左或往右出血），不是置中。用 %
// 定位在一個滿版、overflow:hidden 的容器裡，超出的部分真的被裁掉，
// 不縮小塞進來。進場動畫用「單純淡入」（只動 opacity），跟其餘標準
// 進場的 translateY+opacity 不同，是你特別要求的。
const FRAME_W = 1440;

export default function MockupBleed({ src, alt, x, w, h }) {
  const ref = useStandardEntrance(null, { opacityOnly: true });

  return (
    <section className="wb-section">
      <div
        className="wb-mockup-bleed"
        style={{ aspectRatio: `${FRAME_W} / ${h}` }}
        ref={ref}
      >
        <img
          src={src}
          alt={alt}
          className="wb-mockup-bleed-img"
          style={{ left: `${((x / FRAME_W) * 100).toFixed(4)}%`, width: `${((w / FRAME_W) * 100).toFixed(4)}%` }}
        />
      </div>
    </section>
  );
}
