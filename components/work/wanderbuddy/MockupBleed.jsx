'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Figma node 491:59 上 Mock up 2/3/4 的 x 座標是相對於 1440 參考寬度算的，
// 三張裡有兩張超出 1440 的畫布邊界（往左或往右出血），不是置中。用 %
// 定位在一個滿版、overflow:hidden 的容器裡，超出的部分真的被裁掉，
// 不縮小塞進來。
//
// 2026-08-16：進場動畫從「once:true 的單純淡入」改成 scrubbed 淡入淡出
// ——你要求「每次捲過去都有明顯的淡入淡出」，不是只播一次。用一張圖片
// 自己完整穿過視窗的距離當作 scrub 的 start/end（start: top bottom＝圖片
// 剛從視窗底部進入；end: bottom top＝圖片完全離開視窗頂部），progress
// 0→1 直接對應這段捲動距離，往回捲會精確反向，不是 once。中間 p=0.25～
// 0.75 維持 opacity:1，不是全程漸變。只動 opacity，沒有位移。這個元件
// 不再共用 useStandardEntrance（那支 hook 是 once:true 設計，跟這裡要的
// scrub 行為不同），Shot.jsx 等其餘用 useStandardEntrance 的區塊不受影響。
const FRAME_W = 1440;

export default function MockupBleed({ src, alt, x, w, h }) {
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
    <section className="wb-section">
      <div
        className="wb-mockup-bleed"
        style={{ aspectRatio: `${FRAME_W} / ${h}` }}
        ref={containerRef}
      >
        <img
          src={src}
          srcSet={`${src} 1x, ${src.replace(/\.webp$/, '@2x.webp')} 2x`}
          alt={alt}
          className="wb-mockup-bleed-img"
          style={{ left: `${((x / FRAME_W) * 100).toFixed(4)}%`, width: `${((w / FRAME_W) * 100).toFixed(4)}%` }}
        />
      </div>
    </section>
  );
}
