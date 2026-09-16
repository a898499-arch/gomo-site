'use client';

import { useEffect, useRef, useState } from 'react';
import './compare-slider.css';

// 前後對比推桿（共用元件）。
//
// ⚠️⚠️ 這裡的推桿邏輯與 components/work/goodmood/MakingAssets01.jsx 相同。
// 改動其中一邊時要評估另一邊。Goodmood 尚未遷移過去，原因是該頁已上線且
// 驗收過。（2026-09-15 建立，行為逐字照抄那一份，沒有重新設計手感。）
//
// ---------- 這個元件「管」什麼 ----------
//   兩層疊放 + clip-path 揭露、把手、range input 與它的無障礙標籤、
//   滑鼠經過模式（rAF 節流）、--cs-pos 這個位置變數。
//
// ---------- 「不管」什麼 ----------
//   圖說、文案、輪播，以及**版面幾何**。後者刻意不共用：Goodmood 的推桿是
//   1344 設計寬、圖框固定在 top:112/1344；eHMS 是 1088.485×639、兩支手機在
//   x=255/563。兩頁的幾何完全不同，共用只會變成一堆互相打架的覆寫。
//   內容用 before / after 兩個 prop 傳進來，外框尺寸由呼叫端的 className 給。
//
// ⚠️ --cs-pos 的語意是「分隔線距左緣的百分比」，不是「完成度」。
// 副作用：0% 時全部是 after、100% 時全部是 before，與直覺相反。
// 這是照抄 Goodmood 的刻意決定，不要「修正」成 100 - pos：
// 改了之後把手的移動方向會跟拉桿相反，而且 50% 時其中一個標籤會被整個切掉
// （Goodmood 那份的註解記錄了當時的實測）。
export default function CompareSlider({
  before,
  after,
  ariaLabel,
  className = '',
  initial = 50,
}) {
  const [pos, setPos] = useState(initial);
  const sliderRef = useRef(null);

  /* ---------- 滑鼠滑過去就跟著動，不用按住拖曳 ----------
     ⚠️ 只在 (hover: hover) and (pointer: fine) 啟用。觸控裝置沒有 hover，
     游標「經過」這件事不存在，維持原本的拖曳／點擊行為（那是 <input> 的
     原生能力，這個 effect 不掛就好，不需要另外寫）。

     ⚠️ rAF 節流：pointermove 只把座標記進 ref，實際換算與寫值都在 rAF 裡做，
     一幀最多一次。不要每個 move 事件都寫一次 style——那是 §8 的 60fps 硬規則。

     ⚠️ 直接呼叫 setPos，而不是「寫 input.value 再 dispatch input 事件」。
     兩者結果相同：<input> 是受控元件（value={pos}），改 state 就會同步更新它的
     value，clip-path 也照原本那條路徑走。反過來做的話，React 覆寫過 value 的
     setter，必須用 Object.getOwnPropertyDescriptor 取原生 setter 才推得動。

     滑鼠移出容器時什麼都不做——停在原地，不彈回 50%。
     鍵盤與螢幕閱讀器的行為完全不受影響，仍然由那個 <input type="range"> 提供。 */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let rafId = 0;
    let pendingX = null;

    const apply = () => {
      rafId = 0;
      if (pendingX === null) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const pct = Math.round(((pendingX - r.left) / r.width) * 100);
      setPos(Math.min(100, Math.max(0, pct)));
    };

    const onMove = (e) => {
      pendingX = e.clientX;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    /* ⚠️ 底色 / 邊框 / 圓角 / overflow 只掛在這一層（由呼叫端的 className 提供），
       兩層內部不再各畫一次，否則 clip 的切邊會出現兩條線。 */
    <div className={`cs ${className}`.trim()} ref={sliderRef} style={{ '--cs-pos': pos }}>
      {/* 下層：before（整張完整） */}
      <div className="cs-layer cs-layer--before">{before}</div>

      {/* 上層：after，用 clip-path 露出分隔線右側 */}
      <div className="cs-layer cs-layer--after">{after}</div>

      <div className="cs-handle" aria-hidden="true">
        <span className="cs-handle-bar" />
      </div>

      {/* ⚠️ aria-label 由呼叫端給，而且要用文字描述方向，不要只讓螢幕閱讀器
          播報一個容易誤解的數字：這個 <input> 的值是**分隔線位置**，不是
          「完成度百分比」，單念「80%」會被理解成反的。 */}
      <input
        className="cs-input"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={ariaLabel}
      />
    </div>
  );
}
