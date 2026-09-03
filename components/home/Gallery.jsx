'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';
import { computeGalleryCardMetrics } from '@/lib/galleryMetrics';
import works from '@/data/works.json';
import './gallery.css';

/**
 * SECTION 3 — GALLERY（規格書 §6.3）
 *
 * 從 prototypes/home.html「原樣移植」：
 *   HTML  1405–1520（結構；卡片內容改讀 works.json，見下）
 *   CSS   707–861（→ gallery.css）
 *   JS    1944–2222
 *
 * ⚠️ CLAUDE.md「原型移植原則」：版面與動效的真實來源是原型，不是 Figma。
 * 無限循環的接縫計算、drift/drag/inertia 的物理參數、distance-from-center
 * 的縮放公式、hover 的三層行為，底下全部原樣照抄，一個數字都沒改。
 *
 * 唯一換掉的是「資料從哪來」（使用者 2026-08-30 裁示：版面與動效照抄，
 * 內容資料化）：
 *   原型寫死 12 張 <a>  →  改讀 data/works.json
 *   過濾 hidden: true（那些不該出現在首頁 Gallery）
 *   ready: false 仍然顯示，只是不可點——與作品分類頁 WorkCard 同一套做法
 *   .gallery-card-media 從空的灰底 div 改成放圖，沒圖時不渲染 <img>，
 *     露出原型原本的 #d9d9d9
 *
 * ⚠️⚠️ 三種作品圖，**用途不同、比例不同、不可混用**（2026-09-02）：
 *   /work/gallery/  直式 532×720（@2x 1065×1440）  → 首頁 Gallery 卡片
 *   /work/covers/   橫式 672×415（@2x 1344×830）   → /work 分類頁卡片首圖
 *   /work/hover/    橫式 672×415（@2x 1344×830）   → 卡片 hover 輪播 / Next Work
 * 對應的 works.json 欄位分別是 galleryCover / cover / hoverImages。
 * 這一區讀的是 **galleryCover**，不是 cover——.gallery-card 的比例是
 * 412.252/555（直式 0.743），拿 672×415 的橫圖套 object-fit:cover 會把左右
 * 各裁掉一大半。先前就是這樣，2026-09-02 修正。
 * 直式素材的 532/720 = 0.739，與卡片 0.743 差 0.5%，實際幾乎不裁。
 *
 * ⚠️ 卡片數量變了不會影響接縫：cycle 是執行期用
 * `nextClone.offsetLeft - track.offsetLeft` 量出來的（原型的做法），
 * 不是從卡片數推算的常數，所以幾張卡都會自己對齊。
 */

// 首頁 Gallery 要顯示的作品。
//
// 2026-09-01 起與 lib/getNextWorks.js 用**同一套**判準：!hidden && ready !== false
// ——只顯示「詳情頁真的做好」的作品，不要兩套邏輯。
//   hidden       這一版不對外顯示
//   ready:false  詳情頁還沒做好
// 先前這裡刻意不濾 ready，理由是「展示牆缺一張才是壞的」；使用者 2026-09-01
// 改口：牆上放一張點不進去的卡，跟送使用者去死路是同一件事，判準統一。
//
// ⚠️ 張數會影響無限輪播的接縫餘裕，見下方 measureCycle 附近的註解。
//
// 唯一的顯示閘門：!hidden && ready !== false。卡片端不再重複判斷。
const GALLERY_WORKS = works.filter((w) => !w.hidden && w.ready !== false);

// clone 卡片的拖曳門檻：pointerdown 到 click 之間位移超過這個距離，就當成
// 「拖曳軌道」而不是「點卡片」，不導航。軌道本身的方向判斷是 6px
// （DIRECTION_DECIDE_PX），這裡取 5px——比它稍小，確保任何已經被判定為拖曳的
// 手勢一定也超過這個門檻，不會出現「軌道在拖、放開卻跳頁」。
const CLONE_DRAG_TOLERANCE_PX = 5;

export default function Gallery() {
  const outerRef = useRef(null);
  const titleRef = useRef(null);
  const viewportRef = useRef(null);
  const railRef = useRef(null);
  const trackRef = useRef(null);

  // clone 的委派導航要用（見 makeCloneNavigable）。放進 ref 是為了不動
  // useLayoutEffect 的空相依陣列——那條 effect 只該在掛載時跑一次，
  // 重跑會把 clone 與所有物理狀態重建一遍。
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const galleryOuter = outerRef.current;
    const galleryTitle = titleRef.current;
    const titleLines = galleryTitle.querySelectorAll('.reveal-inner');
    const viewport = viewportRef.current;
    const rail = railRef.current;
    const track = trackRef.current;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- clone 卡片的導航（2026-09-01）----------
       原型（與這裡的前一版）對 clone 的每個 <a> 都掛 preventDefault，理由是
       「詳情頁還不存在」。詳情頁存在之後那個理由失效，但 clone 一直沒改，
       結果是 15 張可見卡裡有 10 張點下去毫無反應。

       ⚠️ clone 是 track.cloneNode(true) 產生的**原生節點**，React 不知道它們
       存在，所以真卡片身上 next/link 的 click handler 沒有被複製過去——放著
       不管的話點 clone 會走原生 <a href>、整頁重新載入。這裡用事件委派補上
       client-side 導航，讓 clone 跟本尊行為一致。useRouter 是原型沒有的東西，
       屬於框架適配。

       ⚠️ aria-hidden="true"（clone 容器）與 tabindex="-1"（每個 <a>）都保留。
       兩者跟「可以用滑鼠點」不衝突：axe 的 aria-hidden-focus 規則管的是
       **可聚焦**（在 tab 序裡），而 tabindex="-1" 已經把它們移出 tab 序；
       滑鼠點擊 <a href> 則與 tabindex 無關。於是三件事同時成立——螢幕閱讀器
       只讀到 5 張真卡、鍵盤只走得到 5 張真卡、滑鼠 15 張都能點。

       監聽器掛在 clone 的「容器」上（一個容器一個），不是每張卡各一個。 */
    function makeCloneNavigable(cloneEl) {
      let downX = 0;
      let downY = 0;

      cloneEl.addEventListener('pointerdown', function (e) {
        downX = e.clientX;
        downY = e.clientY;
      });

      cloneEl.addEventListener('click', function (e) {
        // 點到的可能是卡片裡的 <img> / <div>，不要假設就是 <a> 本身
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;

        // 修飾鍵與非主鍵一律放行，交給瀏覽器原生行為（cmd/ctrl 開新分頁、
        // shift 開新視窗、alt 下載、中鍵開背景分頁）。攔掉的話會比現在更糟。
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        // 軌道可以拖曳，而且拖曳結束時瀏覽器仍然會派送 click。位移超過門檻
        // 就視為拖曳：擋掉導航，但也不做 router.push——放開手不該跳頁。
        if (Math.hypot(e.clientX - downX, e.clientY - downY) > CLONE_DRAG_TOLERANCE_PX) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        routerRef.current.push(a.getAttribute('href'));
      });
    }

    // rAF / 監聽器 / clone 節點都要能在 unmount 時收乾淨（原型是單頁，沒有這個需求）
    let frameId = null;
    const cleanups = [];
    const on = (target, type, handler, opts) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    const ctx = gsap.context(() => {
      /* title entrance — masked line reveal, once, same pattern as every other section (§6.3 整體體驗) */
      if (reduceMotion) {
        gsap.set(titleLines, { y: '0%' });
      } else {
        ScrollTrigger.create({
          trigger: galleryOuter,
          start: 'top 80%',
          once: true,
          onEnter: function () {
            const tl = gsap.timeline();
            tl.to(titleLines[0], { y: '0%', duration: 0.75, ease: mainEase }, 0);
            tl.to(titleLines[1], { y: '0%', duration: 0.75, ease: mainEase }, 0.13);
          },
        });
      }

      /* reduced motion: native horizontal scroll + scroll-snap (CSS) does the rest — no drift, no
         drag physics, no per-frame distance styling, no shared-element/hover choreography (§6.3 可存取性) */
      if (reduceMotion) return;

      /* ---------- seamless infinite loop: clone the track on BOTH sides, fully inert for a11y
         (§6.3 修訂六) — aria-hidden on each clone container, tabindex=-1 on every link inside them,
         so neither is ever reachable by keyboard or announced by a screen reader. Two clones (not
         one) so that centering ANY real card — including the first/last, right at the seam — always
         has real content to show either side of it; with only a trailing clone, centering the very
         first card left nothing to show on its left, and the fix was silently centering the *clone's*
         copy instead of the real (focused) element, leaving the focus-visible ring off-screen. ---------- */
      function makeInertClone(id) {
        const c = track.cloneNode(true);
        c.id = id;
        c.setAttribute('aria-hidden', 'true');
        // tabindex="-1"：移出 tab 序（螢幕閱讀器與鍵盤都只走真卡）。
        // ⚠️ 這一行「不是」用來擋點擊的——擋點擊的那行已於 2026-09-01 拿掉，
        // clone 現在可以用滑鼠點，導航由 makeCloneNavigable 的委派處理。
        c.querySelectorAll('a').forEach(function (a) {
          a.setAttribute('tabindex', '-1');
        });
        makeCloneNavigable(c);
        return c;
      }
      const prevClone = makeInertClone('gallery-track-clone-prev');
      const nextClone = makeInertClone('gallery-track-clone-next');
      track.before(prevClone);
      track.after(nextClone);
      // ⚠️ clone 是用 cloneNode 塞進 React 樹裡的原生節點，React 不知道它們存在。
      // 卸載時必須自己移除，否則 StrictMode 的二次執行會疊出四份 clone。
      cleanups.push(() => {
        prevClone.remove();
        nextClone.remove();
      });

      const realCards = Array.prototype.slice.call(track.querySelectorAll('.gallery-card'));
      const allCards = Array.prototype.slice.call(rail.querySelectorAll('.gallery-card'));
      const allMedia = allCards.map(function (c) {
        return c.querySelector('.gallery-card-media');
      });

      /* modulo cycle length = distance from the start of the real track to the start of the next
         clone — shifting by exactly this much makes a clone land exactly where the real track
         started, which is what makes the loop seamless regardless of how the gap/card-width math is
         tuned. Drift/drag/inertia use this to wrap offsetX into a single canonical (-cycle, 0] range;
         keyboard centering (below) instead picks whichever multiple of `cycle` keeps the REAL card
         on screen, since prevClone/nextClone mean that's always possible without a canonical-range
         restriction. */
      computeGalleryCardMetrics(); // fit card height before measuring cycle width — see its own comment above (§6.3 十)

      let cycle = 0;
      function measureCycle() {
        cycle = nextClone.offsetLeft - track.offsetLeft;
      }
      measureCycle();
      on(window, 'resize', function () {
        computeGalleryCardMetrics();
        measureCycle();
      });

      function wrap(x) {
        if (cycle <= 0) return 0;
        x = x % cycle;
        if (x > 0) x -= cycle;
        return x;
      }

      let offsetX = 0; // rail translateX in px — starts showing prevClone, visually identical to the real track

      /* ---------- Layer 1: environment auto-drift (§6.3 修訂三, revised 2026-08-08) ----------
         Pauses ONLY during an active drag or touch-swipe gesture (or a trackpad/wheel horizontal
         gesture — treated the same as a drag, since it's the same "user is directly steering the
         rail" category; the user's two listed triggers didn't mention wheel explicitly, flagging this
         as my own extension rather than a measured requirement), resuming 800ms after release. Hover
         alone does NOT pause it — this supersedes the earlier "stop once, never resume on any
         interaction" version. driftSpeedFactor eases toward driftTarget (0 paused / 1 running) every
         frame instead of tracking discrete fade start-times, which naturally gives both the pause and
         the resume a soft ease without two separate code paths. */
      const DRIFT_PX_PER_MS = -50 / 1000; // 2026-08-08: raised from 18-25px/s to ~50px/s — clearly moving, still unhurried
      const DRIFT_RESUME_DELAY_MS = 800;
      const DRIFT_EASE_RATE = 0.08; // driftSpeedFactor lerp rate per ~16ms frame
      let driftSpeedFactor = 1;
      let driftTarget = 1;
      let driftResumeTimer = null;

      function pauseDrift() {
        if (driftResumeTimer) {
          clearTimeout(driftResumeTimer);
          driftResumeTimer = null;
        }
        driftTarget = 0;
      }
      function scheduleDriftResume() {
        if (driftResumeTimer) clearTimeout(driftResumeTimer);
        driftResumeTimer = setTimeout(function () {
          driftResumeTimer = null;
          driftTarget = 1;
        }, DRIFT_RESUME_DELAY_MS);
      }
      cleanups.push(() => {
        if (driftResumeTimer) clearTimeout(driftResumeTimer);
      });

      /* ---------- Layer 2: user-driven horizontal movement (§6.3 修訂一) ----------
         Vertical-vs-horizontal intent is decided from the first few px of movement: if the vertical
         component is larger, this is a page-scroll gesture — release it back to the browser
         untouched. Only once the horizontal component is clearly larger do we take over. */
      let velocity = 0; // px/ms, carries into inertia after release
      let pointerActive = false,
        dragDeciding = false,
        dragConfirmed = false;
      let startX = 0,
        startY = 0,
        startOffsetX = 0,
        lastX = 0,
        lastT = 0;
      const DIRECTION_DECIDE_PX = 6;

      on(viewport, 'pointerdown', function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        pointerActive = true;
        dragDeciding = true;
        dragConfirmed = false;
        startX = e.clientX;
        startY = e.clientY;
        startOffsetX = offsetX;
        lastX = e.clientX;
        lastT = performance.now();
        velocity = 0;
      });

      on(
        window,
        'pointermove',
        function (e) {
          if (!pointerActive) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;

          if (dragDeciding) {
            if (Math.abs(dx) < DIRECTION_DECIDE_PX && Math.abs(dy) < DIRECTION_DECIDE_PX) return;
            dragDeciding = false;
            if (Math.abs(dy) > Math.abs(dx)) {
              pointerActive = false;
              return;
            } // vertical intent: hands off
            dragConfirmed = true;
            pauseDrift();
            rail.classList.add('is-dragging');
            if (viewport.setPointerCapture && e.pointerId != null) {
              try {
                viewport.setPointerCapture(e.pointerId);
              } catch (err) {}
            }
          }

          if (!dragConfirmed) return;
          e.preventDefault();
          const now = performance.now();
          const dt = Math.max(1, now - lastT);
          velocity = (e.clientX - lastX) / dt;
          lastX = e.clientX;
          lastT = now;
          offsetX = wrap(startOffsetX + dx);
        },
        { passive: false }
      );

      function endDrag() {
        if (dragConfirmed) {
          rail.classList.remove('is-dragging');
          scheduleDriftResume(); // §6.3 修訂三: drift resumes 800ms after release, not permanently off
        }
        pointerActive = false;
        dragDeciding = false;
        dragConfirmed = false;
      }
      on(window, 'pointerup', endDrag);
      on(window, 'pointercancel', endDrag);

      /* trackpad/mouse horizontal wheel gesture — same direction test as drag. Wheel fires repeatedly
         through a single physical gesture, so each event both pauses drift and re-schedules the
         800ms resume timer — drift only comes back 800ms after the LAST wheel tick, not the first. */
      on(
        viewport,
        'wheel',
        function (e) {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical-dominant: let the page scroll
          e.preventDefault();
          pauseDrift();
          scheduleDriftResume();
          velocity = 0;
          offsetX = wrap(offsetX - e.deltaX);
        },
        { passive: false }
      );

      /* keyboard: focusing a card (Tab / shift+Tab) centers it (§6.3 點擊/導航). Deliberately NOT
         passed through wrap() — that would fold the target back into the single (-cycle, 0] canonical
         range and could land on a *clone's* copy of the card instead of the real (focused) one,
         leaving the :focus-visible ring off-screen. card.offsetLeft already accounts for whatever
         precedes it in the rail (prevClone included), so this directly targets the real element. */
      realCards.forEach(function (card) {
        on(card, 'focus', function () {
          pauseDrift(); // don't fight the centering tween; resumes 800ms after it lands
          const target = (viewport.clientWidth - card.offsetWidth) / 2 - card.offsetLeft;
          const proxy = { v: offsetX };
          gsap.to(proxy, {
            v: target,
            duration: 0.6,
            ease: mainEase,
            onUpdate: function () {
              offsetX = proxy.v;
            },
            onComplete: scheduleDriftResume,
          });
        });
      });

      /* ---------- hover (desktop only — §6.3 Hover 互動) ---------- */
      let hoveredCard = null;
      allCards.forEach(function (card) {
        on(card, 'mouseenter', function () {
          hoveredCard = card;
          card.style.willChange = 'transform, filter, opacity';
        });
        on(card, 'mouseleave', function () {
          if (hoveredCard === card) hoveredCard = null;
          card.style.willChange = '';
        });
      });

      /* ---------- per-frame: drift/inertia integration + Layer 3 distance styling + hover ---------- */
      const INERTIA_DECAY = 0.94; // per ~16ms frame — free stop, no snap-to-card (§6.3 修訂二)
      let lastFrame = performance.now();

      function frame(now) {
        const dt = Math.min(48, now - lastFrame);
        lastFrame = now;

        if (dragConfirmed) {
          // position already driven directly by pointermove above
        } else if (Math.abs(velocity) > 0.005) {
          offsetX = wrap(offsetX + velocity * dt);
          velocity *= Math.pow(INERTIA_DECAY, dt / 16);
        } else {
          // §6.3 修訂三: drift factor eases toward driftTarget (0 while paused, 1 once the resume
          // timer fires) every frame — same mechanism handles both the pause-out and the resume-in.
          driftSpeedFactor += (driftTarget - driftSpeedFactor) * DRIFT_EASE_RATE;
          if (Math.abs(driftSpeedFactor) > 0.0005 || driftTarget > 0) {
            offsetX = wrap(offsetX + DRIFT_PX_PER_MS * driftSpeedFactor * dt);
          }
        }

        rail.style.transform = 'translateX(' + offsetX.toFixed(2) + 'px)';

        const vpRect = viewport.getBoundingClientRect();
        const centerX = vpRect.left + vpRect.width / 2;
        const maxDist = vpRect.width / 2 + (allCards[0] ? allCards[0].offsetWidth : 0);

        for (let i = 0; i < allCards.length; i++) {
          const card = allCards[i];
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - centerX);
          const d = maxDist > 0 ? Math.min(1, dist / maxDist) : 0;

          const baseScale = 1 - 0.1 * d; // Layer 3: scale 1.0 -> 0.90
          const baseOpacity = 1 - 0.35 * d; // Layer 3: opacity 1.0 -> 0.65
          const baseSaturate = 100 - 25 * d; // Layer 3: saturate 100% -> 75%

          const isHovered = card === hoveredCard;
          const anyHovered = hoveredCard !== null;

          let scale = baseScale,
            opacity = baseOpacity,
            saturate = baseSaturate,
            gray = 0;
          if (isHovered) {
            scale = baseScale * 1.04;
            opacity = 1;
            saturate = 100;
            gray = 0;
          } else if (anyHovered) {
            scale = baseScale * 0.96;
            opacity = 0.45;
            gray = 100; // saturate stays distance-based (§6.3 修訂七)
          }

          card.style.transform = 'scale(' + scale.toFixed(4) + ')';
          card.style.opacity = opacity.toFixed(3);
          card.style.filter = 'saturate(' + saturate.toFixed(2) + '%) grayscale(' + gray + '%)';

          const media = allMedia[i];
          if (media) {
            const sign = cardCenter < centerX ? 1 : -1; // parallax opposite the track's own motion
            media.style.transform = 'translateX(' + (sign * 16 * d).toFixed(2) + 'px)';
          }
        }

        frameId = requestAnimationFrame(frame);
      }
      frameId = requestAnimationFrame(frame);
    }, outerRef);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section className="gallery-outer" id="gallery" ref={outerRef}>
      <h2 className="gallery-title" id="gallery-title" ref={titleRef}>
        {/* ⚠️ 2026-09-03 改文案：原本列的 CAD / Craft / Reflective Design /
            APP Design，六件上線作品裡一件對應的都沒有。新的四個詞在六件的
            tags 裡全都有實例。
            ⚠️ 分隔用的斜線統一成前後都有空格（詞 / 詞）——原本
            「Product Design/」沒空格、「APP Design /」有空格，兩種混用。
            「UI/UX」裡面那條斜線維持不加空格：那是詞本身的一部分，
            不是分隔符號。 */}
        <span className="reveal-mask">
          <span className="reveal-inner">UI/UX / Product Design /</span>
        </span>
        <span className="reveal-mask">
          <span className="reveal-inner">Health / Environment + more</span>
        </span>
      </h2>

      <div className="gallery-viewport" id="gallery-viewport" ref={viewportRef}>
        <div className="gallery-rail" id="gallery-rail" ref={railRef}>
          <div className="gallery-track" id="gallery-track" ref={trackRef}>
            {/* Real cards only — JS clones this whole track onto both sides for the seamless loop
                (§6.3 修訂六). The clones get aria-hidden + tabindex=-1 on every link, so neither is
                ever reachable by keyboard or announced by a screen reader.

                資料來自 works.json（原型是寫死的 12 張 <a>）。標題與 tags 直接用
                works.json 的欄位，不再各自維護一份。 */}
            {GALLERY_WORKS.map((work) => {
              return (
                <Link
                  className="gallery-card"
                  href={`/work/${work.slug}`}
                  data-slug={work.slug}
                  key={work.slug}
                >
                  <div className="gallery-card-media">
                    {work.galleryCover && (
                      // 卡片的無障礙名稱由底下的 .gallery-card-title 提供，
                      // 圖片是純視覺，alt="" 才不會重複朗讀。
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={work.galleryCover}
                        srcSet={`${work.galleryCover} 1x, ${work.galleryCover.replace(/\.webp$/, '@2x.webp')} 2x`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="gallery-card-overlay">
                    <div className="gallery-card-title">{work.title}</div>
                    <div className="gallery-card-tags">{(work.tags || []).join(', ')}</div>
                    <div className="gallery-card-meta"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
