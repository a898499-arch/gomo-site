// Goodmood 頁「Define Before I Build」（Figma node 3337:3222，x=37 y=1811，1366×970）。
//
// ⚠️ 這一區沒有動效——不要加 ScrollTrigger 或進場動畫（使用者 2026-09-02 指示）。
//
// 幾何（section 內相對座標，全部照 Figma）：
//   kicker      2973:2750  y=0    行高 40.4
//   副標        2973:2752  y=51   → 距 kicker 頂 51，扣掉 40.4 行高 = 間距 10.6
//   正文        2973:2753  y=97   欄寬 1162，副標 → 正文 gap 5
//   灰底帶      3288:2898  y=312  高 658（標題群底 272 → 帶頂 312 = 間距 40）
//   兩張圖      3288:2915/2916  y=386（距帶頂 74）  各 494.451×510 / 433.779×510
//   圖說        3336:3214  y=926（距帶頂 614）
//
// 灰底帶寬度統一成 1360（Figma 是 1353），理由見 goodmood.css 的 .gm-band。
export default function DefineBeforeIBuild() {
  return (
    <section className="gm-section gm-define">
      <div className="gm-section-inner">
        <p className="gm-kicker">Define Before I Build</p>

        <div className="gm-section-text">
          <h2 className="gm-subhead">
            Before asking AI to build anything, I defined what it needed to understand.
          </h2>

          {/* 2973:2753 —— Figma 是一個文字節點裡兩段，用兩個 <p> 表達。 */}
          <div className="gm-body">
            <p>
              A vague idea in my head isn&rsquo;t a brief. If I re-explained the site every session,
              the build would drift from the design, and I&rsquo;d have nothing to point at when the
              output was wrong.
            </p>
            <p>
              So I wrote a development spec: site structure, content hierarchy, key interactions,
              design tokens, motion rules, and acceptance criteria for every section. Anything
              unresolved is marked ⚠️, with one standing rule: don&rsquo;t invent content for
              anything marked ⚠️, stop and ask. AI reads it before every new task. It became the
              shared baseline for the build, and the reference I argue against when something comes
              back wrong.
            </p>
          </div>
        </div>
      </div>

      <div className="gm-band gm-define-band">
        {/* ⚠️ 兩張 PNG 已經是「顯示尺寸的 2 倍」（989×1020 / 868×1020），也就是
            Figma 的裁切框已經套過了。直接以原比例放，不要再重現 Figma 那層
            112.66% / 110.71% 的縮放位移，否則等於裁兩次。
            width/height 給的是顯示尺寸，用來鎖長寬比、避免版面位移（CLS）。
            alt 是有意義的描述——這兩張是規格書的截圖，屬於資訊性內容；
            下面的 <figcaption> 另外說明左右各是什麼。 */}
        <figure className="gm-define-figure">
          <div className="gm-define-figures">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="gm-define-fig--1"
              src="/work/goodmood/spec-1.png"
              alt="開發規格書的一頁：說明這份文件怎麼用，以及這個網站要達成什麼。"
              width={494}
              height={510}
              loading="lazy"
              decoding="async"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="gm-define-fig--2"
              src="/work/goodmood/spec-2.png"
              alt="開發規格書的另一頁：色彩與字體規則。"
              width={434}
              height={510}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* 3336:3214 */}
          <figcaption className="gm-figcaption">
            Fig 1. From the spec. Left: how to use the document and what the site has to achieve.
            Right: colour and type rules.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
