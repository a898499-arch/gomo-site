'use client';

import { useEffect, useState } from 'react';

/**
 * 「這個元素在不在視窗裡」——輪 4 三個動畫框共用的暫停判斷。
 *
 * ⚠️ 刻意用 IntersectionObserver，不用 ScrollTrigger（規格書 §8 效能預算）：
 * 三個框都只需要一個布林值「在／不在畫面上」，不需要捲動進度。goodmood 這
 * 一頁目前完全沒有 GSAP，為了一個布林值把 gsap + ScrollTrigger 拉進來不划算。
 * （被複製的 OnboardingDemo 原檔用的是 ScrollTrigger，副本換成這一支——原檔
 * 不動，見 motion/OnboardingLoop.jsx 的檔頭。）
 *
 * rootMargin 200px：提早一點點恢復播放，捲到的時候動畫已經在跑，
 * 不會看到「進畫面才啟動」的那一下。
 *
 * SSR 安全：初始值 false，第一次 observe 會立刻回報真實狀態。
 */
export default function useInViewPause(ref, { rootMargin = '200px 0px' } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // 沒有 IntersectionObserver 的環境就永遠當成「在畫面上」——寧可多跑，
    // 也不要整區靜止不動。
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
