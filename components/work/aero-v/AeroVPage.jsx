'use client';

import './aero-v.css';
import { useNavBehavior } from '@/components/NavBehaviorProvider';
import Hero from './Hero';
import LogoOverview from './LogoOverview';
import Background from './Background';
import Solution from './Solution';
import SketchToPrototype from './SketchToPrototype';
import Senorio from './Senorio';

// AERO V 作品詳情頁。依 Figma node 796:705「作品頁＿aero v」（1440×10266）
// 由上而下組裝，區塊順序與 y 座標是用 MCP 讀完整份結構後排出來的。
// Nav / Footer 是全站共用元件，已經在 app/layout.js 掛好，這裡不碰。
//
// ⚠️ node id note：使用者最初給的是 794:* 那一組，但檔案裡實際是 796:*
// （794:407 / 794:582 / 794:416 在這個檔案中不存在）。已按圖層名稱與尺寸
// 逐一核對確認對應關係，並回報過。下面註解一律用實際存在的 796:*。
export default function AeroVPage() {
  // 滿版 hero：不留 .page-content 的 126px 上留白、導覽列背景透明——這兩件
  // 事由最外層的 data-nav-bleed + globals.css 的 :has() 規則處理，「不」走
  // 這個 hook（走 hook 是 hydration 之後才生效，整頁會往上跳 126px）。
  // startHidden 留著：那是捲動方向的 JS 邏輯，CSS 表達不了，只改 transform，
  // 不造成位移。比照 SuiSuiPage.jsx 現行寫法。
  useNavBehavior({ startHidden: true });

  return (
    // data-nav-bleed 必須留在最外層（globals.css 用直接子層選擇器選它）
    <div className="av-case" data-nav-bleed>
      {/* y=0 — node 796:884，1440×966 */}
      <Hero />

      {/* y=1126 — node 796:714，1160×501 */}
      <LogoOverview />

      {/* y=1721 — node 796:766，1440×978，滿版出血 */}
      <Background />

      {/* y=2754 — node 796:743，1359×825。Figma 圖層名是「airflow」，但這區
          的標題是 SOLUTION，且 796:784 還有另一個同名區塊，故命名為
          Solution，之後那一區才叫 Airflow。 */}
      <Solution />

      {/* y=3750 — node 796:888，1352×565。三欄不規則配置＋三格照片輪播。 */}
      <SketchToPrototype />

      {/* y=4527 — node 796:903，1237×830。單純一張大圖。 */}
      <Senorio />

      {/* 以下六區分輪做，順序已由 796:705 的完整結構確認。每輪只要在這裡
          補一個元件、把對應那行註解換成元件即可，不需要重讀 Figma 排序：
            y=5446  FEATURES                          796:938  1360×737
            y=6430  Dimensions                        796:907  1178×691
            y=7350  airflow                           796:784  1280×658
            y=8144  senorio2                          796:905  1237×830
            y=9309  work footage                      796:738  1160×206

          node 796:713「overview section」（1360×502）是 hidden 的舊灰底
          佔位，不做——跟 Sui-Sui 那個 #d9d9d9 佔位同一種。 */}
    </div>
  );
}
