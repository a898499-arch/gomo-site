'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from './LenisProvider';
import { mainEase } from '@/lib/ease';

// 箭頭射出的總長，要跟 globals.css 的 --btt-launch 一致
const BTT_LAUNCH_MS = 450;

// §6.4 頁腳。底線擦除 hover 已於 2026-08-29 完成；進場序列於 2026-08-30 從
// prototypes/home.html 的 JS 2311–2358 原樣移植過來（見下方 runEntrance）。
//
// ⚠️ 隨進場一起補回來的初始態（在 globals.css）：
//   .footer-divider 的 transform: scaleX(0)
//   .footer-headline .reveal-inner 的 translateY(100%)
// 搬 Footer 那一輪刻意拿掉它們，是因為當時進場的 JS 還沒移植，留著會讓分隔線
// 與大標永遠隱形。現在 JS 在了，初始態就必須在——兩者是一組，不要只改一邊。
export default function Footer() {
  const lenis = useLenis();

  // 點擊時箭頭「射出」：舊的往上飛出、新的從下方遞補（規格書 §6.4）。
  // 用一個短暫的 data 屬性驅動純 CSS 動畫，而不是用 state——state 會讓整個
  // Footer 重新 render，這裡只需要動一個 class。動畫結束就把屬性拿掉，
  // 下次點擊才能再播一次。
  const bttRef = useRef(null);
  const footerRef = useRef(null);

  // ---------- 進場序列（原型 prototypes/home.html 的 JS 2311–2358，原樣照抄）----------
  // 時間軸的每一個位置與時長都是原型調過的值，不要動。
  //
  // ⚠️ 一次載入只演一次：Footer 住在 root layout，換頁不會 unmount，所以
  // IntersectionObserver 一 disconnect 就不會再武裝。原型是單頁沒有這個情境；
  // 演完之後元素停在最終狀態（inline style），後續頁面看到的就是最終畫面。
  // 這是刻意的——每換一頁就重演一次頁腳會很吵。
  useEffect(() => {
    const footer = footerRef.current;
    const backToTop = bttRef.current;
    if (!footer || !backToTop) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const headline = footer.querySelector('[data-headline]');
    const divider = footer.querySelector('[data-divider]');
    const animateTargets = footer.querySelectorAll('[data-animate]');
    const sitemapLinks = footer.querySelectorAll('#sitemap-list li');

    function runEntrance() {
      if (reduceMotion) return;

      gsap.set(animateTargets, { y: 24, opacity: 0 });
      gsap.set(sitemapLinks, { y: 24, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: mainEase } });

      tl.to(headline, { y: '0%', duration: 0.9 }, 0)
        .to(footer.querySelector('.footer-cta'), { y: 0, opacity: 1, duration: 0.6 }, 0.2)
        .to(divider, { scaleX: 1, duration: 0.8 }, 0.32)
        .to(footer.querySelector('.brief-label'), { y: 0, opacity: 1, duration: 0.6 }, 0.42)
        .to(footer.querySelector('.brief-bio'), { y: 0, opacity: 1, duration: 0.6 }, 0.42)
        .to(footer.querySelector('.cv-download'), { y: 0, opacity: 1, duration: 0.6 }, 0.52)
        .to(sitemapLinks, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.56)
        .to(footer.querySelectorAll('.footer-col')[1], { y: 0, opacity: 1, duration: 0.6 }, 0.62)
        .to(footer.querySelector('.footer-col.contacts'), { y: 0, opacity: 1, duration: 0.6 }, 0.68)
        .to(backToTop, { y: 0, opacity: 1, rotate: 0, duration: 0.6 }, 0.76);
    }

    if (reduceMotion) {
      gsap.set(animateTargets, { y: 0, opacity: 1 });
      gsap.set(sitemapLinks, { y: 0, opacity: 1 });
      gsap.set(divider, { scaleX: 1 });
      return undefined;
    }

    gsap.set(backToTop, { rotate: -90, opacity: 0 });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runEntrance();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0 }
    );
    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  function handleBackToTop() {
    const btn = bttRef.current;
    if (btn) {
      btn.removeAttribute('data-launching');
      // 強制回流，否則同一幀內移除再加上不會重新觸發動畫
      void btn.offsetWidth;
      btn.setAttribute('data-launching', 'true');
      window.setTimeout(() => btn.removeAttribute('data-launching'), BTT_LAUNCH_MS);
    }
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-frame">
        <div className="footer-top">
          <div className="footer-headline-group">
            <h2 className="footer-headline">
              <span className="reveal-mask">
                <span className="reveal-inner" data-headline>
                  Get An Idea?
                </span>
              </span>
            </h2>
            <a
              href="mailto:a898499@gmail.com?subject=Let's%20talk"
              className="footer-cta link-underline"
              data-animate
              aria-label="Email Maida to start a conversation"
            >
              <span className="cta-text">Let&apos;s Talk!</span>
              <span className="cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <button
            ref={bttRef}
            className="back-to-top"
            type="button"
            data-animate
            aria-label="Back to top"
            onClick={handleBackToTop}
          >
            {/* 兩支箭頭：預設只看得見第一支，第二支等在下方框外。
                .btt-icon-wrap 的 overflow:hidden 就是為這個留的。 */}
            <span className="btt-icon-wrap">
              <svg className="btt-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <svg className="btt-icon btt-icon--next" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </span>
          </button>
        </div>

        <div className="footer-divider" data-divider aria-hidden="true" />

        <div className="footer-bottom">
          <div className="footer-brief">
            <p className="brief-label" data-animate>(Brief)</p>
            <p className="brief-bio" data-animate>
              Maida Hu is a Taiwanese Indigenous designer and maker based in London. Working across
              industrial, product, and reflective design, she uncovers problems others overlook,
              often around health, women&apos;s health, and the environment, and explores identity
              and environment through craft and material.
            </p>
            <a
              href="/cv/cv.pdf"
              download="Maida-Hu-CV-2026.pdf"
              className="cv-download link-underline"
              data-animate
              aria-label="Download CV as PDF"
            >
              {/* 垂直遮罩交換（規格書 §6.4）。與 About 頁 .amd-text-wrap
                  同一套技法（各自的 class，機制與時間刻意相同）。
                  ⚠️ 第二層要 aria-hidden：兩層文字都在 DOM 裡，不隱藏的話
                  螢幕閱讀器會把「CV Download Download PDF (33KB)」連著唸。
                  連結本身有 aria-label，無障礙名稱由那裡提供。
                  ⚠️ 檔案大小是實測值：public/cv/cv.pdf = 34,170 bytes。
                  規格原文寫「(?MB)」，但這個檔連 0.1MB 都不到，寫成
                  (0.03MB) 會很怪，所以改用 KB（已回報）。換檔案時記得更新。 */}
              <span className="cv-text-wrap">
                <span className="cv-text-default">CV Download</span>
                <span className="cv-text-hover" aria-hidden="true">
                  Download PDF (33KB)
                </span>
              </span>
              <span className="cv-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </span>
            </a>
          </div>

          <div className="footer-links">
            <nav className="footer-col" aria-label="Sitemap">
              <h3>Sitemaps</h3>
              <ul id="sitemap-list">
                <li><Link href="/" className="link-underline">Home</Link></li>
                <li><Link href="/work" className="link-underline">Works</Link></li>
                <li><Link href="/about" className="link-underline">About</Link></li>
                {/* Playground 尚未開放（規格書 §6.4）。
                    ⚠️ tooltip 掛在 <li> 上而不是 <a> 上：<a> 有
                    pointer-events:none（規格要求保留），它自己收不到任何滑鼠
                    事件，:hover 永遠不會成立。事件會穿透到父層 <li>，所以
                    hover 判斷放在 <li>。這同時也讓「停用的連結不該有底線動畫」
                    自動成立——底線的 hover 規則是掛在 .link-underline:hover
                    上的，而它永遠不會被觸發。
                    ⚠️ tooltip 本身 aria-hidden，另外補一段 .visually-hidden
                    的「Coming soon」在連結裡：螢幕閱讀器讀不到 tooltip 的
                    視覺提示，要用文字補上，否則只會聽到「Playground，已停用」
                    而不知道原因。 */}
                <li className="playground-item">
                  <a
                    href="/playground"
                    className="link-underline playground-link"
                    aria-disabled="true"
                    tabIndex={-1}
                    onClick={(e) => e.preventDefault()}
                  >
                    Playground
                    <span className="visually-hidden"> (Coming soon)</span>
                  </a>
                  <span className="playground-tip" aria-hidden="true">
                    Coming soon
                  </span>
                </li>
              </ul>
            </nav>

            <div className="footer-col" data-animate>
              <h3>Socials</h3>
              <ul>
                <li>
                  <a
                    href="https://www.linkedin.com/in/lin-wei-ting-h-8a9732343"
                    className="link-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile (opens in a new tab)"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col contacts" data-animate>
              <h3>Contacts</h3>
              <ul>
                <li>London, UK</li>
                <li>
                  <a href="mailto:a898499@gmail.com" aria-label="Email a898499@gmail.com">
                    a898499@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
