'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// 這裡刻意例外：Raleway/Jost 是要展示的對象本身（字體展示區），
// 所以確實要套用真正的 Raleway/Jost 字重（跟其他區塊「不小心」用到
// Jost 的狀況不同）。字體透過 app/layout.js 的 <link> 全域載入。
export default function Typography() {
  const ref = useStandardEntrance('.wb-entrance-item');

  return (
    <section className="wb-section" ref={ref}>
      <div className="wb-section-inner">
        <p className="wb-type-eyebrow wb-entrance-item">Typography</p>
        <div className="wb-type-grid">
          <div className="wb-entrance-item">
            <p className="wb-type-specimen-name" data-font="raleway">Raleway</p>
            <p className="wb-type-specimen-desc">
              Raleway has clean, structured letterforms, making it well-suited for headlines that
              need strong visual presence
            </p>
          </div>
          <div className="wb-entrance-item">
            <p className="wb-type-specimen-name" data-font="jost">Jost</p>
            <p className="wb-type-specimen-desc">
              Jost carries a lighter, more rhythmic feel, making it ideal for subtitles and body
              text, giving the type hierarchy room to breathe without feeling heavy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
