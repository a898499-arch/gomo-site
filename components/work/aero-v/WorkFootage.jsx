'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { FootageTitleWord } from './Wordmark';

// Figma node 796:738「work footage」，1160×206，位於整頁 frame 796:705 的
// x=140 y=9309。內容是「字標 + 副標 + 一段描述」，跟 796:714 logo& overview
// 的上半段是同一組件式：Frame 16（796:739）是 x=32 寬 1077 的 flex column、
// gap 11、置中對齊。
//
// ⚠️ 又是那個 9.5px：Frame 16 在 1160 容器裡是 x=32 寬 1077，中心 570.5，
// 比容器中心 580 偏左 9.5px —— 跟 796:715 一模一樣的偏移量。既有裁示是
// 「視為繪製誤差、改為真正置中」，這裡沿用，所以直接重用
// .av-overview-inner / .av-overview-head / .av-overview-subtitle /
// .av-overview-body，不另外開一套數值相同的樣式。
//
// 唯一不同的是字標：796:740 的墨跡是 314×67，796:716 是 338×67 —— 字形
// 相同、墨跡高一樣，但這一個的字距更緊。等比縮放無法同時對上寬與高（縮到
// 寬 314 時高度只有 62.2，比 Figma 矮 4.8px，實測過），所以另外匯了一份
// 外框字 FootageTitleWord，不重用 TitleWord。
//
// 字標是外框字、不可選取，所以照 Hero.jsx / LogoOverview.jsx 的做法補一份
// visually-hidden 的真文字。這裡的標題層級用 h2：頁面的 h1 已經被
// LogoOverview 的「AERO V」用掉了，同一頁不應該出現第二個 h1。
export default function WorkFootage() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      <div className="av-overview-inner">
        <div className="av-overview-head av-entrance-item">
          {/* 796:740 — 96px Skia Light #353535，字距 −0.48，文字框 314×83 */}
          <h2 className="av-foot-title">
            <span className="visually-hidden">AERO V</span>
            <FootageTitleWord className="av-foot-title-mark" />
          </h2>

          {/* 796:741 — 24px Poppins Italic #717171，字距 −0.12，行高 1.45 */}
          <p className="av-overview-subtitle">Smart Purifying Hairdressing Stool</p>

          {/* 796:742 — 18px Poppins Regular #353535，字距 −0.09，行高 1.5，
              Figma 實測高 54 = 2 行 × 27。欄寬同樣是 1077，斷行才會一致。 */}
          <p className="av-overview-body">
            AERO is a smart hairdressing stool that integrates fallen-hair collection and air
            purification, reducing airborne pollutants and creating a cleaner, healthier working
            environment for hairstylists and salon customers.
          </p>
        </div>
      </div>
    </section>
  );
}
