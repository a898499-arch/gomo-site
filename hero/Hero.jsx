import "./hero.css";

// 圖片放在 public/hero/ 底下。Next.js 用這個路徑就對了。
// Vite 的話改成 import s1 from "./assets/s1.png" 這種寫法。
const BASE = "/hero";

// 每欄 3 張，順序刻意錯開，避免相鄰欄出現同一張
const COLUMNS = [
  ["s1", "s3", "s4"],
  ["s5", "s2", "s1"],
  ["s3", "s4", "s2"],
  ["s2", "s1", "s5"],
  ["s4", "s5", "s3"],
];

export default function Hero({ tagline }) {
  return (
    <section className="wb-hero">
      <div className="wb-plane">
        {COLUMNS.map((names, ci) => (
          <div className="wb-col" key={ci}>
            <div className="wb-track">
              {/* 內容放兩份 → 無縫循環的必要條件 */}
              {[...names, ...names].map((n, i) => (
                <img
                  key={i}
                  src={`${BASE}/${n}.png`}
                  alt=""
                  aria-hidden={i >= names.length || undefined}
                  decoding="async"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="wb-vignette" />
      <div className="wb-scrim" />

      <div className="wb-logo">
        <img src={`${BASE}/logo.svg`} alt="Wander Buddy" />
      </div>

      {tagline && (
        <p className="wb-tagline" style={{ display: "block" }}>
          {tagline}
        </p>
      )}
    </section>
  );
}
