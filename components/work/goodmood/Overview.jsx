'use client';

// Goodmood 頁 overview（Figma node 3337:3227，x=78.5 y=1209，1283×217）。
//
// 三層，gap 都對得上 Figma：
//   3337:3227  eyebrow → 底下那組   gap 10
//   3337:3226  標題 → 正文          gap 5
export default function Overview() {
  return (
    <section className="gm-overview">
      <div className="gm-overview-inner">
        {/* 2924:2316 —— 區塊小標，不是標題層級，用 <p> 不用 <h*>。
            這一頁的 h1 之後由開場的字標／頁面標題處理；這一輪還沒有 h1，
            所以下面的區塊標題用 h2。 */}
        <p className="gm-overview-eyebrow">overview</p>

        <div className="gm-overview-text">
          {/* 2924:2317 */}
          <h2 className="gm-overview-heading">
            The hard part wasn&rsquo;t building the site. It was staying the one making the
            decisions.
          </h2>

          {/* 3220:2806 —— Figma 是一個文字節點裡三段，用三個 <p> 表達。 */}
          <div className="gm-overview-body">
            <p>
              I wanted a portfolio I could keep changing myself, so I connected Figma to Cursor
              through MCP and built it with AI.
            </p>
            <p>
              The limit showed up fast. AI executes quickly, but it doesn&rsquo;t hold intent, it
              will build something that runs and still misses the point.
            </p>
            <p>
              So this became a project about control, not speed: how do I keep design direction and
              final quality in my hands while something else does the typing?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
