'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { mainEase } from '@/lib/ease';
import { useNavBehavior, useNavBehaviorConfig } from '@/components/NavBehaviorProvider';
import { useLenis } from '@/components/LenisProvider';
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
const DIGIT_SHIFT_DUR = 0.15; // 位數改變時重新置中的補間長度（你指定 150ms）

// PHASE 3 時間軸（§6.1，單位秒）
const P3 = {
  uiOutDur: 0.35, // 3.1 計數器與大 logo 淡出 + scale(0.92)
  dolly: 1.3, // 3.2 推軌 1300ms（手機縮短為 1000ms，見 §6.1 RWD）
  dollyMobile: 1.0,
  benchLag: 0.08, // 右板凳晚 80ms
  zDrop: 0.35, // 舞台 z-index 降階，讓導覽列能浮上來
  zAfter: 999, // 降到 999：高於頁腳(auto)、低於導覽列(1000)
  navIn: 0.4, // 3.3 導覽列進場
  reducedFade: 0.3, // reduced motion：直接 300ms 交叉淡入
};

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
  // 首頁是滿版 Hero：不要 .page-content 的 126px 上留白、導覽列背景透明。
  // 這兩件事由最外層 <div> 的 data-nav-bleed 屬性 + globals.css 的 :has()
  // 規則處理，「不」走這個 hook——走 hook 的話 SSR 的 HTML 不帶那個 class，
  // hydration 後才翻，整頁會往上跳 126px（實測 CLS 0.0867）。
  //
  // 這裡只留 deferIntro：導覽列的 logo 與連結先隱藏，等 PHASE 3 的 +400ms
  // 由 playNavIntro() 叫進場。
  //
  // ⚠️ 刻意不用 startHidden：那是「整條 bar 移出畫面再滑回來」，但 §6.1
  // PHASE 3.3 要的是「小 logo 在左上角原地淡入 + 上升 12px」——bar 本身
  // 從頭就在 y:0，只是內容透明，加上 Loading 舞台蓋著所以看不見。
  useNavBehavior({ deferIntro: true });
  const { playNavIntro } = useNavBehaviorConfig();

  const rootRef = useRef(null);
  const benchLeftRef = useRef(null);
  const benchRightRef = useRef(null);
  const slotLeftRef = useRef(null);
  const slotRightRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const numRef = useRef(null);
  const pctRef = useRef(null);

  // PHASE 3 之後會用到：Loading 靜止狀態的 transform，存起來供推軌起點使用
  const loadingXform = useRef({ left: null, right: null });

  // ---------- Loading 期間的捲動鎖定 ----------
  // ⚠️ 只設 documentElement.overflow = 'hidden' 是不夠的。那條只擋瀏覽器
  // 「原生」的捲動（鍵盤、原生觸控慣性、捲軸拖曳），擋不住 Lenis——Lenis
  // 是自己接 wheel / touch 事件、再用 programmatic scrollTo 捲的，而
  // programmatic 捲動不受 overflow 限制。實測：Loading 期間灌 8 個
  // deltaY:400 的 wheel 事件，頁面照樣捲到 3147。
  //
  // 原型 prototypes/home.html 也有同樣的洞，但它從來沒被看見——當時首頁
  // 的 .hero-stage 之後就沒有內容，文件根本沒有可捲高度。§6.2 接上來之後
  // 文件變成 4932px，使用者就能在推軌還沒播完時滑走，§6.1「觀者的視線
  // 全程不能失去板凳」直接失守。
  // 這是「修正原型既有問題」，不是偏離原型（使用者 2026-08-30 裁示）。
  //
  // 兩條都要：lenis.stop() 擋 Lenis 自己的 wheel/touch 路徑，
  // overflow:hidden 擋原生路徑（鍵盤空白鍵 / PageDown / 方向鍵）。
  const lenis = useLenis();
  const lenisRef = useRef(null);
  lenisRef.current = lenis;
  const scrollLockedRef = useRef(false);

  // ⚠️⚠️ documentElement.style.overflow 這行「不只是」鎖捲動。
  // §6.3 的「捲到下一區塊」箭頭按鈕（components/home/ScrollNextButton.jsx 的
  // pollLoadingUnlock）用 rAF 輪詢這個值，藉此判斷 Loading 是否結束、
  // 該不該現身。這是原型 prototypes/home.html:2369 就有的做法，照抄過來。
  //
  // 所以：**移除或改寫 overflow 這一行之前，先改掉 ScrollNextButton 的輪詢**。
  // 看到「都已經有 lenis.stop() 了，overflow 這行多餘」就順手刪掉的話，
  // 那顆按鈕會靜默地永遠不出現——不會報錯、不會有 console 訊息。
  // 兩邊的註解要一起維護（另一處在 ScrollNextButton.jsx 的 pollLoadingUnlock）。
  const lockScroll = useCallback(() => {
    scrollLockedRef.current = true;
    document.documentElement.style.overflow = 'hidden';
    lenisRef.current?.stop();
  }, []);

  const unlockScroll = useCallback(() => {
    scrollLockedRef.current = false;
    document.documentElement.style.overflow = '';
    lenisRef.current?.start();
  }, []);

  // LenisProvider 是在自己的 effect 裡 new Lenis()、再用 state 傳下來的，
  // 所以這個元件掛載當下 lenisRef.current 還是 null，lockScroll() 那一下的
  // stop() 會落空。等 instance 出現時在這裡補一次；若那時已經解鎖了就不動。
  useEffect(() => {
    if (lenis && scrollLockedRef.current) lenis.stop();
  }, [lenis]);

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

      // ── PHASE 3 轉場：Loading 變成 Hero ─────────────────────────
      // §6.1：一次連續的攝影機推軌，不是換頁。不可淡出到空白、不可白閃、
      // 不可路由切換——觀者視線全程不能失去板凳。
      //
      // ⚠️ 板凳用的是「與 Loading 完全相同的 SVG 元素」。推軌就是把
      // loadingXform 那組 transform 動畫回 (0,0,1)——同一個 DOM 節點、
      // 同一個 transform 屬性的連續補間。不 unmount、不交叉淡入、不寫死
      // 放大倍率（倍率由 measure() 在執行期用 getBoundingClientRect 量
      // loading slot 與 hero 尺寸算出，任一邊改了都會自動正確）。
      const runTransition = () => {
        const stage = rootRef.current;

        // ⚠️ 先殺掉 PHASE 2 的板凳漂移。那是 repeat:-1 + yoyo 的無限補間，
        // 動的也是 y——不殺的話會跟推軌搶同一個屬性，推軌設的 y:0 會被漂移
        // 一直覆寫回去，板凳最後停在「漂移基準」而不是 Hero 位置。
        // 實測過：不殺時左板凳結束於 y=-153（Hero 目標是 0），整整高了 153px。
        gsap.killTweensOf([bl, br]);
        const dollyDur = window.matchMedia('(max-width: 600px)').matches
          ? P3.dollyMobile // §6.1 RWD：手機推軌縮短為 1000ms
          : P3.dolly;

        // reduced motion：完全跳過推軌，直接 300ms 交叉淡入到 Hero 最終狀態
        if (reduce) {
          gsap.to([logo, counter], { opacity: 0, duration: P3.reducedFade, ease: mainEase });
          gsap.to([bl, br], {
            x: 0,
            y: 0,
            scale: 1,
            duration: P3.reducedFade,
            ease: mainEase,
            onComplete: () => {
              stage.style.zIndex = String(P3.zAfter);
              unlockScroll();
            },
          });
          playNavIntro();
          return;
        }

        // §6.1 技術要求：will-change: transform 只在推軌階段掛著，之後移除
        gsap.set([bl, br], { willChange: 'transform' });

        const tl = gsap.timeline();

        // 3.1 Loading UI 退場（0 → 350ms）。板凳完全不理會這件事，
        //     它們已經開始移動了。
        //     掛 will-change 是為了 AC 第 12 條——計數器是文字，不提升成
        //     合成層的話 opacity 淡出會逐幀 repaint，推軌期間就不是「只有
        //     composite」。實測沒掛時推軌窗口內有 28 次 Paint。
        gsap.set([logo, counter], { willChange: 'transform, opacity' });
        tl.to(
          [logo, counter],
          {
            opacity: 0,
            scale: 0.92,
            duration: P3.uiOutDur,
            ease: mainEase,
            onComplete: () => gsap.set([logo, counter], { willChange: 'auto' }),
          },
          0
        );

        // 3.2 板凳推軌（0 → 1300ms）。左板凳領先、右板凳晚 80ms，
        //     不要像一整塊剛體在動。
        tl.to(bl, { x: 0, y: 0, scale: 1, duration: dollyDur, ease: mainEase }, 0);
        tl.to(br, { x: 0, y: 0, scale: 1, duration: dollyDur, ease: mainEase }, P3.benchLag);

        // 舞台降階，導覽列才能浮上來。此時 Loading UI 已經淡完，
        // 導覽列內容也還是透明的（deferIntro），不會有東西突然冒出來。
        //
        // ⚠️ 只降到 999，不可降到 0。.footer-frame 是 position:relative /
        // z-index:auto，跟 z-index:0 同層且在 DOM 中較後面——舞台降到 0 的
        // 話頁腳會整個蓋上來，板凳被頁腳文字擋住，直接違反 §6.1「觀者的
        // 視線全程不能失去板凳」。實測過，推軌 500ms 處畫面會露出整個
        // 頁腳。999 剛好高於頁腳、低於導覽列的 1000。
        tl.call(() => { stage.style.zIndex = String(P3.zAfter); }, null, P3.zDrop);

        // 3.3 導覽列到位（400 → 900ms）。板凳還在移動的同時。
        tl.call(() => playNavIntro(), null, P3.navIn);

        // 推軌結束才解鎖捲動，中途不會被捲動打斷
        tl.call(
          () => {
            gsap.set([bl, br], { willChange: 'auto' });
            unlockScroll();
          },
          null,
          P3.benchLag + dollyDur
        );
      };

      // ── PHASE 2 計數器 ───────────────────────────────────────────
      const startCounter = () => {
        const t0 = performance.now(); // ⚠️ 從 PHASE 2 起算，不是從 t=0
        let displayed = 0;
        let prevLen = 1; // 目前顯示的位數，用來偵測 9→10、99→100
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

          // 位數改變（9→10、99→100）時，整串寬度會跳一級，因為群組是置中
          // 對齊，數字與 % 會各自往外瞬移 ±11.52px。這裡改成 FLIP 補間：
          // 量測前後位置差 → 套上反向 translateX → 150ms 補間回 0。
          // 只動 transform，不新增 layout/paint（量測只在位數改變的那兩幀
          // 各發生一次，不是每幀）。
          // 數字字形本身仍然沒有任何過場動畫（§6.1 明文禁止），動的只有
          // 「整串因為變寬而重新置中」這件事。
          const len = String(displayed).length;
          if (len !== prevLen) {
            const numEl = numRef.current;
            const pctEl = pctRef.current;
            const beforeNum = numEl.getBoundingClientRect().left;
            const beforePct = pctEl.getBoundingClientRect().left;
            renderDigits(numEl, displayed);
            const afterNum = numEl.getBoundingClientRect().left;
            const afterPct = pctEl.getBoundingClientRect().left;
            gsap.fromTo(
              numEl,
              { x: beforeNum - afterNum },
              { x: 0, duration: DIGIT_SHIFT_DUR, ease: mainEase, overwrite: true }
            );
            gsap.fromTo(
              pctEl,
              { x: beforePct - afterPct },
              { x: 0, duration: DIGIT_SHIFT_DUR, ease: mainEase, overwrite: true }
            );
            prevLen = len;
          } else {
            renderDigits(numRef.current, displayed);
          }

          if (displayed >= 100) {
            runTransition(); // PHASE 3
            return;
          }
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      };

      // 捲動鎖定要在 reduced motion 的分支「之前」，兩條路徑都要鎖。
      // reduced motion 只是跳過組裝動畫，它一樣有 Loading 期間（等資產 +
      // 計數器跑到 100%），一樣不能讓使用者在那段時間滑走。
      // 解鎖時機也跟著各自的路徑走：一般路徑在推軌結束（benchLag + dollyDur）
      // 才解，reduced motion 在 300ms 交叉淡入的 onComplete 解。
      lockScroll();

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
      // 離開首頁時一定要解鎖：卸載時可能還停在 Loading（使用者在推軌播完前
      // 就點走），不解的話 Lenis 會一直是 stopped，下一頁完全捲不動。
      unlockScroll();
    };
  }, [lockScroll, unlockScroll]);

  return (
    // data-nav-bleed：滿版頁面標記。必須留在最外層元素上——globals.css 用
    // `.page-content:has(> [data-nav-bleed])` 選它（直接子層）。
    <div className="home-stage" data-nav-bleed ref={rootRef}>
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
          <span className="loading-pct" ref={pctRef}>
            %
          </span>
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
