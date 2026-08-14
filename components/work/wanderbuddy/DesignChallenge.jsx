'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

const CARDS = [
  {
    tone: 'strategy',
    number: '01',
    label: 'STRATEGY',
    title: 'Ask only what the algorithm needs',
    body: "The recommendation engine needs three things: who you are, how to reach you, and what you're into. Photo, bio and location move to the profile page — filled in later, once the app has earned it. Sign-up became a gate to pass, not a form to complete.",
  },
  {
    tone: 'user',
    number: '02',
    label: 'THE USER',
    title: 'Let people pick their own fastest way in',
    body: 'For someone who just landed in a new city, this is one of ten apps they downloaded that week. Trust is low and patience is lower. Apple, Google and email means nobody is forced through a password and a verification wait just to look around.',
  },
  {
    tone: 'look',
    number: '03',
    label: 'THE LOOK',
    title: 'Make the last step feel like choosing, not filling',
    body: "Eight categories, each with its own saturated color and simple character. On the final screen users aren't entering data, they're picking what they like. The palette does the brand's work too: this is an app about going out, and it should look like it.",
  },
];

export default function DesignChallenge() {
  // 標題/大標/說明段落用預設 60ms stagger 的標準進場；三張卡片另外用
  // 120ms stagger（使用者明確指定跟預設不同）。兩組各自掛一個 hook。
  const headerRef = useStandardEntrance('.wb-entrance-item');
  const cardsRef = useStandardEntrance('.wb-dc-card', { stagger: 0.12 });

  return (
    <section className="wb-section">
      <div className="wb-section-inner" ref={headerRef}>
        <p className="wb-dc-eyebrow wb-entrance-item">Design Challenge</p>
        <h2 className="wb-dc-heading wb-entrance-item">
          Every question you ask is a reason for someone to leave.
        </h2>
        <p className="wb-dc-desc wb-entrance-item">
          WanderBuddy needs to know what you&apos;re into before it can match you with anyone. The
          challenge was getting that without turning the front door into a form.
        </p>
      </div>

      <div className="wb-section-inner wb-dc-cards" ref={cardsRef}>
        {CARDS.map((card) => (
          <article className="wb-dc-card" data-tone={card.tone} key={card.number}>
            <div className="wb-dc-badge">{card.number}</div>
            <p className="wb-dc-label">{card.label}</p>
            <h3 className="wb-dc-card-title">{card.title}</h3>
            <p className="wb-dc-card-body">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
