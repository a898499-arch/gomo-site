import fs from 'node:fs';
import path from 'node:path';

// Goodmood 頁「Design Process」（Figma node 3337:3221，x=37 y=3017，1366×1169）。
//
// ⚠️ 這一區沒有動效——不要加 ScrollTrigger 或進場動畫（使用者 2026-09-02 指示）。
//
// 幾何（section 內相對座標，全部照 Figma）：
//   kicker      3253:2849  y=0    行高 40.4
//   副標        3253:2851  y=46   → 距 kicker 頂 46，扣掉 40.4 行高 = 間距 5.6
//   正文        3253:2852  y=92   欄寬 1139，五段，副標 → 正文 gap 5
//   灰底帶      3288:2900  y=367  高 802（標題群底 332 → 帶頂 367 = 間距 35）
//   流程圖      3331:3189  y=450（距帶頂 83）  1246.91×647，左 60
//
// ⚠️ 這是 Server Component（沒有 'use client'）——流程圖要 inline SVG
// （CLAUDE.md：插畫一律 inline SVG，不用 <img>），所以在伺服器端讀檔。
// 129KB 的路徑資料寫進 .jsx 會讓檔案無法閱讀也無法 diff，做法比照
// app/page.js 讀板凳 SVG 的方式。
const SVG_PATH = path.join(process.cwd(), 'public', 'work', 'goodmood', 'process-flow.svg');

function readProcessFlow() {
  const raw = fs.readFileSync(SVG_PATH, 'utf8');
  return (
    raw
      // 尺寸交給 CSS（width:100% / height:auto），viewBox 保留
      .replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1')
      .replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1')
      // ⚠️ role="img" 是必要的，不是多餘：這支 SVG 裡有 38 個 <text> / 40 個
      // <tspan>，是活的文字不是外框字。不加 role="img" 的話螢幕閱讀器會逐一
      // 唸出那 38 段散落的標籤，順序由 DOM 決定、讀起來是一團亂。加上
      // role="img" + <title> 之後，輔助技術把整張圖當成「一個有名字的圖」，
      // 不會下鑽到子節點；完整的流程敘述由圖旁那段 .visually-hidden 提供。
      .replace(
        /<svg([^>]*)>/,
        '<svg$1 role="img" aria-labelledby="gm-flow-title">' +
          // ⚠️ lang="zh-Hant"：整站是 <html lang="en">，這行 <title> 是中文，
          // 不標語言的話英文語音的螢幕閱讀器會唸不出來（2026-09-03 補）。
          '<title id="gm-flow-title" lang="zh-Hant">設計流程圖：規格書、Figma、Cursor + Claude 與素材生成之間的協作迴圈</title>'
      )
  );
}

export default function DesignProcess() {
  const processFlowSvg = readProcessFlow();

  return (
    <section className="gm-section gm-process">
      <div className="gm-section-inner">
        <p className="gm-kicker">Design Process</p>

        <div className="gm-section-text">
          <h2 className="gm-subhead">The Collaboration Loop</h2>

          {/* 3253:2852 —— Figma 是一個文字節點裡五段，用五個 <p> 表達。 */}
          <div className="gm-body">
            <p>Each tool does the part it&rsquo;s actually good at.</p>
            <p>
              I design the layout and visual system in Figma, then pass it into Cursor through Figma
              MCP and build with Claude. Every session opens with the spec, so the build and the
              design stay on the same ground.
            </p>
            <p>
              For anything complex, an animation, a tricky interaction, I draft and test the
              instruction in Claude first, then bring the settled version into the build. Ten minutes
              up front, one fewer round of rework caused by a vague prompt.
            </p>
            <p>
              Images run on a different loop: I define the scenario and gather references myself, use
              ChatGPT to turn that into an image description, then generate in Gemini or Google AI
              Studio depending on the resolution I need.
            </p>
            <p>
              AI speeds up execution. I set the direction, judge the result, and decide what happens
              next.
            </p>
          </div>
        </div>
      </div>

      <div className="gm-panel gm-band gm-process-band">
        {/* ⚠️ 圖裡最小的字是 10px。1247px 的圖在 1155 視窗下會縮到約 86%，
            10px 變 8.6px，讀不到——所以這裡「不」等比縮小，改成窄螢幕左右滑動
            （內層 min-width:1150px + 外層 overflow-x:auto，見 goodmood.css）。
            ⚠️ 可捲動的區域一定要能用鍵盤操作：tabindex="0" 讓它可以被 Tab 到、
            再用左右方向鍵捲動；role="region" + aria-label 讓螢幕閱讀器知道這裡
            是一塊可以進去的區域。三個屬性缺一不可，不要拿掉。 */}
        <div
          className="gm-flow-scroll"
          tabIndex={0}
          role="region"
          aria-label="Design process flow diagram, scrollable horizontally"
        >
          <div
            className="gm-flow-inner"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: processFlowSvg }}
          />
        </div>

        {/* CLAUDE.md 的匯出圖無障礙補償：圖之外再給一份純文字敘述。
            SVG 本身是 role="img" + <title>，輔助技術只會讀到那一行名稱，
            完整流程由這裡提供。 */}
        <p className="visually-hidden" lang="zh-Hant">
          流程分成三條線。主線：開發規格書（站台結構、內容層級、關鍵互動、設計 token、動效規則、
          每一區的驗收條件）先寫好，AI 每接一個新任務前都要先讀；標記 ⚠️ 的地方一律停下來問，
          不自行編造。接著在 Figma 完成版面與視覺，透過 Figma MCP 傳進 Cursor，由 Claude 建置成品；
          複雜的互動會先在 Claude 裡演練過指令，再帶進正式建置。
          素材線：我先定義場景與蒐集參考，交給 ChatGPT 轉成圖像描述，再依需要的解析度到
          Gemini 或 Google AI Studio 生成素材。
          第三條線是回饋：我決定方向、判斷結果、決定下一步——可行就併入，卡住就換方法解決，
          而所有在這裡做出的決定都會回寫進規格書。
        </p>
      </div>
    </section>
  );
}
