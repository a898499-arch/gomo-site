'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import works from '@/data/works.json';
import NextWork from './NextWork';
import './photo-stack.css';

// 「照片依序排列」型作品頁的共用版面。目前 /work/mvs 與 /work/blossom-care
// 兩頁用它，兩頁在 Figma 的結構完全相同（806:1144 與 806:1084）：
//
//   照片堆疊框 x=39 寬 1362 —— 不是滿版，實際就是內容欄 1360，左右各差 1px
//   的繪製誤差，所以直接用 .page-container，不加 data-nav-bleed。
//   每張 1362×766（aspect 4096/2304 = 16:9），object-cover，沒有圓角。
//   垂直間距 33px，兩頁都沒有任何標題文字。
//
// ⚠️ 間距用 clamp 而不是寫死 33px：Figma 的 33px 是在內容欄 1360 的前提下量的，
// 換算成 33/1440 = 2.2917vw。視窗 ≥1440 時 .page-container 封頂 1440、內容欄
// 固定 1360，所以 clamp 的上限 33px 剛好；視窗變窄時間距會跟著照片等比縮小
// （1155 時 26.5px，正好等於 33 × 1090.8/1360）。
//
// ⚠️ 每張照片各自掛一個 ScrollTrigger，不是整疊共用一個。整疊共用的話，
// 容器頂端一進視窗就會把 10~11 張全部一起播完，捲到下面時早就播完了，
// 等於只有第一張看得到進場。所以拆成 PhotoStackItem，一張一個觸發點。
export default function PhotoStack({ base, photos, slug }) {
  // ⚠️ 標題從 works.json 取，不另外收一個 prop：Next Work 已經靠 slug 讀同一份
  // 資料，多開一個 prop 只會多一個會漂移的來源。
  const work = works.find((w) => w.slug === slug);

  return (
    <>
      <div className="page-container">
        {/* ⚠️ 這是整頁唯一的 h1（2026-09-03 補）。這兩頁（MVS / Blossom Care）
            整頁只有照片，畫面上沒有任何標題文字，所以用 .visually-hidden：
            視覺完全不變，但螢幕閱讀器與搜尋引擎讀得到頁面主題。
            先前這兩頁沒有 h1，第一個標題是下面那個「圖片內容摘要」的 h2。 */}
        {work && (
          <h1 className="visually-hidden">
            {work.title} — {work.description}
          </h1>
        )}

        <div className="work-photo-stack">
          {photos.map((p, i) => (
            <PhotoStackItem
              key={p.file}
              base={base}
              file={p.file}
              alt={p.alt}
              // 第一張在首屏，不能 lazy（會延遲 LCP）；其餘全部 lazy，
              // 這也是整頁下載量能壓下來的關鍵。
              eager={i === 0}
            />
          ))}
        </div>

        {/* 純文字副本（CLAUDE.md 對匯出圖的無障礙補償）。
            這些板子整面都是文字，只靠 alt 讀不完；但使用者 2026-08-28 裁示
            **只做重點段落**——每張抓標題加一句核心敘述，不做 21 張的逐字轉錄。
            放在照片之後而不是逐張穿插：螢幕閱讀器會先聽完每張的 alt，再一次
            聽完整份摘要，比在圖與文之間來回跳更好懂。
            .visually-hidden 是絕對定位，不佔 flex 版面、不會多出一個 gap。 */}
        <div className="visually-hidden">
          {/* ⚠️ lang="zh-Hant"：標題與摘要都是中文，理由同上面 <img> 的註解。 */}
          <h2 lang="zh-Hant">圖片內容摘要</h2>
          <dl lang="zh-Hant">
            {photos.map((p) => (
              <div key={p.file}>
                <dt>{p.heading}</dt>
                <dd>{p.summary}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <NextWork currentSlug={slug} />
    </>
  );
}

// 素材是 8000×4500 的原始 jpg 壓出來的 webp：1x 1600×900、2x 3200×1800。
// 顯示寬最大只有 1360（.page-container 封頂 1440 減兩側 40px gutter），
// 所以 1x 有 240px 餘裕、2x 有 480px 餘裕，都沒有放大。
// width/height 屬性給的是 1x 的尺寸，用來鎖長寬比、避免版面位移（CLS）。
function PhotoStackItem({ base, file, alt, eager }) {
  const ref = useStandardEntrance();

  return (
    <img
      ref={ref}
      // ⚠️ lang="zh-Hant"：整站是 <html lang="en">，但 alt 是中文。不標語言的話
      // 英文語音的螢幕閱讀器會用英文發音唸中文字，等於唸不出來。lang 掛在元素上
      // 會一併套用到它的 alt 屬性（2026-09-03 補）。
      lang="zh-Hant"
      className="work-photo-stack-item"
      src={`${base}/${file}.webp`}
      srcSet={`${base}/${file}.webp 1x, ${base}/${file}@2x.webp 2x`}
      width={1600}
      height={900}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={alt}
    />
  );
}
