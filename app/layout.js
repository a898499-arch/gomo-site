import { Poppins } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/LenisProvider';
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

export const metadata = {
  title: 'GOMO — Maida Hu',
  description: 'Maida Hu 的個人作品集',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <LenisProvider>
          <Nav />
          <main className="page-content">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
