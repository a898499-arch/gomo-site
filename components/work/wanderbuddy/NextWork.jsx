'use client';

import Link from 'next/link';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import works from '@/data/works.json';

// 規則：排除當前作品本身，依 works.json 陣列順序取「當前作品之後的兩筆」，
// 走到最後一筆就繞回陣列開頭。不做同分類優先，保持簡單可預測。
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
  const ref = useStandardEntrance('.wb-next-card');
  const nextWorks = getNextWorks(currentSlug);

  return (
    <section className="wb-section">
      <div className="wb-section-inner">
        <h2 className="wb-next-title">More Project</h2>
        <div className="wb-next-grid" ref={ref}>
          {nextWorks.map((work) => (
            <Link
              className="wb-next-card"
              href={`/work/${work.slug}`}
              key={work.slug}
            >
              <div className="wb-next-card-cover" />
              <h3 className="wb-next-card-title">{work.title}</h3>
              <p className="wb-next-card-desc">{work.description}</p>
              <ul className="wb-next-card-tags">
                {work.tags.map((tag) => (
                  <li className="wb-next-card-tag" key={tag}>{tag}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
