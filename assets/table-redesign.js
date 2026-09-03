(function(){
  function init(){
    document.querySelectorAll('.table-hero').forEach(function(el){el.remove();});
    fixCopy();
    initStoriesThread();
  }

  function fixCopy(){
    var hero=document.querySelector('#map h1');
    if(hero)hero.innerHTML='Every table tells a <em>tale.</em>';
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
      '<linearGradient id="rope-knot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d49a68"/><stop offset=".45" stop-color="#9a5e35"/><stop offset="1" stop-color="#6f3d22"/></linearGradient>'+
      '<filter id="rope-texture" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7"/><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-opacity=".25"/></filter>'+
      '<filter id="rope-shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="3"/><feOffset dy="5"/><feComponentTransfer><feFuncA type="linear" slope=".55"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
      '<filter id="rope-knot-shadow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".3"/></filter>'+
      '<filter id="rope-knot-active" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#b95537" flood-opacity=".35"/></filter>'+
      '</defs><path class="thread-rope-shadow"></path><path class="thread-rope-body"></path><path class="thread-rope-mid"></path><path class="thread-rope-light"></path>';
    stage.insertBefore(svg,grid);

    var knots=[];
    cards.forEach(function(card,i){
      card.dataset.storyIndex=i;
      card.classList.add(i%2===0?'thread-left':'thread-right');
      var knot=document.createElement('button');
      knot.type='button';
      knot.className='story-knot-access';
      knot.setAttribute('aria-label','Go to story '+(i+1));
      knot.textContent=String(i+1).padStart(2,'0');
      knot.style.cssText='position:absolute;opacity:0;pointer-events:auto;width:44px;height:44px;border:0;background:transparent;cursor:pointer;z-index:6;';
      knot.addEventListener('click',function(){card.scrollIntoView({behavior:'smooth',block:'center'});});
      stage.appendChild(knot);
      knots.push(knot);
    });

    function layoutRope(){
      var w=stage.clientWidth,h=stage.scrollHeight||stage.clientHeight;
      svg.setAttribute('viewBox','0 0 '+w+' '+Math.max(h,1));
      svg.setAttribute('height',Math.max(h,1));
      var points=cards.map(function(card){return {x:w/2,y:card.offsetTop+card.offsetHeight/2};});
      if(!points.length)return;
      var d='M '+(w/2)+' '+Math.max(18,points[0].y-170);
      points.forEach(function(p,i){
        var prev=i?points[i-1]:{x:w/2,y:p.y-170};
        var bend=(i%2===0?1:-1)*Math.min(92,w*.09);
        d+=' C '+(w/2+bend)+' '+(prev.y+70)+' '+(w/2-bend)+' '+(p.y-70)+' '+p.x+' '+p.y;
        knots[i].style.left=(w/2-22)+'px';
        knots[i].style.top=(p.y-22)+'px';
      });
      d+=' C '+(w/2-70)+' '+(points[points.length-1].y+95)+' '+(w/2+75)+' '+(points[points.length-1].y+145)+' '+(w/2)+' '+(points[points.length-1].y+190);
      svg.querySelector('.thread-rope-shadow').setAttribute('d',d);
      svg.querySelector('.thread-rope-body').setAttribute('d',d);
      svg.querySelector('.thread-rope-mid').setAttribute('d',d);
      svg.querySelector('.thread-rope-light').setAttribute('d',d);

      Array.prototype.slice.call(svg.querySelectorAll('.thread-rope-knot,.thread-rope-knot-core')).forEach(function(el){el.remove();});
      points.forEach(function(p,i){
        var g=document.createElementNS('http://www.w3.org/2000/svg','g');
        var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r','18');c.setAttribute('class','thread-rope-knot');c.dataset.index=i;
        var core=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        core.setAttribute('cx',p.x);core.setAttribute('cy',p.y);core.setAttribute('rx','10');core.setAttribute('ry','5');core.setAttribute('transform','rotate(-18 '+p.x+' '+p.y+')');core.setAttribute('class','thread-rope-knot-core');
        g.appendChild(c);g.appendChild(core);svg.appendChild(g);
      });
    }

    function updateDepth(){
      if(window.innerWidth<=800)return;
      var center=window.innerHeight*.5;
      var focalDepth=0;
      cards.forEach(function(card){
        var r=card.getBoundingClientRect();
        var cardCenter=r.top+r.height*.5;
        var distance=(cardCenter-center)/Math.max(window.innerHeight*.72,1);
        var proximity=Math.max(-1,Math.min(1,1-Math.abs(distance)));
        var z=Math.max(-260,Math.min(150,proximity*150-distance*85));
        var y=Math.max(-18,Math.min(18,distance*13));
        var rotY=Math.max(-2.2,Math.min(2.2,distance*2.4));
        var rotX=Math.max(-1.5,Math.min(1.5,-distance*1.5));
        var depthScale=1+(z/1100);
        card.style.setProperty('--depth-z',z.toFixed(1)+'px');
        card.style.setProperty('--depth-y',y.toFixed(1)+'px');
        card.style.setProperty('--depth-scale',depthScale.toFixed(4));
        card.style.setProperty('--depth-ry',rotY.toFixed(2)+'deg');
        card.style.setProperty('--depth-rx',rotX.toFixed(2)+'deg');
        if(card.classList.contains('is-lit'))focalDepth=z;
      });
      stage.style.setProperty('--camera-depth',focalDepth.toFixed(1)+'px');
    }

    requestAnimationFrame(function(){layoutRope();updateDepth();});
    window.addEventListener('resize',function(){layoutRope();updateDepth();});
    window.addEventListener('scroll',updateDepth,{passive:true});

    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting)select(Number(entry.target.dataset.storyIndex)||0);
      });
    },{root:null,rootMargin:'-42% 0px -42% 0px',threshold:0});
    function select(index){
      if(index<0||index>=cards.length)return;
      cards.forEach(function(card,j){card.classList.toggle('is-lit',j===index);});
      Array.prototype.slice.call(svg.querySelectorAll('.thread-rope-knot')).forEach(function(k){k.classList.toggle('is-active',Number(k.dataset.index)===index);});
      requestAnimationFrame(updateDepth);
    }
    cards.forEach(function(card){observer.observe(card);});
    select(0);

    window.addEventListener('keydown',function(e){
      if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
      var active=cards.findIndex(function(c){return c.classList.contains('is-lit');});
      if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();cards[Math.min(cards.length-1,active+1)].scrollIntoView({behavior:'smooth',block:'center'});}
      if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();cards[Math.max(0,active-1)].scrollIntoView({behavior:'smooth',block:'center'});}
    },{passive:false});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
