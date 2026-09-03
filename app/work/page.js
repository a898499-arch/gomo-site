import works from '@/data/works.json';
import WorkIndex from '@/components/work-index/WorkIndex';

// 作品分類頁（規格書 §6.5）。資料一律來自 data/works.json，不另外寫死清單
// ——沿用 NextWork.jsx 既有的讀法。
//
// 導覽列用預設行為（startHidden:false），不呼叫 useNavBehavior，最外層也
// 「不要」加 data-nav-bleed：這一頁沒有滿版 Hero，需要 .page-content 幫固定
// 導覽列預留的那 126px（= 116 + --nav-top-gap），簡介區的 padding-top 75px 就是
// 從這個前提算出來的（126 + 75 = 201，對上 Figma node 3:281 的實測值）。
// ⚠️ description 是英文，理由同 app/about/page.js。
export const metadata = {
  title: 'Works — GOMO',
  description:
    'Selected work by Maida Hu — product design, app and UI/UX design, and self-initiated projects.',
};

// ⚠️ 從這裡就把 hidden 濾掉，不是在 WorkIndex 裡濾。
// WorkIndex 的整套篩選是建立在「所有卡片一次全渲染、之後只切 hidden 屬性」
// 這個前提上（GSAP Flip 需要切換前後是同一個 DOM 節點），所以「這一版要不要
// 出現在頁面上」必須在資料進到元件之前就決定好，不能跟 filter 混在一起。
//
// hidden: true 的作品是使用者 2026-08-29 依 Figma 806:1208 改版拿掉的，
// 標記而不刪除——之後可能加回來。目前有 6 筆：dh2 / color-lab / cool-cook /
// co2-exting / trace-of-conversation / conversation。
export default function WorkPage() {
  const visible = works.filter((w) => !w.hidden);
  return <WorkIndex works={visible} />;
}
