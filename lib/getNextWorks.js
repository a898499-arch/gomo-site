import works from '@/data/works.json';

// Next Work 的挑選規則，原本各自寫在 sui-sui/NextWork.jsx 與
// wanderbuddy/NextWork.jsx 裡（兩份實作一字不差）。這裡抽成單一來源給新的
// components/work/NextWork.jsx 用，規則照抄、沒有任何改動：
//   排除當前作品本身，依 works.json 陣列順序取「當前作品之後的兩筆」，
//   走到最後一筆就繞回陣列開頭。不做同分類優先，保持簡單可預測。
//
// ⚠️ sui-sui 與 wanderbuddy 兩支元件裡各自還留著一份同樣的函式，這一輪沒有
// 去動它們（那兩頁已完成、且 CLAUDE.md 對 WanderBuddy 有「不要回頭改」的
// 規定）。要不要一併改成 import 這支由使用者決定——改動只有刪掉函式加一行
// import，不動 markup 也不動 CSS。已回報。
export function getNextWorks(currentSlug, count = 2) {
  const currentIndex = works.findIndex((w) => w.slug === currentSlug);
  if (currentIndex === -1) return works.slice(0, count);

  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push(works[(currentIndex + i) % works.length]);
  }
  return result;
}
