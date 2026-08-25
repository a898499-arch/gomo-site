'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';
import './about.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 以下三組資料逐字取自規格書 §6.6「內容」，沒有任何一筆是我編的。
// 只有這一頁用得到，所以放在這裡當常數；若之後想不改程式就能編輯，
// 可以搬到 data/about.json。
//
// ⚠️ Employment 的順序是「新到舊」（2023–2024 在上）。Figma 稿是舊到新，
// §6.6 已明文裁示改成履歷慣例的新到舊——以規格書為準。
const EMPLOYMENT = [
  { year: '2023-2024', title: 'Design & Admin Coordinator', sub: 'Shen Yi Tech' },
  { year: '2021-2022', title: 'UIUX Designer', sub: 'Ebio Tech' },
];

const EDUCATION = [
  { year: '2024-2025', title: 'Goldsmiths (UoL)', sub: 'MA Design With Distinction' },
  { year: '2019-2023', title: 'Ming-Chi University of Technology', sub: 'BSc Industrial Design' },
];

const AWARDS = [
  { name: 'The Architecture Masterprize', result: 'Winner' },
  { name: 'iF Design Talent Award', result: 'Shortlist' },
  { name: 'Red Dot Award: Design Concept', result: 'Final Judging' },
  { name: 'Young Ones ADC', result: 'Shortlist' },
  { name: 'Great Design Award (Taiwan)', result: 'Gold Medal Award' },
  { name: 'Great Design Award (Taiwan)', result: 'Bronze Medal Award' },
  { name: 'Great Design Award (Taiwan)', result: 'Merit Award' },
  { name: 'KYMCO Motorcycle Design Award (Taiwan)', result: 'Shortlist' },
  { name: 'Dècor Hoüse Award (Taiwan)', result: 'Merit Award' },
  {
    name: 'Yodex Industry–Academia Cooperation with Hitachi Cooling & Heating Taiwan',
    result: 'Silver Award',
  },
];

function EntryList({ items }) {
  return (
    <dl className="about-entries">
      {items.map((it) => (
        <div className="about-entry" data-animate="entry" key={`${it.year}-${it.title}`}>
          <dt className="entry-year">{it.year}</dt>
          <dd className="entry-title">{it.title}</dd>
          <dd className="entry-sub">{it.sub}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function About() {
  const rootRef = useRef(null);
  const detailsRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const details = detailsRef.current;
    if (!root || !details) return;

    // §6.6 可存取性：reduced motion 時跳過所有進場，元素維持在最終狀態
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const photo = root.querySelector('.about-portrait-photo');
      const aboutPill = root.querySelector('.about-hero .about-pill');
      const bios = root.querySelectorAll('.about-bio p');
      const pills = details.querySelectorAll('[data-animate="pill"]');
      const seeMore = root.querySelector('.about-more-detail-wrap');

      const employment = details.querySelectorAll('[data-group="employment"] [data-animate="entry"]');
      const education = details.querySelectorAll('[data-group="education"] [data-animate="entry"]');
      const awards = details.querySelectorAll('[data-group="awards"] [data-animate="entry"]');
      const entries = details.querySelectorAll('[data-animate="entry"]');

      // ── 上區：頁面載入時的錯開上升（§6.6 進場動畫表）──
      //    肖像 0ms（另加 scale 0.96→1）／About 膠囊 300ms／
      //    bio 第一段 400ms／bio 第二段 480ms，皆 600ms、主曲線
      gsap.set(photo, { opacity: 0, scale: 0.96, willChange: 'transform, opacity' });
      gsap.set([aboutPill, ...bios], { y: 24, opacity: 0, willChange: 'transform, opacity' });

      gsap
        .timeline({ defaults: { ease: mainEase, duration: 0.6 } })
        .to(photo, { opacity: 1, scale: 1 }, 0)
        .to(aboutPill, { y: 0, opacity: 1 }, 0.3)
        .to(bios[0], { y: 0, opacity: 1 }, 0.4)
        .to(bios[1], { y: 0, opacity: 1 }, 0.48)
        .add(() => gsap.set([photo, aboutPill, ...bios], { willChange: 'auto' }));

      // ── 下區：ScrollTrigger 捲入時觸發一次（§6.6）──
      gsap.set([...pills, ...entries, seeMore], {
        y: 24,
        opacity: 0,
        willChange: 'transform, opacity',
      });

      ScrollTrigger.create({
        trigger: details,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: mainEase, duration: 0.6 } });

          // 三個膠囊先出現，彼此錯開 80ms
          tl.to(pills, { y: 0, opacity: 1, stagger: 0.08 }, 0);

          // 各組條目在膠囊之後開始，同組內錯開 60ms；三組平行跑，
          // 組與組之間不再錯開。
          const GROUP_START = 0.24; // = 3 個膠囊 × 0.08
          tl.to(employment, { y: 0, opacity: 1, stagger: 0.06 }, GROUP_START);
          tl.to(education, { y: 0, opacity: 1, stagger: 0.06 }, GROUP_START);
          // Awards 10 列 → 9 段間隔 × 60ms = 540ms，在 §6.6 的 700ms 上限內
          tl.to(awards, { y: 0, opacity: 1, stagger: 0.06 }, GROUP_START);

          // See More Detail 在整組結束後 200ms 才出現（不是從整組開始算）。
          // 最後結束的是 Awards 最後一列：0.24 + 9×0.06 + 0.6 = 1.38s
          const groupEnd = GROUP_START + (awards.length - 1) * 0.06 + 0.6;
          tl.to(seeMore, { y: 0, opacity: 1 }, groupEnd + 0.2);

          tl.add(() =>
            gsap.set([...pills, ...entries, seeMore], { willChange: 'auto' })
          );
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-outer page-container" ref={rootRef}>
      {/* ---------- 上區 ---------- */}
      <section className="about-hero">
        <div className="about-portrait">
          <div className="about-portrait-photo">
            {/* 首屏 LCP 候選，所以不 lazy load（規格書 §3.5：全部 lazy load，
                但首屏例外）。 */}
            <img
              src="/assets/img/maida-portrait.jpg"
              alt="Portrait of Maida Hu"
              width={301}
              height={411}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <div className="about-intro">
          <span className="about-pill">About</span>
          <div className="about-bio">
            <p>
              Maida (Lin Wei-Ting) Hu is a Taiwanese Indigenous designer and Goldsmiths graduate
              based in London. Her practice moves across industrial, product, and reflective design,
              with an instinct for surfacing the problems others overlook and resolving them through
              design, often around health, women&rsquo;s health, and the environment.
            </p>
            <p>
              She is also a maker, shaping her prototypes by hand and working across craft media to
              explore how identity and environment are felt. Through self and family ethnography,
              she maps her many identities and her displacement far from home, remaking a single
              piece of furniture in different materials. This is how she defines her own design
              method.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 下區 ---------- */}
      <section className="about-details" ref={detailsRef}>
        <div className="about-col-left">
          <div className="about-group" data-group="employment">
            <span className="about-pill" data-animate="pill">
              Employment
            </span>
            <EntryList items={EMPLOYMENT} />
          </div>

          <div className="about-group" data-group="education">
            <span className="about-pill" data-animate="pill">
              Education
            </span>
            <EntryList items={EDUCATION} />
          </div>
        </div>

        <div className="about-col-right" data-group="awards">
          <span className="about-pill" data-animate="pill">
            Awards
          </span>
          {/* <dl> 讓螢幕閱讀器能把獎項與結果配成一對（§6.6 可存取性） */}
          <dl className="about-awards">
            {AWARDS.map((a) => (
              <div className="award-row" data-animate="entry" key={`${a.name}-${a.result}`}>
                <dt className="award-name">{a.name}</dt>
                <dd className="award-result">{a.result}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- See More Detail ----------
          §6.6：連到 CV PDF，target="_blank" 開新分頁「預覽」。
          ⚠️ 不可加 download 屬性——那會變成強制存檔。這一點刻意跟 §6.4
          頁腳的 CV Download（有 download）相反，兩者不共用點擊邏輯。 */}
      <div className="about-more-detail-wrap">
        <a
          href="/cv/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="about-more-detail link-underline"
          aria-label="Preview Maida Hu's CV as a PDF (opens in a new tab)"
        >
          <span className="amd-text-wrap">
            <span className="amd-text-default">See More Detail</span>
            <span className="amd-text-hover" aria-hidden="true">
              Preview My CV
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
