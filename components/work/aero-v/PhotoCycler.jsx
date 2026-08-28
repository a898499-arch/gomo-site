'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { mainEase } from '@/lib/ease';

// 照片輪播的單格。From Sketch to Working Prototype（node 796:888）底下的
// 三格各用一個，只差 phase。抽成獨立元件是因為三格邏輯完全相同。
//
// 節奏（使用者 2026-08-28 指定，選項「甲」）：
//   靜止 4.0s + 交叉淡入 0.6s = 一段 4.6s
// 600ms 交叉淡入與規格書 §6.2 影片輪播同值（規格書 573 行），全站一致。
// ⚠️ 但 §6.2 的停留是 **5 秒**，這裡的 4 秒是使用者這一輪指定的偏離值，
// 不是照抄規格書，也不是誤讀。
// 淡入的緩動 §6.2 沒有規定 —— 用全站主曲線 mainEase 是我的假設。
//
// ── 為什麼是「疊著淡入」而不是「A 淡出 + B 淡入」 ──
// 後者中途兩張都半透明，合成後只覆蓋 75%，會透出底色閃一下。這裡讓舊的
// 那層維持 opacity 1 不動，新的那層從 0 疊上去淡入，全程不透光。
// 規格書 §6.2 的原文就是「兩個 <video> **疊著**淡入」，同一個做法。
//
// ── 為什麼不用 repeat:-1 的循環 timeline ──
// 三張照片配兩層，要 6 段才會回到初始狀態，週期 27.6s 的 timeline 理論上
// 接得起來；但 GSAP 在 repeat 邊界會把 timeline 倒帶重演，倒帶時可能把剛
// 淡入完的那層 opacity 打回 0，造成一次閃爍。改成「每段一個一次性 timeline、
// onComplete 時排下一段」：沒有倒帶、沒有 repeat 語意，行為完全可預期，
// pause()/play() 也原地保留播放頭。每 4.6s 建一個 timeline 的成本可忽略。
//
// ── 只動 opacity ──
// 兩層都是 absolute + inset:0，換 src 不影響版面。角色互換時要動的
// opacity=0／z-index／src 三件事，全部發生在「當下看不見」的那一層。
//
// ── 無障礙 ──
// 兩層 <img> 都是 alt="" + aria-hidden：輪播中途換 alt 螢幕閱讀器不會重讀，
// 硬做成 live region 又會變成噪音。改用 CLAUDE.md 既有的補償做法——由呼叫端
// 附一份 .visually-hidden 的完整文字，把三張照片的內容都寫進去。
// ⚠️ phase 的方向：phase 是「把播放頭直接種在第幾秒」，所以 **phase 越大代表
// 越前面、會越早換第一張**。要讓版面上由左到右依序換，最左邊那格要給最大的
// phase。呼叫端負責換算（見 SketchToPrototype.jsx），這裡不做假設。
export default function PhotoCycler({
  photos,
  phase = 0,
  playing = true,
  className = '',
}) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const tlRef = useRef(null);
  const playingRef = useRef(playing);

  // playing 只控制播放/暫停，不該重建整個輪播，所以跟主 effect 分開。
  playingRef.current = playing;

  useEffect(() => {
    const layers = [aRef.current, bRef.current];
    if (!layers[0] || !layers[1] || photos.length < 2) return undefined;

    // reduced-motion：不建 timeline、後層永遠不掛 src，只留第一張。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const HOLD = 4;
    const FADE = 0.6;
    const WARM = 0.3; // 淡入前多久掛 will-change
    const n = photos.length;

    let cancelled = false;
    let front = 0; // layers 裡目前看得見的那一層
    let cur = 0; // photos 裡目前顯示的那一張

    // 提早約 4 秒掛上 src 並 decode()，淡入時位圖已經在解碼快取裡，不會卡。
    function preload(el, i) {
      const p = photos[i];
      el.src = p.src;
      if (p.srcSet) el.srcSet = p.srcSet;
      el.decode?.().catch(() => {});
    }

    preload(layers[1], 1);
    gsap.set(layers[0], { opacity: 1, zIndex: 1 });
    gsap.set(layers[1], { opacity: 0, zIndex: 2 });

    function scheduleStep(seek = 0) {
      if (cancelled) return;
      const incoming = layers[1 - front];

      const tl = gsap.timeline({ paused: true });

      // 趁還全透明時就讓 Chrome 把圖層 promote + raster 起來，
      // 這樣 raster 落在淡入之前，淡入期間才會是純 composite。
      // 硬規則：will-change 只在動畫期間掛著，onComplete 立刻移除。
      tl.call(() => { incoming.style.willChange = 'opacity'; }, null, HOLD - WARM);

      tl.to(incoming, {
        opacity: 1,
        duration: FADE,
        ease: mainEase,
        onComplete: () => {
          const outgoing = layers[front];
          incoming.style.willChange = '';
          // 以下四件事都作用在「已經看不見」的 outgoing 上，畫面不會有變化
          outgoing.style.opacity = '0';
          incoming.style.zIndex = '1';
          outgoing.style.zIndex = '2';
          front = 1 - front;
          cur = (cur + 1) % n;
          preload(outgoing, (cur + 1) % n);
          scheduleStep();
        },
      }, HOLD);

      tlRef.current = tl;
      // 錯開：只有第一段帶 seek，把播放頭直接種在 phase 秒。
      // phase 最大 2.667 < HOLD − WARM = 3.7，所以這個 seek 不會跨過上面
      // 那個 call()，也不會跨過 tween，沒有任何 callback 被略過的問題。
      if (seek) tl.time(seek);
      if (playingRef.current) tl.play();
    }

    scheduleStep(phase);

    return () => {
      cancelled = true;
      tlRef.current?.kill();
      tlRef.current = null;
      layers.forEach((el) => { if (el) el.style.willChange = ''; });
    };
  }, [photos, phase]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (playing) tl.play();
    else tl.pause();
  }, [playing]);

  return (
    <div className={`av-cycler ${className}`.trim()}>
      {/* A 層帶著第一張的 src 進 SSR HTML：沒開 JS 也看得到第一張，
          而且不會有 hydration mismatch（B 層的 src 是 effect 裡用 ref 掛的）。 */}
      <img
        ref={aRef}
        className="av-cycler-layer"
        src={photos[0].src}
        srcSet={photos[0].srcSet}
        width={photos[0].width}
        height={photos[0].height}
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
      />
      <img
        ref={bRef}
        className="av-cycler-layer"
        width={photos[0].width}
        height={photos[0].height}
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
