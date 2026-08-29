'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

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
//
// ── hover 播放循環影片（動效規格 §3）──
// works.json 的 hoverVideo 有值的卡（目前是 sui-sui 與 wanderbuddy）會多疊
// 一層 <video>，hover 時播它們作品頁上那段動畫的錄影。
//
// ⚠️ 用 <video> 不用 iframe：這一頁不能再多兩個 requestAnimationFrame 迴圈
// （Sui-Sui 頁已經因為 iframe 造成捲動卡頓）。影片交給瀏覽器解碼，離開
// hover 就 pause，靜止時零成本。
//
// ⚠️ 影片檔還沒到位時的行為：preload="none" 代表在 hover 之前瀏覽器完全
// 不會去碰那個檔，所以檔案不存在也不會有任何請求或錯誤。第一次 hover 才
// 觸發載入；若 404，play() 會 reject 或 <video> 觸發 error，兩條路都會把
// videoBroken 設起來，之後那張卡就只顯示 poster、不再重試。也就是說：
// 影片檔進來之前，這兩張卡的表現跟其他卡完全一樣（只有主圖 scale 1.03）。
export default function WorkCard({ work }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [videoBroken, setVideoBroken] = useState(false);
  // 只有「真的播起來了」才淡入，否則檔案缺失時會淡進一片黑
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const showImg = Boolean(work.cover) && !imgFailed;
  const hasVideo = Boolean(work.hoverVideo) && !videoBroken;

  const onEnter = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // 動效規格 §7：reduced motion 下不播影片
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setVideoPlaying(true)).catch(() => setVideoBroken(true));
    } else {
      setVideoPlaying(true);
    }
  }, []);

  const onLeave = useCallback(() => {
    const v = videoRef.current;
    setVideoPlaying(false);
    if (!v) return;
    v.pause();
    // 規格：離開時回到第一幀，不要停在當下那格
    v.currentTime = 0;
  }, []);

  return (
    <Link
      href={`/work/${work.slug}`}
      className="work-card"
      data-slug={work.slug}
      data-group={(work.group || []).join(',')}
      onMouseEnter={hasVideo ? onEnter : undefined}
      onMouseLeave={hasVideo ? onLeave : undefined}
      onFocus={hasVideo ? onEnter : undefined}
      onBlur={hasVideo ? onLeave : undefined}
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

        {hasVideo && (
          // poster 就是同一張 cover，所以沒 hover 時影片層是全透明、下面
          // 露出的 <img> 與其他卡片一模一樣；播起來才 250ms 交叉淡入。
          // 這裡刻意不寫 poster 屬性——poster 由底下的 <img> 擔任，
          // 讓 preload="none" 真的一個位元組都不載。
          <video
            ref={videoRef}
            className="work-card-video"
            data-playing={videoPlaying ? 'true' : undefined}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            onError={() => setVideoBroken(true)}
          >
            <source src={`${work.hoverVideo}.webm`} type="video/webm" />
            <source src={`${work.hoverVideo}.mp4`} type="video/mp4" />
          </video>
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
