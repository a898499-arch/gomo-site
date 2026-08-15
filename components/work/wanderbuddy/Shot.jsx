'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 491:60：4 支 iPhone 併排，滿版置中。維持標準進場（跟 Mock up
// 2/3/4 的「單純淡入」不同——Figma 上只有這張是置中的）。
export default function Shot() {
  const ref = useStandardEntrance();

  return (
    <section className="wb-section">
      <div className="wb-shot" ref={ref}>
        <img src="/work/wanderbuddy/shot.png" alt="Four iPhone screens from the WanderBuddy sign-up flow shown side by side" />
      </div>
    </section>
  );
}
