window.STORIES = [
  { id:"meena-devi", images:["assets/img/Tailor.PNG","assets/img/Hero.JPEG"], image:"assets/img/Tailor.PNG", profession:"Tailor", quote:"A stitch you rush is a stitch you redo. I have time for exactly one of those.", name:"Meena Devi", location:"Lucknow, Uttar Pradesh" },
  { id:"irfan-sheikh", images:["assets/img/Auto Mechanic.PNG","assets/img/Auto Mechanic (2).PNG"], image:"assets/img/Auto Mechanic.PNG", profession:"Auto Mechanic", quote:"Every engine tells you what's wrong. You just have to stop talking and listen.", name:"Irfan Sheikh", location:"Mumbai, Maharashtra" },
  { id:"priya-deshmukh", images:["assets/img/Graphic Designer.PNG","assets/img/Graphic Designer (2).PNG"], image:"assets/img/Graphic Designer.PNG", profession:"Freelancer", quote:"Everyone has an opinion on design. Not everyone has a reason for it.", name:"Priya Deshmukh", location:"Pune, Maharashtra" },
  { id:"lakshmi-kumhar", images:["assets/img/Potter.PNG","assets/img/Potter (2).PNG"], image:"assets/img/Potter.PNG", profession:"Potter", quote:"The wheel doesn't lie. If your hand shakes, the pot shows it.", name:"Lakshmi Kumhar", location:"Jaipur, Rajasthan" },
  { id:"rahul-nair", images:["assets/img/Software Developer.PNG","assets/img/Software Developer (2).PNG"], image:"assets/img/Software Developer.PNG", profession:"Software Developer", quote:"Good code is a letter to the next person who has to fix your mistakes.", name:"Rahul Nair", location:"Bengaluru, Karnataka" },
  { id:"farida-ansari", images:["assets/img/Banarasi Weaver.PNG","assets/img/Banarasi Weaver (2).PNG"], image:"assets/img/Banarasi Weaver.PNG", profession:"Banarasi Weaver", quote:"A power loom copies the pattern. My hands copy my grandmother.", name:"Farida Ansari", location:"Varanasi, Uttar Pradesh" },
  { id:"suresh-poduval", images:["assets/img/fisherman.PNG","assets/img/Fisherman (2).PNG","assets/img/Fisherman (3).PNG"], image:"assets/img/fisherman.PNG", profession:"Fisherman", quote:"The sea gives you exactly what it wants to, not what you need.", name:"Bipul Das", location:"Guwahati, Assam" },
  { id:"ganesh-achari", images:["assets/img/Goldsmith.PNG","assets/img/Goldsmith (2).PNG"], image:"assets/img/Goldsmith.PNG", profession:"Goldsmith", quote:"Gold forgives almost nothing. That's why I still work slowly.", name:"Ganesh Achari", location:"Madurai, Tamil Nadu" },
  { id:"babulal-soni", images:["assets/img/Chai Stall Owner.PNG","assets/img/Chai Stall Owner (2).PNG"], image:"assets/img/Chai Stall Owner.PNG", profession:"Chai Stall Owner", quote:"People don't come back for the tea. They come back for five minutes of being asked how they are.", name:"Babulal Soni", location:"Jodhpur, Rajasthan" },
  { id:"noor-fatima", images:["assets/img/Bangle Maker.PNG","assets/img/Bangle Maker (2).PNG"], image:"assets/img/Bangle Maker.PNG", profession:"Bangle Maker", quote:"No two of my bangles are the same, even when the customer asks for that.", name:"Noor Fatima", location:"Hyderabad, Telangana" },
  { id:"kiran-singh", images:["assets/img/Farmer.PNG","assets/img/Farmer (2).PNG"], image:"assets/img/Farmer.PNG", profession:"Farmer", quote:"The land doesn't care about your plans. It only cares about your patience.", name:"Kiran Singh", location:"Amritsar, Punjab" },
  { id:"manisha-bose", images:["assets/img/Bookbinder.PNG","assets/img/Bookbinder (2).PNG"], image:"assets/img/Bookbinder.PNG", profession:"Bookbinder", quote:"A repaired book still remembers being broken. That's what makes it honest.", name:"Manisha Bose", location:"Kolkata, West Bengal" },
  { id:"devika-bhat", images:["assets/img/Puppeteer.PNG","assets/img/Puppeteer (2).PNG"], image:"assets/img/Puppeteer.PNG", profession:"Puppeteer", quote:"The puppet doesn't move. My hand does. People just forget that on purpose.", name:"Devika Bhat", location:"Udaipur, Rajasthan" },
  { id:"thomas-varghese", images:["assets/img/Carpenter.PNG","assets/img/Carpenter-2.PNG"], image:"assets/img/Carpenter.PNG", profession:"Carpenter", quote:"Furniture should outlive the person who ordered it. That's the whole job.", name:"Thomas Varghese", location:"Kochi, Kerala" },
  { id:"mahesh-yadav", images:["assets/img/Truck Driver.PNG","assets/img/Truck Driver (2).PNG"], image:"assets/img/Truck Driver.PNG", profession:"Truck Driver", quote:"You learn a country by the roads you keep taking after everyone else has gone home.", name:"Mahesh Yadav", location:"Indore, Madhya Pradesh" },
  { id:"aditi-sharma", images:["assets/img/UPSC.PNG","assets/img/UPSC (2).PNG"], image:"assets/img/UPSC.PNG", profession:"UPSC Aspirant", quote:"Some tables hold books. Mine holds a future I am still trying to earn.", name:"Aditi Sharma", location:"Prayagraj, Uttar Pradesh" }
];

(function(){
  const style=document.createElement('style');
  style.textContent=`
    .hero:after{background:linear-gradient(180deg,rgba(8,12,11,.08) 0%,rgba(8,12,11,.16) 48%,rgba(8,12,11,.38) 100%)}
    .hero-copy{text-shadow:0 3px 28px rgba(0,0,0,.58)}
    .hero-kicker{font-size:clamp(12px,1.25vw,16px)!important;line-height:1.45!important;max-width:1000px;margin-left:auto;margin-right:auto;text-transform:none!important;letter-spacing:.045em!important;opacity:.96!important}
    .hero h1{font-size:clamp(3rem,8vw,8.2rem)!important}
    .hero-actions{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:42px}
    .hero-actions .hero-cta{margin-top:0}
    .hero-info-btn{position:relative;width:44px;height:44px;border:1px solid rgba(248,243,233,.56);border-radius:50%;display:grid;place-items:center;background:rgba(12,17,16,.38);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font:500 18px/1 var(--body);box-shadow:0 8px 28px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.2);transition:transform .25s ease,background .25s ease,border-color .25s ease}
    .hero-info-btn:hover,.hero-info-btn:focus-visible{transform:translateY(-2px);background:rgba(18,24,23,.58);border-color:rgba(255,255,255,.82);outline:none}
    @media(max-width:800px){.hero-actions{margin-top:34px;gap:10px}.hero-info-btn{width:42px;height:42px;font-size:17px}.hero-kicker{font-size:11px!important;line-height:1.5!important;padding:0 8px}}

    .archive-intro h2{font-size:clamp(11px,1.35vw,16px)!important;line-height:1.4!important;letter-spacing:.035em!important;max-width:min(820px,80vw);color:#fff!important;text-shadow:0 2px 16px rgba(0,0,0,.88)!important;text-transform:none!important}
    .viewer-info{width:min(1100px,88vw);text-shadow:0 2px 30px rgba(0,0,0,.72);display:flex;flex-direction:column;align-items:center;justify-content:center}
    .viewer-quote{order:1;margin:0 auto 20px;max-width:820px;color:#fff;text-shadow:0 3px 12px rgba(0,0,0,.95),0 8px 34px rgba(0,0,0,.82),0 0 3px rgba(0,0,0,1)}
    .viewer-meta{order:2;display:inline-flex;align-items:center;justify-content:center;gap:0;padding:8px 13px;border-radius:999px;background:rgba(8,12,11,.48);border:1px solid rgba(248,243,233,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 5px 22px rgba(0,0,0,.22)}
    .viewer-meta .viewer-name,.viewer-meta .viewer-profession,.viewer-meta .viewer-location{display:inline!important;margin:0!important;font:500 12px var(--mono)!important;letter-spacing:.09em!important;text-transform:uppercase!important;opacity:.95!important;color:#fff!important;text-shadow:0 2px 8px rgba(0,0,0,.85)!important;vertical-align:middle!important}
    .viewer-meta .viewer-profession:after,.viewer-meta .viewer-name:after{content:"  ·  ";opacity:.55;margin:0 .45em}
    .git-random{display:none!important}
    .archive-intro .home-link,.alt-view{top:34px!important;min-height:37px!important;padding:11px 15px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
    .archive-intro .home-link{background:rgba(12,17,16,.36)!important;border:1px solid rgba(255,255,255,.34)!important;color:#fff!important;border-radius:12px!important;backdrop-filter:blur(14px) saturate(125%)!important;-webkit-backdrop-filter:blur(14px) saturate(125%)!important;box-shadow:0 8px 28px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.2)!important;text-shadow:0 1px 8px rgba(0,0,0,.75)!important}
    .archive-intro .home-link:hover,.archive-intro .home-link:focus-visible{background:rgba(18,24,23,.5)!important;border-color:rgba(255,255,255,.56)!important;box-shadow:0 10px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.24)!important;transform:translateY(-1px)}
    .git-keyboard-hint{left:50%!important;right:auto!important;bottom:2px!important;transform:translateX(-50%)!important;white-space:nowrap!important}

    .git-parallax-layer{will-change:transform;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}
    #viewer-media.git-parallax .git-parallax-layer{transform:scale(1.045) translate3d(var(--git-px,0px),var(--git-py,0px),0)}

    @keyframes gitCinematicFlash{0%{opacity:0;transform:scale(1.03)}18%{opacity:.32}45%{opacity:.12}100%{opacity:0;transform:scale(1)}}
    @keyframes gitCopyIn{0%{opacity:.2;transform:translate(-50%,-38%) translateY(10px)}100%{opacity:1;transform:translate(-50%,-42%) translateY(0)}}
    #viewer-media.git-cinematic:before{content:"";position:absolute;inset:0;z-index:4;background:#050807;pointer-events:none;animation:gitCinematicFlash .9s cubic-bezier(.2,.7,.2,1) both}
    #viewer-media.git-cinematic + .viewer-info{animation:gitCopyIn .9s cubic-bezier(.2,.7,.2,1) both}

    .git-music-enhanced{gap:8px}.git-track-count{font:7px var(--mono);letter-spacing:.12em;opacity:.48;margin-left:7px;white-space:nowrap}
    .git-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px;margin-left:6px;vertical-align:middle;opacity:.7}.git-eq i{display:block;width:2px;height:5px;background:currentColor;border-radius:2px;animation:gitEq .75s ease-in-out infinite alternate}.git-eq i:nth-child(2){height:9px;animation-delay:-.3s}.git-eq i:nth-child(3){height:6px;animation-delay:-.55s}@keyframes gitEq{from{transform:scaleY(.45)}to{transform:scaleY(1)}}.git-eq.is-paused i{animation-play-state:paused;transform:scaleY(.5)}
    .git-music-progress{position:absolute;left:16px;right:16px;bottom:-1px;height:2px;border-radius:2px;background:rgba(248,243,233,.12);overflow:hidden}.git-music-progress i{display:block;width:0;height:100%;background:var(--accent);transition:width .5s linear}

    .git-about-backdrop{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.68);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:28px;opacity:0;pointer-events:none;transition:opacity .25s ease}
    .git-about-backdrop.is-open{opacity:1;pointer-events:auto}
    .git-about-modal{position:relative;width:min(900px,94vw);max-height:min(82vh,820px);overflow:auto;background:rgba(17,22,21,.94);border:1px solid rgba(255,255,255,.16);border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08);padding:34px 36px 28px;color:#f8f3e9}
    .git-about-close{position:sticky;float:right;top:0;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.18);font-size:20px;cursor:pointer;z-index:2}
    .git-about-modal h3{margin:0 46px 22px 0;font:700 clamp(1.25rem,2.2vw,1.9rem)/1.15 var(--display);letter-spacing:-.02em}
    .git-about-modal p,.git-about-modal li{font:400 clamp(.92rem,1.25vw,1.05rem)/1.7 var(--body);color:rgba(248,243,233,.9)}
    .git-about-modal p{margin:0 0 16px}.git-about-modal ul{margin:0 0 18px;padding-left:22px}.git-about-modal li{margin:.35rem 0}.git-about-modal a{color:#f2b28e;text-decoration:underline;text-underline-offset:3px}.git-about-x{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin:8px auto 0;padding:11px 16px;border-radius:999px;background:#050605;border:1px solid rgba(255,255,255,.2);color:#fff!important;text-decoration:none!important;font:500 10px var(--mono)!important;letter-spacing:.08em;text-transform:uppercase}
    @media(max-width:800px){
      .viewer-info{top:43%;width:calc(100vw - 30px)}
      .viewer-quote{margin-bottom:15px;font-size:clamp(1.65rem,8.1vw,2.55rem);text-shadow:0 3px 12px rgba(0,0,0,.95),0 8px 26px rgba(0,0,0,.88),0 0 3px #000}
      .viewer-meta{max-width:calc(100vw - 42px);padding:7px 10px}
      .viewer-meta .viewer-name,.viewer-meta .viewer-profession,.viewer-meta .viewer-location{font-size:9px!important;letter-spacing:.055em!important}
      .archive-intro .home-link,.alt-view{top:max(48px,calc(env(safe-area-inset-top) + 34px))!important;min-height:35px!important;padding:10px 13px!important}
      .archive-intro .home-link{backdrop-filter:blur(12px) saturate(120%)!important;-webkit-backdrop-filter:blur(12px) saturate(120%)!important}
      .git-keyboard-hint{display:block!important;bottom:1px!important;font-size:7px!important}
      .git-parallax-layer{animation:gitMobileDrift 11s ease-in-out infinite alternate!important;transform-origin:center center!important}
      #viewer-media.git-parallax .git-parallax-layer{transform:scale(1.07) translate3d(0,0,0)}
      @keyframes gitMobileDrift{0%{transform:scale(1.07) translate3d(-7px,-4px,0)}50%{transform:scale(1.095) translate3d(4px,2px,0)}100%{transform:scale(1.07) translate3d(7px,-2px,0)}}
      @keyframes gitMobileCinematicFlash{0%{opacity:0;transform:scale(1.055)}14%{opacity:.34}38%{opacity:.14}100%{opacity:0;transform:scale(1)}}
      #viewer-media.git-cinematic:before{animation:gitMobileCinematicFlash .95s cubic-bezier(.2,.7,.2,1) both}
      .git-about-backdrop{padding:14px}.git-about-modal{max-height:88vh;padding:26px 20px 22px;border-radius:18px}.git-about-modal h3{font-size:1.35rem}.git-about-modal p,.git-about-modal li{font-size:.93rem;line-height:1.62}
    }
  `;document.head.appendChild(style);

  const reorderMeta=()=>{const info=document.querySelector('.viewer-info'),quote=document.getElementById('viewer-quote'),profession=document.getElementById('viewer-profession'),name=document.getElementById('viewer-name'),location=document.getElementById('viewer-location');if(!info||!quote||!profession||!name||!location)return;let meta=document.getElementById('viewer-meta');if(!meta){meta=document.createElement('div');meta.id='viewer-meta';meta.className='viewer-meta';info.insertBefore(meta,quote)}meta.append(name,profession,location);info.append(quote,meta)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reorderMeta,{once:true});else reorderMeta();

  const cityOnly=()=>{const el=document.getElementById('viewer-location');if(!el)return;const raw=(el.textContent||'').trim();if(raw.includes(',')){const city=raw.split(',')[0].trim();if(city&&city!==raw)el.textContent=city}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{cityOnly();const location=document.getElementById('viewer-location');if(location)new MutationObserver(cityOnly).observe(location,{childList:true,characterData:true,subtree:true})},{once:true});else{cityOnly();const location=document.getElementById('viewer-location');if(location)new MutationObserver(cityOnly).observe(location,{childList:true,characterData:true,subtree:true})}

  const preloadStoryImages=()=>{const stories=window.STORIES||[];const urls=[...new Set(stories.slice(0,2).flatMap(s=>s.images||[]).filter(Boolean))];urls.forEach(src=>{const img=new Image();img.decoding='async';img.fetchPriority='high';img.src=src})};
  preloadStoryImages();

  const thumbs=document.getElementById('story-thumbs');
  if(thumbs){const optimizeThumbs=()=>thumbs.querySelectorAll('img').forEach((img,i)=>{img.loading=i<4?'eager':'lazy';img.decoding='async';img.fetchPriority=i<2?'high':'low'});optimizeThumbs();new MutationObserver(optimizeThumbs).observe(thumbs,{childList:true,subtree:true})}

  const media=document.getElementById('viewer-media');
  if(media){
    media.classList.add('git-parallax');
    let raf=0;
    media.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch'||window.innerWidth<801)return;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{const r=media.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*10;const y=((e.clientY-r.top)/r.height-.5)*7;media.style.setProperty('--git-px',`${x.toFixed(2)}px`);media.style.setProperty('--git-py',`${y.toFixed(2)}px`)})
    });
    media.addEventListener('pointerleave',()=>{media.style.setProperty('--git-px','0px');media.style.setProperty('--git-py','0px')});
    const enhanceImages=()=>media.querySelectorAll('img').forEach(img=>img.classList.add('git-parallax-layer'));
    enhanceImages();
    let cinematicTimer=0;
    const triggerCinematic=()=>{media.classList.remove('git-cinematic');void media.offsetWidth;media.classList.add('git-cinematic');clearTimeout(cinematicTimer);cinematicTimer=setTimeout(()=>media.classList.remove('git-cinematic'),980)};
    new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='childList'&&m.addedNodes.length)){enhanceImages();triggerCinematic()}}).observe(media,{childList:true,subtree:true})
  }

  const setupHomepageCopy=()=>{
    document.title="What's your Indian Table?";
    const kicker=document.querySelector('.hero-kicker'),heading=document.querySelector('.hero h1'),cta=document.querySelector('.hero-cta');
    if(kicker)kicker.textContent='Music x Photographic - An archive of where India works!';
    if(heading)heading.innerHTML="What's your Indian <em>Table?</em>";
    if(cta){
      const textNode=[...cta.childNodes].find(n=>n.nodeType===3);if(textNode)textNode.textContent='Enter the Table ';
      let actions=document.querySelector('.hero-actions');
      if(!actions){
        actions=document.createElement('div');actions.className='hero-actions';cta.parentNode.insertBefore(actions,cta);actions.appendChild(cta);
        const info=document.createElement('button');info.type='button';info.className='hero-info-btn';info.setAttribute('aria-label','About this project');info.textContent='i';actions.appendChild(info);
        const backdrop=document.createElement('div');backdrop.className='git-about-backdrop';backdrop.setAttribute('aria-hidden','true');
        backdrop.innerHTML=`<div class="git-about-modal" role="dialog" aria-modal="true" aria-labelledby="git-about-title"><button class="git-about-close" type="button" aria-label="Close">×</button><h3 id="git-about-title">Hi! What's your Table is a fun side project by Suyash, Shashank, Sneha and Himanshu</h3><p>I, Himanshu, run <a href="https://indiafutureai.com/" target="_blank" rel="noopener noreferrer">IndiaFutureAI</a> where we upskill Indians and help them find jobs, funding for startups, and build a solid career.</p><p><a href="https://suyashsngh.github.io/things-that-stayed/" target="_blank" rel="noopener noreferrer">Suyash</a>, <a href="https://www.google.com/search?q=Shashank+AI+Creator+Fellow+IndiaFutureAI" target="_blank" rel="noopener noreferrer">Shashank</a>, and <a href="https://www.google.com/search?q=Sneha+AI+Creator+Fellow+IndiaFutureAI" target="_blank" rel="noopener noreferrer">Sneha</a> are accomplished AI CREATOR FELLOWS with exceptional skills on AI.</p><p>We pick fun projects and make them real with our AI skills. In 'What's your Table?' we visited the tables of 16 Indians who build the Bharat. A table is a personal space. Something you spend most of your time on!</p><p>Think of it: You live years living in your table. It sits silently in a corner of your room, under the stains of tea, grease of automotives, glue of bookbinder, pen marks of a student, and what not?</p><p>In such moments of 'personal' building, both self and country, music is a constant partner.</p><p>From an entrepreneur to creator, we all live in joy of music.</p><p>To materialize <em>Bharat ki table</em>, we researches and brought down some of conventional and unconventional tables of India. But I want you to know, these tables are symbolic of the region.</p><p>If you know (and love)</p><ul><li>Telugu music, go to Bangle Maker's table for a fun Telugu Playlist</li><li>Assamese? Boat maker!</li><li>Bengali? Book binder</li><li>Punjabi? Farmer</li></ul><p>...you see every table is celebrating some music</p><p>So, which table are you on? (aka which music did you love?)</p><p>Just take a screenshot of your favourite table and tweet to us at @indiafutureai to tell us about your fav Table!</p><p>Trust me, we love to listen just as we made this project; or shall I say, this table, with love!</p><div style="text-align:center"><a class="git-about-x" href="https://x.com/IndiaFutureAI" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">𝕏</span><span>@IndiaFutureAI</span></a></div></div>`;
        document.body.appendChild(backdrop);
        const close=()=>{backdrop.classList.remove('is-open');backdrop.setAttribute('aria-hidden','true');};
        info.addEventListener('click',()=>{backdrop.classList.add('is-open');backdrop.setAttribute('aria-hidden','false')});
        backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});backdrop.querySelector('.git-about-close').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('is-open'))close()});
      }
    }
    const archiveTitle=document.querySelector('.archive-intro h2');
    if(archiveTitle)archiveTitle.textContent='Your table is a story of your time, your age, and your...life!';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupHomepageCopy,{once:true});else setupHomepageCopy();
})();
