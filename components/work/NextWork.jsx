'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStandardEntrance } from '@/lib/useStandardEntrance';
import { getNextWorks } from '@/lib/getNextWorks';
import './next-work.css';

// 全站唯一一份 Next Work 區塊。
// Figma：Sui-Sui 545:558、MVS 806:1165、Blossom Care 806:1104
// （AERO V 那份 Figma 沒有這一區，以 545:558 為準）。
//
// 數值原本照抄 sui-sui/NextWork.jsx，只把 class 前綴從 ss- 換成 work-next-，
// 因為 ss- 那組樣式住在 sui-sui.css 裡，那支只有 SuiSuiPage 會載入；
// 直接 import 過來會是沒有樣式的裸標記。
// 挑選規則共用 lib/getNextWorks.js，同樣只有一份實作。
//
// 2026-09-01：sui-sui/NextWork.jsx 與 wanderbuddy/NextWork.jsx 已刪除，
// 五個作品頁全部改用這一支——
//   /work/sui-sui、/work/wanderbuddy      各自的 Page 直接 import
//   /work/aero-v                          AeroVPage 直接 import
//   /work/mvs、/work/blossom-care         經由 components/work/PhotoStack.jsx
// ⚠️ MVS 與 Blossom Care 的 Page 檔案裡「看不到」<NextWork>，是 PhotoStack
// 代為輸出的。要在那兩頁加 Next Work 之前先看 PhotoStack，不然會出現兩個。
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
              <NextWorkCover work={work} />
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

// 卡片封面。做法照抄 components/work-index/WorkCard.jsx 既有的那一套——
// 同一種卡、同一組素材（672×415 與 @2x 的 1344×830），沒有理由另立一套：
//   cover 為 null            → 完全不產生 <img>，只留 .work-next-card-cover
//                              自己的 #D9D9D9 灰底，比例由 aspect-ratio 鎖住
//   cover 有值但載入失敗      → onError 拿掉 img，一樣退回灰底，資料補齊
//                              過程中頁面不會破
//   srcSet 的 @2x            → 檔名規則固定（.webp → @2x.webp），直接推導，
//                              不必在 works.json 多存一個欄位
//
// ⚠️ alt="" 是刻意的，這裡跟 WorkCard.jsx 不同（那邊是 alt={work.title}）。
// 整張卡是一個 <Link>，緊接在圖後面的 <h3> 已經把標題唸出來了，圖再帶
// 一次標題會變成「Blossom Care Blossom Care Universal vaginal Ph test kit」。
// 封面在這裡是純裝飾，無障礙名稱由 h3 與 desc 提供，所以 alt 留空、
// 外框補 aria-hidden。（WorkCard 那邊也有同樣的重複問題，但那支是凍結
// 範圍外的既有頁面，這一輪不動它——已回報。）
function NextWorkCover({ work }) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(work.cover) && !failed;

  return (
    <div className="work-next-card-cover" aria-hidden="true">
      {showImg && (
        <img
          src={work.cover}
          srcSet={`${work.cover} 1x, ${work.cover.replace(/\.webp$/, '@2x.webp')} 2x`}
          alt=""
          width={672}
          height={415}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
