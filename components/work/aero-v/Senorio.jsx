'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:903「senorio」，1237×830，位於整頁 frame 796:705 的
// x=102 y=4527。裡面只有一個子節點 796:904，是一張填滿整框的圖，沒有文字、
// 沒有遮罩層、沒有動效——單純顯示。
//
// ⚠️ 不是滿版、也不等於內容欄寬：Figma 是 1237 寬置中在 1440 頁面上
// （左右各 101.5，metadata 記 x=102）。.page-container 在 1440 時的內容寬是
// 1360，所以這張圖是 1237 / 1360 = 90.9559%，比內容欄再往內縮一點。
// 用百分比而不是寫死 1237px，窄視窗才會跟著等比縮小、維持設計稿的比例關係。
//
// 素材 senorio.jpg 是 2528×1696，正好是 1237×830 的 2.04x，所以 @2x 直接用，
// 1x 縮成 1237×830。
export default function Senorio() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <img
          className="av-senorio av-entrance-item"
          src="/work/aero-v/senorio.webp"
          srcSet="/work/aero-v/senorio.webp 1x, /work/aero-v/senorio@2x.webp 2x"
          width={1237}
          height={830}
          loading="lazy"
          decoding="async"
          alt="明亮的髮廊室內情境，米白色調的空間中央擺著一張 AERO V 白色圓座凳，五爪滾輪底座為鍍鉻材質。左側是理髮椅與整面落地鏡，右側有兩面環形燈鏡台，後方一位髮型師走動的身影帶著動態模糊。"
        />
      </div>
    </section>
  );
}
