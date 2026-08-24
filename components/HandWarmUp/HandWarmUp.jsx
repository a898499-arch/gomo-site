"use client";

import { useEffect, useRef } from "react";
import s from "./HandWarmUp.module.css";

/**
 * Function 3 — Hand warm-up
 *
 * 素材放在 public/warmup/ 底下,預設路徑就是 "/warmup"。
 * 如果你放在別的地方,傳 assets="/你的路徑" 進來即可。
 *
 * 需要的字體:Poppins / Lora / DM Sans(Google Fonts)
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

export default function HandWarmUp({ assets = "/warmup" }) {
  const stageRef = useRef(null);
  const screenBRef = useRef(null);

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

  // 每一輪把 .run 拿掉再加回去,整組動畫重新開始
  useEffect(() => {
    const el = screenBRef.current;
    if (!el) return;
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
  }, []);

  const a = (file) => `${assets}/${file}`;

  return (
    <section className={`ss-section ${s.section}`}>
      <div className="ss-section-inner ss-fn1-heading">
        <p className="ss-fn1-eyebrow">Function 3</p>
        <div className="ss-fn1-title-group">
          <h2 className="ss-fn1-title">Hand warm-up</h2>
          <p className="ss-fn1-desc">
            A short set of hand movements before every session. It wakes up grip
            and coordination before any product is picked up, and gives the day&rsquo;s
            practice a clear starting line.
          </p>
        </div>
      </div>

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
                  <img className={s.bg} src={a("bg-remind.png")} alt="" />

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
                  <img className={s.bg} src={a("bg-correct.png")} alt="" />

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
    </section>
  );
}
