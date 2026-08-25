import works from '@/data/works.json';
import WorkIndex from '@/components/work-index/WorkIndex';

// 作品分類頁（規格書 §6.5）。資料一律來自 data/works.json，不另外寫死清單
// ——沿用 NextWork.jsx 既有的讀法。
//
// 導覽列用預設行為（startHidden:false / fullBleedTop:false），不呼叫
// useNavBehavior：這一頁沒有滿版 Hero，需要 .page-content 幫固定導覽列
// 預留的那 126px（= 116 + --nav-top-gap），簡介區的 padding-top 75px 就是
// 從這個前提算出來的（126 + 75 = 201，對上 Figma node 3:281 的實測值）。
export const metadata = {
  title: 'Works — GOMO',
  description: 'Maida Hu 的作品列表',
};

export default function WorkPage() {
  return <WorkIndex works={works} />;
}
