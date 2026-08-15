'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 「標準進場」：translateY(24px)+opacity 0 → translateY(0)+opacity 1，600ms，
// 主曲線，同區內元素 stagger 60ms（可覆寫），ScrollTrigger 在區塊越過視窗高度
// 80% 時觸發一次。itemsSelector 不給的話，整個容器當一個單位一起動（例如
// Sign Up Flow 那種「一次出現不分 stagger」的區塊）。
// opacityOnly：只動 opacity，不做 translateY（Mock up 2/3/4 出血版面用這個，
// 是你特別要求跟其餘標準進場不同的地方）。
export function useStandardEntrance(itemsSelector, { stagger = 0.06, opacityOnly = false } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = itemsSelector ? root.querySelectorAll(itemsSelector) : [root];
    if (!items.length) return;

    if (reduceMotion) {
      gsap.set(items, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(items, opacityOnly ? { opacity: 0 } : { y: 24, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(items, opacityOnly
          ? { opacity: 1, duration: 0.6, ease: mainEase, stagger }
          : { y: 0, opacity: 1, duration: 0.6, ease: mainEase, stagger });
      },
    });

    return () => st.kill();
  }, [itemsSelector, stagger, opacityOnly]);

  return containerRef;
}
