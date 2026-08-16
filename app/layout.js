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
            不影響全站的 Poppins。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&family=Jost:wght@300;400;500;700&family=Inter:wght@400;600&display=swap"
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
