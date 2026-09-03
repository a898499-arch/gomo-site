'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 796:766「background」，1440×978，位於整頁 frame 796:705 的 y=1721。
//
// ⚠️ 2026-08-28：改為與 SOLUTION 共用同一個寬度規則，**不再滿版出血**。
// 使用者指示：「兩者共用同一份寬度規則…之後改一邊兩邊都會同步」。做法是包進
// .page-container（max-width:1440 + padding-inline: var(--page-gutter)），
// 跟 Solution.jsx 完全一樣。1440 時 1440→1360，1920 時 1600→1360。
//
// 這推翻了 2026-08-26 的前一版指示（「不要包在 .page-container 裡」，比照
// ProcessAnimation.jsx 出血）。已回報過三件事、使用者確認後才改：
//   1. Figma 稿本身是不同寬度——796:766 是 1440（整頁寬），796:743 是 1359
//   2. 這張圖是為出血而做的：alpha 從頂端 0 漸變到約 80% 高度的 255，內縮後
//      下半部左右兩側會切出硬邊（實測左右緣 alpha 最大值 255）
//   3. 要還原成出血：把下面這層 <div className="page-container"> 拿掉，並把
//      aero-v.css 的 .av-bg-frame 加回 max-width: var(--site-max) 即可
//
// 照片是使用者自己在 Figma 切好的合成圖（public/work/aero-v/background.png，
// 4320×2934 = 3x），Rectangle 220/221/222 那幾層暗化與遮罩**已經烤進圖裡**，
// 所以這裡沒有任何 CSS 遮罩層——這是使用者 2026-08-26 的明確指示，取捨是
// 「之後要調暗度得回 Figma 重切」，符合 CLAUDE.md「純展示區塊改用匯出圖」。
//
// ⚠️ 這張圖的頂端淡出是「真的透明」不是白色：alpha 從頂端 0 漸變到約 80%
// 高度的 255，原圖有 938 萬個半透明像素。壓 webp 時用了 alpha_quality=100，
// 壓完驗過 alpha 直方圖 1–254 之間沒有任何計數為 0 的值。要重壓的話這個
// 參數不能省，否則漸層會出現斷階。也因為是透明的，底下必須是頁面底色，
// 不要在這一層或父層另外墊背景色。
//
// 文字沒有烤進圖裡，全部用程式碼做（使用者已確認）。
export default function Background() {
  const ref = useStandardEntrance('.av-entrance-item');

  return (
    <section className="av-section" ref={ref}>
      {/* 與 Solution.jsx 同一份寬度規則——要改寬度改 .page-container，兩區同步 */}
      <div className="page-container">
        <div className="av-bg-frame">
          <img
            className="av-bg-photo"
            src="/work/aero-v/bg-background.webp"
            srcSet="/work/aero-v/bg-background.webp 1x, /work/aero-v/bg-background@2x.webp 2x"
            width={1440}
            height={978}
            loading="lazy"
            decoding="async"
            lang="zh-Hant"
            alt="髮廊裡兩位髮型師正在為一位顧客上染劑，顧客的頭髮被分成多束處理。畫面經過去彩與暗化處理，呈現沙龍作業時瀰漫化學藥劑的環境。"
          />

          <p className="av-bg-eyebrow av-entrance-item">Background</p>
          <h2 className="av-bg-title av-entrance-item">A Hidden Health Risk in Hair Salons</h2>
          <p className="av-bg-body av-entrance-item">
            Hair salons expose hairstylists to more than just fallen hair. Hair dyes, conditioners,
            and styling products can release airborne pollutants such as VOCs, while poor
            ventilation can increase long-term respiratory risks.
          </p>

          {/* 兩張數據卡是純文字卡片（node 796:777 / 796:780），依 CLAUDE.md
              「單純文字卡片類用程式碼反而穩」的規則用程式碼做，不匯圖。
              毛玻璃底 rgba(255,255,255,0.39) + backdrop-blur 6px 取自 Figma。 */}
          <div className="av-bg-stat av-bg-stat--left av-entrance-item">
            <p className="av-bg-stat-num">87.3%</p>
            <p className="av-bg-stat-label">of hairdressers reported respiratory symptoms</p>
          </div>

          <div className="av-bg-stat av-bg-stat--right av-entrance-item">
            <p className="av-bg-stat-num">4x</p>
            <p className="av-bg-stat-label">higher PM2.5 levels were recorded in hair salons</p>
          </div>
        </div>
      </div>
    </section>
  );
}
