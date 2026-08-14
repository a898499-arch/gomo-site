'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// 靜態資訊圖，簡化版：Figma 原稿用向量線條逐一連接每個框，這裡簡化成
// 「一欄一欄＋箭頭」的示意排法，資訊（哪些框、哪些系統對話框）跟 Figma
// 一致，但連接線的實際路徑沒有逐點還原。
export default function SignUpFlowStatic() {
  // 整個區塊一次出現，不分 stagger：不傳 itemsSelector，整個容器當一個單位。
  const ref = useStandardEntrance();

  return (
    <section className="wb-section">
      <div className="wb-section-inner" ref={ref}>
        <h2 className="wb-signup-title">Sign Up Flow</h2>
        <div className="wb-signup-diagram">
          <div className="wb-signup-col">
            <div className="wb-signup-box">Onboarding</div>
          </div>

          <span className="wb-signup-arrow" aria-hidden="true">→</span>

          <div className="wb-signup-col">
            <div className="wb-signup-box">Sign in with Apple</div>
            <div className="wb-signup-box">Sign in with Google</div>
            <div className="wb-signup-box">Email Register</div>
          </div>

          <span className="wb-signup-arrow" aria-hidden="true">→</span>

          <div className="wb-signup-col">
            <div className="wb-signup-box" data-variant="system">System: Face ID Auth</div>
            <div className="wb-signup-box" data-variant="system">System: Google account Picker</div>
            <div className="wb-signup-box">Verification Code</div>
          </div>

          <span className="wb-signup-arrow" aria-hidden="true">→</span>

          <div className="wb-signup-col">
            <div className="wb-signup-box">Interest Page</div>
            <span className="wb-signup-arrow" aria-hidden="true">↓</span>
            <div className="wb-signup-box">Home Page</div>
          </div>
        </div>
      </div>
    </section>
  );
}
