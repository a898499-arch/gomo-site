'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:905「senorio2」，1237×830，位於整頁 frame 796:705 的
// y=8144。跟 796:903「senorio」完全同一種結構：裡面只有一個子節點
// 796:906，一張填滿整框、置中的圖，沒有文字也沒有動效。
//
// 尺寸與定位跟前一個 senorio 一模一樣（1237 置中於 1440），所以直接沿用
// .av-senorio 這個 class，不另外開一套一樣的樣式。
//
// 素材 senorio2.jpg 是 2528×1696，正好是 1237×830 的 2.04x，
// 所以 @2x 用 2474×1660（不放大），1x 縮成 1237×830。
export default function Senorio2() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <img
          className="av-senorio av-entrance-item"
          src="/work/aero-v/senorio2.webp"
          srcSet="/work/aero-v/senorio2.webp 1x, /work/aero-v/senorio2@2x.webp 2x"
          width={1237}
          height={830}
          loading="lazy"
          decoding="async"
          alt="米白色調的髮廊室內，畫面中央是一張 AERO V 白色圓座凳，鍍鉻五爪滾輪底座與透明集髮罩清晰可見。左右兩側各有一面落地鏡與米色理髮椅，一位身著棕色上衣、黑色長裙的人正從座凳後方走過，身影帶著動態模糊。"
        />
      </div>
    </section>
  );
}
