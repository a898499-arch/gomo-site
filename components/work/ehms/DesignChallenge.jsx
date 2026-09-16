'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:177「Design challenge」，1088.485×832，y=2761.576。
//
// ⚠️ 912:194 與 912:204 在 Figma 都是「四個項目塞在單一 text 圖層」，
// 用 • 字元手打、項目之間夾一個 10px 的空行。這裡拆成真正的
// <ul><li>×4（使用者確認的拆法）——螢幕閱讀器會報出「清單，四個項目」，
// 直接丟一個 <p> 的話那個結構就沒了。
export default function DesignChallenge() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-challenge-h">
      <h2 className="eh-head eh-in" id="eh-challenge-h">
        <span className="eh-sec-num">02 Design Challenge</span>
        <span className="eh-sec-title">What made this hard?</span>
      </h2>

      <div className="eh-body eh-in">
        <p>
          I started by reading the Android design guidelines, then tried to draw the screens myself.{' '}
          <strong>Starting from nothing was much harder than I expected,</strong> so I went looking
          for products to learn from. I could not find any. A phone app that controls a hospital bed
          has no obvious model, and I was not sure whether it should look like a remote control, a
          health app, or a clinical dashboard.
        </p>
        <p>
          The product made this harder. The bed produces a lot of data and all of it matters for
          care. The home screen had to work as a remote control and as a status view at the same
          time, and the users range from nurses to family members.
        </p>
      </div>

      <div className="eh-dc-cards">
        <article className="eh-dc-card eh-in">
          <img
            className="eh-dc-icon"
            src="/work/ehms/icon-zero.svg"
            width={88}
            height={73}
            loading="lazy"
            alt=""
          />
          <h3>Starting from zero</h3>
          <ul>
            <li>
              No one on the team had designed an app before, including me.{' '}
              <strong>No one could say whether a design was right.</strong>
            </li>
            <li>I could not find a similar product to learn from.</li>
            <li>I put every style I liked into the app. The screens did not hold together.</li>
            <li>I set the first button sizes and spacing by eye, with no standard to point to.</li>
          </ul>
        </article>

        <article className="eh-dc-card eh-in">
          <img
            className="eh-dc-icon"
            src="/work/ehms/icon-toomanyjobs.svg"
            width={51}
            height={81}
            loading="lazy"
            alt=""
          />
          <h3>One screen, too many jobs</h3>
          <ul>
            <li>The home screen had to be a remote control and a status view at the same time.</li>
            <li>
              The bed reports posture, pressure distribution, current mode, cycle time, pressure
              relief level and connection status. All of it matters for care.
            </li>
            <li>
              Users range from nurses to family members, and there is one interface for all of them.
            </li>
            <li>
              The structure was set before I started. The first level listed the beds, and status sat
              one level down.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
