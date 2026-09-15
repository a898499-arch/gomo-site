import works from '@/data/works.json';
import { metadata } from '@/app/layout';
import { PAGES } from '@/app/work/[slug]/page';

// sitemap.xml（App Router 慣例，2026-09-03；2026-09-15 改寫收錄條件）。
//
// ---------- 作品頁要不要進 sitemap，由兩個「各管各的」條件決定 ----------
//
//   PAGES[slug] 存在        這個網址「開不開得起來」（路由裡
//                           `if (!PAGES[slug]) notFound()`，就是 404 的判斷依據）
//   works.json 的 !hidden   這個作品「要不要公開」
//
// 兩者都成立才收錄。
//
// ⚠️ 2026-09-15 之前這裡只讀 PAGES 的 keys，等於把「路由存在」直接當成
// 「可以公開」。那讓「頁面做到一半」變成一個表達不出來的狀態：想在本機／
// 預覽看到半成品就得加進 PAGES，一加進去 Google 也同時拿到了網址。eHMS 第
// 一輪就踩到這個——骨架剛做完、第二三輪的動效都還沒有，網址已經在 sitemap 裡。
// 拆成兩個條件之後，做到一半的頁面可以「路由開著、但不公開」，做完只要把
// works.json 的 hidden 改掉，sitemap 自動包含，不用記得回來改第二個地方。
//
// ⚠️ PAGES 那個條件不能省。只看 !hidden 的話，某天有人先把 works.json 的
// hidden 改成 false、卻還沒在 PAGES 加對應元件，sitemap 就會把一個回 404 的
// 網址交給 Google，而且沒有任何錯誤訊息，要等搜尋主控台報 404 才會發現。
// 加上這個條件，「進得了 sitemap 的網址一定開得起來」在結構上就成立，
// 不需要另外寫一致性檢查。
//
// ⚠️ 這裡刻意不看 ready。ready:false 是「詳情頁還沒做好」，那是 WorkCard
// （卡片不可點）與 getNextWorks（不挑它）在管的事；能不能被搜尋引擎收錄
// 用 hidden 表達就夠了，多看一個欄位只會多一個要記得同步的地方。
//
// ⚠️ 網址來源是 layout 的 metadataBase，不在這裡再寫一次字串——
// 換自訂網域時只有 app/layout.js 一個地方要改。
const BASE = metadata.metadataBase.origin;

const WORK_SLUGS = works.filter((w) => !w.hidden && PAGES[w.slug]).map((w) => w.slug);

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
    ...WORK_SLUGS.map((slug) => ({
      url: `${BASE}/work/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    })),
  ];
}
