'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:412「WHAT I LEARNED」，1085×458，y=10087。
//
// ⚠️ 912:418 是「一段散文 + 四個並列句 + 兩段散文」全部塞在同一個 text
// 圖層。拆成 <p> + <ul> + <p>×2（使用者確認的拆法）。那四句在 Figma 裡
// 本來就已經是項目符號清單，只是被包在單一圖層內。
//
// ⚠️ 文案 2026-09-16 依 Maida 改過的 Figma 更新，來源是**另一個檔案**
// j4saimg2oJWL5tUkBh5Bww 的 node 3736:693（不是 eHMS 原本那個 5HAq… 檔）。
// 兩處差異，結構沒變：
//   清單第 4 項 砍掉尾巴「, which is standard practice elsewhere but new to this team」
//   第三段     「None of this was invented.」→「I did not invent any of this.」
// 之後要再改文案，去 j4saimg2oJWL5tUkBh5Bww 讀，不要回頭讀舊檔。
//
// 這一區的內文是 18px（其餘區塊 16px），用 .eh-body--lg。
export default function WhatILearned() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-learned-h">
      <h2 className="eh-head eh-in" id="eh-learned-h">
        <span className="eh-sec-num">05 What I Learned</span>
        <span className="eh-sec-title">
          I was the most junior person in the room, so I brought screens instead of explanations.
        </span>
      </h2>

      <div className="eh-body eh-body--lg eh-in">
        <p>
          Most problems came to me from other people. Ideas alone did not carry much weight when they
          came from me, so I changed the form my answer took.
        </p>
        <ul className="eh-list">
          <li>I brought screens to meetings instead of descriptions</li>
          <li>I showed several versions rather than one recommendation</li>
          <li>I turned vague feedback into numbers the team could build against</li>
          <li>I proposed a design system</li>
        </ul>
        <p>
          Not everyone on the team thinks visually. A screen at eighty per cent is easier to react to
          than a description, and it gave people something to disagree with. I did not invent any of
          this. I read about design systems before I proposed one, and what I contributed was
          bringing the practice into a team that had never worked that way.
        </p>
        <p>
          The engineers agreed to it straight away, because redrawing a button meant rewriting their
          code.
        </p>
      </div>
    </section>
  );
}
