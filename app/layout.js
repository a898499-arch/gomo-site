import { Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LenisProvider } from '@/components/LenisProvider';
import { NavBehaviorProvider } from '@/components/NavBehaviorProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// latin-ext 子集是必要的：全站文案有台語羅馬字（例如 "lāi-té-tsē"）跟法文借字（Dècor Hoüse）
// 需要的變音符號，只用預設 latin 子集會缺字。
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

// ⚠️ description 是英文，不是中文。整站文案是英文、<html lang="en">，
// 搜尋結果摘要與社群分享卡片都會直接顯示這一句——寫中文等於把中文摘要
// 送到英文讀者眼前（2026-09-03 使用者指示）。
//
// ⚠️ metadataBase 是正式網址（Cloudflare 註冊、Vercel 部署）。
// www.maidahu.com 會 308 轉址到這裡，所以 canonical 一律用**不帶 www** 的
// 版本——兩種都送給搜尋引擎會被當成兩個網站。
// 舊的 gomo-site.vercel.app 保留當備用，但不再出現在任何 metadata 裡。
// 之後如果再換網域，這裡要跟著改——否則 og:image、twitter:image 與 sitemap
// 全都會指向舊網址。
// 這一個值同時是 app/robots.js 與 app/sitemap.js 的網址來源（兩支都讀
// 這裡的 metadata.metadataBase），所以只有這一個地方要改。
//
// og:image / twitter:image **不寫在這裡**：App Router 會自動認
// app/opengraph-image.jpg（1200×630）這個檔名並產生兩組標籤，
// 手動再寫一次反而會重複。網站圖示同理，來自 app/icon.svg。
// ⚠️ 站名是「Maida Hu」，不是「GOMO」（2026-09-03 改）。
// 首頁不加「頁名 — 站名」的格式，站名本身就夠了；其餘各頁是「頁名 — Maida Hu」。
// 為什麼換掉：分頁很窄，「GOMO — Maida Hu」會被截成「GOMO — Maid…」，
// 名字剛好被切掉。而分頁上已經有 app/icon.svg 的 GOMO 圖示負責品牌識別，
// 標題文字就該負責圖示做不到的事——告訴人這是**誰**的作品集。
// ⚠️ 這是「站名」的改動，不是拿掉 GOMO 這個識別：標誌元件
// components/GomoMark.jsx 與 app/icon.svg 都保留。
//
// ⚠️ title 與 openGraph.title **刻意是不同的值**，不是漏改（2026-09-03）：
//   title（瀏覽器分頁）  分頁很窄，長標題會被截斷，所以只放站名。
//   openGraph.title（連結預覽卡）  分享到 LINE / iMessage / Slack 時看到的
//     那張卡片有空間，應該一句話講完「誰 + 做什麼」。
// 之後改其中一個時想一下另一個要不要跟，但別把它們合併成同一個值。
export const metadata = {
  metadataBase: new URL('https://maidahu.com'),
  title: 'Maida Hu',
  // ⚠️ 「Six case studies」這個數字跟 app/work/[slug]/page.js 的 PAGES 筆數
  // 綁在一起（目前 6 筆）。之後作品增加時這句話要跟著改，否則會過時——
  // 它是搜尋結果與分享卡片上直接看得到的文字，數字錯了會很明顯。
  description:
    'Product and UI/UX designer based in London. Six case studies across product, app, and interface design — including this site, designed, specced, and built from scratch.',
  openGraph: {
    title: 'Maida Hu — Product & UI/UX Designer',
    // 與上面的 description 同一句，改一邊要兩邊一起改。
    description:
      'Product and UI/UX designer based in London. Six case studies across product, app, and interface design — including this site, designed, specced, and built from scratch.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* embed/README.md：Raleway/Jost/Inter 是 WanderBuddy 作品內容（flow.css）自己的字體，
            不是全站字體，故意不用 next/font（會產生雜湊過的 font-family，跟 flow.css 裡
            寫死的 "Raleway" 對不上）。純字面 link 標籤，只讓 flow.css 自己的選擇器吃得到，
            不影響全站的 Poppins。Lora/DM Sans 同理是 Sui-Sui 作品詳情頁 Design System —
            Typography 區塊要展示的字體本身（比照 WanderBuddy 的 Raleway/Jost 處理方式），
            頁面其餘真實內容仍用全站的 Poppins。
            2026-08-22：All UI Animation 區塊改成 iframe 嵌入原始 HTML（見
            OnboardingDemo.jsx），那個 HTML 自己的 <head> 會載入它需要的
            Lora/DM Sans 字重，不需要外層頁面重複載入——之前為它額外加的
            italic/500/700 字重（2026-08-20 那輪）已經拿掉，只保留
            Typography 展示區塊實際會用到的 Lora 400/600。
            2026-08-24：Function 3（components/HandWarmUp/）的 .num 用
            DM Sans font-weight:500，原本的 DM Sans 範圍只到 400，補上
            200..500。這個元件是直接內嵌的 React 元件（不是 iframe），
            沒有自己的 <head>，字體要靠外層頁面載入。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&family=Jost:wght@300;400;500;700&family=Inter:wght@400;600&family=Lora:wght@400;600&family=DM+Sans:opsz,wght@9..40,200..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LenisProvider>
          <NavBehaviorProvider>
            {/* ⚠️ 跳至主要內容（2026-09-03 補）。
                鍵盤使用者每進一頁都得先 Tab 過導覽列的 logo + 三個連結才碰得到
                內容，每一頁都要重來一次。這條連結平常用 .skip-link 移出畫面，
                只有被 Tab 到（:focus）時才滑進來。
                ⚠️ 必須放在 <Nav /> **之前**——它要是 body 裡第一個可聚焦的元素，
                放在後面就失去意義了。
                ⚠️ 目標 #main-content 是 <main> 的 id，配 tabIndex={-1}：
                <main> 本身不可聚焦，不加的話 Safari/Chrome 會把焦點留在原地，
                只有捲動位置變了，接下來按 Tab 又跳回導覽列。 */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Nav />
            {/* 滿版 Hero 頁面（首頁 / sui-sui / wanderbuddy）不需要這層的
                padding-top。判斷完全交給 globals.css 的
                `.page-content:has(> [data-nav-bleed])`，因為那是純 CSS、
                第一次排版就生效；用 context 在 hydration 之後翻 class 會
                造成 126px 的 layout shift（詳見 globals.css 該段註解）。
                所以這裡是死的 className，不要再包成 client component。 */}
            <main className="page-content" id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </NavBehaviorProvider>
        </LenisProvider>
        {/* embed/README.md「Next.js（App Router）」步驟 3：flow.js 是原生 JS，
            用 next/script 掛全域，不要改寫成 React */}
        <Script src="/flow.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
