'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// 04 KEY DECISIONS。在 Figma 是四個平行的 frame，只有第一個帶區塊標頭：
//   912:372 主區 + Before 對照圖   y=6951   1085×890
//   912:388 ↳ Animation            y=7891   1085×346
//   912:394 ↳ Thumb zone           y=8287   1085×767
//   912:405 ↳ 未採用的提案          y=9104   1085×910
//
// ⚠️ 兩件刻意「沒做」的事：
// 1. Animation 的灰底塊（912:393）在 Figma 只有 218px 高，其餘三塊是 639。
//    照 Figma 做，不替還不存在的內容預留空間——第三輪放五個狀態動畫
//    （無人在床 4 幀／壓力重新分配 3／開始中 6／背部減壓 4／臀部減壓 6，
//    姿態偵測那個不做）時再一起調高度。使用者裁示。
// 2. Before 這裡只有「Before」一張。第二輪才接 AERO V 那個對照推桿，
//    After 的兩張圖在另一個檔案 j4saimg2oJWL5tUkBh5Bww 的 node 4020:5191。
export default function KeyDecisions() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-decisions-h">
      <h2 className="eh-head eh-in" id="eh-decisions-h">
        <span className="eh-sec-num">04 Key Decisions</span>
        <span className="eh-sec-title">What did I decide?</span>
      </h2>

      {/* ---- 患者優先的首頁 + Before 對照圖 ---- */}
      <div className="eh-in">
        <h3 className="eh-sub-title">Putting the patient, not the device, on the home screen</h3>
        <div className="eh-body">
          <p>
            The sales team came back from a demo. Reaching the controls took one step too many,
            because the home screen opened on a list of beds. We talked it through and agreed the
            product was moving towards individual users rather than ward management.{' '}
            <strong>I proposed opening straight into the control screen for one bed.</strong> The
            home screen stopped being a list of equipment and became a view of one person.
          </p>
        </div>
        <figure className="eh-kd-figure">
          <div className="eh-panel">
            <span className="eh-chip">Before</span>
            <div className="eh-before-shots">
              <img
                src="/work/ehms/before-list.webp"
                srcSet="/work/ehms/before-list.webp 1x, /work/ehms/before-list@2x.webp 2x"
                width={271}
                height={562}
                loading="lazy"
                decoding="async"
                alt="改版前的首頁：AgiCare 標題列下方是一份床位清單，每一列顯示住民照片、床號與狀態文字，必須再點一層才會進到遙控畫面。"
              />
              <img
                src="/work/ehms/before-remote.webp"
                srcSet="/work/ehms/before-remote.webp 1x, /work/ehms/before-remote@2x.webp 2x"
                width={271}
                height={562}
                loading="lazy"
                decoding="async"
                alt="改版前的遙控畫面：上方是住民姓名與調整完成時間，中間是人形臥姿圖與兩個壓力熱點，下方是大面積的停止按鈕與兩個次要控制鍵。"
              />
            </div>
          </div>
        </figure>
      </div>

      {/* ---- 狀態動畫（第三輪內容，這一輪是佔位塊）---- */}
      <div className="eh-kd-block eh-in">
        <h3 className="eh-sub-title">Showing what the bed is doing, with animation</h3>
        <div className="eh-body">
          <p>
            The massage function only had a static icon, so users could not tell whether the bed was
            running.{' '}
            <strong>I built six state animations in After Effects</strong>: posture detection, no one
            in bed, pressure redistribution, starting, back relief and hip relief. I had not used the
            software before and learned it for this. Feedback from sales demos, colleagues and nurses
            all pointed the same way. The state was easier to read.
          </p>
        </div>
        {/* 第三輪才放五個狀態的幀序列動畫。現在是 Figma 原本就有的空灰塊。 */}
        <div className="eh-kd-figure">
          <div className="eh-panel eh-anim-placeholder" aria-hidden="true" />
        </div>
      </div>

      {/* ---- Thumb zone ---- */}
      <div className="eh-kd-block eh-in">
        <h3 className="eh-sub-title">Sizing the interface for one-handed use</h3>
        <div className="eh-body">
          <p>
            Nurses often use the app while holding something else, and many carers are elderly. I
            widened the buttons towards both edges of the screen and enlarged the connection status,
            moving it to the upper middle where it is seen first.{' '}
            <strong>I also moved the important controls into the area a thumb can reach.</strong> The
            sizes and contrast ratios came from the Android guidelines.
          </p>
        </div>
        <figure className="eh-kd-figure">
          <div className="eh-panel">
            <img
              className="eh-thumb-shot"
              src="/work/ehms/thumb-zone.webp"
              srcSet="/work/ehms/thumb-zone.webp 1x, /work/ehms/thumb-zone@2x.webp 2x"
              width={273}
              height={567}
              loading="lazy"
              decoding="async"
              alt="拇指可及範圍示意圖：手機畫面上疊著三層弧形分區，由下而上標示為 natural（自然）、streching（需伸展）與 hard（難以觸及）。"
            />
          </div>
        </figure>
      </div>

      {/* ---- 未採用的提案 ---- */}
      <div className="eh-kd-block eh-in">
        <h3 className="eh-sub-title">A proposal that was not used</h3>
        <div className="eh-body">
          <p>
            Midway through I proposed a version in the Neumorphism style, with soft shadows, embossed
            components and a brighter palette. My manager turned it down. The company sells into
            traditional care settings, and he thought the style would feel distant to those users. He
            was right. Neumorphism uses low-contrast shadow to define the edge of a component, while
            I was enlarging controls and raising contrast at the same time. For elderly users, low
            contrast decides whether they can see a control at all.
          </p>
        </div>
        <figure className="eh-kd-figure">
          <div className="eh-panel eh-proposal">
            <img
              src="/work/ehms/neumorphism.webp"
              srcSet="/work/ehms/neumorphism.webp 1x, /work/ehms/neumorphism@2x.webp 2x"
              width={1082}
              height={721}
              loading="lazy"
              decoding="async"
              alt="未採用的 Neumorphism 版本提案：淺色背景上以柔和陰影做出浮凸的按鈕與卡片，配色比正式版本明亮，元件邊緣靠低對比陰影界定。"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
