# 怎麼裝進你的網站

資料夾裡有什麼：

```
hero/
├─ index.html    ← 獨立預覽用，雙擊就能看
├─ hero.css      ← 所有樣式（不管哪種做法都要這個）
├─ Hero.jsx      ← React / Next.js 用的元件
└─ assets/       ← 5 張截圖 + logo.svg
```

---

## Next.js（App Router）

1. `assets/` 裡的六個檔案複製到 **`public/hero/`**
2. `hero.css` 和 `Hero.jsx` 複製到 `components/`
3. 在頁面裡用：

```jsx
import Hero from "@/components/Hero";

export default function Page() {
  return (
    <>
      <Hero />
      {/* 想加標語就寫 <Hero tagline="The city's better with company." /> */}
      <main>...你的其他內容...</main>
    </>
  );
}
```

## Vite + React

1. `assets/` 複製到 `public/hero/`（一樣）
2. `Hero.jsx` 裡的 `BASE` 保持 `"/hero"` 就能用
3. `import Hero from "./Hero"` 之後放進 App

## 純 HTML

1. 整個 `assets/` 資料夾複製到你的專案
2. `<head>` 加上 `<link rel="stylesheet" href="hero.css">`
3. 打開 `index.html`，把 `<!-- ↓↓↓ 從這裡開始複製 -->` 到 `<!-- ↑↑↑ 複製到這裡結束 -->` 中間那段 `<section>` 貼到你頁面的最上方

## Astro

`Hero.jsx` 直接當 `.astro` 元件改寫，或保留 jsx 加上 `client:load`。
CSS 一樣 import 進來就好。

## Framer / Webflow

用 Embed / Custom Code 區塊，把 `index.html` 的 `<section>` 加上 `<style>`（把 hero.css 內容貼進去）整包塞進去。
圖片要先上傳到他們的 asset 空間，然後把 `src` 換成他們給的網址。

---

## 常見問題

**圖片破圖**
路徑不對。開 DevTools → Network 看 404 的網址是什麼，對照你實際放檔案的位置調整 `src` 或 `BASE`。

**捲動到接縫處會跳一下**
某一欄的圖片沒有放兩份，或兩份的順序不一樣。每欄必須是 `A,B,C,A,B,C` 這種完全重複的形式。

**Hero 下面的內容被蓋住 / 滑不動**
`.wb-hero` 是 `height:100svh` 的獨立區塊，正常會自然接在下一個 section 上面。如果你把它包在 `position:fixed` 的容器裡就會出問題，拿掉那層。

**想換圖或加圖**
新檔案丟進 `assets/`，命名 `s6.png`、`s7.png`，然後：
- HTML 版：到 `index.html` 改 `<img>` 的檔名，記得**每欄兩份都要改**
- React 版：只要改 `Hero.jsx` 最上面的 `COLUMNS` 陣列，重複的部分程式會自己處理

**想調整外觀**
全部集中在 `hero.css` 最上面的 `.wb-hero` 那幾行變數：

| 變數 | 作用 |
|---|---|
| `--zoom` | 放大倍率，調小＝畫面上截圖更多更小 |
| `--col-w` | 每欄寬度 |
| `--tilt` | 傾斜角度 |
| `--bg` | 背景色（邊緣淡出也會跟著變） |
| `--scrim` | logo 後方光暈，設 `0` 可關掉 |

改背景色時記得 `.wb-vignette` 和 `.wb-scrim` 裡的 `rgba(236,238,241,...)` 也要一起換成新的 RGB，不然邊緣會淡出成錯誤的顏色。

**不要 logo 陰影**
`hero.css` 裡 `.wb-logo img` 的 `filter:drop-shadow(...)` 那行刪掉。

---

## 兩件之後要處理的事

1. **錯字**：`s2.png` 和 `s1.png` 上面寫的是 "get **stared**"，正確是 "get **started**"
2. **解析度**：現在是 402×874（1x），Retina 螢幕上會有點軟，回 Figma 用 2x 重新匯出
