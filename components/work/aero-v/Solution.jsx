'use client';

import { useRef } from 'react';
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
//
// ── 進場：先 SOLUTION 再 goal（使用者 2026-08-28 指示）──
// 兩排各自一個 ScrollTrigger、各自 once:true，不用 scrub。
//
// ⚠️ 兩排的 start 都用預設的 'top 80%'，**沒有**照指示裡的「Solution 80% /
// Goal 85%」。理由（實測過，不是憑記憶）：ScrollTrigger 的百分比越大越早觸發
// ——同一個元素 'top 85%' 在捲動位置 2236 觸發、'top 80%' 在 2281 觸發。所以
// 給 Goal 85% 是把它往「早」推，跟意圖相反。順序其實靠文件位置就保證了：
// goal 排在文件上比 top 排低 406px，同樣 80% 之下觸發位置是 2687 vs 2281。
// 若日後想再加大邊界，Goal 要用**更小**的值（例如 'top 75%'），不是更大。
//
// 200ms 保證：goal 排的 delay 是函式，在它被觸發的當下才算
// max(0, 200ms − SOLUTION 已經開始了多久)。正常捲動下 406px 早就超過 200ms，
// delay = 0 不會平白多等；快速捲過去兩排同幀觸發時，delay 正好補足 200ms。
export default function Solution() {
  // SOLUTION 那排真正開始播的時間戳，供 goal 排算延遲用。
  // 0 代表還沒開始（理論上不會發生，因為 goal 的觸發位置一定比較晚）。
  const solStartedAt = useRef(0);

  const topRef = useStandardEntrance('.av-entrance-item', {
    onStart: () => { solStartedAt.current = performance.now(); },
  });

  const goalRef = useStandardEntrance('.av-entrance-item', {
    delay: () => {
      if (!solStartedAt.current) return 0.2; // 保底：SOLUTION 還沒播就給滿 200ms
      return Math.max(0, 0.2 - (performance.now() - solStartedAt.current) / 1000);
    },
  });

  return (
    <section className="av-section">
      <div className="page-container">
        <div className="av-sol-frame">
          {/* 上排（node 796:744「Group 36971」，1357.06×405.29）。
              這一排自己是 ScrollTrigger 的 trigger，裡面四個 .av-entrance-item
              依 DOM 順序 stagger 60ms：照片 → SOLUTION → 左句 → 右句。 */}
          <div className="av-sol-row av-sol-row--top" ref={topRef}>
            <img
              className="av-sol-photo av-entrance-item"
              src="/work/aero-v/sol-top.webp"
              srcSet="/work/aero-v/sol-top.webp 1x, /work/aero-v/sol-top@2x.webp 2x"
              width={1357}
              height={405}
              loading="lazy"
              decoding="async"
              alt="左半是室內地板上的直立式空氣清淨機，右半是人字拼木地板上的無線吸塵器吸頭，兩者並置對應淨化空氣與收集落髮兩件事。畫面經過去彩處理，中央有一道灰色漸層紗罩。"
            />
            <p className="av-sol-eyebrow av-sol-eyebrow--solution av-entrance-item">SOLUTION</p>
            <p className="av-sol-lede av-sol-lede--left av-entrance-item">
              Purifying what hairstylists breathe
            </p>
            <p className="av-sol-lede av-sol-lede--right av-entrance-item">
              Collecting what the scissors leave behind
            </p>
          </div>

          {/* 下排（node 796:756「goal」，1358×420.02）。獨立的 trigger + 200ms
              保證，一定晚於上排。三個 .av-entrance-item：照片 → goal → 標語。 */}
          <div className="av-sol-row av-sol-row--goal" ref={goalRef}>
            <img
              className="av-sol-photo av-entrance-item"
              src="/work/aero-v/sol-goal.webp"
              srcSet="/work/aero-v/sol-goal.webp 1x, /work/aero-v/sol-goal@2x.webp 2x"
              width={1358}
              height={420}
              loading="lazy"
              decoding="async"
              alt="髮型師在沙龍中為顧客洗頭的側面畫面，背景是鏡台與吹風機。整張覆蓋一層青色調，呼應乾淨空氣的意象。"
            />
            <p className="av-sol-eyebrow av-sol-eyebrow--goal av-entrance-item">goal</p>
            <p className="av-sol-goal-line av-entrance-item">
              Turning the salon into a space where clean air comes standard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
