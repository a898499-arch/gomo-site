'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:426「OUTCOME」，1085×527，y=10959。
//
// ⚠️ 912:433 是全頁最嚴重的「清單塞在單一 text 圖層」：開場句 + 小標
// 「Where the product went」+ 三個項目 + 小標「What is still in use」
// + 三個項目 + 「→ Read the manual」，全部在同一個圖層裡。
// 拆成 <p> + <h4> + <ul> ×2 + 結尾一行（使用者確認的拆法）。
//
// ⚠️「→ Read the manual」這一輪是不可點的純文字，不掛 href="#"——
// 那對搜尋引擎與螢幕閱讀器都是壞連結。使用者的說明：手冊 PDF 目前掛在
// 公司站上，不保證一直在，之後會放到自己的空間再給網址。
// （備查：Figma 這個圖層裡原本存的連結是
//  https://www.ebio-healthcare.com/doc/AC3000使用者手冊.pdf ）
export default function Outcome() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-outcome-h">
      <h2 className="eh-head eh-in" id="eh-outcome-h">
        <span className="eh-sec-num">07 Outcome</span>
        <span className="eh-sec-title">Where did it go?</span>
      </h2>

      <div className="eh-body eh-body--lg eh-in">
        <p>
          The product reached hospitals, care homes and retail. Parts of what I made are still in
          service.
        </p>

        <h4 className="eh-sub-label">Where the product went</h4>
        <ul className="eh-list">
          <li>Hospital wards and long-term care homes</li>
          <li>Sold through a national medical supply retail chain in Taiwan</li>
          <li>
            Product awards in 2021 and 2023, including the Ministry of Economic Affairs&rsquo;
            evaluation of assistive products for older and disabled users
          </li>
        </ul>

        <h4 className="eh-sub-label">What is still in use</h4>
        <ul className="eh-list">
          <li>
            The 22-page user manual. I wrote and laid it out: safety notices, installation, the fault
            code table and the CPR release procedure. Still published on the company site.
          </li>
          <li>The Agicare logo</li>
          <li>The app icon</li>
        </ul>

        <p>&rarr; Read the manual</p>
      </div>
    </section>
  );
}
