'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 座標/旋轉角度取自 Figma node 491:391，相對於 540x499px 的 .Body 容器。
// 顏色是我從畫面截圖比對回推的（Figma 原稿的圓點是個別圖片素材，沒有直接
// 給 hex），跟 Color 區塊的 8 個分類色一一對應。
const BEFORE_STEPS = [
  { label: 'Enter email', x: 232.12, y: 26, rotate: 7, color: '#FF0005' },
  { label: 'Set password', x: 90, y: 106, rotate: -5, color: '#FF9E00' },
  { label: 'Wait for verification', x: 144.98, y: 163, rotate: 4, color: '#FBD500' },
  { label: 'Add your name', x: 80, y: 272.39, rotate: -8, color: '#87FA89' },
  { label: 'Upload photo', x: 249.96, y: 319, rotate: 6, color: '#00DDF9' },
  { label: 'Write a bio', x: 101, y: 383.65, rotate: -4, color: '#FF7BFF' },
  { label: 'Pick interests', x: 273.97, y: 410, rotate: 5, color: '#003AFF' },
];

const AFTER_FLOW = [
  { type: 'step', label: 'One tap: Apple / Google / Email', color: '#003AFF' },
  { type: 'arrow' },
  { type: 'note', label: 'no password, no waiting' },
  { type: 'arrow' },
  { type: 'step', label: 'Pick your interests', color: '#FF7BFF' },
  { type: 'arrow' },
  { type: 'step', label: 'Home, already personalized', color: '#87FA89' },
];

const CARD_STAGGER = 0.08; // 80ms
const CARD_DURATION = 0.6; // 600ms，最後 180ms 是落定段（見下方 keyframes）
const HEADER_DELAY = 0.8; // BEFORE 標題進場(600ms) + 200ms 間隔才開始掉第一張卡

export default function BeforeAfter() {
  const sectionRef = useRef(null);
  const beforeHeaderRef = useRef(null);
  const cardRefs = useRef([]);
  const afterHeaderRef = useRef(null);
  const afterFlowRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const beforeHeaderItems = beforeHeaderRef.current.querySelectorAll('.wb-entrance-item');
    const cards = cardRefs.current.filter(Boolean);
    const afterHeaderItems = afterHeaderRef.current.querySelectorAll('.wb-entrance-item');
    const afterFlowItems = afterFlowRef.current.querySelectorAll('.wb-ba-flow-item');
    const allItems = [...beforeHeaderItems, ...cards, ...afterHeaderItems, ...afterFlowItems];

    // rotate 交給 GSAP 自己管理（不是寫死在 CSS transform），這樣接下來對同一個
    // 元素 animate y 的時候，GSAP 會把 rotate 跟 translateY 合成同一個 transform，
    // 不會互相打架、也不會在動畫途中把 rotate 重置掉。
    cards.forEach((card, i) => {
      gsap.set(card, { rotation: BEFORE_STEPS[i].rotate });
    });

    if (reduceMotion) {
      gsap.set(allItems, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(beforeHeaderItems, { y: 24, opacity: 0 });
    gsap.set(cards, { y: -80, opacity: 0 });
    gsap.set(afterHeaderItems, { y: 24, opacity: 0 });
    gsap.set(afterFlowItems, { y: 24, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: mainEase } });

        // BEFORE：卡片背景已經在畫面上了（bg 是靜態 CSS），這裡只動標題+副標
        tl.to(beforeHeaderItems, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0);

        // 7 張卡片依序「掉下來」：-80px 落到定位，最後 180ms 超過 4px 再回彈定位
        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              keyframes: {
                '0%': { y: -80, opacity: 0 },
                '70%': { y: 4, opacity: 1 },
                '100%': { y: 0, opacity: 1 },
              },
              duration: CARD_DURATION,
            },
            HEADER_DELAY + i * CARD_STAGGER
          );
        });

        // 最後一張卡落定的時間點，AFTER 從這裡才開始（不重疊）
        const afterStart = HEADER_DELAY + (cards.length - 1) * CARD_STAGGER + CARD_DURATION;

        tl.to(afterHeaderItems, { y: 0, opacity: 1, duration: 0.5 }, afterStart);
        tl.to(
          afterFlowItems,
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
          afterStart + 0.5
        );
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section className="wb-section" ref={sectionRef}>
      <div className="wb-section-inner wb-ba-grid">
        <div className="wb-ba-card" data-card="before">
          <div ref={beforeHeaderRef}>
            <p className="wb-ba-title wb-entrance-item">BEFORE</p>
            <p className="wb-ba-subtitle wb-entrance-item">Email only · 7 steps</p>
          </div>
          <div className="wb-ba-body">
            {BEFORE_STEPS.map((step, i) => (
              <div
                className="wb-ba-pill"
                key={step.label}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{ left: step.x, top: step.y }}
              >
                <span className="wb-ba-pill-dot" style={{ background: step.color }} />
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <div className="wb-ba-card" data-card="after">
          <div ref={afterHeaderRef}>
            <p className="wb-ba-title wb-entrance-item">AFTER</p>
            <p className="wb-ba-subtitle wb-entrance-item">Three ways in · 3 steps</p>
          </div>
          <div className="wb-ba-body">
            <div className="wb-ba-flow" ref={afterFlowRef}>
              {AFTER_FLOW.map((item, i) => {
                if (item.type === 'arrow') {
                  return (
                    <span className="wb-ba-flow-arrow wb-ba-flow-item" aria-hidden="true" key={i}>
                      ↓
                    </span>
                  );
                }
                if (item.type === 'note') {
                  return (
                    <p className="wb-ba-flow-label wb-ba-flow-item" key={i}>
                      {item.label}
                    </p>
                  );
                }
                return (
                  <div className="wb-ba-pill wb-ba-flow-item" key={i}>
                    <span className="wb-ba-pill-dot" style={{ background: item.color }} />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
