'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/LenisProvider';
import { mainEase } from '@/lib/ease';
import { getGalleryAnchorY } from '@/lib/galleryMetrics';
import './scroll-next-button.css';

/**
 * 「捲到下一區塊」箭頭按鈕 + 區塊邊界吸附「煞車」
 *
 * 從 prototypes/home.html「原樣移植」：
 *   HTML 1250–1263（按鈕標記）
 *   CSS  986–1014（→ scroll-next-button.css）
 *   JS   2359–2426（按鈕）
 *   JS   2427–2484（煞車。使用者 2026-08-30 選 (a)：一起搬，
 *                   cancelSnap() 要有真的實作，不要再多一個「暫時」的東西）
 *
 * 兩者共用同一組 anchors，也共用 cancelSnap()——按鈕的 click handler 第一行
 * 就呼叫它，所以本來就分不開，放在同一個元件裡。
 *
 * ⚠️ 這是首頁專屬：anchors 讀的是 §6.3 的 #gallery，其他頁面沒有那個節點。
 * 掛載處在 app/page.js。
 */
export default function ScrollNextButton() {
  const btnRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const scrollNextBtn = btnRef.current;
    if (!scrollNextBtn || !lenis) return undefined;

    const footer = document.querySelector('.site-footer');
    if (!footer) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanups = [];
    const on = (target, type, handler, opts) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    let nextBtnLoadingDone = false;
    let nextBtnReachedFooter = false;
    let pollId = null;

    function updateNextBtnVisibility() {
      scrollNextBtn.classList.toggle('is-visible', nextBtnLoadingDone && !nextBtnReachedFooter);
    }

    /* deferred to a rAF callback (not checked synchronously here) so it only runs after the loading
       sequence's own `document.documentElement.style.overflow = 'hidden'` lock — set further down in
       script order — has actually taken effect; checking synchronously at this point in the script
       would race ahead of that line and wrongly read the pre-lock '' value.
       ─────────────────────────────────────────────────────────────────────────────
       ⚠️ 隱式耦合，兩處都有註解（另一處在 components/home/HomeStage.jsx 的
       lockScroll()）：這個輪詢**依賴** HomeStage 在 Loading 期間把
       document.documentElement.style.overflow 設成 'hidden'、結束時清空。
       我們的鎖定其實是 overflow + lenis.stop() 兩條，但這裡只看得到 overflow
       那一條。要是哪天有人覺得「已經有 lenis.stop() 了，overflow 這行多餘」
       把它刪掉，這個按鈕會**靜默地永遠不出現**——不會報錯、不會有 console
       訊息。改 HomeStage 的鎖定機制之前先改這裡。 */
    function pollLoadingUnlock() {
      if (document.documentElement.style.overflow !== 'hidden') {
        nextBtnLoadingDone = true;
        updateNextBtnVisibility();
        return;
      }
      pollId = requestAnimationFrame(pollLoadingUnlock);
    }
    pollId = requestAnimationFrame(pollLoadingUnlock);

    /* hidden once scrolled to the footer (last section — nothing left to jump to); reappears if the
       user scrolls back up away from it. Reuses the same IntersectionObserver pattern as the footer's
       own entrance trigger above, but persistent (no disconnect). */
    const nextBtnFooterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          nextBtnReachedFooter = entry.isIntersecting;
          updateNextBtnVisibility();
        });
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0 }
    );
    nextBtnFooterObserver.observe(footer);
    cleanups.push(() => nextBtnFooterObserver.disconnect());

    /* anchors, in order: Hero top / Gallery / Footer.
       ⚠️ 2026-09-03：原本是五個停靠點（Hero 頂 / §6.2 拼貼起點 / §6.2 定住起點 /
       Gallery / Footer）。§6.2 從首頁移除之後，中間那兩個依附於
       #practice-to-work 與 ptwGrowthHold() 的停靠點一併拿掉，剩三個。
       仍然「每次點擊重算、不快取」：getGalleryAnchorY() 會依當下視窗高度重新
       量卡片高度（見 lib/galleryMetrics.js），resize 之後直接用舊值會落錯位置。 */
    function getNextSectionAnchors() {
      return [0, getGalleryAnchorY(), footer.offsetTop];
    }

    // ---------- 煞車（原型 2427–2484），宣告在按鈕之前，因為按鈕要用 cancelSnap ----------
    /* ---------- section-boundary scroll-snap ("brake", new item, 2026-08-09) ----------
       If the user stops scrolling within ±25vh of one of the same three anchors the button above jumps
       between, ease the rest of the way there — mouse/trackpad scrolling gives no feedback about where
       a section boundary actually is, so it's easy to overshoot and rest barely into Gallery. Anywhere else (mid-animation, deliberately) is left alone. Any fresh user
       gesture during an in-flight snap cancels it immediately — this must never fight the user for
       control of the scroll. */
    let snapIdleTimer = null;
    let snapActive = false;

    function cancelSnap() {
      if (!snapActive) return;
      snapActive = false;
      lenis.scrollTo(lenis.scroll, { duration: 0 }); // re-target to the current (already-interpolated) position — halts the in-flight tween without a visible jump
    }

    if (!reduceMotion) {
      const SNAP_IDLE_MS = 150;
      const SNAP_CAPTURE_VH = 25;
      const SNAP_DURATION_S = 0.6;

      const trySnap = function () {
        if (snapActive) return;
        const anchors = getNextSectionAnchors();
        const current = lenis.scroll;
        const captureRange = window.innerHeight * (SNAP_CAPTURE_VH / 100);
        let nearest = null,
          nearestDist = Infinity;
        anchors.forEach(function (a) {
          const d = Math.abs(a - current);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = a;
          }
        });
        if (nearest === null || nearestDist > captureRange || nearestDist < 1) return; // nothing to do — either out of range, or already there
        snapActive = true;
        lenis.scrollTo(nearest, {
          duration: SNAP_DURATION_S,
          easing: mainEase,
          onComplete: function () {
            snapActive = false;
          },
        });
      };

      /* schedule/reschedule the idle check on every real scroll tick — including the ones the snap's
         own scrollTo produces, which is fine, trySnap() is a no-op while snapActive is already true */
      const onLenisScroll = function () {
        if (snapIdleTimer) clearTimeout(snapIdleTimer);
        snapIdleTimer = setTimeout(trySnap, SNAP_IDLE_MS);
      };
      lenis.on('scroll', onLenisScroll);
      cleanups.push(() => lenis.off('scroll', onLenisScroll));

      /* raw input gestures (not lenis's own 'scroll' event, which fires identically for both
         user-driven and programmatic scrollTo-driven movement and so can't tell them apart) — this is
         what actually distinguishes "the user grabbed the wheel again" from the snap's own motion */
      ['wheel', 'touchstart', 'pointerdown'].forEach(function (evt) {
        on(
          window,
          evt,
          function () {
            if (snapIdleTimer) {
              clearTimeout(snapIdleTimer);
              snapIdleTimer = null;
            }
            cancelSnap();
          },
          { passive: true }
        );
      });

      cleanups.push(() => {
        if (snapIdleTimer) clearTimeout(snapIdleTimer);
      });
    }

    on(scrollNextBtn, 'click', function () {
      cancelSnap(); // the click's own scrollTo should own the animation outright, not race a pending snap
      const anchors = getNextSectionAnchors();
      const current = lenis.scroll;
      const EPS = 4; // px slack so landing exactly on an anchor still advances to the next one
      let target = anchors[anchors.length - 1];
      for (let i = 0; i < anchors.length; i++) {
        if (anchors[i] > current + EPS) {
          target = anchors[i];
          break;
        }
      }
      /* must go through lenis.scrollTo, never native scrollTo — otherwise it fights the shared Lenis
         instance and jitters (same rule the back-to-top button above already follows). 1200ms so the
         scrubbed animations it passes through (§6.2 collage disperse + video grow) fast-forward
         smoothly instead of jump-cutting; shortened under reduced motion like the rest of the site.
         ⚠️ §6.2 移除後這一段路上已經沒有 scrubbed 動效了，但 1200ms 維持不變——
         它是 Hero → Gallery 這段距離的手感，不是為了配合那些動畫才訂的。 */
      lenis.scrollTo(target, { duration: reduceMotion ? 0.3 : 1.2, easing: mainEase });
    });

    return () => {
      if (pollId) cancelAnimationFrame(pollId);
      cleanups.forEach((fn) => fn());
    };
  }, [lenis]);

  return (
    <button className="back-to-top scroll-next-btn" id="scroll-next-btn" type="button" aria-label="Jump to next section" ref={btnRef}>
      <span className="btt-icon-wrap">
        <svg
          className="btt-icon"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </span>
    </button>
  );
}
