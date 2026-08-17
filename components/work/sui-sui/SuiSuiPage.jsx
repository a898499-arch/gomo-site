'use client';

import './sui-sui.css';
import { useNavBehavior } from '@/components/NavBehaviorProvider';
import AnimationPlaceholder from './AnimationPlaceholder';
import LogoOverview from './LogoOverview';
import Background from './Background';
import CosmeticTherapyIntro from './CosmeticTherapyIntro';
import DesignChallenge from './DesignChallenge';
import BeforeAfter from './BeforeAfter';
import ColorPalette from './ColorPalette';
import Typography from './Typography';
import Function2 from './Function2';
import MockupFade from './MockupFade';
import WorkFootage from './WorkFootage';
import NextWork from './NextWork';

// 依 Figma node 545:47（作品頁＿suisui，總高 17899px）由上而下組裝，
// 用 MCP 讀完整份結構後排序，不是照使用者原本給的清單（那份少列了
// Background 跟 Cosmetic Therapy Intro 兩區，也把 Before & After 的
// node id 弄錯了，都已經口頭確認過修正）。這一輪只做骨架：五個動畫
// 區塊（Process Animation / Function 1 / Function 3 / Function 4 /
// All UI Animation）先用灰色佔位塊擋位，其餘都是照 Figma 實作的真實
// 內容。Nav / Footer 是全站共用元件，已經在 app/layout.js 掛好了。
export default function SuiSuiPage() {
  useNavBehavior({ startHidden: true, fullBleedTop: true });

  return (
    <div className="ss-case">
      {/* y=116～1086，970px 高。沒有專屬 Figma node，純粹是 Nav 底到
          Logo & Overview 頂的空隙，你指定要用灰色佔位塊擋這一整片。 */}
      <AnimationPlaceholder label="Hero" height={970} />

      {/* y=1086 */}
      <LogoOverview />

      {/* y=1796 — node 545:532，1450×900 */}
      <section className="ss-section">
        <AnimationPlaceholder label="Process Animation" w={1450} h={900} />
      </section>

      {/* y=2756 — node 545:139，讀完整結構才發現的區塊，你確認過要做 */}
      <Background />

      {/* y=3656 — node 545:182，同上 */}
      <CosmeticTherapyIntro />

      {/* y=4542 — node 545:86（圖層名拼錯成 "Dsign challenge"，標題文字
          以 Figma 實際內容為準） */}
      <DesignChallenge />

      {/* y=5492 — node 545:247（正確 node id，你原本給的 545:139 其實是
          上面的 Background 統計區） */}
      <BeforeAfter />

      {/* y=6312 */}
      <ColorPalette />

      {/* y=7085 */}
      <Typography />

      {/* y=7558 — node 545:110，1440×918 */}
      <section className="ss-section">
        <AnimationPlaceholder label="Function 1" w={1440} h={918} />
      </section>

      {/* y=8620 — node 545:510，已有真實手機截圖 */}
      <Function2 />

      {/* y=9687 — node 545:127，1440×907 */}
      <section className="ss-section">
        <AnimationPlaceholder label="Function 3" w={1440} h={907} />
      </section>

      {/* y=10751 — node 545:118，1440×918 */}
      <section className="ss-section">
        <AnimationPlaceholder label="Function 4" w={1440} h={918} />
      </section>

      {/* y=11818 — node 545:530，1446×924 */}
      <section className="ss-section">
        <AnimationPlaceholder label="All UI Animation" w={1446} h={924} />
      </section>

      {/* y≈12861/13914/14930。2026-08-17：改用 get_design_context 讀
          545:47 底下 Mockup1/2/3 的實際 x 座標（相對 1440 參考寬），不再
          統一置中——Mockup1 x=109（跟置中的 95 差 14px，Figma 原稿本來就
          不是正中央）、Mockup2 x=13（w=1434，右緣超出 1440 邊界 7px，會被
          .ss-mockup-clip 裁掉）、Mockup3 x=0（左緣貼齊頁面最左邊）。
          w/h：Mockup1／Mockup2 是 get_design_context 重讀確認過的值。
          Mockup3 你給的 1440×832 對到的其實是組合裡「手機截圖遮罩」的
          裁切尺寸（mask-size），不是 Mockup3 外層 frame 自己的大小
          （Figma 目前這個 frame 本身量出來是 1454×899）——這裡先維持
          1454×899，等你確認要哪一個再改。淡入淡出動畫比照 WanderBuddy 的
          scrubbed 做法（見 MockupFade.jsx）。 */}
      <MockupFade src="/work/sui-sui/mockup-1.png" alt="Sui-Sui mockup 1: an older woman using the app while doing her makeup at a mirror" x={109} w={1250} h={937} />
      <MockupFade src="/work/sui-sui/mockup-2.png" alt="Sui-Sui mockup 2" x={13} w={1434} h={900} />
      <MockupFade src="/work/sui-sui/mockup-3.png" alt="Sui-Sui mockup 3" x={0} w={1454} h={899} />

      {/* y=15747 */}
      <WorkFootage />

      {/* y=16580 */}
      <NextWork currentSlug="sui-sui" />
    </div>
  );
}
