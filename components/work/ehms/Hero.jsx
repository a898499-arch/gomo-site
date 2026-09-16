'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';
import { useStandardEntrance } from '@/lib/useStandardEntrance';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Figma node 912:59「Hero」，1064×736，位於整頁 frame 912:58 的 y=124。
//
// 拼貼是整塊切圖（九宮格照片 + 深綠 App icon 卡 + 字體樣張），不拆。
// 標題 912:371 與 tagline 912:370 在 Figma 是 **frame 層級** 的元素，
// 不在 Hero frame 裡，疊在拼貼上方——所以切圖裡沒有這兩段字，
// 它們在這裡是真正的 DOM 文字（可選取、可被搜尋引擎讀到）。
//
// ---------- 第二輪：捲動視差 + 遮罩揭露（2026-09-15）----------
//
// ⚠️⚠️ 分層是這一段唯一真正的風險點，靠**結構**解掉而不是靠時序：
//   .eh-hero-parallax        視差層，GSAP 寫 yPercent（scrub）
//     img.eh-hero-collage    進場層，useStandardEntrance 寫 y + opacity（once）
//   .eh-hero-text-parallax   視差層，GSAP 寫 y（scrub）
//     .reveal-inner          遮罩揭露，GSAP 寫 y（once）
// 每個元素的 transform 只有一個擁有者。不要把視差和進場掛到同一個節點上再
// 用 delay 去湊——那只是把覆寫往後推，捲動時還是會互相蓋掉。
//
// 視差方向：捲動時元素本來就會往上跑，要讓拼貼「比捲動慢」就在過程中給它
// 一個遞增的向下位移。位移越大 = 跑得越慢 = 看起來越遠。所以拼貼 ±4%
// （±30px @1440）、文字 ±10px，拼貼在後、文字在前。
//
// 拼貼的裁切：視差要能上下移動又不露出空白，圖必須比視窗高。這裡讓
// .eh-hero 只顯示拼貼的 92%（上下各裁 4%），使用者 2026-09-15 裁示。
// 所以 .eh-hero 的長寬比是 1064/677.12 而不是原本的 1064/736。
export default function Hero() {
  // 拼貼的標準進場（第一輪就有的，維持不變）。寫的是 img 自己的 transform，
  // 與外層的視差互不干涉。
  const entranceRef = useStandardEntrance('.eh-in');
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = root.querySelectorAll('.reveal-inner');
    const collage = root.querySelector('.eh-hero-parallax');
    const text = root.querySelector('.eh-hero-text-parallax');

    const ctx = gsap.context(() => {
      /* ---------- 標題與 tagline 的遮罩揭露 ----------
         全站既有的 .reveal-mask / .reveal-inner（頁腳「Get an idea?」、首頁
         Gallery 標題、作品分類頁簡介同一套）。數值一字不改：0.75s、主曲線、
         第二行延遲 0.13s。初始態 translateY(100%) 由 CSS 提供。 */
      if (reduce) {
        gsap.set(lines, { y: '0%' });
      } else {
        ScrollTrigger.create({
          trigger: root,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(lines[0], { y: '0%', duration: 0.75, ease: mainEase }, 0);
            tl.to(lines[1], { y: '0%', duration: 0.75, ease: mainEase }, 0.13);
          },
        });
      }

      /* ---------- 捲動視差 ----------
         ⚠️ reduced motion 時整段不建立——不是建立了再停用。拼貼與文字停在
         CSS 的預設位置（視差層的 top/height 已經讓拼貼置中對齊）。 */
      if (reduce) return;

      /* start: 0 而不是 'top top'。Hero 從 y=126 開始（.page-content 給固定
         導覽列的上留白），用 'top top' 的話前 126px 的捲動完全不動、到了才
         突然開始，看起來像卡一下。從捲動位置 0 起算就沒有這個空窗。 */
      const common = { trigger: root, start: 0, end: 'bottom top', scrub: true };

      /* will-change 只在動畫執行期間掛上，結束移除（CLAUDE.md 硬規則）。
         scrub 動畫沒有「播完」的時點，所以用 onToggle 的進出範圍當界線。 */
      const willChange = (el) => (self) => {
        el.style.willChange = self.isActive ? 'transform' : '';
      };

      // 拼貼：yPercent 相對自己的高度，視窗變窄時自動等比縮放。
      // 視差層比 .eh-hero 高 8.696%，上下各多 4.348%，剛好等於 ±4% 的行程，
      // 所以任何位置都不會露出空白。
      gsap.fromTo(
        collage,
        { yPercent: -4 },
        { yPercent: 4, ease: 'none', scrollTrigger: { ...common, onToggle: willChange(collage) } },
      );

      // 文字：固定 px。幅度只有 10px，不需要跟著視窗縮放，用 px 讀起來也更直接。
      gsap.fromTo(
        text,
        { y: -10 },
        { y: 10, ease: 'none', scrollTrigger: { ...common, onToggle: willChange(text) } },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="eh-hero eh-col" ref={sectionRef} aria-labelledby="eh-hero-title">
      <div className="eh-hero-parallax">
        <img
          className="eh-hero-collage eh-in"
          ref={entranceRef}
          src="/work/ehms/hero-collage.webp"
          srcSet="/work/ehms/hero-collage.webp 1x, /work/ehms/hero-collage@2x.webp 2x"
          width={1064}
          height={736}
          /* 首屏 LCP 元素：刻意用 eager + high priority，不 lazy load。
             跟 aero-v/Hero.jsx 同一個理由，是對 §3.5 的知情偏離。 */
          fetchPriority="high"
          decoding="async"
          alt="eHMS 產品拼貼：長者與家屬在智慧氣墊床上閱讀、長者交握的雙手特寫、手持手機操作 App 的畫面、深綠色 App 圖示卡、四色綠色色票、綠葉背景，以及一張標示「微軟正黑體」的字體樣張與五支並排的 App 畫面截圖。"
        />
      </div>

      <div className="eh-hero-text-parallax">
        <div className="eh-hero-text">
          {/* 頁面主標題。Logo & Overview 區裡的「eHMS 2.0」是同一個字串的
              視覺重複，那裡用 <p>，標題語意只留在這裡一處。 */}
          <h1 className="eh-hero-title" id="eh-hero-title">
            <span className="reveal-mask">
              <span className="reveal-inner">eHMS 2.0</span>
            </span>
          </h1>
          <p className="eh-hero-tagline">
            <span className="reveal-mask">
              <span className="reveal-inner">
                An app nurses use to control a pressure-relief mattress.
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
