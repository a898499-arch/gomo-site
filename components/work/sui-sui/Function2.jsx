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
// 2026-08-23 第二輪，四個修正：
//
// 【1. 最右邊那支手機變形】get_design_context 重讀 545:519/520 才發現
// 這張圖 Figma 是用「裁切窗」畫的——img 本身是 339.92% 寬/146.99% 高、
// offset left:-101.04% top:-32.65%，代表原始素材（手拿手機的照片）比
// 465×815 這個可視窗大很多，Figma 只露出其中一塊裁切窗。實測量了檔案
// 本身：function2-phone-main.png 原生 1389×2730（比例 0.5088），跟
// 目標框 469.945:815.103（比例 0.5765）對不上——之前完全沒設
// object-fit，瀏覽器預設用 fill 硬把圖撐/壓成框的比例，這就是變形的
// 原因。改成 object-fit:cover 避免變形；並且把 Figma 那組裁切窗百分比
// 換算成 object-position（42.11% 69.48%——公式：
// x%=(101.04/(339.92-100))*100，y%=(32.65/(146.99-100))*100），盡量還原
// Figma 原本裁切的位置，不是隨便置中。手機 1/2 的素材本來就跟框的比例
// 幾乎一致（0.4918 vs 0.4918、0.4921 vs 0.4915），object-fit:cover 對它們
// 是無操作，不會有副作用。
//
// 【2. 手機3＋紅色暈染背景要出血到視窗右緣，順便修好右下角的白色矩形】
// 之前背景（545:511/512）跟手機3都是照 1507 參考寬換算成 page-container
// 內的百分比，只會貼齊 page-container 的內容邊界（含 40px page-gutter），
// 不是真正的視窗邊緣，右側因此留白；而白色矩形其實是同一個根因造成
// 的——背景圖的框只到「page-container 右緣」，手機3再往右一截完全沒有
// 背景圖覆蓋，露出頁面底色，看起來像多了一塊白色矩形，不是另外獨立的
// bug，兩個一起修就一起消失。
// 做法：用 BLEED_RIGHT 這個 calc() 算出「page-container 內容右緣」到
// 「視窗真正右緣」的距離（= page-gutter ＋ 視窗比 1440 多出來的一半），
// 背景跟手機3 的容器都用這個值當 right，讓它們一路延伸到視窗邊緣，超出
// 視窗的部分自然被裁掉（沒有另外加 overflow:hidden，本來就沒有東西會
// 撐開頁面寬度，因為 right 算出來精確等於「到視窗邊緣」，不會更多）。
// 手機1/2 跟文字維持原本 page-container 內的定位，不受影響。
//
// 【3. Badge 位置改成綁在手機上】三個 badge 原本是各自獨立的絕對座標，
// 跟 Figma 對不太齊、手機位置一動 badge 就要重新對一次。改成「手機+
// badge 包成一個 group」：group 本身用手機的座標定位（原本 phone 的
// left/top/width/height 搬到 group 上），手機圖片變成 inset:0 填滿
// group，badge 改成「相對 group 的偏移量」（get_design_context 重讀
// 545:523~528 量出來的 badge 座標減去對應手機座標）：
//   course preview：(264-220, 303-349) = (44, -46)
//   product scanning：(656-595, 194-235) = (61, -41)
//   product library：(1051-937, 13-51) = (114, -38)
// 手機位置以後改了，group 一起搬，badge 自動跟著，不用再手動對第二次。
// 注意：badge 的 left/top/width 百分比是相對「手機自己的寬高」算的
// （offsetX/w、offsetY/h），不是 pctX/pctY 那個相對 1507 參考框的百分比
// ——CSS 的 % 是相對「自己的 containing block」解析，badge 現在的
// containing block 是手機（group），不是整個 frame，兩個參考基準不一樣，
// 直接沿用 pctX/pctY 會把偏移量算得比實際小很多（吃過一次虧，見 git
// 記錄）。
//
// 【4. 進場動畫：手機跟 badge 要當一組一起出現】原本是手機先落定、
// 200ms 後 badge 才單獨淡入（沒有位移）。現在「群組化」之後，badge
// 變成手機的子元素，動畫直接套在 group 本身（translateY(40)+opacity 0
// → 定位，700ms，cubic-bezier(0.22,1,0.36,1) 也就是 mainEase）——badge
// 是 group 的子節點，group 的 transform/opacity 動畫會自動帶著 badge
// 一起動，兩者間不會有時間差，不需要再另外對 badge 下一個動畫。
// stagger 180ms（跟原本 PHONE_STAGGER 一致）。背景暈染跟標題文字的
// 動畫沒變（背景 800ms 純淡入不位移；文字沿用既有的標準進場）。
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

// page-container 內容右緣 → 視窗真正右緣的距離：page-gutter（40px＠≥1440，
// 隨視窗縮小的 clamp）＋ 視窗比 1440 上限多出來的一半（視窗 ≤1440 時這一項是 0）。
const BLEED_RIGHT = 'calc(-1 * (var(--page-gutter) + (100vw - min(1440px, 100vw)) / 2))';

const PHONES = [
  {
    key: 'course',
    src: '/work/sui-sui/function2-intro-page.png',
    alt: 'Phone screen showing a Morning Glow routine preview with toner, face cream, and cotton pad',
    x: 220, y: 349, w: 241, h: 490,
    badge: { label: 'Course preview', offsetX: 44, offsetY: -46, w: 154, bold: false },
  },
  {
    key: 'scanning',
    src: '/work/sui-sui/function2-products-overview.png',
    alt: 'Phone screen scanning a skincare product with camera, showing photo and barcode options',
    x: 595, y: 235, w: 290, h: 590,
    badge: { label: 'Product scanning', offsetX: 61, offsetY: -41, w: 167, bold: false },
  },
  {
    key: 'library',
    src: '/work/sui-sui/function2-phone-main.png',
    alt: 'Phone screen showing a saved product library of skincare and makeup items',
    // 貼齊視窗右緣（見上方 BLEED_RIGHT 說明），不再用 Figma 原始 x=937
    // 換算的 pctX——那樣只會貼齊 page-container 邊界，不是視窗邊緣。
    y: 51, w: 469.945, h: 815.103,
    flushRight: true,
    objectPosition: '42.11% 69.48%', // 還原 Figma 裁切窗位置，見上方註解
    badge: { label: 'Product library', offsetX: 114, offsetY: -38, w: 149, bold: true },
  },
];

export default function Function2() {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const groupRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bg = bgRef.current;
    const text = textRef.current;
    const groups = groupRefs.current.filter(Boolean);
    const all = [bg, text, ...groups];

    if (reduceMotion) {
      gsap.set(all, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(bg, { opacity: 0 });
    gsap.set(text, { opacity: 0, y: 24 });
    gsap.set(groups, { opacity: 0, y: 40 });

    const GROUP_DURATION = 0.7;
    const GROUP_STAGGER = 0.18;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, duration: 0.8, ease: mainEase }, 0);
        tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: mainEase }, 0);
        groups.forEach((group, i) => {
          tl.to(
            group,
            { opacity: 1, y: 0, duration: GROUP_DURATION, ease: mainEase },
            i * GROUP_STAGGER
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
          <div
            ref={bgRef}
            className="ss-fn2-bg-wrap"
            style={{ left: pctX(263), top: pctY(150), right: BLEED_RIGHT, height: pctH(665) }}
          >
            <img
              src="/work/sui-sui/function2-bg-vector.png"
              alt=""
              aria-hidden="true"
              className="ss-fn2-bg"
            />
          </div>

          <div ref={textRef} className="ss-fn2-text" style={{ top: pctY(0), width: pctW(885) }}>
            <p className="ss-fn2-eyebrow">Function 2</p>
            <h2 className="ss-fn2-title">Product recognition</h2>
            <p className="ss-fn2-desc">
              Users photograph or scan the products already on their dressing table. The app
              recognises and sorts them automatically, so every routine is built around what
              someone owns, not what they&rsquo;re expected to buy.
            </p>
          </div>

          {PHONES.map(({ key, src, alt, x, y, w, h, flushRight, objectPosition, badge }, i) => {
            // badge 是 group（手機）的子元素，它的 left/top/width 百分比是
            // 相對「手機自己的寬高」解析，不是相對整個 1507 參考框——
            // 不能再用 pctX/pctY（那兩個函式除的是 FRAME_W/FRAME_H），
            // 要另外除以 w/h。
            const badgeLeftPct = `${((badge.offsetX / w) * 100).toFixed(4)}%`;
            const badgeTopPct = `${((badge.offsetY / h) * 100).toFixed(4)}%`;
            const badgeWidthPct = `${((badge.w / w) * 100).toFixed(4)}%`;
            return (
              <div
                key={key}
                ref={(el) => { groupRefs.current[i] = el; }}
                className="ss-fn2-group"
                style={{
                  ...(flushRight ? { right: BLEED_RIGHT } : { left: pctX(x) }),
                  top: pctY(y),
                  width: pctW(w),
                  height: pctH(h),
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  className="ss-fn2-phone"
                  style={objectPosition ? { objectPosition } : undefined}
                />
                <span
                  className="ss-fn2-badge"
                  style={{
                    left: badgeLeftPct,
                    top: badgeTopPct,
                    width: badgeWidthPct,
                    fontWeight: badge.bold ? 600 : 400,
                    fontSize: badge.bold ? '1.0617cqw' : '0.9291cqw',
                  }}
                >
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
