'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// node 545:532（1450×900，「Process Animation」）。跟 OnboardingDemo.jsx
// 完全比照同一個做法：iframe 直接載入原始 HTML（public/work/sui-sui/
// ui-carousel/carousel.html），動畫邏輯一律不改——唯二例外是效能專用、
// 你明確批准的兩處：離螢幕的卡片改用 display:none（原本是
// visibility:hidden），以及新增一個 message 監聽器呼叫既有的
// setPaused()，兩者都不影響時序/緩動/座標，見該檔案內的註解）。
//
// 跟 OnboardingDemo 不同：這支輪播沒有固定的原生像素尺寸——carousel.html
// 自己用 innerWidth/innerHeight 算版面（見它的 layout()），還掛了
// window resize 監聽器隨時重排。iframe 是獨立的巢狀瀏覽環境，只要它的
// CSS 尺寸（不是 HTML width/height 屬性）改變，裡面的 window 就會自己
// 收到 resize、自己重新 layout()——不需要像 OnboardingDemo 那樣量測、
// 用 transform:scale() 縮放再裁切。也因為完全沒有對這個 iframe 套用
// CSS transform，不會踩到 OnboardingDemo 檔頭記錄的那個「捲動後
// transform-origin 跑掉」的瀏覽器問題（那個問題只在對 iframe 套用
// transform 時才會出現）。
//
// 外層 .ss-pa-frame 用 aspect-ratio:1450/900 鎖住 Figma 比例，隨容器寬度
// 等比縮放；iframe 用 position:absolute + inset:0 填滿整個框。
//
// 2026-08-22 第四輪：改成滿版出血——你要手機從畫面左右邊緣直接切出去，
// 跟直接開 carousel.html 看到的效果一樣。做法：不要包在 .page-container
// 裡面（那個 class 會加 max-width:1440px + padding-inline 的左右內距，
// 就是造成留白的原因）。.ss-section／.ss-case／.page-content 這幾層本身
// 都沒有額外的水平 padding（只有 .page-container 才有），所以只要不套用
// 那個 class，.ss-pa-frame 直接當 <section> 的子元素，天生就會撐滿整個
// 視窗寬度，不需要另外用 100vw + 負 margin 那種技巧，也不會動到上下相鄰
// 區塊（它們各自還是包在自己的 .page-container／.ss-section-inner 裡，
// 不受影響）。
//
// 2026-08-22 第五輪：效能修正（已批准，方案 A）——carousel.html 自己的
// frame() 迴圈完全沒有暫停檢查，捲出畫面外還在跑。這裡只新增一個「偵測
// 進出視窗、postMessage 通知」的觸發器，實際暫停/播放邏輯留在 iframe
// 內部處理，這裡完全不碰時序。
export default function ProcessAnimation() {
  const frameRef = useRef(null);
  const iframeRef = useRef(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const iframe = iframeRef.current;
    if (!frame || !iframe) return undefined;

    function send(msg) {
      iframe.contentWindow?.postMessage(msg, '*');
    }

    const st = ScrollTrigger.create({
      trigger: frame,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => send('play'),
      onEnterBack: () => send('play'),
      onLeave: () => send('pause'),
      onLeaveBack: () => send('pause'),
    });
    return () => st.kill();
  }, []);

  return (
    <section className="ss-section">
      <div ref={frameRef} className="ss-pa-frame" style={{ aspectRatio: '1450 / 900' }}>
        <iframe
          ref={iframeRef}
          src="/work/sui-sui/ui-carousel/carousel.html"
          title="Sui-Sui UI carousel"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', border: 0 }}
        />
      </div>
    </section>
  );
}
