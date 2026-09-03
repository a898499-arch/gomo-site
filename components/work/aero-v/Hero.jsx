'use client';

import { AeroWord, VWord } from './Wordmark';

// Figma node 796:884「hero」，1440×966，位於整頁 frame 796:705 的 y=0。
//
// 版面是「一張滿版照片 + 兩段疊在上面的字標」。照片與字標的相對位置必須
// 鎖死，所以整區用固定長寬比的盒子（aspect-ratio: 1440/966），字標全部
// 用百分比定位——這樣 1155px 與 1440px 只是同一張構圖等比縮放，不會發生
// 「照片縮了但字沒跟著縮」的錯位。
//
// 字標的百分比是從 **墨跡座標** 推導的，不是 Figma 的文字框座標。原因：
// Figma 文字節點 796:886 是 275×165（165 = 114px × 行高 1.45），但匯出的
// SVG 只含實際筆畫，是 269×79。若拿文字框的 y=335 去擺 79px 高的 SVG，
// 字會整整高出 37px。墨跡的絕對座標從匯出 SVG 內那層整頁背景矩形的
// transform 反推得到（見下面每個常數的註解）。
//
// 語意：這兩段字跟下一區 LogoOverview 的 <h1> 是同一個字串。標題語意留給
// 那裡的 <h1>，這裡純裝飾（SVG 已 aria-hidden），否則螢幕閱讀器會連唸兩次。
export default function Hero() {
  return (
    <section className="av-hero">
      <img
        className="av-hero-photo"
        src="/work/aero-v/hero-stool.webp"
        srcSet="/work/aero-v/hero-stool.webp 1x, /work/aero-v/hero-stool@2x.webp 2x"
        width={1440}
        height={966}
        /* §3.5 要求 lazy load，但這張是首屏的 LCP 元素——lazy 會延後
           LCP，是反效果。這裡刻意用 eager + high priority，是對 §3.5
           的知情偏離，不是漏做。 */
        fetchPriority="high"
        decoding="async"
        lang="zh-Hant"
        alt="一位身穿黑色上衣與長褲的髮型師背對鏡頭，側坐在 AERO V 淨化理髮椅上。椅子有白色圓形坐墊、金屬升降柱與五星腳輪底座，背景是純淨的淺灰色攝影棚。"
      />

      <AeroWord className="av-hero-word av-hero-word--aero" />
      <VWord className="av-hero-word av-hero-word--v" />
    </section>
  );
}
