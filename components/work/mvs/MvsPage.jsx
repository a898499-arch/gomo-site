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
// ⚠️ Next work 區塊沒做：Figma 的 806:1165 有這一段，但現行的 AeroVPage 也
// 同樣沒有做（sui-sui 與 wanderbuddy 才有各自的 NextWork.jsx）。這一輪照
// 「就是照片依序排列」的指示只做照片，要補 Next work 再說。
export default function MvsPage() {
  return <PhotoStack base="/work/mvs" photos={PHOTOS} />;
}

// ⚠️ alt 是我看圖寫的**暫定**描述，使用者說之後會補正確版本。
//
// ⚠️ 還有一件事沒做、等使用者裁示：這 11 張其實是整頁的作品板，裡面全是文字
// （BACKGROUND、RESEARCH、USER JOURNEY MAP、規格表…）。CLAUDE.md 對匯出圖的
// 規定是「有意義的 alt ＋ 一份 .visually-hidden 的完整純文字副本」，後者是 11
// 張板子的逐字轉錄，量很大，已單獨提出來問、還沒得到答覆，所以目前只有 alt。
const PHOTOS = [
  {
    file: '01',
    alt: 'MVS 標題頁：白色與薄荷綠的三輪機車式行動疫苗站側視渲染圖，車側掛載擔架式邊車，背景是城市街道。',
  },
  {
    file: '02',
    alt: 'Background 與 Research 章節：疫苗覆蓋率的折線圖，以及現有疫苗保冷箱、疫苗瓶與注射器的問題點標註。',
  },
  {
    file: '03',
    alt: 'User Journey Map：屏東衛生局巡迴接種團隊從出發、路途、接種前、接種中到返程的五階段流程與情緒曲線。',
  },
  {
    file: '04',
    alt: 'Design Strategy：三張情境照——崎嶇山路、疫苗瓶與注射器的靜物、救護車內的擔架，分別對應行動診間、防震冷鏈與雙用途緊急應變。',
  },
  {
    file: '05',
    alt: 'Modules：機車、疫苗箱、隱私帳篷、邊車、電池五個模組的爆炸圖與說明。',
  },
  {
    file: '06',
    alt: 'Vaccine Box：疫苗保冷箱的外觀渲染、堆疊狀態，以及抗震結構的磁浮避震剖面圖。',
  },
  {
    file: '07',
    alt: 'Structure 與 User Interface：保冷箱內部結構的七項標註，以及疫苗資訊與接種者資料兩個介面畫面。',
  },
  {
    file: '08',
    alt: 'User Scenario 上半：到場部署、站點架設、問診模式、疫苗取用四個使用情境的示意圖。',
  },
  {
    file: '09',
    alt: 'User Scenario 下半：接種與資料同步、緊急轉換、快速運送、無縫交接四個情境的示意圖。',
  },
  {
    file: '10',
    alt: 'Specifications：車體側視與正視的尺寸標註圖，以及邊車作為擔架、工作檯、救護車內固定三種用法。',
  },
  {
    file: '11',
    alt: 'Service System：政府、生產供應、冷鏈物流、醫療機構、民眾、偏鄉之間的服務流程關係圖。',
  },
];
