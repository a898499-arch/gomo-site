'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import Logo from './Logo';

// node 545:535（1440×600）。logo + 標語，跟 WanderBuddy 的 Project
// Footage 同一個結構。
export default function WorkFootage() {
  const ref = useStandardEntrance('.ss-entrance-item');

  return (
    <section className="ss-section ss-footage" ref={ref}>
      <div className="ss-section-inner">
        <div className="ss-footage-icon ss-entrance-item">
          <Logo aria-hidden="true" />
        </div>
        <p className="ss-footage-tagline ss-entrance-item">
          “Brings cosmetic therapy out of the classroom and into daily life for Elders.”
        </p>
      </div>
    </section>
  );
}
