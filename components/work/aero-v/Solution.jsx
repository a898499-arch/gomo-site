'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:743，1359×825.31，位於整頁 frame 796:705 的 x=41 y=2754。
//
// ⚠️ 命名：Figma 的圖層名是「airflow」，但這一區的標題是 SOLUTION，而且
// **後面 796:784 還有另一個也叫 airflow 的區塊**（y=7350）。為了避免撞名，
// 這支叫 Solution.jsx，之後那一區才叫 Airflow.jsx。
//
// 不是滿版：Figma 是 x=41、寬 1359，幾乎正好等於 .page-container 的內容寬
// （1440 − 2×40 = 1360），所以用 .page-container，不走 background 那種出血。
//
// 兩塊圖都是使用者自己在 Figma 切好的合成圖，暗化／色調層已烤進圖裡：
//   上排 solution.png（4072×1216 = 3x）— 含 Rectangle 228/229 的
//        rgba(9,20,50,0.15) 與中央 Rectangle 261 的灰色紗罩
//        （實測中央亮度 165、兩側 190，中央比兩側暗 18）
//   下排 goal.png（4074×1261 = 3x）— 含 Rectangle 230 的
//        rgba(0,221,249,0.19) 青色層（實測整張 B−R = +47）
// 所以這裡沒有任何 CSS 遮罩層。取捨同 Background.jsx。
//
// ⚠️ 上排那張的真實細節不到 1x：Figma 檔裡嵌的兩張原始圖只有 736px 寬
// （796:748 空氣清淨機可見區 603×360、796:753 無線吸塵器 546×326），是被
// 放大後合成的。使用者說之後會換高解析度來源、屆時要回 Figma 重匯
// solution.png。標稱 3x 不代表細節有 3x。
//
// 文字沒有烤進圖裡，全部用程式碼做（使用者已確認）。
export default function Solution() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="page-container">
        <div className="av-sol-frame av-entrance-item">
          {/* 上排（node 796:744「Group 36971」，1357.06×405.29） */}
          <div className="av-sol-row av-sol-row--top">
            <img
              className="av-sol-photo"
              src="/work/aero-v/sol-top.webp"
              srcSet="/work/aero-v/sol-top.webp 1x, /work/aero-v/sol-top@2x.webp 2x"
              width={1357}
              height={405}
              loading="lazy"
              decoding="async"
              alt="左半是室內地板上的直立式空氣清淨機，右半是人字拼木地板上的無線吸塵器吸頭，兩者並置對應淨化空氣與收集落髮兩件事。畫面經過去彩處理，中央有一道灰色漸層紗罩。"
            />
            <p className="av-sol-eyebrow av-sol-eyebrow--solution">SOLUTION</p>
            <p className="av-sol-lede av-sol-lede--left">Purifying what hairstylists breathe</p>
            <p className="av-sol-lede av-sol-lede--right">
              Collecting what the scissors leave behind
            </p>
          </div>

          {/* 下排（node 796:756「goal」，1358×420.02） */}
          <div className="av-sol-row av-sol-row--goal">
            <img
              className="av-sol-photo"
              src="/work/aero-v/sol-goal.webp"
              srcSet="/work/aero-v/sol-goal.webp 1x, /work/aero-v/sol-goal@2x.webp 2x"
              width={1358}
              height={420}
              loading="lazy"
              decoding="async"
              alt="髮型師在沙龍中為顧客洗頭的側面畫面，背景是鏡台與吹風機。整張覆蓋一層青色調，呼應乾淨空氣的意象。"
            />
            <p className="av-sol-eyebrow av-sol-eyebrow--goal">goal</p>
            <p className="av-sol-goal-line">
              Turning the salon into a space where clean air comes standard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
