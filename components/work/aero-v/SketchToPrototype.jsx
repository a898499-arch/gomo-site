'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import PhotoCycler, { STAGGER_MS } from './PhotoCycler';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Figma node 796:888「From Sketch to Working Prototype」，1352×565，
// 位於整頁 frame 796:705 的 x=48 y=3750。
//
// ⚠️ 這一區**不是三格並排**。實際是三欄不規則配置（座標見 aero-v.css）：
//     左欄  手繪拼貼在上、標題與內文在下
//     中欄  3d 在上、prototype 在下，兩格之間只有 14px
//     右欄  model 一格通到底（554 高，等於中欄兩格加間距）
// 格子的長寬比也各不相同（400×270 橫幅 ×2、369×554 直幅 ×1）。
// 依 CLAUDE.md：這是刻意的設計，不可以整理成格狀。
//
// 三格照片是輪播，每格三張，邏輯在 PhotoCycler.jsx。
//
// ── 為什麼 ScrollTrigger 與 visibilitychange 掛在這一層、不是每格各掛 ──
// 三格各自掛觸發器的話，捲動時三個觸發點的判定可能差幾個 frame，暫停／恢復
// 幾次之後那 1s 的錯開就會被磨掉、三格慢慢對齊，那正是要避免的結果。
// 這裡持有唯一一個 playing 布林值往下傳，三格必定同進同出，錯開永遠不變。
//
// ── 錯開的順序 ──
// ⚠️ 不能用「由左到右」：3d 與 prototype 的 x 相同（都是 561），左到右會讓
// 這兩格同時換。改用閱讀順序 3d → prototype → model。
// PhotoCycler 的 phase 是「播放頭種在第幾秒」，越大越先換，所以第 i 格給
// (格數 − 1 − i) × STAGGER_MS。錯開值不在這裡寫死——STAGGER_MS 是
// PhotoCycler.jsx 由 CYCLE_MS ÷ 3 推算的，那邊調速度這裡會自動跟上。
export default function SketchToPrototype() {
  const entranceRef = useStandardEntrance('.av-entrance-item');
  const frameRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    // 比照 ProcessAnimation.jsx：整框進出視窗時開關，捲出畫面外就不要再跑。
    const st = ScrollTrigger.create({
      trigger: frame,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => setInView(true),
      onEnterBack: () => setInView(true),
      onLeave: () => setInView(false),
      onLeaveBack: () => setInView(false),
    });

    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    onVis();

    return () => {
      st.kill();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const playing = inView && visible;

  return (
    <section className="av-section" ref={entranceRef}>
      <div className="page-container">
        <div className="av-sketch-frame av-entrance-item" ref={frameRef}>
          {/* 手繪拼貼 796:894，521.8×287。使用者已整組匯出，含三張刻意重疊、
              其中一張旋轉 180° 的原稿——不拆開重排（使用者 2026-08-28 指示）。
              ⚠️ 真的是去背 PNG（81% 全透明），底下不要墊任何底色。 */}
          <img
            className="av-sketch-collage"
            src="/work/aero-v/sketch-collage.webp"
            srcSet="/work/aero-v/sketch-collage.webp 1x, /work/aero-v/sketch-collage@2x.webp 2x"
            width={522}
            height={287}
            loading="lazy"
            decoding="async"
            lang="zh-Hant"
            alt="九幅手繪概念草稿的拼貼，用鉛筆與紅藍原子筆畫出凳子的各種氣流方案：座面下的風扇與濾網、柱身裡的集髮容器、底座周圍的進氣口，並標註 fans、filter、intake、hair container 等字樣。"
          />

          {CELLS.map((cell, i) => (
            <PhotoCycler
              key={cell.key}
              className={`av-sketch-cell av-sketch-cell--${cell.key}`}
              photos={cell.photos}
              phase={((CELLS.length - 1 - i) * STAGGER_MS) / 1000}
              playing={playing}
            />
          ))}

          <h2 className="av-sketch-title">From Sketch to Working Prototype</h2>
          <p className="av-sketch-body">
            Rather than inventing a new object, I built the system into a form hairstylists already
            trust. Sketches, CAD iterations, and full-scale mock-ups each tested one question: can
            purification happen without changing how they work?
          </p>

          {/* 依 CLAUDE.md 的無障礙補償：輪播的 <img> 都是 alt="" + aria-hidden
              （中途換 alt 螢幕閱讀器不會重讀，做成 live region 又會變噪音），
              九張照片的內容改由這一份視覺隱藏的純文字交代。 */}
          <div className="visually-hidden" lang="zh-Hant">
            <p>此區有三組會自動輪播的照片，各三張。</p>
            <p>
              3D 建模：一、SolidWorks 中的凳子座面與底座模型，旁邊有手寫的中文設計註記。
              二、灰階算圖，座面剖開露出內部的濾網與風道。
              三、兩張成品算圖，黑色座面配鍍鉻五爪滾輪底座，呈現高低兩種座高。
            </p>
            <p>
              實體原型：一、用白色卡紙裁出的等比例底座模型，放在工作桌上，旁邊有鉛筆與裁下的板材。
              二、一位工作人員蹲在地上組裝金屬圓筒狀的柱身零件。
              三、加工完成的金屬底座柱體放在工作台上，旁邊是紙箱與工具。
            </p>
            <p>
              成品展出：一、展場中的成品凳，白色座面與金屬底座，後方有配戴口罩的參觀者。
              二、展場牆面的作品說明看板，兩位觀眾正在閱讀。
              三、展場空間，數位觀眾圍繞著展台上的凳子觀看。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 三格的素材。photo1 就是 Figma 稿上顯示的那一張，所以 SSR 輸出的 HTML
// 與 reduced-motion 下看到的都與設計稿一致。
// width/height 用 Figma 格子的 CSS 尺寸，讓瀏覽器在圖片載入前就知道長寬比。
// 使用者匯出的九張都正好是格子的 3.00x，裁切已經烤進圖裡，所以 object-fit:
// cover 不需要任何位移微調。
const mk = (key, i, w, h) => ({
  src: `/work/aero-v/sketch-${key}-${i}.webp`,
  srcSet: `/work/aero-v/sketch-${key}-${i}.webp 1x, /work/aero-v/sketch-${key}-${i}@2x.webp 2x`,
  width: w,
  height: h,
});

const CELLS = [
  // 796:901「3d_photo1」x=561 y=3 400×270
  { key: '3d', photos: [1, 2, 3].map((i) => mk('3d', i, 400, 270)) },
  // 796:900「prototype_photo1」x=561 y=287 400×270
  { key: 'proto', photos: [1, 2, 3].map((i) => mk('proto', i, 400, 270)) },
  // 796:902「model_photo1」x=983 y=3 369×554
  { key: 'model', photos: [1, 2, 3].map((i) => mk('model', i, 369, 554)) },
];
