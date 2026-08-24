'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase, makeBezierEase } from '@/lib/ease';
import HeroLogo from './HeroLogo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sui-Sui Hero — 九宮格式品牌板拼貼。
// Figma：檔案 j4saimg2oJWL5tUkBh5Bww，node 2472:1023「Frame 50」
//        （x=188 y=132，1064×736，夾在 navi 與 logo&overview 之間）。
//
// ⚠️ 舊檔 web-ui_clean 沒有這一區，舊註解裡「Hero 沒有專屬 node」的說法
// 已經過期——新檔有，就是 Frame 50。另外新檔還留著一塊 1948:4178
// 「overview section」，填色 #d9d9d9，那是舊的灰色佔位矩形（跟
// AnimationPlaceholder 同一個灰），不是設計元素，不要畫。
//
// 版面全部照 Figma 原值寫死（見 sui-sui.css 的座標表）。欄距多為 13px，
// 但字體卡→UI 條只有 11px；第三欄照片高 286 而同列另外兩張是 216；色票
// y=300 而 logo 面板 y=229——這些不規則是刻意的，不要整成規則格。
//
// 縮放：整塊 transform:scale（你選的方案，跟 Function 2 同一套做法），
// scale = min(100vw,1440)/1440，內部座標完全不動。
const BOARD_W = 1064;
const BOARD_H = 736;

// UI_8 不存在（實際掃過 public/work/sui-sui/ui-carousel/ui-screens/，
// 只有 11 個檔）。序列頭尾重複一份，translateX 走完一份的寬度就回到
// 原點，接縫處兩份內容相同所以看不出跳動。
const UI_SCREENS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];

// marquee 單格尺寸：圖源是 828×1800（比例 0.46）。Figma 那一格是靜態
// 截圖，沒有 marquee 規格，這組數字是我抓的——高度填滿粉紅條扣掉內距。
const SCREEN_H = 207;
const SCREEN_W = Math.round(SCREEN_H * 0.46); // 95
const SCREEN_GAP = 8;
const SEQ_W = UI_SCREENS.length * (SCREEN_W + SCREEN_GAP); // 一份序列的寬度

// 淡出專用曲線：mainEase(0.22,1,0.36,1) 是 ease-out（起步快、尾巴慢），
// 拿來做淡出會讓 opacity 先急墜再貼著 0 爬——實測紅底從 0.5 掉到 0.02
// 只花 0.20s，剩下 0.25s 都在肉眼看不見的區間空轉，面板「看起來全空」的
// 時間因此被拉長到 0.32s（設計是 0.15s）。這裡用它的鏡像 ease-in，
// 讓元素保持可見到最後才收尾。
const outEase = makeBezierEase(0.64, 0, 0.78, 0);

export default function Hero() {
  const rootRef = useRef(null);
  const boardRef = useRef(null);
  const trackRef = useRef(null);

  // 外層 scale（比照 Function 2：量 window.innerWidth，不量 DOM 元素）
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    // 這裡只設 transform:scale。高度與上留白交給 CSS 的 min(vw, px)
    // ——用 JS 設會在首幀之後才生效，量到的 CLS 會從 0.01 掉到 0.11，
    // 超過規格書 §8 的 <0.1（見 sui-sui.css 的 .ss-hero）。
    //
    // Figma 頁面座標：navi 0–116、Frame 50 頂 132、底 868、logo&overview
    // 頂 1086。導覽列是 position:fixed（.site-nav），頁面內容從文件 y=0
    // 起算並穿到它底下，所以看板上方留白要含 nav 那 116px。
    // ⚠️ 原本的佔位塊寫 height={970}，那是「116→1086」的區間長度，漏算了
    // nav 佔掉的 116px，會讓後面每一區都往上偏。這裡一併修正成 1086。
    const fit = () => {
      const s = Math.min(window.innerWidth, 1440) / 1440;
      board.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const cells = root.querySelectorAll('[data-hero-cell]');
      const logo = root.querySelector('[data-hero-logo]');
      const plate = root.querySelector('[data-logo-part="plate"]');
      const rose = root.querySelector('[data-logo-part="rose"]');
      const word = root.querySelectorAll('[data-logo-part="wordmark"]');
      const track = trackRef.current;
      const lora = root.querySelector('[data-type-lora]');
      const dm = root.querySelector('[data-type-dm]');

      // ── 2. 中央 logo：紅底方塊 → 白玫瑰 → suisui 字標，無限循環。
      //      只動 opacity，不用 stroke-dashoffset 描邊（那會 repaint）。
      //      兩個 sui 字標當一組同時處理。
      //
      //      循環方式（你選的）：整組淡出重來，但淡出／淡入重疊，面板全空
      //      的時間壓到約 0.15s——不是明顯斷一拍。時間軸長 6.55s，
      //      repeatDelay 0.15s 就是那個空檔，一輪合計 6.7s。
      //
      //      ⚠️ logo 的淡入原本寫在下面的進場時間軸裡，已經移除——同一個
      //      元素不能兩邊控制。現在進場只負責九個格子，logo 內部由這條
      //      循環時間軸全權處理。
      let logoTl = null;
      if (reduce) {
        // reduced motion：直接顯示完整 logo，不循環
        gsap.set(logo, { opacity: 1 });
        gsap.set([plate, rose, ...word], { opacity: 1 });
      } else {
        gsap.set(logo, { opacity: 1 });
        gsap.set([plate, rose, ...word], { opacity: 0, willChange: 'opacity' });

        // 同步建立（理由同下面字體卡那段：非同步建立會逃出 gsap.context）
        logoTl = gsap
          .timeline({ repeat: -1, repeatDelay: 0.15, paused: true, defaults: { ease: mainEase } })
          .to(plate, { opacity: 1, duration: 0.5 }, 0)
          .to(rose, { opacity: 1, duration: 0.5 }, 0.4)
          .to(word, { opacity: 1, duration: 0.6 }, 0.9)
          // 停留 4.0s（1.5 → 5.5）
          .to(word, { opacity: 0, duration: 0.45, ease: outEase }, 5.5)
          .to(rose, { opacity: 0, duration: 0.45, ease: outEase }, 5.8)
          .to(plate, { opacity: 0, duration: 0.45, ease: outEase }, 6.1);
      }

      // ── 1. 進場：各格 opacity + translateY 依序 stagger ──
      if (reduce) {
        gsap.set(cells, { y: 0, opacity: 1 });
      } else {
        gsap.set(cells, { y: 24, opacity: 0, willChange: 'transform, opacity' });

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top 85%', once: true } })
          .to(cells, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: mainEase,
            stagger: 0.06,
            // will-change 只在動畫執行期間掛著，結束就拿掉
            onComplete: () => gsap.set(cells, { willChange: 'auto' }),
          })
          // logo 面板是第 4 格（stagger 0.06 × 3 ≈ 0.18s 才出現），
          // 等它就位再讓 logo 開始組裝，不要在空面板上先畫東西。
          .add(() => logoTl && logoTl.play(), 0.35);
      }

      // ── 3. 字體卡：Lora ⇄ DM Sans 交叉淡入，只動 opacity ──
      // 一定要等 document.fonts.ready，否則第一次交換會閃 fallback 字體。
      if (reduce) {
        // reduced motion：固定停在 DM Sans，不交換
        gsap.set(lora, { opacity: 0 });
        gsap.set(dm, { opacity: 1 });
      } else {
        // will-change 必須掛著：這兩層沒被提升成合成層的話，opacity 每幀
        // 都會 repaint（實測 7 秒的 trace 裡 Paint 60 次，剛好對上兩輪
        // 交叉淡入的幀數 0.55s×2≈66）。這段時間軸是 repeat:-1 無限循環，
        // 「動畫執行期間」＝一直，所以掛著不移除；元件卸載時由
        // gsap.context 的 revert() 一併清掉。
        gsap.set([lora, dm], { willChange: 'opacity' });
        gsap.set(lora, { opacity: 1 });
        gsap.set(dm, { opacity: 0 });

        // ⚠️ 時間軸必須「同步」建立，只用 paused:true 等字體。
        // 原本寫成 document.fonts.ready.then(() => gsap.timeline(...))，
        // 那是在非同步 callback 裡建立的，逃出了 gsap.context() 的收錄範圍
        // ——context 只收同步執行期間建立的動畫。結果 ctx.revert() 殺不掉它，
        // React 19 開發模式 effect 跑兩次就留下兩個 repeat:-1 的時間軸同時
        // 搶同一組 opacity，相位一錯開就卡在兩層都半透明。
        const typeTl = gsap.timeline({
          repeat: -1,
          paused: true,
          defaults: { duration: 0.55, ease: mainEase },
        })
          .addLabel('holdLora', 0)
          .addLabel('toDm', 2.6)
          .to(lora, { opacity: 0 }, 'toDm')
          .to(dm, { opacity: 1 }, 'toDm')
          .addLabel('toLora', 5.75)
          .to(dm, { opacity: 0 }, 'toLora')
          .to(lora, { opacity: 1 }, 'toLora');

        // 等字體載完才開始，否則第一次交換會閃 fallback 字體。
        // 若元件在這之前就卸載，ctx.revert() 已經把 typeTl 殺掉，
        // 對已 kill 的時間軸呼叫 play() 是 no-op，不會出事。
        document.fonts.ready.then(() => typeTl.play());
      }

      // ── 4. 右下 UI 條：橫向無限 marquee，只動 transform:translateX ──
      if (track && !reduce) {
        gsap.set(track, { willChange: 'transform' });
        const marquee = gsap.to(track, {
          x: -SEQ_W,
          duration: SEQ_W / 42, // 約 42px/s
          ease: 'none',
          repeat: -1,
        });
        // 比照 ProcessAnimation：離開視窗就暫停，回來再播
        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => marquee.play(),
          onEnterBack: () => marquee.play(),
          onLeave: () => marquee.pause(),
          onLeaveBack: () => marquee.pause(),
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const screens = [...UI_SCREENS, ...UI_SCREENS];

  return (
    <section className="ss-hero" ref={rootRef} aria-label="Sui-Sui brand board">
      <div className="ss-hero-board" ref={boardRef} style={{ width: BOARD_W, height: BOARD_H }}>
        {/* 第一列 ─────────────────────────────────────────── */}
        <img
          data-hero-cell
          className="ss-hero-cell ss-hero-photo ss-hero-p1"
          src="/work/sui-sui/hero/photo-dressing.webp"
          width={346}
          height={216}
          loading="lazy"
          decoding="async"
          alt="An older woman at her dressing table, following the app on her phone."
        />

        <div data-hero-cell className="ss-hero-cell ss-hero-p2">
          <img
            className="ss-hero-photo"
            src="/work/sui-sui/hero/photo-palette.webp"
            width={346}
            height={216}
            loading="lazy"
            decoding="async"
            alt="A hand loading a brush with pink eyeshadow from a palette."
          />
          {/* Figma 2441:993 — 圈選橢圓，逐字照匯出的向量，不是我自己畫的。
              外框 67.021×66.954 是「旋轉後」的外接框（53.281×53.383 的圖形
              轉 17.64° 之後剛好是這個大小），所以旋轉掛在 svg 上，定位框
              本身不轉。 */}
          <span className="ss-hero-p2-ring" aria-hidden="true">
            <svg viewBox="0 0 64.3828 63.2806" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#ss-hero-ring-shadow)">
                <ellipse
                  cx="36.6914"
                  cy="30.6403"
                  rx="26.6914"
                  ry="26.6403"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 6"
                />
              </g>
              <defs>
                <filter
                  id="ss-hero-ring-shadow"
                  x="0"
                  y="0"
                  width="64.3828"
                  height="63.2806"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="-5" dy="1" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.541176 0 0 0 0 0.541176 0 0 0 0 0.541176 0 0 0 0.4 0"
                  />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
              </defs>
            </svg>
          </span>
          {/* Figma 2441:997 — 提示膠囊。底 2441:999 有 mix-blend-mode:screen，
              但文字 2441:1001 在 Figma 是它的「兄弟節點」不是子節點，所以
              沒有被混合。底與文字必須分兩層，否則深灰文字會被 screen 洗掉。 */}
          <p className="ss-hero-p2-badge">
            <span className="ss-hero-p2-badge-bg" aria-hidden="true" />
            <span className="ss-hero-p2-badge-text">Warm up your look with a touch of orange</span>
          </p>
        </div>

        <img
          data-hero-cell
          className="ss-hero-cell ss-hero-photo ss-hero-p3"
          src="/work/sui-sui/hero/photo-bed.webp"
          width={346}
          height={286}
          loading="lazy"
          decoding="async"
          alt="A phone resting on linen, showing a Morning Glow routine screen."
        />

        {/* 第二列 ─────────────────────────────────────────── */}
        <div data-hero-cell className="ss-hero-cell ss-hero-logopanel">
          <HeroLogo data-hero-logo className="ss-hero-logo" aria-hidden="true" />
        </div>

        <div data-hero-cell className="ss-hero-cell ss-hero-swatches" aria-hidden="true">
          <span style={{ background: '#9d000f' }} />
          <span style={{ background: '#cb0013' }} />
          <span style={{ background: '#e8002c' }} />
          <span style={{ background: '#fff6dc' }} />
        </div>

        {/* 第三列 ─────────────────────────────────────────── */}
        <img
          data-hero-cell
          className="ss-hero-cell ss-hero-photo ss-hero-p4"
          src="/work/sui-sui/hero/photo-petals.webp"
          width={346}
          height={235}
          loading="lazy"
          decoding="async"
          alt="Close-up of deep red rose petals."
        />

        <div data-hero-cell className="ss-hero-cell ss-hero-typecard">
          <div className="ss-hero-type" data-type-lora>
            <p className="ss-hero-type-name">Lora</p>
            <p className="ss-hero-type-aa">Aa</p>
          </div>
          <div className="ss-hero-type ss-hero-type--dm" data-type-dm aria-hidden="true">
            <p className="ss-hero-type-name">DM Sans</p>
            <p className="ss-hero-type-aa">Aa</p>
          </div>
        </div>

        <div data-hero-cell className="ss-hero-cell ss-hero-uistrip">
          <div className="ss-hero-marquee" ref={trackRef} aria-hidden="true">
            {screens.map((n, i) => (
              <img
                key={`${n}-${i}`}
                src={`/work/sui-sui/ui-carousel/ui-screens/UI_${n}.webp`}
                width={SCREEN_W}
                height={SCREEN_H}
                loading="lazy"
                decoding="async"
                alt=""
              />
            ))}
          </div>
        </div>
      </div>

      {/* 拼貼是視覺內容，關鍵資訊另外給螢幕閱讀器一份純文字 */}
      <p className="visually-hidden">
        Sui-Sui brand board: photographs of an older woman following the app at her dressing table,
        a makeup palette with the prompt &ldquo;Warm up your look with a touch of orange&rdquo;, a
        phone showing a routine screen, and rose petals. The Sui-Sui logo sits at the centre.
        Brand colours are #9D000F, #CB0013, #E8002C and #FFF6DC. Typefaces are Lora and DM Sans.
      </p>
    </section>
  );
}
