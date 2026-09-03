(function(){
  function init(){
    if(document.querySelector('.table-hero')) return;
    const map=document.querySelector('#map.map-section');
    if(!map) return;

    const hero=document.createElement('section');
    hero.className='table-hero'; hero.id='home';
    hero.innerHTML=`
      <div class="hero-kicker">A living archive / India</div>
      <h1 class="hero-title">The Great<br><em>Indian</em> Table</h1>
      <p class="hero-subtitle">Everyday India, seen through the tables, desks and workspaces where people make a living.</p>
      <div class="hero-table-scene" aria-hidden="true">
        <div class="wood-table"><div class="wood-top"></div><div class="wood-leg one"></div><div class="wood-leg two"></div></div>
        <div class="table-object object-cup"></div><div class="table-object object-notebook"></div><div class="table-object object-pen"></div>
      </div>
      <div class="hero-side-note left">Tables / Desks / Workspaces</div>
      <div class="hero-side-note right">Scroll to travel across India ↓</div>
      <div class="hero-scroll-word">INDIA</div>`;
    map.parentNode.insertBefore(hero,map);

    document.querySelectorAll('a[href="#map"]').forEach(a=>{if((a.textContent||'').trim().toLowerCase()==='home')a.href='#home'});

    const scene=hero.querySelector('.hero-table-scene');
    let raf=false;
    function parallax(){
      raf=false; const r=hero.getBoundingClientRect(); const p=Math.max(0,Math.min(1,-r.top/Math.max(1,innerHeight*.9))); hero.style.setProperty('--hero-p',p.toFixed(3));
    }
    addEventListener('scroll',()=>{if(!raf){raf=true;requestAnimationFrame(parallax)}},{passive:true});
    addEventListener('pointermove',e=>{if(!scene)return;const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;scene.style.transform=`translate(-50%,-50%) translate3d(0,calc(var(--hero-p,0)*-9vh),0) rotateX(${y*2.2}deg) rotateY(${x*3.5}deg)`},{passive:true});
    parallax();

    initStories();
  }

  function initStories(){
    const stage=document.querySelector('.stories-stage'); const grid=document.getElementById('stories-grid');
    if(!stage||!grid) return;
    const cards=Array.from(grid.querySelectorAll('.table-card'));
    if(!cards.length) return;
    const old=document.querySelector('.story-counter'); if(old) old.remove();
    stage.classList.remove('immersive'); stage.classList.add('has-navigation');
    cards.forEach(c=>{c.style.cssText='';c.classList.remove('is-selected')});

    const nav=document.createElement('aside'); nav.className='story-navigation'; nav.setAttribute('aria-label','Choose a story');
    cards.forEach((card,i)=>{
      const name=(card.querySelector('h3')?.textContent||card.querySelector('.table-card-copy strong')?.textContent||`Story ${i+1}`).trim();
      const city=(card.querySelector('p')?.textContent||'').split('·')[0].trim();
      const b=document.createElement('button'); b.type='button'; b.className='story-nav-item'; b.innerHTML=`<span class="num">${String(i+1).padStart(2,'0')}</span><span class="label">${escapeHtml(name)}<span class="city">${escapeHtml(city)}</span></span>`;
      b.addEventListener('click',()=>{card.scrollIntoView({behavior:'smooth',block:'center'}); select(i,true)}); nav.appendChild(b);
    });
    stage.insertBefore(nav,grid);
    const buttons=Array.from(nav.querySelectorAll('.story-nav-item'));
    function select(i,focus){buttons.forEach((b,j)=>b.classList.toggle('is-active',i===j));cards.forEach((c,j)=>c.classList.toggle('is-selected',i===j));if(focus)buttons[i]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)select(cards.indexOf(e.target),false)}),{rootMargin:'-42% 0px -42% 0px',threshold:0}); cards.forEach(c=>io.observe(c)); select(0,false);
    addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;const active=buttons.findIndex(b=>b.classList.contains('is-active'));if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();cards[Math.min(cards.length-1,active+1)].scrollIntoView({behavior:'smooth',block:'center'})}if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();cards[Math.max(0,active-1)].scrollIntoView({behavior:'smooth',block:'center'})}});
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
