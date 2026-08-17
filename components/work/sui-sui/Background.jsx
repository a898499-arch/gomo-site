'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:139（1360×769）。你確認過這區要做（不是動畫佔位）。兩張卡片
// 內的折線圖／甜甜圈圖表本身（含圖表裡的年份刻度、132M/47M、67%/43%
// 數字）用 Figma 匯出的圖檔呈現——這些數字在 Figma 裡已經是外框化的
// 向量圖形，不是可選取文字，逐一手刻無法帶來實質好處，所以跟
// WanderBuddy 的 Shot／Characters Reference 拼貼圖走同一個處理方式：
// 卡片標題、來源、說明這些「真正的文字內容」維持真實 DOM 文字，圖表
// 圖像本身 aria-hidden，另外用 visually-hidden 文字把關鍵數據講一次
// 給螢幕閱讀器。
export default function Background() {
  const ref = useStandardEntrance('.ss-entrance-item');

  return (
    <section className="ss-section" ref={ref}>
      <div className="ss-section-inner ss-background">
        <p className="ss-eyebrow ss-entrance-item">Background</p>
        <h2 className="ss-background-heading ss-entrance-item">
          A rapidly growing population living with dementia
        </h2>
        <p className="ss-background-body ss-entrance-item">
          Dementia is outpacing every other major condition in growth, and it isn&rsquo;t spread
          evenly. Women bear most of the burden, both as patients and as carers.
        </p>

        <div className="ss-background-cards">
          <div className="ss-background-card ss-entrance-item">
            <h3 className="ss-background-card-title">Global Dementia Population Trend</h3>
            <p className="ss-background-card-source">Source: Alzheimer&rsquo;s Disease International</p>
            <img
              src="/work/sui-sui/background-line-chart.svg"
              alt=""
              aria-hidden="true"
              className="ss-background-chart ss-background-chart--line"
            />
          </div>
          <div className="ss-background-card ss-entrance-item">
            <h3 className="ss-background-card-title">Global Female Dementia Population Ratio</h3>
            <p className="ss-background-card-source">Source: Alzheimer&rsquo;s Research UK</p>
            <img
              src="/work/sui-sui/background-ring-chart@2x.png"
              alt=""
              aria-hidden="true"
              className="ss-background-chart ss-background-chart--ring"
            />
          </div>
        </div>

        <p className="visually-hidden">
          Global dementia population trend: approximately 47 million people in 2015, projected to
          reach 132 million by 2050. Global female dementia population ratio: 67% of people living
          with dementia are women, compared with 43% who are men.
        </p>
      </div>
    </section>
  );
}
