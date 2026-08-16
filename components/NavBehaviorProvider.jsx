'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// 讓某些頁面（目前是滿版 Hero 的作品詳情頁）覆寫全站導覽列的預設行為：
// 進頁時導覽列先隱藏、往下滾再往上滾才叫出來，且「距離頂端 100px 永遠
// 顯示」這條防呆規則對這種頁面停用（否則使用者一停在頂端就會被強制拉出來，
// 跟「先隱藏」互相打架）。其餘頁面完全不受影響，維持 §4 的預設行為。
//
// fullBleedTop：<main class="page-content"> 預設有 padding-top 幫固定定位的
// 導覽列預留空間；滿版 Hero 頁面不需要這塊空間（Hero 本來就該從 y=0 開始，
// 導覽列滑出時是浮在 Hero 上面，不是把內容往下推），這個 flag 讓 layout.js
// 的 <PageContent> 拿掉那個 padding-top，同時讓 Nav.jsx 把導覽列背景改成透明
// （不透明的米色底疊在 Hero 上面會很突兀）。這兩件事是同一個「這頁的 Hero
// 會被導覽列蓋住」情境的兩面，共用一個 flag，不拆成兩個。預設 false，
// 其他頁面不受影響。
const DEFAULT_CONFIG = { startHidden: false, fullBleedTop: false };

const NavBehaviorContext = createContext({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
  resetConfig: () => {},
});

export function NavBehaviorProvider({ children }) {
  const [config, setConfigState] = useState(DEFAULT_CONFIG);

  const setConfig = useCallback((partial) => {
    setConfigState({ ...DEFAULT_CONFIG, ...partial });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
  }, []);

  return (
    <NavBehaviorContext.Provider value={{ config, setConfig, resetConfig }}>
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
