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
import ProcessAnimation from './ProcessAnimation';
import Function1 from './Function1';
import Function2 from './Function2';
import Hero from './Hero';
import Function4 from './Function4';
import HandWarmUp from '@/components/HandWarmUp/HandWarmUp';
import MockupFade from './MockupFade';
import WorkFootage from './WorkFootage';
import NextWork from './NextWork';

// 依 Figma node 545:47（作品頁＿suisui，總高 17899px）由上而下組裝，
// 用 MCP 讀完整份結構後排序，不是照使用者原本給的清單（那份少列了
// Background 跟 Cosmetic Therapy Intro 兩區，也把 Before & After 的
// node id 弄錯了，都已經口頭確認過修正）。Nav / Footer 是全站共用元件，
// 已經在 app/layout.js 掛好了。
//
// 動畫區塊清單（2026-08-22 更新，spec/GOMO-規格書.md 裡沒有這份清單，
// 這裡是唯一的記錄——已跟你回報過）：
// - Process Animation：真實內容，見 ProcessAnimation.jsx（你做好的 UI
//   輪播動畫，iframe 載入 public/work/sui-sui/ui-carousel/carousel.html）。
// - Function 1：真實內容，見 Function1.jsx（含你做好的 onboarding
//   演示動畫，見 OnboardingDemo.jsx）。
// - Function 3：真實內容，見 components/HandWarmUp/HandWarmUp.jsx（你
//   做好的 self-contained 元件，素材在 public/web-assets/）。
// - Function 4：真實內容，見 Function4.jsx（Figma 匯出的手機拼貼圖
//   public/work/sui-sui/shot.webp / shot@2x.webp）。
// - All UI Animation：整段移除，不留佔位塊（你的指示——這區內容已經
//   搬去 Function 1 了，跟這裡的「Setup in three questions」標題語意
//   對得上，跟原本的 All UI Animation 佔位標籤對不上）。
export default function SuiSuiPage() {
  // 滿版 Hero（不留 126px 上留白、導覽列背景透明）改由下面 <div> 的
  // data-nav-bleed + globals.css 的 :has() 規則處理，不再走這個 hook——
  // 走 hook 是 hydration 之後才生效，整頁會往上跳 126px（實測 CLS 0.0875）。
  // startHidden 留著：那是捲動方向的 JS 邏輯，CSS 表達不了，而且只改
  // transform，不造成位移。
  useNavBehavior({ startHidden: true });

  return (
    // data-nav-bleed 必須留在最外層（globals.css 用直接子層選擇器選它）
    <div className="ss-case" data-nav-bleed>
      {/* y=116～1086，970px 高 = 16 + 736 + 218。內容是新檔
          j4saimg2oJWL5tUkBh5Bww 的 node 2472:1023「Frame 50」（1064×736）。
          舊註解說「沒有專屬 Figma node」是對舊檔 web-ui_clean 而言，新檔
          有這一區，見 Hero.jsx 檔頭。 */}
      <Hero />

      {/* y=1086 */}
      <LogoOverview />

      {/* y=1796 — node 545:532，1450×900 */}
      <ProcessAnimation />

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
      <Function1 />

      {/* y=8620 — node 545:510，已有真實手機截圖 */}
      <Function2 />

      {/* y=9687 — node 545:127，1440×907，「Hand warm-up」。2026-08-24：
          換成你做好的 self-contained 元件（components/HandWarmUp/），素材
          在 public/web-assets/。元件自己已經有 <section> 外框跟標題區，
          不用再另外包一層 .ss-section。 */}
      <HandWarmUp assets="/web-assets" />

      {/* y=10751 — node 2198:5191（新檔 j4saimg2oJWL5tUkBh5Bww），1440×918。
          舊檔的 545:118 已不存在，見 Function4.jsx 檔頭。 */}
      <Function4 />

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
