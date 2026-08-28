'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:784「airflow」，1279.78564×658，位於整頁 frame 796:705 的
// x=120 y=7350。
//
// ⚠️ 這一區在 Figma 是 x=120、右緣 1399.79 —— 也就是**靠右**對齊內容欄
// （其他區塊是 x=40 左右對稱）。左邊比內容欄多縮了 80px。這是全頁第二個
// 非置中的區塊（另一個是 Dimensions，那個相反、靠左），我判斷不出是刻意
// 還是繪製疏漏，已回報。要改成滿內容欄只要拿掉 margin-left 即可。
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
          {/* 796:883 — 24px Poppins SemiBold #5B5B5B uppercase，行高 40.4，x=33 y=0 */}
          <p className="av-air-eyebrow av-entrance-item">airflow</p>

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

            {/* 796:817 Frame 54 x=324.07 y=407 221×68。色塊欄 40 寬、三格 16 高、
                間距 10；文字欄 x=57（=40+17），三行間距 15、行框高 12。 */}
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

          {/* 796:847 Group 36965 x=583 y=71 696.7857×551 */}
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
// 兩者行高都是 27.4。文字欄一律 x=770.66 寬 509.13（＝框的右緣）。
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
