/* The Great Indian Table — optional story atmosphere layer.
   Toggle from assets/stories.js with window.STORY_ANIMATIONS_ENABLED.
   Set it to false to return to the static-photo experience without deleting this feature.
*/
(function(){
  if(window.STORY_ANIMATIONS_ENABLED===false) return;
  const media=document.getElementById('viewer-media');
  const profession=document.getElementById('viewer-profession');
  if(!media||!profession) return;

  const effect=document.createElement('div');
  effect.className='story-atmosphere';
  effect.setAttribute('aria-hidden','true');
  media.appendChild(effect);

  const effects={
    'Chai Stall Owner':'steam',
    'Goldsmith':'gold-glint',
    'Banarasi Weaver':'zari',
    'Farmer':'crops',
    'Software Developer':'rain-drop',
    'Bookbinder':'page'
  };

  const render=()=>{
    const key=profession.textContent.trim();
    const type=effects[key]||'';
    effect.className='story-atmosphere'+(type?' is-'+type:'');
    effect.innerHTML='';
    if(type==='steam') effect.innerHTML='<i></i><i></i><i></i>';
    if(type==='crops') effect.innerHTML='<i></i><i></i><i></i><i></i>';
  };

  const style=document.createElement('style');
  style.textContent=`
    .story-atmosphere{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .8s ease}
    .story-atmosphere.is-steam,.story-atmosphere.is-gold-glint,.story-atmosphere.is-zari,.story-atmosphere.is-crops,.story-atmosphere.is-rain-drop,.story-atmosphere.is-page{opacity:1}
    .story-atmosphere.is-steam i{position:absolute;bottom:21%;left:50%;width:18px;height:70px;border-radius:50%;filter:blur(7px);background:rgba(248,243,233,.13);transform:translateX(-50%);animation:git-steam 5.5s ease-in-out infinite}
    .story-atmosphere.is-steam i:nth-child(2){left:53%;height:88px;animation-delay:-2s;opacity:.65}
    .story-atmosphere.is-steam i:nth-child(3){left:47%;height:58px;animation-delay:-3.5s;opacity:.5}
    @keyframes git-steam{0%{opacity:0;transform:translate(-50%,10px) scale(.7)}25%{opacity:.5}70%{opacity:.18}100%{opacity:0;transform:translate(calc(-50% + 13px),-75px) scale(1.25)}}

    .story-atmosphere.is-gold-glint:after,.story-atmosphere.is-zari:after{content:"";position:absolute;inset:-35%;background:linear-gradient(110deg,transparent 45%,rgba(255,235,184,.0) 48%,rgba(255,238,190,.34) 50%,rgba(255,235,184,.0) 52%,transparent 55%);transform:translateX(-55%) rotate(0deg);animation:git-glint 7s ease-in-out infinite}
    .story-atmosphere.is-zari:after{animation-duration:8.5s;opacity:.65;background:linear-gradient(110deg,transparent 45%,rgba(255,225,150,.0) 48%,rgba(255,225,150,.22) 50%,rgba(255,225,150,.0) 52%,transparent 55%)}
    @keyframes git-glint{0%,55%{transform:translateX(-55%)}72%{transform:translateX(55%)}100%{transform:translateX(55%)}}

    .story-atmosphere.is-crops i{position:absolute;bottom:-8%;left:8%;width:2px;height:32%;border-radius:100%;background:rgba(218,223,177,.18);transform-origin:bottom;animation:git-crop 4.8s ease-in-out infinite}
    .story-atmosphere.is-crops i:nth-child(2){left:18%;height:24%;animation-delay:-1.4s}.story-atmosphere.is-crops i:nth-child(3){right:13%;left:auto;height:29%;animation-delay:-2.5s}.story-atmosphere.is-crops i:nth-child(4){right:5%;left:auto;height:20%;animation-delay:-3.2s}
    @keyframes git-crop{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(3deg)}}

    .story-atmosphere.is-rain-drop:after{content:"";position:absolute;left:72%;top:18%;width:5px;height:17px;border-radius:50% 50% 55% 55%;background:linear-gradient(180deg,rgba(220,238,240,.5),rgba(220,238,240,.05));filter:blur(.2px);box-shadow:0 0 7px rgba(220,238,240,.16);animation:git-drop 6s ease-in-out infinite}
    @keyframes git-drop{0%,12%{opacity:0;transform:translateY(-8px)}18%{opacity:.6}82%{opacity:.2}100%{opacity:0;transform:translateY(115px)}}

    .story-atmosphere.is-page:after{content:"";position:absolute;right:8%;bottom:14%;width:120px;height:120px;background:linear-gradient(135deg,transparent 0 72%,rgba(248,243,233,.08) 73% 76%,transparent 77%);transform-origin:bottom right;animation:git-page 5.5s ease-in-out infinite}
    @keyframes git-page{0%,100%{transform:rotate(0deg);opacity:.25}45%{transform:rotate(-3deg);opacity:.55}65%{transform:rotate(1deg);opacity:.3}}

    @media(prefers-reduced-motion:reduce){.story-atmosphere *,.story-atmosphere:after{animation:none!important}}
    @media(max-width:800px){.story-atmosphere.is-steam i{bottom:25%}.story-atmosphere.is-page:after{right:2%;bottom:19%;width:90px;height:90px}}
  `;
  document.head.appendChild(style);
  render();
  new MutationObserver(render).observe(profession,{childList:true,characterData:true,subtree:true});
})();
