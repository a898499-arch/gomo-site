'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

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

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

// 回傳 Lenis instance；掛載瞬間（第一次 render）會是 null，用到的元件要自己處理這個空檔。
export function useLenis() {
  return useContext(LenisContext);
}
