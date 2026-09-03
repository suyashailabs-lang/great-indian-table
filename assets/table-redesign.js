(function(){
  function init(){
    // The table landing experiment is intentionally removed. The original map remains the home/landing view.
    document.querySelectorAll('.table-hero').forEach(function(el){ el.remove(); });
    initStoriesThread();
  }

  function initStoriesThread(){
    var stage=document.querySelector('.stories-stage');
    var grid=document.getElementById('stories-grid');
    if(!stage || !grid) return;

    var cards=Array.prototype.slice.call(grid.querySelectorAll('.table-card'));
    if(!cards.length) return;
    if(stage.dataset.threadReady==='1') return;
    stage.dataset.threadReady='1';

    stage.classList.remove('immersive','vertical-stories','has-navigation');
    stage.classList.add('thread-stories');

    var old=stage.querySelector('.story-navigation');
    if(old) old.remove();
    var oldCounter=stage.querySelector('.story-counter');
    if(oldCounter) oldCounter.remove();

    var thread=document.createElement('div');
    thread.className='story-thread';
    thread.setAttribute('aria-hidden','true');
    thread.innerHTML='<div class="story-thread-line"><span class="story-thread-progress"></span></div>';

    var knots=document.createElement('div');
    knots.className='story-knots';

    cards.forEach(function(card,i){
      var name=(card.querySelector('h3') ? card.querySelector('h3').textContent : 'Story '+(i+1)).trim();
      var city=(card.querySelector('p') ? card.querySelector('p').textContent : '').trim();
      var knot=document.createElement('button');
      knot.type='button';
      knot.className='story-knot';
      knot.setAttribute('aria-label','Go to story '+(i+1)+': '+name);
      knot.innerHTML='<span class="knot-number">'+String(i+1).padStart(2,'0')+'</span>';
      knot.addEventListener('click',function(){
        card.scrollIntoView({behavior:'smooth',block:'center'});
      });
      knots.appendChild(knot);
      card.dataset.storyIndex=i;
      card.dataset.storyName=name;
      card.dataset.storyCity=city;
      card.classList.add(i%2===0?'thread-left':'thread-right');
    });

    thread.appendChild(knots);
    stage.insertBefore(thread,grid);

    var buttons=Array.prototype.slice.call(knots.querySelectorAll('.story-knot'));
    var progress=thread.querySelector('.story-thread-progress');

    function select(index){
      if(index<0 || index>=cards.length) return;
      cards.forEach(function(card,j){ card.classList.toggle('is-lit',j===index); });
      buttons.forEach(function(button,j){
        button.classList.toggle('is-active',j===index);
      });
      if(progress){
        var ratio=cards.length===1 ? 1 : index/(cards.length-1);
        progress.style.height=(ratio*100)+'%';
      }
      stage.style.setProperty('--active-story',index);
    }

    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ select(Number(entry.target.dataset.storyIndex)||0); }
      });
    },{root:null,rootMargin:'-42% 0px -42% 0px',threshold:0});
    cards.forEach(function(card){ observer.observe(card); });
    select(0);

    // Keep the story sequence easy to travel with the keyboard too.
    window.addEventListener('keydown',function(e){
      if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var active=buttons.findIndex(function(b){return b.classList.contains('is-active');});
      if(e.key==='ArrowDown' || e.key==='j'){
        e.preventDefault();
        cards[Math.min(cards.length-1,active+1)].scrollIntoView({behavior:'smooth',block:'center'});
      }else if(e.key==='ArrowUp' || e.key==='k'){
        e.preventDefault();
        cards[Math.max(0,active-1)].scrollIntoView({behavior:'smooth',block:'center'});
      }
    },{passive:false});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
