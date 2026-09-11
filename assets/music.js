/* Load the music database synchronously before the viewer initialises. */
if(!window.PROFESSION_MUSIC){
  document.write('<script src="assets/music-base.js?v=20260911-2"><\\/script>');
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

  const install=()=>{
    const professionEl=document.getElementById('viewer-profession');
    const play=document.getElementById('music-play');
    if(!professionEl||!play)return;

    const pause=()=>{
      if(play.getAttribute('aria-label')==='Pause music')play.click();
    };

    /* Pause only once before a navigation click. The previous implementation also
       owned ArrowLeft/ArrowRight and caused the core viewer to advance twice. */
    const stopBeforeStoryChange=()=>pause();
    document.addEventListener('click',e=>{
      if(e.target.closest('.viewer-arrow,.story-thumb,[data-home]'))stopBeforeStoryChange();
    },true);

    /* Navigation is intentionally NOT handled here. index.html owns the single
       ArrowLeft/ArrowRight listener, so one keypress = exactly one story. */

    /* Autoplay after the core viewer has finished changing the profession. */
    let autoplayTimer=0;
    const autoplayStoryMusic=()=>{
      clearTimeout(autoplayTimer);
      autoplayTimer=setTimeout(()=>{
        if(document.body.classList.contains('is-stories')&&play.getAttribute('aria-label')!=='Pause music')play.click();
      },450);
    };
    new MutationObserver(()=>autoplayStoryMusic()).observe(professionEl,{childList:true,characterData:true,subtree:true});
    new MutationObserver(m=>{
      if(m.some(x=>x.attributeName==='class'&&document.body.classList.contains('is-stories')))autoplayStoryMusic();
    }).observe(document.body,{attributes:true,attributeFilter:['class']});

    /* Keep playlist data/rendering in sync whenever the story changes. The base
       music UI listens to the same profession field, and this event gives it a
       second reliable refresh point for the appended playlists. */
    const refreshPlaylist=()=>{
      const trigger=document.querySelector('.git-playlist-trigger');
      if(trigger){trigger.dispatchEvent(new Event('git:playlist-refresh'))}
      const box=document.querySelector('.git-music-playlist');
      if(box && document.querySelector('.music-player')?.classList.contains('git-playlist-open')){
        box.dispatchEvent(new Event('git:playlist-refresh'));
      }
    };
    new MutationObserver(()=>setTimeout(refreshPlaylist,0)).observe(professionEl,{childList:true,characterData:true,subtree:true});

    autoplayStoryMusic();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
