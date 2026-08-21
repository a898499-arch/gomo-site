/* ============================================================
   suisui — Onboarding 自動演示（原生 JS，時序/緩動/座標逐字保留）

   2026-08-20：從 all-ui-animation/suisui-onboarding-demo/ 複製整合進來。
   跟原始 <script> 內容的差異只有兩處，都是外部整合需要的最小必要修改，
   timeline()/run()/sleep()/show()/reset() 等每一段時序、緩動曲線、
   座標數字完全沒有動：

   1. 整段包進一個 IIFE，避免 speed/paused/token/run/reset/show/caption
      這些非常通用的變數/函式名稱洩漏成全域變數，污染到頁面上其他
      script（原本的 <script> 標籤是直接寫在同一個 HTML 檔案自己的
      <body> 底部，本來就没有這個風險，搬進一個共用頁面才需要這一層）。

   2. 檔案最後「字體載入完自動開跑」那一行，改成對外暴露
      window.SuiSuiOnboardingDemo = { play, pause }，讓
      OnboardingDemo.jsx 用 IntersectionObserver 決定何時開始/停止——
      這是你已經核准的「必要新增，不是改寫」那一項。
      pause() 用既有的 token.cancelled 機制（不是只切 paused 旗標），
      這樣離開視窗時 sleep() 的 requestAnimationFrame 迴圈會真的停止
      再排程，不是繼續空轉；play() 用既有的 restart() 函式，代表每次
      重新進入視窗都是從第一頁開始播（不是恢復播放到中斷的那一格）。

   3. 拿掉原本的 addEventListener('keydown', ...) 那段。它是全域
      監聽，不是綁在這個元件範圍內——上線後只要這個元件掛著，網站
      任何地方按空白鍵都會被 e.preventDefault() 擋掉（等於全站文字
      輸入框都打不出空白），按 r／h 也會被demo攔截。控制列你已經決定
      藏起來給訪客看不到，這組鍵盤快速鍵是同一類「開發用工具」，不是
      設計/時序的一部分，所以一併拿掉，不是遺漏。
   ============================================================ */
(function () {
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let speed = 1, paused = false, loop = true;
let token = {cancelled:false};
const CANCEL = Symbol('cancel');

function sleep(ms){
  return new Promise((resolve, reject)=>{
    const my = token;
    let remaining = ms, last = performance.now();
    (function tick(now){
      if(my.cancelled) return reject(CANCEL);
      const dt = now - last; last = now;
      if(!paused) remaining -= dt * speed;
      if(remaining <= 0) return resolve();
      requestAnimationFrame(tick);
    })(performance.now());
  });
}

/* ---- 假游標 ---- */
const cursor = $('#cursor'), screen = $('#screen');
let cx = 201, cy = 700;
function cursorTo(x, y, dur = 620){
  cx = x; cy = y;
  cursor.style.transitionDuration = (dur/speed) + 'ms';
  cursor.style.transform = `translate(${x}px, ${y}px)`;
}
/* .stage 在視窗較矮時會被 CSS transform: scale() 縮小。
   getBoundingClientRect() 回傳的是「縮放後」的螢幕像素，
   但游標的 translate() 是在「縮放前」的 402×874 座標系裡算的 ——
   不除掉這個倍率，游標就會跟按鈕差開一段距離。 */
function stageScale(){ return screen.getBoundingClientRect().width / 402; }
function centerOf(el){
  const k = stageScale();
  const r = el.getBoundingClientRect(), s = screen.getBoundingClientRect();
  return { x: (r.left - s.left + r.width/2) / k, y: (r.top - s.top + r.height/2) / k };
}
async function moveTo(el, dur = 620, dx = 0, dy = 0){
  const c = centerOf(el);
  cursor.style.opacity = 1;
  cursorTo(c.x + dx, c.y + dy, dur);
  await sleep(dur);
}
function ripple(){
  const d = document.createElement('div');
  d.className = 'ripple';
  d.style.left = cx + 'px'; d.style.top = cy + 'px';
  screen.appendChild(d);
  setTimeout(()=>d.remove(), 700);
}
/* 點一下：游標壓下 + 漣漪 + 目標元素進入 pressed */
async function tap(el, pressClass = 'pressed'){
  cursor.classList.add('down'); ripple();
  el && el.classList.add(pressClass);
  await sleep(150);
  cursor.classList.remove('down');
  el && el.classList.remove(pressClass);
  await sleep(110);
}
async function clickOn(el, moveDur = 620, pressClass = 'pressed'){
  await moveTo(el, moveDur);
  await tap(el, pressClass);
}

/* ---- 畫面切換 ---- */
let current = null;
async function show(id, mode = 'push', dur = 520){
  const next = $('#' + id);
  const prevEl = current;                 // 先抓住舊畫面，別讓它被下一次指派蓋掉

  next.style.transition = 'none';
  next.classList.add('active','entering');
  if(mode === 'push'){ next.style.opacity = 1; next.style.transform = 'translateX(402px)'; }
  else            { next.style.opacity = 0; next.style.transform = 'none'; }
  void next.offsetWidth;                  // 強制 reflow，讓起始狀態生效
  next.style.transition = `opacity ${dur/speed}ms ease, transform ${dur/speed}ms cubic-bezier(.32,.72,0,1)`;
  if(mode === 'push') next.style.transform = 'translateX(0)';
  else                next.style.opacity = 1;

  current = next;
  await sleep(dur + 60);

  if(prevEl && prevEl !== next) clearScreen(prevEl);
  next.classList.remove('entering');
}
function clearScreen(el){
  el.classList.remove('active','entering');
  el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
}
function caption(t){ $('#caption').textContent = t; }
function statusbar(on){ $('#statusbar').classList.toggle('hidden', !on); }

/* ---- 進度條（跨頁共用，只在按下 Next 後才推進） ---- */
function trackOn(on){ $('#track').classList.toggle('on', on); }
async function advance(px){
  const f = $('#track-fill');
  f.style.transitionDuration = (700/speed) + 'ms';
  f.style.width = px + 'px';
  await sleep(260);          // 讓觀眾看到條子先動，再翻頁
}

/* ---- 時間滾輪 ---- */
function buildWheel(el, values, centerIndex){
  el.innerHTML = values.map((v,i)=>
    `<div class="wheel-item${i===centerIndex?'':' dim'}">${v}</div>`).join('');
  el.dataset.center = centerIndex;
  el.style.transition = 'none';
  el.style.transform = `translateY(${93 - 38.5 - centerIndex*77}px)`;
  void el.offsetWidth;
  el.style.transition = '';
}
function wheelTo(el, index){
  [...el.children].forEach((c,i)=>c.classList.toggle('dim', i !== index));
  el.style.transitionDuration = (900/speed) + 'ms';
  el.style.transform = `translateY(${93 - 38.5 - index*77}px)`;
}

/* ---- 逐字輸入 ---- */
const PHONE = '07700 900123';
async function typePhone(){
  const val = $('#phone-val'), ph = $('#phone-ph'), caret = $('#phone-caret');
  ph.style.display = 'none'; caret.style.display = 'inline-block';
  for(const ch of PHONE){
    if(ch === ' '){ val.textContent += ' '; await sleep(80); continue; }
    const key = $(`.key[data-k="${ch}"]`);
    if(key){
      const c = centerOf(key);
      cursorTo(c.x, c.y, 210);
      await sleep(200);
      key.classList.add('tapped'); cursor.classList.add('down'); ripple();
      await sleep(105);
      key.classList.remove('tapped'); cursor.classList.remove('down');
    }
    val.textContent += ch;
    await sleep(95);
  }
  caret.style.display = 'none';
}

/* ---- 重置 ---- */
function reset(){
  $$('.scr').forEach(s=>{ clearScreen(s); s.classList.remove('lit'); });
  $$('.opt').forEach(o=>o.classList.remove('selected'));
  $$('.sizecard').forEach(c=>c.classList.remove('selected'));
  $$('.track-fill').forEach(f=>{ f.style.transition='none'; f.style.width='0'; void f.offsetWidth; f.style.transition=''; });
  $('#phone-val').textContent = ''; $('#phone-ph').style.display = '';
  $('#phone-caret').style.display = 'none';
  $('#phone-field').classList.remove('focus');
  $('#keypad').classList.remove('up');
  trackOn(false); $('#track-fill').style.transition='none'; $('#track-fill').style.width='0';
  void $('#track-fill').offsetWidth; $('#track-fill').style.transition='';
  $('#mini-h').textContent = '06'; $('#mini-m').textContent = '00';
  buildWheel($('#wheel-h'), ['04','05','06','07','08','09','10'], 2);
  buildWheel($('#wheel-m'), ['00','05','10','15','20','25','30'], 0);
  cursor.style.opacity = 0;
  cursor.style.transition = 'none';
  cursor.style.transform = 'translate(201px,700px)';
  void cursor.offsetWidth; cursor.style.transition = '';
  current = null; statusbar(false); caption('');
}

/* ============================================================
   時間軸
   ============================================================ */
async function timeline(){

  /* — 01 品牌 — */
  caption('01 / 07 · 開場');
  await show('s-logo','fade');
  await sleep(120);
  $('#s-logo').classList.add('lit');
  await sleep(2300);

  /* — 02 介紹 — */
  caption('02 / 07 · 介紹');
  statusbar(true);
  await show('s-intro','fade', 1000);          // 整頁一起淡入
  await sleep(1900);
  await clickOn($('#intro-btn'), 700);

  /* — 03 登入 — */
  caption('03 / 07 · 手機號碼登入');
  await show('s-login');
  await sleep(700);
  await moveTo($('#phone-field'), 640);
  await tap(null);
  $('#phone-field').classList.add('focus');
  $('#keypad').classList.add('up');
  await sleep(560);
  await typePhone();
  await sleep(420);
  $('#keypad').classList.remove('up');
  $('#phone-field').classList.remove('focus');
  await sleep(480);
  await clickOn($('#code-btn'), 620);

  /* — 04 字級 —
     進度條在這裡才出現，且停在 0：使用者還沒完成任何一步。 */
  caption('04 / 07 · 選擇字級');
  await show('s-size');
  trackOn(true);
  await sleep(900);
  await clickOn($('#card-m'), 700);
  $('#card-m').classList.add('selected');
  await sleep(1200);
  await clickOn($('#size-next'), 620);
  await advance(110);                  // 選完 + 按下 Next → 才推進

  /* — 05 問卷 1 — */
  caption('05 / 07 · 使用習慣');
  await show('s-q1');                  // 進度條維持在 110，不會歸零
  await sleep(900);
  await clickOn($('#q1-b'), 700);
  $('#q1-b').classList.add('selected');
  await sleep(1100);
  await clickOn($('#q1-next'), 620);
  await advance(190);

  /* — 06 問卷 2（複選） — */
  caption('06 / 07 · 設定目標');
  await show('s-q2');
  await sleep(700);
  for(const id of ['#q2-c','#q2-d','#q2-e']){
    await clickOn($(id), 560);
    $(id).classList.add('selected');
    await sleep(400);
  }
  await sleep(700);
  await clickOn($('#q2-next'), 620);
  await advance(270);

  /* — 07 提醒時間 — */
  caption('07 / 07 · 每日提醒');
  await show('s-remind');
  await sleep(800);

  await moveTo($('#wheel-h').parentElement, 700);
  await tap(null);
  wheelTo($('#wheel-h'), 4);           // 06 → 08
  $('#mini-h').textContent = '08';
  await sleep(1050);

  await moveTo($('#wheel-m').parentElement, 560);
  await tap(null);
  wheelTo($('#wheel-m'), 5);           // 00 → 25
  $('#mini-m').textContent = '25';
  await sleep(1250);

  await clickOn($('#rm-next'), 620);
  await advance(354);                  // 最後一步：進度條推滿

  /* — 收尾：停在最後一頁，不再重播 logo — */
  cursor.style.opacity = 0;
  caption('');
  await sleep(1800);
}

async function run(){
  do{
    reset();
    try{ await timeline(); }
    catch(e){ if(e === CANCEL) return; throw e; }
    if(!loop) return setPlay(false);
    await sleep(500).catch(()=>{});
  } while(loop);
}
function restart(){
  token.cancelled = true;
  token = {cancelled:false};
  paused = false; setPlayLabel();
  setTimeout(run, 60);
}

/* ---- 控制列 ---- */
function setPlayLabel(){ $('#btn-play').textContent = paused ? '▶ 播放' : '⏸ 暫停'; }
function setPlay(p){ paused = p; setPlayLabel(); }
$('#btn-play').onclick = ()=> setPlay(!paused);
$('#btn-replay').onclick = restart;
$('#btn-loop').onclick = e => { loop = !loop; e.currentTarget.classList.toggle('on', loop); };
$$('.spd').forEach(b => b.onclick = e => {
  $$('.spd').forEach(x=>x.classList.remove('on'));
  e.currentTarget.classList.add('on');
  speed = parseFloat(e.currentTarget.dataset.s);
});
/* 對外接口：見檔頭說明。 */
window.SuiSuiOnboardingDemo = {
  play(){
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(restart);
  },
  pause(){
    token.cancelled = true;
  },
};
})();
