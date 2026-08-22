'use client';

import OnboardingDemo from './OnboardingDemo';

// node 545:110（1440×918，「FUNCTION 1 / Setup in three questions」）。
// 2026-08-22：get_design_context 重讀的精確值——背景 #f3f4f8（545:111，
// left0 top218 w1440 h700）；標題區（545:112~116）eyebrow「FUNCTION 1」
// 顏色 #b8001f、Poppins SemiBold 24px，跟標題+說明那組（545:114，內部
// gap16）中間隔 6px（545:112 的 gap）；標題 Poppins SemiBold 36px，
// 說明 Poppins Regular 20px。灰色動畫槽（545:117）left574 top274 w283
// h564——這是 onboarding 動畫現在真正要放的地方（原本被 AnimationPlaceholder
// 擋著，現在換成 OnboardingDemo，見該檔案檔頭關於縮放策略的說明）。
const FRAME_W = 1440;
const FRAME_H = 918;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctY = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;
const pctW = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctH = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;

export default function Function1() {
  return (
    <section className="ss-section">
      <div className="page-container">
        <div className="ss-fn1-frame" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
          <div className="ss-fn1-band" style={{ top: pctY(218), height: pctH(700) }} />

          <div className="ss-fn1-heading" style={{ left: pctX(40), width: pctW(1360) }}>
            <p className="ss-fn1-eyebrow">Function 1</p>
            <div className="ss-fn1-title-group">
              <h2 className="ss-fn1-title">Setup in three questions</h2>
              <p className="ss-fn1-desc">
                A few questions at first launch shape which routines get recommended. Font size
                and reminder time are set here too, the two things most likely to stop an older
                adult before they&rsquo;ve even begun.
              </p>
            </div>
          </div>

          <div
            className="ss-fn1-slot"
            style={{ left: pctX(574), top: pctY(274), width: pctW(283), height: pctH(564) }}
          >
            <OnboardingDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
