'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:907「Dimensions」，1360×691，位於整頁 frame 796:705 的
// x=40 y=6430。
//
// 2026-08-28 使用者在 Figma 改版，這一輪跟著改的東西：
//   · 整區 1178 → 1360 寬，也就是**與內容欄同寬**。原本「靠左、右邊留
//     222px」的不對稱消失了，CSS 的 86.6176% 一併拿掉。
//   · 渲染圖 x=491 → 571，並換成另一張（Figma 裡帶 −167.88° 旋轉 + 垂直翻轉
//     的新算圖），所以 stool-structure.webp 重新匯出過。
//   · 十個標籤與十條引線全部重排（y 座標沒變，只有 x 變）。
//   · 標題 y=540 → 511，內文 y=581 → 552、欄寬 494 → 483。
//
// ⚠️ 渲染圖的匯出方式（踩過坑，換圖時要照做）：
// 不能用 download_assets —— 它會把整頁的 #F5F5F5 底色烤進去（實測整張匯出的
// alpha 全部是 255），貼到米色頁面上就是一塊灰板。get_screenshot 保留透明，
// 但**不會放大**，只給得到 1x。所以現在這張是「3x 的 download_assets 匯出圖
// ÷ 已知平底色 245 反算 alpha」合成的：alpha 取自 1x 的 get_screenshot 放大，
// RGB 用 fg = (composite − 245×(1−a)) / a 還原。合成結果在米色底上沒有灰框
// 也沒有光暈。Figma 裡的 Rectangle 258 只是遮罩底，設計上沒有灰色板。
//
// ── 10 個標籤、10 條引線 ──
// （原指示寫「12 個標籤、11 條引線」，實際清點是 10 / 10：796:919–927 是 9 個
//  節點加上 796:937 共 10 條，另外兩個文字節點是下方的標題與段落。已回報。）
//
// 關鍵結構：**每條引線的 y 恰好等於它那個標籤文字框的垂直中心**，10 條全部
// 吻合在 0.5px 內（例如 Seat Cushion 文字框 y=91 高 41 → 中心 111.5，
// 線 796:919 的 y=111）。改版後這個關係依然成立，已重新逐條核對。
//
// 10 條線畫在**同一張 inline SVG** 裡，viewBox 就是整區的 1360×691 座標系。
// 拆成 10 個各自定位的元素會有 10 次對不準的機會；共用一個 viewBox 則端點
// 必然互相對齊，而且渲染圖也用同一套百分比定位，端點與零件的關係被鎖死。
// 標籤是獨立的 <div>（文字要可選取），不進 SVG。
//
// ── 左側四個標籤用「右對齊」定位 ──
// ⚠️ 刻意偏離 Figma 的絕對 left 值。理由：實際渲染的字寬跟 Figma 的量測不會
// 一樣，用 left 定位會讓標籤右緣去撞引線的起點；改成把「右緣」釘在
// 「引線起點 − Figma 的間距」，不論字寬多少，標籤與線的距離都固定。
// 右側六個維持 left 定位（往右是空白，撐長也不會撞到東西）。
export default function Dimensions() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <div className="av-dim-frame av-entrance-item">
          {/* 796:908「stool structure」x=571 y=0 379×681。
              ⚠️ 去背圖，底下不要墊底色。來源 1137×2043 正好是 3.00x，
              但那張匯出圖的底色是烤進去的，已用反算 alpha 去掉（見檔頭）。 */}
          <img
            className="av-dim-render"
            src="/work/aero-v/stool-structure.webp"
            srcSet="/work/aero-v/stool-structure.webp 1x, /work/aero-v/stool-structure@2x.webp 2x"
            width={379}
            height={681}
            loading="lazy"
            decoding="async"
            lang="zh-Hant"
            alt="AERO V 座凳的完整結構渲染圖，由上而下依序是白色圓形座墊、伸縮柱身、淺綠色的 HEPA 濾芯、圓盤狀氣流導板，以及裝有集髮罐的五爪滾輪底座。"
          />

          {/* 10 條引線。stroke 與 stroke-width 是從 Figma 匯出的 SVG 檔讀的：
              九條直線 #5B5B5B、折線 796:937 是 #6E6E6E，兩者確實不同色——
              判斷是設計稿的疏漏，但照原樣還原並在此標註。 */}
          <svg
            className="av-dim-leaders"
            viewBox="0 0 1360 691"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <g stroke="#5B5B5B" strokeWidth="0.5">
              {LEADERS.map(([x1, y1, x2, y2, id]) => (
                <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
            {/* 796:937「Vector 199」x=780 y=128 230×28 —— 唯一一條有折彎的。
                路徑照匯出檔原樣（改版後重抓）：先 45° 下斜 28px，再水平 199.4px。
                ⚠️ fill="none" 不可省略：<path> 的 fill 預設是黑色，少了這個屬性
                這條折線會被填成一個黑色實心三角形（實際踩過）。另外九條是
                <line>，沒有可填的封閉區域，所以不受影響。 */}
            <path
              d="M780.17 128.18L810.72 156.18H1010.17"
              fill="none"
              stroke="#6E6E6E"
              strokeWidth="0.5"
            />
          </svg>

          {LABELS_RIGHT.map((l) => (
            <span className={`av-dim-label av-dim-label--${l.key}`} key={l.key}>
              {l.text}
            </span>
          ))}
          {LABELS_LEFT.map((l) => (
            <span
              className={`av-dim-label av-dim-label--right-aligned av-dim-label--${l.key}`}
              key={l.key}
            >
              {l.text}
            </span>
          ))}

          {/* 796:935 — 22px Poppins Medium #353535，行高 40.4，x=0 y=540 */}
          <h2 className="av-dim-title">Dimensions</h2>
          {/* 796:936 — 18px Poppins Light #353535，行高 27.4，x=0 y=581 寬 494。
              寬度 494px 配 18px 字約 49 字元／行，本來就在 65–75 的上限以下。 */}
          <p className="av-dim-body">
            Designed to match the footprint of a standard salon stool, 430mm seat, 480–650mm height
            range on a 540mm five-star base. The 10mm floor gap allows omni-directional intake
            without affecting mobility.
          </p>
        </div>
      </div>
    </section>
  );
}

// [x1, y1, x2, y2, node id]，座標就是 796:907 的 1360×691 空間，直接照抄 metadata。
// 每條的 y 都等於對應標籤文字框的垂直中心。
const LEADERS = [
  [399, 111, 602, 111, '796:919'], // Seat Cushion
  [440, 195, 703, 195, '796:923'], // Aero-induction Fan
  [406, 305, 738, 305, '796:920'], // Flow-Stabilizing Bracing
  [411, 407, 743, 407, '796:921'], // Five-Star Base
  [706, 105, 1010, 105, '796:922'], // Modular Power Hub
  [742, 267, 1011, 267, '796:924'], // Coaxial Structural Column
  [771, 341, 1017, 341, '796:925'], // HEPA Purification Core
  [831, 448, 1017, 448, '796:926'], // Hair Collection Canister
  [856, 634, 1017, 634, '796:927'], // Omni-Directional Intake
];

// 右側六個：left 定位（Figma x = 1034 / 1035）
const LABELS_RIGHT = [
  { key: 'power-hub', text: 'Modular Power Hub' }, // 796:916 x=1034 y=85
  { key: 'lever', text: 'Height Adjustment Lever' }, // 796:917 x=1034 y=133
  { key: 'column', text: 'Coaxial Structural Column' }, // 796:928 x=1035 y=246
  { key: 'hepa', text: 'HEPA Purification Core' }, // 796:930 x=1035 y=320
  { key: 'canister', text: 'Hair Collection Canister' }, // 796:934 x=1035 y=427
  { key: 'intake', text: 'Omni-Directional Intake' }, // 796:933 x=1035 y=613
];

// 左側四個：右對齊定位（右緣＝引線起點 − Figma 間距 8 / 10 / 7 / 12）
const LABELS_LEFT = [
  { key: 'cushion', text: 'Seat Cushion' }, // 796:918 y=91，線 399
  { key: 'fan', text: 'Aero-induction Fan' }, // 796:929 y=174，線 440
  { key: 'bracing', text: 'Flow-Stabilizing Bracing' }, // 796:931 y=284，線 406
  { key: 'base', text: 'Five-Star Base' }, // 796:932 y=386，線 411
];
