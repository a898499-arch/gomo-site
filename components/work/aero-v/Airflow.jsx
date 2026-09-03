'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:784「airflow」，1360×658，位於整頁 frame 796:705 的
// x=40 y=7350。
//
// 2026-08-28 使用者在 Figma 改版，這一輪跟著改的東西：
//   · 整區從 x=120 寬 1279.79 改成 x=40 寬 1360，**與內容欄同寬**，原本
//     靠右的不對稱沒有了。
//   · 「AIRFLOW」小標（796:883）被刪掉，這裡不再輸出。
//   · 左側箭頭與右欄圖示被水平拉伸 1.062677 倍（＝1360÷1279.79），高度不變。
//     拉伸後箭頭相對於照片往右偏了，使用者接著把整組箭頭往左移 14px 修掉
//     （照片框 796:785 與圖例 796:817 都沒有動過）。
//   · 右欄第一段文字單獨從 509.13 拉寬到 589.13，內文因此從 3 行變 2 行。
//   · 右欄改成 auto-layout：796:847 底下多了 807:1384「Frame 95」，是一個
//     gap 20、align-items:flex-end 的橫列，左邊圖示欄 807:1382（154.611×517）、
//     右邊文字欄 807:1383（589.13×551）。因為 items-end，矮 34px 的圖示欄
//     整欄往下對齊，五個圖示的 y 因此各加 4px；文字欄左緣則從 770.66 移到
//     794.15（＝619.54 + 154.611 + 20）。
//     ⚠️ 兩欄相加 763.741 比 Frame 95 宣告的 740.245 寬，第一段文字的框會
//     超出區塊右緣 23.28px。Figma 算圖裡文字沒有被裁掉（最後一行本來就比框
//     窄），所以照原樣還原，沒有另外收窄。
//
// ── 左側插畫：照片不是 object-fit: cover ──
// MCP 給的參考碼把照片寫成 828.69×629.31 的框 + object-cover + 三層
// maskImage。實際去抓 796:785 的 Figma 算圖來量：算圖內容框 510×559，
// 對應原圖內容框 1535×1675，X/Y 縮放都是 0.333 —— 等比、沒有裁切。
// 三層遮罩（Rectangle 253/254/255）的交集比照片還大，視覺上是 no-op。
// 所以這裡就是一張照片等比填滿 513.1456×594，不做任何裁切或負偏移。
// 來源 Airflow.png 是 1540×1782 = 513.1456×594 的 3.00x。
//
// ── 疊在照片上的七組箭頭 ──
// 全部照 796:784 的 metadata 絕對座標放，換算成左側容器（545.0732×594）
// 的百分比。SVG 都是從 Figma 匯出的原始檔，尺寸等於「含描邊外擴」的框，
// 所以位置用「框座標 − 外擴量」，外擴量取自 MCP 參考碼的 inset 百分比。
//
// ── 三塊色條與圖例色塊用 <div> 不用 SVG ──
// 796:814/815/816 與 796:818 匯出後都只是純色矩形（path 是 M67 0H0V25H67V0Z
// 這種），沒有任何形狀資訊。用 <div> + background 還原，色碼直接取自匯出檔：
// #3F62DE / #FF931E / #FBD500。多下載四個 SVG 只是多四個請求。
export default function Airflow() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <div className="av-air-frame">
          {/* 左側插畫：Figma x=0..545.07 y=64..658 的所有東西 */}
          <div className="av-air-illus av-entrance-item">
            {/* 796:785 / 796:791 x=0 y=64 513.1456×594 */}
            <img
              className="av-air-stool"
              src="/work/aero-v/airflow-stool.webp"
              srcSet="/work/aero-v/airflow-stool.webp 1x, /work/aero-v/airflow-stool@2x.webp 2x"
              width={513}
              height={594}
              loading="lazy"
              decoding="async"
              lang="zh-Hant"
              alt="AERO V 座凳的剖視示意圖：座面下方以藍色標示 HEPA 濾芯位置、柱身中段以橘色標示氣流導引風扇、底盤上方以黃色標示穩流支架，箭頭標出空氣由座面兩側排出、沿柱身上行、以及由底部四周吸入的路徑。"
            />

            {ARROWS.map((a) => (
              <img
                key={a}
                className={`av-air-arrow av-air-arrow--${a}`}
                src={`/work/aero-v/airflow-${a}.svg`}
                alt=""
                aria-hidden="true"
              />
            ))}

            {/* 796:814 / 796:815 / 796:816 —— 三塊純色矩形 */}
            <span className="av-air-band av-air-band--hepa" aria-hidden="true" />
            <span className="av-air-band av-air-band--fan" aria-hidden="true" />
            <span className="av-air-band av-air-band--bracing" aria-hidden="true" />

            {/* 796:817 Frame 54 x=324.07 y=407 221×68 —— 改版後位置與尺寸都沒變。
                色塊欄 40 寬、三格 16 高、間距 10；文字欄 x=57（=40+17），
                三行間距 15、行框高 12。 */}
            <div className="av-air-legend">
              <div className="av-air-swatches" aria-hidden="true">
                <span className="av-air-swatch av-air-swatch--hepa" />
                <span className="av-air-swatch av-air-swatch--fan" />
                <span className="av-air-swatch av-air-swatch--bracing" />
              </div>
              <div className="av-air-legend-rows">
                {LEGEND.map((t) => (
                  <span className="av-air-legend-row" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 796:847 Group 36965 / 807:1384 Frame 95，x=619.54 y=71 740.2447×551 */}
          <div className="av-air-col av-entrance-item">
            {ROWS.map((r) => (
              // display:contents —— 桌機時五個 row 消失、子元素直接吃 .av-air-col
              // 的絕對定位；≤900px 才變回 flex 列，就不必為每個子元素各寫一次
              // position:static 的復位。
              <div className="av-air-row" key={r.key}>
                <img
                  className={`av-air-icon av-air-icon--${r.key}`}
                  src={`/work/aero-v/airflow-icon-${r.key}.svg`}
                  alt=""
                  aria-hidden="true"
                />
                <h3 className={`av-air-title av-air-title--${r.key}`}>{r.title}</h3>
                <p className={`av-air-body av-air-body--${r.key}`}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 疊在插畫上的箭頭，檔名即 class 尾碼。順序＝Figma 的堆疊順序（後者在上）。
const ARROWS = [
  'arrow-orange-b', // 796:801，橘色上半段
  'arrow-orange-a', // 796:793，橘色下半段
  'arrow-brown-up', // 796:811
  'arrow-brown-down', // 796:826
  'arrow-blue-up-l', // 796:832，左半
  'arrow-blue-up-r', // 796:837，右半
  'arrow-blue-middle', // 796:841
];

// 796:823 / 824 / 825 —— 14px Poppins Light #000000，行高 27.4
const LEGEND = ['HEPA Purification Core', 'Aero Induction Fan', 'Flow-Stabilizing Bracing'];

// 右欄五段。標題 20px Poppins Medium #353535、內文 18px Poppins Light #353535，
// 兩者行高都是 27.4。文字欄左緣一律 x=794.15；第一段寬 589.13，其餘 509.13。
const ROWS = [
  {
    key: 'exhaust', // 796:848 圖示 / 796:852 / 796:853
    title: 'HEPA Filtration & 360° Exhaust',
    body: 'Neutralizes VOCs from dyes and styling products, then releases purified air back into the room at seated breathing height.',
  },
  {
    key: 'vortex', // 796:854 / 796:862 / 796:863
    title: 'Vortex Optimization',
    body: 'A circular fan stabilizes and accelerates the upward vortex, maintaining consistent suction pressure.',
  },
  {
    key: 'coaxial', // 796:864 / 796:868 / 796:869
    title: 'Coaxial Airflow',
    body: 'Filtered air travels through an internal conduit, bypassing the hydraulic cylinder without compromising its structure.',
  },
  {
    key: 'cyclonic', // 796:870 / 796:874 / 796:875
    title: 'Cyclonic Separation',
    body: 'Centrifugal force isolates heavier hair into the side canisters, keeping the filter clear.',
  },
  {
    key: 'intake', // 796:876 / 796:881 / 796:882
    title: 'Omni-Directional Intake',
    body: 'Captures fallen hair and airborne particulates at floor level, where they concentrate.',
  },
];
