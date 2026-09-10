window.PROFESSION_MUSIC = {
  "Potter": [
    {title:"Mati Kahe Kumhar Se", url:"https://www.youtube.com/embed/boVAg2hIpNY"},
    {title:"Maati Ke Matke", url:"https://www.youtube.com/embed/videoseries?list=RDix85Vu2YAI4"},
    {title:"Panihari", url:"https://www.youtube.com/embed/CablSO-EI4o"},
    {title:"Ghadlo", url:"https://www.youtube.com/embed/A64yu75kTd4"},
    {title:"Gorband", url:"https://www.youtube.com/embed/VWHl09F1tNM"}
  ],
  "Software Developer": [
    {title:"Mungaru Maleye", url:"https://www.youtube.com/embed/y7j4pOylYY8"},
    {title:"Paravashanadenu", url:"https://www.youtube.com/embed/n9oi-wlQD9Y"},
    {title:"Nenne Tanaka", url:"https://www.youtube.com/embed/JIRg0dM_GUU"},
    {title:"Tunturu", url:"https://www.youtube.com/embed/i3gEXHI1xXM"},
    {title:"Naguva Nayana", url:"https://www.youtube.com/embed/Dajcwrykmf8"}
  ],
  "Auto Mechanic": [
    {title:"Zinghat", url:"https://www.youtube.com/embed/luhVm60Wiro"},
    {title:"Wajle Ki Bara", url:"https://www.youtube.com/embed/hD2g7W_Akfk"},
    {title:"Kombdi Palali", url:"https://www.youtube.com/embed/unfBlqT0ZPc"},
    {title:"Zindagi Ek Safar Hai Suhana", url:"https://www.youtube.com/embed/mzxHflxI-es"},
    {title:"Musafir Hoon Yaaro", url:"https://www.youtube.com/embed/WcsncpEWQZI"}
  ]
};

/* Custom UI + YouTube IFrame API playback bridge. */
(()=>{
  let player=null,ready=false,queued=null,playing=false;
  const idOf=item=>{const m=(item?.url||'').match(/embed\/([\w-]{6,})/);return m?.[1]||null;};
  const current=()=>{const p=document.getElementById('viewer-profession')?.textContent.trim();const t=document.getElementById('music-title')?.textContent.trim();return (window.PROFESSION_MUSIC?.[p]||[]).find(x=>x.title===t)||null;};
  const button=()=>document.getElementById('music-play');
  const sync=on=>{playing=on;const b=button();if(b){b.textContent=on?'Ⅱ':'▶';b.setAttribute('aria-label',on?'Pause music':'Play music');}};
  const create=()=>{if(player||!ready)return;const host=document.createElement('div');host.id='yt-player';host.style.cssText='position:fixed;left:-100px;bottom:-100px;width:10px;height:10px;opacity:.01;pointer-events:none;';document.body.appendChild(host);player=new YT.Player('yt-player',{width:'10',height:'10',videoId:queued||'',playerVars:{controls:0,playsinline:1,rel:0},events:{onReady:e=>{if(queued){e.target.cueVideoById(queued);queued=null;}},onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)sync(true);if(e.data===YT.PlayerState.PAUSED||e.data===YT.PlayerState.ENDED)sync(false);}}});};
  const load=autoplay=>{const id=idOf(current());if(!id)return;if(!player){queued=id;return;}player.loadVideoById(id);if(autoplay)setTimeout(()=>player.playVideo(),80);};
  const toggle=()=>{const id=idOf(current());if(!id)return;if(!player){queued=id;return;}if(player.getPlayerState()===YT.PlayerState.PLAYING)player.pauseVideo();else player.playVideo();};
  const init=()=>{const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);window.onYouTubeIframeAPIReady=()=>{ready=true;create();};document.addEventListener('click',e=>{if(e.target.closest?.('#music-play')){e.preventDefault();e.stopImmediatePropagation();toggle();}else if(e.target.closest?.('#music-prev,#music-next')){const was=playing;setTimeout(()=>load(was),40);}},true);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
