'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { mainEase } from '@/lib/ease';
import { useNavBehavior } from '@/components/NavBehaviorProvider';
import './home-stage.css';

/**
 * 首頁 Loading → Hero 舞台（規格書 §6.1）
 *
 * 這一輪只做 PHASE 1（0 → 1.65s 組裝）與 PHASE 2（1.65s → 載入完成的計數器）。
 * PHASE 3（FLIP 推軌）與 PHASE 4（Hero 內容）下一輪再做，這裡刻意留空。
 *
 * ⚠️ 架構（改動前務必讀 home-stage.css 檔頭）：
 * 板凳的 CSS 寬高／位置寫的是「Hero 的最終值」，Loading 的小尺寸是執行期
 * 算出來的 transform。PHASE 3 只要把 transform 動畫回 (0,0,1) 就完成推軌，
 * 板凳 DOM 節點從頭到尾不變，符合 §6.1「SVG 元素永不 unmount」。
 *
 * SVG 由 app/page.js（Server Component）讀檔後以字串傳進來，用
 * dangerouslySetInnerHTML inline。不寫成 .jsx 是因為壓縮後的板凳仍有
 * 528KB／218KB 的路徑資料，塞進原始碼會讓檔案無法閱讀也無法 diff；
 * 內容是專案自己的靜態資產，不是使用者輸入。
 */

// PHASE 1 時間軸（§6.1 完整時間軸表，單位秒）
const T = {
  benchLeftDrop: 0,
  benchRightDrop: 0.12,
  dropSettle: 0.42, // 落地 600ms 中，前 420ms 到達超過位置，後 180ms 回穩
  dropSettleDur: 0.18,
  logoIn: 0.7, // logo 淡入 + 板凳讓開，同時開始、同時長 700ms
  logoDur: 0.7,
  counterIn: 1.4, // 計數器淡入 250ms
  counterDur: 0.25,
  countStart: 1.65, // PHASE 2 開始
};

const OVERSHOOT = 4; // §6.1：超過最終 Y 位置 4px 再回穩（有重量的物件，不是彈跳）
const PART_X = 97; // §6.1：logo 出現時兩張板凳各向外滑開約 97px（Figma 實測）
const MIN_COUNT_MS = 2500; // §6.1：最短 2.5 秒，從 PHASE 2 起算
const STALL_CEILING = 96; // §6.1：資產沒到齊就停在 95–97 附近，不再往上

/**
 * 三段式 ease（§6.1 節奏）：0→60 輕快、60→90 明顯變慢、90→100 最慢。
 * 回傳 0–1 的 progress，乘 100 後 floor 成顯示值。
 *   前 50% 時間跑 60 個數字 → 每單位時間 120
 *   中 35% 時間跑 30 個數字 → 每單位時間 85.7
 *   後 15% 時間跑 10 個數字 → 每單位時間 66.7，且段內再用 1-(1-x)² 遞減
 * 三段斜率遞減，最後一段還會自己越走越慢。
 */
function counterEase(t) {
  if (t < 0.5) return (t / 0.5) * 0.6;
  if (t < 0.85) return 0.6 + ((t - 0.5) / 0.35) * 0.3;
  const local = (t - 0.85) / 0.15;
  return 0.9 + (1 - Math.pow(1 - local, 2)) * 0.1;
}

export default function HomeStage({ benchLeftSvg, benchRightSvg, logoSvg }) {
  // Loading 是滿版畫布，蓋掉導覽列預留的空間；導覽列本身先隱藏，
  // PHASE 3 的 +400ms 才讓它進場。
  useNavBehavior({ startHidden: true, fullBleedTop: true });

  const rootRef = useRef(null);
  const benchLeftRef = useRef(null);
  const benchRightRef = useRef(null);
  const slotLeftRef = useRef(null);
  const slotRightRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const numRef = useRef(null);

  // PHASE 3 之後會用到：Loading 靜止狀態的 transform，存起來供推軌起點使用
  const loadingXform = useRef({ left: null, right: null });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * 量出「把 Hero 尺寸的板凳，變成 Loading 小板凳」所需的 transform。
     * transform-origin 是 0 0，所以是左上角對左上角的位移 + 等比縮放。
     */
    const measure = (bench, slot) => {
      const b = bench.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const scale = s.width / b.width;
      return { x: s.left - b.left, y: s.top - b.top, scale };
    };

    const ctx = gsap.context(() => {
      const bl = benchLeftRef.current;
      const br = benchRightRef.current;
      const logo = logoRef.current;
      const counter = counterRef.current;

      // 量測前先確保沒有殘留 transform，否則量到的是變換後的框
      gsap.set([bl, br], { clearProps: 'transform' });
      const L = measure(bl, slotLeftRef.current);
      const R = measure(br, slotRightRef.current);
      loadingXform.current = { left: L, right: R };

      // ── PHASE 2 計數器 ───────────────────────────────────────────
      const startCounter = () => {
        const t0 = performance.now(); // ⚠️ 從 PHASE 2 起算，不是從 t=0
        let displayed = 0;
        let assetsReady = false;
        let raf = 0;

        // §6.1 技術要求：計數器開始前先預載顯示字體，避免計數中途 FOUT
        assetsPromise().then(() => {
          assetsReady = true;
        });

        const tick = (now) => {
          const elapsed = now - t0;
          const t = Math.min(elapsed / MIN_COUNT_MS, 1);

          const ready = assetsReady && elapsed >= MIN_COUNT_MS;
          let target = Math.floor((reduce ? t : counterEase(t)) * 100);

          // 資產沒到齊 或 還沒滿 2.5 秒 → 天花板壓在 96，沒有 timeout，
          // 一直等到資產真的載完才放行；放行後 displayed 會照常一幀 +1
          // 把 97、98、99、100 逐一補完。
          //
          // ⚠️ 這裡必須「無條件」封頂，不可寫成 if (target >= 100) 才壓。
          // counterEase(t)*100 在 t 到 1 之前就已經走到 99，displayed 早就
          // 爬上去了；等 target 終於到 100 再壓成 96 已經沒用
          // （displayed < target 不成立），結果會停在 99——正是 §6.1 說
          // 「不要卡在更低/更高的數字，那會讀成壞掉」要避免的情況。
          // 實測過：舊寫法在資產永不載完時停在 99% 長達 23 秒。
          // （prototypes/home.html 也是舊寫法，有同樣的 bug。）
          if (!ready) target = Math.min(target, STALL_CEILING);

          // ⚠️ 永不遞減、永不跳號：一幀最多 +1。掉幀時 target 可能一次跳
          // 好幾格，displayed 會用接下來幾幀逐一補完，中間每個整數都渲染過。
          // 這裡用 Math.min 而不是直接指派，reduced-motion 的線性路徑才不會
          // 出現「99 → 100 → 被壓成 96」的可見遞減。
          if (displayed < target) displayed = Math.min(displayed + 1, target);
          renderDigits(numRef.current, displayed);

          if (displayed >= 100) {
            // PHASE 3 的接點：下一輪在這裡啟動推軌。
            // 這一輪先把捲動解鎖，不然頁面會永遠鎖著。
            document.documentElement.style.overflow = '';
            return;
          }
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      };

      // ── reduced motion：跳過組裝，直接顯示靜態 loading 狀態 ──────
      if (reduce) {
        gsap.set(bl, { x: L.x - PART_X, y: L.y, scale: L.scale, opacity: 1 });
        gsap.set(br, { x: R.x + PART_X, y: R.y, scale: R.scale, opacity: 1 });
        gsap.set(logo, { opacity: 1, scale: 1 });
        gsap.set(counter, { opacity: 1, y: 0 });
        startCounter();
        return;
      }

      // ── PHASE 1 ─────────────────────────────────────────────────
      document.documentElement.style.overflow = 'hidden';

      const tl = gsap.timeline();

      // 1.1 兩張板凳落地（0 → 700ms）。左先、右延遲 120ms。
      //     不旋轉、不打轉——這是手工物件被放到地板上。
      //     落定：超過最終 Y 位置 4px，再於最後 180ms 回到定位。
      const drop = (el, base, at) => {
        tl.fromTo(
          el,
          { x: base.x, y: base.y + 30, scale: base.scale * 0.9, opacity: 0 },
          {
            x: base.x,
            y: base.y + OVERSHOOT,
            scale: base.scale,
            opacity: 1,
            duration: T.dropSettle,
            ease: mainEase,
          },
          at
        ).to(el, { y: base.y, duration: T.dropSettleDur, ease: mainEase }, at + T.dropSettle);
      };
      drop(bl, L, T.benchLeftDrop);
      drop(br, R, T.benchRightDrop);

      // 1.2 GOMO logo 出現（700 → 1400ms），板凳同時向外讓開。
      //     §6.1：兩者必須讀成「同一個動作」——時長與 easing 必須一致。
      tl.fromTo(
        logo,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: T.logoDur, ease: mainEase },
        T.logoIn
      );
      tl.to(bl, { x: L.x - PART_X, duration: T.logoDur, ease: mainEase }, T.logoIn);
      tl.to(br, { x: R.x + PART_X, duration: T.logoDur, ease: mainEase }, T.logoIn);

      // 1.3 計數器出現（1400 → 1650ms），起始 0%，先不開始計數。
      tl.to(
        counter,
        { opacity: 1, y: 0, duration: T.counterDur, ease: mainEase },
        T.counterIn
      );

      // ── PHASE 2 於 1650ms 開始 ──────────────────────────────────
      tl.call(startCounter, null, T.countStart);

      // §6.1 環境生命感：計數期間兩張板凳以緩慢、相位錯開的 sine 上下漂移
      // 2px（週期約 3s，右板凳相位偏移）。幾乎察覺不到，作用只是讓畫面
      // 不像凍住。只動 transform。
      tl.call(
        () => {
          gsap.to(bl, {
            y: L.y - 2,
            duration: 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
          gsap.to(br, {
            y: R.y - 2,
            duration: 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.75, // 相位偏移半個週期
          });
        },
        null,
        T.countStart
      );
    }, root);

    // ⚠️ 視窗縮放必須重新量測：板凳的 CSS left 是百分比、slot 的 left 是
    // calc(50% ± px)，兩者都隨視窗寬度變動，但 Loading 的 transform 是
    // 掛載時算一次的定值。不處理的話，縮放視窗後板凳會跑掉——實測從
    // 1440 縮到 1155 時左板凳會壓到 logo 上。
    // 做法：重新量測，然後直接把板凳設到「已讓開」的靜止狀態。若 PHASE 1
    // 還在跑就先殺掉它——縮放視窗時組裝動畫已經失去意義，直接落到定位
    // 比讓它用過期的座標跑完更合理。
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const bl = benchLeftRef.current;
        const br = benchRightRef.current;
        if (!bl || !br) return;
        gsap.killTweensOf([bl, br]);
        gsap.set([bl, br], { clearProps: 'transform' });
        const L = measure(bl, slotLeftRef.current);
        const R = measure(br, slotRightRef.current);
        loadingXform.current = { left: L, right: R };
        gsap.set(bl, { x: L.x - PART_X, y: L.y, scale: L.scale, opacity: 1 });
        gsap.set(br, { x: R.x + PART_X, y: R.y, scale: R.scale, opacity: 1 });
        gsap.set(logoRef.current, { opacity: 1, scale: 1 });
        gsap.set(counterRef.current, { opacity: 1, y: 0 });
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeRaf);
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="home-stage" ref={rootRef}>
      <div className="bench-stage">
        {/* ⚠️ 這兩個節點永不 unmount——PHASE 3 直接對它們做 transform。
            dangerouslySetInnerHTML 的內容是專案自己的靜態 SVG 資產。 */}
        <div
          className="bench bench-left"
          ref={benchLeftRef}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: benchLeftSvg }}
        />
        <div
          className="bench bench-right"
          ref={benchRightRef}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: benchRightSvg }}
        />
      </div>

      {/* 空的定位參考框，只提供 Loading 階段的幾何來源，不渲染內容 */}
      <div className="loading-slot loading-slot-left" ref={slotLeftRef} aria-hidden="true" />
      <div className="loading-slot loading-slot-right" ref={slotRightRef} aria-hidden="true" />

      <div className="loading-ui">
        <div
          className="loading-logo"
          ref={logoRef}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: logoSvg }}
        />
        {/* 計數是資訊，讓螢幕閱讀器知道載入進度 */}
        <p
          className="loading-counter"
          ref={counterRef}
          role="status"
          aria-live="polite"
          aria-label="Loading progress"
        >
          {/* 三個預先建好的等寬字符格。renderDigits 只改 textContent 與
              display，不新增／移除節點，計數期間不會有 DOM 增刪。 */}
          <span className="loading-num" ref={numRef}>
            <span className="loading-digit" style={{ display: 'none' }} />
            <span className="loading-digit" style={{ display: 'none' }} />
            <span className="loading-digit">0</span>
          </span>
          <span className="loading-pct">%</span>
        </p>
      </div>
    </div>
  );
}

/**
 * 把數值寫進三個固定寬度的字符格。
 * ⚠️ 不用 textContent = String(v)：Poppins 沒有 tnum 等寬數字特性，
 * 直接寫字串會讓整串寬度隨數字內容改變，% 一直左右跳（見 home-stage.css
 * 的實測數據）。這裡每個位數各佔一格固定寬度，等於手動實作 tabular figures。
 * 只改既有節點的 textContent 與 display，不新增／移除 DOM。
 */
function renderDigits(host, value) {
  const s = String(value);
  const cells = host.children; // 固定 3 個
  for (let i = 0; i < cells.length; i++) {
    const idx = i - (cells.length - s.length); // 由右往左對齊
    if (idx < 0) {
      cells[i].style.display = 'none';
    } else {
      cells[i].style.display = '';
      const ch = s[idx];
      if (cells[i].textContent !== ch) cells[i].textContent = ch;
    }
  }
}

/**
 * §6.1 進度來源：追蹤真實資產載入。
 * 這一輪的資產是「字體 + 已 inline 的板凳／logo SVG」——SVG 隨 HTML 一起
 * 到，所以實際等的是字體與 window load。PHASE 4 的 Hero 圖片下一輪再加。
 */
function assetsPromise() {
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true }));
  return Promise.all([fonts, loaded]);
}
