'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// node 545:117（Function 1，見 Function1.jsx）。這隻 demo（public/work/
// sui-sui/onboarding-demo/，從 all-ui-animation/ 逐位元組複製、動畫邏輯
// 沒有改過一個字——唯二的例外是效能專用、你明確批准的兩處：.controls
// 加了 display:none，以及新增一個 message 監聽器呼叫既有的 setPlay()，
// 兩者都不影響時序/緩動/座標，見該檔案內的註解）原生是 .phone 426×898
// （黑色外框本身就是 .phone，包含 border-radius:56px 圓角），.stage 是
// flex-column（phone + 22 gap + 16 字幕 + 22 gap + 72.5 控制列）。
//
// 2026-08-23 第三輪：手機尺寸「反覆跑掉」的根本原因——scale 原本是跑時
// 算的：用 useLayoutEffect 量 outerRef（填滿 .ss-fn1-phone-wrap 的
// 100%/100% 那層）的 getBoundingClientRect().height，除以 PHONE_NATIVE_H
// 得到 scale。.ss-fn1-phone-wrap 的 CSS 高度本身沒有被誰改動過（查過
// git 紀錄，一直是固定的 676px），問題出在「量測」這一步本身不穩定：
// 這個元件在這一輪對話裡被反覆修改、疊了好幾次 Next.js Fast Refresh
// 熱更新，React 在熱更新時會盡量保留同一個元件實例的 state（這裡是
// useState 存的 scale）——如果某一次熱更新發生在畫面還沒完全 settle
// （例如某個中間態的版面還沒套用最終 CSS）的瞬間量到一個不對的高度，
// 這個錯的 scale 就會被「保留」下來，而 resize 監聽器只在「視窗真的
// 縮放」時才會重新量測，不會因為熱更新本身觸發，所以錯誤的值會一直卡
// 著，直到整頁重新整理。這解釋了「旁邊隨便改點什麼、這裡就跟著跑掉」
// 的現象——跟容器高度、視窗高度本身都沒有關係，是「量測時機」不穩定，
// 不是量測邏輯或 CSS 本身有 bug。
//
// 修法（你的指示）：不要再依賴任何跑時量測，scale 直接用目標高度
// 反推、寫成常數。這樣不管熱更新在哪個時間點發生、旁邊版面怎麼變動，
// 手機都固定是 676px，不存在「量到一個過渡態的錯誤值」這種可能性。
// 676px 這個目標高度目前不分斷點（1155px／1440px 都一樣，你的指示從
// 頭到尾都沒有要求隨寬度變化），所以只要一個常數，不需要 media query
// 開好幾組。
const PHONE_NATIVE_W = 426;
const PHONE_NATIVE_H = 898;
const PHONE_RADIUS = 56;
const MARGIN_X = 0;
const MARGIN_TOP = 0;
const MARGIN_BOTTOM = 2;
const IFRAME_NATIVE_W = PHONE_NATIVE_W + MARGIN_X * 2; // 426
const STAGE_NATIVE_H = 1031; // > demo 自己 @media(max-height:960px) 的門檻，避免誤觸發內部縮小
const TARGET_PHONE_HEIGHT = 676; // 固定目標高度（含黑色外框），不分斷點
const SCALE = TARGET_PHONE_HEIGHT / PHONE_NATIVE_H; // 常數，不再跑時量測

export default function OnboardingDemo() {
  const cropRef = useRef(null);
  const iframeRef = useRef(null);

  // 垂直對齊仍然要用「掛載時 + 每次捲動後重新量測、動態校正 top」的
  // 做法——這是另一個獨立的問題（跟上面的 scale 反覆跑掉無關）：實測
  // 發現只要對這個 iframe 套用 CSS transform，捲動之後瀏覽器算出來的
  // 實際渲染位置會固定偏移一段距離，不管 transform-origin 設什麼都
  // 一樣（在全新分頁、乾淨重新整理後一樣重現，不是分頁殘留或延伸套件
  // 雜訊）。這裡的「量測」只用來校正這個偏移量，不影響 scale/尺寸，
  // 所以不會有跟上面同一種「熱更新期間量到過渡態」的風險——就算量到
  // 暫時不準的值，下一次 scroll 事件就會立刻重新校正，不會卡住。
  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    const crop = cropRef.current;
    if (!iframe || !crop) return undefined;

    function align() {
      iframe.style.top = '0px';
      const cropRect = crop.getBoundingClientRect();
      const ifRect = iframe.getBoundingClientRect();
      const desiredTop = cropRect.top + MARGIN_TOP * SCALE;
      iframe.style.top = `${desiredTop - ifRect.top}px`;
    }

    align();
    window.addEventListener('scroll', align, { passive: true });
    return () => window.removeEventListener('scroll', align);
  }, []);

  // 效能修正（已批准，方案 A）：iframe 內部一直跑自己的 RAF 迴圈，不管
  // 有沒有被捲到視窗外都在算。這裡只新增一個「偵測進出視窗、postMessage
  // 通知」的觸發器，實際暫停/播放邏輯留在 iframe 內部自己的 setPlay()
  // 處理（見該檔案），這裡完全不碰時序。
  useLayoutEffect(() => {
    const crop = cropRef.current;
    const iframe = iframeRef.current;
    if (!crop || !iframe) return undefined;

    function send(msg) {
      iframe.contentWindow?.postMessage(msg, '*');
    }

    const st = ScrollTrigger.create({
      trigger: crop,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => send('play'),
      onEnterBack: () => send('play'),
      onLeave: () => send('pause'),
      onLeaveBack: () => send('pause'),
    });
    return () => st.kill();
  }, []);

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
