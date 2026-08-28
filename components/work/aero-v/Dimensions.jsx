'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:907「Dimensions」，1178×691，位於整頁 frame 796:705 的
// x=40 y=6430。
//
// ⚠️ 靠左對齊、不置中：Figma 是 x=40 寬 1178，右邊留了 222px 空白（其他區塊
// 例如 FEATURES 是 x=40 寬 1360.62、左右對稱）。這裡照 Figma 靠左，佔內容欄
// 的 1178/1360 = 86.6176%。這是全頁唯一一個非置中的區塊，我判斷不出是刻意
// 還是繪製疏漏，已回報。要改置中的話加一行 margin-inline:auto 即可。
//
// ── 10 個標籤、10 條引線 ──
// （原指示寫「12 個標籤、11 條引線」，實際清點是 10 / 10：796:919–927 是 9 個
//  節點加上 796:937 共 10 條，另外兩個文字節點是下方的標題與段落。已回報。）
//
// 關鍵結構：**每條引線的 y 恰好等於它那個標籤文字框的垂直中心**，10 條全部
// 吻合在 0.5px 內（例如 Seat Cushion 文字框 y=91 高 41 → 中心 111.5，
// 線 796:919 的 y=111）。所以標籤與引線是同一組座標，不會各自漂移。
//
// 10 條線畫在**同一張 inline SVG** 裡，viewBox 就是整區的 1178×691 座標系。
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
          {/* 796:908「stool structure」x=491 y=0 379×681。
              ⚠️ 去背 PNG（46.9% 全透明、48.4% 半透明的柔邊陰影），
              底下不要墊底色。來源 1137×2043 正好是 3.00x。 */}
          <img
            className="av-dim-render"
            src="/work/aero-v/stool-structure.webp"
            srcSet="/work/aero-v/stool-structure.webp 1x, /work/aero-v/stool-structure@2x.webp 2x"
            width={379}
            height={681}
            loading="lazy"
            decoding="async"
            alt="AERO V 座凳的完整結構渲染圖，由上而下依序是白色圓形座墊、伸縮柱身、淺綠色的 HEPA 濾芯、圓盤狀氣流導板，以及裝有集髮罐的五爪滾輪底座。"
          />

          {/* 10 條引線。stroke 與 stroke-width 是從 Figma 匯出的 SVG 檔讀的：
              九條直線 #5B5B5B、折線 796:937 是 #6E6E6E，兩者確實不同色——
              判斷是設計稿的疏漏，但照原樣還原並在此標註。 */}
          <svg
            className="av-dim-leaders"
            viewBox="0 0 1178 691"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <g stroke="#5B5B5B" strokeWidth="0.5">
              {LEADERS.map(([x1, y1, x2, y2, id]) => (
                <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
            {/* 796:937「Vector 199」x=692 y=128 207×28 —— 唯一一條有折彎的。
                路徑照匯出檔原樣：先 45° 下斜 27.5px，再水平 179.5px。
                ⚠️ fill="none" 不可省略：<path> 的 fill 預設是黑色，少了這個屬性
                這條折線會被填成一個黑色實心三角形（實際踩過）。另外九條是
                <line>，沒有可填的封閉區域，所以不受影響。 */}
            <path
              d="M692.18 128.18L719.68 156.18H899.18"
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

// [x1, y1, x2, y2, node id]，座標就是 796:907 的 1178×691 空間，直接照抄 metadata。
// 每條的 y 都等於對應標籤文字框的垂直中心。
const LEADERS = [
  [319, 111, 522, 111, '796:919'], // Seat Cushion
  [360, 195, 623, 195, '796:923'], // Aero-induction Fan
  [326, 305, 658, 305, '796:920'], // Flow-Stabilizing Bracing
  [331, 407, 663, 407, '796:921'], // Five-Star Base
  [626, 105, 899, 105, '796:922'], // Modular Power Hub
  [658, 267, 900, 267, '796:924'], // Coaxial Structural Column
  [684, 341, 905, 341, '796:925'], // HEPA Purification Core
  [738, 448, 905, 448, '796:926'], // Hair Collection Canister
  [761, 634, 905, 634, '796:927'], // Omni-Directional Intake
];

// 右側六個：left 定位（Figma x = 914 / 915）
const LABELS_RIGHT = [
  { key: 'power-hub', text: 'Modular Power Hub' }, // 796:916 x=914 y=85
  { key: 'lever', text: 'Height Adjustment Lever' }, // 796:917 x=914 y=133
  { key: 'column', text: 'Coaxial Structural Column' }, // 796:928 x=915 y=246
  { key: 'hepa', text: 'HEPA Purification Core' }, // 796:930 x=915 y=320
  { key: 'canister', text: 'Hair Collection Canister' }, // 796:934 x=915 y=427
  { key: 'intake', text: 'Omni-Directional Intake' }, // 796:933 x=915 y=613
];

// 左側四個：右對齊定位（右緣＝引線起點 − Figma 間距 8 / 10 / 7 / 12）
const LABELS_LEFT = [
  { key: 'cushion', text: 'Seat Cushion' }, // 796:918 y=91，線 319
  { key: 'fan', text: 'Aero-induction Fan' }, // 796:929 y=174，線 360
  { key: 'bracing', text: 'Flow-Stabilizing Bracing' }, // 796:931 y=284，線 326
  { key: 'base', text: 'Five-Star Base' }, // 796:932 y=386，線 331
];
