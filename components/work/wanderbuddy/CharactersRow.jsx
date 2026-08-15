'use client';

const CHARACTERS = [
  'character-pac',
  'character-play',
  'character-c',
  'character-steps',
  'character-star',
  'character-wave',
  'character-cloud',
  'character-hourglass',
];

// 複製 6 份（不是 2 份）：只複製 2 份時，只要一份的實際寬度小於視窗寬度，
// translateX 走到 -50%（=一份的寬度）那一刻，可視窗口就會露出還沒鋪到的
// 空白，看起來像「跑完了」的斷層。實測一份（8 個角色）在 1440px 寬螢幕下
// 約 1347px，比視窗窄，所以 2 份不夠；6 份可以保證總寬度 ≥ 2 倍視窗寬度
// 一路到約 4000px 寬的螢幕（涵蓋一般桌機到超寬螢幕），任何時刻畫面上都還
// 有下一份可看。所有份都放在同一個 flex 容器裡（用 display:contents 的
// wrapper 分組，不另外開 flex/grid），這樣每份之間銜接處的 gap 跟份內每個
// 角色之間的 gap 完全同一個 `gap: 40px`，不會在接縫處多一個或少一個間距。
// 純 CSS keyframes 做水平無限漂移（不用 JS/rAF——這頁已經有 Lenis + GSAP +
// flow.js 三個迴圈，不要再加）。translateX 對「一份的寬度」取模：6 份時
// 一份 = 總寬度的 1/6，所以動畫終點是 -16.6667%，接回起點時視覺上跟開頭
// 無縫（見 wanderbuddy.css 的 wbCharDrift keyframes，COPIES 改動時要同步
// 改那裡的百分比）。複製的那 5 份標 aria-hidden，不會被螢幕閱讀器重複唸。
const COPIES = 6;

export default function CharactersRow({ direction = 'left' }) {
  return (
    <div className="wb-characters-row" data-direction={direction}>
      <div className="wb-characters-track">
        {Array.from({ length: COPIES }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            aria-hidden={copyIndex > 0 ? 'true' : undefined}
            style={{ display: 'contents' }}
          >
            {CHARACTERS.map((name) => (
              <img
                key={`${copyIndex}-${name}`}
                src={`/work/wanderbuddy/${name}.svg`}
                alt=""
                className="wb-character-icon"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
