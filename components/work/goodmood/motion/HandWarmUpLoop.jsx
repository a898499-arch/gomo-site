"use client";

import { useEffect, useRef } from "react";
import s from "./hand-warm-up-loop.module.css";
import useInViewPause from "../useInViewPause";

/**
 * 暖手操動畫 —— **components/HandWarmUp/HandWarmUp.jsx 的副本**
 *
 * ⚠️ 這是 components/HandWarmUp/HandWarmUp.jsx 的副本，原檔在
 * components/HandWarmUp/（由 components/work/sui-sui/SuiSuiPage.jsx:95 使用，
 * 那邊是 <HandWarmUp assets="/web-assets" />）。
 * 兩邊是**刻意分開維護**的：改原檔不會同步過來，改這裡也不會影響
 * Sui-Sui 頁。使用者 2026-09-02 裁示。
 *
 * 副本相對原檔改了「四個地方」，動畫本體（TICKS、兩支手機的所有圖層、
 * ResizeObserver 的 fit、--t-loop 的重播迴圈）一字未動：
 *   1. 拿掉最外層的 <section className={`ss-section ${s.section}`}> 與整個
 *      標題區（.ss-section-inner / .ss-fn1-eyebrow / .ss-fn1-title /
 *      .ss-fn1-desc）。那四個 class 來自 sui-sui.css，goodmood 頁不會載入
 *      那支 CSS，留著就是一堆無樣式的裸文字。
 *      ⚠️ 但 **`s.section` 這一層必須保留**——所有時間軸變數
 *      （--t-arrow / --t-loop …）都定義在 .section 上，拿掉動畫全壞。
 *      所以副本改成 <div className={s.section}>。
 *   2. assets 的預設值 "/warmup" → "/web-assets"。原檔那個預設值指向一個
 *      **不存在**的目錄（public/warmup/ 沒有這個資料夾），Sui-Sui 頁是靠
 *      呼叫端傳 prop 補救的。副本把正確路徑寫進預設值，少一個踩雷點。
 *   3. 加上 useInViewPause：離開視窗時停掉 --t-loop 的 setInterval 並移除
 *      .run，回到視窗再重新起算。原檔沒有這個（§8 效能預算）。
 *   4. 兩支手機都保留——Figma 的 Fig 5 截圖就是兩支並排，原檔本來就渲染
 *      兩個 .slot（手機 A 是 warmup.mp4 示範，手機 B 是提醒/正確兩層交替）。
 *
 * 縮放是兩層，見 hand-warm-up-loop.module.css 檔頭。
 */

// 五個刻度的中心點(單位:Figma 的 402×874 設計座標)
// 1、2 對齊花的中心,3、4、5 對齊圓點的中心
const TICKS = [
  { x: 41.08, label: "1", done: true },
  { x: 117.08, label: "2", done: true },
  { x: 202, label: "3", done: false },
  { x: 291, label: "4", done: false },
  { x: 365, label: "5", done: false },
];

function Ticks() {
  return TICKS.map((t) => (
    <span
      key={t.label}
      className={`${s.num} ${t.done ? s.numOn : s.numOff}`}
      style={{ left: `${t.x}px` }}
    >
      {t.label}
    </span>
  ));
}

export default function HandWarmUpLoop({ assets = "/web-assets" }) {
  const stageRef = useRef(null);
  const screenBRef = useRef(null);
  const inView = useInViewPause(stageRef);

  // 內層固定 402×874,依外框寬度整體縮放
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const fit = () => {
      root.querySelectorAll(`.${s.phone}`).forEach((p) => {
        const screen = p.querySelector(`.${s.screen}`);
        if (screen) screen.style.transform = `scale(${p.clientWidth / 402})`;
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // 每一輪把 .run 拿掉再加回去,整組動畫重新開始。
  // ⚠️ 副本改動：整段綁在 inView 上——離開視窗就 clearInterval 並移除 .run
  // （CSS 動畫一起停），回到視窗再從頭起算。原檔沒有這一層。
  useEffect(() => {
    const el = screenBRef.current;
    if (!el) return undefined;
    if (!inView) {
      el.classList.remove(s.run);
      return undefined;
    }
    const loopMs =
      parseFloat(getComputedStyle(el).getPropertyValue("--t-loop")) * 1000 ||
      11100;
    const cycle = () => {
      el.classList.remove(s.run);
      void el.offsetWidth; // 強制 reflow,動畫才會真的重來
      el.classList.add(s.run);
    };
    cycle();
    const id = setInterval(cycle, loopMs);
    return () => clearInterval(id);
  }, [inView]);

  const a = (file) => `${assets}/${file}`;

  // ⚠️ 原檔這裡是 <section className={`ss-section ${s.section}`}> 加一整個
  // ss-fn1-* 標題區。副本只留 s.section（時間軸變數住在它上面，拿掉動畫全壞），
  // 標題區整段刪除——那些 class 來自 sui-sui.css，這一頁不會載入。
  return (
    <div className={s.section}>
      <div className={s.stage} ref={stageRef}>
        {/* ═══ 手機 1:示範(影片循環) ═══ */}
        <div className={s.slot}>
          <div className={s.device}>
            <div className={s.phone}>
              <div className={s.screen}>
                <video
                  className={s.p1Video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src={a("warmup.mp4")} type="video/mp4" />
                </video>
                <img className={s.chromeStatus} src={a("status-bar.svg")} alt="" />
                <img className={s.chromeBtns} src={a("top-buttons.svg")} alt="" />
                <img className={s.p1Card} src={a("card_1.svg")} alt="" />
                <img className={s.p1CardNext} src={a("card_gray.svg")} alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 手機 2:互動回饋(兩個畫面循環) ═══ */}
        <div className={s.slot}>
          <div className={s.device}>
            <div className={s.phone}>
              <div className={s.screen} ref={screenBRef}>
                {/* ── 畫面 A:提醒 ── */}
                <div className={`${s.layer} ${s.layerA}`}>
                  <img
                    className={s.bg}
                    src={a("bg-remind.webp")}
                    srcSet={`${a("bg-remind.webp")} 1x, ${a("bg-remind@2x.webp")} 2x`}
                    alt=""
                  />

                  <div
                    className={`${s.arrow} ${s.up}`}
                    style={{ left: "-4.57px", top: "483.26px", width: "111.41px", height: "113.55px" }}
                  >
                    <img src={a("arrow1.svg")} alt="" />
                  </div>
                  <div
                    className={`${s.arrow} ${s.up}`}
                    style={{ left: "279.15px", top: "477.81px", width: "119.1px", height: "121.08px" }}
                  >
                    <img src={a("arrow2.svg")} alt="" />
                  </div>

                  <img className={s.handmark} src={a("handmark.svg")} alt="" style={{ left: "-17px", top: "512px" }} />
                  <img className={s.handmark} src={a("handmark.svg")} alt="" style={{ left: "315px", top: "512px" }} />

                  <img
                    className={s.toast}
                    src={a("reminder-1.svg")}
                    alt=""
                    style={{ left: "65px", top: "634px", width: "262px", height: "52px" }}
                  />

                  <div className={s.panel} />
                  <div className={s.caption}>Flick fingers outward ×5</div>
                  <img className={s.pbTrack} src={a("progress-bar.svg")} alt="" />
                  <svg className={s.pbFill} viewBox="0 0 343 16">
                    <line x1="4" y1="7" x2="87.08" y2="7" />
                  </svg>
                  <img className={`${s.flower} ${s.f1}`} src={a("flower.svg")} alt="" />
                  <img className={`${s.flower} ${s.f2}`} src={a("flower.svg")} alt="" />
                  <Ticks />
                </div>

                {/* ── 畫面 B:完成 ── */}
                <div className={`${s.layer} ${s.layerB}`}>
                  <img
                    className={s.bg}
                    src={a("bg-correct.webp")}
                    srcSet={`${a("bg-correct.webp")} 1x, ${a("bg-correct@2x.webp")} 2x`}
                    alt=""
                  />

                  <div
                    className={`${s.arrow} ${s.down}`}
                    style={{ left: "-1.18px", top: "435.51px", width: "119.1px", height: "121.08px" }}
                  >
                    <img src={a("arrow_down1.svg")} alt="" />
                  </div>
                  <div
                    className={`${s.arrow} ${s.down}`}
                    style={{ left: "271.15px", top: "434.51px", width: "119.1px", height: "121.08px" }}
                  >
                    <img src={a("arrow_down2.svg")} alt="" />
                  </div>

                  <img className={s.handmark} src={a("handmark.svg")} alt="" style={{ left: "11px", top: "483px" }} />
                  <img className={s.handmark} src={a("handmark.svg")} alt="" style={{ left: "282px", top: "483px" }} />

                  <img
                    className={s.toast}
                    src={a("reminder.svg")}
                    alt=""
                    style={{ left: "124px", top: "517px", width: "141px", height: "92px" }}
                  />

                  <div className={`${s.panel} ${s.panelB}`} />
                  <div className={s.caption}>Flick fingers outward ×5</div>
                  <img className={s.pbTrack} src={a("progress-bar.svg")} alt="" />
                  <svg className={s.pbFill} viewBox="0 0 343 16">
                    <line
                      x1="4"
                      y1="7"
                      x2="172"
                      y2="7"
                      style={{ "--dash": "84.92" }}
                      strokeDasharray="168"
                      strokeDashoffset="84.92"
                    />
                  </svg>
                  <img className={`${s.flower} ${s.f1}`} src={a("flower.svg")} alt="" />
                  <img className={`${s.flower} ${s.f2}`} src={a("flower.svg")} alt="" />
                  <img className={`${s.flower} ${s.f3}`} src={a("flower.svg")} alt="" />
                  <Ticks />
                </div>

                {/* chrome 兩個畫面共用,永遠在最上層 */}
                <img className={s.chromeStatus} src={a("status-bar.svg")} alt="" />
                <img className={s.chromeBtns} src={a("top-buttons.svg")} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
