'use client';

import { useEffect, useRef, useState } from 'react';
import useInViewPause from './useInViewPause';

// Goodmood 頁「Where AI Fell Short」（Figma node 3337:3228，x=46.5 y=8174，1347×1762）。
//
// 幾何（相對區塊頂，全部取自 get_metadata）：
//   第一組 3395:3486  y=0     1347.5×992
//     標題群 3245:2835  y=0    h=337   kicker h41 → gap 10 → 3245:2837 y=51
//       3245:2837      h=286  副標 h41 → gap 5 → 正文 y=46 h=240
//     卡片   3395:3484  y=337  1347.5×623   （標題群底 337 → 卡片頂 337，gap 0）
//       四支影片 y=73（＝1px 邊框 + 72 上內距）、x 30 / 367 / 704 / 1041
//       寬 281 / 281 / 281 / 280，間距 56，橫向合計 1291
//     Fig 6  3337:3219  y=970  （卡片底 960 → 圖說頂 970，gap 10）
//   第二組 3395:3487  y=1051  1347×721
//     卡片   3336:3212  y=0    1347×689
//       影片 3336:3213  993×619，距卡片上緣 35，水平置中偏右 2px
//     Fig 7  3337:3225  y=699  （卡片底 689 → 圖說頂 699，gap 10）
//
// ⚠️ Figma 的正文 3245:2839 最後有一個 zero-width space 的空段落，**不渲染**
// （使用者 2026-09-03 指示）。因此我們的標題群會比 Figma 的 337 矮一行，
// 底下的卡片跟著上移——這是預期中的差異，不是版面錯位。
//
// ⚠️ 兩張卡片用的是共用的 .gm-panel（#FAFAFA / 1px #D9D9D9 / 圓角 40 /
// overflow hidden），跟前面五個灰塊同一組數值，不要在這裡另外寫一份。

/* 四支「嘗試失敗」的影片。
   ⚠️ 順序＝Fig 6 圖說裡列的四次嘗試，兩邊要對得起來：
   改寫提示詞 → 加參考圖 → 自己錄影示範 → 換模型。
   影片沒有 poster，所以 CSS 給了 #FAFAFA 底色避免載入前出現黑框。 */
const ATTEMPTS = [
  {
    src: '/work/goodmood/fell-short-1.mp4',
    label: '第一次嘗試：改寫提示詞。生成的手臂只有小幅擺動，沒有揮動的力道。',
  },
  {
    src: '/work/goodmood/fell-short-2.mp4',
    label: '第二次嘗試：補上參考圖。動作範圍仍然偏小。',
  },
  {
    src: '/work/goodmood/fell-short-3.mp4',
    label: '第三次嘗試：自己錄一段示範影片餵給模型。手臂軌跡還是不完整。',
  },
  {
    src: '/work/goodmood/fell-short-4.mp4',
    label: '第四次嘗試：換一個模型。擺動的重量感依然沒有出來。',
  },
];

const FINAL = {
  src: '/work/goodmood/fell-short-final.mp4',
  label: '最後採用的版本：取那一秒可用的畫面，再自己剪接修圖完成。',
};

/**
 * 一張卡片內所有 <video> 的播放控制。
 *
 * ⚠️ 兩張卡片各自呼叫一次，觀察目標是各自的卡片——**不共用同一個觀察目標**
 * （使用者 2026-09-03 指示）。兩張卡片在頁面上相距 59px 以上，第二張還在
 * 視窗外的時候第一張就該播了，共用會讓兩邊一起亮或一起停。
 *
 * ⚠️ 效能（規格書 §8）：五支影片同時解碼很吃資源，所以捲出視窗就 pause()。
 * 用的是輪 4 那支 useInViewPause（IntersectionObserver），不是 ScrollTrigger。
 *
 * ⚠️ prefers-reduced-motion：不自動播、停在第一幀、把 controls 打開讓使用者
 * 自己決定。autoPlay 屬性照樣寫在 JSX 上（使用者指定），這裡在掛載後立刻
 * pause() + currentTime = 0 把它按住——比起「條件式不加 autoPlay」，這個做法
 * 不會讓伺服器端與第一次 client render 的 HTML 不一致（hydration mismatch）。
 */
function useCardVideos(cardRef) {
  const inView = useInViewPause(cardRef);
  const [reduced, setReduced] = useState(false);
  const [armed, setArmed] = useState(false);
  const videosRef = useRef([]);

  /* ⚠️⚠️ preload="metadata" 對 autoplay 影片無效（Chrome 會整支預抓，
     實測五支各發一個 bytes=0-1382465 的完整請求）。
     改為 IntersectionObserver 進視窗才掛 src；掛上後不再拿掉，
     捲出只 pause()，避免捲回重抓。不要改回單靠 preload。
     ——使用者 2026-09-03 確認採用本做法，並確認 preload 那條是無效的處方。

     autoPlay / preload="metadata" 兩個屬性仍照使用者指定寫在 JSX 上：
     src 掛上之後它們才真正生效，而且是它們讓影片自己開始播。
     這一段是規格書 §8 效能預算的要求（五支合計 6.3MB，不可在初次載入抓下來）。 */
  useEffect(() => {
    if (inView) setArmed(true);
  }, [inView]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    videosRef.current.forEach((v) => {
      if (!v) return;
      if (reduced) {
        v.pause();
        // 回到第一幀。影片還沒載到 metadata 時設 currentTime 會丟例外，忽略即可。
        try {
          v.currentTime = 0;
        } catch {
          /* 尚未 seekable */
        }
        return;
      }
      if (inView) {
        // play() 回的 Promise 被中斷（例如馬上又捲出去）會 reject，這裡吞掉，
        // 否則 console 會出現 AbortError。
        v.play()?.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [inView, reduced]);

  const register = (i) => (el) => {
    videosRef.current[i] = el;
  };

  return { register, reduced, armed };
}

export default function WhereAIFellShort() {
  const attemptsCardRef = useRef(null);
  const finalCardRef = useRef(null);
  const attempts = useCardVideos(attemptsCardRef);
  const final = useCardVideos(finalCardRef);

  return (
    <section className="gm-section gm-fellshort">
      <div className="gm-fellshort-inner">
        {/* ---------- 第一組：四次失敗的嘗試（3395:3486）---------- */}
        <div className="gm-fellshort-group">
          <div>
            <p className="gm-kicker">Where AI Fell Short</p>

            <div className="gm-section-text">
              <h2 className="gm-subhead">Knowing when to stop is also a design decision.</h2>

              {/* 3245:2839 —— Figma 是一個文字節點裡五段，第五段是空的（ZWSP），不渲染。 */}
              <div className="gm-body">
                <p>
                  For the Suisui arm-swing exercise animation, I wanted the motion to carry weight, a
                  real swing, not a polite wave.
                </p>
                <p>
                  I gave a written description. Then references. Then a video of myself doing the
                  movement. AI still couldn&rsquo;t produce the full motion consistently. After a few
                  rounds it was clear the problem had stopped being my prompt. It was a limit in what
                  the model could do with this kind of motion, and no amount of rewording was going to
                  move it.
                </p>
                <p>
                  So I stopped chasing a perfect output. I took the one second that worked and
                  finished the asset by editing.
                </p>
                <p>
                  When keeping a collaborator on track costs more than solving it another way,
                  switching is the cheaper decision. That&rsquo;s true of AI, and it&rsquo;s true of
                  people.
                </p>
              </div>
            </div>

            <div className="gm-panel gm-fellshort-card gm-fellshort-card--attempts" ref={attemptsCardRef}>
              {/* 影片是示範內容、沒有聲音，結論已經寫在 Fig 6 的圖說裡。
                  這一段純文字副本讓螢幕閱讀器與搜尋引擎照樣讀得到四次嘗試各是什麼。 */}
              <p className="visually-hidden">
                四段並排的示範影片，分別是四次讓 AI 生成「甩手運動」動畫的嘗試：
                {ATTEMPTS.map((a) => a.label).join(' ')}
              </p>

              {/* src 進視窗才掛（armed），理由見 useCardVideos 裡的註解——
                  preload="metadata" 對 autoplay 影片無效，不要改回去。 */}
              <div className="gm-fellshort-attempts">
                {ATTEMPTS.map((a, i) => (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    key={a.src}
                    ref={attempts.register(i)}
                    src={attempts.armed ? a.src : undefined}
                    aria-label={a.label}
                    muted
                    playsInline
                    loop
                    autoPlay
                    controls={attempts.reduced}
                    preload="metadata"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="gm-figcaption">
            Fig 6. Four attempts: rewriting the prompt, adding references, filming myself doing the
            movement, switching models. The weight of the swing never came through.
          </p>
        </div>

        {/* ---------- 第二組：最後採用的版本（3395:3487）---------- */}
        <div className="gm-fellshort-group">
          <div className="gm-panel gm-fellshort-card gm-fellshort-card--final" ref={finalCardRef}>
            {/* src 進視窗才掛（armed），同上。 */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={final.register(0)}
              className="gm-fellshort-final"
              src={final.armed ? FINAL.src : undefined}
              aria-label={FINAL.label}
              muted
              playsInline
              loop
              autoPlay
              controls={final.reduced}
              preload="metadata"
            />
          </div>

          <p className="gm-figcaption">
            Fig 7. In the end I took the closest second that worked and finished the asset by
            editing.
          </p>
        </div>
      </div>
    </section>
  );
}
