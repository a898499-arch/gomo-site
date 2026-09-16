'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:419「TODAY」，1085×231，y=10624。
//
// ⚠️ 內文 2026-09-16 整段換掉，依 Maida 改過的 Figma，來源是**另一個檔案**
// j4saimg2oJWL5tUkBh5Bww 的 node 3944:548 / 3937:119（不是 eHMS 原本那個
// 5HAq… 檔）。舊版是泛談 ecosystem 的通用稿，新版是具體的自我檢討。
// 之後要再改文案，去 j4saimg2oJWL5tUkBh5Bww 讀，不要回頭讀舊檔。
//
// ⚠️ Figma 上是三個換行段落、不是清單，所以拆成三個 <p>，沒有 <h3> / <ul>
// （Maida 確認）。小標「WHAT WOULD I DO NOW?」沒變。
//
// ⚠️ 兩處 <strong> 是 Figma 上刻意加的粗體，不是我自己判斷的重點。
// 用 <strong> 不用 <b>：這兩句是語意上的強調，螢幕閱讀器該讀出重音。
// 樣式沿用既有的 .eh-body strong（font-weight:600），與 Overview、
// DesignChallenge、DesignProcess 幾區的行內粗體同一套，不另外加規則。
export default function Today() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-today-h">
      <h2 className="eh-head eh-in" id="eh-today-h">
        <span className="eh-sec-num">06 Today</span>
        <span className="eh-sec-title">What would I do now?</span>
      </h2>

      <div className="eh-body eh-in">
        <p>
          I spent a lot of that year polishing details, and that part mattered. But I pushed just as
          hard on every one of them.{' '}
          <strong>
            When everything is defended equally, nothing reads as important, and nobody on the team
            could tell where my standard actually was.
          </strong>
        </p>
        <p>
          I would <strong>now pick a few things to hold firm on and let the rest go</strong>. I would
          also listen sooner. The engineers and my manager had worked on this product for years, and
          some of what I argued against was not a matter of taste. It was something they already knew
          and I did not.
        </p>
        <p>
          The insisting also had a cost I was not counting at the time. It slowed the schedule, and
          it made more work for the people around me.
        </p>
      </div>
    </section>
  );
}
