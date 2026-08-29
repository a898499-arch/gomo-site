import works from '@/data/works.json';

// Next Work 的挑選規則——全站唯一一份實作。
//   排除當前作品本身，依 works.json 陣列順序取「當前作品之後的兩筆」，
//   走到最後一筆就繞回陣列開頭。不做同分類優先，保持簡單可預測。
//
// ⚠️ 只從「hidden !== true 且 ready !== false」的作品裡挑。
// ready:false 是「作品頁還沒做好」，指過去會落到空殼頁；hidden 是「這一版
// 不顯示在作品分類頁上」。兩者都要排除，理由相同：不要把使用者送到死路。
//
// 原本吃的是完整陣列，
// 所以 Next Work 會挑到「作品分類頁上根本看不到」的作品——實測當時
// /work/mvs 指到 eHMS 與 DH2、/work/blossom-care 指到 eHMS，而那兩件都是
// hidden。使用者點進去會落到還沒做好的頁面。
// 這個過濾要放在這裡而不是各呼叫端：三頁共用這支，放這裡才只有一個真實來源。
//
// 沿革：這段原本在 sui-sui/NextWork.jsx 與 wanderbuddy/NextWork.jsx 各有一份
// 一字不差的複製，2026-08-29 依使用者指示收斂成單一來源（三份一樣的邏輯是
// 維護陷阱，改規則會漏改）。收斂只動函式，兩頁的 markup 與 CSS 完全沒碰，
// 改動前後輸出的作品經逐頁比對相同。
//
// ⚠️ 以後要改規則就改這裡，不要再往個別頁面複製。
export function getNextWorks(currentSlug, count = 2) {
  const visible = works.filter((w) => !w.hidden && w.ready !== false);
  if (!visible.length) return [];

  const currentIndex = visible.findIndex((w) => w.slug === currentSlug);
  // 找不到當前作品時（例如當前這件自己就是 hidden，或 slug 打錯）
  // 就從頭給前 count 筆，不要回傳空的。
  if (currentIndex === -1) return visible.slice(0, count);

  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push(visible[(currentIndex + i) % visible.length]);
  }
  return result;
}
