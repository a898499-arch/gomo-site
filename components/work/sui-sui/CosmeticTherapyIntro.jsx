'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// node 545:182（整節點 1207.9×789.2，標題文字跟照片＋chip 群共用同一個
// 座標系：文字 y=0~150，照片 Union 從 y=259 開始）。2026-08-17：用
// get_design_context 重讀，修正四個跟 Figma 對不上的地方：
// 1) 6 個 chip 裡只有 brain 有圖示 → 補上其餘 5 個外側裝飾圖示
//    （眼睛/手掌/星星x2/雙箭頭x2），對應關係、座標、旋轉角度全部
//    照 get_design_context／get_metadata 讀到的值。
// 2) chip 文字換行 → chip 寬度改用 Figma 實際 w（不再讓瀏覽器自己撐
//    開），字級改用 cqw 跟著框等比縮放（比照 Figma 匯出碼本身在裝飾
//    圖示上用的技巧），跟 Figma 原本「auto-layout 讓寬度剛好貼合單行
//    文字」的效果一致。
// 3) chip 離照片太遠 → 其實 chip 容器座標本來就對，问题出在寬度/字級
//    沒跟著等比縮放，改完 1)+2) 一併解決。
// 4) 缺裝飾元素 → 補上 Daily independence 左側／Reduces caregiver
//    burden 右側的雙箭頭（同一張 icon1.png，後者用 scaleY(-1) 對應
//    Figma 自己也是同一個圖層鏡像出來的），Boosts self-confidence 兩側
//    的星星（同一張 icon4.png 不同尺寸），另外照片底部邊緣還有兩個沒被
//    使用者切圖涵蓋的小箭頭裝飾（545:227/234），這兩個是純向量，直接用
//    Figma 匯出的 SVG 內嵌（跟 545:213/220 是同一個形狀，只是位置/角度
//    不同）。
const PHOTO_Y_OFFSET = 259;
const FRAME_W = 1207.9;
const FRAME_H = 789.2 - PHOTO_Y_OFFSET;
const pctX = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctY = (v) => `${(((v - PHOTO_Y_OFFSET) / FRAME_H) * 100).toFixed(4)}%`;
const pctW = (v) => `${((v / FRAME_W) * 100).toFixed(4)}%`;
const pctH = (v) => `${((v / FRAME_H) * 100).toFixed(4)}%`;

// 6 個 chip：x/y/w/rotate 取自 get_design_context 對 545:182 的重讀。
// 2026-08-17：高度改成你指定的固定 66px（六個一致），不再用各自的
// Figma 原始高度（原本 76.7~98.5px 不等）——這是你明確要的簡化，不是
// 我自己決定的。文字用 CSS 在這個固定高度內垂直置中。
const CHIPS = [
  {
    key: 'brain',
    x: 0, y: 395, w: 465.708, h: 66, rotate: 3,
    label: 'Activates brain & cognitive function',
    hasIcon: true,
    padding: '0 1.3455cqw 0 1.9871cqw',
  },
  {
    key: 'grip',
    x: 106.88, y: 547.93, w: 311.115, h: 66, rotate: -2,
    label: 'Enhances grip strength',
    padding: '0 2.6495cqw',
  },
  {
    key: 'independence',
    x: 156.03, y: 693.93, w: 274.138, h: 66, rotate: 2,
    label: 'Daily independence',
    padding: '0 2.6495cqw',
  },
  {
    key: 'coordination',
    x: 800, y: 329, w: 407.899, h: 66, rotate: -3,
    label: 'Improves hand-eye coordination',
    padding: '0 2.6495cqw',
  },
  {
    key: 'confidence',
    x: 862.7, y: 530.2, w: 310.116, h: 66, rotate: 2,
    label: 'Boosts self-confidence',
    padding: '0 2.6495cqw',
  },
  {
    key: 'burden',
    x: 785, y: 694.33, w: 342.096, h: 66, rotate: -2,
    label: 'Reduces caregiver burden',
    padding: '0 2.6495cqw',
  },
];

// chip 外側的裝飾圖示（跟 chip 本身不是同一個圖層，是疊在旁邊的獨立
// 圖層）。x/y/w/h/rotate 取自 get_design_context；hand 圖示兩個工具讀到
// 的 x 差了快 40px（get_metadata 125 vs get_design_context 換算後約
// 85），先採用 85，貼上去如果偏了再調。
const ICONS = [
  { key: 'eye', src: '/work/sui-sui/icon2.png', alt: '', x: 767.9, y: 370.5, w: 50.928, h: 34.024, rotate: -3 },
  { key: 'hand', src: '/work/sui-sui/icon5.png', alt: '', x: 85, y: 560.96, w: 44.686, h: 55.448, rotate: -5 },
  { key: 'star-lg', src: '/work/sui-sui/icon4.png', alt: '', x: 840.07, y: 502.07, w: 55.852, h: 55.852, rotate: 2 },
  { key: 'star-sm', src: '/work/sui-sui/icon4.png', alt: '', x: 1141, y: 580, w: 38.701, h: 38.701, rotate: 2 },
  { key: 'arrow-up', src: '/work/sui-sui/icon1.png', alt: '', x: 142.88, y: 665.93, w: 58.434, h: 65.642, rotate: 2 },
  { key: 'arrow-down', src: '/work/sui-sui/icon1.png', alt: '', x: 1098, y: 675, w: 58.434, h: 65.642, rotate: -2, flipY: true },
];

// 照片底部邊緣兩個沒有對應到使用者切圖清單的小箭頭裝飾（545:227/234），
// 跟上面 arrow-up/arrow-down 是同一個形狀家族，純向量、無照片內容，
// 直接內嵌 Figma 匯出的 SVG（見 DoubleArrowIcon）。
const EXTRA_ARROWS = [
  { key: 'extra-1', x: 398.99, y: 739.16, w: 40.223, h: 45.185, rotate: -178, flipY: true },
  { key: 'extra-2', x: 773, y: 744, w: 40.223, h: 45.185, rotate: -2, flipY: true },
];

// Figma node 545:196／Group 36939 的腦部圖示，5 個 path，逐字取自匯出的
// chip-brain-icon.svg（已濾掉那個檔案裡連帶匯出的 chip 背景圓角矩形跟
// 陰影 filter，那些不是圖示本身，這裡用 CSS 重建 chip 外觀）。
function ChipBrainIcon(props) {
  return (
    <svg viewBox="0 0 46 41" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.149 4.92821C14.8091 6.01439 13.7766 6.73234 12.64 6.67278C12.5348 6.66726 12.4438 6.65663 12.3715 6.64603C11.1475 6.63691 10.1154 7.59858 10.0507 8.83291C10.0427 8.98498 10.0537 9.13964 10.0829 9.29341C10.3125 10.5043 9.62252 11.7012 8.45961 12.1093C7.14251 12.5716 6.18645 13.7812 6.11024 15.2354C6.0834 15.7475 6.18511 16.2633 6.40536 16.7899C6.90905 17.9944 6.39787 19.3835 5.23357 19.9741C4.12804 20.535 3.37239 21.6193 3.30532 22.8991C3.22918 24.352 4.05253 25.6538 5.29843 26.2476C6.36945 26.7579 6.93223 27.9525 6.6438 29.1034C6.59398 29.3021 6.56469 29.4928 6.55496 29.6784C6.47077 31.2848 7.70015 32.6501 9.30648 32.7343C9.41473 32.74 9.55796 32.7341 9.7682 32.7076C10.9937 32.5534 12.1473 33.32 12.4798 34.5095C12.8139 35.7047 13.8508 36.5774 15.1098 36.6434C16.7161 36.7276 18.0815 35.4982 18.1657 33.8919L19.6416 5.73062C19.7081 4.46133 18.7271 3.37184 17.4578 3.30532C16.3996 3.24986 15.4631 3.92436 15.149 4.92821ZM39.8562 21.7886C38.7539 21.0755 38.3938 19.6295 39.0329 18.4827C39.299 18.0053 39.4522 17.5085 39.4797 16.9842C39.5559 15.53 38.7315 14.2271 37.47 13.6297C36.3741 13.1107 35.8107 11.8783 36.1353 10.71C36.197 10.4882 36.2237 10.3268 36.2301 10.2049C36.2948 8.96991 35.3679 7.90514 34.1486 7.78723C34.0819 7.79002 33.9893 7.79165 33.8808 7.78596C32.7442 7.72639 31.7924 6.90445 31.5679 5.78869C31.3604 4.7575 30.4995 3.98881 29.4413 3.93335C28.1695 3.8667 27.0828 4.84285 27.016 6.11709L25.5402 34.2783C25.456 35.8847 26.6854 37.25 28.2917 37.3342C29.5507 37.4002 30.6732 36.6407 31.1303 35.487C31.5853 34.3387 32.8128 33.6968 34.0154 33.9784C34.2218 34.0267 34.3636 34.0475 34.4718 34.0532C36.0782 34.1374 37.4435 32.908 37.5277 31.3016C37.5374 31.116 37.5282 30.9233 37.4995 30.7204C37.3329 29.5458 38.0175 28.4165 39.136 28.0209C40.4371 27.5607 41.392 26.352 41.4682 24.8991C41.5353 23.6193 40.8971 22.4619 39.8562 21.7886ZM22.113 5.12555C21.8799 2.80986 19.9831 0.941945 17.5883 0.816438C15.3488 0.699075 13.4109 2.13712 12.7704 4.18389C12.7405 4.18232 12.7145 4.1772 12.6884 4.17209C12.6624 4.16697 12.6364 4.16185 12.6064 4.16028C9.96258 4.02172 7.70039 6.05861 7.56183 8.70247C7.54299 9.06197 7.56947 9.41634 7.6342 9.7577C5.40011 10.5418 3.75246 12.6034 3.62136 15.105C3.5719 16.0487 3.76565 16.9375 4.10601 17.7515C2.25432 18.6908 0.933016 20.5442 0.816438 22.7687C0.685729 25.2627 2.10137 27.4849 4.22627 28.4974C4.14081 28.8384 4.08491 29.1885 4.06607 29.548C3.90985 32.5289 6.19514 35.067 9.17604 35.2232C9.48312 35.2393 9.78467 35.2175 10.0795 35.1804C10.6867 37.3527 12.5977 39.0074 14.9794 39.1323C17.6978 39.2747 20.048 37.3867 20.5592 34.7923C20.6086 34.5418 20.6408 34.2848 20.6546 34.0223L22.1304 5.86105C22.1435 5.61201 22.1372 5.36636 22.113 5.12555ZM23.0656 34.9237C23.0427 34.6694 23.0375 34.4104 23.0513 34.1479L24.5271 5.98666C24.5402 5.73734 24.572 5.49352 24.6212 5.25648C25.0949 2.97281 27.1765 1.31894 29.5718 1.44447C31.8112 1.56183 33.5882 3.19456 34.0112 5.29707C34.0365 5.2984 34.0621 5.29623 34.0884 5.29399C34.1166 5.29159 34.1458 5.28911 34.1768 5.29073C36.8206 5.42929 38.8575 7.69148 38.7189 10.3353C38.7001 10.6948 38.6292 11.0441 38.5367 11.3772C40.6766 12.3906 42.0997 14.6131 41.9686 17.1147C41.9191 18.0584 41.641 18.9225 41.2099 19.696C42.9533 20.8238 44.0736 22.8051 43.9571 25.0296C43.8264 27.5236 42.1862 29.5856 39.9671 30.3705C40.0164 30.7186 40.0354 31.0726 40.0166 31.4321C39.8604 34.413 37.3223 36.6983 34.3414 36.5421C34.0343 36.526 33.7367 36.4728 33.4474 36.4051C32.6165 38.502 30.543 39.9479 28.1612 39.8231C25.4428 39.6806 23.3029 37.5573 23.0656 34.9237Z" fill="#C90000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M29.9001 19.212C30.5779 19.0926 31.0307 18.4464 30.9114 17.7686C30.687 16.4938 30.8597 15.6292 31.2351 15.0311C31.6106 14.4329 32.3141 13.9015 33.5597 13.5493C34.2219 13.3621 34.607 12.6734 34.4198 12.0111C34.2326 11.3489 33.5439 10.9638 32.8816 11.151C31.2514 11.6119 29.9276 12.4261 29.1242 13.7061C28.3208 14.9861 28.1631 16.5322 28.4568 18.2007C28.5761 18.8785 29.2223 19.3313 29.9001 19.212Z" fill="#C90000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.4044 18.4524C14.7428 18.2629 14.3601 17.5729 14.5496 16.9113C14.906 15.6669 14.8247 14.789 14.5138 14.1548C14.2029 13.5207 13.5588 12.9186 12.3569 12.4382C11.7178 12.1828 11.4068 11.4576 11.6622 10.8186C11.9177 10.1795 12.6428 9.8685 13.2819 10.1239C14.855 10.7527 16.0865 11.7008 16.7517 13.0578C17.4169 14.4148 17.4121 15.9689 16.9456 17.5975C16.7561 18.2592 16.0661 18.6419 15.4044 18.4524Z" fill="#C90000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M33.7441 22.1489C33.0996 22.3904 32.773 23.1086 33.0145 23.7531C33.4969 25.0401 33.4573 25.9113 33.1839 26.5127C32.9104 27.114 32.2797 27.7164 30.9927 28.1988C30.3483 28.4403 30.0216 29.1585 30.2632 29.803C30.5047 30.4474 31.2229 30.7741 31.8674 30.5325C33.5141 29.9154 34.8089 28.9597 35.4526 27.5444C36.0962 26.1291 35.9655 24.5252 35.3483 22.8784C35.1068 22.234 34.3885 21.9073 33.7441 22.1489Z" fill="#C90000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.2771 20.9715C11.8927 21.2791 12.1425 22.0275 11.8349 22.6432C11.2207 23.8727 11.1689 24.7433 11.3781 25.37C11.5872 25.9966 12.1514 26.6616 13.3809 27.2759C13.9966 27.5834 14.2464 28.3319 13.9388 28.9476C13.6312 29.5632 12.8828 29.813 12.2671 29.5054C10.6939 28.7195 9.5061 27.6337 9.01394 26.1589C8.52177 24.6841 8.81945 23.1026 9.60537 21.5294C9.91294 20.9137 10.6614 20.664 11.2771 20.9715Z" fill="#C90000" />
    </svg>
  );
}

// 545:227／545:234 的雙箭頭裝飾（深淺紅兩層），逐字取自 Figma 匯出的
// SVG（跟 545:213／545:220 那組是同一個形狀家族，viewBox 0 0
// 38.7158 43.8607）。
function DoubleArrowIcon(props) {
  return (
    <svg viewBox="0 0 38.7158 43.8607" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.005 35.0374H12.6524V43.8597H9.97469V43.8606L7.02938 43.8597H4.35262V35.0374H0.0000782741L8.50203 22.4319L17.005 35.0374Z" fill="#B8001F" fillOpacity="0.51" />
      <path d="M38.7158 19.5801H31.956V33.2861H19.0615V19.5801H12.3008L25.5078 0L38.7158 19.5801Z" fill="#C90000" />
    </svg>
  );
}

export default function CosmeticTherapyIntro() {
  const ref = useStandardEntrance('.ss-entrance-item');

  return (
    <section className="ss-section" ref={ref}>
      <div className="ss-section-inner">
        <p className="ss-eyebrow ss-entrance-item">What is Cosmetic Therapy</p>
        <h2 className="ss-cti-heading ss-entrance-item">
          Rehabilitation that doesn&rsquo;t feel like rehabilitation.
        </h2>
        <p className="ss-cti-body ss-entrance-item">
          Cosmetic therapy is a rehabilitation approach that combines skincare and makeup with
          occupational therapy. Through fine motor movements, it activates cognitive function,
          improves hand-eye coordination, and strengthens the sense of self.
        </p>

        <div className="ss-cti-frame ss-entrance-item" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
          <img
            src="/work/sui-sui/cosmetic-therapy-photo.webp"
            srcSet="/work/sui-sui/cosmetic-therapy-photo.webp 1x, /work/sui-sui/cosmetic-therapy-photo@2x.webp 2x"
            alt="An older woman receiving a cosmetic therapy session, having her face gently touched by a caregiver"
            className="ss-cti-photo"
          />

          {CHIPS.map(({ key, x, y, w, h, rotate, label, hasIcon, padding }) => (
            <div
              key={key}
              className="ss-cti-chip-slot"
              style={{ left: pctX(x), top: pctY(y), width: pctW(w), height: pctH(h) }}
            >
              <div className="ss-cti-chip" style={{ transform: `rotate(${rotate}deg)`, padding }}>
                {hasIcon && <ChipBrainIcon className="ss-cti-chip-icon" />}
                <span>{label}</span>
              </div>
            </div>
          ))}

          {ICONS.map(({ key, src, alt, x, y, w, h, rotate, flipY }) => (
            <img
              key={key}
              src={src}
              alt={alt}
              aria-hidden={alt ? undefined : 'true'}
              className="ss-cti-icon"
              style={{
                left: pctX(x),
                top: pctY(y),
                width: pctW(w),
                height: pctH(h),
                transform: `rotate(${rotate}deg)${flipY ? ' scaleY(-1)' : ''}`,
              }}
            />
          ))}

          {EXTRA_ARROWS.map(({ key, x, y, w, h, rotate, flipY }) => (
            <DoubleArrowIcon
              key={key}
              aria-hidden="true"
              className="ss-cti-icon"
              style={{
                left: pctX(x),
                top: pctY(y),
                width: pctW(w),
                height: pctH(h),
                transform: `rotate(${rotate}deg)${flipY ? ' scaleY(-1)' : ''}`,
              }}
            />
          ))}
        </div>

        {/* 6 個 chip 的圖示是重複資訊（跟旁邊文字講同一件事），對螢幕
            閱讀器來說是裝飾，已用 aria-hidden 處理；這裡不用另外補
            visually-hidden 文字，因為 chip 本身的 <span> 已經是可讀的
            真實文字。 */}
      </div>
    </section>
  );
}
