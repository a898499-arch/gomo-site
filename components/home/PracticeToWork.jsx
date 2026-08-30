'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';
import { useNavBehaviorConfig } from '@/components/NavBehaviorProvider';
import './practice-to-work.css';

/**
 * SECTION 2 — PRACTICE → ALL WORK（規格書 §6.2）
 *
 * 從 prototypes/home.html「原樣移植」：
 *   HTML  1364–1403
 *   CSS   494–706（→ practice-to-work.css）
 *   JS    1675–1943
 *
 * ⚠️ CLAUDE.md「原型移植原則」：這一段的真實來源是原型，不是 Figma。
 * 底下所有數值、時間、順序、註解都照抄，沒有重新推導、沒有重新命名、
 * 沒有「順手優化」。框架適配只做這五件事：
 *   1. HTML → JSX，getElementById → useRef
 *   2. 全域 IIFE → useLayoutEffect + gsap.context()（unmount 時 revert）
 *   3. ScrollTrigger 接在 root layout 那個共用的 Lenis 上（見 LenisProvider）
 *   4. navForceHidden 改走 NavBehaviorProvider（原型是模組層的 let 變數）
 *   5. rAF 迴圈／resize 監聽／setInterval 都要能在 unmount 時收乾淨
 */

/* growth/hold split, in vh, per breakpoint. Declared out here (not inside the Section 2 IIFE) so the
   scroll-to-next-section button further down can also read it, to compute the hold-start anchor.
   "growth" has been shortened twice, both times "捲動距離太長":
     2026-08-09  320/260/160 -> 180/146/90   (desktop given directly, tablet/mobile scaled by 180/320)
     2026-08-25  180/146/90  -> 120/97/60    (each cut by a third; desktop now 37.5% of the original)
   "hold" stays unchanged through both (150/120/75 — deliberate dwell time on the video).

   ⚠️ These numbers are DUPLICATED in the .ptw-outer heights in CSS and must be edited together:
     desktop: 120 + 150 + 100 = 370vh   tablet: 97 + 120 + 100 = 317vh   mobile: 60 + 75 + 100 = 235vh
   `growth` is the denominator in ptwLoop's growthP normalisation, so a stale value here does not
   merely mistime things — it divides by a distance that no longer exists, and the frame finishes
   growing past the growth phase, eating into the hold.

   Stage B's own t1/t2 thresholds need no recalculation for either change: growthP is normalised
   against `growth`, so 0.30 / 0.08 / 0.85 are fractions of whatever the growth distance is. */
export function ptwGrowthHold() {
  if (window.innerWidth <= 600) return { growth: 60, hold: 75 };
  if (window.innerWidth <= 900) return { growth: 97, hold: 120 };
  return { growth: 120, hold: 150 };
}

/* Figma-measured direction-from-video-frame-center (ux,uy, unit vector) + distance (px, at the
   1440-wide reference), per element — see the layer table confirmed 2026-08-08. Radiate distance
   in Stage B is proportional to this `dist`, exactly like elements already far from center in
   Figma (§6.2 四: "本來就靠邊的跑最遠"). */
const PTW_FIG_SPECS = [
  { key: 'dw3', ux: -0.591, uy: -0.807, dist: 273.3, layer: 'back' },
  { key: 'dw31', ux: 0.660, uy: -0.751, dist: 293.5, layer: 'back' },
  { key: 'grass', ux: 0.230, uy: -0.973, dist: 229.3, layer: 'back' },
  { key: 'red', ux: -0.897, uy: -0.443, dist: 345.5, layer: 'back' },
  { key: 'dw1', ux: -0.003, uy: 1.000, dist: 296.9, layer: 'front' },
  { key: 'dw2', ux: -0.989, uy: 0.150, dist: 374.5, layer: 'front' },
  { key: 'dw5', ux: 0.930, uy: 0.367, dist: 313.6, layer: 'front' },
  { key: 'orange', ux: 0.923, uy: -0.385, dist: 341.6, layer: 'front' },
  { key: 'pink', ux: -0.775, uy: 0.632, dist: 388.9, layer: 'front' },
  { key: 'yellow', ux: 0.605, uy: 0.796, dist: 261.3, layer: 'front' },
  { key: 'leaf', ux: 0.902, uy: 0.432, dist: 488.6, layer: 'front' },
];
const PTW_MAX_DIST = Math.max.apply(
  null,
  PTW_FIG_SPECS.map(function (f) {
    return f.dist;
  })
);

/* travel budget for the single farthest element at t1=1 (before the layer multiplier), as a
   fraction of .ptw-viewport's own rendered width — the viewport is letterboxed and can render
   at any pixel size, so the radiate distance has to scale with it rather than being a fixed px
   number (260px was tuned against the old, wrongly-sized 1440-ish-wide box; 0.1806 = 260/1440
   keeps the same relative feel now that positioning is correct). */
const PTW_TRAVEL_FRAC = 0.1806;

/* ---------- central carousel: current+next only, 5s hold / 600ms crossfade (§6.2 五) ----------
   Drop real photos into assets/img/ named work-1/work-2/work-3.{jpg,png} — whichever of those
   exist get picked up automatically (1 to 3 of them, missing ones are skipped silently). With
   none present, it falls back to the Figma cover placeholder and still runs the real crossfade
   logic against that single image (fades to itself every 5s) so the mechanism is verifiably
   correct before real photos or video are wired in.

   ⚠️ 目前 public/assets/img/ 只有 placeholder-work-1.png，六個候選檔都不存在，
   所以中央畫面會是「一張靜態圖每 5 秒對自己淡入淡出」——看起來像沒動，這是
   原型現在的行為，不是 bug（使用者 2026-08-28 確認保留探測機制）。 */
const PTW_PLACEHOLDER = '/assets/img/placeholder-work-1.png';
const PTW_CANDIDATES = ['work-1.jpg', 'work-2.jpg', 'work-3.jpg', 'work-1.png', 'work-2.png', 'work-3.png'];

// 拼貼素材：src 與 class 後綴。原型是 11 個手寫的 <div>，這裡改成陣列展開，
// 順序、class、data-fig、檔名都與原型 1369–1379 行完全一致。
const PTW_FIGURES = [
  { key: 'dw3', cls: 'ptw-fig-dw3', src: '/assets/svg/dance%20woman_3.svg' },
  { key: 'dw31', cls: 'ptw-fig-dw31', src: '/assets/svg/dance%20woman_3-1.svg' },
  { key: 'grass', cls: 'ptw-fig-grass', src: '/assets/svg/grass.png' },
  { key: 'red', cls: 'ptw-fig-red', src: '/assets/svg/flower_red.svg' },
  { key: 'dw1', cls: 'ptw-fig-dw1', src: '/assets/svg/dance%20woman_1.svg' },
  { key: 'dw2', cls: 'ptw-fig-dw2', src: '/assets/svg/dance%20woman_2.svg' },
  { key: 'dw5', cls: 'ptw-fig-dw5', src: '/assets/svg/dance%20woman_5.svg' },
  { key: 'orange', cls: 'ptw-fig-orange', src: '/assets/svg/flower_orange.svg' },
  { key: 'pink', cls: 'ptw-fig-pink', src: '/assets/svg/flower_pink.svg' },
  { key: 'yellow', cls: 'ptw-fig-yellow', src: '/assets/svg/flower_yellow.svg' },
  { key: 'leaf', cls: 'ptw-fig-leaf', src: '/assets/svg/leave_blue.svg' },
];

export default function PracticeToWork() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const visualRef = useRef(null);
  const titleRef = useRef(null);
  const frameMediaRef = useRef(null);
  const frameInnerRef = useRef(null);
  const slideARef = useRef(null);
  const slideBRef = useRef(null);

  const { setNavForceHidden } = useNavBehaviorConfig();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ptwSection = sectionRef.current;
    const ptwViewport = viewportRef.current;
    const ptwVisual = visualRef.current;
    const ptwTitle = titleRef.current;
    const ptwTitleLines = ptwTitle.querySelectorAll('.reveal-inner');
    const ptwFrameMedia = frameMediaRef.current;
    const ptwFrameInner = frameInnerRef.current;
    const ptwSlideA = slideARef.current;
    const ptwSlideB = slideBRef.current;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cancelled = false;
    let loopId = null;
    let carouselTimer = null;
    // resize 監聽在 gsap.context 內註冊，但 context.revert() 只收 GSAP 自己建立的
    // 東西（tween / ScrollTrigger），不管原生事件監聽器——所以把函式引用拉到
    // 這一層，由下面的 effect cleanup 親自移除。
    let updatePtwTravelRef = null;

    const ctx = gsap.context(() => {
      const PTW_FIGS = PTW_FIG_SPECS.map(function (f) {
        return { ...f, el: ptwSection.querySelector('[data-fig="' + f.key + '"]') };
      });

      let ptwTravelPx = 0;
      function updatePtwTravel() {
        ptwTravelPx = ptwViewport.getBoundingClientRect().width * PTW_TRAVEL_FRAC;
      }
      updatePtwTravel();
      window.addEventListener('resize', updatePtwTravel);
      updatePtwTravelRef = updatePtwTravel;

      /* ---------- Stage A: entrance, plays once, time-driven — not scroll-scrubbed (§6.2 三) ---------- */
      let stageAPlayed = false;
      function playStageA() {
        if (stageAPlayed) return;
        stageAPlayed = true;
        const tl = gsap.timeline();
        tl.to(ptwVisual, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: mainEase }, 0);
        tl.to(ptwTitleLines[0], { y: '0%', duration: 0.75, ease: mainEase }, 0.6);
        tl.to(ptwTitleLines[1], { y: '0%', duration: 0.75, ease: mainEase }, 0.6 + 0.13);
        tl.call(
          function () {
            ptwVisual.classList.add('is-idle');
          },
          null,
          1.5
        );
      }

      if (reduceMotion) {
        gsap.set(ptwVisual, { opacity: 1, scale: 1, y: 0 });
        gsap.set(ptwTitleLines, { y: '0%' });
      } else {
        ScrollTrigger.create({ trigger: ptwSection, start: 'top 70%', once: true, onEnter: playStageA });
      }

      /* ---------- Stage B: scroll timeline driven by progress p, with an extra manual lerp for
         inertial weight on top of ScrollTrigger's own scrub:1 (§6.2 二、六) ---------- */
      if (!reduceMotion) {
        /* growth/hold split now comes from the shared, hoisted ptwGrowthHold() (declared above, before
           this IIFE) — see its own comment for the current per-breakpoint values. */
        let rawSelfProgress = 0;
        let stIsActive = false;
        let smoothP = 0;

        ScrollTrigger.create({
          trigger: ptwSection,
          start: 'top top',
          /* NOT 'bottom bottom' — that assumes the pin lasts the trigger's full height, true only for
             GSAP's own pin:true. This section is pinned with plain CSS position:sticky instead (per
             §6.2 二), which naturally releases 100vh before the trigger's bottom (the sticky element
             itself is 100vh tall, so that much of the trigger's own height is "used up" scrolling the
             stuck element back out). End has to match that shorter real pinned range, or p=1 lands
             after the stage has already unstuck and the footer is already scrolling in underneath. */
          end: function () {
            return '+=' + (ptwSection.offsetHeight - window.innerHeight);
          },
          scrub: 1,
          onUpdate: function (self) {
            rawSelfProgress = self.progress;
            stIsActive = self.isActive;
          },
        });

        function clamp01(v) {
          return v < 0 ? 0 : v > 1 ? 1 : v;
        }
        function remap(p, a, b) {
          return clamp01((p - a) / (b - a));
        }

        let frameGrowing = false;

        function applyStageB(p) {
          /* p 0 -> 0.30: collage radiates outward + fades, title exits, bg lerps */
          const t1 = remap(p, 0, 0.30);
          for (let i = 0; i < PTW_FIGS.length; i++) {
            const f = PTW_FIGS[i];
            const isFront = f.layer === 'front';
            const travelMul = isFront ? 1.3 : 0.7; // front layer travels farther...
            const fadeEnd = isFront ? 0.65 : 1.0; // ...and finishes fading out earlier
            const dist = ptwTravelPx * (f.dist / PTW_MAX_DIST) * travelMul;
            const tx = f.ux * dist * t1;
            const ty = f.uy * dist * t1;
            const scale = 1 + 0.15 * t1;
            const opacity = 1 - clamp01(t1 / fadeEnd);
            f.el.style.transform =
              'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
            f.el.style.opacity = opacity;
          }

          gsap.set(ptwTitle, {
            y: -140 * t1,
            opacity: 1 - t1 / 0.933, // fully gone by t1≈0.933 (p≈0.28), per spec's "p=0.28 前完全消失"
            scale: 1 - 0.05 * t1,
          });

          /* p 0.08 -> 0.85: video frame grows. Both ends are Figma/user-measured left/top/width of the
             same 1440x900 .ptw-viewport box, both exactly 16:9 (height = width*9/16 always, so it's
             never computed/stored separately — see the .ptw-frame-media comment for why this replaced
             the earlier clip-path approach):
             start = collage-phase frame, left/width from Figma (node 21:171), top re-derived from 16:9
                     and re-centered on that box's own original vertical center
             end   = ALL WORKS frame, 40px margins left/right, height from 16:9 centered in the
                     viewport then shifted down 20px (2.2222%) per feedback 2026-08-08 */
          const t2 = remap(p, 0.08, 0.85);
          const leftPct = 46.6667 + (2.7778 - 46.6667) * t2;
          const topPct = 35.2029 + (9.7222 - 35.2029) * t2;
          const widthPct = 39.9194 + (94.4444 - 39.9194) * t2;

          const vpRect = ptwViewport.getBoundingClientRect();
          const targetX = (leftPct / 100) * vpRect.width;
          const targetY = (topPct / 100) * vpRect.height;
          const scale = widthPct / 100;
          ptwFrameMedia.style.transform =
            'translate(' + targetX.toFixed(2) + 'px,' + targetY.toFixed(2) + 'px) scale(' + scale.toFixed(5) + ')';
          /* box-shadow is outside the transform/opacity/clip-path allowlist (§6.2 九) — kept anyway
             because the spec explicitly asks for it ("陰影：...→完全消失"); it's a paint, not a
             layout, so it doesn't break compositing elsewhere, but flag for the Chrome Performance
             check in Acceptance Criteria #10 if it turns out too costly on mid-tier laptops. */
          ptwFrameMedia.style.boxShadow =
            '0 ' +
            (24 * (1 - t2)).toFixed(1) +
            'px ' +
            (60 * (1 - t2)).toFixed(1) +
            'px rgba(0,0,0,' +
            (0.18 * (1 - t2)).toFixed(3) +
            ')';
          ptwFrameInner.style.transform = 'scale(' + (1.12 - 0.12 * t2).toFixed(4) + ')';

          const isGrowing = t2 > 0 && t2 < 1;
          if (isGrowing !== frameGrowing) {
            frameGrowing = isGrowing;
            ptwFrameMedia.style.willChange = isGrowing ? 'transform' : '';
            ptwFrameInner.style.willChange = isGrowing ? 'transform' : '';
          }
        }

        function ptwLoop() {
          const gh = ptwGrowthHold();
          const growthP = clamp01((rawSelfProgress * (gh.growth + gh.hold)) / gh.growth);
          smoothP += (growthP - smoothP) * 0.1; // factor within the spec's 0.08-0.12 range
          applyStageB(smoothP);
          setNavForceHidden(stIsActive && smoothP >= 0.3); // §6.1/§6.2: nav forced hidden once the video is visibly grown, through the hold
          loopId = requestAnimationFrame(ptwLoop);
        }
        loopId = requestAnimationFrame(ptwLoop);
      }

      function probeImage(src) {
        return new Promise(function (resolve) {
          const img = new Image();
          img.onload = function () {
            resolve(src);
          };
          img.onerror = function () {
            resolve(null);
          };
          img.src = src;
        });
      }

      Promise.all(
        PTW_CANDIDATES.map(function (name) {
          return probeImage('/assets/img/' + name);
        })
      ).then(function (results) {
        if (cancelled) return;
        const found = results.filter(Boolean);
        startCarousel(found.length ? found : [PTW_PLACEHOLDER]);
        ScrollTrigger.refresh();
      });

      function startCarousel(slides) {
        let index = 0;
        let currentEl = ptwSlideA;
        let nextEl = ptwSlideB;
        currentEl.src = slides[0];

        const preload = new Image();
        preload.src = slides[1 % slides.length];

        function advance() {
          index = (index + 1) % slides.length;
          nextEl.src = slides[index];
          nextEl.classList.add('is-current');
          currentEl.classList.remove('is-current');
          const swap = currentEl;
          currentEl = nextEl;
          nextEl = swap;

          const upcoming = new Image();
          upcoming.src = slides[(index + 1) % slides.length];
        }

        carouselTimer = setInterval(advance, 5000);
      }
    }, sectionRef);

    return () => {
      cancelled = true;
      if (loopId) cancelAnimationFrame(loopId);
      if (carouselTimer) clearInterval(carouselTimer);
      if (updatePtwTravelRef) window.removeEventListener('resize', updatePtwTravelRef);
      // 離開首頁時務必解除，否則導覽列會永遠被壓住（原型是單頁，沒有這個問題）
      setNavForceHidden(false);
      ctx.revert();
    };
  }, [setNavForceHidden]);

  return (
    <section className="ptw-outer" id="practice-to-work" ref={sectionRef}>
      <div className="ptw-stage" id="ptw-stage">
        <div className="ptw-viewport" id="ptw-viewport" ref={viewportRef}>
          <div className="ptw-visual" id="ptw-visual" ref={visualRef}>
            {PTW_FIGURES.map((fig) => (
              <div className={`ptw-fig ${fig.cls}`} data-fig={fig.key} key={fig.key}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fig.src} alt="" aria-hidden="true" />
              </div>
            ))}

            <h2 className="ptw-title" id="ptw-title" ref={titleRef}>
              <span className="reveal-mask">
                <span className="reveal-inner">
                  I design across <em>health</em> and the <em>environment</em>,
                </span>
              </span>
              <span className="reveal-mask">
                <span className="reveal-inner">
                  taking products from sketch to prototype, physical and digital alike.
                </span>
              </span>
            </h2>

            <div className="ptw-frame" id="ptw-frame">
              <div className="ptw-frame-media" id="ptw-frame-media" ref={frameMediaRef}>
                <div className="ptw-frame-inner" id="ptw-frame-inner" ref={frameInnerRef}>
                  <div className="ptw-carousel" id="ptw-carousel">
                    {/* current/next only — never more than two mounted at once (§6.2 五). Sources filled
                        in by JS from PTW_SLIDES (assets/img/*, falls back to the Figma cover placeholder
                        when that list is empty, so the crossfade logic runs correctly either way).

                        ⚠️ 這裡刻意「完全不寫 src 屬性」，不是 src=""。
                        原型 prototypes/home.html:1396–1397 寫的是 src=""，那在原生 HTML 裡
                        會讓瀏覽器把空字串解析成「目前這一頁的網址」再送一次請求（安靜地
                        重抓整份 HTML），而在 React 裡還會多一條 console error
                        「An empty string ("") was passed to the src attribute」。
                        兩邊都是缺陷，只是原型那邊不會叫出來，所以一直沒被發現。
                        依使用者 2026-08-30 裁示：原型也有的問題一樣修掉，並在此記一筆。

                        省略 src 之後行為完全不變——這兩個節點本來就是等 probeImage()
                        探測完才由 JS 以 el.src = ... 填值（startCarousel / advance），
                        之後補圖進 public/assets/img/ 一樣會自動生效。 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="ptw-slide is-current" id="ptw-slide-a" alt="" aria-hidden="true" ref={slideARef} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="ptw-slide" id="ptw-slide-b" alt="" aria-hidden="true" ref={slideBRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
