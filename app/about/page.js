import About from '@/components/about/About';

// About Me（規格書 §6.6）。內容（bio 兩段、Employment、Education、Awards）
// 全部逐字取自 §6.6，常數放在 About.jsx。
//
// 導覽列用預設行為（startHidden:false / fullBleedTop:false），不呼叫
// useNavBehavior：這一頁沒有滿版 Hero，需要 .page-content 幫固定導覽列
// 預留的空間。
export const metadata = {
  title: 'About Me — GOMO',
  description: 'Maida Hu —— 台灣原住民設計師與創作者，現居倫敦',
};

export default function AboutPage() {
  return <About />;
}
