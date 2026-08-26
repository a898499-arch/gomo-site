import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';
import AeroVPage from '@/components/work/aero-v/AeroVPage';

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

  return (
    <div className="page-container" style={{ paddingBlock: '48px' }}>
      <p>作品詳情頁（空殼，內容之後做）— slug: {slug}</p>
    </div>
  );
}
