'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 2026-08-17：改用 get_design_context 讀 545:47 底下 Mockup1/2/3 的實際
// x 座標（相對頁面 1440 參考寬），不再一律置中——Figma 原稿本來就不是
// 三張都置中：Mockup2（x=13,w=1434）右緣其實超出 1440 邊界 7px，
// Mockup3（x=0）左緣貼齊頁面最左邊。超出的部分用外層 overflow:hidden
// 真的裁掉，不是縮小塞進來。
// 淡入淡出動畫比照 WanderBuddy 的 scrubbed 做法：進場淡入、中間停留、
// 離場淡出，全程跟著捲動位置走，往回捲完整反向。只動 opacity，沒有位移。
const FRAME_W = 1440;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctW = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;

export default function MockupFade({ src, alt, x = 0, w, h }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.set(el, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    tl.to(el, { opacity: 1, duration: 0.25, ease: 'none' })
      .to(el, { opacity: 1, duration: 0.5, ease: 'none' })
      .to(el, { opacity: 0, duration: 0.25, ease: 'none' });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="ss-section">
      <div className="ss-mockup-clip">
        <div
          className="ss-mockup"
          style={{ aspectRatio: `${w} / ${h}`, marginLeft: pctX(x), width: pctW(w) }}
          ref={containerRef}
        >
          <img src={src} alt={alt} className="ss-mockup-img" />
        </div>
      </div>
    </section>
  );
}
