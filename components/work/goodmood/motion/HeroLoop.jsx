'use client';

import { useRef } from 'react';
import useInViewPause from '../useInViewPause';
import './hero-loop.css';

/**
 * WanderBuddy Hero 照片牆 —— **components/Hero.jsx 的副本**
 *
 * ⚠️ 這是 components/Hero.jsx 的副本，原檔在 components/Hero.jsx
 * （只有 components/work/wanderbuddy/WanderBuddyPage.jsx:5 在用）。
 * 兩邊是**刻意分開維護**的：改原檔不會同步過來，改這裡也不會影響
 * WanderBuddy 頁。使用者 2026-09-02 裁示。
 *
 * 副本相對原檔改了「三個地方」，其餘（COLUMNS 的排列、雙份內容、
 * aria-hidden 的規則）一字未動：
 *   1. class 前綴 .wb-* → .gm-hero-*（樣式檔同步，見 hero-loop.css 檔頭）
 *   2. 拿掉 tagline prop 與 <p className="wb-tagline">
 *      ——原檔預設 display:none，WanderBuddy 頁也沒有傳 tagline 進去，
 *      副本用不到。⚠️ Figma 那張參考圖裡看得到的「The city's better with
 *      company.」**不是**這個 tagline，是照片牆裡某一張手機截圖上的字
 *      （位置在左下、跟著平面傾斜，不是置中在 logo 下方）。
 *   3. 加上 useInViewPause：離開視窗時把 data-paused 切成 true，
 *      CSS 那邊只切 animation-play-state（不動 transform，接回來相位不跳）。
 *      原檔沒有這個——它是滿版 hero，本來就只在首屏。
 *
 * 尺寸與裁切：這一層固定 942×575（見 hero-loop.css），外層由
 * MakingAssets02.jsx 的 .gm-frame--hero 做 598×574 的置中裁切。
 * 是「裁切成小窗」不是「整個縮小」——使用者 2026-09-02 決策。
 */

// 圖片放在 public/hero/ 底下（與原檔共用同一批素材，沒有另外複製）
const BASE = '/hero';

// 每欄 3 張，順序刻意錯開，避免相鄰欄出現同一張（照抄原檔）
const COLUMNS = [
  ['s1', 's3', 's4'],
  ['s5', 's2', 's1'],
  ['s3', 's4', 's2'],
  ['s2', 's1', 's5'],
  ['s4', 's5', 's3'],
];

export default function HeroLoop() {
  const rootRef = useRef(null);
  const inView = useInViewPause(rootRef);

  return (
    <div className="gm-hero" ref={rootRef} data-paused={inView ? 'false' : 'true'}>
      <div className="gm-hero-plane">
        {COLUMNS.map((names, ci) => (
          <div className="gm-hero-col" key={ci}>
            <div className="gm-hero-track">
              {/* 內容放兩份 → 無縫循環的必要條件 */}
              {[...names, ...names].map((n, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`${BASE}/${n}.png`}
                  alt=""
                  aria-hidden={i >= names.length || undefined}
                  decoding="async"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gm-hero-vignette" />
      <div className="gm-hero-scrim" />

      <div className="gm-hero-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/logo.svg`} alt="Wander Buddy" />
      </div>
    </div>
  );
}
