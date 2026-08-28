import works from '@/data/works.json';

// Next Work 的挑選規則——全站唯一一份實作。
//   排除當前作品本身，依 works.json 陣列順序取「當前作品之後的兩筆」，
//   走到最後一筆就繞回陣列開頭。不做同分類優先，保持簡單可預測。
//
// 沿革：這段原本在 sui-sui/NextWork.jsx 與 wanderbuddy/NextWork.jsx 各有一份
// 一字不差的複製，2026-08-29 依使用者指示收斂成單一來源（三份一樣的邏輯是
// 維護陷阱，改規則會漏改）。收斂只動函式，兩頁的 markup 與 CSS 完全沒碰，
// 改動前後輸出的作品經逐頁比對相同。
//
// ⚠️ 以後要改規則就改這裡，不要再往個別頁面複製。
export function getNextWorks(currentSlug, count = 2) {
  const currentIndex = works.findIndex((w) => w.slug === currentSlug);
  if (currentIndex === -1) return works.slice(0, count);

  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push(works[(currentIndex + i) % works.length]);
  }
  return result;
}
