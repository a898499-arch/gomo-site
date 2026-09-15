'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:59「Hero」，1064×736，位於整頁 frame 912:58 的 y=124。
//
// 拼貼是整塊切圖（九宮格照片 + 深綠 App icon 卡 + 字體樣張），不拆。
// 標題 912:371 與 tagline 912:370 在 Figma 是 **frame 層級** 的元素，
// 不在 Hero frame 裡，疊在拼貼上方——所以切圖裡沒有這兩段字，
// 它們在這裡是真正的 DOM 文字（可選取、可被搜尋引擎讀到）。
//
// ⚠️ 第二輪要做的 Hero 捲動視差不在這裡，這一輪只有標準進場。
export default function Hero() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-hero eh-col" ref={ref} aria-labelledby="eh-hero-title">
      <img
        className="eh-hero-collage eh-in"
        src="/work/ehms/hero-collage.webp"
        srcSet="/work/ehms/hero-collage.webp 1x, /work/ehms/hero-collage@2x.webp 2x"
        width={1064}
        height={736}
        /* 首屏 LCP 元素：刻意用 eager + high priority，不 lazy load。
           跟 aero-v/Hero.jsx 同一個理由，是對 §3.5 的知情偏離。 */
        fetchPriority="high"
        decoding="async"
        alt="eHMS 產品拼貼：長者與家屬在智慧氣墊床上閱讀、長者交握的雙手特寫、手持手機操作 App 的畫面、深綠色 App 圖示卡、四色綠色色票、綠葉背景，以及一張標示「微軟正黑體」的字體樣張與五支並排的 App 畫面截圖。"
      />

      <div className="eh-hero-text">
        {/* 頁面主標題。Logo & Overview 區裡的「eHMS 2.0」是同一個字串的
            視覺重複，那裡用 <p>，標題語意只留在這裡一處。 */}
        <h1 className="eh-hero-title eh-in" id="eh-hero-title">
          eHMS 2.0
        </h1>
        <p className="eh-hero-tagline eh-in">
          An app nurses use to control a pressure-relief mattress.
        </p>
      </div>
    </section>
  );
}
