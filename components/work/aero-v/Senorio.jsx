'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:903「senorio」，1237×830，位於整頁 frame 796:705 的
// x=102 y=4527。裡面只有一個子節點 796:904，是一張填滿整框的圖，沒有文字、
// 沒有遮罩層、沒有動效——單純顯示。
//
// ⚠️ 寬度刻意偏離 Figma：Figma 是 1237 寬置中在 1440 頁面上（x=102），
// 但使用者 2026-08-28 指定要**對齊導覽列的寬度**，也就是跟 .page-container
// 同寬（1440 時 1360）。所以 .av-senorio 是 width:100%，比 Figma 寬 123px。
// senorio2 同樣處理，兩者共用 .av-senorio。
//
// 素材 senorio.jpg 是 2528×1696；顯示寬改成 1360 之後，1x 重出成 1360×913、
// @2x 用原生 2528×1696（= 1.86x，沒有假放大）。
export default function Senorio() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <img
          className="av-senorio av-entrance-item"
          src="/work/aero-v/senorio.webp"
          srcSet="/work/aero-v/senorio.webp 1x, /work/aero-v/senorio@2x.webp 2x"
          width={1360}
          height={913}
          loading="lazy"
          decoding="async"
          lang="zh-Hant"
          alt="明亮的髮廊室內情境，米白色調的空間中央擺著一張 AERO V 白色圓座凳，五爪滾輪底座為鍍鉻材質。左側是理髮椅與整面落地鏡，右側有兩面環形燈鏡台，後方一位髮型師走動的身影帶著動態模糊。"
        />
      </div>
    </section>
  );
}
