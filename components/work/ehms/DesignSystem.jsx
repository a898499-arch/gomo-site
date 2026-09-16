'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { DS_PAGES } from './DesignSystemPages';

// Design System 輪播（第三輪）。八頁，內容與 node id 見 DesignSystemPages.jsx。
//
// ⚠️ 混合式輪播：第 1、2 頁是程式碼，第 3–9 頁是切圖。三個必須守住的點：
//
// 1. 高度一致。八頁都填滿同一個 aspect-ratio 1088.485/639 的框
//    （.eh-ds-viewport）。每個 slide 都是 position:absolute + inset:0，
//    內容撐不撐得滿都不會影響外框，換頁時不會抽動。
//
// 2. 交叉淡入時兩層同時存在。八個 slide 「一直」都在 DOM 裡，靠 opacity
//    切換——不是切到才掛載。所以 600ms 期間舊頁與新頁是疊著淡的，不會閃。
//    ⚠️ visibility 的 transition-delay 是關鍵：opacity 走 600ms、visibility
//    延遲 600ms 才跳成 hidden，淡出的那一頁在整段過場中都還看得見。
//    只用 opacity:0 的話它雖然看不見卻仍在焦點序裡，所以要 visibility +
//    aria-hidden 一起處理。
//
// 3. 圖片只掛 current / next / prev 三張，不是八張。prev 是必要的——
//    淡出中的那一頁如果把 src 拿掉會立刻變空白，過場就破了。
//
// 自動播放 5000ms（與 Goodmood 的 HOLD_MS、首頁 §6.2 中央輪播同一組節奏）。
// 滑鼠移入暫停、移出恢復；鍵盤聚焦在輪播內時也暫停（正在讀的人不該被換頁）。
// ⚠️ 自動播放不呼叫任何 .focus()，不會搶走鍵盤焦點。
const HOLD_MS = 5000;

/* prefers-reduced-motion。
   ⚠️ 用 useSyncExternalStore 而不是「useEffect 裡 setState」：後者是在 effect
   裡同步改狀態，會觸發連鎖 render（eslint 的 react-hooks/set-state-in-effect
   會直接報 error）。matchMedia 本來就是「外部可變狀態」，這支 hook 就是為
   這種東西設計的，順便還拿到「使用者中途改系統設定就即時反應」。
   第三個參數是 SSR 快照——伺服器端沒有 window，一律回 false（不減少動態），
   到瀏覽器再以真實值接手。 */
const RM_QUERY = '(prefers-reduced-motion: reduce)';
const subscribeRM = (cb) => {
  const m = window.matchMedia(RM_QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getRM = () => window.matchMedia(RM_QUERY).matches;
const getRMServer = () => false;

function Chevron({ dir }) {
  // 灰圓底 + 白 chevron（Figma node 912:263 / 912:266，39×39）。
  // 用程式碼畫而不是切圖：需要 hover / focus / disabled 三種狀態，
  // 而且要能鍵盤操作，匯成圖做不到。
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export default function DesignSystem() {
  const total = DS_PAGES.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useSyncExternalStore(subscribeRM, getRM, getRMServer);

  const go = useCallback((n) => setIndex(((n % total) + total) % total), [total]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // 自動播放。reduced-motion 時不啟動（使用者指示）。
  useEffect(() => {
    if (reduce || paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), HOLD_MS);
    return () => clearInterval(id);
  }, [reduce, paused, total]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  // 只有這三張圖需要載入。prev 不能省，見檔頭第 3 點。
  const loadWindow = new Set([index, (index + 1) % total, (index - 1 + total) % total]);

  return (
    <div className="eh-ds">
      <h3 className="eh-green-label">Design System</h3>

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="eh-ds-viewport"
        data-reduce={reduce ? 'true' : undefined}
        role="group"
        aria-roledescription="carousel"
        aria-label="eHMS design system, 8 pages"
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
        }}
      >
        {DS_PAGES.map((page, i) => {
          const active = i === index;
          return (
            <div
              className="eh-ds-slide"
              key={page.id}
              data-active={active ? 'true' : undefined}
              aria-hidden={active ? undefined : 'true'}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}: ${page.title}`}
            >
              {page.kind === 'code' ? (
                <page.Render />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="eh-ds-shot"
                  src={loadWindow.has(i) ? `${page.src}.webp` : undefined}
                  srcSet={loadWindow.has(i) ? `${page.src}.webp 1x, ${page.src}@2x.webp 2x` : undefined}
                  width={1088}
                  height={639}
                  decoding="async"
                  alt={page.alt}
                />
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="eh-ds-nav eh-ds-nav--prev"
          onClick={prev}
          aria-label="Previous design system page"
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          className="eh-ds-nav eh-ds-nav--next"
          onClick={next}
          aria-label="Next design system page"
        >
          <Chevron dir="next" />
        </button>

        <p className="eh-ds-counter" aria-hidden="true">
          {index + 1} / {total}
        </p>
      </div>

      {/* 換頁時向螢幕閱讀器宣告目前頁數。aria-live 的內容刻意只有頁碼與標題，
          不含整頁內容——整頁內容由下面的 transcript 提供。 */}
      <p className="visually-hidden" aria-live="polite">
        Page {index + 1} of {total}: {DS_PAGES[index].title}
      </p>

      {/* 無障礙補償（CLAUDE.md）：六張切圖裡的文字（含全部中文 UI 標籤）
          螢幕閱讀器與搜尋引擎都讀不到，這裡補一份完整的純文字副本。
          ⚠️ 不放在 slide 裡面：slide 會隨換頁被 aria-hidden，放進去就等於
          只有當下那一頁讀得到。這一份八頁的內容永遠都在。 */}
      <div className="visually-hidden">
        <h4>Design system pages in full</h4>
        <ol>
          {DS_PAGES.filter((p) => p.transcript).map((p) => (
            <li key={p.id}>
              <strong>{p.title}.</strong> {p.transcript}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
