/* Load the music database synchronously before the viewer initialises. */
if(!window.PROFESSION_MUSIC){
  document.write('<script src="assets/music-base.js?v=20260911-4"><\/script>');
}

/* Keep the YouTube API callback safe even if the API finishes before the viewer script. */
(()=>{
  let callback=null;
  Object.defineProperty(window,'onYouTubeIframeAPIReady',{
    configurable:true,
    get(){return callback},
    set(fn){callback=fn;if(typeof fn==='function'&&window.YT&&window.YT.Player)setTimeout(fn,0)}
  });
})();

(()=>{
  Object.assign(window.PROFESSION_MUSIC||{}, {
    "Fisherman":[
      {title:"Apna Desh",url:"https://www.youtube.com/embed/UkJBBWGtSYo"},
      {title:"Manuhe Manuhor Babe",url:"https://www.youtube.com/embed/3TGi7iL4twI"},
      {title:"Bhor Geet",url:"https://www.youtube.com/embed/FDzR_pdrbOc"},
      {title:"Sagar Sangame",url:"https://www.youtube.com/embed/JzGAmLNwLjw"},
      {title:"Bistirno Parore",url:"https://www.youtube.com/embed/bJePK6osjXQ"}
    ],
    "Puppeteer":[
      {title:"Ghoomar",url:"https://www.youtube.com/embed/cVeMyeTi4gE"},
      {title:"Mor Bole Re",url:"https://www.youtube.com/embed/6ou3-oMFW7Q"},
      {title:"Chirmi",url:"https://www.youtube.com/embed/665oYRPh8Os"},
      {title:"Rang Rasiya",url:"https://www.youtube.com/embed/TJ9Xhgv35T0"},
      {title:"Mahadev Chale",url:"https://www.youtube.com/embed/O9xHdQjJyxI"}
    ],
    "Carpenter":[
      {title:"En Peru",url:"https://www.youtube.com/embed/npDDwOUYN6Q"},
      {title:"E Petaku",url:"https://www.youtube.com/embed/oppz5I9KeQA"},
      {title:"Aagadu Endu",url:"https://www.youtube.com/embed/VmWUHuskuUU"},
      {title:"Kandu Nijan",url:"https://www.youtube.com/embed/zQ32wZ4jx-U"},
      {title:"Kanner Poovinte",url:"https://www.youtube.com/embed/JeQFOr-JqsI"}
    ],
    "Freelancer":[
      {title:"Kadi Tu",url:"https://www.youtube.com/embed/VYdWSp8pIjg"},
      {title:"Gul",url:"https://www.youtube.com/embed/SmaY7RfBgas"},
      {title:"Udi",url:"https://www.youtube.com/embed/R0XjwtP_iTY"},
      {title:"Mala Ve",url:"https://www.youtube.com/embed/I1sDYBVc8sQ"},
      {title:"Sawaar Loon",url:"https://www.youtube.com/embed/6k8Aja80GQM"}
    ],
    "Truck Driver":[
      {title:"Suhana Safar",url:"https://www.youtube.com/embed/pK2WFw8nypc"},
      {title:"Chala Jaata Hoon",url:"https://www.youtube.com/embed/UNjhqT_hlbg"},
      {title:"Pukarta Chala Hoon Main",url:"https://www.youtube.com/embed/J1G09Q-KSL4"},
      {title:"Main To Chala",url:"https://www.youtube.com/embed/FdFI6CtEpys"},
      {title:"Ruk Jaana Nahi",url:"https://www.youtube.com/embed/6J9okctVu58"}
    ],
    "UPSC Aspirant":[
      {title:"Aaj Phir",url:"https://www.youtube.com/embed/lqBCgkBKlDc"},
      {title:"Darmiyaan",url:"https://www.youtube.com/embed/8iKT_7pCKnU"},
      {title:"Kahaan Hoon Main",url:"https://www.youtube.com/embed/iAxCcecVaig"},
      {title:"Jeena Yahan",url:"https://www.youtube.com/embed/e31rwfmp-Zs"},
      {title:"Aaj Main Upar",url:"https://www.youtube.com/embed/cBhehE8AbUA"}
    ]
  });
  delete window.PROFESSION_MUSIC["Boat Builder"];
  delete window.PROFESSION_MUSIC["Graphic Designer"];

  /* Own keyboard navigation. Ignore held-key repeats so one physical press
     always means one story. Stop all older listeners from seeing the event. */
  let lastArrowAt=0;
  document.addEventListener('keydown',e=>{
    if(e.metaKey||e.ctrlKey||e.altKey||e.repeat)return;
    const tag=document.activeElement?.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||document.activeElement?.isContentEditable)return;
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
    if(!document.body.classList.contains('is-stories'))return;
    const now=Date.now();
    if(now-lastArrowAt<180)return;
    lastArrowAt=now;
    e.preventDefault();
    e.stopImmediatePropagation();
    const dir=e.key==='ArrowLeft'?-1:1;
    document.querySelector(`.viewer-arrow[data-slide="${dir}"]`)?.click();
  },true);

  const install=()=>{
    const professionEl=document.getElementById('viewer-profession');
    const play=document.getElementById('music-play');
    const player=document.getElementById('music-player');
    if(!professionEl||!play||!player)return;

    const pause=()=>{if(play.getAttribute('aria-label')==='Pause music')play.click()};
    document.addEventListener('click',e=>{
      if(e.target.closest('.viewer-arrow,.story-thumb,[data-home]'))pause();
    },true);

    /* Force a single reliable playlist UI, independent of the older music-base
       playlist initializer. */
    const controls=player.querySelector('.music-controls');
    let trigger=player.querySelector('.git-playlist-trigger');
    if(!trigger){
      trigger=document.createElement('button');
      trigger.type='button';
      trigger.className='git-playlist-trigger';
      trigger.textContent='TRACKS';
      trigger.setAttribute('aria-label','Show playlist');
      if(controls)controls.insertBefore(trigger,controls.firstChild);
    }
    let box=player.querySelector('.git-music-playlist');
    if(!box){box=document.createElement('div');box.className='git-music-playlist';player.appendChild(box)}
    const style=document.createElement('style');
    style.textContent=`
      .git-music-playlist{position:absolute!important;left:0!important;right:0!important;bottom:calc(100% + 6px)!important;display:none!important;max-height:min(340px,48vh)!important;overflow:auto!important;padding:10px!important;border:1px solid rgba(248,243,233,.18)!important;border-radius:20px!important;background:rgba(13,18,17,.97)!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;box-shadow:0 18px 60px rgba(0,0,0,.55)!important;z-index:200!important;scrollbar-width:none!important}
      .music-player.git-playlist-open .git-music-playlist{display:block!important}
      .git-music-playlist::-webkit-scrollbar{display:none}.git-playlist-head{display:flex;justify-content:space-between;padding:3px 6px 9px;color:#aeb8b0;font:7px var(--mono);letter-spacing:.14em;text-transform:uppercase}.git-playlist-row{width:100%;display:flex;align-items:center;gap:10px;padding:9px 8px;border:0;border-radius:10px;text-align:left;color:#d9d5cc;background:transparent;font:10px var(--body)}.git-playlist-row:hover,.git-playlist-row.is-current{background:rgba(248,243,233,.08);color:var(--cream)}.git-playlist-num{width:20px;flex:0 0 20px;color:#929b95;font:7px var(--mono)}.git-playlist-dot{width:5px;height:5px;flex:0 0 5px;border-radius:50%;background:var(--accent);opacity:0}.git-playlist-row.is-current .git-playlist-dot{opacity:1}.git-playlist-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.git-playlist-trigger{font:8px var(--mono)!important;letter-spacing:.1em;text-transform:uppercase;width:auto!important;padding:0 8px!important;opacity:.75}
    `;
    document.head.appendChild(style);

    const escape=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const renderPlaylist=()=>{
      const profession=professionEl.textContent.trim();
      const list=(window.PROFESSION_MUSIC||{})[profession]||[];
      const current=(document.getElementById('music-title')?.textContent||'').trim();
      box.innerHTML=`<div class="git-playlist-head"><span>PLAYLIST</span><span>${list.length} TRACKS</span></div>`+list.map((x,i)=>`<button type="button" class="git-playlist-row${x.title===current?' is-current':''}" data-force-song="${i}"><span class="git-playlist-num">${String(i+1).padStart(2,'0')}</span><span class="git-playlist-dot"></span><span class="git-playlist-title">${escape(x.title)}</span></button>`).join('');
      box.querySelectorAll('[data-force-song]').forEach(row=>row.onclick=()=>{
        const target=Number(row.dataset.forceSong);const next=document.getElementById('music-next');const currentNow=(document.getElementById('music-title')?.textContent||'').trim();const from=list.findIndex(x=>x.title===currentNow);const steps=(target-(from<0?0:from)+list.length)%list.length;if(next)for(let i=0;i<steps;i++)next.click();setTimeout(renderPlaylist,80);
      });
    };
    const openPlaylist=()=>{renderPlaylist();player.classList.add('git-playlist-open');trigger.classList.add('is-active')};
    const closePlaylist=()=>{player.classList.remove('git-playlist-open');trigger.classList.remove('is-active')};
    trigger.onclick=e=>{e.preventDefault();e.stopPropagation();player.classList.contains('git-playlist-open')?closePlaylist():openPlaylist()};
    trigger.onmouseenter=openPlaylist;
    trigger.onfocus=openPlaylist;
    player.onmouseleave=closePlaylist;

    let autoplayTimer=0;
    const autoplayStoryMusic=()=>{
      clearTimeout(autoplayTimer);
      autoplayTimer=setTimeout(()=>{
        if(document.body.classList.contains('is-stories')&&play.getAttribute('aria-label')!=='Pause music')play.click();
      },450);
    };
    new MutationObserver(()=>{renderPlaylist();autoplayStoryMusic()}).observe(professionEl,{childList:true,characterData:true,subtree:true});
    new MutationObserver(m=>{
      if(m.some(x=>x.attributeName==='class'&&document.body.classList.contains('is-stories'))){renderPlaylist();autoplayStoryMusic()}
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
    renderPlaylist();
    autoplayStoryMusic();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
