/* Load the music database synchronously so the viewer cannot race ahead of it. */
if(!window.PROFESSION_MUSIC){
  document.write('<script src="assets/music-base.js?v=20260911-1"><\/script>');
}
/* YouTube can finish loading before the inline viewer script assigns its callback.
   Bridge the assignment so the callback is also fired when the API is already ready. */
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
    const titleEl=document.getElementById('music-title');
    const play=document.getElementById('music-play');
    const pause=()=>{if(play&&play.getAttribute('aria-label')==='Pause music')play.click()};
    const stopBeforeStoryChange=()=>{pause();setTimeout(pause,0);setTimeout(pause,80)};
    document.addEventListener('click',e=>{if(e.target.closest('.viewer-arrow,.story-thumb,[data-home]'))stopBeforeStoryChange()},true);
    if(professionEl){let last=professionEl.textContent;new MutationObserver(()=>{const next=professionEl.textContent;if(next!==last){last=next;stopBeforeStoryChange()}}).observe(professionEl,{childList:true,characterData:true,subtree:true})}
    document.addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||document.activeElement?.isContentEditable)return;if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;stopBeforeStoryChange();const dir=e.key==='ArrowLeft'?-1:1;const btn=document.querySelector(`.viewer-arrow[data-slide="${dir}"]`);if(btn)btn.click()},true);
    if(titleEl){let lastTitle=titleEl.textContent;new MutationObserver(()=>{const next=titleEl.textContent;if(next!==lastTitle){lastTitle=next;setTimeout(pause,0)}}).observe(titleEl,{childList:true,characterData:true,subtree:true})}
    const media=document.getElementById('viewer-media');if(media){const apply=()=>media.querySelectorAll('img').forEach(img=>img.classList.add('git-parallax-layer'));apply();new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='childList'&&m.addedNodes.length))apply()}).observe(media,{childList:true,subtree:true})}
    let autoplayTimer=0;
    const autoplayStoryMusic=()=>{clearTimeout(autoplayTimer);autoplayTimer=setTimeout(()=>{if(document.body.classList.contains('is-stories')&&play&&play.getAttribute('aria-label')!=='Pause music')play.click()},350)};
    if(professionEl)new MutationObserver(autoplayStoryMusic).observe(professionEl,{childList:true,characterData:true,subtree:true});
    new MutationObserver(m=>{if(m.some(x=>x.attributeName==='class'&&document.body.classList.contains('is-stories')))autoplayStoryMusic()}).observe(document.body,{attributes:true,attributeFilter:['class']});
    autoplayStoryMusic();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
