'use client';

// Figma node 912:222「DESIGN SYSTEM1」／內層 912:226「Group 37021」。
//
// 使用者指示：字級表用 <table> 做，不要切圖——這頁文字量最大，表格內容
// 要可選取、可被搜尋引擎讀到。欄寬改百分比，斷行位置與 Figma 有幾 px
// 差異已同意。
//
// 容器高度統一 639。Figma 第 1 頁（字級表）是 671、其餘七頁 639；若讓
// 容器跟著最高的一頁撐到 671，另外七頁會各多出 32px 空白，切頁時會看到
// 高度跳動。使用者裁示以 639 為準，第 1 頁重排進去。
//
// ⚠️ 輪播是第三輪的工作。這一輪只有第 1 頁的內容，箭頭做出來但不接功能。
// 頁數刻意用 PAGES 陣列的長度推導，不寫死——第三輪要補上的另外七頁在
// 檔案 j4saimg2oJWL5tUkBh5Bww：
//   DS2 4052:5694 COLOUR            DS3 4052:5745 PRIMARY BUTTONS
//   DS4 4052:5795 CONTROL BUTTONS   DS5 4052:5874 DEVICE CARD AND TIMER
//   DS6 4052:5989 DIALOG SIZES      DS8 4052:6048 DIALOG PATTERNS
//   DS9 4052:6093 INPUT FIELDS      （沒有 DESIGN SYSTEM7，跳號）
// 第 1 頁以 web 檔的 4024:5627 為準（與 2–6 同檔案、同一次修訂）。

// 字級表的資料。size 同時是「SIZE 欄要印的字」與「範例字要用的級數」，
// 一份資料兩個用途，不會有表上寫 32pt、範例卻用別的級數的可能。
const TYPE_SCALE = [
  {
    group: 'Headings and controls',
    rows: [
      { name: 'Heading 1', desc: 'Login screen title', size: 32, weight: 'Bold' },
      { name: 'Heading 2', desc: 'Page titles and dialog titles', size: 23, weight: 'Regular' },
      { name: 'Button', desc: null, size: 22, weight: 'Regular' },
      { name: 'Date switcher', desc: null, size: 18, weight: 'Regular' },
    ],
  },
  {
    group: 'Body text',
    rows: [
      { name: 'Body 1', desc: 'Primary content', size: 20, weight: 'Regular' },
      { name: 'Body 2', desc: 'Secondary content', size: 16, weight: 'Regular' },
      { name: 'Body 3', desc: null, size: 13, weight: 'Regular' },
    ],
  },
];

const PAGES = [{ id: 'type-scale', label: 'Type scale' }];

function Chevron({ dir }) {
  // 灰圓底 + 白 chevron（Figma node 912:263 / 912:266，39×39）。
  // 用程式碼畫而不是切圖：按鈕需要 hover / focus / disabled 三種狀態，
  // 而且要能鍵盤操作，匯成圖做不到（使用者指示）。
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export default function DesignSystem() {
  const canPage = PAGES.length > 1;

  return (
    <div className="eh-ds">
      <h3 className="eh-green-label">Design System</h3>

      <div className="eh-ds-card">
        <div className="eh-ds-panel">
          <p className="eh-ds-kicker">Type scale</p>
          <p className="eh-ds-note">
            Microsoft JhengHei. Sizes in points, as handed to the engineers.
          </p>

          <table className="eh-ds-table">
            <colgroup>
              <col className="eh-ds-c1" />
              <col className="eh-ds-c2" />
              <col className="eh-ds-c3" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Style</th>
                <th scope="col">Size</th>
                <th scope="col">Weight</th>
              </tr>
            </thead>
            {TYPE_SCALE.map((section, si) => (
              <tbody key={section.group}>
                {/* 第二組之前多一條分隔線（Figma node 912:249）；第一組不用，
                    表頭那列的下框線已經在同一個位置。 */}
                <tr className={si === 0 ? 'eh-ds-group' : 'eh-ds-group eh-ds-group--ruled'}>
                  <th scope="colgroup" colSpan={3}>
                    {section.group}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.name}>
                    <td>
                      {/* 範例字用該級數實際渲染——這就是這張表存在的理由。
                          字型用 CJK 系統堆疊，JhengHei 在 Windows 上命中。 */}
                      <span
                        className="eh-ds-specimen"
                        style={{
                          // cqw 而不是 px——見 ehms.css 的 .eh-ds-card 註解：
                          // 卡片等比縮放，字級用 px 會在 1155 撐破面板。
                          // 基準：卡片寬 1085 = 100cqw。
                          fontSize: `${((row.size / 1085) * 100).toFixed(3)}cqw`,
                          fontWeight: row.weight === 'Bold' ? 700 : 400,
                        }}
                      >
                        {row.name}
                      </span>
                      {row.desc && <span className="eh-ds-desc">{row.desc}</span>}
                    </td>
                    <td>{row.size} pt</td>
                    <td>{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <button
          type="button"
          className="eh-ds-nav eh-ds-nav--prev"
          disabled={!canPage}
          aria-label="Previous design system page"
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          className="eh-ds-nav eh-ds-nav--next"
          disabled={!canPage}
          aria-label="Next design system page"
        >
          <Chevron dir="next" />
        </button>
      </div>
    </div>
  );
}
