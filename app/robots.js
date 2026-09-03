import { metadata } from '@/app/layout';

// robots.txt（App Router 慣例，2026-09-03）。
//
// ⚠️ 刻意用 app/robots.js 而不是手寫 public/robots.txt：手寫的話網址得寫死
// 一次在 robots.txt、一次在 metadataBase，換自訂網域時漏改一個就會讓
// Sitemap 那行指到舊網址。這樣寫則是從同一個 metadataBase 導出來的。
//
// 全站開放索引。目前沒有需要擋的路徑——/work/<未知 slug> 已經回真正的 404
// （見 app/work/[slug]/page.js），不需要靠 robots 擋。
const BASE = metadata.metadataBase.origin;

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
