'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:101「logo& overview」，1086×501.576，y=1056。
//
// ⚠️ logo（node 912:104）在使用者原本給的素材清單裡漏掉了，漏了整區
// 是空的。匯出圖含光暈外擴：檔案 289×254，綠色本體 191×191（實測
// 像素邊界），下方用負 margin 抵銷光暈，見 ehms.css 的 .eh-logo。
//
// 四欄 meta 用 <dl>：label/value 是定義關係，不是表格也不是清單。
export default function LogoOverview() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-section--lead" ref={ref}>
      <div className="eh-logo-wrap eh-in">
        <img
          className="eh-logo"
          src="/work/ehms/logo.webp"
          srcSet="/work/ehms/logo.webp 1x, /work/ehms/logo@2x.webp 2x"
          width={289}
          height={254}
          loading="lazy"
          decoding="async"
          alt="eHMS 的 App 圖示：深綠色圓角方形，中央是一條白色心電圖線條，右側延伸成一個側躺人形的輪廓。"
        />
      </div>

      {/* 頁面標題語意在 Hero 的 <h1>，這裡是同一字串的視覺重複，用 <p> */}
      <p className="eh-lo-title eh-col eh-in">eHMS 2.0</p>

      <p className="eh-lo-intro eh-lo-wide eh-in">
        My first UI project, built inside an engineering team where no one had done UI before.
        <br />
        A phone app for eBio&rsquo;s smart pressure-relief beds. Nurses and carers use it to control
        the bed, read lying records, and receive alerts.
      </p>

      <hr className="eh-lo-rule eh-lo-wide eh-in" />

      <dl className="eh-lo-meta eh-col eh-in">
        <div>
          <dt>My Role</dt>
          <dd>UI/UX Designer (industrial placement)</dd>
        </div>
        <div>
          <dt>Product Type</dt>
          <dd>Medical device app</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>2021&ndash;2022</dd>
        </div>
        <div>
          <dt>Platform</dt>
          <dd>Android</dd>
        </div>
      </dl>
    </section>
  );
}
