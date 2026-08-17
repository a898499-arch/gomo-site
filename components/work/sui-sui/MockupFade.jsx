'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Mockup 1/2/3 都置中在 1440 參考寬度內（不像 WanderBuddy 那頁刻意出血），
// 但淡入淡出動畫比照 WanderBuddy 的 scrubbed 做法：進場淡入、中間停留、
// 離場淡出，全程跟著捲動位置走，往回捲完整反向（不是 once）。只動
// opacity，沒有位移。
const FRAME_W = 1440;

export default function MockupFade({ src, alt, w, h }) {
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
      <div className="ss-section-inner">
        <div
          className="ss-mockup"
          style={{ aspectRatio: `${w} / ${h}`, maxWidth: `${((w / FRAME_W) * 100).toFixed(4)}%` }}
          ref={containerRef}
        >
          <img src={src} alt={alt} className="ss-mockup-img" />
        </div>
      </div>
    </section>
  );
}
