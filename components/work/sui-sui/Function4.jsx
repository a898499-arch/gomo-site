'use client';

// node 2198:5191（檔案 j4saimg2oJWL5tUkBh5Bww「web」，不是舊的
// web-ui_clean）。2026-08-24：舊檔 5HAqwzDuPvXLvX0WG6VPfP 裡的 545:118
// 已經不存在，整份檔案 function 3（y=9687）跟 mockup1（y=11826）之間
// 沒有任何節點——你另外給了新檔的連結才找到這一區，這裡記一筆以免下次
// 又照舊註解去找不存在的 node。
//
// Figma frame：left=0 top=10751 w=1440 h=918。底下只有兩個子節點：
//   2193:5130 標題群（top=0，置中，w=1359，text-center）
//   2450:1018「Shot 1」（w=1622 h=1216，置中 calc(50%+1px)，top=-35）
//
// 標題依你的指示沿用既有的 .ss-fn1-* 那一套（跟 Function 1～3 同源），
// 沒有另外寫字級樣式。⚠️ 已回報的落差：Figma 這一區的間距是「eyebrow
// →標題群 16px、標題→說明 6px」，而 .ss-fn1-* 是「6px / 16px」（那是
// Figma function 1 節點 2193:5103 的結構，跟 function 3/4 相反）。三行
// 的總高一樣，差別只在標題那一行的位置，等你決定要不要統一。
//
// 圖片是純展示的照片拼貼，依 CLAUDE.md：用匯出圖不重建，並補
// 有意義的 alt + .visually-hidden 純文字副本。
export default function Function4() {
  return (
    <section className="ss-section">
      <div className="ss-section-inner ss-fn1-heading ss-fn4-heading">
        <p className="ss-fn1-eyebrow">Function 4</p>
        <div className="ss-fn1-title-group">
          <h2 className="ss-fn1-title">Practice that watches back</h2>
          <p className="ss-fn1-desc">
            Each step is demonstrated, then mirrored back. The camera checks that the movement
            actually happened, so the session responds to the person instead of simply playing at
            them.
          </p>
        </div>
      </div>

      {/* 依規格書 §3.5：lazy load、提供 srcset、WebP、有意義的 alt。
          來源 public/work/sui-sui/Shot.png（3200×2400／8.2MB，未進版控，
          見 .gitignore）。

          ⚠️⚠️ 壓縮時「絕對不要」對 alpha 通道做任何前處理。
          2026-08-24 我曾把 alpha ≤10 的像素歸零，當成抖動雜訊砍掉，檔案
          確實從 1860KB 降到 683KB——但那些不是雜訊，是陰影最外圈的柔邊。
          結果 alpha 直方圖在 1–60 區間出現 19 個像素數為 0 的值
          （1,5,7,11,15,18,21,24,28,31,34,37,39,44,46,50,53,56,58），
          柔和漸層被量化成階梯，陰影糊成一坨。
          正確做法（現行）：不做任何 alpha 前處理，webp 的 alphaQuality:100
          （alpha 無損），RGB quality:85。驗收方式是實跑 alpha 直方圖，
          確認 1–60 區間沒有任何一個值的像素數是 0。

          尺寸：顯示寬度是 Figma 的 80%（1622 × 0.8 = 1297.6px），所以
          2x = 2595px，取 2400w（1.42MB，在 1.5MB 預算內）、1x = 1298w。
          width/height 保留 1622×1217 只作為長寬比提示，實際尺寸由 CSS 決定。 */}
      <img
        className="ss-fn4-shot"
        src="/work/sui-sui/shot.webp"
        srcSet="/work/sui-sui/shot.webp 1298w, /work/sui-sui/shot@2x.webp 2400w"
        sizes="min(90.1112vw, 1297.6px)"
        width={1622}
        height={1217}
        loading="lazy"
        decoding="async"
        alt="Four phone screens fanned out, each showing a step of a guided routine: an older woman copying a hand movement, a cleansing step, an eyeshadow palette being picked up, and eyeshadow being swept across an eyelid."
      />

      <p className="visually-hidden">
        Guided practice screens. Screen one, Step 2 – Clean: Wipe your palm up and down 3 times.
        Screen two, prompt: Engage your fingertips. Step 2 – Clean: Wipe your palm up and down 3
        times. Screen three, prompt: Warm up your look with a touch of orange. Step 5 – Eye Shadow:
        Pick the light pink shade and blend evenly. Screen four, Step 6 – Eye Shadow: Sweep the
        eyeshadow across eyelid 3 times.
      </p>
    </section>
  );
}
