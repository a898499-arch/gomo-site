'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:938「FEATURES」，1360.62×736.65，位於整頁 frame 796:705 的
// x=40 y=5446。寬度幾乎正好等於 .page-container 的內容寬（1440 − 2×40 = 1360），
// 所以用 .page-container，做法同 SOLUTION / From Sketch。
//
// ── 四張卡 ──
// Figma 是四個各自絕對定位的 333×639 圓角矩形，x = 0 / 341 / 685 / 1028，
// 間距 8 / 11 / 10 —— 不平均，平均值應是 (1360.62 − 4×333) / 3 = 9.54。
// 判定為繪製誤差，這裡用四等分 grid + gap 9.54，每張卡與 Figma 差 ≤1.6px。
// ⚠️ 第四張卡在 Figma 裡不是矩形而是 796:948 這個 Vector（332.62×639.65），
// 但位置尺寸與前三張同一套，所以一樣當卡片做。
//
// ── 文字是「置中」不是絕對定位 ──
// Figma 給的 left 值（101 / 448.74 / 800.06 / 1119.88 …）全部是置中的產物：
// 實測四張卡的標題與內文中心與卡片中心只差 0.6～3.9px（Figma 自己的文字量測
// 抖動）。照抄 left 反而會錯，因為實際渲染的字寬跟 Figma 的量測不會一樣。
// 所以用 text-align: center，只保留垂直座標。
//
// ── 箭頭 ──
// 疊在照片上，**會被卡片裁掉**：紅箭頭群組 796:953 的框是 x 79→399，超出卡 1
// 右緣 333，放大 Figma 截圖確認第三支箭頭確實被切斷。所以卡片要 overflow:
// hidden（20px 圓角本來也需要）。箭頭用 <img> 不 inline —— 顏色是烤好的漸層，
// 沒有主題變色需求。
//
// ── 照片 ──
// 四張都是 Figma 格子的 3.00x，裁切已烤進圖裡。⚠️ 卡 1、卡 2 的照片整體只有
// 90% 不透明（實測中央區最大 alpha 229），所以卡片的 #edecee 底色會透出來、
// 不可省略；卡 3、卡 4 才是全不透明。
export default function Features() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <div className="av-feat-frame">
          {/* 796:945 — 24px Poppins SemiBold #5B5B5B uppercase，行高 40.4，x=0 y=0 */}
          <p className="av-feat-eyebrow av-entrance-item">FEATURES</p>

          <div className="av-feat-cards">
            {CARDS.map((c) => (
              <div className={`av-feat-card av-entrance-item`} key={c.key}>
                <div className="av-feat-photo">
                  <img
                    // ⚠️ lang="zh-Hant"：alt 來自 CARDS，是中文；整站是
                    // <html lang="en">，不標語言英文語音會唸不出來（2026-09-03 補）
                    lang="zh-Hant"
                    className="av-feat-img"
                    src={`/work/aero-v/${c.img}.webp`}
                    srcSet={`/work/aero-v/${c.img}.webp 1x, /work/aero-v/${c.img}@2x.webp 2x`}
                    width={333}
                    height={524}
                    loading="lazy"
                    decoding="async"
                    alt={c.alt}
                  />
                  {c.arrows.map((a) => (
                    <img
                      key={a.file}
                      className={`av-feat-arrow av-feat-arrow--${a.file}`}
                      src={`/work/aero-v/${a.file}.svg`}
                      alt=""
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="av-feat-title">{c.title}</p>
                <p className="av-feat-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CARDS = [
  {
    key: 'purification',
    img: 'feature-purification', // FEATURES1，796:940 是 332×524（不是 333），來源 996×1572 = 3x
    title: 'Purification', // 796:946
    body: 'Filters VOCs at the breathing zone.', // 796:947
    // 796:953 紅（三支合成一張）＋ 796:957 藍
    arrows: [{ file: 'features1-arrow-red' }, { file: 'features1-arrow-blue' }],
    alt: '座凳座面的特寫，三支紅色箭頭由上往下指向座面邊緣，一支淺藍色箭頭從座面下方往左下方散出，示意氣流被吸入後由底部排出。',
  },
  {
    key: 'collection',
    img: 'feature-collection', // FEATURES2
    title: 'Collection', // 796:963
    body: 'Captures clippings as they fall.', // 796:964
    // 796:972 向上（Figma 帶 scaleX(-1)，匯出已烤進路徑）＋ 796:968 向下（帶 −8.47° 旋轉，同樣已烤進）
    arrows: [{ file: 'features2-arrow-up' }, { file: 'features2-arrow-down' }],
    alt: '座凳柱身下方的透明錐形集髮罩，地面散落著剪下的髮絲，紅色箭頭由下往上指向錐形罩內部，示意落髮被收集的路徑。',
  },
  {
    key: 'disposal',
    img: 'feature-disposal', // FEATURES3
    title: 'Disposal', // 796:949
    body: 'Quick-release canister, no tools.', // 796:950
    arrows: [],
    alt: '座凳柱身與一個已取下的透明集髮罐並置，罐內可見收集到的髮團，示意免工具即可快拆更換。',
  },
  {
    key: 'filter-access',
    img: 'feature-filter-access', // FEATURES4
    title: 'Filter Access', // 796:951
    body: 'Twist the seat, swap the filter.', // 796:952
    arrows: [],
    alt: '座凳座面被抬起後的爆炸圖，露出下方淺綠色的圓柱形濾芯與承接座，示意轉開座面即可更換濾芯。',
  },
];
