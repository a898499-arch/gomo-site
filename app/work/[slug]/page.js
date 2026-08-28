import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';
import AeroVPage from '@/components/work/aero-v/AeroVPage';
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
