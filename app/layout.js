import { Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LenisProvider } from '@/components/LenisProvider';
import { NavBehaviorProvider } from '@/components/NavBehaviorProvider';
import Nav from '@/components/Nav';
import PageContent from '@/components/PageContent';
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

export const metadata = {
  title: 'GOMO — Maida Hu',
  description: 'Maida Hu 的個人作品集',
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
            Typography 展示區塊實際會用到的 Lora 400/600、DM Sans
            200..400。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&family=Jost:wght@300;400;500;700&family=Inter:wght@400;600&family=Lora:wght@400;600&family=DM+Sans:opsz,wght@9..40,200..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LenisProvider>
          <NavBehaviorProvider>
            <Nav />
            <PageContent>{children}</PageContent>
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
