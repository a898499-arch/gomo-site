'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// 單張作品卡（規格書 §6.5「作品卡」）。整張卡是一個真實連結，
// 所以可以右鍵開新分頁（§6.5 驗收第 4 條）。
//
// 缺資料的處理：
// - cover 為 null（首圖還沒做好的作品）→ 完全不產生 <img>，只留
//   .work-card-cover 自己的 #D9D9D9 灰底，比例與有圖的卡片一致
//   （672/415 由 CSS 的 aspect-ratio 鎖住）。不用假圖硬填。
//   2026-08-29 使用者補了 hover 素材之後，只剩 my-place 還是 null；
//   blossom-care 與 mvs 的主圖改用各自 hoverImages 的第 1 張（灰塊拿掉），
//   aero-v 同理改用 aero-v-1——規格要求「沒 hover 時顯示 photo_1」。
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
// ── hover 快速輪播照片（動效規格 §2）──
// works.json 的 hoverImages 有值的卡（aero-v / blossom-care / mvs）在 hover
// 時把該作品的 3 張照片輪播一遍。每張停留 500ms、交叉淡入 250ms、循環。
//
// ⚠️ hoverImages[0] **就是** cover（works.json 已經對齊），所以沒 hover 時
// 看到的就是第一張，hover 只是接著往下播——不會有「hover 才冒出照片」的
// 突兀感。離開時把疊層淡掉 300ms，底下露出的 <img> 正好就是第一張。
//
// ⚠️ 為什麼要兩層疊圖而不是一個 <img> 換 src：換 src 是硬切，做不出交叉
// 淡入；而「A 淡出 + B 淡入」中途兩張都半透明，合成後只覆蓋 75%，會透出
// 底色閃一下。這裡的做法是「底下的 cover 永遠不動，新的那張從 0 疊上去
// 淡入」，全程不透光——跟 aero-v 的 PhotoCycler 同一個原理。
//
// ⚠️ 兩層輪流用（slot % 2）：連續兩張都用同一層的話，第二次換 src 會把
// 還看得見的那張直接抽掉。輪流才能讓舊的留在下面當底、新的疊上去淡入。
//
// ⚠️ 影片檔還沒到位時的行為：preload="none" 代表在 hover 之前瀏覽器完全
// 不會去碰那個檔，所以檔案不存在也不會有任何請求或錯誤。第一次 hover 才
// 觸發載入；若 404，play() 會 reject 或 <video> 觸發 error，兩條路都會把
// videoBroken 設起來，之後那張卡就只顯示 poster、不再重試。也就是說：
// 影片檔進來之前，這兩張卡的表現跟其他卡完全一樣（只有主圖 scale 1.03）。

// 停留 500ms + 交叉淡入 250ms（動效規格 §2）。離開時淡回主圖 300ms。
const HOLD_MS = 500;
const FADE_MS = 250;
const LEAVE_FADE_MS = 300;

export default function WorkCard({ work }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [videoBroken, setVideoBroken] = useState(false);
  // 只有「真的播起來了」才淡入，否則檔案缺失時會淡進一片黑
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const layerA = useRef(null);
  const layerB = useRef(null);

  // ready:false = 作品詳情頁還沒做好。<a> 與 href 都保留（結構正確、可右鍵
  // 複製網址、可開新分頁），只擋左鍵跳轉；cursor 也維持 pointer，不要用
  // not-allowed——那看起來像壞掉，實際上只是還沒開放。
  const ready = work.ready !== false;

  const showImg = Boolean(work.cover) && !imgFailed;
  const hasVideo = Boolean(work.hoverVideo) && !videoBroken;
  // 影片與輪播互斥：有影片的卡不做輪播
  const photos = !hasVideo && Array.isArray(work.hoverImages) ? work.hoverImages : null;
  const hasPhotos = Boolean(photos && photos.length > 1);

  const onEnter = useCallback(() => {
    setHovering(true);
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
    setHovering(false);
    const v = videoRef.current;
    setVideoPlaying(false);
    if (!v) return;
    v.pause();
    // 規格：離開時回到第一幀，不要停在當下那格
    v.currentTime = 0;
  }, []);

  // ---------- 輪播 ----------
  useEffect(() => {
    const layers = [layerA.current, layerB.current];
    if (!hasPhotos || !layers[0] || !layers[1]) return undefined;

    if (!hovering) {
      // 離開：立刻停、300ms 淡回主圖（＝photos[0]，就在這兩層底下）
      layers.forEach((el) => {
        el.style.transition = `opacity ${LEAVE_FADE_MS}ms linear`;
        el.style.opacity = '0';
      });
      return undefined;
    }

    // 動效規格 §7：reduced motion 不輪播
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cancelled = false;
    let slot = 0; // 這次要用哪一層（輪流）
    let cur = 0; // 目前顯示 photos 的第幾張
    let timer = null;
    let raf = null;

    const step = () => {
      if (cancelled) return;
      cur = (cur + 1) % photos.length;
      const el = layers[slot % 2];
      // 先歸零並換圖，且疊到最上面
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.zIndex = String(10 + slot);
      el.src = photos[cur];
      el.srcset = `${photos[cur]} 1x, ${photos[cur].replace(/\.webp$/, '@2x.webp')} 2x`;
      // 隔兩幀再淡入：同一幀內設 opacity 不會觸發 transition
      raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          el.style.transition = `opacity ${FADE_MS}ms linear`;
          el.style.opacity = '1';
        })
      );
      slot += 1;
      timer = setTimeout(step, HOLD_MS + FADE_MS);
    };

    timer = setTimeout(step, HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hovering, hasPhotos, photos]);

  return (
    <Link
      href={`/work/${work.slug}`}
      className="work-card"
      data-slug={work.slug}
      data-group={(work.group || []).join(',')}
      onClick={ready ? undefined : (e) => e.preventDefault()}
      aria-disabled={ready ? undefined : 'true'}
      data-ready={ready ? undefined : 'false'}
      onMouseEnter={hasVideo || hasPhotos ? onEnter : undefined}
      onMouseLeave={hasVideo || hasPhotos ? onLeave : undefined}
      onFocus={hasVideo || hasPhotos ? onEnter : undefined}
      onBlur={hasVideo || hasPhotos ? onLeave : undefined}
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

        {hasPhotos && (
          // 兩層疊圖，預設沒有 src——第一次 hover 才會發出請求，
          // 首屏完全不預載 hover 素材。
          <>
            <img ref={layerA} className="work-card-photo" alt="" aria-hidden="true" />
            <img ref={layerB} className="work-card-photo" alt="" aria-hidden="true" />
          </>
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
