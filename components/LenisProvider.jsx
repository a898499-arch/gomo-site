'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// §3.2：全站只能有一個 Lenis instance，開兩個會互搶 RAF 造成滾動抖動。
// 這個 instance 在 root layout 建立一次，透過 Context 分享給 Nav（scroll 方向判斷）、
// Footer（back-to-top）、以及之後會加入的各頁動效。
const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const instance = new Lenis({ duration: 1.2, smoothWheel: true });

    function raf(time) {
      instance.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      instance.destroy();
    };
  }, []);

  // 每個用 useStandardEntrance 的區塊各自在 mount 時呼叫 ScrollTrigger.create()，
  // 當下就把觸發點換算成絕對像素快取起來。字體（Raleway/Jost/Inter）非同步
  // 載入、embed/flow.js 是 beforeInteractive script 在 runtime 組出一大段 DOM
  // （不受 React 掛載順序控制）——這些都可能在頁面下半部的區塊已經算完觸發點
  // 之後，才讓總頁面高度再變動，使快取的觸發點跟實際位置對不上（越晚出現在
  // 頁面下方的區塊越容易受影響，例如 Mockup 2/3/4）。用 ResizeObserver 監看
  // <body> 高度、加上 window load／字體就緒各補一次 refresh 校正。
  useEffect(() => {
    let frame = null;
    function scheduleRefresh() {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleRefresh);
    }
    if (document.readyState === 'complete') {
      scheduleRefresh();
    } else {
      window.addEventListener('load', scheduleRefresh);
    }

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(document.body);

    return () => {
      window.removeEventListener('load', scheduleRefresh);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

// 回傳 Lenis instance；掛載瞬間（第一次 render）會是 null，用到的元件要自己處理這個空檔。
export function useLenis() {
  return useContext(LenisContext);
}
