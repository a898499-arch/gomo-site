'use client';

import Link from 'next/link';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { getNextWorks } from '@/lib/getNextWorks';

// node 545:558。挑選規則抽在 lib/getNextWorks.js（原本這裡與 WanderBuddy
// 各有一份一字不差的實作，2026-08-29 收斂成單一來源）：排除當前作品本身，
// 依 works.json 陣列順序取「當前作品之後的兩筆」，走到最後一筆就繞回開頭。
// ⚠️ 這一輪只動這個函式，markup 與 CSS 完全沒碰，輸出與改動前相同。

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
