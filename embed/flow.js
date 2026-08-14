/* Wander Buddy — Sign-up flow 動畫程式（嵌入版）
   由 screens.js + anim.js 合併，掛在 window.WBAnim 與各 build* 函式上 */

/* ==========================================================
   五個畫面的資料與建構函式
   所有座標取自 Figma bxpJW3trFDtVFsgsDShUkC，基準 402×874
   ========================================================== */

/* ---------- 資料 ------------------------------------------ */

// 活動卡片：x/y 為旋轉後的 bounding box 左上角
const CARDS = [
  { file:'coffee.png',   label:'Coffee Hopping',    x:-96, y:127, w:177, h:230 },
  { file:'markets.png',  label:'Markets',           x: 88, y:189, w:177, h:230 },
  { file:'city.png',     label:'City Walks',        x:271, y:130, w:177, h:230 },
  { file:'art.png',      label:'Art Shows',         x:186, y:303, w:177, h:230 },
  { file:'learning.png', label:'Learning & Social', x:-42, y:289, w:197, h:244 },
  { file:'music.png',    label:'Live Music',        x:365, y:278, w:197, h:244 },
  { file:'film.png',     label:'Film Nights',       x:512, y:133, w:180, h:232 },
  { file:'food.png',     label:'Food Tours',        x:562, y:311, w:177, h:230 },
];
// 一份卡片群的寬度，第 2 幕的無限飄移會用到
const STRIP_W = 835;

// 註冊頁的裝飾色塊
const BLOBS = [
  { x: 30, y: 58, svg:`<svg width="82" height="81" viewBox="0 0 82 81" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M57.7231 1.29118C61.8136 -1.99875 67.853 1.44575 67.0138 6.58996L62.8155 32.3242C62.5551 33.9209 62.9975 35.5515 64.0312 36.8057L80.6928 57.0192C84.0234 61.0597 80.5368 67.0254 75.3291 66.1965L49.2772 62.0494C47.6606 61.7921 46.0095 62.2291 44.7398 63.2504L24.2774 79.7087C20.187 82.9987 14.1476 79.5546 14.9867 74.4105L19.1845 48.6762C19.445 47.0793 19.0026 45.4484 17.9687 44.1941L1.30717 23.9813C-2.02347 19.9407 1.46361 13.9744 6.67136 14.8033L32.7233 18.9505C34.3398 19.2077 35.9905 18.7707 37.2602 17.7495L57.7231 1.29118ZM34.2636 35.2632C30.6182 35.2632 27.6629 37.5903 27.6629 40.4606C27.6631 43.3309 30.6183 45.6575 34.2636 45.6575C37.909 45.6575 40.8642 43.3309 40.8643 40.4606C40.8643 37.5903 37.9091 35.2632 34.2636 35.2632ZM47.465 35.2632C43.8196 35.2632 40.8643 37.5903 40.8643 40.4606C40.8645 43.3309 43.8197 45.6575 47.465 45.6575C51.1104 45.6575 54.0656 43.3309 54.0657 40.4606C54.0657 37.5903 51.1105 35.2632 47.465 35.2632Z" fill="#87FA89"/></svg>` },
  { x:152, y:217, svg:`<svg width="110" height="109" viewBox="0 0 110 109" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40.4966 8.74742C46.5835 -2.9158 63.4165 -2.91581 69.5034 8.74742L71.4942 12.5626C71.8265 13.1993 72.5739 13.5055 73.2632 13.2882L77.3932 11.9856C90.0201 8.00341 101.923 19.7982 97.9045 32.3104L96.59 36.4029C96.3706 37.0859 96.6796 37.8265 97.3221 38.1558L101.172 40.1285C112.943 46.1601 112.943 62.84 101.172 68.8715L97.3221 70.8443C96.6796 71.1736 96.3706 71.9141 96.59 72.5971L97.9045 76.6897C101.923 89.2018 90.0201 100.997 77.3932 97.0144L73.2632 95.7119C72.5739 95.4945 71.8265 95.8007 71.4942 96.4374L69.5034 100.253C63.4165 111.916 46.5835 111.916 40.4966 100.253L38.5058 96.4374C38.1735 95.8007 37.4262 95.4945 36.7369 95.7119L32.6068 97.0144C19.9799 100.997 8.07682 89.2018 12.0956 76.6897L13.4101 72.5971C13.6294 71.9141 13.3204 71.1736 12.6779 70.8443L8.82767 68.8715C-2.94256 62.84 -2.94255 46.1601 8.82767 40.1285L12.6779 38.1558C13.3204 37.8265 13.6294 37.0859 13.4101 36.4029L12.0956 32.3104C8.0768 19.7982 19.9799 8.00337 32.6068 11.9856L36.7369 13.2882C37.4262 13.5055 38.1735 13.1993 38.5058 12.5626L40.4966 8.74742ZM31.8421 27.25C28.245 27.25 25.3289 31.5843 25.3289 36.9309C25.329 42.2775 28.245 46.6119 31.8421 46.6119C35.4392 46.6118 38.3553 42.2775 38.3553 36.9309C38.3553 31.5843 35.4392 27.25 31.8421 27.25ZM44.8684 27.25C41.2713 27.25 38.3553 31.5843 38.3553 36.9309C38.3553 42.2775 41.2713 46.6119 44.8684 46.6119C48.4655 46.6118 51.3816 42.2775 51.3816 36.9309C51.3816 31.5843 48.4655 27.25 44.8684 27.25Z" fill="#FF7BFF"/></svg>` },
  { x:296, y:287, svg:`<svg width="99" height="85" viewBox="0 0 99 85" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.0574 24.8693C30.2756 13.3515 42.2418 8.41878 49.8036 17.1416L57.1545 25.6207C59.4231 28.2375 63.0129 26.7577 62.7783 23.3024L62.0182 12.1064C61.2364 0.58865 73.2818 -4.25324 80.8437 4.46973C90.9151 16.0877 97.182 31.2903 98.2235 46.6307C99.0054 58.1486 87.0469 63.2014 79.485 54.4784L72.1345 45.9991C69.8659 43.3822 66.2761 44.862 66.5107 48.3174L67.2704 59.5135C68.0522 71.0313 56.0861 75.9641 48.5242 67.2412L41.097 58.6736C38.8284 56.0569 35.2387 57.5367 35.4732 60.9919L36.241 72.3042C37.0229 83.8221 24.978 88.6642 17.4161 79.9411C7.34474 68.3232 1.07806 53.1211 0.0365638 37.7809C-0.745405 26.263 11.2131 21.2102 18.7751 29.9333L26.2015 38.5002C28.4701 41.1168 32.0598 39.6371 31.8253 36.1819L31.0574 24.8693ZM44.3468 40.3837C42.4434 41.1684 41.5363 43.3468 42.3205 45.2495C43.1049 47.1521 45.2837 48.0584 47.1871 47.2738C49.0905 46.4892 49.9977 44.3107 49.2134 42.4081C48.4291 40.5055 46.2502 39.5991 44.3468 40.3837ZM51.6451 37.3752C49.7417 38.1598 48.8346 40.3383 49.6189 42.2409C50.4032 44.1436 52.582 45.0499 54.4854 44.2653C56.3888 43.4806 57.296 41.3021 56.5117 39.3995C55.7274 37.4969 53.5485 36.5906 51.6451 37.3752Z" fill="#003AFF"/></svg>` },
  { x:296, y: 62, svg:`<svg width="64" height="74" viewBox="0 0 64 74" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 11.281C0.000144247 2.60964 9.38673 -2.8097 16.896 1.526L56.8321 24.5842C66.3893 30.1024 66.3894 43.8977 56.8321 49.4159L16.896 72.4741C9.38668 76.8098 -3.79023e-07 71.39 0 62.7186V11.281ZM40.704 28.6734C38.3005 28.6734 36.352 31.5389 36.352 35.0737C36.3521 38.6084 38.3005 41.474 40.704 41.474C43.1076 41.474 45.056 38.6084 45.056 35.0737C45.056 31.5389 43.1076 28.6734 40.704 28.6734ZM49.9201 28.6734C47.5165 28.6734 45.5681 31.5389 45.5681 35.0737C45.5681 38.6084 47.5165 41.474 49.9201 41.474C52.3236 41.474 54.272 38.6084 54.2721 35.0737C54.2721 31.5389 52.3236 28.6734 49.9201 28.6734Z" fill="#FBD500"/></svg>` },
  { x:104, y:110, svg:`<svg width="84" height="88" viewBox="0 0 84 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.0054 7.2908C36.6104 -5.71714 62.4675 -0.851223 75.7588 18.1591C89.0502 37.1695 84.7426 63.1254 66.1376 76.1333L52.4131 85.729C47.8193 88.9408 41.4348 87.7393 38.153 83.0454L34.8848 78.3709C31.603 73.677 32.6666 67.2682 37.2604 64.0563L53.2723 52.8614C60.5075 47.8028 62.7769 38.5587 57.6081 31.1658C52.4392 23.7729 42.3837 21.8806 35.1484 26.9392L19.1365 38.1341C14.5427 41.346 8.15825 40.1445 4.87644 35.4506L1.90532 31.2011C-1.37649 26.5071 -0.312892 20.0983 4.28094 16.8864L18.0054 7.2908ZM37.439 69.6256C35.8312 70.7497 35.6585 73.2782 37.0532 75.2731C38.448 77.268 40.8821 77.9739 42.4899 76.8498C44.0978 75.7256 44.2705 73.1972 42.8757 71.2022C41.481 69.2073 39.0469 68.5014 37.439 69.6256ZM44.0933 64.9731C42.4855 66.0973 42.3128 68.6258 43.7075 70.6207C45.1023 72.6156 47.5364 73.3215 49.1442 72.1974C50.7521 71.0732 50.9248 68.5447 49.53 66.5498C48.1353 64.5549 45.7012 63.849 44.0933 64.9731Z" fill="#FF9E00"/></svg>` },
  { x: 34, y:178, svg:`<svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.037 23.0403H70.3704V45.4399H100V80H0V0H37.037V23.0403ZM49.3827 35.0769C46.3145 35.0769 43.8272 38.2454 43.8272 42.1538C43.8272 46.0623 46.3145 49.2308 49.3827 49.2308C52.451 49.2308 54.9383 46.0623 54.9383 42.1538C54.9383 38.2454 52.451 35.0769 49.3827 35.0769ZM61.1111 29.5385C58.7247 29.5385 56.7901 31.8804 56.7901 34.7692C56.7901 37.6581 58.7247 40 61.1111 40C63.4975 40 65.4321 37.6581 65.4321 34.7692C65.4321 31.8804 63.4975 29.5385 61.1111 29.5385Z" fill="#00DDF9"/></svg>` },
  { x:285, y:194, svg:`<svg width="77" height="73" viewBox="0 0 77 73" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.987427 73C0.435143 73 -0.013916 72.5516 0.000267116 71.9995C0.322877 59.4435 6.70005 48.3878 16.3309 41.6233C19.2926 39.543 19.2926 33.457 16.3309 31.3767C6.70005 24.6122 0.322881 13.5565 0.000273323 1.00053C-0.0139097 0.448426 0.435149 -6.69241e-06 0.987433 -6.64413e-06L75.9874 -8.74228e-08C76.5397 -3.91405e-08 76.9888 0.448433 76.9746 1.00053C76.652 13.5565 70.2748 24.6121 60.644 31.3767C57.6823 33.4569 57.6823 39.5431 60.644 41.6233C70.2748 48.3879 76.652 59.4435 76.9746 71.9995C76.9888 72.5516 76.5397 73 75.9874 73L0.987427 73ZM45.2976 61.6901C47.0953 61.6901 48.7333 60.8521 49.9648 59.4778C50.4388 58.9488 51.3172 58.9126 51.8559 59.3755C52.8008 60.1873 53.9416 60.662 55.1708 60.662C58.4311 60.662 61.0741 57.3246 61.0741 53.2077C61.0741 49.0909 58.4311 45.7535 55.1708 45.7535C53.9416 45.7535 52.8008 46.2284 51.856 47.0403C51.3173 47.5033 50.4387 47.4671 49.9647 46.938C48.7333 45.5635 47.0954 44.7254 45.2976 44.7254C41.4709 44.7254 38.3686 48.5231 38.3686 53.2077C38.3686 57.8924 41.4709 61.6901 45.2976 61.6901Z" fill="#CDBDAA"/></svg>` },
  { x:197, y: 84, svg:`<svg width="75" height="74" viewBox="0 0 75 74" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9282 2.50348C34.1218 -1.36704 45.8781 -0.87288 55.9998 4.84994C73.8734 14.9558 79.8817 37.5371 69.4196 55.2868C58.9575 73.0365 35.9864 79.2332 18.1126 69.1274C7.99098 63.4046 1.67547 53.6809 3.35021e-05 43.0998L33.3862 34.9135L23.9282 2.50348ZM42.7388 24.2701C39.9796 22.7101 36.8183 23.0135 35.6782 24.9478C34.5381 26.882 35.8511 29.7149 38.6104 31.275C41.3696 32.8349 44.5304 32.5316 45.6705 30.5974C46.8106 28.6632 45.4981 25.8302 42.7388 24.2701ZM48.5677 14.3816C45.8085 12.8216 42.6471 13.1246 41.507 15.0589C40.3669 16.9931 41.6795 19.8261 44.4387 21.3862C47.198 22.9463 50.3592 22.6428 51.4993 20.7085C52.6393 18.7743 51.3268 15.9418 48.5677 14.3816Z" fill="#FF0005"/></svg>` },
];

// 興趣 chip：y 為 frame 絕對座標，渲染時扣掉捲動容器的 top(170)
const SCROLL_TOP = 170;
const GROUPS = [
  { label:'🎨 Art & Exhibitions', x:37, y:192 },
  { label:'☕ Coffee',            x:34, y:413 },
  { label:'🎵 Live Music',        x:33, y:635 },
];
const CHIPS = [
  {x:34, y:226,w:108,t:'🖼 Exhibitions'},      {x:150,y:226,w:96, t:'🏛 Galleries'},
  {x:254,y:226,w:122,t:'✏️ Design Shows'},     {x:34, y:271,w:134,t:'🎭 Performance Art'},
  {x:176,y:271,w:112,t:'📷 Photography'},      {x:296,y:271,w:72, t:'🧵 Textile'},
  {x:34, y:316,w:90, t:'🧑‍🎨 Artist Talks'},    {x:132,y:316,w:138,t:'📐 Architecture Tours'},
  {x:278,y:316,w:98, t:'🎪 Pop-up Art'},       {x:34, y:361,w:120,t:'🖼 Museum Visits'},
  {x:162,y:361,w:108,t:'🪞 Mixed Media'},      {x:278,y:361,w:86, t:'🎟 Art Fairs'},
  {x:35, y:447,w:122,t:'🚶 Café Hopping'},     {x:165,y:447,w:84, t:'🍵 Matcha'},
  {x:257,y:447,w:76, t:'🥐 Brunch'},           {x:34, y:492,w:98, t:'🧋 Bubble Tea'},
  {x:140,y:493,w:130,t:'☕ Specialty Coffee'}, {x:278,y:493,w:98, t:'🌿 Plant Cafés'},
  {x:35, y:538,w:144,t:'🧑‍🏫 Coffee Workshops'},{x:187,y:538,w:102,t:'🥯 Bagel Shops'},
  {x:297,y:538,w:74, t:'🍰 Dessert'},          {x:35, y:583,w:114,t:'🌅 Rooftop Cafés'},
  {x:157,y:583,w:116,t:'📚 Bookish Cafés'},    {x:281,y:583,w:90, t:'🐱 Cat Cafés'},
  {x:35, y:669,w:122,t:'🎻 Acoustic Sets'},    {x:165,y:669,w:94, t:'🎤 Open Mic'},
  {x:267,y:669,w:109,t:'🥁 Drum Circles'},     {x:34, y:714,w:98, t:'🎸 Indie Gigs'},
  {x:140,y:715,w:92, t:'🪕 Folk Music'},       {x:240,y:715,w:98, t:'🎷 Jazz Nights'},
  {x:34, y:760,w:150,t:'💿 Record Store Events'},{x:192,y:760,w:92,t:'🎤 Open Mic'},
  {x:292,y:760,w:78, t:'🎧 DJ Sets'},          {x:35, y:805,w:114,t:'🎫 Festival Gigs'},
  {x:157,y:805,w:98, t:'🎹 Piano Bars'},       {x:263,y:805,w:110,t:'🎵 Busking Tours'},
];
// 第 6 幕會依序點選這三個
const PICKS = [
  { t:'🖼 Exhibitions',   cls:'sel-art'    },
  { t:'🥐 Brunch',        cls:'sel-coffee' },
  { t:'📚 Bookish Cafés', cls:'sel-coffee' },
];

/* ---------- 小工具 ---------------------------------------- */
const el = (tag, cls, css) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (css) Object.assign(n.style, css);
  return n;
};
const px = v => v + 'px';

const APPLE_SVG = `<svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M14.94 11.6c-.02-2.4 1.96-3.56 2.05-3.62-1.12-1.63-2.85-1.86-3.47-1.88-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.62.03-3.11.94-3.94 2.39-1.68 2.91-.43 7.22 1.2 9.58.8 1.16 1.75 2.46 3 2.41 1.2-.05 1.66-.78 3.11-.78 1.45 0 1.86.78 3.13.75 1.29-.02 2.11-1.18 2.9-2.34.91-1.34 1.29-2.64 1.31-2.71-.03-.01-2.51-.96-2.53-3.84M12.6 4.53c.66-.81 1.11-1.93.99-3.05-.95.04-2.11.64-2.8 1.44-.61.71-1.15 1.85-1.01 2.94 1.06.08 2.15-.54 2.82-1.33" fill="#3A383F"/></svg>`;
const GOOGLE_SVG = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none"><path d="M18.62 9.71c0-.69-.06-1.35-.18-1.99H9.5v3.76h5.11c-.22 1.19-.89 2.19-1.9 2.87v2.38h3.07c1.8-1.65 2.84-4.09 2.84-7.02" fill="#4285F4"/><path d="M9.5 19c2.57 0 4.72-.85 6.29-2.3l-3.07-2.38c-.85.57-1.94.91-3.22.91-2.48 0-4.58-1.67-5.33-3.92H1v2.46A9.5 9.5 0 0 0 9.5 19" fill="#34A853"/><path d="M4.17 11.31a5.7 5.7 0 0 1 0-3.62V5.23H1a9.5 9.5 0 0 0 0 8.54l3.17-2.46" fill="#FBBC05"/><path d="M9.5 3.77c1.4 0 2.65.48 3.64 1.42l2.72-2.72C14.21.94 12.07 0 9.5 0A9.5 9.5 0 0 0 1 5.23l3.17 2.46c.75-2.25 2.85-3.92 5.33-3.92" fill="#EA4335"/></svg>`;
const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c0-3.6 3.2-5.6 7.2-5.6s7.2 2 7.2 5.6"/></svg>`;
const ICON_MAIL = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7 8.2 6 8.2-6"/></svg>`;
const ICON_KEY  = `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3.5M15.5 12v2.5"/></svg>`;

function statusbar(){
  const s = el('div','statusbar');
  s.innerHTML = `<div class="time">9:41</div>
    <div class="signal"><i></i><i></i><i></i><i></i></div>
    <div class="wifi"></div><div class="batt"></div>`;
  return s;
}
const homeIndicator = () => el('div','home-indicator');

function socialBtn(kind, cls){
  const b = el('div', `social-btn ${cls}`);
  b.innerHTML = kind === 'apple' ? APPLE_SVG : GOOGLE_SVG;
  b.dataset.role = kind;
  return b;
}

/* ---------- 1. sign in ------------------------------------ */
function buildSignIn(assetBase='assets'){
  const s = el('section','screen s-signin');
  s.id = 'screen-signin';

  const stage = el('div','card-stage');
  const strip = el('div','card-strip');
  // 放兩份，第 1 幕的無限飄移靠這個接回起點
  for (let copy = 0; copy < 2; copy++){
    CARDS.forEach((c, i) => {
      const img = el('img','card', {
        left: px(c.x + copy * STRIP_W), top: px(c.y),
        width: px(c.w), height: px(c.h)
      });
      img.src = `${assetBase}/cards/${c.file}`;
      img.alt = '';
      img.dataset.card = i;
      img.dataset.copy = copy;
      strip.appendChild(img);
    });
  }
  stage.appendChild(strip);
  s.appendChild(stage);

  const h = el('h1','headline'); h.textContent = "The city's better with company.";
  const p = el('p','subhead');   p.textContent = 'Join people who are always up for something new.';

  const cta = el('div','primary-btn cta');
  cta.innerHTML = `<span>Get started</span><span class="arrow"></span>`;
  cta.dataset.role = 'get-started';

  s.append(statusbar(), h, p, cta,
           socialBtn('apple','btn-apple'), socialBtn('google','btn-google'),
           homeIndicator());
  return s;
}

/* ---------- 2. Email 註冊分支 ------------------------------ */
function field(cls, icon, placeholder){
  const f = el('div', `field ${cls}`);
  f.innerHTML = `<span class="icon">${icon}</span>
                 <span class="value"><span class="txt">${placeholder}</span><i class="caret"></i></span>`;
  f.dataset.placeholder = placeholder;
  return f;
}

function buildEmail(){
  const s = el('section','screen s-email');
  s.id = 'screen-email';

  BLOBS.forEach((b,i) => {
    const d = el('div','blob', { left:px(b.x), top:px(b.y) });
    d.innerHTML = b.svg;
    d.dataset.blob = i;
    s.appendChild(d);
  });

  const h = el('h1','headline');
  h.textContent = "Let's\nget started!";   // Figma 原檔誤植為 stared，此處使用正確拼法

  const cta = el('div','primary-btn cta');
  cta.textContent = 'Continue';
  cta.dataset.role = 'email-continue';

  const or = el('div','or'); or.textContent = 'or sign in with';

  s.append(statusbar(), h,
    field('f-name',  ICON_USER, 'Name'),
    field('f-email', ICON_MAIL, 'Email adress'),
    field('f-pass',  ICON_KEY,  'Password'),
    cta,
    el('div','divider left'), el('div','divider right'), or,
    socialBtn('apple','btn-apple'), socialBtn('google','btn-google'),
    homeIndicator());
  return s;
}

/* ---------- 3. Apple ID 疊層 ------------------------------- */

// 取自 Figma 原檔的 Face ID 符號（SF Symbol faceid：四角括號＋眼睛＋鼻子＋微笑）
const FACE_ID_SVG = `<svg class="fid-symbol" width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.6123 48.0596C4.05393 48.0598 5.22363 49.2302 5.22363 50.6719C5.22367 57.0657 6.86453 59.5937 8.64062 61.3594C10.4167 63.1355 12.9343 64.7763 19.3281 64.7764C20.7698 64.7764 21.9402 65.9461 21.9404 67.3877C21.9404 68.8295 20.7699 70 19.3281 70C10.9596 70 7.25034 67.3571 4.94141 65.0586C2.64292 62.7601 5.1046e-05 59.0404 0 50.6719C0 49.2301 1.17051 48.0596 2.6123 48.0596ZM67.3877 48.0596C68.8295 48.0596 70 49.2301 70 50.6719C69.9999 59.0404 67.3571 62.7497 65.0586 65.0586C62.7601 67.3675 59.0404 69.9999 50.6719 70C49.2301 70 48.0596 68.8295 48.0596 67.3877C48.0598 65.9461 49.2302 64.7764 50.6719 64.7764C57.0657 64.7763 59.5937 63.1355 61.3594 61.3594C63.125 59.5833 64.7763 57.0657 64.7764 50.6719C64.7764 49.2302 65.9461 48.0598 67.3877 48.0596ZM45.7822 45.3018C46.4612 45.3018 47.0566 45.5417 47.5371 46.0117C48.0282 46.4819 48.2686 47.0776 48.2686 47.7881C48.2686 48.1746 48.2164 48.5193 48.1016 48.8223C47.9867 49.1252 47.8196 49.3971 47.5898 49.627C45.9078 51.309 43.954 52.6151 41.7393 53.5449C39.5244 54.4748 37.2672 54.9443 34.9688 54.9443L34.9482 54.9551C32.6288 54.9551 30.3297 54.5056 28.0625 53.5967C25.7851 52.6878 23.8837 51.3508 22.3584 49.5957C22.1077 49.3241 21.9086 49.0317 21.7832 48.7393C21.6579 48.4468 21.5957 48.133 21.5957 47.7988C21.5957 47.0884 21.8466 46.4926 22.3271 46.0225C22.8077 45.5524 23.4136 45.3115 24.124 45.3115C24.5836 45.3115 24.9595 45.4063 25.252 45.6152C25.5445 45.8242 25.8474 46.0646 26.1504 46.3467C27.2473 47.4645 28.5954 48.3623 30.1729 49.0205C31.7608 49.6787 33.3491 50.0136 34.958 50.0137C36.6714 50.0137 38.3118 49.6791 39.8789 49C41.446 48.3209 42.7521 47.4329 43.7969 46.3359C44.4342 45.6464 45.1031 45.3018 45.7822 45.3018ZM35.9189 21.627C36.6816 21.627 37.2881 21.8466 37.7373 22.2959C38.1864 22.7346 38.4062 23.3298 38.4062 24.0713V36.1279C38.4062 38.071 37.9045 39.5445 36.8809 40.5684C35.857 41.5818 34.3836 42.0937 32.4404 42.0938H32.0957L32.085 42.1045C31.1447 42.1045 30.4029 41.8747 29.8701 41.415C29.3373 40.9553 29.0654 40.3179 29.0654 39.5029C29.0654 38.8134 29.3062 38.2279 29.7764 37.7578C30.2568 37.288 30.8313 37.0479 31.5205 37.0479H32.8584C33.0359 37.0478 33.1719 37.0061 33.2764 36.9121C33.3808 36.8285 33.4326 36.6816 33.4326 36.4727V24.0713C33.4327 23.3299 33.6627 22.745 34.1221 22.2959C34.5817 21.8467 35.1565 21.627 35.9189 21.627ZM20.624 21.6689C21.5224 21.669 22.2535 21.9509 22.8281 22.5254C23.4027 23.0999 23.6855 23.8415 23.6855 24.7607V29.9639C23.6855 30.8833 23.4028 31.6256 22.8281 32.2002C22.2536 32.7746 21.5119 33.0566 20.624 33.0566C19.7255 33.0566 18.9936 32.7748 18.4189 32.2002C17.8444 31.6256 17.5625 30.8832 17.5625 29.9639V24.7607C17.5626 23.8417 17.8446 23.0999 18.4189 22.5254C18.9936 21.9508 19.7255 21.6689 20.624 21.6689ZM49.627 21.6689C50.5253 21.669 51.2565 21.9509 51.8311 22.5254C52.4056 23.0999 52.6884 23.8415 52.6885 24.7607V29.9639C52.6885 30.8833 52.4057 31.6256 51.8311 32.2002C51.2565 32.7746 50.5149 33.0566 49.627 33.0566C48.7286 33.0566 47.9974 32.7746 47.4229 32.2002C46.8482 31.6256 46.5654 30.8833 46.5654 29.9639V24.7607C46.5655 23.8415 46.8483 23.0999 47.4229 22.5254C47.9974 21.9509 48.7286 21.6689 49.627 21.6689ZM19.3281 0C20.7699 0 21.9404 1.17051 21.9404 2.6123C21.9402 4.05393 20.7698 5.22363 19.3281 5.22363C12.9343 5.22367 10.4063 6.86453 8.64062 8.64062C6.86453 10.4167 5.22367 12.9343 5.22363 19.3281C5.22363 20.7698 4.05393 21.9402 2.6123 21.9404C1.17051 21.9404 0 20.7699 0 19.3281C4.89609e-05 10.9596 2.64292 7.25034 4.94141 4.94141C7.25034 2.64292 10.9596 4.89626e-05 19.3281 0ZM50.6719 0C59.0404 5.10443e-05 62.7497 2.64292 65.0586 4.94141C67.3571 7.23989 70 10.9596 70 19.3281C70 20.7699 68.8295 21.9404 67.3877 21.9404C65.9461 21.9402 64.7764 20.7698 64.7764 19.3281C64.7763 12.9343 63.1355 10.4063 61.3594 8.64062C59.5833 6.86453 57.0657 5.22367 50.6719 5.22363C49.2302 5.22363 48.0598 4.05393 48.0596 2.6123C48.0596 1.17051 49.2301 0 50.6719 0Z" fill="#87FA89"/></svg>`;

// 成功後的勾勾，用 stroke-dashoffset 讓它「畫」出來，跟 iOS 的行為一致
const CHECK_SVG = `<svg class="fid-check" width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 36.5 29 49.5 54 21" stroke="#87FA89" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function buildApple(assetBase='assets'){
  const s = el('section','screen s-apple');
  s.id = 'screen-apple';
  s.innerHTML = `
    <div class="dim"></div>
    <div class="faceid">
      <div class="glyph">${FACE_ID_SVG}${CHECK_SVG}</div>
    </div>
    <div class="sheet">
      <div class="sheet-title">Apple ID</div>
      <div class="sheet-close">✕</div>
      <div class="app-icon"><img src="${assetBase}/logo-icon.svg" alt=""></div>
      <p class="sheet-copy">Do you want to sign in to Wander Buddy App
        using your Apple ID “username@icloud.com”</p>
      <div class="sheet-btn" data-role="apple-continue">Continue</div>
    </div>`;
  return s;
}

/* ---------- 4. event & interest ---------------------------- */
function buildInterest(){
  const s = el('section','screen s-interest');
  s.id = 'screen-interest';

  const title = el('h1','title'); title.textContent = 'Choose 3 or more interests';

  const scroller = el('div','scroller');
  const inner = el('div','scroll-inner');

  GROUPS.forEach(g => {
    const l = el('div','group-label', { left:px(g.x), top:px(g.y - SCROLL_TOP) });
    l.textContent = g.label;
    inner.appendChild(l);
  });
  CHIPS.forEach((c,i) => {
    const d = el('div','chip', { left:px(c.x), top:px(c.y - SCROLL_TOP), width:px(c.w) });
    d.textContent = c.t;
    d.dataset.chip = i;
    d.dataset.label = c.t;
    inner.appendChild(d);
  });
  scroller.appendChild(inner);

  const cta = el('div','cta'); cta.textContent = 'Continue';
  cta.dataset.role = 'interest-continue';

  s.append(statusbar(), title, scroller, cta, homeIndicator());
  return s;
}

/* ---------- Apple ID 驗證流程的播放 ------------------------- */
/*
   時序依 Apple 實際的 Face ID 驗證行為：
   0ms    畫面變暗、彈窗由下上滑、Face ID 黑框浮現
   700ms  開始掃描 — 符號呼吸兩次（暗→亮→暗），共 2300ms
   3000ms 辨識成功 — 符號縮小淡出、勾勾描邊畫出、黑框輕微一縮
   3700ms 彈窗下滑收起
*/
const APPLE_AUTH_TIMING = { open:0, scan:700, done:3000, dismiss:3700, end:4200 };

function playAppleAuth(screen, onEnd){
  const fid = screen.querySelector('.faceid');
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  // 重置
  screen.classList.remove('is-open');
  fid.classList.remove('is-scanning','is-done');
  void screen.offsetWidth;   // 強制 reflow，讓重置生效

  at(APPLE_AUTH_TIMING.open,    () => screen.classList.add('is-open'));
  at(APPLE_AUTH_TIMING.scan,    () => fid.classList.add('is-scanning'));
  at(APPLE_AUTH_TIMING.done,    () => {
    fid.classList.remove('is-scanning');
    fid.classList.add('is-done');
  });
  at(APPLE_AUTH_TIMING.dismiss, () => screen.classList.remove('is-open'));
  at(APPLE_AUTH_TIMING.end,     () => { if (onEnd) onEnd(); });

  return () => timers.forEach(clearTimeout);   // 回傳取消函式
}

/* ---------- 組裝一台手機 ----------------------------------- */
function buildPhone(screens, assetBase='assets'){
  const p = el('div','phone');
  const map = { signin:buildSignIn, email:buildEmail, apple:buildApple, interest:buildInterest };
  screens.forEach(name => p.appendChild(map[name](assetBase)));
  return p;
}


/* ---------- 對外公開（以一般 script 載入，file:// 可直接開）---------- */
window.WB = {
  CARDS, STRIP_W, BLOBS, GROUPS, CHIPS, PICKS, SCROLL_TOP,
  buildSignIn, buildEmail, buildApple, buildInterest, buildPhone,
  playAppleAuth, APPLE_AUTH_TIMING
};


/* ==========================================================
   Wander Buddy — Sign-up flow 展示動畫
   單一時間軸驅動，可暫停、可調速、無縫循環
   ========================================================== */

var PLAYBACK_SPEED = 1;      // 除錯時可調成 0.4 慢動作看細節
var TOTAL = 22000;           // 一輪總長（ms）

/* ---------- 時間軸引擎 ------------------------------------- */
function Timeline(){
  var events = [];
  return {
    at: function(ms, fn){ events.push({ ms:ms, fn:fn, done:false }); return this; },
    reset: function(){ events.forEach(function(e){ e.done = false; }); },
    tick: function(t){
      for (var i=0; i<events.length; i++){
        var e = events[i];
        if (!e.done && t >= e.ms){ e.done = true; e.fn(); }
      }
    },
    get count(){ return events.length; }
  };
}

/* 固定種子的偽亂數 — 打字速度要有變化，但每次播放結果一致 */
function seeded(seed){
  var s = seed;
  return function(){ s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
}

/* ---------- 主程式 ----------------------------------------- */
function createFlowAnimation(root, assetBase){
  assetBase = assetBase || 'assets';

  /* --- DOM 組裝 ------------------------------------------- */
  var stage = document.createElement('div'); stage.className = 'stage';

  var phone = document.createElement('div'); phone.className = 'phone';
  var scSignin   = buildSignIn(assetBase);
  var scEmail    = buildEmail();
  var scApple    = buildApple(assetBase);
  var scInterest = buildInterest();
  phone.appendChild(scSignin);
  phone.appendChild(scEmail);
  phone.appendChild(scApple);
  phone.appendChild(scInterest);

  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = '<span class="dot"></span>';
  phone.appendChild(cursor);

  var badge = document.createElement('div'); badge.className = 'badge';
  var orBadge = document.createElement('div'); orBadge.className = 'or-badge'; orBadge.textContent = 'OR';


  stage.appendChild(phone);
  stage.appendChild(badge);
  stage.appendChild(orBadge);


  var endlogo = document.createElement('div');
  endlogo.className = 'endlogo';
  endlogo.innerHTML = '<img src="' + assetBase + '/logo.svg" alt="Wander Buddy">';

  root.className = 'film';
  root.appendChild(stage);
  root.appendChild(endlogo);

  /* --- 常用節點 ------------------------------------------- */
  var cards      = scSignin.querySelectorAll('.card');
  var strip      = scSignin.querySelector('.card-strip');
  var signinUps  = [scSignin.querySelector('.headline'), scSignin.querySelector('.subhead'),
                    scSignin.querySelector('.cta'), scSignin.querySelector('.btn-apple'),
                    scSignin.querySelector('.btn-google')];
  var fName = scEmail.querySelector('.f-name'),
      fMail = scEmail.querySelector('.f-email'),
      fPass = scEmail.querySelector('.f-pass');
  var emailCta   = scEmail.querySelector('.cta');
  var emailApple = scEmail.querySelector('.btn-apple');
  var appleFid   = scApple.querySelector('.faceid');
  var scroller   = scInterest.querySelector('.scroll-inner');
  var interestCta= scInterest.querySelector('.cta');

  function chipByLabel(label){
    var list = scInterest.querySelectorAll('.chip');
    for (var i=0;i<list.length;i++) if (list[i].dataset.label === label) return list[i];
    return null;
  }

  /* --- 小工具 --------------------------------------------- */
  function show(el){ el.classList.add('is-on'); }
  function hide(el){ el.classList.remove('is-on'); }
  function onlyShow(el){
    [scSignin, scEmail, scApple, scInterest].forEach(function(s){
      if (s === el) s.classList.add('is-on'); else s.classList.remove('is-on');
    });
  }
  function press(el){
    el.classList.remove('is-pressed'); void el.offsetWidth; el.classList.add('is-pressed');
  }

  /* 游標不做位移：在要點的位置直接淡入 → 點擊 → 淡出。
     讓它滑來滑去會搶走觀眾的注意力，也是原本畫面亂晃的原因。 */
  function placeCursor(x, y){
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  function clickAt(){
    cursor.classList.remove('is-clicking'); void cursor.offsetWidth;
    cursor.classList.add('is-clicking');
  }
  /* atMs 是「按下去」的時間，游標會提前 300ms 淡入、之後 400ms 淡出 */
  function tapAt(atMs, x, y, target){
    tl.at(atMs - 300, function(){ placeCursor(x, y); show(cursor); });
    tl.at(atMs, function(){ clickAt(); if (target) press(target); });
    tl.at(atMs + 400, function(){ hide(cursor); });
  }

  function setText(field, str){
    field.querySelector('.txt').textContent = str;
  }
  function fieldReset(field){
    field.classList.remove('is-focused','has-value');
    setText(field, field.dataset.placeholder);
  }

  /* --- 時間軸 --------------------------------------------- */
  var tl = Timeline();
  var rnd = seeded(20260813);

  /* 打字：每字 60–90ms 隨機，等速看起來像機器人 */
  function typeInto(startMs, field, text, mask){
    var t = startMs;
    tl.at(t, function(){ field.classList.add('has-value'); setText(field, ''); });
    var acc = '';
    for (var i=0; i<text.length; i++){
      var ch = mask ? '•' : text.charAt(i);
      acc += ch;
      t += 60 + Math.round(rnd() * 30);
      if (/[@.]/.test(text.charAt(i))) t += 120;   // 標點後多停一下
      (function(snapshot, at){
        tl.at(at, function(){ setText(field, snapshot); });
      })(acc, t);
    }
    return t;
  }

  /* 反向刪字：分支切換時的「倒帶」訊號
     注意 text 必須明確傳入 —— 時間軸是在建構期就排好的，
     這時欄位裡還是 placeholder，不能從 DOM 讀 */
  function untype(startMs, field, text, ms){
    var step = ms / Math.max(text.length, 1);
    for (var i=text.length; i>=0; i--){
      (function(snapshot, at){
        tl.at(at, function(){ setText(field, snapshot); });
      })(text.slice(0, i), startMs + (text.length - i) * step);
    }
    tl.at(startMs + ms, function(){ fieldReset(field); });
  }

  /* ===== 第 1 幕：Onboarding（0 – 4.2s）================== */
  tl.at(0, function(){
    onlyShow(scSignin);
    hide(cursor); hide(badge); hide(orBadge); hide(endlogo);
    strip.classList.remove('is-drifting');
    Array.prototype.forEach.call(cards, function(c){ c.classList.remove('is-in'); });
    signinUps.forEach(function(el){ el.classList.remove('is-up'); });
    [fName, fMail, fPass].forEach(fieldReset);
    scApple.classList.remove('is-open');
    appleFid.classList.remove('is-scanning','is-done');
    scroller.style.transition = 'none';
    scroller.style.transform = 'translateY(0)';
    interestCta.classList.remove('is-enabled');
    Array.prototype.forEach.call(scInterest.querySelectorAll('.chip'), function(c){
      c.classList.remove('sel-art','sel-coffee');
    });
  });

  // 八張卡片一張一張飛入，間隔 90ms
  for (var i=0; i<8; i++){
    (function(idx){
      tl.at(300 + idx * 90, function(){
        Array.prototype.forEach.call(cards, function(c){
          if (Number(c.dataset.card) === idx) c.classList.add('is-in');
        });
      });
    })(i);
  }
  tl.at(1500, function(){ strip.classList.add('is-drifting'); });
  tl.at(2000, function(){ signinUps[0].classList.add('is-up'); });
  tl.at(2180, function(){ signinUps[1].classList.add('is-up'); });
  tl.at(2600, function(){ signinUps[2].classList.add('is-up'); });
  tl.at(2720, function(){ signinUps[3].classList.add('is-up'); });
  tl.at(2800, function(){ signinUps[4].classList.add('is-up'); });

  tapAt(4200, 141, 812, signinUps[2]);          // Get started

  /* ===== 第 2 幕：Email 路徑（4.4 – 10s）================= */
  tl.at(4400, function(){ onlyShow(scEmail); });
  tl.at(4600, function(){ badge.textContent = 'Email'; show(badge); });

  tapAt(5200, 201, 423);                                        // Name 欄位
  tl.at(5200, function(){ fName.classList.add('is-focused'); });
  typeInto(5320, fName, 'Maida', false);

  tapAt(6300, 201, 494);                                        // Email 欄位
  tl.at(6280, function(){ fName.classList.remove('is-focused'); });
  tl.at(6300, function(){ fMail.classList.add('is-focused'); });
  typeInto(6420, fMail, 'itsme01@gmail.com', false);

  tapAt(8400, 201, 565);                                        // Password 欄位
  tl.at(8380, function(){ fMail.classList.remove('is-focused'); });
  tl.at(8400, function(){ fPass.classList.add('is-focused'); });
  typeInto(8520, fPass, '12345678', true);

  tl.at(9400, function(){ fPass.classList.remove('is-focused'); });
  tapAt(9600, 201, 653, emailCta);                              // Continue

  /* ===== 第 3 幕：倒帶 + OR（10 – 11.4s）================= */
  untype(10100, fPass, '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', 300);
  untype(10100, fMail, 'itsme01@gmail.com', 300);
  untype(10100, fName, 'Maida', 300);
  tl.at(10500, function(){ hide(badge); show(orBadge); });
  tl.at(10950, function(){ hide(orBadge); });
  tl.at(11150, function(){ badge.textContent = 'Apple ID'; show(badge); });

  /* ===== 第 4 幕：Apple ID（11.6 – 15.4s）================ */
  tapAt(11800, 166, 746, emailApple);                           // Apple 按鈕
  tl.at(11950, function(){ scApple.classList.add('is-on','is-open'); });
  tl.at(12600, function(){ appleFid.classList.add('is-scanning'); });
  tl.at(14200, function(){
    appleFid.classList.remove('is-scanning');
    appleFid.classList.add('is-done');
  });
  tl.at(15000, function(){ scApple.classList.remove('is-open'); });

  /* ===== 第 5 幕：選擇興趣（15.6 – 20s）================== */
  tl.at(15400, function(){ hide(badge); });
  tl.at(15600, function(){ onlyShow(scInterest); });

  // chip 的畫面座標＝Figma 座標（捲動容器的 top 剛好等於 SCROLL_TOP）
  tapAt(16300, 88, 243);                                        // 🖼 Exhibitions
  tl.at(16300, function(){
    var c = chipByLabel('🖼 Exhibitions');
    if (c){ c.classList.add('sel-art'); press(c); }
  });

  tapAt(17000, 295, 464);                                       // 🥐 Brunch
  tl.at(17000, function(){
    var c = chipByLabel('🥐 Brunch');
    if (c){ c.classList.add('sel-coffee'); press(c); }
  });

  tl.at(17600, function(){
    scroller.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
    scroller.style.transform = 'translateY(-120px)';
  });

  tapAt(18600, 215, 480, null);                                 // 📚 Bookish Cafés（捲動後）
  tl.at(18600, function(){
    var c = chipByLabel('📚 Bookish Cafés');
    if (c){ c.classList.add('sel-coffee'); press(c); }
  });

  tl.at(18900, function(){ interestCta.classList.add('is-enabled'); press(interestCta); });
  tapAt(19700, 201, 812, interestCta);                          // Continue

  /* ===== 第 6 幕：結尾 logo（20.2 – 22s）================= */
  tl.at(20200, function(){ hide(cursor); phone.style.opacity = '0'; });
  tl.at(20700, function(){ show(endlogo); });
  tl.at(21600, function(){ hide(endlogo); });
  tl.at(21900, function(){ phone.style.opacity = ''; });

  /* --- 播放控制 -------------------------------------------- */
  var raf = null, t0 = null, paused = false, pausedAt = 0;
  var onTick = null;

  function frame(now){
    if (t0 === null) t0 = now;
    var t = (now - t0) * PLAYBACK_SPEED;
    if (t >= TOTAL){ t0 = now; t = 0; tl.reset(); }
    tl.tick(t);
    if (onTick) onTick(t);
    raf = requestAnimationFrame(frame);
  }

  return {
    play: function(){
      if (raf) return;
      paused = false;
      raf = requestAnimationFrame(function(n){ t0 = n - pausedAt / PLAYBACK_SPEED; frame(n); });
    },
    pause: function(){
      if (!raf) return;
      cancelAnimationFrame(raf); raf = null; paused = true;
    },
    restart: function(){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      tl.reset(); pausedAt = 0; t0 = null;
      raf = requestAnimationFrame(frame);
    },
    setSpeed: function(v){ PLAYBACK_SPEED = v; },
    onTick: function(fn){ onTick = function(t){ pausedAt = t; fn(t); }; },
    get isPaused(){ return paused; },
    total: TOTAL
  };
}

window.WBAnim = { createFlowAnimation: createFlowAnimation, Timeline: Timeline };
