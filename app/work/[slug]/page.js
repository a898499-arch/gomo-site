import { notFound } from 'next/navigation';
import works from '@/data/works.json';
import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';
import AeroVPage from '@/components/work/aero-v/AeroVPage';
import GoodmoodPage from '@/components/work/goodmood/GoodmoodPage';
import MvsPage from '@/components/work/mvs/MvsPage';
import BlossomCarePage from '@/components/work/blossom-care/BlossomCarePage';
import EhmsPage from '@/components/work/ehms/EhmsPage';

// slug → 該作品的詳情頁元件。**這張表就是「哪些作品頁真的存在」的唯一來源。**
//
// ⚠️ 2026-09-03：這裡原本是一串 if，最後 return 一個中文的開發用空殼
// （「作品詳情頁（空殼，內容之後做）」）。那讓 /work/任何字串 都回 200，
// 包含 works.json 裡 7 筆還沒做的、以及根本不存在的 slug——對搜尋引擎是
// soft-404（會被收錄），對使用者是看到一句開發中的中文。整段刪掉，改成
// 查不到就 notFound()。
// ⚠️ export 出去給 app/sitemap.js 用（2026-09-03）。這張表回答的是「這個網址
// 開不開得起來」，**不是**「這個作品要不要公開」——後者由 works.json 的
// hidden 決定，兩個條件各管各的（2026-09-15 改，詳見 app/sitemap.js 的註解）。
// sitemap 兩個條件都要成立才收錄，所以這張表仍然是它的必要條件之一：
// 進得了 sitemap 的網址一定開得起來。
//
// 這也表示「頁面做到一半」是個表達得出來的狀態——加進這張表讓路由能開、
// works.json 維持 hidden:true 讓它不被收錄。eHMS 現在就是這個狀態。
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
  // ⚠️ 2026-09-15：eHMS 第一輪（骨架 + 文字 + 靜態圖 + 標準進場）。
  // Hero 視差、Before/After 推桿、Design System 輪播、五個狀態動畫還沒做。
  // 在這裡 = /work/ehms 回 200，可以直接開起來驗收；works.json 維持
  // hidden:true，所以作品分類頁、首頁 Gallery、Next Work 都不會連到它，
  // sitemap.xml 也不收。第二、三輪驗收後要做的三件事：
  //   1. works.json 的 ehms 改成 hidden:false + ready:true
  //      （改完 sitemap 自動收錄，這裡不用再動）
  //   2. 確認其他作品頁的 Next Work 會挑到 ehms
  //   3. 補上 07 Outcome 的「→ Read the manual」外連網址
  ehms: EhmsPage,
};

// ⚠️ 判斷依據是 PAGES 而不是 works.json：works.json 裡有 13 筆，但只有 6 筆
// 真的有詳情頁。其餘 7 筆都是 hidden + ready:false，畫面上連結不出來，
// 網址被猜到時應該回真正的 404，而不是一個空頁面。
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work || !PAGES[slug]) return {};

  // 每頁用自己的標題與副標。先前六頁共用根層的 metadata，搜尋結果會出現
  // 六筆一模一樣的「Maida Hu」＋同一句 description。
  const title = `${work.title} — Maida Hu`;
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
