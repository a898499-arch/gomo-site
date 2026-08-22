'use client';

import { useLayoutEffect, useRef, useState } from 'react';

// node 545:117（Function 1 內的灰色槽，283×564＠1440 參考寬，見
// Function1.jsx）。2026-08-22 第三輪：這隻 demo（public/work/sui-sui/
// onboarding-demo/，從 all-ui-animation/ 逐位元組複製、沒有改過一個字）
// 原生是 .phone 426×898，.stage 是 flex-column（phone + 22 gap + 16
// 字幕 + 22 gap + 72.5 控制列）。實測（在一個沒有寬度限制、確定不會被
// 擠壓的 800px 寬 iframe 裡量 .stage 的 getBoundingClientRect()）它自然
// 需要的寬度其實是 439.04px，比 .phone 自己的 426px 還寬——因為
// .controls 那排按鈕比手機寬。你的指示是「量多寬就設多寬」，所以這裡
// iframe 原生寬度用量到的 439.04，不是先前沿用的 426（用 426 其實也
// 不會裁到手機本體，實測過，但既然你要求量測值，這裡照量到的來）。
//
// 這個槽（283×564）比先前「All UI Animation」原本的槽（1446×924）小
// 很多，手機長寬比（0.474）又比槽的長寬比（0.502）瘦，所以縮放策略
// 改成「依高度縮放、水平置中」：縮放後手機高度精確等於槽高度（撐滿
// Figma 給的 918px 總高度預算，不會逼使用者捲動），寬度自然比槽窄一點
// （槽多出來的左右留白落在背景 #f3f4f8 那條上，不是黑色暗背景，見
// Function1.jsx 的 .ss-fn1-band）。用 getBoundingClientRect 量測
// .ss-fn1-slot 實際渲染出來的高度（隨 1155px／1440px 兩種寬度以及未來
// 任何寬度即時反應，不是寫死的 px 常數）換算 scale（原本想用
// ResizeObserver，但它在分頁沒有焦點/背景執行時會被瀏覽器節流、完全
// 不觸發，見下方 useLayoutEffect 的註解）。
//
// 垂直裁切原本想用 CSS transform-origin:'top center'，讓縮放只往下收、
// 讓底下的字幕/控制列落在裁切框外自動被 overflow:hidden 蓋掉——但實測
// 發現：只要對這個 iframe 套用 CSS transform，瀏覽器算出來的實際渲染
// 位置跟 transform-origin 的理論值對不上，固定偏移「(縮放後 iframe 總
// 高 − 裁切框高) / 2」，不管 transform-origin 設 top/0 0/center 都一樣
// ——換算起來像是瀏覽器內部把它當成 center 在算，不受我設定的
// transform-origin 值影響。追蹤下去發現這個偏移不是「掛載時就有」，
// 而是「捲動之後才出現」——剛掛載、還沒捲動時量到的偏移量是 0，捲動
// 把這個區塊帶到視窗內之後再量才會出現那個固定偏移。這代表是瀏覽器
// 在（大捲動距離 + CSS transform 的 iframe）這個組合下的渲染/合成層
// 重新對齊問題，不是我 transform-origin 設錯，也不是分頁殘留狀態或
// 延伸套件雜訊（在全新分頁、乾淨重新整理後一樣重現）。沒有再深究瀏覽器
// 這個行為的成因，改成「掛載時、以及每次捲動/縮放後都重新量測 iframe
// 實際落點，用量到的差值直接動態校正 top」——不管背後成因是什麼，校正
// 後一定精確貼齊，比硬猜一個 CSS 數值或賭它不會被捲動觸發更可靠。水平
// 方向沒有這個問題（用 position:absolute + 明確 left 值實測是準的，
// 捲動前後都對），純粹用固定算式置中即可。
const PHONE_NATIVE_W = 426;
const PHONE_NATIVE_H = 898;
const STAGE_NATIVE_W = 439.04; // 量到的 .stage 不受寬度限制時的自然寬度（見上方註解）
const STAGE_NATIVE_H = 1031; // > demo 自己 @media(max-height:960px) 的門檻，避免誤觸發內部縮小
const PHONE_OFFSET_X = (STAGE_NATIVE_W - PHONE_NATIVE_W) / 2; // phone 在 .stage 裡置中的左留白

export default function OnboardingDemo() {
  const outerRef = useRef(null);
  const cropRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(0);

  // 用 useLayoutEffect + getBoundingClientRect（同步量測，不受分頁背景/
  // 焦點狀態影響）取代 ResizeObserver——實測發現 ResizeObserver 在這個
  // 自動化分頁裡完全不觸發（document.visibilityState==='hidden' 時被
  // 瀏覽器節流，跟本次對話先前發現的「自動化分頁渲染限制」是同一類已知
  // 限制），沒辦法驗證。getBoundingClientRect 不受這個限制（拿掉分頁
  // 背景狀態一樣讀得到正確值），改用它 + window resize 事件重新量測，
  // 才能在這個環境裡實際截圖驗證，也不依賴一個我測不到的 API。
  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;
    function measure() {
      const h = outer.getBoundingClientRect().height;
      if (h > 0) setScale(h / PHONE_NATIVE_H);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 這個校正也要用 useLayoutEffect，不能用 useEffect——實測發現一般
  // useEffect（React 的 passive effect，排程走瀏覽器 scheduler）在這個
  // 分頁背景/沒有焦點的環境裡一樣會被延後、遲遲不執行（跟上面
  // ResizeObserver 被節流是同一類限制），useLayoutEffect 是 commit 階段
  // 同步跑的，不受這個影響。掛載時跑一次是不夠的（見上方檔頭註解——
  // 偏移是捲動之後才出現），所以額外掛 scroll 監聽，捲動時持續重新
  // 校正；Lenis 在這個專案是原生捲動模式（真的呼叫 window.scrollTo，
  // 不是 transform 虛擬捲動，見 LenisProvider.jsx），一般 scroll 事件
  // 就聽得到。
  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    const crop = cropRef.current;
    if (!iframe || !crop || scale === 0) return undefined;

    function align() {
      iframe.style.top = '0px';
      const cropRect = crop.getBoundingClientRect();
      const ifRect = iframe.getBoundingClientRect();
      iframe.style.top = `${-(ifRect.top - cropRect.top)}px`;
    }

    align();
    window.addEventListener('scroll', align, { passive: true });
    return () => window.removeEventListener('scroll', align);
  }, [scale]);

  const scaledPhoneW = PHONE_NATIVE_W * scale;
  const offsetXScaled = PHONE_OFFSET_X * scale;

  return (
    <div ref={outerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {scale > 0 && (
        <div
          ref={cropRef}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: `${scaledPhoneW}px`,
            height: '100%',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={iframeRef}
            src="/work/sui-sui/onboarding-demo/suisui-onboarding-demo.html"
            title="Sui-Sui onboarding flow demo"
            width={STAGE_NATIVE_W}
            height={STAGE_NATIVE_H}
            style={{
              position: 'absolute',
              left: `${-offsetXScaled}px`,
              display: 'block',
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          />
        </div>
      )}
    </div>
  );
}
