window.STORIES = [
  { id:"meena-devi", images:["assets/img/Tailor.PNG","assets/img/Hero.JPEG"], image:"assets/img/Tailor.PNG", profession:"Tailor", quote:"A stitch you rush is a stitch you redo. I have time for exactly one of those.", name:"Meena Devi", location:"Lucknow, Uttar Pradesh" },
  { id:"irfan-sheikh", images:["assets/img/Auto Mechanic.PNG","assets/img/Auto Mechanic (2).PNG"], image:"assets/img/Auto Mechanic.PNG", profession:"Auto Mechanic", quote:"Every engine tells you what's wrong. You just have to stop talking and listen.", name:"Irfan Sheikh", location:"Mumbai, Maharashtra" },
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
  { id:"priya-deshmukh", images:["assets/img/Graphic Designer.PNG","assets/img/Graphic Designer (2).PNG"], image:"assets/img/Graphic Designer.PNG", profession:"Freelancer", quote:"Everyone has an opinion on design. Not everyone has a reason for it.", name:"Priya Deshmukh", location:"Pune, Maharashtra" },
  { id:"mahesh-yadav", images:["assets/img/Truck Driver.PNG","assets/img/Truck Driver (2).PNG"], image:"assets/img/Truck Driver.PNG", profession:"Truck Driver", quote:"You learn a country by the roads you keep taking after everyone else has gone home.", name:"Mahesh Yadav", location:"Indore, Madhya Pradesh" },
  { id:"aditi-sharma", images:["assets/img/UPSC.PNG","assets/img/UPSC (2).PNG"], image:"assets/img/UPSC.PNG", profession:"UPSC Aspirant", quote:"Some tables hold books. Mine holds a future I am still trying to earn.", name:"Aditi Sharma", location:"Prayagraj, Uttar Pradesh" }
];

(function(){
  const style=document.createElement('style');
  style.textContent=`
    .hero:after{background:linear-gradient(180deg,rgba(8,12,11,.08) 0%,rgba(8,12,11,.16) 48%,rgba(8,12,11,.38) 100%)}
    .hero-copy{text-shadow:0 3px 28px rgba(0,0,0,.58)}
    @keyframes gitCinematicFlash{0%{opacity:0;transform:scale(1.02)}18%{opacity:.16}100%{opacity:0;transform:scale(1)}}
    @keyframes gitCopyIn{0%{opacity:.2;transform:translate(-50%,-38%) translateY(10px)}100%{opacity:1;transform:translate(-50%,-42%) translateY(0)}}
    #viewer-media.git-cinematic:before{content:"";position:absolute;inset:0;z-index:4;background:#050807;pointer-events:none;animation:gitCinematicFlash .72s cubic-bezier(.2,.7,.2,1) both}
    #viewer-media.git-cinematic + .viewer-info{animation:gitCopyIn .72s cubic-bezier(.2,.7,.2,1) both}
    .git-parallax-layer{will-change:transform;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}
    #viewer-media.git-parallax .git-parallax-layer{transform:scale(1.035) translate3d(var(--git-px,0px),var(--git-py,0px),0)}
    .git-random{display:none!important}
    .git-music-enhanced{gap:8px}
    .git-track-count{font:7px var(--mono);letter-spacing:.12em;opacity:.48;margin-left:7px;white-space:nowrap}
    .git-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px;margin-left:6px;vertical-align:middle;opacity:.7}
    .git-eq i{display:block;width:2px;height:5px;background:currentColor;border-radius:2px;animation:gitEq .75s ease-in-out infinite alternate}
    .git-eq i:nth-child(2){height:9px;animation-delay:-.3s}.git-eq i:nth-child(3){height:6px;animation-delay:-.55s}
    @keyframes gitEq{from{transform:scaleY(.45)}to{transform:scaleY(1)}}
    .git-eq.is-paused i{animation-play-state:paused;transform:scaleY(.5)}
    .git-music-progress{position:absolute;left:16px;right:16px;bottom:-1px;height:2px;border-radius:2px;background:rgba(248,243,233,.12);overflow:hidden}
    .git-music-progress i{display:block;width:0;height:100%;background:var(--accent);transition:width .5s linear}
    .viewer-info{width:min(1100px,88vw);text-shadow:0 2px 30px rgba(0,0,0,.72)}
    .viewer-name,.viewer-profession,.viewer-location{display:inline!important;margin:0!important;font:500 10px var(--mono)!important;letter-spacing:.1em!important;text-transform:uppercase!important;opacity:.9!important;vertical-align:middle!important}
    .viewer-profession:after,.viewer-name:after{content:"  ·  ";opacity:.45;margin:0 .35em}
    .viewer-quote{text-shadow:0 3px 12px rgba(0,0,0,.95),0 8px 34px rgba(0,0,0,.82),0 0 3px rgba(0,0,0,1)}
    .archive-intro .home-link,.alt-view{top:34px!important;min-height:37px!important;padding:11px 15px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
    .git-keyboard-hint{left:50%!important;right:auto!important;bottom:2px!important;transform:translateX(-50%)!important;white-space:nowrap!important}
    @media(max-width:800px){
      .viewer-info{top:43%;width:calc(100vw - 38px)}
      .viewer-profession,.viewer-name,.viewer-location{font-size:8px!important;letter-spacing:.07em!important}
      .viewer-quote{font-size:clamp(1.65rem,8.1vw,2.55rem);text-shadow:0 3px 12px rgba(0,0,0,.95),0 8px 26px rgba(0,0,0,.88),0 0 3px #000}
      .archive-intro .home-link,.alt-view{top:max(48px,calc(env(safe-area-inset-top) + 34px))!important;min-height:35px!important;padding:10px 13px!important}
      .git-keyboard-hint{display:block!important;bottom:1px!important;font-size:7px!important}
    }
  `;
  document.head.appendChild(style);
})();

(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const random=document.querySelector('.git-random');if(random)random.remove();
    const profession=document.getElementById('viewer-profession'),name=document.getElementById('viewer-name'),location=document.getElementById('viewer-location');
    if(profession&&name&&location){
      const sync=()=>{name.setAttribute('data-meta',name.textContent||'');location.setAttribute('data-meta',location.textContent||'')};
      new MutationObserver(sync).observe(name,{childList:true,characterData:true,subtree:true});
      new MutationObserver(sync).observe(location,{childList:true,characterData:true,subtree:true});
    }
  });
})();
