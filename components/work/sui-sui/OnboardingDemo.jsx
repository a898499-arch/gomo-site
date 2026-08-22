'use client';

import { useLayoutEffect, useRef, useState } from 'react';

// node 545:117（Function 1，見 Function1.jsx）。這隻 demo（public/work/
// sui-sui/onboarding-demo/，從 all-ui-animation/ 逐位元組複製、沒有改過
// 一個字）原生是 .phone 426×898（黑色外框本身就是 .phone，包含 border-
// radius:56px 圓角），.stage 是 flex-column（phone + 22 gap + 16 字幕 +
// 22 gap + 72.5 控制列）。
//
// 2026-08-22 第四輪：原本把裁切框寬度精確設成「縮放後手機寬度」
// （scaledPhoneW），結果圓角被裁成直角——裁切框剛好卡在手機的外緣，
// 任何一點點次像素誤差（scale 是跑時量出來的浮點數，不是固定常數）都會
// 削掉圓角弧線最外側那一圈，把圓角變直角。改成「裁切框刻意做得比手機
// 本體大一圈」：四個方向都留 MARGIN_* 的安全邊界，讓圓角和陰影有空間
// 完整顯示，不再靠縮小裁切框去精準卡邊。縮放一律用外層裁切框的
// transform:scale()，不靠縮小 iframe 本身來達成（你的指示）。
// - MARGIN_X（左右）＝20：iframe 原生寬度設成 466（=426+20*2），比
//   .stage 自然寬度 439.04px 還寬，所以 .phone 會透過 .stage 的
//   align-items:center 跟 body 的 justify-content:center 兩層置中，
//   自動精確置中在這個 466 寬的 iframe 正中央（推導：iframe 466 減去
//   .stage 439.04 剩 26.96，.stage 內 .phone 426 減 439.04 剩 13.04，
//   兩個置中留白各半相加＝(26.96+13.04)/2=20，正好等於 MARGIN_X，
//   不用另外用 left 位移去對齊）。
// - MARGIN_TOP＝12、MARGIN_BOTTOM＝16：手機上緣原生位置就在 .stage
//   最頂端（y≈0），往上留白只是單純的安全邊界；下緣往下留白必須小於
//   「手機底部到字幕開始」那 22.25px 的間隙（898 到 920.25），不然會
//   露出字幕，16px 留了 6.25px 緩衝。
//
// 縮放依高度計算：scale = 外層容器實際高度 / PHONE_NATIVE_H，容器高度
// 由 Function1.jsx 的 .ss-fn1-phone-wrap 決定（現在是固定 676px，見該
// 檔案）——這樣算出來的手機外框「含黑色邊框」高度精確等於容器高度，跟
// 上一輪一樣用 getBoundingClientRect 量而不是 ResizeObserver（自動化
// 分頁背景執行時 ResizeObserver 完全不觸發，見下方 useLayoutEffect
// 註解）。
//
// 垂直對齊仍然要用「掛載時 + 每次捲動後重新量測、動態校正 top」的做法
// ——實測發現只要對這個 iframe 套用 CSS transform，捲動之後瀏覽器算出來
// 的實際渲染位置會固定偏移一段距離，不管 transform-origin 設什麼都一樣
// （在全新分頁、乾淨重新整理後一樣重現，不是分頁殘留或延伸套件雜訊）。
// 沒有再深究成因，改成量到多少就直接校正多少。
const PHONE_NATIVE_W = 426;
const PHONE_NATIVE_H = 898;
const MARGIN_X = 20;
const MARGIN_TOP = 12;
const MARGIN_BOTTOM = 16;
const IFRAME_NATIVE_W = PHONE_NATIVE_W + MARGIN_X * 2; // 466
const STAGE_NATIVE_H = 1031; // > demo 自己 @media(max-height:960px) 的門檻，避免誤觸發內部縮小

export default function OnboardingDemo() {
  const outerRef = useRef(null);
  const cropRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(0);

  // 用 useLayoutEffect + getBoundingClientRect（同步量測，不受分頁背景/
  // 焦點狀態影響）取代 ResizeObserver——實測發現 ResizeObserver 在這個
  // 自動化分頁裡完全不觸發（document.visibilityState==='hidden' 時被
  // 瀏覽器節流），沒辦法驗證。改用它 + window resize 事件重新量測。
  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;
    function measure() {
      const h = outer.getBoundingClientRect().height;
      if (h > 0) setScale(h / PHONE_NATIVE_H);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    const crop = cropRef.current;
    if (!iframe || !crop || scale === 0) return undefined;

    function align() {
      iframe.style.top = '0px';
      const cropRect = crop.getBoundingClientRect();
      const ifRect = iframe.getBoundingClientRect();
      const desiredTop = cropRect.top + MARGIN_TOP * scale;
      iframe.style.top = `${desiredTop - ifRect.top}px`;
    }

    align();
    window.addEventListener('scroll', align, { passive: true });
    return () => window.removeEventListener('scroll', align);
  }, [scale]);

  const cropWidth = IFRAME_NATIVE_W * scale;
  const cropHeight = (PHONE_NATIVE_H + MARGIN_TOP + MARGIN_BOTTOM) * scale;
  const cropTop = -(MARGIN_TOP * scale);

  return (
    <div ref={outerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {scale > 0 && (
        <div
          ref={cropRef}
          style={{
            position: 'absolute',
            top: `${cropTop}px`,
            left: '50%',
            width: `${cropWidth}px`,
            height: `${cropHeight}px`,
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
            style={{
              position: 'absolute',
              left: 0,
              display: 'block',
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          />
        </div>
      )}
    </div>
  );
}
