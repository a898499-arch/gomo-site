import GomoMark from '@/components/GomoMark';

// Goodmood 頁的結尾：GOMO 標記 + 收尾句。
//
// ⚠️ 座標系的問題，先講清楚（2026-09-03 實查）：
// 這三個節點**不在**整頁 frame 2343:129 裡面。整頁 frame 的畫布座標是
// (12021, −120)，而這三個節點回報的 x 落在 10371 附近——換算成 frame 內座標
// 會是 −1017 / −1610，也就是它們被放在整頁 frame 左邊約 1650px 的畫布上，
// 屬於另一個座標系。所以「它們跟上下區塊的距離」在 Figma 裡量不到，
// 只有彼此之間的相對關係可信（使用者也說過他那邊拿到的座標系不一致）。
//
// 量得到的（同一個座標系內，來源節點都標了）：
//   標記    3337:3286  175×177   x=11003.5 → 在 1440 內是 632.5 = (1440−175)/2，置中 ✅
//   收尾句  3337:3283  Frame 116 1360×35  x=10411 → 內縮 40，等於 --page-gutter
//             └ 3337:3284 Frame 115 1128 寬，x=116（＝(1360−1128)/2，置中）
//                └ 3337:3285 文字 1128×35
//   標記底 10274 → 收尾句頂 10314        = 40
//   收尾句底 10349 → More Project 頂 10392（3337:3287）= 43
//
// 量不到的，改用全站通用節奏（同 .gm-section，理由見 goodmood.css 該處註解）：
//   What This Changed 底 → 標記頂
//   收尾句底 → More Project 頂（43 量得到，但 NextWork 是五頁共用的元件，
//     它自己的 padding-block 不該為了這一頁改；沿用它的通用節奏）
//
// ⚠️ 標記用共用的 components/GomoMark.jsx（就是導覽列、也是本頁開場那一份），
// 不重新從 Figma 匯出。尺寸由 .gm-mark 的 CSS 決定（175px）。
//
// ⚠️ 收尾句與開場的 tagline（2873:2283）是**同一句話**，樣式也完全相同——
// 一頭一尾把整頁包起來。所以這裡直接沿用 .gm-opening-tagline 的樣式，
// 不另外寫一份數值一樣的 class。
export default function Closing() {
  return (
    <section className="gm-section gm-closing">
      <div className="gm-closing-inner">
        <GomoMark className="gm-mark" />
        <p className="gm-opening-tagline gm-closing-line">
          I designed this site. Then I built it.
        </p>
      </div>
    </section>
  );
}
