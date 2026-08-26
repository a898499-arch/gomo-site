'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { TitleWord } from './Wordmark';

// Figma node 796:714「logo& overview」，1160×501，位於整頁 frame 796:705
// 的 x=150 y=1126。
//
// ⚠️ node 796:713「overview section」（1360×502）是 hidden 的舊灰底佔位，
// 跟 Sui-Sui 那個 #d9d9d9 佔位同一種，刻意不畫。
//
// 標題「AERO V」用 inline SVG 外框字（Skia Light 無法上網頁，見
// Wordmark.jsx 檔頭）。外框字不可選取也不可搜尋，所以真正的 <h1> 文字用
// .visually-hidden 補上、SVG 本身 aria-hidden——跟 Sui-Sui 的 LogoOverview
// 同一套做法（那裡是因為字樣烤在 logo SVG 裡，成因不同、解法相同）。
export default function LogoOverview() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section av-section--after-hero" ref={ref}>
      <div className="av-overview-inner">
        <div className="av-overview-head av-entrance-item">
          <h1 className="av-overview-title">
            <span className="visually-hidden">AERO V</span>
            <TitleWord className="av-overview-title-mark" />
          </h1>

          <p className="av-overview-subtitle">Smart Purifying Hairdressing Stool</p>

          <p className="av-overview-body">
            AERO V reimagines the hairdressing stool as an active air-purification system, silently
            collecting fallen hair and filtering airborne pollutants to protect the people who spend
            their lives behind the chair.
          </p>
        </div>

        {/* node 796:727「Group 36952」— 是「得獎標章」，不是軟體 logo。
            軟體（Ptc creo / Keyshot）是下面 Tool 欄的文字 796:725。
            兩枚標章在 Figma 是各自遮罩的點陣圖，沒有可用的向量原件，
            所以整組匯一張 PNG 2x 再轉 webp（依 CLAUDE.md「純展示、只需等比
            縮放」的匯出圖規則）。Figma 匯出烤了 #F6F6F6 的頁面底色，已用
            邊緣泛洪去背，否則會在米色頁面上露出灰色方塊。 */}
        <div className="av-overview-awards av-entrance-item">
          <img
            className="av-overview-awards-img"
            src="/work/aero-v/awards.webp"
            srcSet="/work/aero-v/awards.webp 1x, /work/aero-v/awards@2x.webp 2x"
            width={423}
            height={65}
            loading="lazy"
            decoding="async"
            alt="兩枚得獎標章：red dot award product design 紅點設計獎，以及 2022 奇想設計大賽 GREAT DESIGN 獎。"
          />
        </div>
      </div>

      {/* node 796:726「Vector 99」是一條 1160×0 的線段。分隔線脫離上面的
          文字欄，改用跟導覽列同一個 .page-container（同一個 --page-gutter），
          左右緣對齊導覽列 logo 左緣／Contact Me 右緣——比照 Sui-Sui 與
          WanderBuddy 兩頁已經修好的做法。 */}
      <div className="av-overview-divider-row page-container av-entrance-item">
        <div className="av-overview-divider" />
      </div>

      <div className="av-overview-inner">
        <dl className="av-overview-meta av-entrance-item">
          <div className="av-overview-meta-item">
            <dt className="av-overview-meta-label">Type</dt>
            <dd className="av-overview-meta-value">Capstone Project</dd>
          </div>
          <div className="av-overview-meta-item">
            <dt className="av-overview-meta-label">Category</dt>
            <dd className="av-overview-meta-value">
              Product Design
              <br />
              Furniture Design
            </dd>
          </div>
          <div className="av-overview-meta-item">
            <dt className="av-overview-meta-label">Tool</dt>
            <dd className="av-overview-meta-value">
              Ptc creo
              <br />
              Keyshot
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
