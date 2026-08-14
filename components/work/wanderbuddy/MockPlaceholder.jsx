'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Mock up 2/3/4：目前用 §6.5 作品卡片同一個灰色佔位色（#D9D9D9），
// 之後照片到位再換成真圖，位置/比例先照 Figma 的框留著。
export default function MockPlaceholder({ ratio = '1220 / 812' }) {
  const ref = useStandardEntrance();

  return (
    <section className="wb-section">
      <div className="wb-section-inner" ref={ref}>
        <div className="wb-pending-block" style={{ aspectRatio: ratio, color: 'transparent' }} />
      </div>
    </section>
  );
}
