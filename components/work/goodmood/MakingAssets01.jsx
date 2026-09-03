'use client';

import { useEffect, useRef, useState } from 'react';

// Goodmood 頁「Making assets with AI · 01」（Figma node 3337:3223，x=48 y=4422，1344×937）
// ＋ 前後對比滑軌（Figma 上沒有，使用者 2026-09-02 另外指定的新元件）。
//
// 幾何（section 內相對座標，照 Figma）：
//   kicker    3245:2824  y=0    行高 40.4
//   副標      3245:2826  y=51   → 距 kicker 頂 51，扣 40.4 行高 = 間距 10.6
//   正文      3245:2827  y=97   欄寬 1224，兩段，副標 → 正文 gap 5
//   對比圖區  3331:3191  y=313  1344×603.007，兩張各 670.37×603.007，間距 3.26
//   圖說      3336:3215  中心線 y=946（圖區底 916 + 30），行高 22 → 框頂 935
//
// ⚠️ 這一區的欄寬是 1344，不是前兩區的 1360——見 goodmood.css 該處註解。

/* 對比照片：兩組輪流。
   ⚠️ 左右兩張是「一對」，必須同時換——所以用同一個 setIndex 驅動兩格，
   不是各自跑各自的計時器（使用者 2026-09-02 明確要求）。
   1x 671×604、@2x 1234×1110（實際 1.84 倍不是 2 倍，來源解析度的極限；
   在 srcset 裡仍標成 2x，因為它確實是高像素密度時該用的那一張）。 */
const COMPARE_SETS = [
  {
    left: '/work/goodmood/compare-1-original.webp',
    leftAlt: 'AERO V 的原始產品算圖：白色圓座凳懸空在單色背景上，沒有場景。',
    right: '/work/goodmood/compare-1-generated.webp',
    rightAlt: '同一張凳子，先定義好場景之後生成的版本：放在真實髮廊裡，有環境光與人。',
  },
  {
    left: '/work/goodmood/compare-2-original.webp',
    leftAlt: 'AERO V 的另一張原始產品算圖，同樣是無場景的棚拍構圖。',
    right: '/work/goodmood/compare-2-generated.webp',
    rightAlt: '同一張凳子的第二組生成結果，同樣先定義場景後再生成。',
  },
];

/* 圖說。
   ⚠️ 第二組照片的圖說使用者還在確認，先兩組都用同一句。刻意用陣列 + 索引
   渲染（而不是把字寫死），之後要改成跟著輪播換只需要改這裡的第二筆
   （使用者 2026-09-02 指示：把切換文字的路留著）。 */
const CAPTIONS = [
  'Fig 2. AERO V. Left: the original product render. Right: generated after I defined the scene first.',
  'Fig 2. AERO V. Left: the original product render. Right: generated after I defined the scene first.',
];

const HOLD_MS = 5000; // 停留 5 秒，與首頁 §6.2 中央輪播同一組節奏
const SLIDER_INITIAL = 50;

function srcSetFor(src) {
  return `${src} 1x, ${src.replace(/\.webp$/, '@2x.webp')} 2x`;
}

export default function MakingAssets01() {
  const [setIndex, setSetIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(SLIDER_INITIAL);
  const sliderRef = useRef(null);

  // 對比照片輪播。reduced motion 時不啟動，停在第 1 組。
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      setSetIndex((i) => (i + 1) % COMPARE_SETS.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, []);

  /* ---------- 滑軌：滑鼠滑過去就跟著動，不用按住拖曳（2026-09-02）----------
     ⚠️ 只在 (hover: hover) and (pointer: fine) 啟用。觸控裝置沒有 hover，
     游標「經過」這件事不存在，維持原本的拖曳／點擊行為（那是 <input> 的
     原生能力，這個 effect 不掛就好，不需要另外寫）。

     ⚠️ rAF 節流：pointermove 只把座標記進 ref，實際換算與寫值都在 rAF 裡做，
     一幀最多一次。不要每個 move 事件都寫一次 style——那是 §8 的 60fps 硬規則。

     ⚠️ 這裡直接呼叫 setSliderPos，而不是「寫 input.value 再 dispatch input 事件」。
     兩者結果完全相同：<input> 是受控元件（value={sliderPos}），改 state 就會
     同步更新它的 value，clip-path 也照原本那條路徑走。反過來做的話，React 覆寫
     過 value 的 setter，必須用 Object.getOwnPropertyDescriptor 取原生 setter 才
     推得動，繞一圈又更脆弱。

     滑鼠移出容器時什麼都不做——停在原地，不彈回 50%。
     鍵盤與螢幕閱讀器的行為完全不受影響，仍然由那個 <input type="range"> 提供。 */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let rafId = 0;
    let pendingX = null;

    const apply = () => {
      rafId = 0;
      if (pendingX === null) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const pct = Math.round(((pendingX - r.left) / r.width) * 100);
      setSliderPos(Math.min(100, Math.max(0, pct)));
    };

    const onMove = (e) => {
      pendingX = e.clientX;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="gm-section gm-assets01">
      <div className="gm-assets01-inner">
        <p className="gm-kicker">Making assets with AI · 01</p>

        <div className="gm-section-text">
          <h2 className="gm-subhead">Product visuals</h2>

          {/* 3245:2827 —— Figma 是一個文字節點裡兩段。 */}
          <div className="gm-body">
            <p>
              Updating the Aerov project, I wanted the product shown in a real situation rather than
              floating on a plain background.
            </p>
            <p>
              Instead of asking for &ldquo;a product photo&rdquo;, I defined the scene first, the
              environment, the light, who&rsquo;s holding it, what the shot needs to say, and
              collected references so the direction wasn&rsquo;t only in my head. Then I adjusted the
              description in small steps rather than rewriting the whole prompt each time. Setting the
              conditions before generating got me close to the intended image in far fewer attempts.
              The prompt wasn&rsquo;t the skill. Knowing what the image had to do was.
            </p>
          </div>
        </div>

        <figure className="gm-assets01-figure">
          {/* 兩格各自疊兩張圖，用同一個 setIndex 控制 opacity——左右同時換。 */}
          <div className="gm-compare">
            {['left', 'right'].map((side) => (
              <div className="gm-compare-cell" key={side}>
                {COMPARE_SETS.map((set, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={set[side]}
                    src={set[side]}
                    srcSet={srcSetFor(set[side])}
                    // ⚠️ alt 來自 COMPARE_SETS，是中文；整站是 lang="en"，
                    // 不標語言英文語音會唸不出來（2026-09-03 補）
                    lang="zh-Hant"
                    alt={set[side === 'left' ? 'leftAlt' : 'rightAlt']}
                    width={671}
                    height={604}
                    data-active={i === setIndex ? 'true' : 'false'}
                    // 非當前那一組對輔助技術隱藏，避免同一格被唸兩次
                    aria-hidden={i === setIndex ? undefined : 'true'}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            ))}
          </div>

          <figcaption className="gm-figcaption">{CAPTIONS[setIndex]}</figcaption>
        </figure>

        {/* ---------- 前後對比滑軌（Figma：after 3395:3482 / before 3395:3489）----------
            ⚠️ 疊層順序：下層 Before（整張完整）、上層 After（clip-path 露出右側）。
            --gm-slider-pos 是分隔線的位置（0 = 最左，100 = 最右）。
            左側顯示 Before、右側顯示 After，所以 0% 看到的是整片 After、
            100% 是整片 Before。這是分隔線位置的必然結果，不是端點寫反。
            不要改成 100 - pos——那會讓把手的移動方向和拉桿相反。
            ⚠️ 兩個標籤各自住在自己那一層裡，不拉出來共用——上層被 clip 的時候，
            After 的標籤要跟著一起被切掉才對。
            ⚠️ 底色 / 邊框 / 圓角 / overflow 只掛在最外層 .gm-slider，
            兩層內部不再各畫一次邊框，否則 clip 的切邊會出現兩條線。
            ⚠️ 真正的控制項是最底下那個 <input type="range">，蓋滿整個盒子、
            opacity:0。拖曳、點盒子任一點跳位、鍵盤左右鍵 / Home / End、
            螢幕閱讀器播報數值全部由原生行為提供。 */}
        <div className="gm-panel gm-slider" ref={sliderRef} style={{ '--gm-slider-pos': sliderPos }}>
          {/* 下層：Before —— AI 直接生成的粗版 */}
          <div className="gm-slider-layer gm-slider-layer--before">
            <div className="gm-slider-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/goodmood/slider-before.webp"
                srcSet={srcSetFor('/work/goodmood/slider-before.webp')}
                lang="zh-Hant"
                alt="AI 直接生成的粗版四宮格：構圖對了，但細節與質感還沒到可用的程度。"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="gm-slider-tag gm-slider-tag--before">Before</span>
          </div>

          {/* 上層：After —— 最終版，用 clip-path 露出右側 (100 - sliderPos)% */}
          <div className="gm-slider-layer gm-slider-layer--after">
            <div className="gm-slider-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/goodmood/slider-after.webp"
                srcSet={srcSetFor('/work/goodmood/slider-after.webp')}
                lang="zh-Hant"
                alt="最終版四宮格：經過我自己修圖與調整之後的成品。"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="gm-slider-tag gm-slider-tag--after">After</span>
          </div>

          <div className="gm-slider-handle" aria-hidden="true">
            <span className="gm-slider-handle-bar" />
          </div>

          {/* ⚠️ aria-label 用文字描述方向，不要只讓螢幕閱讀器播報一個容易誤解的數字：
              這個 <input> 的值是**分隔線位置**，不是「完成度百分比」，單念「80%」
              會被理解成反的（使用者 2026-09-02 指示）。 */}
          <input
            className="gm-slider-input"
            type="range"
            min={0}
            max={100}
            step={1}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            aria-label="Before and after comparison slider position. Move left to see the finished version, move right to see the raw AI output."
          />
        </div>
      </div>
    </section>
  );
}
