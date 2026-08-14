# 把流程動畫放進你的網站

**不要把 `anim.html` 丟給 AI 說「幫我整合」。** 它會重寫一遍，你調好的時序、緩動曲線、座標會全部跑掉，而且很難看出是哪裡壞的。這已經是能跑的成品，用複製檔案的方式接進去就好。

```
embed/
├─ flow.css            ← 全部樣式（已移除頁面層級與控制列樣式）
├─ flow.js             ← 全部程式（原生 JS，不要改寫成 React）
├─ FlowAnimation.jsx   ← React 包裝，含捲動偵測
└─ assets/             ← 8 張卡片 + logo
```

---

## Next.js（App Router）

**1.** `embed/assets/` 整包複製到 `public/flow/`
所以路徑會長這樣：`public/flow/cards/coffee.png`、`public/flow/logo.svg`

**2.** `flow.css` 和 `FlowAnimation.jsx` 複製到 `components/`

**3.** `flow.js` 複製到 `public/flow.js`，然後在 `app/layout.jsx` 載入：

```jsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/flow.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
```

**4.** 在頁面裡用：

```jsx
import FlowAnimation from "@/components/FlowAnimation";

<FlowAnimation />
// 想控制高度：<FlowAnimation height="90svh" />
```

字體記得在 layout 載入 Raleway、Jost、Inter，否則會 fallback 成系統字。

---

## Vite + React

一樣把 `assets/` 放進 `public/flow/`，`flow.js` 放 `public/`，然後在 `index.html` 的 `</body>` 前加：

```html
<script src="/flow.js"></script>
```

其餘跟 Next.js 相同。

---

## 純 HTML

```html
<head>
  <link rel="stylesheet" href="flow.css">
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&family=Jost:wght@300;400;500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <div id="flow" style="--film-height:100svh"></div>

  <script src="flow.js"></script>
  <script>
    var host = document.getElementById('flow');
    var anim = WBAnim.createFlowAnimation(host, 'assets');

    // 進入畫面才播，離開就暫停
    new IntersectionObserver(function(entries){
      entries[0].isIntersecting ? anim.play() : anim.pause();
    }, { threshold: .25 }).observe(host);
  </script>
</body>
```

---

## 為什麼要做捲動偵測

這段動畫每秒都在跑 `requestAnimationFrame`。如果它在頁面下方、使用者根本沒看到，卻一直在算，筆電風扇會轉、手機會耗電。`IntersectionObserver` 讓它只在被看到的時候才動——這行程式碼很短，但對體感差很多。

---

## 可以調的東西

**時間軸**在 `flow.js` 裡，搜尋 `tl.at(` 就會看到每個動作和它的毫秒數，格式是 `tl.at(時間, 做什麼)`。改數字就好。

**總長**在 `flow.js` 最上面的 `var TOTAL = 22000;`。改動時序後記得一起改，否則循環會提早或延後。

**緩動曲線**在 `flow.css` 最上面的 `--ease-*` 變數，全部集中在那裡。

**顏色**同樣在 `flow.css` 最上面，用語意化命名（`--action`、`--text-primary`），不是寫死的色碼。

---

## 已知待辦

1. Figma 原檔的 `Let's get stared!` 應為 `started`。動畫裡我用了正確拼法，但 Figma 和卡片圖還是錯的。
2. `Coffee Hopping` 和 `Film Nights` 兩張卡片的文字超出色塊被裁切，要在 Figma 裡縮字級或加大卡片後重新匯出。
3. 卡片圖是 3x 匯出，其餘介面都是 code 重建，所以解析度沒問題。
