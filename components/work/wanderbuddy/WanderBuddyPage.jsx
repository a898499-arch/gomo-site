'use client';

import './wanderbuddy.css';
import { useNavBehavior } from '@/components/NavBehaviorProvider';
import Hero from '@/components/Hero';
import FlowAnimation from '@/components/FlowAnimation';
import LogoOverview from './LogoOverview';
import DesignChallenge from './DesignChallenge';
import BeforeAfter from './BeforeAfter';
import SignUpFlowStatic from './SignUpFlowStatic';
import Typography from './Typography';
import ColorPalette from './ColorPalette';
import CharactersRow from './CharactersRow';
import CharactersReference from './CharactersReference';
import Shot from './Shot';
import MockupBleed from './MockupBleed';
import ProjectFootage from './ProjectFootage';
import NextWork from '@/components/work/NextWork';

// 依 Figma node 491:59（總高 12907px）由上而下組裝。Nav / Footer 是全站
// 共用元件，已經在 app/layout.js 掛好了，這裡不用重複放。
export default function WanderBuddyPage() {
  // 滿版 Hero 頁面：導覽列進頁時先隱藏，往下滾再往上滾才叫出來，見
  // components/Nav.jsx 上方註解與 NavBehaviorProvider。
  // 滿版 Hero（不留 126px 上留白、導覽列背景透明）改由下面 <div> 的
  // data-nav-bleed + globals.css 的 :has() 規則處理，不再走這個 hook——
  // 走 hook 是 hydration 之後才生效，整頁會往上跳 126px（實測 CLS 0.0875）。
  // startHidden 留著：那是捲動方向的 JS 邏輯，只改 transform，不造成位移。
  // 這一輪只動這一行與下面的屬性，頁面的視覺與動效完全沒碰。
  useNavBehavior({ startHidden: true });

  return (
    // data-nav-bleed 必須留在最外層（globals.css 用直接子層選擇器選它）
    <div className="wb-case" data-nav-bleed>
      {/* y=116 — Hero 用元件本身內建的動畫，不另外加進場效果 */}
      <Hero />

      {/* y=1113 */}
      <LogoOverview />

      {/* 2026-08-16：使用者要求把這段搬到 Design Challenge 前面，跟 Figma
          原稿的 y=4141 順序不同——FlowAnimation 元件本身沒動，只是換位置；
          IntersectionObserver 播放/暫停邏輯在元件內部，跟著搬動不受影響。
          .film 本身沒有 margin/padding（100svh 滿版、自己的背景色），跟前後
          .wb-section 相鄰時原本就是直接色塊交界、沒有額外留白，換到新位置
          後這個交界方式不變，不會突然變擠或變空。 */}
      <FlowAnimation />

      {/* y=1871 */}
      <DesignChallenge />

      {/* y=2811 */}
      <BeforeAfter />

      {/* y=3600 — 靜態資訊圖，用你匯出的 5 個形狀 SVG 重建 */}
      <SignUpFlowStatic />

      {/* y=5039 */}
      <Typography />

      {/* y=5336 */}
      <ColorPalette />

      {/* y=5946 — 向左漂移 */}
      <section className="wb-section">
        <CharactersRow direction="left" />
      </section>

      {/* y=6146 */}
      <CharactersReference />

      {/* y=7116 — 向右漂移 */}
      <section className="wb-section">
        <CharactersRow direction="right" />
      </section>

      {/* y=7323 — 4 支 iPhone，滿版置中，標準進場 */}
      <Shot />

      {/* 2026-08-16：Mock up 3 已移除（使用者不要了）。原本 2 跟 4 都往右
          出血，兩張只剩右邊會失衡，改成一左一右交替：mockup-2 改成往左
          出血（沿用原本 mockup-3 的 x=-84，那組數值已經驗證過視覺效果），
          mockup-4 維持原本往右出血的 x=526 不變。mockup-2 的 src 副檔名
          是 .jpeg（使用者更新圖檔時給的就是這個格式，不是改成 .png 騙副
          檔名）。 */}
      <MockupBleed src="/work/wanderbuddy/mockup-2.jpeg" alt="WanderBuddy mock up 2" x={-84} w={1220} h={812} />
      <MockupBleed src="/work/wanderbuddy/mockup-4.png" alt="WanderBuddy mock up 4" x={526} w={1220} h={814} />

      {/* y=10969 */}
      <ProjectFootage />

      {/* y=11588 */}
      <NextWork currentSlug="wanderbuddy" />
    </div>
  );
}
