'use client';

import Link from 'next/link';
import { useLenis } from './LenisProvider';

// §6.4：進場動畫、底線擦除 hover 是後續動效搬遷階段才加——這裡先是結構+最終視覺狀態
// （分隔線滿寬、大標直接顯示，不套 reveal-mask 的隱藏初始態，避免動畫 JS 還沒接上時內容卡住不顯示）。
export default function Footer() {
  const lenis = useLenis();

  function handleBackToTop() {
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
            className="back-to-top"
            type="button"
            aria-label="Back to top"
            onClick={handleBackToTop}
          >
            <span className="btt-icon-wrap">
              <svg className="btt-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              <span className="cv-text-wrap">
                <span className="cv-text-default">CV Download</span>
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
                <li>
                  <a
                    href="/playground"
                    className="link-underline playground-link"
                    aria-disabled="true"
                    tabIndex={-1}
                    onClick={(e) => e.preventDefault()}
                  >
                    Playground
                  </a>
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
