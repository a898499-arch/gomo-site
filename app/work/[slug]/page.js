import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';
import AeroVPage from '@/components/work/aero-v/AeroVPage';
import GoodmoodPage from '@/components/work/goodmood/GoodmoodPage';
import MvsPage from '@/components/work/mvs/MvsPage';
import BlossomCarePage from '@/components/work/blossom-care/BlossomCarePage';

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;

  if (slug === 'wanderbuddy') {
    return <WanderBuddyPage />;
  }

  if (slug === 'sui-sui') {
    return <SuiSuiPage />;
  }

  if (slug === 'aero-v') {
    return <AeroVPage />;
  }

  // Goodmood——這個網站本身的 case study。
  // works.json 那一筆已於 2026-09-02 由使用者改成 slug:"goodmood"、ready:true，
  // 所以作品分類頁、首頁 Gallery 與 Next Work 輪替池都已經接上。
  // cover / hoverImages 仍是 null（預覽圖還沒切），卡片先出灰底佔位——那是
  // WorkCard / Gallery 既有的缺圖處理，不是漏做。
  if (slug === 'goodmood') {
    return <GoodmoodPage />;
  }

  // MVS 與 Blossom Care 是「照片依序排列」型，兩頁共用 PhotoStack，
  // 各自的元件裡只有圖片清單與 alt。
  if (slug === 'mvs') {
    return <MvsPage />;
  }

  if (slug === 'blossom-care') {
    return <BlossomCarePage />;
  }

  return (
    <div className="page-container" style={{ paddingBlock: '48px' }}>
      <p>作品詳情頁（空殼，內容之後做）— slug: {slug}</p>
    </div>
  );
}
