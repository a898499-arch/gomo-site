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
import NextWork from './NextWork';

// 依 Figma node 491:59（總高 12907px）由上而下組裝。Nav / Footer 是全站
// 共用元件，已經在 app/layout.js 掛好了，這裡不用重複放。
export default function WanderBuddyPage() {
  // 滿版 Hero 頁面：導覽列進頁時先隱藏，往下滾再往上滾才叫出來，見
  // components/Nav.jsx 上方註解與 NavBehaviorProvider。
  useNavBehavior({ startHidden: true });

  return (
    <div className="wb-case">
      {/* y=116 — Hero 用元件本身內建的動畫，不另外加進場效果 */}
      <Hero />

      {/* y=1113 */}
      <LogoOverview />

      {/* y=1871 */}
      <DesignChallenge />

      {/* y=2811 */}
      <BeforeAfter />

      {/* y=3600 — 靜態資訊圖，用你匯出的 5 個形狀 SVG 重建 */}
      <SignUpFlowStatic />

      {/* y=4141 — embed/ 的動畫元件，照 README 接，保留內建的
          IntersectionObserver 播放/暫停與 reduced-motion 邏輯 */}
      <FlowAnimation />

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

      {/* y=8291 / 9134 / 9978 — 依 Figma 座標出血，單純淡入 */}
      <MockupBleed src="/work/wanderbuddy/mockup-2.png" alt="WanderBuddy mock up 2" x={247} w={1220} h={812} />
      <MockupBleed src="/work/wanderbuddy/mockup-3.png" alt="WanderBuddy mock up 3" x={-84} w={1220} h={813} />
      <MockupBleed src="/work/wanderbuddy/mockup-4.png" alt="WanderBuddy mock up 4" x={526} w={1220} h={814} />

      {/* y=10969 */}
      <ProjectFootage />

      {/* y=11588 */}
      <NextWork currentSlug="wanderbuddy" />
    </div>
  );
}
