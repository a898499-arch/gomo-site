'use client';

import Link from 'next/link';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import works from '@/data/works.json';

// node 545:558。跟 WanderBuddy 的 Next Work 邏輯完全一樣：排除當前作品
// 本身，依 works.json 陣列順序取「當前作品之後的兩筆」，走到最後一筆就
// 繞回陣列開頭。
function getNextWorks(currentSlug, count = 2) {
  const currentIndex = works.findIndex((w) => w.slug === currentSlug);
  if (currentIndex === -1) return works.slice(0, count);

  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push(works[(currentIndex + i) % works.length]);
  }
  return result;
}

export default function NextWork({ currentSlug }) {
  const ref = useStandardEntrance('.ss-next-card');
  const nextWorks = getNextWorks(currentSlug);

  return (
    <section className="ss-section">
      <div className="ss-section-inner">
        <h2 className="ss-next-title">More Project</h2>
        <div className="ss-next-grid" ref={ref}>
          {nextWorks.map((work) => (
            <Link className="ss-next-card" href={`/work/${work.slug}`} key={work.slug}>
              <div className="ss-next-card-cover" />
              <h3 className="ss-next-card-title">{work.title}</h3>
              <p className="ss-next-card-desc">{work.description}</p>
              <ul className="ss-next-card-tags">
                {work.tags.map((tag) => (
                  <li className="ss-next-card-tag" key={tag}>{tag}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
