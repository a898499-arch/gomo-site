'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import Logo from './Logo';

// node 545:56（1160×533）。跟 WanderBuddy 的 Logo & Overview 結構很像，
// 差一件事：Sui-Sui 沒有獨立的「標題」文字圖層——「suisui」字樣就烤在
// logo SVG 本身裡（Group 36914），不是另外的 DOM 文字。所以這裡用一個
// 螢幕閱讀器可讀、視覺隱藏的 <h1> 補上頁面標題語意，logo 圖形本身
// aria-hidden。
export default function LogoOverview() {
  const ref = useStandardEntrance('.ss-entrance-item');

  return (
    <section className="ss-section" ref={ref}>
      <div className="ss-overview-inner">
        <h1 className="visually-hidden">Sui-Sui</h1>
        <div className="ss-overview-logo ss-entrance-item">
          <Logo aria-hidden="true" />
        </div>
      </div>

      {/* 2026-08-17：quote/body 移出 .ss-overview-inner 自己的 140px 內距，
          比照下面 meta 列已經修好的做法（見 --text 修飾類）——這兩段的
          Figma 實際文字框（1077px／927px）都比 1160-140*2=880px 的內距欄寬，
          繼續用內距會被擠到多換一行，跟 Figma 的斷行位置對不上。 */}
      <div className="ss-overview-inner ss-overview-inner--text">
        <p className="ss-overview-quote ss-entrance-item">
          “Brings cosmetic therapy out of the classroom and into daily life for Elders.”
        </p>

        {/* 2026-08-17：改回單一個 <p>——get_design_context 讀到的雖然是 3 個
            獨立 <p mb-0>，但視覺上（margin-bottom:0）三段緊貼、句子間只隔
            一個空格，是同一個連續文字塊自然換成 4 行，不是段落間距。用
            單一 <p> 交給瀏覽器在正確寬度下自然換行，才會跟 Figma 一致。 */}
        <p className="ss-overview-body ss-entrance-item">
          Sui-Sui is a home-based wellness app that brings cosmetic therapy into the daily lives of older women. Through structured, guided sessions, from hand warm-ups to skincare and makeup, it turns a clinical practice into a personal ritual, slowing cognitive decline and restoring confidence one session at a time. Sui-Sui (<span lang="zh-Hant">媠</span>) means beautiful in Taiwanese, a reminder that it&rsquo;s never too late to bloom.
        </p>
      </div>

      {/* 分隔線脫離 .ss-overview-inner 自己的內距，改用跟導覽列同一個
          .page-container（同一個 --page-gutter 變數），左右緣對齊導覽列
          logo 左緣／About Me 右緣，比照 WanderBuddy 那頁已經修好的做法。 */}
      <div className="ss-overview-divider-row page-container ss-entrance-item">
        <div className="ss-overview-divider" />
      </div>

      <div className="ss-overview-inner ss-overview-inner--meta">
        <div className="ss-overview-meta ss-entrance-item">
          <div className="ss-overview-meta-item">
            <span className="ss-overview-meta-label">Type</span>
            <span className="ss-overview-meta-value">Personal Project</span>
          </div>
          <div className="ss-overview-meta-item">
            <span className="ss-overview-meta-label">Category</span>
            <span className="ss-overview-meta-value">
              UI/UX Design
              <br />
              Product Design
            </span>
          </div>
          <div className="ss-overview-meta-item">
            <span className="ss-overview-meta-label">Tool</span>
            <span className="ss-overview-meta-value">
              Figma
              <br />
              Gemini
              <br />
              Claude
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
