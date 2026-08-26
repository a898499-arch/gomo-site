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

  const setConfig = useCallback((partial) => {
    setConfigState({ ...DEFAULT_CONFIG, ...partial });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
  }, []);

  return (
    <NavBehaviorContext.Provider
      value={{ config, setConfig, resetConfig, registerNavIntro, playNavIntro }}
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
