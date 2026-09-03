// Goodmood 頁「What This Changed」（Figma node 3245:2843，x=196 y=10348，1048×247）。
//
// 幾何（區塊內相對座標，照 Figma）：
//   kicker  3245:2844  y=0   h=41
//   3245:2845          y=51  → 距 kicker 頂 51，扣 40.4 行高 = 間距 10.6
//     副標  3245:2846  y=0   h=41
//     正文  3245:2847  y=46  → 距副標頂 46，扣 40.4 = 間距 5.6，取 5（同其他各區）
//
// x=196 = (1440 − 1048) / 2，整組置中。又是一個不同的欄寬
// （1360 / 1344 / 1234 / 1347.5 / 1048），維持不統一。
//
// 這一區沒有圖、沒有卡片、沒有動效——所以是 Server Component，不加 'use client'。
export default function WhatThisChanged() {
  return (
    <section className="gm-section gm-changed">
      <div className="gm-changed-inner">
        <p className="gm-kicker">What This Changed</p>

        <div className="gm-section-text">
          <h2 className="gm-subhead">Being specific turned out to be a design skill.</h2>

          {/* 3245:2847 —— Figma 是一個文字節點裡兩段。 */}
          <div className="gm-body">
            <p>
              I used to design a lot by instinct. A decision felt right and I didn&rsquo;t always stop
              to explain why. AI doesn&rsquo;t work that way, it won&rsquo;t guess what I meant, so I
              got much more precise about saying what I wanted, and about writing it down instead of
              keeping it in my head.
            </p>
            <p>
              The shift wasn&rsquo;t really about AI. It was realising that being specific up front
              saves time with any collaborator. I brief engineers differently now, and my handoffs
              look a lot more like that spec.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
