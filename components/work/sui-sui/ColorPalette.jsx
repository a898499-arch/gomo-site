'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:288（1366×613）。2026-08-17：用 get_design_context 重讀重做——
// 上一輪把這裡簡化成統一格狀排版，使用者沒有同意，這是 Figma 原稿真正
// 的樣子：三個直欄，每欄內色塊高度各自不同，磚牆式堆疊，不是格狀。
// 座標、顏色、hex 字色全部照 get_design_context 讀到的值，用 % 定位讓
// 整段隨容器寬度等比縮放（原始框 1366×613 是設計稿的實際大小，不是我
// 自己設的）。
const FRAME_W = 1366;
const FRAME_H = 613;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctY = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;
const pctW = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctH = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;

// x/y/w/h、hex、字色（textColor）逐一取自 get_design_context 的座標與
// 各自 hex label 的實際顏色（不是統一假設亮/暗字，Figma 上每個色塊字色
// 是分別指定的，例如 #9D000F 上用的是 #D9D9D9 不是 #F5F5F5）。
const SWATCHES = [
  // 第一欄（x=0, w=403）
  { hex: '#FFCBD4', x: 0, y: 0, w: 403, h: 123, textColor: '#303030' },
  { hex: '#F7546C', x: 0, y: 123, w: 403, h: 121, textColor: '#303030' },
  { hex: '#E8002C', x: 0, y: 244, w: 403, h: 122, textColor: '#f5f5f5' },
  { hex: '#CB0013', x: 0, y: 366, w: 403, h: 247, textColor: '#f5f5f5' },
  // 第二欄（x=402, w=402）
  { hex: '#9D000F', x: 402, y: 0, w: 402, h: 198, textColor: '#d9d9d9' },
  { hex: '#70000C', x: 402, y: 198, w: 402, h: 109, textColor: '#d9d9d9' },
  { hex: '#440008', x: 402, y: 306, w: 402, h: 116, textColor: '#d9d9d9' },
  { hex: '#905500', x: 402, y: 422, w: 402, h: 60, textColor: '#d9d9d9' },
  { hex: '#FFF6DC', x: 402, y: 482, w: 402, h: 131, textColor: '#303030' },
  // 第三欄（x=804, w=177）
  { hex: '#DDF9DD', x: 804, y: 0, w: 177, h: 108, textColor: '#303030' },
  { hex: '#00600A', x: 804, y: 108, w: 177, h: 193, textColor: '#d9d9d9' },
  { hex: '#66B8C7', x: 804, y: 301, w: 177, h: 121, textColor: '#303030' },
  { hex: '#87D2FF', x: 804, y: 422, w: 177, h: 92, textColor: '#303030' },
  { hex: '#004D82', x: 804, y: 514, w: 177, h: 99, textColor: '#d9d9d9' },
];

export default function ColorPalette() {
  const ref = useStandardEntrance('.ss-color-swatch');

  return (
    <section className="ss-section">
      {/* 2026-08-17：改用跟導覽列同一個 .page-container（同一個
          --page-gutter 變數），左緣對齊 nav 的 GOMO logo 左緣、右緣對齊
          About Me 右緣，不再用 .ss-section-inner 自己的 1280 上限。 */}
      <div className="page-container">
        <div className="ss-color-frame" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }} ref={ref}>
          {SWATCHES.map((s) => (
            <div
              key={s.hex}
              className="ss-color-swatch"
              style={{
                left: pctX(s.x),
                top: pctY(s.y),
                width: pctW(s.w),
                height: pctH(s.h),
                background: s.hex,
                color: s.textColor,
              }}
            >
              <span>{s.hex}</span>
            </div>
          ))}

          {/* 標題＋兩段說明文字：Figma 上在第三欄右側，垂直約在中段
              （x=1013,y=335,w=353），不是在最上方。 */}
          <div
            className="ss-color-text"
            style={{ left: pctX(1013), top: pctY(335), width: pctW(353) }}
          >
            <p className="ss-color-title">Color</p>
            <p className="ss-color-text-muted">
              Red, taken from Shiseido, the company that has run cosmetic therapy in some 400 care
              facilities in Japan since 2013.
            </p>
            <p className="ss-color-text-accent">
              Every text and background pairing clears WCAG AA (4.5:1), so it stays legible for
              ageing eyes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
