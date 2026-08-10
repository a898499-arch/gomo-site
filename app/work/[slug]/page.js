export default async function WorkDetailPage({ params }) {
  const { slug } = await params;

  return (
    <div className="page-container" style={{ paddingBlock: '48px' }}>
      <p>作品詳情頁（空殼，內容之後做）— slug: {slug}</p>
    </div>
  );
}
