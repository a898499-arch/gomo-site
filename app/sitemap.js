import { metadata } from '@/app/layout';
import { PAGES } from '@/app/work/[slug]/page';

// sitemap.xml（App Router 慣例，2026-09-03）。
//
// ⚠️ 作品頁的清單直接來自 app/work/[slug]/page.js 的 PAGES——**不是**用
// works.json 的 ready/hidden 條件重新篩一次。
//
// 為什麼：PAGES 那張表就是「這個網址回不回 404」的判斷依據（路由裡
// `if (!PAGES[slug]) notFound()`）。sitemap 若自己用 works.json 再篩一次，
// 就等於有了第二份「哪些頁存在」的定義，而那兩份沒有任何機制保證一致。
// 走鐘的情境很具體：某天有人在 works.json 把某件的 ready 改成 true、
// 卻忘了在 PAGES 加對應元件——路由回 404，sitemap 卻已經把那個網址交給
// Google 了，而且不會有任何錯誤訊息，要等到搜尋主控台報 404 才會發現。
// 反過來直接用 PAGES 的 keys，同一份資料同時決定兩件事，結構上不可能不一致。
//
// （另一個選項是「用 works.json 篩 + 加一個 build 階段的一致性檢查」。
//  那能擋住走鐘，但代價是多一份清單、多一段檢查程式、多一個要維護的
//  失敗訊息——為了維持一個「本來就不必存在的」不變式。直接用單一來源
//  不需要檢查，因為沒有第二份東西可以不一致。）
//
// ⚠️ 網址來源是 layout 的 metadataBase，不在這裡再寫一次字串——
// 換自訂網域時只有 app/layout.js 一個地方要改。
const BASE = metadata.metadataBase.origin;

// 靜態頁。作品頁在下面從 PAGES 展開。
const STATIC_PATHS = ['/', '/about', '/work'];

export default function sitemap() {
  const now = new Date();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: path === '/' ? 'monthly' : 'yearly',
      priority: path === '/' ? 1 : 0.8,
    })),
    ...Object.keys(PAGES).map((slug) => ({
      url: `${BASE}/work/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    })),
  ];
}
