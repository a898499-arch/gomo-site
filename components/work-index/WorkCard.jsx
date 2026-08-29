'use client';

import Link from 'next/link';
import { useState } from 'react';

// 單張作品卡（規格書 §6.5「作品卡」）。整張卡是一個真實連結，
// 所以可以右鍵開新分頁（§6.5 驗收第 4 條）。
//
// 缺資料的處理：
// - cover 為 null（首圖還沒做好的作品）→ 完全不產生 <img>，只留
//   .work-card-cover 自己的 #D9D9D9 灰底，比例與有圖的卡片一致
//   （672/415 由 CSS 的 aspect-ratio 鎖住）。不用假圖硬填。
//   2026-08-29 依 Figma 806:1208 判定：my-place / blossom-care / mvs
//   在設計稿上就是平色佔位（實測標準差 0.98~3.15），所以是 null；
//   sui-sui / wanderbuddy / aero-v / ehms 是真實照片（51~74），已匯出。
// - cover 有值但載入失敗 → onError 把 img 拿掉，一樣退回灰底，
//   資料補齊過程中頁面不會破。
// - description 目前全是 "Project description coming soon."，照原樣顯示。
//   不隱藏——隱藏會讓每張卡高度不一致、破壞格線節奏，而且它本身是通順
//   句子，畫面不會破。
// - year 這一頁沒有用到（原型與 Figma 的卡片都沒有年份欄位）。
export default function WorkCard({ work }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = Boolean(work.cover) && !imgFailed;

  return (
    <Link
      href={`/work/${work.slug}`}
      className="work-card"
      data-slug={work.slug}
      data-group={(work.group || []).join(',')}
    >
      {/* 沒有圖時這塊是純裝飾的灰底佔位，對螢幕閱讀器隱藏；
          卡片的無障礙名稱由底下的標題提供。 */}
      <div className="work-card-cover" aria-hidden={showImg ? undefined : 'true'}>
        {showImg && (
          <img
            src={work.cover}
            // 主圖都出了 1x（672×415）與 @2x（1344×830）兩份，檔名規則固定，
            // 所以這裡直接推導，不必在 works.json 多存一個欄位。
            srcSet={`${work.cover} 1x, ${work.cover.replace(/\.webp$/, '@2x.webp')} 2x`}
            alt={work.title}
            width={672}
            height={415}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <h2 className="work-card-title">{work.title}</h2>
      <p className="work-card-desc">{work.description}</p>

      {(work.tags || []).length > 0 && (
        <ul className="work-card-tags">
          {work.tags.map((tag) => (
            <li key={tag} className="work-card-tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
