'use client';

import GomoMark from '@/components/GomoMark';

// Goodmood 頁開場（Figma node 2955:2665「Frame 98」，x=140 y=200，1160×625）。
//
// 結構照 Figma 的巢狀 flex 原樣搬，每一層的 gap 都對得上：
//   3279:2871  標記 → 底下整組           gap 40
//   3279:2870  文字群 → meta 三欄        gap 45
//   3279:2865  文字框 → 分隔線           gap 40
//   3279:2864  副標 → 正文               gap 5
//
// 標記用共用的 components/GomoMark.jsx（就是導覽列那一份），不重新從 Figma
// 匯出——node 2936:2616 是 175×177，導覽列的 2343:172 是 91.32×92.39，
// 長寬比差 0.02%，同一個標記。
export default function Opening() {
  return (
    <section className="gm-opening">
      <div className="gm-opening-inner">
        <GomoMark className="gm-mark" />

        <div className="gm-opening-body-group">
          <div className="gm-opening-text-group">
            <div className="gm-opening-text">
              {/* 2873:2283 */}
              {/* ⚠️ 這是整頁唯一的 h1（2026-09-03 從 <p> 改過來）。
                  視覺樣式完全沒動——.gm-opening-tagline 照舊，只是補上語意。
                  這一頁先前沒有 h1。 */}
              <h1 className="gm-opening-tagline">I designed this site. Then I built it.</h1>

              {/* 2873:2284 —— Figma 是一個文字節點裡三段，用三個 <p> 表達
                  （分開的句子，語意上本來就是三段）。 */}
              <div className="gm-opening-body">
                <p>Goodmood, design made with good mood.</p>
                <p>
                  Goodmood is my personal portfolio site. is my portfolio site. I designed it,
                  wrote the spec for it, and built it myself with AI.
                </p>
                <p>
                  This page is about the second half: what I handed to AI, what I kept, and where
                  I decided to stop.
                </p>
              </div>
            </div>

            {/* 2873:2292「Vector 99」。寬度用外層 .gm-opening-inner 的整個
                內容寬（1360）而非 Figma 的 1160，理由見 goodmood.css 該處註解。 */}
            <div className="gm-opening-divider-row" aria-hidden="true">
              <div className="gm-opening-divider" />
            </div>
          </div>

          {/* 3279:2869 —— 標籤/值是名詞對，用 <dl> 而不是一堆 <div>。 */}
          <dl className="gm-opening-meta">
            <div className="gm-opening-meta-item">
              <dt className="gm-opening-meta-label">Duration</dt>
              <dd className="gm-opening-meta-value">4 weeks</dd>
            </div>
            <div className="gm-opening-meta-item">
              <dt className="gm-opening-meta-label">Category</dt>
              <dd className="gm-opening-meta-value">
                UI/UX Design
                <br />
                Web Design
                <br />
                Vibe Coding
              </dd>
            </div>
            <div className="gm-opening-meta-item">
              <dt className="gm-opening-meta-label">Tool</dt>
              <dd className="gm-opening-meta-value">
                Figma
                <br />
                Claude
                <br />
                Cursor
                <br />
                Gemini
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
