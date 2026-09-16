'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 「04 KEY DECISIONS — animation」的床墊狀態動畫（Figma node 912:388 底下、
// 原本是 912:393 那個空灰塊的位置）。
//
// 內容是 Maida 做好的成品，用 iframe 原樣載入
// public/work/ehms/states/mattress-animations.html——比照
// components/work/sui-sui/ProcessAnimation.jsx 對 carousel.html 的做法。
//
// ⚠️ 為什麼是 iframe 而不是把 HTML 內聯進來：那份檔案有三段全域樣式
//   html, body { margin: 0; background: #fff; }
//   body { display: flex; min-height: 100vh; align-items: center; … }
// 內聯的話會把**整個網站的 body** 變成置中的 flex 容器、底色從 #FCFBF8
// 被改成 #fff，每一頁都會壞。iframe 是獨立文件，這些樣式物理上出不來，
// 隔離是零編輯達成的，不需要手動把全域選擇器改寫成 wrapper 底下的規則。
// 同樣的道理也解掉字體：它用 <link> 載 Google Fonts 的 Inter，留在 iframe
// 內不碰父頁，也完全不經過 next/font（next/font 會把 font-family 換成雜湊
// 名稱，跟檔案裡寫死的 `font-family: Inter` 對不上——WanderBuddy 踩過）。
//
// ⚠️ 那份檔案自己跑一個 rAF 迴圈，原本沒有暫停檢查，捲出畫面外還會一直跑。
// 這裡用 ScrollTrigger 偵測進出視窗、postMessage 通知它開關——實際的暫停
// 邏輯留在 iframe 內部（見該檔案檔頭的 [批准修改 1/2]），這裡完全不碰時序。
// ⚠️ 刻意不用原生 IntersectionObserver：Lenis 接管捲動之後它在這個站上
// 不作用（Sui-Sui 踩過）。ScrollTrigger 已經掛在共用的 Lenis 上。
//
// ⚠️ 尺寸用檔案自己的 1088×218（SVG viewBox），不是 Figma 的 912:392——
// 那個框只是 Maida 在 Figma 上的佔位示意。兩者數值剛好相同，所以沒有衝突，
// 也不需要更高的空間。內容欄 1085 之下高度是 217.4px。
export default function StateAnimations() {
  const frameRef = useRef(null);
  const iframeRef = useRef(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const iframe = iframeRef.current;
    if (!frame || !iframe) return undefined;

    function send(msg) {
      iframe.contentWindow?.postMessage(msg, '*');
    }

    const st = ScrollTrigger.create({
      trigger: frame,
      start: 'top bottom',
      end: 'bottom top',
      // ⚠️ 用 onToggle 的 self.isActive 判斷，不要用 onEnter/onLeave 四個回呼。
      // 那四個是「跨越了哪一條邊界」，要自己推導當下在不在範圍內；
      // isActive 直接就是答案，不會因為一次跳很遠只觸發其中一條而推錯。
      onToggle: (self) => send(self.isActive ? 'play' : 'pause'),
      // 建立當下就同步一次，否則首次進站時 iframe 會一直跑到第一次跨越邊界為止。
      onRefresh: (self) => send(self.isActive ? 'play' : 'pause'),
    });
    return () => st.kill();
  }, []);

  return (
    <>
      <div className="eh-states-frame" ref={frameRef}>
        <iframe
          ref={iframeRef}
          src="/work/ehms/states/mattress-animations.html"
          title="eHMS mattress mode animations"
          /* ⚠️ 必要：觸發點是在 useLayoutEffect 當下算的，那時 iframe 還沒載入、
             下方的 lazy 圖也還沒撐開頁面高度，start/end 會落在錯誤的捲動位置
             （實測結果是完全相反：在畫面內送 pause、在畫面外送 play）。
             iframe 載入後強制重算一次。LenisProvider 雖然也在 fonts.ready／
             window load／body resize 各補一次 refresh，但那些都不保證發生在
             這個 iframe 進 DOM 之後。 */
          onLoad={() => ScrollTrigger.refresh()}
        />
      </div>

      {/* 無障礙補償（CLAUDE.md）：iframe 裡是動畫 SVG，狀態名稱是隨時間
          置換的 <text>，螢幕閱讀器與搜尋引擎讀不到完整清單。這裡補一份
          視覺隱藏的純文字副本。 */}
      <p className="visually-hidden">
        A looping animation of the mattress control screen cycling through four states: no one in
        bed, starting, back pressure relief, and hip pressure relief. Each state shows the air cells
        under the body rising and falling, with the hip state also marking the pressure hotspot.
      </p>
    </>
  );
}
