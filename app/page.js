import fs from 'node:fs';
import path from 'node:path';
import HomeStage from '@/components/home/HomeStage';
import PracticeToWork from '@/components/home/PracticeToWork';
import Gallery from '@/components/home/Gallery';
import ScrollNextButton from '@/components/home/ScrollNextButton';

// 首頁 Loading → Hero（規格書 §6.1）。
// 這一輪只做 PHASE 1（組裝）與 PHASE 2（計數器）；PHASE 3 推軌與 PHASE 4
// Hero 內容下一輪再做。
//
// 板凳與 logo 必須是 inline SVG（CLAUDE.md：插畫一律 inline SVG，不用
// <img>），因為 PHASE 3 的推軌要直接量測並 transform 這些節點。
// 但壓縮後的板凳仍有 528KB / 218KB 的路徑資料，寫成 .jsx 會讓原始碼無法
// 閱讀也無法 diff，所以改成在 Server Component 讀檔、以字串傳給 client
// 元件 inline——渲染結果一樣是真正的 inline SVG DOM 節點。
//
// 素材：public/assets/svg/，已用 svgo --precision=2 壓過
// （原檔保留在 assets/svg/，未經壓縮）。
const SVG_DIR = path.join(process.cwd(), 'public', 'assets', 'svg');

function readSvg(name) {
  // 去掉根標籤的 width/height，尺寸一律交給 CSS 決定（viewBox 保留）
  return fs
    .readFileSync(path.join(SVG_DIR, name), 'utf8')
    .replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1')
    .replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1');
}

export default function HomePage() {
  return (
    <>
      <HomeStage
        benchLeftSvg={readSvg('stool_left.svg')}
        benchRightSvg={readSvg('stool＿right.svg')}
        logoSvg={readSvg('logo.svg')}
      />
      {/* §6.2 PRACTICE → ALL WORK。原型 prototypes/home.html 的排列是
          hero-stage 之後直接接這一段（1267 → 1364），順序照抄。 */}
      <PracticeToWork />
      {/* §6.3 GALLERY。原型排列同樣是 §6.2 之後直接接這一段（1404 → 1405）。 */}
      <Gallery />
      {/* 「捲到下一區塊」箭頭。原型放在 <nav> 之後、hero-stage 之前
          （1250–1263），但它是 position:fixed，DOM 位置不影響外觀；
          放在這裡是因為它只屬於首頁——anchors 讀的是 #practice-to-work
          與 #gallery，其他頁面沒有那兩個節點。 */}
      <ScrollNextButton />
    </>
  );
}
