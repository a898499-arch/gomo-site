'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:419「TODAY」，1085×231，y=10624。
// 912:425 結尾有一個空的 <p>（Figma 的空行殘留），不做。
export default function Today() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-today-h">
      <h2 className="eh-head eh-in" id="eh-today-h">
        <span className="eh-sec-num">06 Today</span>
        <span className="eh-sec-title">What would I do now?</span>
      </h2>

      <div className="eh-body eh-in">
        <p>
          Working on this project, I learned that designing an ecosystem is very different from
          designing a single app. Every decision can affect other products, so I had to think
          carefully about how everything connects. I also learned that different users think in very
          different ways &mdash; a resident just wants to finish a task, while a management officer
          needs to see the full picture. At the same time, working with multiple teams taught me that
          clear communication and good documentation are just as important as the design itself. The
          project was not perfect when it launched, but seeing real people use it every day made all
          the effort feel worthwhile.
        </p>
      </div>
    </section>
  );
}
