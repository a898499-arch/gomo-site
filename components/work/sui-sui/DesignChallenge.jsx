'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:86（1279×790）。圖層名稱在 Figma 上拼錯（"Dsign challenge"），
// 標題文字以 Figma 實際內容為準（"Design Challenge"），你已經確認過。
const CARDS = [
  {
    key: 'making',
    number: '01',
    badgeBg: '#dce4ff',
    badgeColor: '#003aff',
    title: "What I'm making",
    paragraphs: [
      <>A mobile app that takes <strong>cosmetic therapy</strong>, a rehabilitation practice normally run as an instructor-led workshop, and turns it into a <strong>routine older adults can do alone at home</strong>.</>,
      <>For adults <strong>65+ with early to moderate dementia</strong>, and the <strong>family carers</strong> beside them.</>,
    ],
  },
  {
    key: 'works',
    number: '02',
    badgeBg: '#ffe0f4',
    badgeColor: '#ff3dbb',
    title: 'How it works',
    paragraphs: [
      <><strong>8–20 minute sessions</strong> shaped around a morning that already happens.</>,
      <><strong>Camera detection</strong> closes the gap between watching and doing; <strong>time-aware prompts</strong> surface the right routine at the right moment.</>,
      <>A <strong>senior-first interface</strong>, so starting costs one tap.</>,
    ],
  },
  {
    key: 'change',
    number: '03',
    badgeBg: '#ffebd6',
    badgeColor: '#ff7a00',
    title: 'What it should change',
    paragraphs: [
      <>Training that ran <strong>once, when an institution arranged it</strong>, now runs <strong>daily, when the user decides</strong>.</>,
      <>More repetitions of fine motor and cognitive training, and a <strong>reason to come back tomorrow</strong>.</>,
      <>Less <strong>caregiver burden</strong>, more <strong>daily independence</strong>.</>,
    ],
  },
];

export default function DesignChallenge() {
  const ref = useStandardEntrance('.ss-dc-card');

  return (
    <section className="ss-section">
      <div className="ss-section-inner">
        <p className="ss-eyebrow">Design Challenge</p>
        <h2 className="ss-dc-heading">Rehabilitation only works if it happens often.</h2>
        <p className="ss-dc-body">
          Cosmetic therapy already works, it just only happens when an instructor can be in the
          room. SUI SUI moves it onto a phone, so it can happen every morning instead.
        </p>

        <div className="ss-dc-grid" ref={ref}>
          {CARDS.map(({ key, number, badgeBg, badgeColor, title, paragraphs }) => (
            <div className="ss-dc-card" key={key}>
              <span className="ss-dc-badge" style={{ background: badgeBg, color: badgeColor }}>
                {number}
              </span>
              <h3 className="ss-dc-card-title">{title}</h3>
              {paragraphs.map((p, i) => (
                <p className="ss-dc-card-text" key={i}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
