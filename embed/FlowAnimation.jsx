import { useEffect, useRef } from "react";
import "./flow.css";

/**
 * Wander Buddy — Sign-up flow 展示動畫
 *
 * 圖片放在 public/flow/ 底下（cards/ 與 logo.svg、logo-icon.svg）。
 * flow.js 用 <script> 載入，掛在 window.WBAnim 上——它是原生 JS，
 * 不要改寫成 React，時序邏輯全在裡面。
 *
 * 特性：
 * - 捲出畫面時自動暫停，捲回來再繼續（省效能，筆電風扇不會狂轉）
 * - 尊重系統的「減少動態效果」設定
 */
export default function FlowAnimation({ height = "100svh", assetBase = "/flow" }) {
  const hostRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !window.WBAnim) {
      if (!window.WBAnim) {
        console.warn("[FlowAnimation] 找不到 window.WBAnim，請確認 flow.js 已載入");
      }
      return;
    }

    const anim = window.WBAnim.createFlowAnimation(host, assetBase);
    animRef.current = anim;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;             // 靜態呈現，不播動畫

    // 只有進入視窗時才播放
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) anim.play();
        else anim.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      anim.pause();
      host.innerHTML = "";
    };
  }, [assetBase]);

  return <div ref={hostRef} style={{ "--film-height": height }} />;
}
