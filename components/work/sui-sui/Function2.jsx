'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// node 545:510。2026-08-23 第四輪：「右側三合一」——紅色漸層、手拿手機、
// 底部淡出遮罩這三個分開實作時一直修不好（變形、硬邊、露出多餘背景），
// 你已經在 Figma 合成好一張圖 export
// public/work/sui-sui/function2-right-composite@2x.png，直接用這張取代
// 那三個獨立元素，不再各自實作。
//
// ⚠️ 尺寸一直對不上，這是第三次回報：你先說「1244×910」，後改口
// 「1244×810」，實際讀檔（sharp 量出來）當時是 2888×1738px（比例
// 1.6617），跟兩個數字都對不上。這輪你重新上傳了這張圖，檔案變成
// 3711×2595（比例 1.4301），高度改用新比例重算（見下方常數）。但這輪
// 讀新檔更嚴重的問題是：新圖完全沒有紅色漸層了（抽樣多點像素都是
// R=G=B 的灰階，見下方常數區塊的說明），不是尺寸問題，是內容本身缺了
// 紅色暈染，需要你確認。
//
// 合成圖的定位錨點沿用上一輪重讀 Figma 545:510 確認過的值：外層分組
// node 744:67（包住紅色漸層 744:68 跟手機遮罩 744:69/71 兩者）的絕對
// 座標是 left:163,top:47。這輪你要求整體再往下移 90px，變成
// left:163,top:137（見下方 COMPOSITE.y）。
//
// 整體用「100vw 出血」做法：
// - 這個 section 不包 .page-container 在最外層（用 100vw 出血），但文字
//   /手機/合成圖那組座標的「水平對齊基準」還是要跟導覽列一致——這裡改成
//   直接把 .ss-fn2-content 包一層 .page-container（複用導覽列自己用的
//   同一個 class，不是自己另外算 margin-left），保證兩者的左緣定義完全
//   同源，不會再對不齊。page-container 本身沒有 overflow:hidden，包在
//   裡面的內容一樣可以視覺上出血超出它自己的框，不影響出血效果。
// - .ss-fn2-content 用 transform:scale() 把整組原生 1440 基準座標縮放到
//   目前視窗寬度（scale = min(視窗寬度,1440)/1440，量的是
//   window.innerWidth 本身，不是量某個 DOM 元素，不會踩到 OnboardingDemo
//   那次「量到過渡態」的雷）。
// - 沒有任何 overflow:hidden／overflow-x:hidden 在這個元件的任何容器上
//   ——水平捲軸統一交給 body 的 overflow-x:clip 處理（見
//   app/globals.css）。
//
// 座標表（原點是 .ss-fn2-content 左上角，也就是 .page-container 內容區
// 的左上角，對齊導覽列 logo 左緣，單位 px，1440 基準）：
//   文字區塊 545:513：       x=0   y=0   w=885
//   左手機 545:522：         x=220 y=349 w=241  h=490
//   中手機 545:521：         x=595 y=235 w=290  h=590
//   合成圖（紅色漸層+右手機+
//   底部淡出遮罩）：         x=163 y=137 w=1244 h=870.1（見下方尺寸註記，
//     y 是原本 47 + 你這輪要求的 +90px）
//   Course preview 545:523： 綁左手機，offset (44,-46)
//   Product scanning 545:525：綁中手機，offset (61,-41)
//   Product library 545:527： 綁合成圖，offset (888,-34)
//     ——Figma 545:527 絕對座標 x=1051,y=13 沒變，減掉合成圖原始錨點
//     (163,47)：1051-163=888，13-47=-34。合成圖整體下移 90px 之後，
//     badge 的 offset（相對合成圖自己的 group）不用跟著變——它是相對
//     group 自己算的，group 下移多少 badge 就跟著下移多少，這正是你要的
//     「保持它跟手機的相對位置不變」。
//
// 圖層順序（第一次做的時候疊反了，合成圖蓋住了左/中手機）：合成圖必須
// 是「最底層」，DOM 順序放在文字/手機/badge 之前——CSS 沒有另外設
// z-index 時，後面的元素蓋在前面元素上面，合成圖要墊底就要最先出現在
// DOM 裡。
//
// 動畫（跟你確認過的順序，紅色漸層那一步取消，因為它現在在合成圖裡）：
// 1. 標題與說明文字（標準進場）
// 2. 左手機 + Course preview（一起）
// 3. 中手機 + Product scanning（一起）
// 4. 合成圖 + Product library（一起）
// 每組 translateY(40px)+opacity 0 → 定位，700ms，
// cubic-bezier(0.22,1,0.36,1)（= mainEase），組間 stagger 180ms。
const DESIGN_REF_W = 1440; // Figma 整頁畫布參考寬度

// 2026-08-23 第六輪：素材換新——你重新上傳了 function2-right-composite
// @2x.png。過程中抓到一個中間版本完全沒有紅色漸層（抽樣多點像素都是
// R=G=B 的灰階，2888×1738 那份），後來你又上傳了一次修正版——現在讀到
// 的是 4011×2607（比例 1.5386），抽樣像素在漸層區域是 [143,1,24] 這種
// 明顯偏紅的值，確認紅色漸層有回來了。高度照這份最終版重算：
// 1244×(2607/4011)＝808.7px（見下方常數）——這個數字跟你這輪說的
// 「810」幾乎一致，應該就是你這份定案的匯出檔。
const COMPOSITE_W = 1244;
const COMPOSITE_NATIVE_RATIO = 2607 / 4011; // 量最終版檔案量到的
const COMPOSITE_H = COMPOSITE_W * COMPOSITE_NATIVE_RATIO; // ≈808.7

const PHONES = [
  {
    key: 'course',
    src: '/work/sui-sui/function2-intro-page.png',
    alt: 'Phone screen showing a Morning Glow routine preview with toner, face cream, and cotton pad',
    x: 220, y: 349, w: 241, h: 490,
    badge: { label: 'Course preview', dx: 44, dy: -46, w: 154, bold: false },
  },
  {
    key: 'scanning',
    src: '/work/sui-sui/function2-products-overview.png',
    alt: 'Phone screen showing a saved product library with Toner, Cleansing Cream, Facial Oil, and Face Cream',
    x: 595, y: 235, w: 290, h: 590,
    badge: { label: 'Product scanning', dx: 61, dy: -41, w: 167, bold: false },
  },
];

// 合成圖本身也當一個「group」處理（跟手機一樣：本體+badge 包一組，
// 動畫套在 group 上兩者自動一起動），只是本體換成 <img> 直接顯示合成圖，
// 不再是分開的紅色漸層 + 手機 + 遮罩三層。
const COMPOSITE = {
  x: 163, y: 47 + 90, w: COMPOSITE_W, h: COMPOSITE_H, // y: 你要求整體下移 90px
  badge: { label: 'Product library', dx: 888, dy: -34, w: 149, bold: true },
};

export default function Function2() {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const groupRefs = useRef([]);
  const compositeRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function measure() {
      setScale(Math.min(window.innerWidth, DESIGN_REF_W) / DESIGN_REF_W);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const text = textRef.current;
    const groups = groupRefs.current.filter(Boolean);
    const composite = compositeRef.current;
    const all = [text, ...groups, composite];

    if (reduceMotion) {
      gsap.set(all, { opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(text, { opacity: 0, y: 24 });
    gsap.set([...groups, composite], { opacity: 0, y: 40 });

    const GROUP_DURATION = 0.7;
    const GROUP_STAGGER = 0.18;
    const sequence = [...groups, composite]; // 左手機、中手機、合成圖，依序 stagger

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: mainEase }, 0);
        sequence.forEach((el, i) => {
          tl.to(el, { opacity: 1, y: 0, duration: GROUP_DURATION, ease: mainEase }, i * GROUP_STAGGER);
        });
      },
    });

    return () => st.kill();
  }, []);

  // 內容需要的總高度（1440 基準）：所有子元素裡最下緣最大的那個決定
  // wrapper 該多高——子元素全部 position:absolute，wrapper 自己沒有這個
  // 高度就會塌成 0，把後面的區塊往上蓋過來。改成直接從各元素的 y+h
  // 算 max，不要手動維護一個常數——合成圖這輪下移 90px、又換了新素材
  // 高度，如果繼續手寫死一個數字，下次任何一個座標再變動又要記得手動
  // 同步，這正是上一輪 Function 1 scale 反覆跑掉的同一種脆弱模式。
  const contentH = Math.max(
    ...PHONES.map((p) => p.y + p.h),
    COMPOSITE.y + COMPOSITE.h
  );

  return (
    <section className="ss-section" ref={rootRef}>
      <div className="page-container">
        <div
          className="ss-fn2-content"
          style={{ height: `${contentH * scale}px`, transform: `scale(${scale})` }}
        >
          {/* 合成圖必須最先出現在 DOM 裡，才會墊在最底層——見檔頭「圖層
              順序」說明，不然會蓋住左/中手機。 */}
          <div
            ref={compositeRef}
            className="ss-fn2-group"
            style={{ left: COMPOSITE.x, top: COMPOSITE.y, width: COMPOSITE.w, height: COMPOSITE.h }}
          >
            <img
              src="/work/sui-sui/function2-right-composite@2x.png"
              alt="A red gradient backdrop behind a hand holding a phone scanning a skincare product"
              className="ss-fn2-phone"
            />
            <span
              className="ss-fn2-badge"
              style={{
                left: COMPOSITE.badge.dx,
                top: COMPOSITE.badge.dy,
                width: COMPOSITE.badge.w,
                fontWeight: COMPOSITE.badge.bold ? 600 : 400,
                fontSize: COMPOSITE.badge.bold ? '16px' : '14px',
              }}
            >
              {COMPOSITE.badge.label}
            </span>
          </div>

          <div ref={textRef} className="ss-fn2-text" style={{ left: 0, top: 0, width: 885 }}>
            <p className="ss-fn2-eyebrow">Function 2</p>
            <h2 className="ss-fn2-title">Product recognition</h2>
            <p className="ss-fn2-desc">
              Users photograph or scan the products already on their dressing table. The app
              recognises and sorts them automatically, so every routine is built around what
              someone owns, not what they&rsquo;re expected to buy.
            </p>
          </div>

          {PHONES.map(({ key, src, alt, x, y, w, h, badge }, i) => (
            <div
              key={key}
              ref={(el) => { groupRefs.current[i] = el; }}
              className="ss-fn2-group"
              style={{ left: x, top: y, width: w, height: h }}
            >
              <img src={src} alt={alt} className="ss-fn2-phone" />
              <span
                className="ss-fn2-badge"
                style={{
                  left: badge.dx,
                  top: badge.dy,
                  width: badge.w,
                  fontWeight: badge.bold ? 600 : 400,
                  fontSize: badge.bold ? '16px' : '14px',
                }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
