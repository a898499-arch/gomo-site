'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// 讓某些頁面（目前是滿版 Hero 的作品詳情頁）覆寫全站導覽列的預設行為：
// 進頁時導覽列先隱藏、往下滾再往上滾才叫出來，且「距離頂端 100px 永遠
// 顯示」這條防呆規則對這種頁面停用（否則使用者一停在頂端就會被強制拉出來，
// 跟「先隱藏」互相打架）。其餘頁面完全不受影響，維持 §4 的預設行為。
//
// ⚠️ 這裡「只放真的需要 JS 才能表達的行為」。曾經有過第三個 flag
// fullBleedTop（滿版 Hero 頁面拿掉 .page-content 的 padding-top、導覽列背景
// 改透明），已經移除——那兩件事都只是靜態樣式，用 context 表達的代價是
// SSR 的 HTML 沒有它、hydration 之後才翻 class，三個滿版頁因此各吃到約
// 0.087 的 CLS。現在改由 globals.css 的
// `.page-content:has(> [data-nav-bleed])` 處理，第一次排版就決定。
// 不要把它加回來——加回來就會有兩個真實來源，而且位移會跟著回來。
//
// 底下這兩個留著，是因為它們真的是行為、CSS 表達不了，而且都只改
// transform / opacity，不造成 layout shift：
// startHidden：捲動方向的 JS 判斷邏輯（見上面）。
// deferIntro：首頁 Loading→Hero 專用（規格書 §6.1 PHASE 3.3）。導覽列的
// logo 與連結先隱藏，等頁面在推軌開始 +400ms 呼叫 playNavIntro() 才淡入。
// 跟 startHidden 正交——startHidden 管的是「整條 bar 的位移」，deferIntro
// 管的是「bar 內部元素的透明度」，兩者互不干涉。預設 false，其他頁面走
// 的程式路徑與加這個 flag 之前完全相同。
const DEFAULT_CONFIG = { startHidden: false, deferIntro: false };

const NavBehaviorContext = createContext({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
  resetConfig: () => {},
  registerNavIntro: () => {},
  playNavIntro: () => {},
  navForceHiddenRef: { current: false },
  setNavForceHidden: () => {},
  registerNavForceHide: () => () => {},
});

export function NavBehaviorProvider({ children }) {
  const [config, setConfigState] = useState(DEFAULT_CONFIG);

  // 註冊制：Nav 自己註冊「怎麼演」，頁面只負責說「何時演」。
  // 這樣頁面不需要 querySelector 去抓 Nav 內部的 DOM，動效與元素的 ref
  // 都留在 Nav.jsx 裡面。
  const navIntroRef = useRef(null);
  const registerNavIntro = useCallback((fn) => {
    navIntroRef.current = fn;
    return () => {
      if (navIntroRef.current === fn) navIntroRef.current = null;
    };
  }, []);
  const playNavIntro = useCallback(() => {
    navIntroRef.current?.();
  }, []);

  // ---------- §6.2：影片放大後強制壓住導覽列 ----------
  // 原型 prototypes/home.html 的 navForceHidden（1681 宣告 / 1879-1880 寫入 /
  // 2228 讀取）。原型是單一檔案裡的模組層變數，Next 這邊 Nav 與 §6.2 是兩個
  // 元件，所以提到這裡共用。
  //
  // ⚠️ 用 ref 不用 state：ptwLoop 每一幀都會呼叫 setNavForceHidden，改成 state
  // 的話每次翻轉都會讓 Nav 的捲動 effect 重跑（重新掛 lenis 監聽、重設方向基準），
  // 而那個 effect 的 cleanup 會 killTweensOf(nav)——等於在最需要動畫的那一刻把
  // 它殺掉。ref 讓 showNav() 每次都讀到最新值，而 effect 一次都不用重跑。
  //
  // ⚠️ 與 startHidden 的優先順序（明確寫下來，兩個 flag 不要互相猜）：
  //   navForceHidden 只擋「顯示」，優先級最高——true 的時候 showNav() 直接 return，
  //     不管 startHidden 是什麼、不管使用者往上滾多少。它不影響 hideNav()。
  //   startHidden 管的是「進頁的初始狀態」與「停用頂端 100px 永遠顯示」，
  //     只在 effect 掛載時讀一次。
  // 兩者方向一致（都只會讓導覽列更容易隱藏），不會打架；目前也沒有任何一頁
  // 同時用到——navForceHidden 只有首頁 §6.2 會設，startHidden 只有作品詳情頁。
  const navForceHiddenRef = useRef(false);
  const forceHideHandlerRef = useRef(null);
  const registerNavForceHide = useCallback((fn) => {
    forceHideHandlerRef.current = fn;
    return () => {
      if (forceHideHandlerRef.current === fn) forceHideHandlerRef.current = null;
    };
  }, []);
  const setNavForceHidden = useCallback((v) => {
    if (v === navForceHiddenRef.current) return;
    navForceHiddenRef.current = v;
    // 跨過門檻的當下就把它壓下去，不是只擋住之後的顯示（原型 setNavForceHidden 同樣行為）
    if (v) forceHideHandlerRef.current?.();
  }, []);

  const setConfig = useCallback((partial) => {
    setConfigState({ ...DEFAULT_CONFIG, ...partial });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
  }, []);

  return (
    <NavBehaviorContext.Provider
      value={{
        config,
        setConfig,
        resetConfig,
        registerNavIntro,
        playNavIntro,
        navForceHiddenRef,
        setNavForceHidden,
        registerNavForceHide,
      }}
    >
      {children}
    </NavBehaviorContext.Provider>
  );
}

export function useNavBehaviorConfig() {
  return useContext(NavBehaviorContext);
}

// 頁面元件呼叫這個 hook 宣告自己要的導覽列行為；離開頁面（unmount）時
// 自動還原成全站預設，不會影響到其他頁面。
export function useNavBehavior(partialConfig) {
  const { setConfig, resetConfig } = useNavBehaviorConfig();

  useEffect(() => {
    setConfig(partialConfig);
    return () => resetConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
