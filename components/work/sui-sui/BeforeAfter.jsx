'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mainEase } from '@/lib/ease';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// node 545:247（正確 node id，你已確認；使用者原本給的 545:139 其實是
// 「Background」統計區塊）。比照 WanderBuddy Before & After 那頁的
// 「卡片各自散落＋掉落進場」寫法。座標/旋轉角度取自 Figma
// 545:248（Card / BEFORE，620×660）內部 Body（540×537）的相對座標。
const BEFORE_STEPS = [
  { label: 'A care home decides to run one', x: 80, y: 21, rotate: 7, color: '#f7546c' },
  { label: 'Contact the Shiseido cosmetic therapy team', x: 12, y: 109, rotate: -5, color: '#905500' },
  { label: 'Schedule, then wait', x: 155, y: 194, rotate: 4, color: '#00600a' },
  { label: 'Instructor travels out', x: 48, y: 277, rotate: -8, color: '#66b8c7' },
  { label: 'One 60-minute session', x: 207, y: 341, rotate: 6, color: '#004d82' },
  { label: 'Nothing to practise with after', x: 97, y: 408, rotate: -4, color: '#9d000f' },
];

const AFTER_FLOW = [
  { type: 'step', label: 'Open the app, any time', color: '#c90000' },
  { type: 'arrow' },
  { type: 'note', label: 'no booking, no waiting' },
  { type: 'arrow' },
  { type: 'step', label: "Today's 8–20 minute session", color: '#9d000f' },
  { type: 'arrow' },
  { type: 'note', label: 'follow along in the mirror' },
  { type: 'arrow' },
  { type: 'step', label: 'Done — and again tomorrow', color: '#00600a' },
];

const CARD_STAGGER = 0.08;
const CARD_DURATION = 0.6;
const HEADER_DELAY = 0.8;

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
    const beforeHeaderItems = beforeHeaderRef.current.querySelectorAll('.ss-entrance-item');
    const cards = cardRefs.current.filter(Boolean);
    const afterHeaderItems = afterHeaderRef.current.querySelectorAll('.ss-entrance-item');
    const afterFlowItems = afterFlowRef.current.querySelectorAll('.ss-ba-flow-item');
    const allItems = [...beforeHeaderItems, ...cards, ...afterHeaderItems, ...afterFlowItems];

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

        tl.to(beforeHeaderItems, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0);

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

        const afterStart = HEADER_DELAY + (cards.length - 1) * CARD_STAGGER + CARD_DURATION;

        tl.to(afterHeaderItems, { y: 0, opacity: 1, duration: 0.5 }, afterStart);
        tl.to(afterFlowItems, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, afterStart + 0.5);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section className="ss-section" ref={sectionRef}>
      <div className="ss-section-inner ss-ba-grid">
        <div className="ss-ba-card" data-card="before">
          <div ref={beforeHeaderRef}>
            <p className="ss-ba-title ss-entrance-item">BEFORE</p>
          </div>
          <div className="ss-ba-body">
            {BEFORE_STEPS.map((step, i) => (
              <div
                className="ss-ba-pill"
                key={step.label}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{ left: step.x, top: step.y }}
              >
                <span className="ss-ba-pill-dot" style={{ background: step.color }} />
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <div className="ss-ba-card" data-card="after">
          <div ref={afterHeaderRef}>
            <p className="ss-ba-title ss-entrance-item">AFTER</p>
          </div>
          <div className="ss-ba-body">
            <div className="ss-ba-flow" ref={afterFlowRef}>
              {AFTER_FLOW.map((item, i) => {
                if (item.type === 'arrow') {
                  return (
                    <span className="ss-ba-flow-arrow ss-ba-flow-item" aria-hidden="true" key={i}>
                      ↓
                    </span>
                  );
                }
                if (item.type === 'note') {
                  return (
                    <p className="ss-ba-flow-label ss-ba-flow-item" key={i}>
                      {item.label}
                    </p>
                  );
                }
                return (
                  <div className="ss-ba-pill ss-ba-flow-item" key={i}>
                    <span className="ss-ba-pill-dot" style={{ background: item.color }} />
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
