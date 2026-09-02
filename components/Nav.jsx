'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import GomoMark from '@/components/GomoMark';
import { useLenis, ROUTE_CHANGE_EVENT } from './LenisProvider';
import { useNavBehaviorConfig } from './NavBehaviorProvider';
import { mainEase } from '@/lib/ease';

// §4：全站統一的 hide-on-scroll — 往下滾隱藏、往上滾出現，distance<=100px 永遠顯示，
// 累積位移超過 8px 才判定方向（防抖）。從 prototypes/*.html 逐字搬過來，唯一的差異是
// home.html 專屬的「§6.2 影片放大時強制隱藏」覆寫規則，等 Section 2 動效一起搬過來時再加回去。
//
// 滿版 Hero 頁面（例如作品詳情頁）可以透過 NavBehaviorProvider 的
// useNavBehavior({ startHidden: true }) 覆寫成：進頁時先隱藏、往下滾再往上滾
// 才叫出來，且停用「距離頂端 100px 永遠顯示」這條規則（不然一停在頂端就會
// 被強制拉出來，跟「先隱藏」互相打架）。其他頁面不受影響。
const TOP_DEAD_ZONE = 100;
const DIRECTION_THRESHOLD = 8;

export default function Nav() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const lenis = useLenis();
  const { config, registerNavIntro, navForceHiddenRef, registerNavForceHide } = useNavBehaviorConfig();
  const startHidden = config.startHidden;
  const deferIntro = config.deferIntro;
  // 導覽列在滿版 Hero 頁面的透明背景「不」在這裡處理——見 globals.css 的
  // `body:has(.page-content > [data-nav-bleed]) .site-nav`。用 JS 加 class
  // 會晚一個 hydration，首幀會閃一下不透明的米色 bar。

  // §6.1 PHASE 3.3：首頁的推軌時間軸要在 +400ms 讓 logo 與連結進場。
  // 這裡用「註冊制」——Nav 自己決定怎麼演，頁面只呼叫 playNavIntro() 說
  // 何時演。元素的 ref 與動效都留在這個元件內，頁面不需要跨元件抓 DOM。
  useEffect(() => {
    const logo = logoRef.current;
    const links = linksRef.current ? Array.from(linksRef.current.children) : [];
    if (!logo || !links.length) return;

    if (!deferIntro) {
      // ⚠️ 必須清乾淨，不能只是「不設」：使用者可能在首頁 intro 還沒播完
      // 就離開（瀏覽器上一頁，或任何 +400ms 之前的導航），resetConfig 會把
      // deferIntro 打回 false，但先前 gsap.set 寫進 inline style 的
      // opacity:0 不會自己消失——不清的話 /work、/about 會看到一條空的
      // 導覽列。
      gsap.set([logo, ...links], { clearProps: 'opacity,transform,transition' });
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // .nav-logo 的 CSS 有 transition: opacity 300ms（給 hover 用），會跟
    // GSAP 每幀寫入的 opacity 打架，進場期間先關掉，播完還原。
    gsap.set([logo, ...links], { opacity: 0, transition: 'none' });
    gsap.set(logo, { y: 12 });
    gsap.set(links, { y: 10 });

    const play = () => {
      const done = () => gsap.set([logo, ...links], { clearProps: 'transition,willChange' });
      if (reduceMotion) {
        gsap.set([logo, ...links], { opacity: 1, y: 0 });
        done();
        return;
      }
      gsap.set([logo, ...links], { willChange: 'transform, opacity' });
      const tl = gsap.timeline({ onComplete: done });
      // 小 logo 淡入 + 上升 12px——讀起來就是剛從中央消散的那個標記
      tl.to(logo, { opacity: 1, y: 0, duration: 0.5, ease: mainEase }, 0);
      // 三個連結各上升 10px，彼此錯開 60ms
      tl.to(links, { opacity: 1, y: 0, duration: 0.5, ease: mainEase, stagger: 0.06 }, 0.06);
    };

    return registerNavIntro(play);
  }, [deferIntro, registerNavIntro]);

  useEffect(() => {
    if (!lenis) return;

    const nav = navRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set(nav, { y: 0 });
      return;
    }

    let navHidden = startHidden;
    let lastScrollY = lenis.scroll;
    let accumDelta = 0;

    // 2026-08-23：隱藏狀態原本用 y:'-100%'，只抵消掉 nav 自己的高度，沒有算
    // 進 CSS 的 top:var(--nav-top-gap)（10px）——nav 沒有被 top 位移出去，
    // 隱藏後底部永遠會留一條 10px 的殘影卡在畫面最上緣。改成跑時量
    // nav.offsetHeight + 目前生效的 --nav-top-gap（用 getComputedStyle 讀
    // nav 的 top 值，跟 CSS 變數保持同一個來源，不要自己猜一個數字），
    // 隱藏時位移「高度＋間距」，才會完全移出畫面（navRect.bottom<=0）。
    // 用函式而不是掛載時算一次存起來，是因為 nav 高度會隨斷點
    // （900px/更小）用 media query 改變，每次真的要隱藏/顯示時才重新量，
    // 才不會在跨斷點 resize 後卡著舊尺寸算出來的偏移量。
    function getHiddenY() {
      const gap = parseFloat(getComputedStyle(nav).top) || 0;
      return -(nav.offsetHeight + gap);
    }

    // 進場基準：一般頁面預設可見；startHidden 的頁面一進來就直接是隱藏狀態
    // （用 gsap.set 瞬間套用，不是動畫過去的）。
    gsap.set(nav, { y: navHidden ? getHiddenY() : 0 });

    function showNav() {
      // §6.2: video grown/growing (p>=0.3) through the hold overrides scroll-up
      // （原型 home.html:2228 同一行，同樣擺在最前面）
      if (navForceHiddenRef.current) return;
      if (!navHidden) return;
      navHidden = false;
      nav.style.willChange = 'transform';
      gsap.to(nav, { y: 0, duration: 0.3, ease: mainEase, onComplete: () => { nav.style.willChange = ''; } });
    }

    function hideNav() {
      if (navHidden) return;
      navHidden = true;
      nav.style.willChange = 'transform';
      gsap.to(nav, { y: getHiddenY(), duration: 0.3, ease: mainEase, onComplete: () => { nav.style.willChange = ''; } });
    }

    function onScroll({ scroll }) {
      const y = scroll;
      const diff = y - lastScrollY;
      lastScrollY = y;

      if (!startHidden && y <= TOP_DEAD_ZONE) {
        accumDelta = 0;
        showNav();
        return;
      }

      if (accumDelta === 0 || (diff > 0 && accumDelta > 0) || (diff < 0 && accumDelta < 0)) {
        accumDelta += diff;
      } else {
        accumDelta = diff;
      }

      if (accumDelta > DIRECTION_THRESHOLD) {
        hideNav();
        accumDelta = 0;
      } else if (accumDelta < -DIRECTION_THRESHOLD) {
        showNav();
        accumDelta = 0;
      }
    }

    // 換頁時 LenisProvider 會把捲動歸零。歸零本身會送出一個 scroll 事件，
    // 如果 lastScrollY 還停在前一頁的值（例如 5000），diff 會是 −5000，
    // 被上面的 accumDelta 判定成「使用者往上滑」而把導覽列叫出來——
    // WanderBuddy 那種「進頁時隱藏」的頁面就破功了。
    // LenisProvider 保證這個事件在 scrollTo 之前發，所以這裡先把基準歸零，
    // 之後那個 scroll=0 算出來的 diff 就是 0，不會誤判。
    // 一般頁面不受影響：scroll=0 會走上面 y <= TOP_DEAD_ZONE 那條，
    // 導覽列照常顯示。
    function onRouteChange() {
      lastScrollY = 0;
      accumDelta = 0;
    }
    window.addEventListener(ROUTE_CHANGE_EVENT, onRouteChange);

    // §6.2 跨過 p>=0.3 的當下要「立刻」把導覽列壓下去，不是只擋住之後的顯示。
    // 原型是同一個檔案裡直接呼叫 hideNav()，這裡把 hideNav 註冊給 Provider，
    // 由它在 setNavForceHidden(true) 時回呼——跟 registerNavIntro 同一個模式，
    // 動效與 ref 都留在 Nav 內部，§6.2 不需要跨元件抓 DOM。
    const unregisterForceHide = registerNavForceHide(hideNav);

    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
      window.removeEventListener(ROUTE_CHANGE_EVENT, onRouteChange);
      unregisterForceHide();
      // ⚠️ 一定要殺掉還在跑的補間，否則換頁會有競態：
      // 換頁 → 捲動歸零送出 scroll=0 → 這時 startHidden 還是「前一頁」的值，
      // 一般頁面會走 dead zone 那條啟動一個 showNav() 的 0.3s 補間 → 接著
      // 新頁面的 useNavBehavior({startHidden:true}) 讓 config 變動、這個
      // effect 重跑並 gsap.set 成隱藏 → 但舊補間沒被中止，還在往 y:0 跑，
      // 最後把隱藏狀態蓋回可見。WanderBuddy 那種「進頁時隱藏」就破功了
      // （實測過：導覽列 transform 的 Y 停在 0）。
      gsap.killTweensOf(nav);
    };
  }, [lenis, startHidden, navForceHiddenRef, registerNavForceHide]);

  return (
    <nav className="site-nav" ref={navRef}>
      <div className="nav-inner page-container">
        <Link href="/" className="nav-logo" aria-label="GOMO — back to home" ref={logoRef}>
          <GomoMark />
        </Link>

        <ul className="nav-links" ref={linksRef}>
          <li><Link href="/" className="link-underline">Home</Link></li>
          <li><Link href="/work" className="link-underline">Works</Link></li>
          <li><Link href="/about" className="link-underline">about me</Link></li>
        </ul>
      </div>
    </nav>
  );
}
