'use client';

import './wanderbuddy.css';
import Hero from '@/components/Hero';
import FlowAnimation from '@/components/FlowAnimation';
import LogoOverview from './LogoOverview';
import DesignChallenge from './DesignChallenge';
import BeforeAfter from './BeforeAfter';
import SignUpFlowStatic from './SignUpFlowStatic';
import Typography from './Typography';
import ColorPalette from './ColorPalette';
import MockPlaceholder from './MockPlaceholder';
import AssetPending from './AssetPending';
import ProjectFootage from './ProjectFootage';
import NextWork from './NextWork';

// 依 Figma node 491:59（總高 12907px）由上而下組裝。Nav / Footer 是全站
// 共用元件，已經在 app/layout.js 掛好了，這裡不用重複放。
export default function WanderBuddyPage() {
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

      {/* y=3600 — 靜態資訊圖（簡化版，見元件內註解） */}
      <SignUpFlowStatic />

      {/* y=4141 — embed/ 的動畫元件，照 README 接，保留內建的
          IntersectionObserver 播放/暫停與 reduced-motion 邏輯 */}
      <FlowAnimation />

      {/* y=5039 */}
      <Typography />

      {/* y=5336 */}
      <ColorPalette />

      {/* y=5946 / 6146 / 7116 / 7323 — 等待你提供 Characters 兩列、
          Characters Reference、Shot 的真實素材，先留提示框 */}
      <AssetPending label="Characters（向左漂移）" height={130} />
      <AssetPending label="Characters Reference" height={600} />
      <AssetPending label="Characters（向右漂移）" height={130} />
      <AssetPending label="Shot" height={600} />

      {/* y=8291 / 9134 / 9978 */}
      <MockPlaceholder ratio="1220 / 812" />
      <MockPlaceholder ratio="1220 / 813" />
      <MockPlaceholder ratio="1220 / 814" />

      {/* y=10969 */}
      <ProjectFootage />

      {/* y=11588 */}
      <NextWork currentSlug="wanderbuddy" />
    </div>
  );
}
