'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { mainEase } from '@/lib/ease';
import WorkCard from './WorkCard';
import './work-index.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

// ⚠️ 2026-09-03 改分法：原本是 All Works / Product design / Personal Work，
// 但實際資料撐不起來——六件上線作品裡只有 goodmood 是 personal（點進去只有
// 一張卡），而「Product design」對 sui-sui 與 wanderbuddy 是錯的，那兩件是
// App 的 UI/UX 不是產品設計。改成 UI/UX vs Product Design，六件剛好 3 比 3。
//
// ⚠️ 'product' 這個 id **沿用但意義變了**：原本涵蓋五件，現在只涵蓋三件
// （aero-v / blossom-care / mvs）。data/works.json 的 group 已同步改過。
//
// ⚠️ ?filter=personal 這個網址從此失效（會被 VALID 擋掉、退回 all）。
// 網站還沒上線、沒有外部連結會壞，所以不做轉址（使用者 2026-09-03 裁示）。
//
// 之後創作類作品（trace-of-conversation / conversation，group 是 reflective）
// 上線時會再加第三個頁籤。現在 reflective 沒有對應頁籤，那兩件只會出現在
// All Works——這是預期的，matches() 對未知 group 值本來就安全（見下）。
const FILTERS = [
  { id: 'all', label: 'All Works' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'product', label: 'Product Design' },
];

const VALID = new Set(['uiux', 'product']);

function readFilterFromURL() {
  if (typeof window === 'undefined') return 'all';
  const f = new URLSearchParams(window.location.search).get('filter');
  return VALID.has(f) ? f : 'all';
}

// ⚠️ 對未知的 group 值是安全的：includes() 找不到就回 false，那張卡在該
// 頁籤下被隱藏，不會丟例外。所以 works.json 可以先標上還沒有頁籤的 group
// （例如 reflective），等頁籤加上去自然就生效。
function matches(work, filter) {
  return filter === 'all' || (work.group || []).includes(filter);
}

/**
 * 作品分類頁（規格書 §6.5）。版面與互動照 prototypes/work.html。
 *
 * ⚠️ 12 張卡片一次全部渲染進 DOM，之後永遠不由 React 依篩選條件重新產生。
 * 篩選只切換每張卡的 hidden 屬性（用命令式 DOM 操作，JSX 裡刻意沒有
 * hidden prop，React 不會蓋掉）。理由：GSAP Flip 必須拿到「切換前後是同
 * 一個」的元素物件才能算出位移做平滑重排；若改用條件渲染
 * （.filter().map()），元素會被卸載重建，Flip 失效，§6.5 驗收第 2 條
 * 「保留下來的卡片是平滑移動、不是消失再出現」就過不了。
 *
 * React state 只拿來驅動頁籤的 aria-selected / tabIndex 與空狀態，
 * 那些重新渲染不會動到卡片的 DOM 節點（key 穩定）。
 */
export default function WorkIndex({ works }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const statusRef = useRef(null);
  const tabRefs = useRef([]);
  const didInit = useRef(false);

  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(works.length);

  const bySlug = useRef({});
  if (!Object.keys(bySlug.current).length) {
    works.forEach((w) => {
      bySlug.current[w.slug] = w;
    });
  }

  /* ---------- 篩選：離場 → Flip 重排 → 進場，三段重疊 ---------- */
  const applyFilter = useCallback(
    (next, { instant = false } = {}) => {
      const grid = gridRef.current;
      if (!grid) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cards = Array.from(grid.querySelectorAll('.work-card'));
      const toShow = cards.filter((c) => matches(bySlug.current[c.dataset.slug], next));
      const toHide = cards.filter((c) => !matches(bySlug.current[c.dataset.slug], next));

      const finish = () => {
        setVisibleCount(toShow.length);
        if (statusRef.current) {
          statusRef.current.textContent = `Showing ${toShow.length} work${toShow.length === 1 ? '' : 's'}`;
        }
      };

      if (instant || reduce) {
        toHide.forEach((c) => {
          c.hidden = true;
        });
        toShow.forEach((c) => {
          c.hidden = false;
          // scale 一定要一起清：離場動效會留下 scale(0.96)
          gsap.set(c, { clearProps: 'opacity,transform,scale,translate,rotate' });
        });
        finish();
        return;
      }

      const leaving = toHide.filter((c) => !c.hidden);
      const tl = gsap.timeline();

      if (leaving.length) {
        gsap.set(leaving, { willChange: 'transform, opacity' });
        tl.to(
          leaving,
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.3,
            stagger: 0.03,
            ease: mainEase,
            onComplete: () => {
              leaving.forEach((c) => {
                c.hidden = true;
              });
              gsap.set(leaving, { willChange: 'auto' });
            },
          },
          0
        );
      }

      // 三段必須小幅重疊、總長 <= 900ms（§6.5）：重排＋進場在 300ms 的離場
      // 跑到 200ms 時就開始，不等它完全結束。合計約 600–700ms。
      tl.call(
        () => {
          const staying = toShow.filter((c) => !c.hidden);
          const state = Flip.getState(staying);

          const entering = toShow.filter((c) => c.hidden);
          entering.forEach((c) => {
            c.hidden = false;
            // ⚠️ scale: 1 不可省。離場動效把卡片縮到 0.96，這裡若只設
            // opacity 與 y，重新出現的卡片會永遠停在 96% 大小——實測 grid
            // 欄寬 534.9 但卡片只有 513.5，左右各縮進 10.7px。
            // （prototypes/work.html 的進場那段也漏了這個。）
            gsap.set(c, { opacity: 0, y: 24, scale: 1, willChange: 'transform, opacity' });
          });

          Flip.from(state, { duration: 0.4, ease: mainEase, absolute: true });
          gsap.to(entering, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: mainEase,
            onComplete: () => gsap.set(entering, { willChange: 'auto' }),
          });

          finish();
        },
        null,
        leaving.length ? 0.2 : 0
      );
    },
    []
  );

  /* ---------- 首次掛載：套用 URL 上的篩選（用 layout effect，畫面不會閃）
       ---------- */
  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const initial = readFilterFromURL();
    setFilter(initial);
    applyFilter(initial, { instant: true });
  }, [applyFilter]);

  /* ---------- 上一頁／下一頁 ---------- */
  useEffect(() => {
    const onPop = () => {
      const f = readFilterFromURL();
      setFilter(f);
      applyFilter(f);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [applyFilter]);

  /* ---------- 進場動畫 ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const inners = root.querySelectorAll('.reveal-inner');
      const tabs = root.querySelectorAll('.work-tab');
      const cards = Array.from(root.querySelectorAll('.work-card'));

      if (reduce) {
        gsap.set(inners, { y: '0%' });
        gsap.set(tabs, { y: 0, opacity: 1 });
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      // 1) 簡介兩行遮罩揭露 700ms、錯開 130ms
      // 2) 頁籤淡入＋上升 16px、400ms、錯開 60ms、延遲 300ms
      gsap.set(inners, { yPercent: 100, willChange: 'transform' });
      gsap.set(tabs, { y: 16, opacity: 0, willChange: 'transform, opacity' });

      gsap
        .timeline({ defaults: { ease: mainEase } })
        .to(inners[0], { yPercent: 0, duration: 0.7 }, 0)
        .to(inners[1], { yPercent: 0, duration: 0.7 }, 0.13)
        .to(
          tabs,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            onComplete: () => gsap.set(tabs, { willChange: 'auto' }),
          },
          0.3
        )
        .add(() => gsap.set(inners, { willChange: 'auto' }), 0.85);

      // 3) 卡片：**整批一起**進場，不做 stagger（使用者 2026-08-29 的動效
      //    規格 §1）。translateY(24px)+opacity 0 → 定位，600ms 主曲線。
      //
      //    ⚠️ 這裡跟改版前的做法差很多，不要改回去：舊版是「首屏的直接播、
      //    其餘每張各掛一個 ScrollTrigger」，所以卡片是一張一張出現的。
      //    新規格要的是整片一起浮上來，所以改成**單一** ScrollTrigger 掛在
      //    grid 上，越過視窗 80% 時一次把所有卡片播完。
      //
      //    delay 0.2 = 規格的「卡片群晚 200ms」。基準是簡介與頁籤的進場——
      //    首屏載入時 grid 頂端（約 615px）本來就在 80% 線（800px）之內，
      //    觸發器會立刻開火，所以這 200ms 實際上就是接在頁籤之後。
      //    若使用者是捲動之後才讓 grid 進場，這 200ms 只是個無害的小延遲。
      const grid = root.querySelector('.work-grid');
      gsap.set(cards, { y: 24, opacity: 0, willChange: 'transform, opacity' });
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: mainEase,
            delay: 0.2,
            onComplete: () => gsap.set(cards, { willChange: 'auto' }),
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* ---------- 頁籤 ---------- */
  const selectTab = useCallback(
    (next) => {
      if (next === filter) return;
      const url = new URL(window.location.href);
      if (next === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', next);
      window.history.pushState({ filter: next }, '', url);
      setFilter(next);
      applyFilter(next);
    },
    [filter, applyFilter]
  );

  const onTabKeyDown = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (i + dir + FILTERS.length) % FILTERS.length;
    const el = tabRefs.current[nextIdx];
    if (!el) return;
    el.focus();
    selectTab(FILTERS[nextIdx].id);
  };

  return (
    <div className="work-outer page-container" ref={rootRef}>
      <section className="work-intro">
        <h1 className="work-intro-heading">
          <span className="reveal-mask">
            <span className="reveal-inner">Mihumisang! I&rsquo;m Maida,</span>
          </span>
        </h1>
        <p className="work-intro-bio">
          <span className="reveal-mask">
            <span className="reveal-inner">
              a Taiwanese Indigenous designer and maker based in London. Working across industrial,
              product, and reflective design, she uncovers problems others overlook, often around
              health, women&rsquo;s health, and the environment, and explores identity and
              environment through craft and material.
            </span>
          </span>
        </p>
      </section>

      <div className="work-tabs-wrap">
        <ul className="work-tabs" role="tablist" aria-label="Filter works">
          {FILTERS.map((f, i) => (
            <li key={f.id} role="presentation">
              <a
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                href={f.id === 'all' ? '/work' : `/work?filter=${f.id}`}
                className="work-tab"
                role="tab"
                aria-selected={filter === f.id}
                tabIndex={filter === f.id ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  selectTab(f.id);
                }}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {f.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="work-status" aria-live="polite" ref={statusRef} />

      <div className="work-grid" role="tabpanel" ref={gridRef}>
        {works.map((work) => (
          <WorkCard key={work.slug} work={work} />
        ))}
        <p className="work-empty" hidden={visibleCount > 0}>
          No works in this category yet.
        </p>
      </div>
    </div>
  );
}
