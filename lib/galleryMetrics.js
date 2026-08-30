// §6.3 Gallery 的卡片高度計算與落點錨點。
//
// 從 prototypes/home.html 的 1711–1731 行「原樣搬過來」。原型把這兩個函式
// hoist 到 §6.2 的 IIFE 之前，是因為有三個地方要用：
//   Gallery 自己（measureCycle 之前要先定卡片高度）
//   「捲到下一區塊」箭頭按鈕（getNextSectionAnchors 的第 4 個錨點）
//   區塊邊界的吸附「煞車」（同一組錨點）
// Next 這邊那三者是三個檔案，所以提到 lib/ 當共用模組——這是框架適配，
// 函式本體與註解一字未改。
//
// ⚠️ 兩個函式都是冪等的，任何時候呼叫都安全（原型註解原話）。

/* Gallery card height (§6.3 十, 2026-08-09): fit "title block + one row of cards" into exactly
   100vh so landing at the top of the section (via the scroll-to-next-section button or the
   boundary snap, both below) shows a complete row, not cards cut off at the bottom edge. Falls
   back to a fixed 70vh — and shifts the landing anchor past the title — if the fitted height would
   go below 55vh (too squashed to read as a work-showcase card). Desktop only (>900px); tablet/
   mobile keep their own fixed-vw card width (§6.3 RWD), unrelated to this. Hoisted (not inside the
   Gallery IIFE) so the button/snap code below can also call it — idempotent, safe to call anytime. */
export function computeGalleryCardMetrics() {
  if (window.innerWidth <= 900) return { usedFallback: false, titleBlockH: 0 };
  const galleryOuter = document.getElementById('gallery');
  const galleryViewport = document.getElementById('gallery-viewport');
  // Next 是 SPA，Gallery 不一定掛載（例如在 /about）。原型是單頁，這兩個節點
  // 永遠存在，所以沒有這個判斷；不加的話換頁後按鈕呼叫它會丟 null 例外。
  if (!galleryOuter || !galleryViewport) return { usedFallback: false, titleBlockH: 0 };
  const titleBlockH = galleryViewport.getBoundingClientRect().top - galleryOuter.getBoundingClientRect().top;
  const fitH = window.innerHeight - titleBlockH;
  const MIN_VH = 0.55, FALLBACK_VH = 0.70;
  const usedFallback = fitH < window.innerHeight * MIN_VH;
  const cardH = usedFallback ? window.innerHeight * FALLBACK_VH : fitH;
  document.documentElement.style.setProperty('--gallery-card-h', cardH.toFixed(2) + 'px');
  return { cardH: cardH, titleBlockH: titleBlockH, usedFallback: usedFallback };
}

/* Gallery's landing anchor for both the next-section button and the boundary snap: the fallback
   path skips past the title block entirely (§6.3 十 fallback: "箭頭的落點往下偏移，讓標題部分捲出畫面"),
   landing where the (now fully visible) card row itself begins. */
export function getGalleryAnchorY() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return 0; // 同上：Gallery 沒掛載時不要炸
  const outerTop = gallery.offsetTop;
  const m = computeGalleryCardMetrics();
  return m.usedFallback ? outerTop + m.titleBlockH : outerTop;
}
