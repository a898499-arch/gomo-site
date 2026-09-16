'use client';

// Design System 輪播的八頁內容。
//
// 兩種頁混在一起：
//   kind:'code'  第 1、2 頁——純拉丁文（字級表的 STYLE/SIZE/WEIGHT、色票的
//                hex 與色名），用程式碼做，文字可選取、可被搜尋引擎讀到。
//   kind:'image' 第 3–9 頁——UI 標籤全是繁體中文。切圖。
//
// ⚠️ 為什麼中文頁要切圖：站上只載 Poppins，中文會落到訪客的系統字型——
// macOS 是蘋方、Windows 才是正黑體，兩邊都跟 Figma 不一樣，而且不同訪客
// 看到的還不一樣。這幾頁展示的**就是產品當初的字型規格**，用訪客的系統字型
// 顯示等於展示了錯的東西（使用者 2026-09-15 裁示）。
//
// ⚠️ 兩種頁都必須填滿同一個 1088.485×639 的框，否則換頁時外框會抽動。
// 圖片頁的切圖本身就含外框與內面板；程式碼頁自己畫一份一模一樣的
// （外框 #FAFAFA / 0.5px #747474 / 圓角 21，內面板 #FFFFFF——這三個值是從
// 匯出的切圖上逐點取樣得到的，不是猜的）。
//
// 編號跳過 7：Figma 上沒有 DESIGN SYSTEM7，是命名跳號不是漏頁。

/* ---------- 第 1 頁：字級表（Figma 912:222 / 內層 912:226）---------- */
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

export function TypeScalePage() {
  return (
    <div className="eh-ds-card">
      <div className="eh-ds-panel eh-ds-panel--type">
        <p className="eh-ds-kicker">Type scale</p>
        <p className="eh-ds-note">Microsoft JhengHei. Sizes in points, as handed to the engineers.</p>

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
                        cqw 而不是 px：卡片是 aspect-ratio 等比縮放的，
                        字級寫死 px 會在 1155 撐破面板。基準：框寬 1088.485。 */}
                    <span
                      className="eh-ds-specimen"
                      style={{
                        fontSize: `${((row.size / 1088.485) * 100).toFixed(3)}cqw`,
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
    </div>
  );
}

/* ---------- 第 2 頁：色票（Figma 4052:5694 / 內層 4052:5696）----------
   幾何照 metadata：內面板 990×496 於 (49,72)；色票 213×64，
   水平間距 24（318−81−213），列距 138（314−176）；
   色票底 → 色名 9px；色名 → 下一個組標題 24.5px。
   ⚠️ hex 疊在色票上、色名在色票下方，跟 Figma 一致。 */
const COLOUR_GROUPS = [
  {
    group: 'Greens',
    swatches: [
      { hex: '#353F0D', name: 'Dark green' },
      { hex: '#5F882E', name: 'Bright green' },
      { hex: '#6B8A47', name: 'Green' },
      { hex: '#DAE2D1', name: 'Pale green' },
    ],
  },
  {
    group: 'Accents',
    swatches: [
      { hex: '#112946', name: 'Dark blue' },
      { hex: '#B74726', name: 'Bright red' },
      { hex: '#C26B52', name: 'Red' },
      { hex: '#F29C2B', name: 'Yellow' },
    ],
  },
  {
    group: 'Neutrals',
    swatches: [
      { hex: '#383838', name: 'Dark grey' },
      { hex: '#707070', name: 'Grey' },
      { hex: '#A5A5A5', name: 'Light grey' },
      { hex: '#E1E1E1', name: 'Pale grey' },
    ],
  },
];

// 深色票上用白字、淺色票上用深字。用相對亮度算，不逐個手填——
// 手填的話之後改色值會忘了一起改。閾值 0.55 是對這 12 個色值試出來的，
// #DAE2D1 / #E1E1E1 / #A5A5A5 / #F29C2B 走深字，其餘走白字。
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

export function ColourPage() {
  return (
    <div className="eh-ds-card">
      <div className="eh-ds-panel eh-ds-panel--colour">
        <p className="eh-ds-kicker">Colour</p>
        <p className="eh-ds-note">Twelve colours in three groups, each ordered from dark to light.</p>

        {COLOUR_GROUPS.map((g) => (
          <section className="eh-ds-cgroup" key={g.group}>
            <h4 className="eh-ds-cgroup-label">{g.group}</h4>
            <ul className="eh-ds-swatches">
              {g.swatches.map((s) => (
                <li key={s.hex}>
                  <div
                    className="eh-ds-swatch"
                    style={{ background: s.hex }}
                    data-dark={isLight(s.hex) ? undefined : 'true'}
                  >
                    <span className="eh-ds-swatch-hex">{s.hex}</span>
                  </div>
                  <span className="eh-ds-swatch-name">{s.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------- 八頁的清單 ----------
   ⚠️ 頁數由這個陣列的長度推導，不寫死 8——之後要加第 9 頁只要加一筆。
   transcript 是「視覺隱藏的完整純文字副本」，含所有中文 UI 標籤，
   螢幕閱讀器與搜尋引擎照樣讀得到（CLAUDE.md 的無障礙補償規則）。 */
export const DS_PAGES = [
  { id: 'type-scale', title: 'Type scale', kind: 'code', Render: TypeScalePage },
  { id: 'colour', title: 'Colour', kind: 'code', Render: ColourPage },
  {
    id: 'ds-03',
    title: 'Primary buttons',
    kind: 'image',
    src: '/work/ehms/design-system/ds-03',
    alt: '主要按鈕規格表：四種按鈕（Primary、Secondary、Destructive、Small primary）各自的預設、按下、停用三種狀態。',
    transcript:
      'Primary buttons. Columns: default, pressed, disabled. Primary, 320 × 45, radius 10, label 儲存至裝置. Secondary, 320 × 45, radius 10, label 下一步. Destructive, 320 × 45, radius 10, label 刪除使用者. Small primary, 160 × 40, label E-Mail驗證. Tokens: label 按鈕 22 pt; fill Green #6B8A47; outline Red #C26B52; disabled Pale grey #E1E1E1 with Light grey #A5A5A5 label.',
  },
  {
    id: 'ds-04',
    title: 'Control and dialog buttons',
    kind: 'image',
    src: '/work/ehms/design-system/ds-04',
    alt: '控制按鈕與對話框按鈕規格表：開始／停止兩個大型控制鍵，以及並排與堆疊兩種對話框按鈕組，各有三種狀態。',
    transcript:
      'Control buttons. Columns: default, pressed, disabled. Start, 326 × 98, radius 20, label 開始 with a play glyph. Stop, 326 × 98, radius 20, label 停止 with a pause glyph. Tokens: stop fills with Green #6B8A47 so the running state reads at a glance; border Pale grey #E1E1E1. Dialog buttons. Pair, 147 × 45, radius 12, labels 取消 and 確定. Stacked, 295 × 45, radius 10, labels 取消 and 確定. Tokens: label 按鈕 22 pt; confirm Green #6B8A47; cancel Red #C26B52.',
  },
  {
    id: 'ds-05',
    title: 'Device card, timer, mode and menu',
    kind: 'image',
    src: '/work/ehms/design-system/ds-05',
    alt: '裝置卡與計時器規格表，加上模式與選單按鈕，以及一份說明字級與顏色如何使用的對照表。',
    transcript:
      'Device card and timer. Device card, 330 × 106, radius 10, showing a photo placeholder, device id 3000A2101011 and the status line 減壓模式運作中. Timer dropdown, 60分鐘. Disabled state not specified. Tokens: border Pale grey #E1E1E1; status line Grey #707070; connection icons Green #6B8A47. Mode and menu. Mode, 155 × 98, radius 20, label 循環週期. Menu, 130 × 130, radius 20, label 影像快照. Tokens: icon Green #6B8A47; border Pale grey #E1E1E1. How the scales are used. Type: 按鈕 22 pt for every button label; 標題2 23 pt for every dialog title; 標題1 32 pt for the login screen only. Colour: green for confirm, run and active icons; red for cancel and delete only; pale green for selected rows; pale grey for borders and disabled fills.',
  },
  {
    id: 'ds-06',
    title: 'Dialog sizes',
    kind: 'image',
    src: '/work/ehms/design-system/ds-06',
    alt: '對話框尺寸規格：小、中、大三種對話框的實際畫面，寬度固定 335，只有高度改變。',
    transcript:
      'Dialog sizes. Width is fixed at 335. Only the height changes. Every dialog sits centred horizontally and vertically. Small, 335 × 210, one field and two buttons, title 姓名. Medium, 335 × 290, a value picker and two buttons, title 體重 with values 69, 70 kg selected, 71. Large, 335 × 530, explanatory content and one button, title 降壓紀錄說明, showing a 顯示狀態 placeholder, 21% and 38%較佳減壓幅度, and the list 此頁面能顯示躺臥紀錄資訊: 1. 執行時間（正常執行時間為翻身或重心改變或智能護理循環週期）2. 躺臥姿勢 3. 上半身及下半身降壓幅度. Tokens: title 標題2 23 pt; confirm Green #6B8A47; cancel Red #C26B52; selected row Pale green #DAE2D1; divider Pale grey #E1E1E1.',
  },
  {
    id: 'ds-08',
    title: 'Dialog patterns',
    kind: 'image',
    src: '/work/ehms/design-system/ds-08',
    alt: '對話框樣式規格：文字輸入、文字輸入聚焦、選擇三種對話框的實際畫面。',
    transcript:
      'Dialog patterns. Text entry: title 修改名稱 with an input showing the placeholder 2802A2101011, and 取消 and 確定 buttons. Input is 300 × 50, radius 5. Text entry focused: the same dialog with the focus ring in the brand green. Selection: title 性別 with 男 as the selected row and 女 below, plus 取消 and 確定 buttons. The selected row uses pale green. Tokens: title 標題2 23 pt; focus ring Green #6B8A47; idle border Pale grey #E1E1E1; placeholder Light grey #A5A5A5; selected row Pale green #DAE2D1.',
  },
  {
    id: 'ds-09',
    title: 'Input fields',
    kind: 'image',
    src: '/work/ehms/design-system/ds-09',
    alt: '輸入欄位規格表：底線式、方框式、圓角式三種欄位，各有空白、已填、聚焦三種狀態。',
    transcript:
      'Input fields. Three types, each tied to one context. The border carries the state, the fill never changes. Columns: empty, filled, focused. Underline, 320 × 45, for sign-up forms, placeholder 手機號碼, filled value 0912 345 678. Boxed, 300 × 50, radius 5, inside dialogs, placeholder 請輸入名稱, filled value 2802A2101011. Rounded, 300 × 40, radius 6, login screen only, placeholder 帳號, filled with a masked password. Tokens: placeholder Light grey #A5A5A5; value Dark grey #383838; idle border Pale grey #E1E1E1; focus border and caret Green #6B8A47; icons Grey #707070.',
  },
];
