import About from '@/components/about/About';

// About Me（規格書 §6.6）。內容（bio 兩段、Employment、Education、Awards）
// 全部逐字取自 §6.6，常數放在 About.jsx。
//
// 導覽列用預設行為（startHidden:false），不呼叫 useNavBehavior。
// 這一頁沒有滿版 Hero，需要 .page-content 幫固定導覽列預留的 126px，
// 所以最外層「不要」加 data-nav-bleed（見 globals.css 該段註解）。
// ⚠️ description 是英文，不是中文。整站文案是英文、<html lang="en">，
// 這一句會直接出現在搜尋結果的摘要與社群分享卡片上——寫中文等於把中文摘要
// 送到英文讀者眼前（同 app/layout.js 那句的理由，2026-09-03 一起改）。
export const metadata = {
  title: 'About Me — GOMO',
  description:
    'Maida Hu is a Taiwanese Indigenous designer and maker based in London, working across industrial, product, and reflective design.',
};

export default function AboutPage() {
  return <About />;
}
