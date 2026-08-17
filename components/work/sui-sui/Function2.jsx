'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:510（1507×961）。已經有真實手機截圖，照 Figma 座標還原
// （% 定位，跟 WanderBuddy 的 SignUpFlowStatic 同一個作法）。背景那塊
// 裝飾用的紅色暈染圖形（Vector164/165，mix-blend-mode:overlay）簡化
// 成單張置中的裝飾圖，不逐點還原 Figma 原本的負值 inset 出血範圍。
const FRAME_W = 1507;
const FRAME_H = 961;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctY = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;

const BADGES = [
  { key: 'course', label: 'Course preview', x: 264, y: 303, w: 154 },
  { key: 'scanning', label: 'Product scanning', x: 656, y: 194, w: 167 },
  { key: 'library', label: 'Product library', x: 1051, y: 13, w: 149, bold: true },
];

export default function Function2() {
  const ref = useStandardEntrance();

  return (
    <section className="ss-section" ref={ref}>
      <div className="ss-section-inner">
        <div className="ss-fn2-frame" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
          <img
            src="/work/sui-sui/function2-bg-blend.png"
            alt=""
            aria-hidden="true"
            className="ss-fn2-bg-blend"
            style={{ left: pctX(263), top: pctY(150), width: pctX(1244) }}
          />

          <div className="ss-fn2-text" style={{ top: pctY(0), width: pctX(885) }}>
            <p className="ss-eyebrow" style={{ margin: 0, color: '#b8001f' }}>Function 2</p>
            <h2 className="ss-fn2-title">Product recognition</h2>
            <p className="ss-fn2-desc">
              Users photograph or scan the products already on their dressing table. The app
              recognises and sorts them automatically, so every routine is built around what
              someone owns, not what they&rsquo;re expected to buy.
            </p>
          </div>

          <img
            src="/work/sui-sui/function2-intro-page.png"
            alt="Phone screen showing a Morning Glow routine preview with toner, face cream, and cotton pad"
            className="ss-fn2-phone"
            style={{ left: pctX(220), top: pctY(349), width: pctX(241) }}
          />
          <img
            src="/work/sui-sui/function2-products-overview.png"
            alt="Phone screen scanning a skincare product with camera, showing photo and barcode options"
            className="ss-fn2-phone"
            style={{ left: pctX(595), top: pctY(235), width: pctX(290) }}
          />
          <img
            src="/work/sui-sui/function2-phone-main.png"
            alt="Phone screen showing a saved product library of skincare and makeup items"
            className="ss-fn2-phone ss-fn2-phone--main"
            style={{ left: pctX(937), top: pctY(51), width: pctX(469.945) }}
          />

          {BADGES.map(({ key, label, x, y, w, bold }) => (
            <span
              key={key}
              className="ss-fn2-badge"
              style={{
                left: pctX(x),
                top: pctY(y),
                width: pctX(w),
                fontWeight: bold ? 600 : 400,
                fontSize: bold ? '16px' : '14px',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
