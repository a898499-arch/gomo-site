'use client';

import Link from 'next/link';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { getNextWorks } from '@/lib/getNextWorks';

// 挑選規則抽在 lib/getNextWorks.js（原本這裡與 Sui-Sui 各有一份一字不差的
// 實作，2026-08-29 收斂成單一來源）：排除當前作品本身，依 works.json 陣列
// 順序取「當前作品之後的兩筆」，走到最後一筆就繞回開頭。不做同分類優先，
// 保持簡單可預測。
// ⚠️ 這一輪只動這個函式，markup 與 CSS 完全沒碰，輸出與改動前相同。

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
