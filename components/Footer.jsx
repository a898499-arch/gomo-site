'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLenis } from './LenisProvider';

// 箭頭射出的總長，要跟 globals.css 的 --btt-launch 一致
const BTT_LAUNCH_MS = 450;

// §6.4：進場動畫、底線擦除 hover 是後續動效搬遷階段才加——這裡先是結構+最終視覺狀態
// （分隔線滿寬、大標直接顯示，不套 reveal-mask 的隱藏初始態，避免動畫 JS 還沒接上時內容卡住不顯示）。
export default function Footer() {
  const lenis = useLenis();

  // 點擊時箭頭「射出」：舊的往上飛出、新的從下方遞補（規格書 §6.4）。
  // 用一個短暫的 data 屬性驅動純 CSS 動畫，而不是用 state——state 會讓整個
  // Footer 重新 render，這裡只需要動一個 class。動畫結束就把屬性拿掉，
  // 下次點擊才能再播一次。
  const bttRef = useRef(null);

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
    <footer className="site-footer">
      <div className="footer-frame">
        <div className="footer-top">
          <div className="footer-headline-group">
            <h2 className="footer-headline">Get An Idea?</h2>
            <a
              href="mailto:a898499@gmail.com?subject=Let's%20talk"
              className="footer-cta link-underline"
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

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <div className="footer-brief">
            <p className="brief-label">(Brief)</p>
            <p className="brief-bio">
              Maida Hu is a Taiwanese Indigenous designer and maker based in London. Working across
              industrial, product, and reflective design, she uncovers problems others overlook,
              often around health, women&apos;s health, and the environment, and explores identity
              and environment through craft and material.
            </p>
            <a
              href="/cv/cv.pdf"
              download="Maida-Hu-CV-2026.pdf"
              className="cv-download link-underline"
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
              <ul>
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

            <div className="footer-col">
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

            <div className="footer-col contacts">
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
