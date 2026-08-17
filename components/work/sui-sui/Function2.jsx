'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// node 545:510（1507×961）。2026-08-17：用 get_design_context 重讀整段重做——
// 上一輪文字置中、手機蓋住文字、缺紅色暈染背景，都跟 Figma 對不上。
// 座標全部取自這次重讀（背景 545:511/512、文字 545:513~518、三支手機
// 545:519~522、三個 badge 545:523~528）。
//
// 文字左緣對齊 nav（用跟 Color/Typography 同一個 .page-container，
// 局部座標 x=0 直接對齊 nav logo 左緣，不用另外算）。
//
// 手機尺寸/長寬比用你量好的精確值（跟 Figma 座標算出來的 w/h 一致，
// 互相印證過）；水平位置跟垂直高低差照 Figma 實際座標，只有最右邊
// 那支（Product library）依你的指示改成貼齊容器右緣（Figma 原始 x=937
// 換算只到 93.35% 寬，不是真正贴齊，這裡是你要的例外覆寫，不是我自己
// 決定的簡化）。
//
// 背景暈染 Figma 原稿是兩層（Vector164 SVG 外框 + Vector165 PNG
// mix-blend-overlay），你只切了一張 function2-bg-vector.svg，這裡就用
// 這一張，不做兩層合成。
const FRAME_W = 1507;
const FRAME_H = 961;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctY = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;
const pctW = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctH = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;

const PHONES = [
  {
    key: 'course',
    src: '/work/sui-sui/function2-intro-page.png',
    alt: 'Phone screen showing a Morning Glow routine preview with toner, face cream, and cotton pad',
    x: 220, y: 349, w: 241, h: 490,
    badge: { label: 'Course preview', x: 264, y: 303, w: 154, bold: false },
  },
  {
    key: 'scanning',
    src: '/work/sui-sui/function2-products-overview.png',
    alt: 'Phone screen scanning a skincare product with camera, showing photo and barcode options',
    x: 595, y: 235, w: 290, h: 590,
    badge: { label: 'Product scanning', x: 656, y: 194, w: 167, bold: false },
  },
  {
    key: 'library',
    src: '/work/sui-sui/function2-phone-main.png',
    alt: 'Phone screen showing a saved product library of skincare and makeup items',
    x: 937, y: 51, w: 469.945, h: 815.103,
    // 貼齊容器右緣，見上方註解——這是你的指示覆寫，不是 Figma 原始 x。
    flushRight: true,
    badge: { label: 'Product library', x: 1051, y: 13, w: 149, bold: true },
  },
];

export default function Function2() {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const phoneRefs = useRef([]);
  const badgeRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bg = bgRef.current;
    const text = textRef.current;
    const phones = phoneRefs.current.filter(Boolean);
    const badges = badgeRefs.current.filter(Boolean);
    const all = [bg, text, ...phones, ...badges];

    if (reduceMotion) {
      gsap.set(all, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(bg, { opacity: 0 });
    gsap.set(text, { opacity: 0, y: 24 });
    gsap.set(phones, { opacity: 0, y: 40 });
    gsap.set(badges, { opacity: 0 });

    const PHONE_DURATION = 0.7;
    const PHONE_STAGGER = 0.18;
    const BADGE_DELAY_AFTER_PHONE = 0.2;
    const BADGE_DURATION = 0.4;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, duration: 0.8, ease: mainEase }, 0);
        tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: mainEase }, 0);
        phones.forEach((phone, i) => {
          const phoneStart = i * PHONE_STAGGER;
          tl.to(phone, { opacity: 1, y: 0, duration: PHONE_DURATION, ease: mainEase }, phoneStart);
          tl.to(
            badges[i],
            { opacity: 1, duration: BADGE_DURATION, ease: mainEase },
            phoneStart + PHONE_DURATION + BADGE_DELAY_AFTER_PHONE
          );
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section className="ss-section" ref={rootRef}>
      <div className="page-container">
        <div className="ss-fn2-frame" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
          <img
            ref={bgRef}
            src="/work/sui-sui/function2-bg-vector.png"
            alt=""
            aria-hidden="true"
            className="ss-fn2-bg"
            style={{ left: pctX(263), top: pctY(150), width: pctW(1244), height: pctH(665) }}
          />

          <div ref={textRef} className="ss-fn2-text" style={{ top: pctY(0), width: pctW(885) }}>
            <p className="ss-fn2-eyebrow">Function 2</p>
            <h2 className="ss-fn2-title">Product recognition</h2>
            <p className="ss-fn2-desc">
              Users photograph or scan the products already on their dressing table. The app
              recognises and sorts them automatically, so every routine is built around what
              someone owns, not what they&rsquo;re expected to buy.
            </p>
          </div>

          {PHONES.map(({ key, src, alt, x, y, w, h, flushRight, badge }, i) => (
            <div key={key}>
              <img
                ref={(el) => { phoneRefs.current[i] = el; }}
                src={src}
                alt={alt}
                className="ss-fn2-phone"
                style={{
                  ...(flushRight ? { right: 0 } : { left: pctX(x) }),
                  top: pctY(y),
                  width: pctW(w),
                  height: pctH(h),
                }}
              />
              <span
                ref={(el) => { badgeRefs.current[i] = el; }}
                className="ss-fn2-badge"
                style={{
                  left: pctX(badge.x),
                  top: pctY(badge.y),
                  width: pctW(badge.w),
                  fontWeight: badge.bold ? 600 : 400,
                  fontSize: badge.bold ? '1.0617cqw' : '0.9291cqw',
                }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
