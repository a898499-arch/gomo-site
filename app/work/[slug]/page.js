import WanderBuddyPage from '@/components/work/wanderbuddy/WanderBuddyPage';
import SuiSuiPage from '@/components/work/sui-sui/SuiSuiPage';

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;

  if (slug === 'wanderbuddy') {
    return <WanderBuddyPage />;
  }

  if (slug === 'sui-sui') {
    return <SuiSuiPage />;
  }

  return (
    <div className="page-container" style={{ paddingBlock: '48px' }}>
      <p>作品詳情頁（空殼，內容之後做）— slug: {slug}</p>
    </div>
  );
}
