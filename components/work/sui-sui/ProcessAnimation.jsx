'use client';

// node 545:532（1450×900，「Process Animation」）。跟 OnboardingDemo.jsx
// 完全比照同一個做法：iframe 直接載入原始 HTML（public/work/sui-sui/
// ui-carousel/carousel.html），內部 CSS/JS/參數一律不改。
//
// 跟 OnboardingDemo 不同：這支輪播沒有固定的原生像素尺寸——carousel.html
// 自己用 innerWidth/innerHeight 算版面（見它的 layout()），還掛了
// window resize 監聽器隨時重排。iframe 是獨立的巢狀瀏覽環境，只要它的
// CSS 尺寸（不是 HTML width/height 屬性）改變，裡面的 window 就會自己
// 收到 resize、自己重新 layout()——不需要像 OnboardingDemo 那樣量測、
// 用 transform:scale() 縮放再裁切。也因為完全沒有對這個 iframe 套用
// CSS transform，不會踩到 OnboardingDemo 檔頭記錄的那個「捲動後
// transform-origin 跑掉」的瀏覽器問題（那個問題只在對 iframe 套用
// transform 時才會出現）。
//
// 外層 .ss-pa-frame 用 aspect-ratio:1450/900 鎖住 Figma 比例，隨容器寬度
// 等比縮放；iframe 用 position:absolute + inset:0 填滿整個框。
export default function ProcessAnimation() {
  return (
    <section className="ss-section">
      <div className="page-container">
        <div className="ss-pa-frame" style={{ aspectRatio: '1450 / 900' }}>
          <iframe
            src="/work/sui-sui/ui-carousel/carousel.html"
            title="Sui-Sui UI carousel"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
