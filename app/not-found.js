import Link from 'next/link';

// 全站 404。
//
// ⚠️ 這一支不需要自己畫導覽列與頁腳——它渲染在 app/layout.js 的 <main
// className="page-content"> 裡面，Nav 與 Footer 是 layout 的一部分，本來就
// 會出現。同理也不加 data-nav-bleed：這一頁沒有滿版 Hero，需要 .page-content
// 幫固定導覽列預留的那 126px（做法同 app/about/page.js）。
//
// ⚠️ 2026-09-03 新增。在這之前 /work/<任何字串> 都會回 200 + 一個中文的開發用
// 空殼，那對搜尋引擎是 soft-404（會被收錄），對使用者是看到一句開發中的話。
// 現在 app/work/[slug]/page.js 查不到頁面就 notFound()，落到這裡。
export const metadata = {
  title: 'Page not found — Maida Hu',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <section className="page-container not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">
        This page doesn&rsquo;t exist — it may have moved, or the link may be wrong.
      </p>
      <Link href="/" className="link-underline not-found-link">
        Back to home
      </Link>
    </section>
  );
}
