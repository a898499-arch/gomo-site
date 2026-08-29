'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
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

// 換頁時通知 Nav 重設捲動方向判斷的基準。用 window 事件而不是 context，
// 是因為 React 的 effect 是「子先於親」——Nav 比 LenisProvider 深，它的
// effect 一定先跑完，等於在下面 dispatch 的當下 Nav 的監聽器必然已經掛好，
// 不受兩者 effect 的相對順序影響。詳見 Nav.jsx 對應的註解。
export const ROUTE_CHANGE_EVENT = 'gomo:route-change';

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const rafIdRef = useRef(null);
  const pathname = usePathname();
  const isFirstRouteRef = useRef(true);

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

  // ---------- 換頁時把捲動位置歸零 ----------
  // 問題：Lenis 這個 instance 建在 root layout、換頁不會重建，所以它不知道
  // Next.js 換頁了；而 Lenis 每個 RAF frame 都會把自己的 animatedScroll 寫回
  // window，Next 內建的「換頁捲到頂」下一幀就被覆蓋掉，新頁面因此停在前一頁
  // 的捲動位置。全專案沒有任何地方在換頁時呼叫 scrollTo(0)（只有 Footer 的
  // back-to-top，那是使用者主動點的動畫版），所以要在這裡補。
  //
  // ⚠️ immediate: true 是關鍵——不能用有動畫的版本，否則使用者會看到新頁面
  // 自己往上飛一段，比停在中間更怪。
  //
  // ⚠️ 順序不能反：先發事件讓 Nav 把 lastScrollY 歸零，再真的捲。反過來的話
  // 歸零會產生一個「從 5000 掉到 0」的巨大負 delta，被 Nav 判定成使用者往上
  // 滑而把導覽列叫出來——WanderBuddy 那種「進頁時隱藏」的頁面就會破功。
  // 先發事件之後，scrollTo 送出的 scroll=0 事件算出來的 diff 是 0，不會誤判；
  // 而一般頁面會走 Nav 裡「y <= TOP_DEAD_ZONE 就顯示」那條，導覽列正常出現。
  //
  // ⚠️ 首次載入不做：那時沒有「前一頁」，硬捲會蓋掉深連結／錨點。
  //
  // ⚠️ 已知取捨：瀏覽器「上一頁」也會被歸零，不會回到原本的捲動位置。
  // Lenis 接管捲動之後 Next 的 scroll restoration 本來就已經失效，要做到真正
  // 的還原得自己記錄每個 history entry 的位置，這一輪沒有做。已回報。
  useEffect(() => {
    if (!lenis) return;
    if (isFirstRouteRef.current) {
      isFirstRouteRef.current = false;
      return;
    }

    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
    lenis.scrollTo(0, { immediate: true, force: true });

    // 新頁面高度不同，所有觸發點都要重算。放在捲動歸零之後才算，不然會用
    // 前一頁的捲動位置去換算。用 rAF 等這一幀的版面定下來再算，跟上面那組
    // 字體／load／ResizeObserver 的 scheduleRefresh 同一個做法。
    // 這時捲動已經在 0，所以只有首屏的區塊會被觸發，不會整頁一次播完。
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

// 回傳 Lenis instance；掛載瞬間（第一次 render）會是 null，用到的元件要自己處理這個空檔。
export function useLenis() {
  return useContext(LenisContext);
}
