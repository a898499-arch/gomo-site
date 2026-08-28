'use client';

import Link from 'next/link';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { getNextWorks } from '@/lib/getNextWorks';
import './next-work.css';

// 「照片依序排列」型作品頁的 Next Work 區塊（Figma：MVS 806:1165、
// Blossom Care 806:1104）。
//
// 標記與樣式**照抄** sui-sui/NextWork.jsx，只把 class 前綴從 ss- 換成
// work-next-，因為 ss- 那組樣式住在 sui-sui.css 裡，那支只有 SuiSuiPage
// 會載入；直接 import 過來會是沒有樣式的裸標記。挑選規則則是抽到
// lib/getNextWorks.js 共用，沒有再寫第三份。
//
// ⚠️ sui-sui 與 wanderbuddy 兩頁維持原狀沒有改，理由見 lib/getNextWorks.js
// 的註解。要把那兩頁也收斂到這支元件的話是另一個決定，已回報。
export default function NextWork({ currentSlug }) {
  const ref = useStandardEntrance('.work-next-card');
  const nextWorks = getNextWorks(currentSlug);

  return (
    <section className="work-next">
      <div className="page-container">
        <h2 className="work-next-title">More Project</h2>
        <div className="work-next-grid" ref={ref}>
          {nextWorks.map((work) => (
            <Link className="work-next-card" href={`/work/${work.slug}`} key={work.slug}>
              <div className="work-next-card-cover" />
              <h3 className="work-next-card-title">{work.title}</h3>
              <p className="work-next-card-desc">{work.description}</p>
              <ul className="work-next-card-tags">
                {work.tags.map((tag) => (
                  <li className="work-next-card-tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
