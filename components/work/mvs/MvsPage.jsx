'use client';

import PhotoStack from '../PhotoStack';

// Figma node 806:1144「作品頁＿MVS」，1440×10749。
// 版面邏輯全部在共用的 PhotoStack.jsx，這裡只負責提供清單與 alt。
//
// ⚠️ 使用者給的兩個 Figma 連結標籤是對調的：806-1084 的圖層名是
// 「作品頁＿blossomcare」（10 張），806-1144 才是 MVS（11 張）。這裡按圖層名
// 與張數對應，跟 public/work/mvs/ 的 11 個檔案數量吻合。已回報。
//
// 照片順序已驗證：拿 Figma 資產與本地檔做感知雜湊比對，Figma 第 n 張命中
// 本地 n.jpg，漢明距離 0–2 / 256（次相符 61 以上），順序一致。
//
// Next work（Figma 806:1165）由共用的 components/work/NextWork.jsx 輸出，
// 挑選規則抽在 lib/getNextWorks.js。
export default function MvsPage() {
  return <PhotoStack base="/work/mvs" photos={PHOTOS} slug="mvs" />;
}

// ⚠️ alt 與 summary 都是我看圖寫的**暫定**描述，使用者說之後會補正確版本。
//
// heading + summary 會被 PhotoStack 輸出成一份 .visually-hidden 的文字副本
// （CLAUDE.md 對匯出圖的無障礙補償）。使用者 2026-08-28 裁示**只做重點段落**
// ——每張抓標題加一句核心敘述，不做 11 張板子的逐字轉錄。
const PHOTOS = [
  {
    file: '01',
    alt: 'MVS 標題頁：白色與薄荷綠的三輪機車式行動疫苗站側視渲染圖，車側掛載擔架式邊車，背景是城市街道。',
    heading: 'MVS —— 標題頁',
    summary:
      'Mobile Vaccination Station：整合冷鏈與緊急照護的行動疫苗站，縮短專業醫療服務的距離。',
  },
  {
    file: '02',
    alt: 'Background 與 Research 章節：疫苗覆蓋率的折線圖，以及現有疫苗保冷箱、疫苗瓶與注射器的問題點標註。',
    heading: 'Background & Research',
    summary:
      '提高疫苗覆蓋率是後疫情時代的關鍵，但偏鄉成人的接種率長期落後都市，交通與醫療資源不足是主因；現有疫苗保冷箱又有搬運不易、防震不足、保溫失效等問題。',
  },
  {
    file: '03',
    alt: 'User Journey Map：屏東衛生局巡迴接種團隊從出發、路途、接種前、接種中到返程的五階段流程與情緒曲線。',
    heading: 'User Journey Map',
    summary:
      '屏東衛生局巡迴接種團隊每週固定下鄉，山路顛簸使疫苗劇烈晃動、有效性受損，返程還要處理大量紙本紀錄。',
  },
  {
    file: '04',
    alt: 'Design Strategy：三張情境照——崎嶇山路、疫苗瓶與注射器的靜物、救護車內的擔架，分別對應行動診間、防震冷鏈與雙用途緊急應變。',
    heading: 'Design Strategy',
    summary:
      '三個設計主軸：整合式行動工作流、主動式防震冷鏈保護，以及可轉換為擔架的雙用途緊急應變。',
  },
  {
    file: '05',
    alt: 'Modules：機車、疫苗箱、隱私帳篷、邊車、電池五個模組的爆炸圖與說明。',
    heading: 'Modules',
    summary:
      '整車由疫苗充電站、疫苗箱、隱私帳篷、邊車、電池五個模組組成。',
  },
  {
    file: '06',
    alt: 'Vaccine Box：疫苗保冷箱的外觀渲染、堆疊狀態，以及抗震結構的磁浮避震剖面圖。',
    heading: 'Vaccine Box',
    summary:
      '抗震結構的疫苗保冷箱，側邊 180 度安全鎖便於搬運，內層以抗菌塗層絕緣玻璃維持冷鏈穩定。',
  },
  {
    file: '07',
    alt: 'Structure 與 User Interface：保冷箱內部結構的七項標註，以及疫苗資訊與接種者資料兩個介面畫面。',
    heading: 'Structure & User Interface',
    summary:
      '保冷箱含折疊把手、抗菌顯示、主動冷卻電源模組、高效能熱芯與吸震矽膠矩陣；介面顯示疫苗品項、儲存溫度、庫存與接種者資料。',
  },
  {
    file: '08',
    alt: 'User Scenario 上半：到場部署、站點架設、問診模式、疫苗取用四個使用情境的示意圖。',
    heading: 'User Scenario（上）',
    summary:
      '到場部署、站點架設、問診模式、疫苗取用四個階段：車輛抵達後由邊車展開為行動診間。',
  },
  {
    file: '09',
    alt: 'User Scenario 下半：接種與資料同步、緊急轉換、快速運送、無縫交接四個情境的示意圖。',
    heading: 'User Scenario（下）',
    summary:
      '接種與雲端資料同步、緊急轉換、快速運送、與救護車無縫交接四個階段：邊車可就地轉為擔架送醫。',
  },
  {
    file: '10',
    alt: 'Specifications：車體側視與正視的尺寸標註圖，以及邊車作為擔架、工作檯、救護車內固定三種用法。',
    heading: 'Specifications',
    summary:
      '車長 2250mm、輪距 1250mm、車高 1100mm；邊車可作擔架、工作檯，或固定於救護車內。',
  },
  {
    file: '11',
    alt: 'Service System：政府、生產供應、冷鏈物流、醫療機構、民眾、偏鄉之間的服務流程關係圖。',
    heading: 'Service System',
    summary:
      '政府採購疫苗、冷鏈物流配送、MVS 送達偏鄉施打，接種資料回傳雲端，縮短城鄉的醫療可近性落差。',
  },
];
