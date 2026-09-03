'use client';

import { useEffect, useRef } from 'react';
import HeroLoop from './motion/HeroLoop';
import OnboardingLoop from './motion/OnboardingLoop';
import HandWarmUpLoop from './motion/HandWarmUpLoop';

// Goodmood 頁「Making assets with AI · 02」（Figma node 3337:3224，x=103 y=5595，1234×1593）。
//
// 幾何（section 內相對座標，照 Figma）：
//   kicker    3245:2831  y=0    行高 40.4
//   副標      3245:2833  y=51   → 距 kicker 頂 51，扣 40.4 行高 = 間距 10.6
//   正文      3245:2834  y=97   欄寬 1234，兩段，副標 → 正文 gap 5
//   ① 左上   3292:2938  598×574  left 0    top 348   內容 942×575 從 left -172 裁切
//   ② 右上   3220:2810  598×574  left 636  top 338   #FAFAFA 底
//             手機本體 3292:2936  229×490  left 814  top 389
//   ③ 下方   3220:2811 1234×574  left 0    top 976   #FAFAFA 底
//             內容 3292:2939  707×570  left 244  top 978
//   Fig 3    3337:3216  left 110   中心 top 956
//   Fig 4    3337:3217  left 813   中心 top 944
//   Fig 5    3337:3218  中心 top 1582，置中
//
// 三個框的底色 / 邊框 / 圓角 / overflow 來自共用的 .gm-panel（見 goodmood.css）——
// Figma 2026-09-02 把全站灰塊統一加了 1px #D9D9D9 邊框與 40 圓角，
// ① 的遮罩 2941:2632 也在內，所以左上框現在也是圓角的。
//
// ⚠️ 三個框裡放的是「原元件的副本」，不是截圖，也不共用原元件
// （使用者 2026-09-02 決策）。三份副本各自的檔頭都寫了「改了哪幾個地方」。
//
// ⚠️ logo 尺寸怎麼來的（① 的 --logo-w: 200px）：
// 原檔是 clamp(190px, 22vw, 300px)，綁 vw，塞進固定尺寸的小窗會隨視窗變動。
// 量法是拿 Figma 3292:2938 的實際渲染（598×574 PNG）反推——logo.svg 裡
// app icon 的底是一個 160×160 的 rect（#87FA89），在那張圖上量到約 112.5px，
// 縮放 = 112.5/160 = 0.7031，logo.svg 全寬 285 → 285 × 0.7031 = 200.4，取 200。
// 驗算：200px 下 icon 會落在裁切框的 x 242.5–354.8，Figma 量到 241–352，
// 左右各差 1.5 / 2.8px。
//
// ⚠️ Figma 圖裡看得到的「The city's better with company.」**不是** hero 的
// tagline（那個元素原檔預設 display:none，WanderBuddy 頁也沒開）。那行字是
// 照片牆裡某一張手機截圖上的內容，位置在左下、跟著平面傾斜。
export default function MakingAssets02() {
  const stageRef = useRef(null);

  /* ⚠️ 響應式縮放係數 --gm-a02-k = 舞台實際寬 / 設計寬 1234。
     三個框本身用 aspect-ratio 會跟著視窗縮，但框裡的內容是固定 px 的設計稿
     尺寸（② 手機 232.4×490、③ 暖手操 stage 707×763.36 + scale 0.8166）。
     純 CSS 做不到——calc() 不能用「長度 ÷ 長度」得到無單位的 scale 係數，
     container query 也只給得出長度。不修正的話 1155 下手機會撐破框（實測過）。
     ① 不受影響：那一格是「裁切成小窗」，框變窄就是露出更少，本來就不該縮。 */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const apply = () => {
      el.style.setProperty('--gm-a02-k', String(el.clientWidth / 1234));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="gm-section gm-assets02">
      <div className="gm-assets02-inner">
        <p className="gm-kicker">Making assets with AI · 02</p>

        <div className="gm-section-text">
          <h2 className="gm-subhead">Motion &amp; Animation</h2>

          {/* 3245:2834 —— Figma 是一個文字節點裡兩段。 */}
          <div className="gm-body">
            <p>
              For Suisui and WanderBuddy, a static UI screenshot didn&rsquo;t say what the product
              does. So the case pages open with a carousel animation, the interaction is visible in
              the first few seconds instead of described in a caption.
            </p>
            <p>
              I built the first version the way I always had, in Figma. Then I compared: a Figma
              prototype I&rsquo;d have to rebuild in code anyway, against implementing it directly in
              HTML with AI and tuning it live. For web interaction the second one was faster and the
              result was the real thing, not an approximation of it. That moved where the work
              happens. The browser became part of my design process, not just the place the design
              ends up.
            </p>
          </div>
        </div>

        <div className="gm-assets02-stage" ref={stageRef}>
          {/* ① WanderBuddy hero —— 裁切成小窗，不是整個縮小 */}
          <figure className="gm-fig gm-fig--hero">
            <div className="gm-panel gm-frame gm-frame--hero">
              <div className="gm-frame-crop">
                <HeroLoop />
              </div>
            </div>
            <figcaption className="gm-figcaption gm-figcaption--hero">
              Fig 3. The hero animation on the WanderBuddy page
            </figcaption>
          </figure>

          {/* ② Suì-Suì onboarding —— #FAFAFA 底，手機置中 */}
          <figure className="gm-fig gm-fig--onboarding">
            <div className="gm-panel gm-frame gm-frame--onboarding">
              <div className="gm-frame-phone">
                <OnboardingLoop />
              </div>
            </div>
            <figcaption className="gm-figcaption gm-figcaption--onboarding">
              Fig 4. The Suì-Suì onboarding flow.
            </figcaption>
          </figure>

          {/* ③ 暖手操 —— #FAFAFA 底，兩支手機並排、外層再整體縮小 */}
          <figure className="gm-fig gm-fig--warmup">
            <div className="gm-panel gm-frame gm-frame--warmup">
              <div className="gm-frame-warmup-scale">
                <HandWarmUpLoop assets="/web-assets" />
              </div>
            </div>
            <figcaption className="gm-figcaption gm-figcaption--warmup">
              Fig 5. The arm-swing exercise module in Suì-Suì.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
