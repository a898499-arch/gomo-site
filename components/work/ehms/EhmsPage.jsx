'use client';

import './ehms.css';
import Hero from './Hero';
import LogoOverview from './LogoOverview';
import Overview from './Overview';
import DesignChallenge from './DesignChallenge';
import DesignProcess from './DesignProcess';
import KeyDecisions from './KeyDecisions';
import WhatILearned from './WhatILearned';
import Today from './Today';
import Outcome from './Outcome';
import NextWork from '@/components/work/NextWork';

// 依 Figma node 912:58（作品頁＿ehms，1440×14011）由上而下組裝。
// 檔案 5HAqwzDuPvXLvX0WG6VPfP。全站文字量最大的一頁。
//
// ⚠️ Nav / Footer 用全站共用元件（已掛在 app/layout.js）。
// 這頁 Figma 上的 Nav 還是「Works / about me / Contact Me」、Footer 的
// SITEMAPS 還是「Home Works playground Contact」、還有「CV Downlaod」
// 錯字——一律不照這頁的 Figma 重做。
//
// ⚠️ Hero 不是滿版，Figma 從 y=124 開始（導覽列 116 + 8），所以不加
// data-nav-bleed，走 .page-content 預設的 126px 上留白。
//
// 三個「Figma 上有、但刻意不做」的東西（都經使用者裁示）：
//   912:99  「overview section」——hidden=true 的隱藏圖層
//   912:100 「Vector 207」——y=7487 的孤立水平線，穿過 Before 卡片中央，
//            是遺留雜線
//   912:127 「project footage」——內容與 Logo & Overview 一字不差的未完成
//            複製稿，同一段文字在頁上出現兩次比少一區糟
//   912:364  Design Process 裡的空 overview frame（1085×41，無內容）
//
// 第二／三輪待做（這一輪刻意沒有）：
//   第二輪 Hero 捲動視差、Before/After 對照推桿（複用 AERO V 的元件，
//          After 在檔案 j4saimg2oJWL5tUkBh5Bww 的 node 4020:5191）
//   第三輪 Design System 輪播（共 8 頁，node id 見 DesignSystem.jsx）、
//          五個狀態動畫（幀序列，素材待放進 public/work/ehms/states/）
// 導覽列（Maida 2026-09-16 裁示，這一頁是全站唯一的組合）：
//   data-nav-bleed  → .page-content 不留 126px 上留白、導覽列背景**完全透明**
//   不呼叫 useNavBehavior → 走全站預設：**進頁就顯示**、往下滾隱藏、往上滾
//                          出現、fixed 不佔版面空間
//
// ⚠️ 刻意**沒有** startHidden。sui-sui / aero-v / wanderbuddy 那三頁是
// 「透明 + 進頁先隱藏」，這一頁是「透明 + 進頁就顯示」。不要看到 nav-bleed
// 就順手把 startHidden 加回來，那三頁維持現狀，只有這一頁不一樣。
// ⚠️ 也沒有任何背景色或毛玻璃——透明是要的效果，不是漏掉。
// ⚠️ 2026-09-16 曾短暫改成 data-nav-inflow（sticky、實體佔版面高度），
// 該做法已整個撤銷，globals.css 那兩條規則也一併移除。
//
// ⚠️ 上留白必須由 data-nav-bleed 的 :has() 規則處理，不可以改成用 hook 在
// hydration 之後翻 class——SSR 的 HTML 沒有那個 class，會先用 126px 排一次
// 版再跳成 0，實測三頁都吃到 CLS（見 globals.css 該段註解）。
export default function EhmsPage() {
  return (
    // data-nav-bleed 必須留在最外層（globals.css 用直接子層選擇器選它）
    <div className="eh-case" data-nav-bleed>
      {/* y=124 — node 912:59（拼貼）+ 912:371 / 912:370（疊在上面的標題與 tagline）*/}
      <Hero />

      {/* y=1056 — node 912:101 */}
      <LogoOverview />

      {/* y=1800.6 — node 912:137，含三張卡與卡下方的 My Role（912:174）*/}
      <Overview />

      {/* y=2761.6 — node 912:177 */}
      <DesignChallenge />

      {/* y=3643.6 — node 912:205，含 DESIGN SYSTEM、流程圖、Key Features */}
      <DesignProcess />

      {/* y=6951 — node 912:372 / 912:388 / 912:394 / 912:405 四個平行 frame */}
      <KeyDecisions />

      {/* y=10087 — node 912:412 */}
      <WhatILearned />

      {/* y=10624 — node 912:419 */}
      <Today />

      {/* y=10959 — node 912:426 */}
      <Outcome />

      {/* y=12692 — node 912:434，共用元件，資料從 works.json */}
      <NextWork currentSlug="ehms" />
    </div>
  );
}
