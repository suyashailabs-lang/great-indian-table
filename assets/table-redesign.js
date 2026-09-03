(function(){
  function init(){
    document.querySelectorAll('.table-hero').forEach(function(el){el.remove();});
    fixCopy();
    initStoriesThread();
    initChapterLabels();
  }

  function fixCopy(){
    var hero=document.querySelector('#map h1');
    if(hero)hero.innerHTML='Every table tells a <em>tale.</em>';
  }

  function initChapterLabels(){
    var explore=document.querySelector('#explore .section-heading');
    var gallery=document.querySelector('#gallery .section-heading');
    var contribute=document.querySelector('#contribute .section-heading');
    if(explore){
      var p=explore.querySelector('p');
      if(p)p.innerHTML='Follow the thread from one working table to the next. Each knot marks a person, a place, and a life at work.';
    }
    if(gallery){
      var p2=gallery.querySelector('p');
      if(p2)p2.innerHTML='A growing visual archive of the objects, surfaces, tools and small details that make each table theirs.';
    }
    if(contribute){
      var p3=contribute.querySelector('p');
      if(p3)p3.innerHTML='The thread is still being woven. Add your table and become part of the story.';
    }
  }

  function initStoriesThread(){
    var stage=document.querySelector('.stories-stage');
    var grid=document.getElementById('stories-grid');
    if(!stage||!grid)return;
    var cards=Array.prototype.slice.call(grid.querySelectorAll('.table-card'));
    if(!cards.length||stage.dataset.threadReady==='1')return;
    stage.dataset.threadReady='1';
    stage.classList.remove('immersive','vertical-stories','has-navigation');
    stage.classList.add('thread-stories');

    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('thread-rope-svg');
    svg.setAttribute('aria-hidden','true');
    svg.innerHTML='<defs>'+
      '<linearGradient id="rope-knot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0aa78"/><stop offset=".38" stop-color="#ad6b40"/><stop offset="1" stop-color="#6c3b20"/></linearGradient>'+
      '<linearGradient id="rope-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#714020"/><stop offset=".25" stop-color="#b87849"/><stop offset=".5" stop-color="#d39a67"/><stop offset=".72" stop-color="#9a5d34"/><stop offset="1" stop-color="#6f3c20"/></linearGradient>'+
      '<filter id="rope-texture" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.15"/><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-opacity=".22"/></filter>'+
      '<filter id="rope-shadow" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="3.2"/><feOffset dy="5"/><feComponentTransfer><feFuncA type="linear" slope=".48"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
      '<filter id="rope-knot-shadow" x="-150%" y="-150%" width="400%" height="400%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-opacity=".32"/></filter>'+
      '<filter id="rope-knot-active" x="-150%" y="-150%" width="400%" height="400%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#b95537" flood-opacity=".42"/></filter>'+
      '</defs><path class="thread-rope-shadow"></path><path class="thread-rope-body"></path><path class="thread-rope-mid"></path><path class="thread-rope-light"></path>';
    stage.insertBefore(svg,grid);

    var knots=[];
    cards.forEach(function(card,i){
      card.dataset.storyIndex=i;
      card.classList.add(i%2===0?'thread-left':'thread-right');
      card.setAttribute('aria-label','Story '+String(i+1).padStart(2,'0')+': '+(card.querySelector('h3')?card.querySelector('h3').textContent.trim():''));
      var knot=document.createElement('button');
      knot.type='button';
      knot.className='story-knot-access';
      knot.setAttribute('aria-label','Go to story '+(i+1));
      knot.textContent=String(i+1).padStart(2,'0');
      knot.style.cssText='position:absolute;opacity:0;pointer-events:auto;width:50px;height:50px;border:0;background:transparent;cursor:pointer;z-index:6;';
      knot.addEventListener('click',function(){card.scrollIntoView({behavior:'smooth',block:'center'});});
      stage.appendChild(knot);
      knots.push(knot);
    });

    function layoutRope(){
      var w=stage.clientWidth,h=stage.scrollHeight||stage.clientHeight;
      svg.setAttribute('viewBox','0 0 '+Math.max(w,1)+' '+Math.max(h,1));
      svg.setAttribute('height',Math.max(h,1));
      var center=w/2;
      var points=cards.map(function(card){return {x:center,y:card.offsetTop+card.offsetHeight/2};});
      if(!points.length)return;

      var d='M '+center+' '+Math.max(10,points[0].y-180);
      points.forEach(function(p,i){
        var prev=i?points[i-1]:{x:center,y:p.y-180};
        var swayPattern=[-1,1,.65,-.85,.45,-.6,1,-.4];
        var sway=swayPattern[i%swayPattern.length]*Math.min(120,w*.105);
        var tension=50+(i%3)*18;
        d+=' C '+(center+sway)+' '+(prev.y+tension)+' '+(center-sway*.72)+' '+(p.y-tension)+' '+p.x+' '+p.y;
        knots[i].style.left=(center-25)+'px';
        knots[i].style.top=(p.y-25)+'px';
      });
      var last=points[points.length-1];
      d+=' C '+(center-105)+' '+(last.y+80)+' '+(center+95)+' '+(last.y+145)+' '+center+' '+(last.y+210);

      svg.querySelector('.thread-rope-shadow').setAttribute('d',d);
      svg.querySelector('.thread-rope-body').setAttribute('d',d);
      svg.querySelector('.thread-rope-mid').setAttribute('d',d);
      svg.querySelector('.thread-rope-light').setAttribute('d',d);

      Array.prototype.slice.call(svg.querySelectorAll('.thread-rope-knot-group')).forEach(function(el){el.remove();});
      points.forEach(function(p,i){
        var g=document.createElementNS('http://www.w3.org/2000/svg','g');
        g.setAttribute('class','thread-rope-knot-group');
        g.dataset.index=i;
        var loop=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        loop.setAttribute('cx',p.x);loop.setAttribute('cy',p.y);loop.setAttribute('rx','23');loop.setAttribute('ry','15');
        loop.setAttribute('transform','rotate('+(i%2?22:-18)+' '+p.x+' '+p.y+')');
        loop.setAttribute('class','thread-rope-knot-loop');
        var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r','14');c.setAttribute('class','thread-rope-knot');c.dataset.index=i;
        var core=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        core.setAttribute('cx',p.x-2);core.setAttribute('cy',p.y-3);core.setAttribute('rx','7');core.setAttribute('ry','4');
        core.setAttribute('transform','rotate(-18 '+p.x+' '+p.y+')');core.setAttribute('class','thread-rope-knot-core');
        g.appendChild(loop);g.appendChild(c);g.appendChild(core);svg.appendChild(g);
      });
    }

    function updatePerspective(){
      if(window.innerWidth<=800)return;
      var rect=stage.getBoundingClientRect();
      var viewport=window.innerHeight;
      var progress=Math.max(0,Math.min(1,(viewport-rect.top)/(viewport+Math.max(1,rect.height))));
      var scale=(1.035-(progress*.045)).toFixed(3);
      var tilt=(2.5+(progress*4.5)).toFixed(2)+'deg';
      stage.style.setProperty('--thread-scale',scale);
      stage.style.setProperty('--thread-tilt',tilt);
      var center=viewport*.5;
      cards.forEach(function(card,i){
        var r=card.getBoundingClientRect();
        var distance=(r.top+r.height/2-center)/Math.max(viewport*.8,1);
        var z=Math.max(-46,Math.min(22,-distance*34));
        var y=Math.max(-10,Math.min(14,distance*8));
        var rx=Math.max(-1.5,Math.min(1.5,-distance*1.8));
        var ry=(i%2?1:-1)*Math.max(-1.2,Math.min(1.2,distance*1.4));
        card.style.setProperty('--depth-z',z.toFixed(1)+'px');
        card.style.setProperty('--depth-y',y.toFixed(1)+'px');
        card.style.setProperty('--depth-rx',rx.toFixed(2)+'deg');
        card.style.setProperty('--depth-ry',ry.toFixed(2)+'deg');
      });
    }

    requestAnimationFrame(function(){layoutRope();updatePerspective();});
    window.addEventListener('load',function(){layoutRope();updatePerspective();},{once:true});
    window.addEventListener('resize',function(){layoutRope();updatePerspective();});
    window.addEventListener('scroll',updatePerspective,{passive:true});

    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting)select(Number(entry.target.dataset.storyIndex)||0);});
    },{root:null,rootMargin:'-40% 0px -40% 0px',threshold:0});
    function select(index){
      if(index<0||index>=cards.length)return;
      cards.forEach(function(card,j){card.classList.toggle('is-lit',j===index);});
      Array.prototype.slice.call(svg.querySelectorAll('.thread-rope-knot-group')).forEach(function(g){g.classList.toggle('is-active',Number(g.dataset.index)===index);});
    }
    cards.forEach(function(card){observer.observe(card);});
    select(0);

    window.addEventListener('keydown',function(e){
      if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
      var active=cards.findIndex(function(c){return c.classList.contains('is-lit');});
      if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();cards[Math.min(cards.length-1,Math.max(0,active)+1)].scrollIntoView({behavior:'smooth',block:'center'});}
      if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();cards[Math.max(0,active-1)].scrollIntoView({behavior:'smooth',block:'center'});}
    },{passive:false});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
