'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:322（1386.2×313）。這裡刻意例外：Lora/DM Sans 是要展示的
// 對象本身，所以套用真正的 Lora/DM Sans 字重（跟其他區塊「不小心」用到
// 這兩個字體的狀況不同）。字體透過 app/layout.js 的 <link> 全域載入
// （比照 WanderBuddy 頁 Raleway/Jost 的處理方式）。右側的字級量表
// （Display/H1/H2…到 Caption 的字級對照）Figma 原稿是外框化的向量圖形
// （不是可選取文字），用匯出圖檔呈現，跟 Background 區塊圖表同一個
// 處理方式。
export default function Typography() {
  const ref = useStandardEntrance('.ss-entrance-item');

  return (
    <section className="ss-section" ref={ref}>
      <div className="ss-section-inner ss-type-grid">
        <div className="ss-type-text ss-entrance-item">
          <p className="ss-eyebrow" style={{ textAlign: 'left', margin: 0 }}>Typography</p>
          <p className="ss-type-desc">
            Lora for headings, DM Sans for body, both have open letterforms and a tall x-height,
            so characters stay distinct instead of blurring together.
          </p>
          <p className="ss-type-desc ss-type-desc--accent">
            Body text never drops below 16pt, so ageing eyes never have to work for it.
          </p>
        </div>

        <div className="ss-type-swatches ss-entrance-item">
          <div className="ss-type-swatch">
            <p className="ss-type-swatch-name" data-font="lora">Lora</p>
          </div>
          <div className="ss-type-swatch">
            <p className="ss-type-swatch-name" data-font="dm-sans">DM Sans</p>
          </div>
        </div>

        <img
          src="/work/sui-sui/typography-diagram.svg"
          alt="Type scale: Display — Lora 38pt Bold/Medium; H1 — Lora 32pt Bold/Medium; H2 & Button — DM Sans 24pt Bold/Medium; H3 — DM Sans 20pt Bold/Medium; Body Large — DM Sans 18pt Regular; Body — DM Sans 16pt Regular; Caption — DM Sans 14pt Regular"
          className="ss-type-scale ss-entrance-item"
        />
      </div>
    </section>
  );
}
