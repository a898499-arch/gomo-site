'use client';

import OnboardingDemo from './OnboardingDemo';

// node 545:110（「FUNCTION 1 / Setup in three questions」）。2026-08-22
// 第四輪：拿掉 #f3f4f8 背景帶（你的指示——只留手機動畫，背景維持頁面
// 底色），連帶不再需要「灰色槽位」那個 Figma 絕對座標框，改成一般文件
// 流：標題區（跟 Background/DesignChallenge 等區塊同一套 .ss-section-
// inner 置中寫法，不再用 pctX/pctY 絕對定位）+ 54px 間距 + 固定 676px
// 高的手機（也是你的指示——不再跟著 Figma 灰色槽位的比例縮放）。
export default function Function1() {
  return (
    <section className="ss-section">
      <div className="ss-section-inner ss-fn1-heading">
        <p className="ss-fn1-eyebrow">Function 1</p>
        <div className="ss-fn1-title-group">
          <h2 className="ss-fn1-title">Setup in three questions</h2>
          <p className="ss-fn1-desc">
            A few questions at first launch shape which routines get recommended. Font size and
            reminder time are set here too, the two things most likely to stop an older adult
            before they&rsquo;ve even begun.
          </p>
        </div>
      </div>

      <div className="ss-fn1-phone-wrap">
        <OnboardingDemo />
      </div>
    </section>
  );
}
