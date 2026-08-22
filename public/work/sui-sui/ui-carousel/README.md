# suisui UI Carousel — 內嵌說明

給 AI／工程師看的整合說明。這是一個**無限無縫循環的水平 UI 輪播**，
純 HTML + CSS + JS，**零相依套件**，不需要 build。

---

## 檔案結構（不要拆散）

```
suisui-carousel/
├── assets/ui-screens/     11 張 PNG（UI_1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12）
│                          注意：沒有 UI_8，這是刻意的，程式裡已排除
├── animation/
│   └── carousel.html      整個動畫，單檔
└── README.md              本檔
```

`carousel.html` 用相對路徑讀 PNG。**HTML 與 assets 的相對關係必須保留**，
否則圖片會全部載不出來。

---

## 搬進網站時唯一要改的一行

`carousel.html` 裡：

```js
const ASSET_BASE = new URLSearchParams(location.search).get('assets')
                || '../assets/ui-screens/';
```

把 `'../assets/ui-screens/'` 改成 PNG 資料夾相對於 `carousel.html` 的實際路徑，
**結尾要有斜線**。若兩者維持原本的上下層關係，就完全不用改。

---

## 整合方式 A：iframe（建議，零風險）

把整個 `suisui-carousel/` 資料夾原封不動放進靜態目錄
（Next.js / Vite / React → `public/`；Astro / SvelteKit → `static/`），
然後在頁面裡：

```html
<iframe
  src="/suisui-carousel/animation/carousel.html"
  title="suisui UI 展示"
  loading="lazy"
  style="width:100%; aspect-ratio:16/9; border:0; border-radius:20px; display:block"
></iframe>
```

高度用 `aspect-ratio` 控制。手機直向建議改成 `aspect-ratio:4/3` 或給固定 `height`，
太扁的話手機外框會被壓得很小。

背景色可用網址參數覆寫，讓它融進網站配色：

```
/suisui-carousel/animation/carousel.html?bg=%23ffffff
```

（`#` 要寫成 `%23`）

---

## 整合方式 B：改寫成頁面內的原生區塊

**只有在確實需要時才做**（例如要跟頁面捲動連動、或不想要 iframe）。
`carousel.html` 目前是「整頁版面」寫法，直接把 markup 貼進頁面**會壞掉**，
因為它假設自己獨佔整個 viewport。要改成區塊必須動這三處：

1. `html, body { height:100%; overflow:hidden }` — 刪掉，改由容器控制高度
2. `#stage { position:fixed; inset:0 }` — 改成 `position:absolute`，
   外面包一層 `position:relative; overflow:hidden` 的容器
3. JS 裡所有 `innerWidth` / `innerHeight` — 改讀容器的
   `clientWidth` / `clientHeight`，並用 `ResizeObserver` 取代 `window.resize`

改完務必重新驗證循環（見下方）。

---

## 不要動的東西

- **PNG 是最終 UI，不要重畫、不要壓縮、不要改檔名、不要改順序。**
- `UI_3.png` 原檔比其他張大一圈（1230×2646，內容偏移 12,0）。
  程式用 CSS 把多餘的邊推出可視範圍，**PNG 本身沒有被修改，也不要去修改它**。
  對應的設定在 `OUTLIER` 常數。
- 中央那個黑色手機外框是**固定不動的獨立元素**（`#phoneframe`），
  不屬於任何一張卡片。卡片滑到正中央時尺寸剛好等於它。

---

## 可調參數（都在 `carousel.html` 上方）

| 參數 | 目前值 | 說明 |
|---|---|---|
| `SEC_PER_SCREEN` | `2.1` | 每張畫面通過中央的秒數，調大更慢 |
| `EASE` | `0.85` | 中央停留感，0 = 等速，**不可 ≥ 1**（會倒退） |
| `GAP_RATIO` | `0.07` | 卡片間距 |
| `FRAME_STROKE` | `0.030` | 中央黑框描邊粗細 |

一圈長度 = `SEC_PER_SCREEN × 11` = 目前 23.1 秒。

---

## 循環是怎麼無縫的（改動前請先讀）

每張卡片的位置是 `(索引 × 間距 − 位移) mod 一圈長度`。
取模沒有起點也沒有終點，所以**不存在「循環接點」**，自然不會跳動或閃爍。

位移函數 `x(t) = v·t − A·sin(2πt/P)` 帶了緩動，
而正弦的週期恰等於單張通過時間 `P`，
所以每過 `P` 秒位移剛好推進一個間距 —— 緩動不會破壞無縫性。

**因此：`EASE` 的正弦週期絕對不能改成跟 `SEC_PER_SCREEN` 不同的值，否則循環會裂開。**

### 驗證方式

`carousel.html?t=<秒>` 會凍結在指定時刻。
截 `?t=3` 與 `?t=3+23.1`（即 `?t=26.1`）兩張圖，**應該位元組完全相同**。
多取幾個時間點都要相同。這是判斷改動有沒有破壞循環的唯一可靠方法。

---

## 其他

- 頁面 `?t=` 與 `window.__seek(秒)` 是給截圖／錄影／驗證用的，正式站上可留可刪。
- 空白鍵暫停。
- 動畫用 `requestAnimationFrame` + `transform`，只跑合成層，不會觸發重排。
