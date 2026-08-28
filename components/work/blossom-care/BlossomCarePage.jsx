'use client';

import PhotoStack from '../PhotoStack';

// Figma node 806:1084「作品頁＿blossomcare」，1440×10048。
// 版面邏輯全部在共用的 PhotoStack.jsx，這裡只負責提供清單與 alt。
//
// ⚠️ 使用者給的兩個 Figma 連結標籤是對調的：806-1084 標成 MVS，但圖層名是
// 「作品頁＿blossomcare」且是 10 張，跟 public/work/blossom-care/ 的 10 個檔案
// 吻合。這裡按圖層名與張數對應。已回報。
//
// 照片順序已驗證：Figma 第 1／5／10 張的資產與本地 01／05／10.jpg 的感知雜湊
// 漢明距離是 1／2／0（次相符 61 以上），順序一致。
//
// ⚠️ Next work 區塊沒做，理由同 MvsPage.jsx。
export default function BlossomCarePage() {
  return <PhotoStack base="/work/blossom-care" photos={PHOTOS} />;
}

// ⚠️ alt 是我看圖寫的**暫定**描述，使用者說之後會補正確版本。
// ⚠️ 這 10 張同樣是滿版文字的作品板，.visually-hidden 全文副本還沒做，
//    等使用者裁示，理由同 MvsPage.jsx。
const PHOTOS = [
  {
    file: '01',
    alt: 'Blossom Care 標題頁：粉色調的陰道 pH 試紙套組全家福，包含外盒、使用說明卡、採集棒與比色卡。',
  },
  {
    file: '02',
    alt: 'Background：復發性陰道感染的統計數字——50% 細菌性陰道炎六個月內復發、40–45% 女性經歷兩次以上黴菌感染，以及現有試紙產品的兩個問題。',
  },
  {
    file: '03',
    alt: 'Our Purpose：粉橘漸層的子宮與卵巢插畫，標語為透過包容性設計把健康自主權還給每位女性。',
  },
  {
    file: '04',
    alt: 'Development：從桌上型裝置到單次使用拋棄式的手繪發想草稿，以及兩款早期實體模型。',
  },
  {
    file: '05',
    alt: 'Brief：試紙套組的平躺俯視圖，展開的使用說明卡上有使用步驟、採集步驟與比色判讀表。',
  },
  {
    file: '06',
    alt: '套組細節俯視圖：採集棒、替換棒、試紙收集介質與外盒的排列，背景是淡色手繪草稿。',
  },
  {
    file: '07',
    alt: 'User Scenario：無障礙包裝、深度控制、包容性辨識、檢體採集四個使用情境的插畫。',
  },
  {
    file: '08',
    alt: 'Structure：採集棒的爆炸圖，標註檢測頭、海綿、深度擋片、pH 試紙、智慧水凝膠等零件，附產品尺寸規格表。',
  },
  {
    file: '09',
    alt: 'Material Reaction Process：檢體從檢測頭經海綿、吸收棉、試紙到水凝膠顯色的五步驟剖面圖。',
  },
  {
    file: '10',
    alt: 'Experiments & Modeling：手工模型製作過程的照片拼貼，包含矽膠翻模、3D 列印件、包裝打樣與試紙測試。',
  },
];
