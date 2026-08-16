'use client';

import { useNavBehaviorConfig } from './NavBehaviorProvider';

// <main> 本身要讀 NavBehaviorProvider 的 config 才能決定要不要保留幫固定
// 導覽列預留的 padding-top，所以拆成獨立的 client component（app/layout.js
// 是 server component，不能直接用 context）。見 NavBehaviorProvider.jsx
// 的 fullBleedTop 註解。
export default function PageContent({ children }) {
  const { config } = useNavBehaviorConfig();

  return (
    <main className={config.fullBleedTop ? 'page-content page-content--bleed' : 'page-content'}>
      {children}
    </main>
  );
}
