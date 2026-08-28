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
//
// 2026-08-28 新增三個選用參數，**預設值都維持原行為**，既有呼叫端不受影響：
//   start   ScrollTrigger 的觸發點，預設 'top 80%'（原本寫死）。
//           ⚠️ 百分比越大越早觸發（元素頂碰到視窗 85% 處比碰到 80% 處早）。
//   delay   進場延遲（秒）。可以給函式，在 onEnter 當下才求值——用來表達
//           「要比另一區晚 N 秒」這種跨區塊的相依（見 Solution.jsx）。
//   onStart 進場真正開始播的當下呼叫，用來讓另一區知道自己何時開始。
// delay/onStart 走 ref 讀取，所以就算每次 render 都傳新的函式，也不會害
// effect 重跑、ScrollTrigger 重建。
export function useStandardEntrance(
  itemsSelector,
  { stagger = 0.06, opacityOnly = false, start = 'top 80%', delay = 0, onStart } = {},
) {
  const containerRef = useRef(null);
  const delayRef = useRef(delay);
  const onStartRef = useRef(onStart);
  delayRef.current = delay;
  onStartRef.current = onStart;

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
      start,
      once: true,
      onEnter: () => {
        const d = typeof delayRef.current === 'function' ? delayRef.current() : delayRef.current;
        const base = { opacity: 1, duration: 0.6, ease: mainEase, stagger, delay: d };
        // onStart 掛在 tween 上，所以回報的是「延遲結束、真的開始動」的時刻，
        // 不是「觸發點被跨過」的時刻——後者拿來算跨區間隔會差一個 delay。
        if (onStartRef.current) base.onStart = () => onStartRef.current();
        gsap.to(items, opacityOnly ? base : { ...base, y: 0 });
      },
    });

    return () => st.kill();
  }, [itemsSelector, stagger, opacityOnly, start]);

  return containerRef;
}
