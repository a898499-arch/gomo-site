// ⚠️ 這一支「不是」client component（沒有 'use client'）。
// DesignProcess 要在伺服器端讀 process-flow.svg 才能 inline，而 client
// component 不能 import server component——所以這一層必須留在伺服器端。
// 這一頁本來就沒有任何 hook 或事件處理，不需要 client。
import './goodmood.css';
import Opening from './Opening';
import Overview from './Overview';
import DefineBeforeIBuild from './DefineBeforeIBuild';
import DesignProcess from './DesignProcess';
import MakingAssets01 from './MakingAssets01';
import MakingAssets02 from './MakingAssets02';
import WhereAIFellShort from './WhereAIFellShort';
import WhatThisChanged from './WhatThisChanged';
import Closing from './Closing';
import NextWork from '@/components/work/NextWork';

// Goodmood 作品詳情頁——這個網站本身的 case study。
// Figma：檔案 j4saimg2oJWL5tUkBh5Bww，整頁 frame 2343:129（1440×11831）。
//
// ⚠️ 這一頁「沒有」滿版 hero：開場是置中的標記 + 標題群，從 Figma y=200
// 開始。所以最外層**不加** data-nav-bleed、也**不呼叫** useNavBehavior，
// 走的是 app/about/page.js 那一套（保留 .page-content 的 126px 上留白），
// 不同於 AERO V / Sui-Sui / WanderBuddy。
//
// ⚠️ 各區在 Figma 的寬度刻意不一致，不要整成同一個欄寬（使用者 2026-09-01
// 確認）：1160 / 1283 / 1366 / 1344 / 1234 / 1347 / 1048。
export default function GoodmoodPage() {
  return (
    <div className="gm-case">
      {/* 2955:2665  y=200   1160×625 */}
      <Opening />

      {/* 3337:3227  y=1209  1283×217 */}
      <Overview />

      {/* 3337:3222  y=1811  1366×970 */}
      <DefineBeforeIBuild />

      {/* 3337:3221  y=3017  1366×1169 */}
      <DesignProcess />

      {/* 3337:3223  y=4422  1344×937 ＋ Figma 沒有的前後對比滑軌 */}
      <MakingAssets01 />

      {/* 3337:3224  y=5595  1234×1593。三個框裡是原元件的副本，見
          components/work/goodmood/motion/ 各檔的檔頭。 */}
      <MakingAssets02 />

      {/* 3337:3228  y=8174  1347×1762  四支嘗試影片 + 最終版錄影 + Fig 6/7 */}
      <WhereAIFellShort />

      {/* 3245:2843  y=10348  1048×247  純文字，沒有圖也沒有動效 */}
      <WhatThisChanged />

      {/* 標記 3337:3286 + 收尾句 3337:3283/3285。
          ⚠️ 這三個節點不在整頁 frame 裡，座標系不同——見 Closing.jsx 檔頭。 */}
      <Closing />

      {/* 全站共用的那一支，不為這一頁另做（3337:3287「More Project」）。 */}
      <NextWork currentSlug="goodmood" />

    </div>
  );
}
