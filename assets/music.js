(async()=>{
  await import('./music-base.js');
  const install=()=>{
    const professionEl=document.getElementById('viewer-profession');
    const titleEl=document.getElementById('music-title');
    const play=document.getElementById('music-play');
    const pause=()=>{if(play&&play.getAttribute('aria-label')==='Pause music')play.click()};
    const stopBeforeStoryChange=()=>{pause();setTimeout(pause,0);setTimeout(pause,80)};

    /* Stop the current track before any story-navigation click reaches the core viewer. */
    document.addEventListener('click',e=>{
      if(e.target.closest('.viewer-arrow,.story-thumb,[data-home]')) stopBeforeStoryChange();
    },true);

    /* Story changes can also come from wheel/touch/navigation code, so watch the profession field too. */
    if(professionEl){
      let last=professionEl.textContent;
      new MutationObserver(()=>{
        const next=professionEl.textContent;
        if(next!==last){last=next;stopBeforeStoryChange()}
      }).observe(professionEl,{childList:true,characterData:true,subtree:true});
    }

    /* Own the horizontal arrow keys in capture phase so the older keyboard listener cannot fire as well. */
    document.addEventListener('keydown',e=>{
      if(e.metaKey||e.ctrlKey||e.altKey)return;
      const tag=document.activeElement?.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||document.activeElement?.isContentEditable)return;
      if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(e.repeat)return;
      stopBeforeStoryChange();
      const dir=e.key==='ArrowLeft'?-1:1;
      const btn=document.querySelector(`.viewer-arrow[data-slide="${dir}"]`);
      if(btn)btn.click();
    },true);

    /* The base player already re-targets the YouTube track when the title changes. Keep the new story paused. */
    if(titleEl){
      let lastTitle=titleEl.textContent;
      new MutationObserver(()=>{
        const next=titleEl.textContent;
        if(next!==lastTitle){lastTitle=next;setTimeout(pause,0)}
      }).observe(titleEl,{childList:true,characterData:true,subtree:true});
    }

    /* Apply the parallax class to every photo, including later/alternate images. */
    const media=document.getElementById('viewer-media');
    if(media){
      const apply=()=>media.querySelectorAll('img').forEach(img=>img.classList.add('git-parallax-layer'));
      apply();
      new MutationObserver(mutations=>{
        if(mutations.some(m=>m.type==='childList'&&m.addedNodes.length))apply();
      }).observe(media,{childList:true,subtree:true});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
