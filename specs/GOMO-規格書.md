# GOMO — Maida Hu 作品集網站開發規格書

**版本** v2.0 ｜ **日期** 2026-08-07 ｜ **狀態** 開發中

---

## 0. 如何使用這份文件

**給 Maida：**

這份文件是專案的唯一真實來源。它描述**最終成品**要長什麼樣，不描述你這一次要怎麼做。

- 餵給 AI 時**一次只貼一個 §6.x 章節**，外加 §1–§5（那是全域基礎，每次都要）
- 不要一次貼整份。19 頁塞進去，AI 的注意力會被稀釋，細節就開始掉
- 每章結尾的 **Acceptance Criteria** 是你的驗收表。你不用看程式碼也能一條一條檢查

**給 AI：**

- 這份規格是精確的，不是建議。數值（duration、easing、位移量）照寫，不要「優化」
- 動手前先說明你要改哪些檔案、為什麼
- 完成後對照該章的 Acceptance Criteria 逐條自評，並實際開瀏覽器截圖確認，不要只看程式碼就宣稱完成
- 標記 `⚠️ 待補` 的地方不要自己編內容，停下來問

---

## 1. 專案總覽

**GOMO** 是 Maida (Lin Wei-Ting) Hu 的個人作品集網站。Maida 是常駐倫敦的台灣原住民設計師與 maker，Goldsmiths 畢業，橫跨工業設計、產品設計與 reflective design，關注健康、女性健康與環境議題。

**這個網站要做到的事：**

1. 讓招募方與潛在客戶在 30 秒內理解 Maida 是誰、做什麼
2. 以「展覽」而非「縮圖列表」的方式呈現 12 件作品
3. 用動效傳達手作感與工藝性——網站本身就是一件作品

**設計語言：** 簡潔、editorial、瑞士現代主義排版。留白多。動效存在的目的是強化「精工感」，不是吸引注意力。**不俏皮、不彈跳、不 overshoot**（唯一例外：對話框的 pop）。

**參考感覺：** Bürocratik、Locomotive、Studio Freight、Dogstudio、Active Theory、MakeMePulse。一本奢侈品印刷刊物被賦予生命。

---

## 2. 設計系統

### 2.1 色彩

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#FCFBF8` | 全站底色（暖白） |
| `--accent` | `#C90000` | 主紅——板凳、logo 描邊、強調字、連結（原寫 `#C0281C`，經 Figma 多處核對後統一改為此值，見 footer/對話框/職位輪播） |
| `--accent-cta` | `#C8402F` | CTA 紅（Let's Talk!、CV Download）略亮 |
| `--ink` | `#1A1A1A` | 主文字 |
| `--ink-muted` | `#6B6B6B` | 次要文字（公司名、學位、(Brief) 標籤） |
| `--rule` | `rgba(26,26,26,0.15)` | 分隔線、外框 |

**點綴色**（僅用於 §6.2 插畫拼貼的色塊）：柔和的綠、橘、粉、黃、天藍。

> ⚠️ 待補：點綴色的實際 hex 值請從 Figma 取。

### 2.2 字體

**全站使用 Poppins**（Google Fonts）。

| 用途 | 字重 | 備註 |
|---|---|---|
| 大標（Get An Idea?、Hero） | 600 / 700 | 字距收緊 `letter-spacing: -0.02em` |
| 區塊標題 | 600 | 常見全大寫 |
| 內文 | 400 | |
| 次要資訊 | 400 | 配 `--ink-muted` |
| 對話框（lāi-té-tsē / Grab a seat!） | 400 italic | 紅色 |

**必須驗證：** Poppins 需載入 `latin-ext` 子集，否則 `lāi-té-tsē` 的 `ā é ē` 會破字（fallback 成別的字體，視覺明顯斷裂）。

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&display=swap&subset=latin,latin-ext" rel="stylesheet">
```

驗證方式：在瀏覽器 DevTools 選取該段文字 → Computed → Rendered Fonts，確認顯示 Poppins 而非 fallback。

**數字必須套 `font-variant-numeric: tabular-nums`**，用在 loading 計數器與年份，避免位數變化時文字抖動。

### 2.3 Easing

| 名稱 | 值 | 用途 |
|---|---|---|
| **主曲線** | `cubic-bezier(0.22, 1, 0.36, 1)` | 全站預設。expo-out 感。**絕大多數動畫都用這個** |
| **Pop** | `cubic-bezier(0.34, 1.4, 0.64, 1)` | **只用於對話框出現**。overshoot 上限 6% |

**禁止**：bounce、elastic、任何 overshoot（除 Pop 之外）。

### 2.4 動效原則（全域，不可違反）

1. **只動 `transform` / `opacity` / `clip-path`**
2. **絕不動 `width` / `height` / `top` / `left` / `margin`**
   （§6.1 職位輪播改成打字機效果後，寬度隨逐字增減自然變化，不再需要例外處理）
3. `will-change: transform` 只在動畫執行期間掛上，**結束後移除**
4. 相鄰動畫區間**必須重疊**——出現空檔會讓連續感斷掉
5. 所有動效都要實作 `@media (prefers-reduced-motion: reduce)`

---

## 3. 技術棧與全域規則

### 3.1 技術棧

```
React + Next.js (App Router)
GSAP（所有動畫，含 ScrollTrigger、Flip）
Lenis（平滑捲動）
inline SVG（所有插畫）
CSS Grid + IntersectionObserver
```

**不要加入 Framer Motion。** GSAP 與 Lenis 已完全涵蓋需求，第三個動畫迴圈會造成 requestAnimationFrame 互搶，滾動會抖。

### 3.2 Lenis：全站單一 instance

整個網站**只能有一個** Lenis instance，在 root layout 建立，透過 Context 提供給所有元件。

- §6.2 的 ScrollTrigger 必須接上這個 instance（`lenis.on('scroll', ScrollTrigger.update)`）
- §6.4 的 back-to-top 必須呼叫 `lenis.scrollTo(0)`，**不可**用原生 `window.scrollTo`
- 開兩個 instance 會互搶 RAF，滾動明顯抖動

### 3.3 GSAP 清理

每個元件的 GSAP 動畫都用 `gsap.context()` 包起來，在 cleanup 時 `revert()`。Next.js 的 App Router 會在路由切換時保留部分元件，沒清乾淨會累積殭屍 ScrollTrigger。

```js
useEffect(() => {
  const ctx = gsap.context(() => { /* 動畫 */ }, containerRef)
  return () => ctx.revert()
}, [])
```

### 3.4 SVG 資產

板凳、logo、人形、色塊、對話框**一律使用 inline SVG**，不用 `<img>`。理由：

- §6.1 板凳要放大 3 倍，點陣圖會糊
- 需要用 CSS/GSAP 直接操作內部路徑
- 可整組 transform

> ⚠️ 例外：若板凳的顆粒質感無法向量化，可用 3 倍解析度 PNG（含 alpha），但必須明確標註 `width`/`height` 避免 layout shift，且需在 §6.1 驗收時特別檢查放大後的銳利度。

### 3.5 圖片

- 全部 lazy load，但**首屏例外**（Hero 相關資產要 preload）
- 提供 `srcset`，格式 AVIF / WebP
- 解碼後寬度上限 1600px
- 每張都要有意義的 `alt`；裝飾性插畫用 `alt="" aria-hidden="true"`

### 3.6 影片

- 上限 1080p，H.264 / WebM
- **移除音軌**（進頁自動播放）
- 屬性：`muted loop playsinline preload="metadata"`，`object-fit: cover`
- 每支都要有 `poster`
- 進入 viewport 才 `play()`，離開 `pause()`

---

## 4. 網站地圖與路由

| 路由 | 頁面 | 狀態 |
|---|---|---|
| `/` | 首頁（Loading → Hero → Practice → All Work → Gallery → Footer） | §6.1–6.4 |
| `/work` | 作品分類頁 | §6.5 |
| `/work/[slug]` | 作品詳情頁 | ⚠️ 待補規格 |
| `/about` | About Me | §6.6 |
| `/contact` | Contact Me | ⚠️ 待補規格 |
| `/playground` | **不建立**。導覽列保留但停用 | §6.4 |

**導覽列**（全站共用）：左上 GOMO logo，右上 `Works` / `About Me` / `Contact Me`。

首頁的導覽列行為：在 Hero 區固定於頂端；往下滾時隱藏；往上滾時重新出現（`translateY(-100%)` ↔ `0`，300ms，主曲線）。

---

## 5. 資料結構

建立 `data/works.json`。所有作品資料從這裡來，**不要把文案寫死在元件裡**。

```ts
type Work = {
  slug: string          // 網址用，全小寫連字號
  title: string
  description: string   // 一句話，作品卡用
  tags: string[]        // 分類標籤
  group: ('product' | 'personal')[]  // 決定出現在哪個篩選分頁
  year: number          // Gallery hover 顯示
  cover: string         // 主圖路徑
  video?: string        // 有影片才填
  poster?: string
}
```

### 5.1 12 件作品

| # | slug | 標題 | Tags | 分頁 | 年份 |
|---|---|---|---|---|---|
| 1 | `sui-sui` | Sui-Sui | UI/UX, Health | ⚠️ | ⚠️ |
| 2 | `aero-v` | AERO V | Product Design, Environment | ⚠️ | ⚠️ |
| 3 | `mvs` | MVS | Mobility Design, Health | ⚠️ | ⚠️ |
| 4 | `blossom-care` | Blossom Care | Product Design, Medical Design, Health | ⚠️ | ⚠️ |
| 5 | `ehms` | Healthcare Management System (eHMS) | UI/UX, Medical Design, Health | ⚠️ | ⚠️ |
| 6 | `dh2` | DH2 | Product Design, Appliance Design, Health | ⚠️ | ⚠️ |
| 7 | `color-lab` | Color Lab | Product Design, Children's Products | ⚠️ | ⚠️ |
| 8 | `cool-cook` | Cool Cook | Product Design, UI/UX, Children's Products | ⚠️ | ⚠️ |
| 9 | `co2-exting` | CO2-EXTING | Product Design, Public Architecture, Environment | ⚠️ | ⚠️ |
| 10 | `wanderbuddy` | WanderBuddy | UI/UX | ⚠️ | ⚠️ |
| 11 | `trace-of-conversation` | Trace of Conversation | Reflective Design, Craft | ⚠️ | ⚠️ |
| 12 | `conversation` | Conversation | Research, Publication | ⚠️ | ⚠️ |

> ⚠️ **待補**：每件作品的 `description`（目前全是 `Project Description` placeholder）、`group`、`year`、`cover`。
> **AI 不得自行編造作品描述。** 遇到 placeholder 就照原樣渲染或留空，並回報。

---

# 6. Section 規格

---

## 6.1 Loading → Hero

**檔案** `app/page.tsx` 的第一屏 ｜ **難度** ★★★

### 核心概念

Loading 畫面與 Hero **不是兩個頁面**，是一次連續的攝影機推軌。Loading 的板凳**物理上變成** Hero 的板凳。全程單一 DOM 結構，SVG 元素**永不 unmount**。

### PHASE 1 — Loading 組裝（0 → 1.65s）

滿版 `--bg` 畫布，所有元素置中。**嚴格照順序出現，不可同時**。

**1.1 兩張板凳落地（0 → 700ms）**

兩張紅色板凳 SVG 並排於視窗正中央，中間留一道窄縫（logo 之後會放這）。此時尺寸小（Figma 實測：左板凳 121×119.5px、右板凳 110.6×112.8px）。

- 左板凳：`translateY(30px)` + `opacity 0` + `scale(0.9)` → 定位。600ms，主曲線
- 右板凳：相同，延遲 120ms
- 各自加一個**幾乎察覺不到的落定**：超過最終 Y 位置 4px，再於最後 180ms 回到定位
  - 這要讀成「有重量的物件被放下」，不是彈跳
- **不旋轉、不打轉**。這是手工物件被放到地板上

**1.2 GOMO logo 出現（700 → 1400ms）**

字標 logo（互扣的圓形字體，墨黑）在兩張板凳之間淡入，板凳輕輕讓開：

- Logo：`scale(0.85) opacity 0` → `scale(1) opacity 1`，700ms（原寫 450ms，太趕，已放慢）
- **同時**兩張板凳各向外水平滑開（Figma 實測：每邊約 97px）拉開間隙。相同 700ms、相同 easing——**兩者必須維持同一個動作的感覺，時長必須一致，不能一快一慢**
- 讓開與 logo 到位必須讀成**同一個動作**，不是兩件事

**1.3 計數器出現（1400 → 1650ms）**

百分比文字在 logo 正下方淡入，起始 `0%`。淡入 + 上升 8px，250ms。**先不開始計數**，在 0% 停一拍。

### PHASE 2 — 計數器（1.65s → 載入完成，最短 2.5s）

> **這是全案最容易做錯的一段，請仔細讀。**

數字必須**逐一數上去，不是翻頁**。0 到 100 每個整數都要依序渲染：0, 1, 2, 3 … 98, 99, 100。要看起來像在點數。

**明確禁止：**

- ❌ flip-clock / split-flap / 里程表效果
- ❌ 數字在遮罩欄位裡垂直滑動
- ❌ 滾筒式數字選擇器
- ❌ 跳號（例如 0 → 7 → 19 → 34）

數字就是**原地替換**，字形本身完全沒有過場動畫。唯一在動的是「值」。

**節奏。** 不要用線性計時器遞增——那讀起來很機械。要 ease：

- `0 → 60`：相對輕快
- `60 → 90`：明顯變慢
- `90 → 100`：最慢，每個數字停留更久，讓最後的逼近有「使勁」的感覺

**實作**：`requestAnimationFrame` 驅動一個 eased progress，再 `Math.floor()` 取整顯示。
**永不遞減，永不跳號**——即使掉幀。若 progress 一次跳很多，後續幾幀要把中間的數字補完再繼續。

**進度來源。** 追蹤真實資產載入（Hero 圖片、字體、板凳 SVG），但**強制最短 2.5 秒**——這個下限是從 Phase 2 開始計數的時間點（1650ms）起算，不是從頁面載入 t=0 起算。也就是說 Phase 2 本身至少要跑滿 2.5 秒，加上前面 Phase 1 的 1.65 秒，整個 Loading 最短總長是 4.15 秒才會進入轉場。卡在 95–97% 之後**沒有 timeout**，會一直等到資產真正載完才補到 100%。

- 資產提早載完 → 計數器維持 eased 節奏走到 100%
- 資產很慢 → 計數器逼近但不到 100%，**停在 95–97% 附近**，不要卡在更低的數字（那會讀成壞掉）

**排版。** 套 `font-variant-numeric: tabular-nums`。沒有這行，數字在 9 → 10 → 100 時會明顯抖動。`%` 符號必須完全不動。整串置中對齊。

**環境生命感。** 計數期間，兩張板凳以緩慢、相位錯開的 sine 上下漂移 **2px**（週期約 3s，右板凳相位偏移）。幾乎察覺不到——它的作用只是讓畫面不像凍住。

**播放規則：** Loading 畫面**每次載入 / 重新整理都要播**。不可用 sessionStorage / localStorage 擋掉。

### PHASE 3 — 轉場：Loading 變成 Hero（100% → +1.6s）

這是**一次連續的攝影機推軌**，不是換頁。**不可有淡出到空白、不可有白閃、不可有路由切換**——觀者的視線全程不能失去板凳。

**3.1 Loading UI 退場（0 → 400ms）**

計數器歸零到 100% 的瞬間：

- 計數器與中央大 GOMO logo 淡出並縮到 `scale(0.92)`，350ms。它們是「被攝影機穿過」而消散的
- **板凳完全不理會這件事**，它們已經開始移動了

**3.2 板凳推軌前進（0 → 1300ms）——關鍵時刻**

**與 Loading 完全相同的 SVG 元素**移動到 Hero 位置。

- ❌ 不可 unmount 再 mount
- ❌ 不可用小版本與大版本交叉淡入

**用 FLIP 技術**：量測 loading 的位置/尺寸 → 量測 hero 目標位置/尺寸 → 只用 transform 動差值。

移動由三件事同時構成：

- **放大**：不要寫死一個倍率數字。用 FLIP 量到 loading 狀態與 hero 狀態兩邊板凳各自的實際 DOM 尺寸（`getBoundingClientRect`），拿差值去算 transform——這樣任一邊尺寸以後調整，動效都會自動正確，不用回頭改倍率。成長曲線**前段加速**，衝出 loading 狀態後**減速落定**——就是鏡頭推進然後穩住
- **分開**：兩張板凳水平分開到 Hero 的較寬間距
- **下降**：從視窗正中央往下移到 Hero 的中下位置

Duration 1300ms，主曲線。**左板凳領先，右板凳晚 80ms**，不要像一整塊剛體在動。

> **關鍵**：板凳在任何一刻都不可看起來「切換」到新尺寸。1300ms 全程縮放必須連續。SVG 要保持向量，放大後才會銳利（實際倍率由 FLIP 量測 loading/hero 兩邊 DOM 尺寸決定，不寫死）——**不可用點陣圖**。

**3.3 導覽列到位（400 → 900ms）**

板凳還在移動的同時：

- 小 GOMO logo 在左上角淡入。它應該讀起來就是剛從中央消散的那個標記——給它 12px 上升
- 導覽連結（Works、About Me、Contact Me）在右上淡入，彼此**錯開 60ms**，各上升 10px

### PHASE 4 — Hero 內容（900ms 開始，與板凳移動重疊）

> **⚠️ 此段已依 UI v2 改版。** 職位輪播從「與 I'm Maida, 同一行、靠右」改為「獨立第二行、置中」，且冠詞跟著換。

**4.1 問候語（900 → 1500ms）**

`Mihumisang! I'm Maida,` 為**第一行，置中**。

遮罩式行揭露：整行包在 `overflow: hidden` 容器內，起始 `translateY(100%)`，700ms 升到 0，主曲線。

**文字本身不做淡入，只靠遮罩。** 比柔和的 fade 更俐落、更 editorial。

必須與板凳仍在到位的過程**重疊**——問候語與板凳大約同時落定。這個同時性就是整段的重點。

**4.2 職位輪播（1700ms 開始，之後永久循環）**

**第二行，置中**，位於問候語正下方。由兩部分組成：

| 部分 | 樣式 | 內容 |
|---|---|---|
| 冠詞 | Poppins 600、`--ink`、正常字距 | `An` / `A` |
| 職位 | Poppins **900（Black）**、`--accent`、**全大寫**、字距收緊 | `INDUSTRIAL DESIGNER` 等 |

循環三組（冠詞必須跟著換，否則文法錯誤）：

1. `An` + `INDUSTRIAL DESIGNER`
2. `A` + `PRODUCT DESIGNER`
3. `A` + `MAKER`

**版面規則。** 整行（冠詞 + 職位）維持**置中**，上下內容永不位移。因為是打字機逐字增減字數（不是整段短語一次替換），容器寬度本來就隨字數自然、漸進地變化，靠 flex `justify-content: center` 置中即可，不需要 ResizeObserver 或寬度過場機制。

**替換動畫——打字機效果**（取代舊版「遮罩式垂直滑動換字」）：

- 舊短語：**逐字刪除**（由右往左消失），每字約 22ms（原寫 30ms，整體節奏太慢後調快）
- 刪完後**停頓約 120ms**（原寫 150ms）
- 新短語：**逐字打出**，每字約 40ms（原寫 45ms）
- **冠詞（`An`/`A`）也一起參與刪除與打字**，不是固定不動的——冠詞跟職位當同一串字元序列處理，冠詞先打完才接著打職位，刪除方向相反（職位先刪完才刪冠詞）
- 打字期間顯示細游標；打完後游標**繼續閃爍**，直到下一次刪除開始才停止閃爍
- **時間**：每組打完後停留 1200ms（原寫 2000ms），才開始刪除。無限循環：Industrial → Product → Maker → Industrial → …一輪三組約 7.5 秒，維持從容感、不急促

**分頁隱藏時暫停**（`document.visibilityState`），回來時繼續。

**4.3 對話框（2200ms 開始）**

兩個手繪風格的紅色描邊對話框出現在板凳旁——左邊 `lāi-té-tsē`，右邊 `Grab a seat!`。皆為紅色斜體。

**先彈出框，再打字。**

- **框**：從 `scale(0.7)` 放大，`transform-origin` 設在**框的尾巴**——也就是它從板凳長出來，像是板凳在說話。400ms，**Pop 曲線**。這是全站唯一允許 overshoot 的地方，因為要有卡通感的彈出。overshoot 上限 6%
- **文字**：框完成之後才逐字打出，每字約 45ms。`lāi-té-tsē` 先打，`Grab a seat!` 晚 350ms 開始
- 打字期間顯示細游標，最後一個字之後 200ms 淡出
- **框必須一開始就是最終文字的尺寸**，不可在打字過程中長大
- `lāi-té-tsē` 的變音符號（ā、é、ē）必須正確渲染——見 §2.2

**可存取性：** 對話框文字必須以完整字串存在 DOM，打字效果透過 CSS 或索引切片實現。螢幕閱讀器要拿到完整句子，不是一串殘字。打字容器標 `aria-live="off"`，另外提供一份視覺隱藏的完整副本。

**4.4 Idle 狀態（3500ms 之後）**

- 板凳恢復與 Loading 相同的 2px sine 漂移，週期放慢（約 4s）。這連接了兩個畫面——同樣的物件，仍在呼吸
- 職位持續循環
- 其餘一切靜止

### 完整時間軸

| 時間 | 事件 |
|---|---|
| 0ms | 左板凳落下 |
| 120ms | 右板凳落下 |
| 700ms | Logo 淡入，板凳讓開（700ms，原寫 450ms） |
| 1400ms | 計數器出現，停在 0% |
| 1650ms | 開始計數（eased） |
| 載入完成 & ≥2.5s | 到達 100% |
| +0ms | 計數器與大 logo 消散；板凳開始推軌 |
| +400ms | 導覽列 logo 與連結到位 |
| +900ms | 問候語遮罩揭露 |
| +1300ms | 板凳抵達 Hero 位置 |
| +1700ms | 職位輪播開始 |
| +2200ms | 對話框彈出後打字 |
| +3500ms | Idle——板凳漂移、職位循環 |

### RWD

| 斷點 | 規格 |
|---|---|
| 桌機 | 如上 |
| 平板 | 板凳 Hero 尺寸約 75%；對話框仍在板凳旁 |
| 手機 | 板凳縮到 88vw 內、間距靠近；**對話框改放在各自板凳的上方**而非旁邊，避免被視窗邊緣裁切；**尾巴方向也跟著改成垂直朝下**（指向正下方的板凳），不是桌機版的側向指法，左右兩個對話框都一樣；推軌縮短為 1000ms（小螢幕上長轉場感覺更慢）；職位停留仍為 2000ms |

### Reduced Motion

`@media (prefers-reduced-motion: reduce)`：

- 完全跳過 loading 組裝與推軌
- 顯示靜態 loading 狀態，**計數器仍然計數**（計數是資訊，不是裝飾），但改為固定線性速度；**強制最短 2.5 秒的下限維持不變**，不會因為改成線性速度就縮短，避免計數一閃而過看不清楚
- 完成後直接交叉淡入到 Hero 最終狀態，300ms
- 職位仍然輪播，但改為單純 200ms 不透明度交叉淡入、無垂直位移，停留時間拉長為 3500ms
- 對話框直接以完整型態出現，無打字、無彈出

### 技術要求

- 單頁，無路由切換。Loading 與 Hero 是同一組元件樹的兩個狀態
- 板凳 SVG 元素在兩者之間**永不 unmount**
- 只動 transform 與 opacity（例外見 4.2 職位容器）
- 板凳必須是 inline SVG
- **計數器開始前先預載顯示字體**，避免計數中途 FOUT
- `will-change: transform` 只在推軌階段掛在板凳上，之後移除
- 全程目標 60fps。推軌是最高風險時刻——用 Chrome Performance 確認該階段**只有 composite，沒有 layout、沒有 paint**

### Acceptance Criteria

1. 計數器顯示 0–100 的**每一個**整數，無跳號、數字本身無翻頁或滑動效果
2. 位數變化時數字不左右抖動（tabular-nums 已驗證）
3. 計數器不會在資產真正載完前到 100%，且不會在 2.5 秒內結束
4. 推軌過程中板凳連續縮放——在任一幀暫停都看得到中間尺寸，不會是端點之一
5. Loading 與 Hero 之間沒有白閃、空白幀、或可見的頁面切換
6. 三組職位的**冠詞正確**（An INDUSTRIAL / A PRODUCT / A MAKER）
7. 職位替換時整行維持置中，**上下內容不位移，左右不跳動**
8. 職位輪播無限循環，分頁切到背景時暫停
9. 對話框從尾巴長出（從板凳），不是從中心放大
10. `lāi-té-tsē` 變音符號正確渲染，未 fallback 到其他字體
11. 每次重新整理完整重播
12. 推軌階段 Chrome Performance 無 layout、無 paint

---

## 6.2 Section 2 — Practice → All Work

**難度** ★★★

> 本章取代所有先前版本的「Section 2」與「Section 1.5」。

### 一、整體概念

Hero 結束後，畫面不是切換，而是一台攝影機持續往前推軌：先推進一片插畫拼貼，再穿過拼貼中央的作品影片，影片一路長成滿版，最後落在 All Works 的作品列表。

**全程是一個 DOM 結構、一支影片元素。** 影片從插畫中央到全螢幕之間，尺寸永遠連續，沒有任何一刻是重新掛載或交叉淡入。

### 二、結構與技術

- 外層 `#practice-to-work` 容器，`height: 420vh`
- 內層 stage：`position: sticky; top: 0; height: 100vh; overflow: hidden`
- 用 GSAP ScrollTrigger `scrub: 1` 取得 progress `p ∈ [0, 1]`
  - 對 progress 做 lerp，factor ≈ 0.08–0.12，製造慣性重量感而非 1:1 生硬跟隨
  - **必須接上 §3.2 的全站 Lenis instance**
- 只操作 `transform` / `opacity` / `clip-path`
- **全程 scrubbed**：往上滾必須完整反向，不能有任何只觸發一次的狀態

### 三、Stage A — 進場動畫（非滾動驅動，進入視窗時播一次）

在 `p` 開始推進之前，這段是時間驅動的，`once: true`，永不重播。觸發點：區塊越過視窗高度 70%。

**A1 — 插畫拼貼整組淡入（0 → 900ms）**

五個紅色描邊人形 + 所有彩色與紅色塊**全部一起出現**，當作單一群組動畫：

- `opacity 0 → 1`、`scale(0.94) → 1`、`translateY(20px) → 0`
- 900ms，主曲線
- **動整個 wrapper，不要逐一動每個元素**——既像一整張手作拼貼被放下，也省下大量 frame budget
- 中央的影片框屬於這個群組，一起淡入

**層次很重要。** 拼貼不是平的，每個元素指定三層之一：

| 層 | 位置 |
|---|---|
| 後層 | 位於影片框後方，會被影片框遮住一部分 |
| 中層 | 影片框本身 |
| 前層 | 疊在影片框邊緣上方 |

這個互相交疊才會讀成實體紙拼貼，而不是一堆貼紙並排。

**A2 — 標題跟進（600 → 1400ms）**

拼貼快落定時文字才進場，**300ms 的重疊是刻意的**，讓它像是餘勢而非另一個事件。

標題為兩行，靠左，含紅色強調字：

> I Design Across **Health** And The **Environment**,
> Taking Products From Sketch To Prototype, Physical And Digital Alike.

- 第一行：masked line reveal——包在 `overflow: hidden` 內，`translateY(100%) → 0`，750ms
- 第二行：同上，延遲 130ms
- **文字本身不做淡入，只靠遮罩**。比柔和的 fade 更俐落、更 editorial
- `Health` 與 `Environment` 為 `--accent`，其餘 `--ink`

**A3 — Idle 微幅呼吸（1500ms 之後）**

- 每個人形與色塊各自跑慢速 sine：`translateY ±3px`、`rotate ±0.8°`，週期 4–7 秒不等，彼此錯開相位
- 幅度要小到「只有刻意盯著看才會發現」。一旦讓人覺得「這在動」就是太多了
- 用 CSS keyframes + 錯開的 `animation-delay`，**不要走 JS/rAF**

### 四、Stage B — 滾動時間軸（以 progress p 為軸）

**p = 0 → 0.30：拼貼散開、標題離場**

影片開始變大時，插畫必須**主動讓路**。如果只是被蓋住，看起來會像 bug。

- 每個人形／色塊沿著**離拼貼中心的方向向外放射位移**，位移量與它原本離中心的距離成正比（本來就靠邊的跑最遠——這才像鏡頭往前穿過去）
- 同時 `opacity 1 → 0`、`scale 1 → 1.15`
- **前層元素跑得比後層快、也更早淡出。這個視差差異就是景深的關鍵**
- 標題：`translateY(0 → -140px)`、`opacity 1 → 0`、`scale(1 → 0.95)`，`p = 0.28` 前完全消失
- 背景色：從 Hero／Practice 底色 lerp 到 All Work 底色（CSS 變數插值，不是瞬間換色）

**p = 0.08 → 0.85：影片放大（主角，佔最長區間）**

> 注意起點是 **0.08**——拼貼還在畫面上時影片就已經開始長大，兩段刻意重疊，避免中間出現空白停頓。

實作方式：容器固定 `100vw × 100vh`，視覺尺寸完全靠 `clip-path: inset()` 控制，內層影片另外走 `transform: scale()`。

- `clip-path`：`inset(32% 30% 32% 30% round 20px)` → `inset(0% 0% 0% 0% round 0px)`
- 圓角與 inset 同步收斂
- 內層 `<video>`：`scale(1.12 → 1.0)`，反向推近的視差感
- 陰影：`0 24px 60px rgba(0,0,0,0.18)` → 完全消失
- **放大曲線要慢、穩、有份量：前段加速、後段長長地減速。是推軌，不是 zoom**

**p = 0.70 → 1.0：All Work 內容浮現**

- 影片上疊一層由下往上的漸層遮罩，`opacity 0 → 0.7`，確保文字可讀
- 區塊標題 `ALL WORKS ↗`（accent 紅、底線、右上箭頭）從 `translateY(80px), opacity 0` 浮現到定位
- 作品 grid 從畫面下緣推入：每個 item `translateY(60px → 0)`、`opacity 0 → 1`，stagger 60–80ms
- 出現 scroll cue（細線 + `Scroll to explore`）

> ⚠️ 待補：此處的作品 grid 顯示幾件？依 UI 稿為兩張大圖並排。請確認是固定的精選兩件，還是 `works.json` 的前兩筆。

### 五、中央影片的輪播

影片框持續輪播多支作品影片。

- 每支播 5 秒，以 **600ms opacity 交叉淡入**換到下一支（兩個 `<video>` 疊著淡入，**絕不硬切**）
- 無限循環整組
- **輪播在整個放大過程中持續進行**，不會因為開始變大而停住。換片與變大是兩件獨立的事，可以重疊發生
- 預先載入序列中的下一支，交叉淡入時不會卡住
- **任何時刻只掛載兩個 `<video>` 元素**（current + next），不要每支影片各掛一個

> ⚠️ **目前沒有作品影片。** 第一版請用靜態圖片（`<img>`）實作，動效邏輯完全相同——`clip-path` 縮放不管裡面是 video 還是 img。影片到位後只需換標籤。
> 用圖片時，「輪播」改為圖片以相同 5s / 600ms 交叉淡入節奏切換。

### 六、Easing 與節奏

- 主曲線（§2.3）
- 影片放大**刻意佔最長的 progress 區間**
- **相鄰動畫區間必須重疊**（拼貼還沒散完影片就開始長、影片還沒滿版 All Works 標題就開始浮現），任何一處出現空檔都會讓推軌感斷掉
- 不要彈性、不要 overshoot、不要 bounce

### 七、RWD

| 斷點 | 影片起始寬 | 插畫 | sticky 容器高 |
|---|---|---|---|
| 桌機 | 40vw | 五個人形 + 全部色塊 | 420vh |
| 平板 | 55vw | 減為三個最主要的人形 + 色塊 | 360vh |
| 手機 | 80vw | 只留兩個人形，改放在影片上下而非環繞 | 260vh |

- 手機關閉 idle 漂移（省電）
- 手機若效能吃緊，輪播改為單一 poster 圖 + 淡入
- 標題在任何斷點都不得超過三行

### 八、可存取性

`@media (prefers-reduced-motion: reduce)`：

- 跳過 Stage A 進場，直接顯示最終狀態
- 關閉 idle 漂移
- 關閉滾動放大——影片固定在中等尺寸，All Work 內容直接可見
- 輪播改為單純 opacity 交叉淡入，且不自動播放，顯示 poster + 播放控制

其他：

- 插畫為裝飾性，`aria-hidden="true"`、`alt=""`
- 標題必須是可選取的真實文字，不能是圖片
- 每支影片提供 poster
- 作品標題必須以真實文字存在於 DOM，不能只存在於影片畫面內

### 九、效能

- 只動 `transform` / `opacity` / `clip-path`
- 插畫用 inline SVG。若必須用點陣圖，PNG 帶 alpha、2 倍解析、明確標註尺寸避免 layout shift
- 影片上限 1080p、H.264 / WebM、移除音軌、積極壓縮——這些是進頁就自動播的
- `will-change: transform` 只在放大階段掛上，結束後移除
- 目標鎖 60fps。用 Chrome Performance 確認放大階段只有 composite，沒有 layout、沒有 paint

### Acceptance Criteria

1. 拼貼整組一起淡入，標題在其之後才進場，兩者不同時
2. Idle 漂移只有刻意盯著看才會發現
3. 影片變大時，插畫是向外放射散開並淡出，**不是被蓋住**
4. 前層與後層插畫的移動速度**肉眼可辨地不同**
5. 輪播在整個放大過程持續換片，不卡頓
6. 影片從插畫中央到滿版**全程尺寸連續**——在任一幀暫停都看得到中間尺寸，不會跳格
7. Hero → 拼貼 → All Work 之間沒有任何硬切換、閃白、或背景色階梯
8. 往上滾完整反向，沒有卡住的狀態
9. 放大全程影片不變形、不出現黑邊
10. 中階筆電上放大階段維持 60fps
11. 手機上不會因為 sticky 導致滾動卡頓或高度計算錯誤

---

## 6.3 Section 3 — 作品 Gallery（橫向）

**難度** ★★★★（全案最難）

區塊標題：`UIUX/ PRODUCT DESIGN/ APP DESIGN / CAD/ CRAFT/ REFLECTIVE DESIGN +MORE`（紅色、大寫、兩行）

### 整體體驗

慢、優雅、電影感、奢華。每個動作都有重量與慣性。**不俏皮、不彈跳、不彈性。** 那種感覺是在現代設計博物館裡瀏覽作品——動效存在的唯一目的是強化工藝感的知覺，絕不引起對自身的注意。

### 版面

- Gallery 佔據幾乎整個視窗
- 作品排成一條連續的水平軌道
- 每張卡片約 **40vw 寬、70–80vh 高**，卡片間距寬鬆（約 **6vw**）
- 使用者永遠看得到：**一件置中的聚焦作品，加上前後兩件的局部**
- 無邊框。必要時才用極淡的陰影。大量留白

### 動效系統——三層，優先順序明確

有三個獨立的動效來源。**必須照這個優先順序實作**：

**Layer 1 — 環境自動捲動（基線）**

- 軌道持續以極慢的固定速度向左漂移（約 **18–25px/秒**）。它要讀成「活著」，不是幻燈片
- **無縫無限循環**：複製軌道，並對軌道寬度取模 `translateX`，讓接點永遠在視窗外，不能看到跳接或終點
- **暫停條件**：以下情況時自動捲動在約 600ms 內緩緩停下——(a) 游標進入 gallery，(b) 使用者手動捲動。閒置 **2.5 秒**後緩緩恢復

**Layer 2 — 滾動驅動（使用者覆蓋）**

- 垂直滾輪 / 觸控板捲動轉換為軌道的水平位移
- 用 **Lenis**（§3.2 的同一個 instance）做重慣性平滑捲動。手感應該像在房間裡推動一面沉重的展牆
- 桌機支援按住拖曳，觸控支援原生滑動
- **落定行為（重要，別讀錯）**：**沒有瞬間吸附**。當捲動速度低於門檻時，軌道**溫和滑行**讓最接近的卡片對齊中央，耗時 500–700ms，主曲線。這個對齊必須與自然減速**無法區分**

**Layer 3 — 距中距離聚焦（永遠開啟）**

每張卡片的基礎狀態是它與視窗中心距離 `d ∈ [0, 1]` 的連續函數：

| 屬性 | d = 0（中央） | d = 1（最遠） |
|---|---|---|
| `scale` | 1.0 | 0.90 |
| `opacity` | 1.0 | 0.65 |
| `saturate` | 100% | 75% |

- 內部圖片有輕微視差：`translateX` 最多 ±16px，方向與軌道相反
- **不要用 `filter: blur()` 做景深**——多張大圖上太昂貴，會打破 60fps 目標。景深只透過 scale、opacity、saturation 達成

### Hover 互動（僅桌機）

游標懸停任一卡片時：

- **被 hover 的卡片**：scale 在它的 Layer-3 基礎 scale 上再乘 **1.04**，opacity 到 1.0，saturation 到 100%——**不論它離中心多遠**。被 hover 的卡片永遠勝過聚焦層
- **其他所有卡片**：基礎 scale 乘 **0.96**，opacity 降到 **0.45**，並套上 `filter: grayscale(100%)`
- 過場 400ms，主曲線。**灰階在 500ms 內淡入——比 scale 略慢**，讓它讀成氛圍而非狀態切換
- 被 hover 的卡片上淡入 overlay，向上錯開各 40ms：**作品標題 / 分類 / 年份 / 一句話描述**
- **效能護欄**：`will-change: transform, filter, opacity` 只在 hover 期間掛上，hover 結束移除。視窗外的卡片排除在灰階運算之外

### 點擊 / 導航

- 每張卡片是真正的 `<a href="/work/[slug]">`——可鍵盤聚焦、可右鍵開新分頁、可被爬蟲索引。**不是掛 onClick 的 div**
- 點擊時執行 shared-element transition 進入作品詳情頁：被點的圖片朝詳情頁的 hero 位置展開，同時 gallery 其餘部分淡出並輕微縮小（0.98）。耗時 700–900ms
- `:focus-visible` 狀態：1px accent 紅描邊，offset 8px。Tab 與方向鍵在卡片間移動，軌道會把聚焦的卡片捲到中央

### 排版與視覺

大尺寸 editorial 排版，瑞士風格，現代無襯線，強烈層級，極少文字。柔和中性配色。極簡博物館美學。**圖片始終是主角。** Gallery 中每件作品只放一張大主圖——輔助圖片只出現在詳情頁。

### RWD

| 斷點 | 規格 |
|---|---|
| 桌機 | 如上 |
| 平板 | 卡片 55vw，hover 效果保留但減弱（hover 卡片 1.02，其他不套灰階） |
| 手機 | 卡片 78vw。**完全沒有 hover 層**。改為最接近中央的卡片自動獲得「聚焦」處理（滿不透明度、滿飽和度），其餘為 0.85 不透明度、60% 飽和度。滑動瀏覽，點擊導航。**自動捲動關閉**（省電，且避免與觸控互搶） |

### 可存取性

- `@media (prefers-reduced-motion: reduce)`：關閉自動捲動、關閉視差、關閉 scale 過場。改為靜態的水平可捲動軌道 + 原生 `scroll-snap`。hover 簡化為單純的不透明度變化
- 所有圖片需有意義的 alt
- **卡片 metadata（標題、分類、年份）必須永遠存在 DOM 中**，hover 前只是視覺隱藏，**不可在 hover 時才注入**

### 效能

- 只動 transform 與 opacity。**絕不動 layout 屬性**（width、height、left、top、margin）
- `filter` 只用於 hover 灰階與飽和度漸變——**絕不用 blur**
- 所有圖片 lazy load；預載後兩張視窗外的圖片
- 提供 `srcset`，AVIF / WebP；解碼後尺寸上限 1600px 寬
- 目標鎖定 60fps。用 Chrome Performance 驗證：捲動期間無 layout thrashing、無超過 50ms 的 long task

### Acceptance Criteria

1. 軌道載入後自行漂移，游標一進入就優雅停下
2. hover 任一卡片會讓其他所有卡片變灰縮小，**無閃爍、無掉幀**
3. hover 狀態乾淨地覆蓋距離狀態——兩套 scale 系統之間沒有可見的「打架」
4. 捲動**永不硬吸附**，但最終總是對齊到某張卡片
5. 循環**沒有可見接縫**
6. 點擊卡片透過真實 URL 導航，並有連續的 shared-element transition
7. 中階筆電載入 12 件以上作品時持續 60fps

---

## 6.4 Footer（全站共用）

**難度** ★☆☆ ｜ **建議第一個做**

### 結構

**上區塊**

- 大標：`Get An Idea?` — 極大 editorial 無襯線，`--ink`，字距收緊，緊貼左邊界
- 其下：`Let's Talk! ↗` — `--accent-cta`，底線，尾隨右上箭頭字符
- 右上角：圓形描邊 back-to-top 按鈕（1px 細描邊，直徑約 64px），內含向上箭頭
- 下方一條滿寬 1px 分隔線

**下區塊——三部分**

- **左**：斜體灰標籤 `(Brief)`，其下一段簡短 bio，再其下紅色底線的 `CV Download` 連結
- **右側群組**：三欄堆疊連結，紅色大寫標題

| 欄 | 內容 |
|---|---|
| SITEMAPS | Home、Works、Playground、Contact（皆底線） |
| SOCIALS | LinkedIn（底線） |
| CONTACTS | `London, UK` 與 email——**純文字，無底線** |

**外框**：一條細的紅色 1px 邊框，從視窗邊緣內縮，框住整個 footer。

### 連結行為

| 元素 | 行為 |
|---|---|
| `Let's Talk! ↗` | `mailto:a898499@gmail.com?subject=Let's%20talk` |
| Home / Works / Contact | 內部路由 `/`、`/work`、`/contact` |
| **Playground** | 施工中，但**視覺樣式與 Home/Works/Contact 完全相同**（不做灰階、不降低不透明度——Figma node `3:163` 四個連結共用同一組樣式，沒有視覺區分）。不可點擊純粹是功能限制：`pointer-events: none`、`aria-disabled="true"`、`tabindex="-1"` 讓**鍵盤 Tab 跳過**。無 tooltip（Figma 沒有畫出對應樣式） |
| LinkedIn | `https://www.linkedin.com/in/lin-wei-ting-h-8a9732343`，`target="_blank"` + `rel="noopener noreferrer"` |
| CV Download | `<a href="/cv/Maida-Hu-CV.pdf" download="Maida-Hu-CV-2026.pdf">`。檔案放在 `/public/cv/`，`download` 屬性才會生效（僅同源有效） |
| CONTACTS 的 email | 也是 `mailto:` 連結。顯示套 `text-transform: capitalize` 取得 editorial 感，但**實際 href 必須小寫**：`mailto:a898499@gmail.com` |
| Back-to-top 圓圈 | 平滑捲動回頁首，約 900ms，主曲線。**必須呼叫 `lenis.scrollTo(0)`**，不可用原生 `scrollTo`（§3.2） |

### 進場動畫

footer 越過視窗高度 80% 時觸發一次（IntersectionObserver，`once: true`，**往回滾絕不重播**）。

**大標 `Get An Idea?`** — masked line reveal。整行包在 `overflow: hidden` 容器內，文字起始 `translateY(100%)`，900ms 升到 0，主曲線。它應該看起來像文字被從一道實心邊緣後方**抬起來**，不是淡入。

**其餘一切** — 單純的錯開上升：`translateY(24px) + opacity 0` → `translateY(0) + opacity 1`，各 600ms，主曲線。

| 元素 | 延遲 |
|---|---|
| 大標（遮罩揭露） | 0ms |
| Let's Talk! | 200ms |
| 分隔線——從左側展開，`scaleX 0 → 1`，`transform-origin: left`，800ms | 320ms |
| (Brief) + bio 段落 | 420ms |
| CV Download | 520ms |
| SITEMAPS 欄（內部每個連結再錯開 60ms） | 560ms |
| SOCIALS 欄 | 620ms |
| CONTACTS 欄 | 680ms |
| Back-to-top 圓圈——淡入並從 `-90deg` 轉到 0 | 760ms |

總長約 1.6s。應該感覺像 footer 在**冷靜地自我組裝**——無彈跳、無 overshoot。

### Hover 互動

**所有底線連結——底線擦除動畫。**

**不要用 `text-decoration`。** 底線用偽元素畫（`::after`，1px，定位在文字基線）。hover 時，線條**向右擦除**（`transform-origin: right`，`scaleX 1 → 0`），然後立刻**從左畫回**（`transform-origin: left`，`scaleX 0 → 1`）。每半段 300ms，主曲線。文字本身同時 `translateX(4px)`。

**`Let's Talk! ↗`** — 相同的底線擦除，另加箭頭字符右移 4px、上移 4px，整個元素略微提亮。350ms。

**`CV Download`** — hover 時標籤以垂直遮罩交換的方式交叉淡出成 `Download PDF (1.2MB)`：現有文字向上滑出，新文字向上滑入定位，兩者都在 `overflow: hidden` 包裝內。300ms。右側淡入一個向下箭頭圖示並輕輕上下擺動 3px。`:active` 時整個連結縮到 0.98。

> ⚠️ 待補：CV 的實際檔案大小，用來填 `Download PDF (?MB)`。

**Back-to-top 圓圈** — 描邊略微加粗，背景填入 accent 紅，箭頭轉白並上移 4px，圓圈放大到 1.06。400ms ease-out。點擊時箭頭往上射出圓圈，另一個從下方進入。

**Playground（停用）** — `pointer-events: none` 讓滑鼠完全無法觸發 hover（含底線擦除動畫），視覺樣式與其餘連結相同，只是停留在預設狀態，不會有任何互動反應。

**所有 hover 狀態必須在滑鼠移開時以相同時長乾淨反向。**

### 可存取性與 RWD

- 每個互動元素都需要可見的 `:focus-visible` 狀態：1px accent 紅描邊，4px offset。**hover 動畫也要在鍵盤聚焦時觸發**
- `mailto:` 與外部連結需要描述性 `aria-label`。外部 LinkedIn 連結要宣告會開新分頁
- `@media (prefers-reduced-motion: reduce)`：完全跳過進場序列（直接渲染最終狀態），所有 hover 效果簡化為 150ms 顏色變化
- **平板**：三個連結欄維持一列；bio 移到它們上方，佔滿寬
- **手機**：大標縮小但仍為主導；三個連結欄垂直堆疊，保留紅色標題；back-to-top 圓圈縮到 48px 並移到 CTA 下方。所有 hover 狀態替換為 `:active` 按壓狀態（scale 0.97）

### 技術注意

- 只動 transform 與 opacity
- `will-change: transform` 只在動畫執行期間掛上，之後移除
- 使用語意化的 `<footer>` 元素，SITEMAPS 欄用 `<nav>`
- 底線偽元素**不可影響版面**——用絕對定位

### Acceptance Criteria

1. 大標的揭露讀起來是**遮罩抬升**，不是淡入
2. 進場序列每次頁面載入只跑一次
3. CV Download 在桌機版 Chrome、Safari、Firefox 上觸發**真實的檔案儲存**，不是開 PDF 預覽分頁
4. 每個底線 hover 都是先擦除再畫回，無閃爍；游標中途離開時能正確反向
5. Playground 明顯存在但**真的不能點**，且鍵盤 Tab 會跳過
6. Back-to-top 使用與全站相同的 smooth-scroll instance

---

## 6.5 作品分類頁 `/work`

**難度** ★★☆ ｜ **本章為新增，原規格未涵蓋**

### 結構

由上而下：

1. **導覽列**（全站共用，此頁固定於頂端不隱藏）
2. **簡介區**
   - `Mihumisang! I'm Maida,` — 粗體斜體，`--ink`
   - 其下 bio 段落（見 §6.6 的 Brief 版本）
3. **篩選頁籤**：`All Works` / `Product design` / `Personal Work`
   - 當前選中者為 `--accent` 紅 + 加粗；其餘為 `--ink-muted`
   - 下方一條滿寬 1px 分隔線
4. **作品 grid**：桌機 **2 欄**，行間距寬鬆
5. **Footer**（§6.4）

### 作品卡

每張卡由上而下：

- 主圖（16:10 左右，`object-fit: cover`，圓角 0）
- 標題（Poppins 600，`--ink`）
- 一句話描述（`--ink-muted`，最多兩行，超出以 `…` 截斷）
- Tag 群組：膠囊狀，1px `--rule` 描邊，無填色，`--ink` 文字

整張卡是 `<a href="/work/[slug]">`。

### 篩選行為

**必須由 URL 驅動**：`/work?filter=product`。這樣分頁狀態可分享、可用瀏覽器上一頁。

點擊頁籤時：

1. **離場**：不符合的卡片 `opacity 1 → 0` + `scale(1 → 0.96)`，300ms，stagger 30ms
2. **重排**：用 GSAP Flip 讓保留下來的卡片平滑移動到新位置，400ms，主曲線
3. **進場**：新出現的卡片 `translateY(24px) + opacity 0` → 定位，400ms，stagger 40ms

> 三段必須有小幅重疊，總長不超過 900ms。這裡不需要電影感，要俐落。

**空狀態**：若某分頁沒有作品，顯示 `No works in this category yet.`（`--ink-muted`，置中）。

### 進場動畫

頁面載入時：

1. 簡介區文字 masked line reveal，兩行各 700ms，錯開 130ms
2. 篩選頁籤淡入 + 上升 16px，400ms，彼此錯開 60ms，延遲 300ms
3. 作品卡由上而下浮現：`translateY(40px) + opacity 0` → 定位，600ms，stagger 80ms，主曲線
   - **只有首屏可見的卡片參與**。其餘用 ScrollTrigger 在各自捲入視窗時觸發，`once: true`

### 卡片 Hover（僅桌機）

克制。這一頁是列表，不是展覽（展覽是 §6.3）。

- 主圖 `scale(1 → 1.03)`，500ms，主曲線。圖片外層 `overflow: hidden`，所以是圖在框內放大
- 標題 `translateX(4px)`，300ms
- 描述與 tags 不變
- **不要灰階、不要陰影、不要位移整張卡**

### RWD

| 斷點 | grid |
|---|---|
| 桌機 | 2 欄 |
| 平板 | 2 欄，間距縮小 |
| 手機 | 1 欄；篩選頁籤可水平捲動，不換行 |

### 可存取性

- 篩選頁籤用 `role="tablist"` / `role="tab"`，`aria-selected` 正確反映狀態
- 方向鍵可在頁籤間移動
- 篩選變更後，用 `aria-live="polite"` 宣告結果數量（例如 `Showing 7 works`）
- 每張卡的主圖需要有意義的 alt
- 卡片 `:focus-visible`：1px accent 紅描邊，4px offset

### Acceptance Criteria

1. 篩選狀態寫入 URL，重新整理後保持，瀏覽器上一頁可回到前一個分頁
2. 篩選切換時保留下來的卡片是**平滑移動**到新位置，不是消失再出現
3. 首屏以外的卡片在捲入時才動畫，且只播一次
4. 卡片是真實 `<a>`，可右鍵開新分頁
5. 手機上篩選頁籤不換行、不擠壓
6. 鍵盤可完整操作篩選與卡片導航

---

## 6.6 About Me `/about`

**難度** ★☆☆ ｜ **本章為新增，原規格未涵蓋**

### 結構

1. **導覽列**（固定於頂端）
2. **上區**：左為肖像，右為 About 文字
   - 肖像：黑白照，**有機形狀的紅色虛線描邊**（非正圓，手繪感）
   - 右側「About」膠囊標籤，其下兩段 bio
3. **下區**：左欄為 Employment 與 Education，右欄為 Awards
   - 「Employment」「Education」「Awards」皆為膠囊標籤（1px `--ink` 描邊，無填色）
4. **`See More Detail`** — 右下，大字，底線
5. **Footer**（§6.4）

### 內容

**About**

> Maida (Lin Wei-Ting) Hu is a Taiwanese Indigenous designer and Goldsmiths graduate based in London. Her practice moves across industrial, product, and reflective design, with an instinct for surfacing the problems others overlook and resolving them through design, often around health, women's health, and the environment.
>
> She is also a maker, shaping her prototypes by hand and working across craft media to explore how identity and environment are felt. Through self and family ethnography, she maps her many identities and her displacement far from home, remaking a single piece of furniture in different materials. This is how she defines her own design method.

**Employment**（每筆：年份 `--ink-muted` 小字 / 職稱 `--ink` / 公司 `--ink-muted`）

| 年份 | 職稱 | 公司 |
|---|---|---|
| 2023–2024 | Design & Admin Coordinator | Shen Yi Tech |
| 2021–2022 | UIUX Designer | Ebio Tech |

> ⚠️ Figma 稿目前是 2021–2022 在上、2023–2024 在下。履歷慣例為**新到舊**，此處已調整。若刻意如此請告知。

**Education**

| 年份 | 學校 | 學位 |
|---|---|---|
| 2024–2025 | Goldsmiths (UoL) | MA Design With Distinction |
| 2019–2023 | Ming-Chi University of Technology | BSc Industrial Design |

**Awards**（左為獎項名稱，右為結果，右對齊）

| 獎項 | 結果 |
|---|---|
| The Architecture Masterprize | Winner |
| iF Design Talent Award | Shortlist |
| Red Dot Award: Design Concept | Final Judging |
| Young Ones ADC | Shortlist |
| Great Design Award (Taiwan) | Gold Medal Award |
| Great Design Award (Taiwan) | Bronze Medal Award |
| Great Design Award (Taiwan) | Merit Award |
| KYMCO Motorcycle Design Award (Taiwan) | Shortlist |
| Dècor Hoüse Award (Taiwan) | Merit Award |
| Yodex Industry–Academia Cooperation with Hitachi Cooling & Heating Taiwan | Silver Award |

> **⚠️ 版面 bug（Figma 稿已出現）**：最後一列的獎項名稱過長，與右側 `Silver Award` **重疊**。
> 修正要求：獎項名稱欄設 `max-width`，結果欄設固定寬度並 `flex-shrink: 0`，兩者之間留至少 24px 間距。名稱過長時換行，**不可截斷、不可重疊**。

### 進場動畫

頁面載入時的錯開上升（`translateY(24px) + opacity 0` → 定位，600ms，主曲線）：

| 元素 | 延遲 |
|---|---|
| 肖像（另加 `scale(0.96) → 1`） | 0ms |
| 肖像的紅色虛線描邊——沿路徑描繪（`stroke-dasharray` 動畫），1200ms | 200ms |
| About 膠囊標籤 | 300ms |
| bio 第一段 | 400ms |
| bio 第二段 | 480ms |

下區用 ScrollTrigger 在捲入視窗時觸發（`once: true`）：

- Employment / Education / Awards 三個膠囊標籤先出現，錯開 80ms
- 各自的條目再依序浮現，同區內錯開 60ms
- Awards 有 10 列，總錯開時間控制在 700ms 內，否則最後幾列會等太久

`See More Detail` 最後出現，延遲 200ms。

### Hover

- `See More Detail`：與 §6.4 相同的底線擦除動畫
- 肖像：紅色虛線描邊緩慢旋轉（`rotate` 360°，20s 線性，無限循環）。**這是唯一的 idle 動效**，幅度必須讓人幾乎不會注意到

### RWD

- **平板**：肖像與 About 文字維持左右並排，肖像縮小；下區改為單欄堆疊
- **手機**：全部單欄。肖像置中且縮小。Awards 改為每筆兩行（名稱一行、結果一行右對齊），避免擠壓

### 可存取性

- 肖像需要 alt：`Portrait of Maida Hu`
- Employment / Education 用 `<dl>` 或語意化清單，不要用 `<div>` 堆
- Awards 用 `<table>` 或 `<dl>`，讓螢幕閱讀器能配對獎項與結果
- 虛線描邊為裝飾性，`aria-hidden="true"`
- `@media (prefers-reduced-motion: reduce)`：跳過所有進場，關閉描邊旋轉

### Acceptance Criteria

1. 最長的獎項名稱與其結果**不重疊**，在所有斷點皆然
2. Awards 的錯開總時間不超過 700ms
3. 螢幕閱讀器能正確配對每個獎項與其結果
4. 肖像描邊旋轉幾乎無法察覺
5. 手機上 Awards 不擠壓、不橫向溢出

---

## 7. 全域可存取性

- 所有互動元素都要可見的 `:focus-visible`：1px `--accent` 描邊，4px offset
- 鍵盤可完整操作全站，Tab 順序符合視覺順序
- 所有裝飾性插畫 `aria-hidden="true"` + `alt=""`
- **所有標題必須是可選取的真實文字，不可為圖片**
- 顏色對比：`--ink` on `--bg` 通過 AA；`--accent` 用於大字時通過 AA Large
- 外部連結宣告會開新分頁
- 全站尊重 `prefers-reduced-motion`——每個章節都有對應規格

---

## 8. 效能預算

| 指標 | 目標 |
|---|---|
| FPS | 全程 60，動效階段不可低於 55 |
| LCP | < 2.5s（不含 loading 動畫的強制 2.5s） |
| CLS | < 0.1 |
| Long task | 捲動期間不可有 > 50ms 的任務 |
| 首屏 JS | < 200KB gzipped |

**驗證方式**：Chrome DevTools Performance 面板。三個高風險時刻必須逐一檢查，且**只能有 composite，不可有 layout 或 paint**：

1. §6.1 板凳推軌（0 → 1300ms）
2. §6.2 影片放大（p = 0.08 → 0.85）
3. §6.3 Gallery 捲動與 hover 灰階

---

## 9. 待補清單

### 素材

- [ ] 板凳 SVG ×2（左右分開的獨立檔案）
- [ ] GOMO logo SVG
- [ ] 對話框 SVG ×2（框與文字分離，文字要能打字機效果）
- [ ] 五個紅色人形 SVG
- [ ] 所有彩色塊 SVG + 實際 hex 值
- [ ] 12 件作品主圖
- [ ] 作品影片（暫以靜態圖代替）
- [ ] Maida 肖像照（黑白）+ 有機形狀虛線描邊 SVG
- [ ] `Maida-Hu-CV.pdf` → 放 `/public/cv/`，並確認檔案大小

### 內容

- [ ] 12 件作品的 `description`（目前全是 placeholder）
- [ ] 12 件作品的 `year`
- [ ] 12 件作品的 `group`（product / personal，決定篩選分頁）
- [ ] §6.2 結尾的 All Works grid 顯示哪幾件

### 規格

- [ ] `/work/[slug]` 作品詳情頁
- [ ] `/contact` 頁
- [ ] `See More Detail` 連到哪裡

### 待確認

- [ ] Employment 順序（本文件已改為新到舊）
- [ ] `--bg` 是否 Hero 與 All Work 使用不同底色（§6.2 提到色彩 lerp，但 UI 稿看起來同色）

### 設計稿文字修正

| Figma 現況 | 應為 |
|---|---|
| `CV Dowlaod` | `CV Download` |
| `Linkedin` | `LinkedIn` |
| `BsC Industrial Design` | `BSc Industrial Design` |
| `yodex` | `Yodex` |

---

## 10. 建議開發順序

| 順序 | 章節 | 難度 | 理由 |
|---|---|---|---|
| 1 | §6.4 Footer | ★☆☆ | 自成一塊、規格最完整。練 GSAP timeline、stagger、遮罩揭露、hover——全是後面的基礎 |
| 2 | §6.6 About Me | ★☆☆ | 純靜態 + 進場動畫。練 ScrollTrigger 觸發 |
| 3 | §6.5 作品分類頁 | ★★☆ | 練資料驅動渲染、Flip 重排、URL 狀態 |
| 4 | §6.1 Loading → Hero | ★★★ | FLIP 連續轉場、計數器節奏、職位輪播 |
| 5 | §6.2 Practice → All Work | ★★★ | ScrollTrigger scrub、clip-path 縮放、視差分層 |
| 6 | §6.3 Gallery | ★★★★ | 無限迴圈 + 三層動效疊加 + 效能。全案最難，留到最後 |

**階段 1（原型）**：§6.4、§6.1、§6.2、§6.3 各做成 `prototypes/` 下的獨立單檔 HTML + GSAP CDN，只驗證動效。
**階段 2（整合）**：搬進 Next.js，接路由、`works.json`、Lenis 全域 instance。
