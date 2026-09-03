import { notFound } from 'next/navigation';
import works from '@/data/works.json';
import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';
import AeroVPage from '@/components/work/aero-v/AeroVPage';
import GoodmoodPage from '@/components/work/goodmood/GoodmoodPage';
import MvsPage from '@/components/work/mvs/MvsPage';
import BlossomCarePage from '@/components/work/blossom-care/BlossomCarePage';

// slug → 該作品的詳情頁元件。**這張表就是「哪些作品頁真的存在」的唯一來源。**
//
// ⚠️ 2026-09-03：這裡原本是一串 if，最後 return 一個中文的開發用空殼
// （「作品詳情頁（空殼，內容之後做）」）。那讓 /work/任何字串 都回 200，
// 包含 works.json 裡 7 筆還沒做的、以及根本不存在的 slug——對搜尋引擎是
// soft-404（會被收錄），對使用者是看到一句開發中的中文。整段刪掉，改成
// 查不到就 notFound()。
// ⚠️ export 出去給 app/sitemap.js 用（2026-09-03）。sitemap 需要「哪些作品頁
// 真的存在」的清單，而那個答案就是這張表的 keys。**不要**讓 sitemap 改去用
// works.json 的 ready/hidden 條件重新篩一次——那等於有了第二份「哪些頁存在」
// 的定義，兩邊遲早走鐘：某天有人只改了 works.json 卻忘了加進這張表，
// sitemap 就會把一個會 404 的網址送給 Google，而且不會有任何錯誤訊息。
// 同一份 keys 同時決定「這個網址回不回 404」與「這個網址進不進 sitemap」，
// 結構上就不可能不一致。
export const PAGES = {
  wanderbuddy: WanderBuddyPage,
  'sui-sui': SuiSuiPage,
  'aero-v': AeroVPage,
  // Goodmood——這個網站本身的 case study。
  goodmood: GoodmoodPage,
  // MVS 與 Blossom Care 是「照片依序排列」型，兩頁共用 PhotoStack，
  // 各自的元件裡只有圖片清單與 alt。
  mvs: MvsPage,
  'blossom-care': BlossomCarePage,
};

// ⚠️ 判斷依據是 PAGES 而不是 works.json：works.json 裡有 13 筆，但只有 6 筆
// 真的有詳情頁。其餘 7 筆都是 hidden + ready:false，畫面上連結不出來，
// 網址被猜到時應該回真正的 404，而不是一個空頁面。
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work || !PAGES[slug]) return {};

  // 每頁用自己的標題與副標。先前六頁共用根層的 metadata，搜尋結果會出現
  // 六筆一模一樣的「GOMO — Maida Hu」＋同一句 description。
  const title = `${work.title} — GOMO`;
  const description = work.description;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;
  const Page = PAGES[slug];
  if (!Page) notFound();
  return <Page />;
}
