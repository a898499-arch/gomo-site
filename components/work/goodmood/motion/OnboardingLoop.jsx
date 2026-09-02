'use client';

import { useLayoutEffect, useRef } from 'react';
import useInViewPause from '../useInViewPause';

/**
 * Suì-Suì onboarding demo —— **components/work/sui-sui/OnboardingDemo.jsx 的副本**
 *
 * ⚠️ 這是 components/work/sui-sui/OnboardingDemo.jsx 的副本，原檔在
 * components/work/sui-sui/OnboardingDemo.jsx（由 Function1.jsx 使用）。
 * 兩邊是**刻意分開維護**的：改原檔不會同步過來，改這裡也不會影響
 * Sui-Sui 頁。使用者 2026-09-02 裁示。
 *
 * 副本相對原檔改了「三個地方」，對齊邏輯（量 .phone 原生 top 再校正）
 * 與所有時序完全照抄：
 *   1. TARGET_PHONE_HEIGHT：676 → 490
 *      Figma 3292:2936 的手機本體是 229×490，要的是高度 490。
 *      SCALE 因此從 0.752784 變成 490/898 = 0.545657。
 *      裁切框寬 = 426 × 0.545657 = 232.4；Figma 標 229，差 3.4px。
 *      ⚠️ **採用 232.4，不要硬壓成 229**——229 是 Figma 四捨五入的結果，
 *      硬壓會把手機左右各切掉 1.7px，正好切在圓角外框上，邊會被削掉
 *      （使用者 2026-09-02 裁示）。
 *   2. ScrollTrigger → useInViewPause（IntersectionObserver）
 *      原檔用 ScrollTrigger 做「進出視窗就 postMessage play/pause」。
 *      那件事只需要一個布林值，goodmood 這一頁沒有 GSAP，為此把
 *      gsap + ScrollTrigger 拉進來不划算（§8 效能預算）。
 *      postMessage 的協定與 iframe 內部的 setPlay() 完全沒動。
 *   3. 拿掉 export const SCALE——原檔那個 export 是給 Function1.jsx 的
 *      除錯讀數用的，副本沒有對應的使用者。
 *
 * iframe 的 src 與原檔指向同一支 demo（public/work/sui-sui/onboarding-demo/），
 * 沒有另外複製一份 HTML。
 */

const PHONE_NATIVE_W = 426;
const PHONE_NATIVE_H = 898;
const PHONE_RADIUS = 56;
const MARGIN_X = 0;
const MARGIN_TOP = 0;
const MARGIN_BOTTOM = 2;
const IFRAME_NATIVE_W = PHONE_NATIVE_W + MARGIN_X * 2; // 426
const STAGE_NATIVE_H = 1031; // > demo 自己 @media(max-height:960px) 的門檻，避免誤觸發內部縮小
const TARGET_PHONE_HEIGHT = 490; // ← 副本唯一改動的常數（原檔是 676）
const SCALE = TARGET_PHONE_HEIGHT / PHONE_NATIVE_H;

export default function OnboardingLoop() {
  const cropRef = useRef(null);
  const iframeRef = useRef(null);
  const inView = useInViewPause(cropRef);

  // 對齊：不假設 .phone 在 iframe 內部的原生 top ≈ 0，掛載後直接讀
  // iframe.contentDocument 量真正的位置再校正。（照抄原檔，理由見原檔註解：
  // .controls 加了 display:none 之後 .stage 變矮、被 body 的 align-items:center
  // 重新置中，原生 top 從 ~0 變成 47.5，寫死假設值會讓手機上下被裁。）
  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    const crop = cropRef.current;
    if (!iframe || !crop) return undefined;

    let phoneNativeTop = 0;

    function align() {
      iframe.style.top = '0px';
      const cropRect = crop.getBoundingClientRect();
      const ifRect = iframe.getBoundingClientRect();
      const desiredTop = cropRect.top + (MARGIN_TOP - phoneNativeTop) * SCALE;
      // ⚠️ 副本改動（2026-09-02）：除以外層的累積縮放。
      // getBoundingClientRect() 回的是「已經套過所有祖先 transform」的畫面座標，
      // 但 iframe.style.top 寫進去的是**未縮放**的區域座標。原檔沒有這個問題，
      // 因為它的祖先沒有 scale；副本外面有一層 --gm-a02-k 的響應式縮放
      // （見 goodmood.css 的 .gm-frame-phone），1440 下 k=1 剛好看不出來，
      // 1155 下手機會整支往上跑、頂端被裁掉（實測過）。
      const k = crop.offsetWidth ? cropRect.width / crop.offsetWidth : 1;
      iframe.style.top = `${(desiredTop - ifRect.top) / (k || 1)}px`;
    }

    function measurePhoneNativeTop() {
      try {
        const phone = iframe.contentDocument?.querySelector('.phone');
        if (phone) phoneNativeTop = phone.getBoundingClientRect().top;
      } catch {
        // 同源理論上讀得到，讀不到就維持 0
      }
      align();
    }

    measurePhoneNativeTop();
    iframe.addEventListener('load', measurePhoneNativeTop);
    window.addEventListener('scroll', align, { passive: true });
    return () => {
      iframe.removeEventListener('load', measurePhoneNativeTop);
      window.removeEventListener('scroll', align);
    };
  }, []);

  // 進出視窗時通知 iframe 播放／暫停。實際的暫停邏輯留在 iframe 內部自己的
  // setPlay()，這裡完全不碰時序（協定與原檔相同）。
  useLayoutEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(inView ? 'play' : 'pause', '*');
  }, [inView]);

  const cropWidth = IFRAME_NATIVE_W * SCALE;
  const cropHeight = (PHONE_NATIVE_H + MARGIN_TOP + MARGIN_BOTTOM) * SCALE;
  const cropTop = -(MARGIN_TOP * SCALE);
  const cropRadius = PHONE_RADIUS * SCALE;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={cropRef}
        style={{
          position: 'absolute',
          top: `${cropTop}px`,
          left: '50%',
          width: `${cropWidth}px`,
          height: `${cropHeight}px`,
          borderRadius: `${cropRadius}px`,
          transform: 'translateX(-50%)',
          overflow: 'hidden',
        }}
      >
        <iframe
          ref={iframeRef}
          src="/work/sui-sui/onboarding-demo/suisui-onboarding-demo.html"
          title="Sui-Sui onboarding flow demo"
          width={IFRAME_NATIVE_W}
          height={STAGE_NATIVE_H}
          loading="lazy"
          style={{
            position: 'absolute',
            left: 0,
            display: 'block',
            border: 0,
            willChange: 'transform',
            transform: `scale(${SCALE})`,
            transformOrigin: '0 0',
          }}
        />
      </div>
    </div>
  );
}
