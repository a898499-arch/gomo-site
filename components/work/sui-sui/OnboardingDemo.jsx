'use client';

import { useEffect, useRef } from 'react';
import './onboardingDemo.css';
import { ONBOARDING_DEMO_MARKUP } from './onboardingDemoMarkup';

// node 545:530（1446×924，「All UI Animation」）。2026-08-20：接進你在
// all-ui-animation/suisui-onboarding-demo/ 做好的成品，比照 embed/hero
// 的「複製檔案，不重寫」原則——時序/緩動/座標一律不動，見
// public/onboarding-demo.js 跟 onboardingDemo.css 檔頭的說明，那裡列了
// 僅有的幾處外部整合必要修改（IIFE 包裝、拿掉全域鍵盤快速鍵、
// window.SuiSuiOnboardingDemo 這個 play/pause 對外接口）。
//
// 2026-08-21：手機框固定 720px 高（含框，不是螢幕內容區），寬度照
// 426/898 原始比例等比縮放，不再跟著容器寬度縮放。比例是固定常數
// （720/898），直接寫死在 onboardingDemo.css 的 .stage 規則裡，不用 JS
// 算——拿掉了原本量容器高度的 ResizeObserver（那是上一輪「貼齊 Figma
// 槽位高度」的做法，這輪你要的是固定尺寸，不是跟著容器等比縮放），
// 順便避免 JS 還沒跑完之前先閃一下未縮放的 898px 版本。另外加一條
// #F5F5F5 出血背景帶（見 .ss-onboarding-band），手機在這條背景帶上垂直
// 置中。Figma node 545:530 上這條背景帶沒有單獨的圖層資訊（那個節點
// 就是一張截圖佔位圖，沒有額外結構），所以尺寸/位置照你給的數字做，
// 不是我自己猜的。
//
// 這裡的責任：
// 1. 把標記（ONBOARDING_DEMO_MARKUP）用 dangerouslySetInnerHTML 放進
//    DOM——一定要在 script 載入之前就存在，因為 onboarding-demo.js
//    在頂層就會直接 document.querySelector('#cursor') 等等，不是
//    factory function 模式。
// 2. markup 確定在 DOM 之後，才動態插入 <script src="/onboarding-demo.js">
//    ，而且只插入一次——React 18 開發模式的 StrictMode 會把 effect 跑
//    兩次（mount→cleanup→mount），用模組層級的旗標讓 script 對整個
//    頁面只真正載入一次。
// 3. IntersectionObserver 控制 play()/pause()（進視窗播、離開視窗真正
//    停止 rAF，不是只是凍結畫面）。
const BAND_HEIGHT = 865;

let scriptLoadPromise = null;
function loadOnboardingScriptOnce() {
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/onboarding-demo.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

export default function OnboardingDemo() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let cancelled = false;
    let io;

    loadOnboardingScriptOnce().then(() => {
      if (cancelled) return;
      io = new IntersectionObserver(
        ([entry]) => {
          const api = window.SuiSuiOnboardingDemo;
          if (!api) return;
          if (entry.isIntersecting) api.play();
          else api.pause();
        },
        { threshold: 0.25 }
      );
      io.observe(wrapper);
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      window.SuiSuiOnboardingDemo?.pause();
    };
  }, []);

  return (
    <section className="ss-section">
      <div className="ss-onboarding-band-wrap" style={{ height: `${BAND_HEIGHT}px` }}>
        <div className="ss-onboarding-band" aria-hidden="true" />
        <div
          className="ss-onboarding-demo"
          ref={wrapperRef}
          dangerouslySetInnerHTML={{ __html: ONBOARDING_DEMO_MARKUP }}
        />
      </div>
    </section>
  );
}
