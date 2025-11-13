/* =========================
   ELEMENTS
========================= */
const s1 = document.getElementById("scene1");
const s2 = document.getElementById("scene2");
const s3 = document.getElementById("scene3");
const s4 = document.getElementById("scene4");
const s5 = document.getElementById("scene5");
const s6 = document.getElementById("scene6");

const startBtn = document.getElementById("startBtn");
const actionBtn = document.getElementById("actionBtn");
const bunting  = document.getElementById("bunting");
const titleEl  = document.getElementById("bigTitle");
const flameGif = document.querySelector(".cake-flame");

const confettiCanvas  = document.getElementById("confetti");
const fireworksCanvas = document.getElementById("fireworks");

const balloonField = document.getElementById("balloonField");

// Scratch card elems (Scene 4)
const scratchWrap   = document.getElementById("scratchWrap");
const scratchCanvas = document.getElementById("scratchCanvas");
const scratchImg    = document.getElementById("scratchImg");
const scratchTip    = document.getElementById("scratchTip");

/* =========================
   HEART LOADER (scene1)
========================= */
(function heartLoader(canvas) {
  if (!canvas) return;
  const settings = { particles: { length: 8000, duration: 4, velocity: 90, effect: -1.35, size: 8 } };

  class Point { constructor(x=0,y=0){ this.x=x; this.y=y; } clone(){ return new Point(this.x,this.y); } length(len){ if(len===undefined) return Math.hypot(this.x,this.y); this.normalize(); this.x*=len; this.y*=len; return this; } normalize(){ const l=this.length(); if(!l) return this; this.x/=l; this.y/=l; return this; } }
  class Particle { constructor(){ this.position=new Point(); this.velocity=new Point(); this.acceleration=new Point(); this.age=0; }
    init(x,y,dx,dy){ this.position.x=x; this.position.y=y; this.velocity.x=dx; this.velocity.y=dy; this.acceleration.x=dx*settings.particles.effect; this.acceleration.y=dy*settings.particles.effect; this.age=0; }
    update(dt){ this.position.x+=this.velocity.x*dt; this.position.y+=this.velocity.y*dt; this.velocity.x+=this.acceleration.x*dt; this.velocity.y+=this.acceleration.y*dt; this.age+=dt; }
    draw(ctx,img){ const ease=t=>{t=t-1;return t*t*t+1}; const life=this.age/settings.particles.duration; const size=img.width*ease(1-life); ctx.globalAlpha=1-life; ctx.drawImage(img,this.position.x-size/2,this.position.y-size/2,size,size); ctx.globalAlpha=1; }
  }
  class Pool { constructor(n){ this.particles=new Array(n).fill(0).map(()=>new Particle()); this.firstActive=0; this.firstFree=0; this.duration=settings.particles.duration; }
    add(x,y,dx,dy){ const p=this.particles[this.firstFree]; p.init(x,y,dx,dy); this.firstFree=(this.firstFree+1)%this.particles.length; if(this.firstActive===this.firstFree){ this.firstActive=(this.firstActive+1)%this.particles.length; } }
    update(dt){ let i; if(this.firstActive<this.firstFree){ for(i=this.firstActive;i<this.firstFree;i++) this.particles[i].update(dt); } else { for(i=this.firstActive;i<this.particles.length;i++) this.particles[i].update(dt); for(i=0;i<this.firstFree;i++) this.particles[i].update(dt); } while(this.particles[this.firstActive].age>=this.duration && this.firstActive!==this.firstFree){ this.firstActive=(this.firstActive+1)%this.particles.length; } }
    draw(ctx,img){ let i; if(this.firstActive<this.firstFree){ for(i=this.firstActive;i<this.firstFree;i++) this.particles[i].draw(ctx,img); } else { for(i=this.firstActive;i<this.particles.length;i++) this.particles[i].draw(ctx,img); for(i=0;i<this.firstFree;i++) this.particles[i].draw(ctx,img); } }
  }

  const ctx = canvas.getContext("2d");
  function heart(t){
    return new Point(160*Math.pow(Math.sin(t),3),
      130*Math.cos(t)-50*Math.cos(2*t)-20*Math.cos(3*t)-10*Math.cos(4*t)+25);
  }
  function makeHeartSprite(size){
    const c=document.createElement("canvas"), x=c.getContext("2d"); c.width=size; c.height=size;
    function map(t){ const p=heart(t); return new Point(c.width/2+(p.x*c.width)/350, c.height/2-(p.y*c.height)/350); }
    x.beginPath(); let t=-Math.PI; let p=map(t); x.moveTo(p.x,p.y);
    while(t<Math.PI){ t+=0.01; p=map(t); x.lineTo(p.x,p.y); }
    x.closePath(); x.fillStyle="#ff2b2b"; x.fill();
    const img=new Image(); img.src=c.toDataURL(); return img;
  }

  const sprite = makeHeartSprite(settings.particles.size);
  const pool   = new Pool(settings.particles.length);

  function spawn(dt, rate){
    const amount = rate * dt;
    for(let i=0;i<amount;i++){
      const pos = heart(Math.PI - 2*Math.PI*Math.random());
      const dir = pos.clone().length(settings.particles.velocity);
      pool.add(canvas.width/2 + pos.x, canvas.height/2 - pos.y, dir.x, -dir.y);
    }
  }
  function resize(){ canvas.width = canvas.clientWidth || innerWidth; canvas.height = canvas.clientHeight || innerHeight; }
  // ---------- REPLACE: setupForSize() ----------
function setupForSize() {
  const cssW = Math.max(320, canvas.clientWidth || window.innerWidth);
  const cssH = Math.max(320, canvas.clientHeight || window.innerHeight);
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";

  const minSide = Math.min(cssW, cssH);
  const isPortrait = cssH > cssW;

  // 🎯 Adjust heart size (mobile smaller to prevent cropping)
  let frac;
  if (cssW >= 1100) {
    frac = 0.42; // desktop
  } else if (cssW >= 640) {
    frac = 0.28; // tablet
  } else {
    frac = 0.065; // ✅ smaller heart for mobile — fits perfectly!
  }

  const heartVisualPxBySide = Math.round(minSide * frac);
  const maxHeartWidth = Math.round(cssW * 0.75);
  const maxHeartHeight = Math.round(cssH * 0.6);
  const heartVisualPx = Math.min(heartVisualPxBySide, maxHeartWidth, maxHeartHeight);

  spawnScale = (heartVisualPx / 360) * dpr;

  const spritePx = Math.max(8, Math.round(18 * (minSide / 420) * (dpr >= 2 ? 1.4 : 1)));
  sprite = makeHeartSprite(spritePx);

  drawScale = Math.max(0.6, Math.min(1.05, minSide / 520));
  velocityMul = isPortrait ? 0.55 : 0.92;

  const shiftUp = isPortrait ? cssH * 0.08 : 0;
  heartCenterX = cssW / 2;
  heartCenterY = cssH / 2 - shiftUp;

  const baseCount = 8000;
  const area = cssW * cssH;
  let estimate = Math.floor((area / (420 * 420)) * baseCount);
  if (cssW < 640) estimate = Math.max(700, Math.min(1800, estimate));
  else if (cssW < 1100) estimate = Math.max(2000, Math.min(5200, estimate));
  else estimate = Math.max(5200, Math.min(baseCount, estimate));
  particleCount = estimate;

  pool = new Pool(particleCount);
}

// ---------- end setupForSize replacement ----------


  addEventListener("resize", resize); resize();

  let last = 0;
  function frame(time){
    requestAnimationFrame(frame);
    const now=time?time/1000:Date.now()/1000;
    const dt=last?now-last:0; last=now;
    const rate=settings.particles.length/settings.particles.duration;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    spawn(dt,rate); pool.update(dt); pool.draw(ctx, sprite);
  }
  requestAnimationFrame(frame);
})(document.getElementById("pinkboard"));

/* =========================
   CONFETTI / FIREWORKS + STOP
========================= */
let confettiRAF=null, confettiActive=false;
function launchConfetti(){
  const canvas = confettiCanvas, ctx = canvas.getContext("2d");
  function size(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  size(); addEventListener("resize", size);

  const pieces = Array.from({length:240},()=>(({
    x: Math.random()*canvas.width,
    y: -Math.random()*canvas.height,
    w: 6+Math.random()*6, h: 10+Math.random()*8,
    vx:(Math.random()-.5)*1.2, vy:2+Math.random()*3,
    rot:Math.random()*360, vr:(Math.random()-.5)*6,
    color:`hsl(${Math.random()*360},100%,70%)`
  })));

  confettiActive = true;
  (function draw(){
    if(!confettiActive) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of pieces){
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      if(p.y>canvas.height+20){ p.y=-20; p.x=Math.random()*canvas.width; }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*.6); ctx.restore();
    }
    confettiRAF = requestAnimationFrame(draw);
  })();
}
function stopConfetti(){
  confettiActive = false;
  if(confettiRAF){ cancelAnimationFrame(confettiRAF); confettiRAF=null; }
  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
}

let fireworksRAF=null;
function launchFireworks(){
  const canvas = fireworksCanvas, ctx = canvas.getContext("2d");
  let particles = [];
  function size(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  size(); addEventListener("resize", size);

  function burst(x,y){
    const count = 62 + Math.random()*28;
    for(let i=0;i<count;i++){
      const angle=(Math.PI*2*i)/count, speed=6+Math.random()*4;
      particles.push({x,y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, alpha:1, color:`hsl(${Math.random()*360},100%,65%)`, r:5+Math.random()*5});
    }
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{ ctx.save(); ctx.globalAlpha=p.alpha; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill(); ctx.restore(); });
  }
  function update(){
    particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vx*=.98; p.vy*=.98; p.vy+=.02; p.alpha-=.012+Math.random()*.008; });
    particles = particles.filter(p=>p.alpha>.02);
  }
  (function loop(){
    update(); draw();
    fireworksRAF = particles.length ? requestAnimationFrame(loop) : (ctx.clearRect(0,0,canvas.width,canvas.height), null);
  })();

  const cx=canvas.width/2, cy=canvas.height/2; let n=0;
  (function seq(){ if(n<4){ burst(cx,cy); n++; setTimeout(seq,400); }})();
}
function stopFireworks(){
  if(fireworksRAF){ cancelAnimationFrame(fireworksRAF); fireworksRAF=null; }
  const ctx = fireworksCanvas.getContext("2d");
  ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
}

/* =========================
   FLOW: Start → Loader → Cake
========================= */
startBtn?.addEventListener("click", () => {
  s2.classList.remove("active");
  s1.classList.add("active");
  setTimeout(() => {
    s1.classList.remove("active");
    s3.classList.add("active");
  }, 2500);
});

/* =========================
   CAKE: Decorate → Light → Balloons
========================= */
let step = 0;
actionBtn?.addEventListener("click", () => {
  if (step === 0) {
    if (bunting) bunting.style.opacity = "1";
    document.body.classList.add("decor-on");
    actionBtn.querySelector("span").textContent = "Light the Candle";
    step = 1;
  } else if (step === 1) {
    if (flameGif) flameGif.style.display = "block";
    titleEl.style.opacity = "1";
    titleEl.style.transform = "translateY(0)";
    launchConfetti();
    launchFireworks();
    actionBtn.querySelector("span").textContent = "More Surprises";
    step = 2;
  } else if (step === 2) {
    // Stop effects and open Scene 4
    stopConfetti();
    stopFireworks();

    s3.classList.remove("active");
    initBalloonsOnly();
    s4.classList.add("active");
  }
});

/* =========================
   SCENE 4: BALLOONS ONLY → SCRATCH
========================= */
function initBalloonsOnly(){
  if (!balloonField) return;
  if (scratchWrap) scratchWrap.hidden = true;
  if (scratchTip) { scratchTip.style.display = "none"; }

  let popped = 0;
  const balloons = balloonField.querySelectorAll(".balloon");
  const hint = balloonField.querySelector(".hint");

  if (hint) {
    hint.textContent = "Tap & pop all 5 balloons 🎈";
    hint.style.display = "block";
    hint.style.opacity = "1";
  }

  balloons.forEach(b=>{
    const x = 16 + Math.random()*68;
    const y = 16 + Math.random()*48;
    b.style.left = x + "%";
    b.style.top  = y + "%";
    b.classList.remove("pop");
    b.style.opacity = "1";
    b.style.pointerEvents = "auto";
    b.onclick = null;

    b.addEventListener("click", ()=>{
      b.classList.add("pop");
      b.style.pointerEvents = "none";
      popped++;
      if (popped === balloons.length){
        if (hint) {
          hint.style.transition = "opacity .35s ease";
          hint.style.opacity = "0";
          setTimeout(()=>{ hint.style.display = "none"; }, 360);
        }
        setTimeout(()=>{ showScratchCard("reveal.jpg"); }, 420);
      }
    }, { once:true });
  });
}

/* =========================
   SCRATCH CARD (full pixels) + HEART FIREWORKS → SCENE 5
========================= */
function showScratchCard(revealSrc){
  if (!scratchWrap || !scratchCanvas || !scratchImg) return;
  if (revealSrc) scratchImg.src = revealSrc;

  const setup = () => {
    const w = scratchImg.naturalWidth;
    const h = scratchImg.naturalHeight;

    const card = scratchImg.parentElement;
    card.style.width  = w + "px";
    card.style.height = h + "px";

    scratchWrap.hidden = false;

    if (scratchTip) {
      scratchTip.textContent = "Scratch here";
      scratchTip.style.display = "block";
      scratchTip.style.opacity = "1";
    }

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    scratchCanvas.width  = Math.floor(w * dpr);
    scratchCanvas.height = Math.floor(h * dpr);
    scratchCanvas.style.width  = w + "px";
    scratchCanvas.style.height = h + "px";

    const ctx = scratchCanvas.getContext("2d");
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0,0, w, h);
    grad.addColorStop(0, "#cfcfcf");
    grad.addColorStop(1, "#a6a6a6");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0, w, h);

    ctx.globalCompositeOperation = "destination-out";

    let scratching = false;
    let strokeCount = 0;

    function scratchAt(clientX, clientY){
      const r = scratchCanvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      const BRUSH = 26;
      ctx.beginPath();
      ctx.arc(x, y, BRUSH, 0, Math.PI*2);
      ctx.fill();
      if (++strokeCount % 8 === 0) estimateCleared();
    }

    function estimateCleared(){
      const step = 8;
      const data = ctx.getImageData(0, 0, w, h).data;
      let cleared = 0, total = 0;
      for (let yy=0; yy<h; yy+=step){
        for (let xx=0; xx<w; xx+=step){
          const idx = ((yy*w + xx) << 2) + 3;
          if (data[idx] === 0) cleared++;
          total++;
        }
      }
      if (cleared / total > 0.5) revealFully();
    }

    function removeScratchListeners(){
      scratchCanvas.removeEventListener("pointerdown", onDown);
      scratchCanvas.removeEventListener("pointermove", onMove);
      scratchCanvas.removeEventListener("pointerup", onUp);
      scratchCanvas.removeEventListener("pointerleave", onUp);
      scratchCanvas.removeEventListener("touchstart", onDown);
      scratchCanvas.removeEventListener("touchmove", onMove);
      scratchCanvas.removeEventListener("touchend", onUp);
    }

    function revealFully(){
      scratchCanvas.style.transition = "opacity .4s ease";
      scratchCanvas.style.opacity = "0";
      removeScratchListeners();
      setTimeout(()=>{
        if (scratchCanvas && scratchCanvas.parentNode)
          scratchCanvas.parentNode.removeChild(scratchCanvas);
        setTimeout(()=>{ launchHeartFireworksThenScene5(6000); }, 80);
      }, 420);
    }

    const onDown = (e)=>{
      scratching = true;
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x != null && y != null) scratchAt(x, y);
      e.preventDefault?.();
    };
    const onMove = (e)=>{
      if(!scratching) return;
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x != null && y != null) scratchAt(x, y);
      e.preventDefault?.();
    };
    const onUp = ()=>{ scratching = false; };

    scratchCanvas.addEventListener("pointerdown", onDown);
    scratchCanvas.addEventListener("pointermove", onMove);
    scratchCanvas.addEventListener("pointerup", onUp);
    scratchCanvas.addEventListener("pointerleave", onUp);
    scratchCanvas.addEventListener("touchstart", onDown, {passive:false});
    scratchCanvas.addEventListener("touchmove", onMove, {passive:false});
    scratchCanvas.addEventListener("touchend", onUp);
  };

  if (scratchImg.complete && scratchImg.naturalWidth) setup();
  else scratchImg.onload = setup;
}

/* =========================
   HEART FIREWORKS → SHOW SCENE 5
========================= */
function launchHeartFireworksThenScene5(durationMs = 6000){
  const cv  = document.getElementById("fireworks");
  if(!cv) return;
  const ctx = cv.getContext("2d");

  if (typeof stopConfetti === "function") stopConfetti();
  if (typeof stopFireworks === "function") stopFireworks();

  cv.style.display = "block";
  cv.style.pointerEvents = "none";
  cv.style.position = "fixed";
  cv.style.inset = "0";
  cv.style.zIndex = "1500";
  cv.width = innerWidth; cv.height = innerHeight;

  const cx = cv.width/2, cy = cv.height/2;
  const easeOutCubic = p => 1 - Math.pow(1 - p, 3);
  const heartPoint = (t, s)=>{
    const x = 16*Math.pow(Math.sin(t),3);
    const y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    return { x: cx + s*x, y: cy - s*y };
  };

  let particles = [], raf = null, last = performance.now();

  function burst(){
    const count = 220, scale = Math.min(cv.width, cv.height)*0.9/40;
    for(let i=0;i<count;i++){
      const t = Math.random()*Math.PI*2;
      const target = heartPoint(t, scale);
      particles.push({
        x: cx, y: cy, tx: target.x, ty: target.y,
        life: 0, dur: 900 + Math.random()*500,
        r: 2 + Math.random()*2,
        hue: (i*360/count + Math.random()*30)%360
      });
    }
  }

  function frame(now){
    const dt = Math.min(40, now-last); last = now;
    ctx.clearRect(0,0,cv.width,cv.height);
    particles = particles.filter(p=>p.life<p.dur);
    for(const p of particles){
      p.life += dt;
      const k = easeOutCubic(Math.min(1, p.life/p.dur));
      const x = p.x + (p.tx-p.x)*k;
      const y = p.y + (p.ty-p.y)*k;
      ctx.globalAlpha = 1 - k*0.7;
      ctx.fillStyle = `hsl(${p.hue},100%,65%)`;
      ctx.beginPath(); ctx.arc(x,y,p.r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  burst();
  raf = requestAnimationFrame(frame);
  const b1 = setTimeout(burst, 900);
  const b2 = setTimeout(burst, 1800);

  setTimeout(()=>{
    clearTimeout(b1); clearTimeout(b2);
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0,0,cv.width,cv.height);

    if (s4) s4.classList.remove("active");
    if (s5) s5.classList.add("active");

    cv.style.display = "none";
  }, durationMs);
}

/* =========================
   BUNTING ALIGNMENT HELPERS (exposed API)
========================= */
(function setupBuntingAlignment() {
  const buntingEl = document.getElementById('bunting');
  if (!buntingEl) return;

  function debounce(fn, wait = 100){
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  }

  function alignBuntingToStage(stageEl, options = {}) {
    if (!stageEl || !buntingEl) return;
    buntingEl.classList.add('region');
    buntingEl.classList.add('visible');

    const rect = stageEl.getBoundingClientRect();
    const offsetPx = (options.offsetPx ?? 18);
    const topPos = Math.max(6, rect.top - offsetPx);

    buntingEl.style.left = Math.round(rect.left) + 'px';
    buntingEl.style.width = Math.round(rect.width) + 'px';
    buntingEl.style.top = Math.round(topPos) + 'px';

    if (window.innerWidth < 420) buntingEl.classList.add('safe-top');
    else buntingEl.classList.remove('safe-top');
  }

  function resetBuntingToFullWidth() {
    if (!buntingEl) return;
    buntingEl.classList.remove('region', 'safe-top');
    buntingEl.style.left = '';
    buntingEl.style.width = '';
    buntingEl.style.top = '';
  }

  window.__alignBuntingToStage = alignBuntingToStage;
  window.__resetBuntingToFullWidth = resetBuntingToFullWidth;

  const onResize = debounce(() => {
    const activeRegion = document.querySelector('.bunting.region');
    if (activeRegion) {
      const stageEl = document.querySelector('#scene6 .stage') ||
                      document.querySelector('#scene5 .stage') ||
                      document.querySelector('.stage');
      if (stageEl) alignBuntingToStage(stageEl);
    }
  }, 120);

  window.addEventListener('resize', onResize);
})();

/* =========================
   SCENE 5: BOOK OPEN + SCROLLABLE MESSAGE + NEXT
========================= */
(function initBookOpen(){
  const book   = document.getElementById("bookCard");
  const cover  = document.getElementById("bookCover");
  const bodyEl = document.getElementById("bookMessage");
  const imgEl  = document.querySelector("#bookCover .cover-img");
  const nextBtn= document.getElementById("nextBtn");
  if(!book || !cover || !bodyEl) return;

  function setMessageMaxHeight(){
    const cap = Math.max(220, Math.floor(window.innerHeight * 0.5));
    bodyEl.style.maxHeight = cap + "px";
  }

  const openBook = ()=>{
    if (!book.classList.contains("open")){
      book.classList.add("open");
      cover.style.pointerEvents = "none";
      setMessageMaxHeight();
      if (nextBtn) nextBtn.style.display = "inline-flex";
    }
  };

  cover.addEventListener("click", openBook);
  cover.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openBook(); }});

  window.addEventListener("resize", ()=>{ if(book.classList.contains("open")) setMessageMaxHeight(); });

  if (imgEl && !imgEl.complete){
    imgEl.addEventListener("load", ()=>{ if(book.classList.contains("open")) setMessageMaxHeight(); });
  }

  // NEXT button → Scene 6
  nextBtn?.addEventListener("click", ()=>{
    s5.classList.remove("active");
    s6.classList.add("active");

    // hide action button only in Scene 6
    if (actionBtn) actionBtn.style.display = "none";

    // align & show bunting over scene6 stage
    const stageEl = document.querySelector('#scene6 .stage') || document.querySelector('#scene6');
    if (stageEl && typeof window.__alignBuntingToStage === 'function') {
      window.__alignBuntingToStage(stageEl, { offsetPx: 18 });
    }
  });
})();

/* =========================
   SCENE 6: gift -> show cake + flame + countdown -> blow -> popup
========================= */
function createPopup({ title = "", body = "", buttons = [] }) {
  // simple modal popup appended to body
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:3000; background: rgba(0,0,0,0.45);";
  const box = document.createElement("div");
  box.style.cssText = "width: min(520px, 92vw); max-width:520px; background:#1a0f1f; border-radius:12px; padding:18px; box-shadow:0 20px 80px rgba(0,0,0,0.6); color:#fff; text-align:center;";
  if (title) { const h = document.createElement("h3"); h.textContent = title; h.style.margin = "0 0 8px"; h.style.fontSize = "20px"; box.appendChild(h); }
  if (body)  { const p = document.createElement("p"); p.innerHTML = body; p.style.margin = "0 0 14px"; p.style.color = "#e8dbf1"; box.appendChild(p); }

  const btnWrap = document.createElement("div");
  btnWrap.style.cssText = "display:flex; gap:10px; justify-content:center; margin-top:6px;";
  buttons.forEach(b=>{
    const el = document.createElement("button");
    el.textContent = b.label;
    el.style.cssText = "padding:10px 14px; border-radius:999px; border:0; cursor:pointer; font-weight:700; background:linear-gradient(90deg,#ff78c6,#ff3d9b); color:#fff;";
    el.addEventListener("click", ()=>{ try{ b.onClick(); } catch(e){} document.body.removeChild(wrap); });
    btnWrap.appendChild(el);
  });
  box.appendChild(btnWrap);
  wrap.appendChild(box);
  document.body.appendChild(wrap);
  return wrap;
}

function initScene6GiftFlow(){
  const btn = document.getElementById('giftBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Move from Scene 6 -> Scene 3 (cake)
    if (s6) s6.classList.remove('active');
    if (s3) s3.classList.add('active');

    // ensure bunting full-width restored for cake scene, then show normal decor
    if (typeof window.__resetBuntingToFullWidth === 'function') window.__resetBuntingToFullWidth();
    if (bunting) bunting.style.opacity = '1';
    document.body.classList.add('decor-on');

    // Show title and flame
    if (titleEl) { titleEl.style.opacity = '1'; titleEl.style.transform = 'translateY(0)'; }
    if (flameGif) { flameGif.style.opacity = '0'; flameGif.style.display = 'block'; }

    // fade-in the flame
    setTimeout(() => {
      if (flameGif) {
        flameGif.style.transition = 'opacity .35s ease';
        flameGif.style.opacity = '1';
      }

      // After flame is visible, begin countdown (3..2..1)
      setTimeout(()=>{
        startBlowCountdown(3, () => {
          // When countdown completes: blow (fade out) the flame
          if (flameGif) {
            flameGif.style.transition = 'opacity .35s ease';
            flameGif.style.opacity = '0';
            setTimeout(()=>{ if (flameGif) flameGif.style.display = 'none'; }, 360);
          }

          // After 3 seconds of candle blown show popup message
          setTimeout(()=>{
            createPopup({
              title: "Once again, Happy Birthday Shonnu 🎉",
              body: "More surprises on the way — want to replay or continue?",
              buttons: [
                {
                  label: "Replay",
                  onClick: ()=> {
                    // restart from the top (scene2 -> press start to continue)
                    resetToStart();
                  }
                },
                {
                  label: "Close",
                  onClick: ()=> {
                    // just close popup - leave them on cake scene
                    // (no automatic navigation)
                  }
                }
              ]
            });
          }, 3000);
        });
      }, 400);
    }, 500);
  }, { once: true });
}

/* Create a fullscreen overlay countdown 3..2..1 then call done() */
function startBlowCountdown(from = 3, done = () => {}) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:2000; pointer-events:none;
    display:grid; place-items:center; background:transparent;
  `;
  const num = document.createElement('div');
  num.style.cssText = `
    font-family: Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif;
    font-weight:1000; color:#ffffff; text-shadow:0 10px 40px #0008;
    font-size: min(22vmin, 160px);
    transform: scale(1); opacity: 0;
    transition: opacity .2s ease, transform .2s ease;
  `;
  const text = document.createElement('div');
  text.textContent = "Blow the Candle 🎂";
  text.style.cssText = `
    margin-top:12px;
    font-weight:700;
    color:#ff;            /* ← change colour here if you want */
    font-size:clamp(22px,5vw,32px);
    text-shadow:0 6px 20px #0008;
  `;
  overlay.appendChild(num);
  overlay.appendChild(text);
  document.body.appendChild(overlay);

  let current = from;

  const tick = () => {
    if (current === 0) {
      document.body.removeChild(overlay);
      done();
      return;
    }
    num.textContent = String(current);
    requestAnimationFrame(() => {
      num.style.opacity = '1';
      num.style.transform = 'scale(1.08)';
      setTimeout(() => {
        num.style.opacity = '0';
        num.style.transform = 'scale(0.9)';
      }, 550);
    });
    current -= 1;
    setTimeout(tick, 1000);
  };

  tick();
}

/* =========================
   Reset / Replay helper
========================= */
function restartFromBeginning() {
  // remove all active scenes and reset state
  [s1, s2, s3, s4, s5, s6].forEach(sc => sc?.classList.remove("active"));

  // reset visuals / UI state
  if (flameGif) {
    flameGif.style.display = "none";
    flameGif.style.opacity = "0";
  }
  if (titleEl) {
    titleEl.style.opacity = "0";
    titleEl.style.transform = "translateY(-6px)";
  }
  if (bunting) {
    bunting.style.opacity = "0";
    bunting.classList.remove("visible");
  }

  document.body.classList.remove("decor-on");

  // Reset other interactive elements:
  // - put balloons back to initial state if present
  if (balloonField) {
    const balloons = balloonField.querySelectorAll(".balloon");
    balloons.forEach(b => {
      b.classList.remove("pop");
      b.style.opacity = "1";
      b.style.pointerEvents = "auto";
    });
    const hint = balloonField.querySelector(".hint");
    if (hint) { hint.style.display = "block"; hint.style.opacity = "1"; }
  }

  // Reset step for action button (so it shows "Decorate" again)
  step = 0;
  if (actionBtn) {
    const span = actionBtn.querySelector("span");
    if (span) span.textContent = "Decorate";
  }

  // Now show the loader (Scene 1) briefly, then go to cake (Scene 3)
  // This exactly mirrors what the Start button originally did.
  // Small delay to allow DOM changes to settle
  setTimeout(() => {
    // show heart loader scene
    if (s2) s2.classList.remove("active"); // hide intro
    if (s1) s1.classList.add("active");

    // after same loader duration as original flow, swap to cake scene
    setTimeout(() => {
      if (s1) s1.classList.remove("active");
      if (s3) s3.classList.add("active");
      // ensure cake scene visuals are in initial state
      if (bunting) { bunting.style.opacity = "0"; }
      if (titleEl) { titleEl.style.opacity = "0"; titleEl.style.transform = "translateY(-6px)"; }
      if (flameGif) { flameGif.style.display = "none"; flameGif.style.opacity = "0"; }
    }, 2500); // same 2.5s loader time used elsewhere
  }, 120);
}

/* =========================
   Hook scene 6 gift flow + init
========================= */
initScene6GiftFlow();
/* ---------- Replay Button → Restart from beginning ---------- */
(function initReplayButton(){
  const replayBtn = document.getElementById("replayBtn");
  if(!replayBtn) return;

  replayBtn.addEventListener("click", () => {
    // Hide all scenes
    [s1, s2, s3, s4, s5, s6].forEach(sc => sc?.classList.remove("active"));

    // Reset cake flame and decorations
    if (flameGif) {
      flameGif.style.display = "none";
      flameGif.style.opacity = "0";
    }
    if (bunting) bunting.style.opacity = "0";
    document.body.classList.remove("decor-on");

    // Reset scene variables if any
    step = 0;

    // Show intro again
    s2.classList.add("active");

    // Optional: smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


// ---------- APPLY MOVING HEART GRID TO ALL SCENES (no changes to original HTML/CSS) ----------
(function enableMovingHeartGridOnAllScenes(){
  // Wait for DOM ready (script is deferred in your page, so this runs safely)
  const scenes = document.querySelectorAll('.scene');
  if(!scenes || !scenes.length) return;
  scenes.forEach(s => {
    // add the pre-existing hearts-bg class and a small helper class for animation
    s.classList.add('hearts-bg', 'moving-hearts');
  });

  // If scenes are added/removed dynamically later, keep them decorated
  const obs = new MutationObserver(() => {
    document.querySelectorAll('.scene').forEach(s => s.classList.add('hearts-bg','moving-hearts'));
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();

/* =========================
   SIMPLE REPLAY — JUMP TO BEGINNING
   ========================= */
function resetToStart() {
  // Instantly reloads the page so everything begins fresh
  window.location.reload();
}
/* =========================
   RELIABLE bgMusic PLAY (append-only)
   Paste at the end of script.js
   ========================= */
(function reliableBgMusic() {
  // ensure audio element exists (create if missing)
  let music = document.getElementById('bgMusic');
  if (!music) {
    music = document.createElement('audio');
    music.id = 'bgMusic';
    // change this to your file if needed; use absolute or correct relative path
    music.src = 'birthday-song.mp3';
    music.preload = 'auto';
    music.loop = true;
    document.body.appendChild(music);
  }

  // ensure basic settings
  music.loop = true;
  music.preload = 'auto';
  music.volume = (typeof music.volume === 'number') ? music.volume : 1;

  let attempted = false;   // to avoid repeated tries
  let started = false;     // true when music actually plays

  function showEnableButton() {
    if (document.getElementById('__enableAudioBtn')) return;
    const btn = document.createElement('button');
    btn.id = '__enableAudioBtn';
    btn.textContent = 'Enable audio';
    btn.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;padding:10px 14px;border-radius:10px;border:0;background:linear-gradient(90deg,#ff78c6,#ff3d9b);color:#fff;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    btn.addEventListener('click', async () => {
      try {
        await music.play();
        started = true;
        btn.remove();
        console.log('[bgMusic] playing after user clicked enable button');
      } catch (e) {
        console.error('[bgMusic] play failed from enable button', e);
        btn.textContent = 'Play failed';
      }
    });
    document.body.appendChild(btn);
  }

  // Try to play (returns promise or throws)
  async function tryPlay() {
    if (started) return true;
    try {
      attempted = true;
      music.currentTime = 0;
      const p = music.play();
      if (p && typeof p.then === 'function') {
        await p;
      }
      started = true;
      console.log('[bgMusic] play() succeeded');
      // remove fallback enable button if present
      const b = document.getElementById('__enableAudioBtn');
      if (b) b.remove();
      // remove global one-time document listener (if attached)
      if (document.__bgMusicClickListener) {
        document.removeEventListener('click', document.__bgMusicClickListener, true);
        document.__bgMusicClickListener = null;
      }
      return true;
    } catch (err) {
      console.warn('[bgMusic] play() rejected:', err);
      showEnableButton();
      // attach a one-time capture click on document to use any user interaction to try again
      if (!document.__bgMusicClickListener) {
        document.__bgMusicClickListener = async function docClickOnce(e) {
          try {
            await music.play();
            started = true;
            console.log('[bgMusic] played via fallback document click');
            const btn = document.getElementById('__enableAudioBtn'); if (btn) btn.remove();
          } catch (e2) {
            console.warn('[bgMusic] fallback document click play failed', e2);
          } finally {
            document.removeEventListener('click', document.__bgMusicClickListener, true);
            document.__bgMusicClickListener = null;
          }
        };
        // capture phase so clicks on any element counts
        document.addEventListener('click', document.__bgMusicClickListener, true);
      }
      return false;
    }
  }

  // Primary trigger: Decorate button click — attempt to play using that user gesture
  if (typeof actionBtn !== 'undefined' && actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (!attempted) tryPlay();
    }, { passive: true });
  } else {
    // fallback: try play on any first user click if actionBtn isn't present
    document.addEventListener('click', function onAnyClickForPlay() {
      if (!attempted) tryPlay();
      document.removeEventListener('click', onAnyClickForPlay);
    }, { passive: true, capture: true });
  }

  // If audio fails to load due to bad path, show enable button and console hint
  music.addEventListener('error', (e) => {
    console.error('[bgMusic] audio load error; check src path and server (network/CORS).', e);
    showEnableButton();
  });

  music.addEventListener('canplaythrough', () => {
    console.log('[bgMusic] canplaythrough — file loaded and ready');
  });

  // Expose a stop helper used by resetToStart / restart functions
  function stopAndResetMusic() {
    try { music.pause(); music.currentTime = 0; started = false; attempted = false; } catch (e) {}
    // remove enable button if present
    const b = document.getElementById('__enableAudioBtn'); if (b) b.remove();
    if (document.__bgMusicClickListener) {
      document.removeEventListener('click', document.__bgMusicClickListener, true);
      document.__bgMusicClickListener = null;
    }
  }
  window.__stopBgMusic = stopAndResetMusic;

  // Patch resetToStart / restartFromBeginning if they exist to also stop audio
  if (typeof window.resetToStart === 'function' && !window.resetToStart.__bgPatched) {
    const orig = window.resetToStart;
    window.resetToStart = function(...args) {
      stopAndResetMusic();
      return orig.apply(this, args);
    };
    window.resetToStart.__bgPatched = true;
  }
  if (typeof window.restartFromBeginning === 'function' && !window.restartFromBeginning.__bgPatched) {
    const orig2 = window.restartFromBeginning;
    window.restartFromBeginning = function(...args) {
      stopAndResetMusic();
      return orig2.apply(this, args);
    };
    window.restartFromBeginning.__bgPatched = true;
  }

  // debug log
  console.log('[bgMusic] initialized — src=', music.currentSrc || music.src, 'readyState=', music.readyState);
})();
