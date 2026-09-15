'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import DesignSystem from './DesignSystem';

// Figma node 912:205「 Design Process」，1088.485×3173，y=3643.576。
// 全頁最高的區塊。子區依 Figma 的 y 座標排列：
//   +85   引言           +134  Step 1   +318  Step 2   +496  Step 3
//   +686  DESIGN SYSTEM  +1403 Step 4   +1604 流程圖   +2483 Key Features
// ⚠️ +2483 還有一個空的 overview frame（912:364，1085×41，無內容），略過。
//
// 流程圖（912:272）是整塊匯出的 SVG。圖裡的文字對螢幕閱讀器與搜尋引擎
// 都讀不到，所以下面補一份視覺隱藏的完整文字副本（CLAUDE.md 的無障礙
// 補償規則）。圖裡的八個小圖示不用另外匯，包在這張 SVG 裡。
export default function DesignProcess() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-process-h">
      <h2 className="eh-head eh-in" id="eh-process-h">
        <span className="eh-sec-num">03 Design Process</span>
        <span className="eh-sec-title">How did we build it?</span>
      </h2>

      <p className="eh-process-intro eh-in">
        The company had no design process. We worked one out as we went, and the first attempt did
        not hold up.
      </p>

      <div className="eh-steps">
        <div className="eh-in">
          <h3 className="eh-sub-title">Step 1 &mdash; Setting the constraints</h3>
          <div className="eh-body">
            <p>
              My manager knew the customers. The beds go into long-term care homes, and the people
              using the app are often elderly. He asked for larger type and stronger contrast.
            </p>
            <p>
              <strong>I turned that into something the team could build against:</strong> minimum
              type sizes, contrast ratios and touch target sizes, based on the Android design
              guidelines.
            </p>
          </div>
        </div>

        <div className="eh-in">
          <h3 className="eh-sub-title">Step 2 &mdash; The first attempt</h3>
          <div className="eh-body">
            <p>
              I read the Android guidelines and started drawing. Designing from nothing was harder
              than I expected, so I looked for similar products to work from. A phone app that
              controls a hospital bed had no obvious model, so I borrowed from any style I liked. The
              screens did not hold together.
            </p>
            <p>
              The cost showed up in the work.{' '}
              <strong>
                Every small change reopened a discussion, and every new button was drawn from
                scratch.
              </strong>
            </p>
          </div>
        </div>

        <div className="eh-in">
          <h3 className="eh-sub-title">Step 3 &mdash; Building a design system</h3>
          <div className="eh-body">
            <p>
              I proposed a design system covering colour, type sizes, button styles and spacing. The
              engineers agreed straight away.{' '}
              <strong>
                Redrawing a button meant rewriting the code behind it, so we were paying for the same
                problem from two directions.
              </strong>
            </p>
            <p>
              It took several rounds. I worked from published guidance, brought a version to the
              team, and revised it again.
            </p>
          </div>
        </div>

        <div className="eh-in eh-ds-slot">
          <DesignSystem />
        </div>

        <div className="eh-in">
          <h3 className="eh-sub-title">Step 4 &mdash; Designing and iterating</h3>
          <div className="eh-body">
            <p>
              The engineering lead defined how the pages connected. I designed the screens inside
              that structure.
            </p>
            <p>
              Each round ran the same way. I took the designs to the two engineers to check what
              could be built, and we cut or simplified the interface animations that could not.
              Colleagues tried the build. Feedback from hospitals came back through the sales team
              and my manager. I went to a hospital once and watched doctors and nurses use it.
            </p>
            <p>The app went through 20 versions.</p>
          </div>
        </div>
      </div>

      <figure className="eh-in" style={{ margin: 0 }}>
        <img
          className="eh-diagram"
          src="/work/ehms/design-process-diagram.svg"
          width={1086}
          height={850}
          loading="lazy"
          decoding="async"
          alt="eHMS 設計流程圖：Step 1 定義規格、Step 2 第一次嘗試、Step 3 設計系統，接著 Step 4 設計與迭代的四站循環重複 20 次，最後 Step 5 上架。"
        />
        {/* 圖內文字的完整純文字副本。視覺上隱藏，螢幕閱讀器與搜尋引擎照樣讀得到。 */}
        <figcaption className="visually-hidden">
          <p>
            Design Process. Legend: a filled marker means my call; a half-filled marker means shared
            with my manager or the team.
          </p>
          <p>
            What it cost: Every small change reopened a discussion. Every new button was drawn from
            scratch.
          </p>
          <ul>
            <li>
              Step 1, Define the specs. My manager set the constraints. I turned them into type and
              touch sizes.
            </li>
            <li>
              Step 2, First attempt. No similar product to learn from. I borrowed any style I liked.
            </li>
            <li>
              Step 3, Design system. I proposed the colour, type and spacing rules. The engineers
              agreed.
            </li>
            <li>
              Step 4, Design and iterate, repeated 20 times: Design screens (me) → Engineering check
              (2 engineers) → Internal try-out (colleagues) → Hospital feedback (via sales and
              manager) → next version. Page flow was defined by my manager. I designed the screens
              inside it.
            </li>
            <li>Step 5, Release. Google Play, 2022.</li>
          </ul>
        </figcaption>
      </figure>

      <div className="eh-in" style={{ marginTop: 'var(--eh-gap-sm)' }}>
        <h3 className="eh-green-label">Key Features</h3>
        <div className="eh-panel">
          <img
            className="eh-keyfeatures-shot"
            src="/work/ehms/key-features.webp"
            srcSet="/work/ehms/key-features.webp 1x, /work/ehms/key-features@2x.webp 2x"
            width={1034}
            height={631}
            loading="lazy"
            decoding="async"
            alt="eHMS App 的主題圖：深綠底上排列多支手機畫面，分別是遙控器、臥姿紀錄、壓力分布圖與警示通知。"
          />
        </div>
      </div>
    </section>
  );
}
