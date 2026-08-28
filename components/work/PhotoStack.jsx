'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
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
export default function PhotoStack({ base, photos }) {
  return (
    <div className="page-container">
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
    </div>
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
