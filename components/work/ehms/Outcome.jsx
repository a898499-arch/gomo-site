'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:426「OUTCOME」，1085×527，y=10959。
//
// ⚠️ 912:433 是全頁最嚴重的「清單塞在單一 text 圖層」：開場句 + 小標
// 「Where the product went」+ 三個項目 + 小標「What is still in use」
// + 三個項目 + 「→ Read the manual」，全部在同一個圖層裡。
// 拆成 <p> + <h4> + <ul> ×2 + 結尾一行（使用者確認的拆法）。
//
// ⚠️ 結尾那一行 2026-09-16 從不可點的「→ Read the manual」改成連到 eBio
// 官網的外部連結（Maida 裁示）。用途變了：原本是要連那份 22 頁使用手冊 PDF，
// 現在是**佐證這個產品真實存在**，所以連的是產品頁不是手冊。
//   連結 https://www.ebio-health.com/智能化商品特色（URL 編碼後存在 href 裡）
//   實測 HTTP 200，無轉址。
// ⚠️ Figma 圖層寫 ebio-healthcare.com 為誤植，以 Maida 提供的
// ebio-health.com 為準。2026-09-16 確認。
// 那份手冊 PDF 的舊連結（Figma 圖層 912:433 裡的
// https://www.ebio-healthcare.com/doc/AC3000使用者手冊.pdf）已經不使用——
// 公司站上的東西不保證一直在，而且那不是這一行現在的用途。
// ⚠️ 樣式用全站的 .link-underline（底線擦除 hover），不另外寫一套。
// ⚠️ 外部連結三件套齊：target="_blank" + rel="noopener noreferrer"
// + aria-label 明講會開新分頁（寫法與 Footer 的 LinkedIn 連結一致）。
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

        <p className="eh-outcome-link">
          <a
            href="https://www.ebio-health.com/%E6%99%BA%E8%83%BD%E5%8C%96%E5%95%86%E5%93%81%E7%89%B9%E8%89%B2"
            className="link-underline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See the product on eBio's site (opens in a new tab)"
          >
            See the product on eBio&rsquo;s site &#8599;
          </a>
        </p>
      </div>
    </section>
  );
}
