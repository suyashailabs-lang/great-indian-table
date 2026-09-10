window.STORIES = [
  { id:"meena-devi", images:["assets/img/Tailor.PNG"], image:"assets/img/Tailor.PNG", profession:"Tailor", quote:"A stitch you rush is a stitch you redo. I have time for exactly one of those.", name:"Meena Devi", location:"Lucknow, Uttar Pradesh" },
  { id:"irfan-sheikh", images:["assets/img/Auto Mechanic.PNG"], image:"assets/img/Auto Mechanic.PNG", profession:"Auto Mechanic", quote:"Every engine tells you what's wrong. You just have to stop talking and listen.", name:"Irfan Sheikh", location:"Mumbai, Maharashtra" },
  { id:"lakshmi-kumhar", images:["assets/img/Potter.PNG"], image:"assets/img/Potter.PNG", profession:"Potter", quote:"The wheel doesn't lie. If your hand shakes, the pot shows it.", name:"Lakshmi Kumhar", location:"Jaipur, Rajasthan" },
  { id:"rahul-nair", images:["assets/img/Software Developer.PNG"], image:"assets/img/Software Developer.PNG", profession:"Software Developer", quote:"Good code is a letter to the next person who has to fix your mistakes.", name:"Rahul Nair", location:"Bengaluru, Karnataka" },
  { id:"farida-ansari", images:["assets/img/Banarasi Weaver.PNG"], image:"assets/img/Banarasi Weaver.PNG", profession:"Banarasi Weaver", quote:"A power loom copies the pattern. My hands copy my grandmother.", name:"Farida Ansari", location:"Varanasi, Uttar Pradesh" },
  { id:"suresh-poduval", images:["assets/img/fisherman.PNG","assets/img/Fisherman (2).PNG","assets/img/Fisherman (3).PNG"], image:"assets/img/fisherman.PNG", profession:"Fisherman", quote:"The sea gives you exactly what it wants to, not what you need.", name:"Suresh Poduval", location:"Kochi, Kerala" },
  { id:"ganesh-achari", images:["assets/img/Goldsmith.PNG"], image:"assets/img/Goldsmith.PNG", profession:"Goldsmith", quote:"Gold forgives almost nothing. That's why I still work slowly.", name:"Ganesh Achari", location:"Madurai, Tamil Nadu" },
  { id:"babulal-soni", images:["assets/img/Chai Stall Owner.PNG","assets/img/Chai Stall Owner (2).PNG"], image:"assets/img/Chai Stall Owner.PNG", profession:"Chai Stall Owner", quote:"People don't come back for the tea. They come back for five minutes of being asked how they are.", name:"Babulal Soni", location:"Jodhpur, Rajasthan" },
  { id:"noor-fatima", images:["assets/img/Bangle Maker.PNG"], image:"assets/img/Bangle Maker.PNG", profession:"Bangle Maker", quote:"No two of my bangles are the same, even when the customer asks for that.", name:"Noor Fatima", location:"Hyderabad, Telangana" },
  { id:"bipul-das", images:["assets/img/Boat Builder.PNG","assets/img/Boat Builder (2).PNG"], image:"assets/img/Boat Builder.PNG", profession:"Boat Builder", quote:"A boat has to trust the water before anyone else does.", name:"Bipul Das", location:"Guwahati, Assam" },
  { id:"kiran-singh", images:["assets/img/Farmer.PNG","assets/img/Farmer (2).PNG"], image:"assets/img/Farmer.PNG", profession:"Farmer", quote:"The land doesn't care about your plans. It only cares about your patience.", name:"Kiran Singh", location:"Amritsar, Punjab" },
  { id:"arjun-vishwakarma", images:["assets/img/Truck & Rickshaw Painter.PNG"], image:"assets/img/Truck & Rickshaw Painter.PNG", profession:"Truck & Rickshaw Painter", quote:"A sticker peels off in a year. My paint fades with the truck.", name:"Arjun Vishwakarma", location:"Delhi, Delhi" },
  { id:"manisha-bose", images:["assets/img/Bookbinder.PNG","assets/img/Bookbinder (2).PNG"], image:"assets/img/Bookbinder.PNG", profession:"Bookbinder", quote:"A repaired book still remembers being broken. That's what makes it honest.", name:"Manisha Bose", location:"Kolkata, West Bengal" },
  { id:"devika-bhat", images:["assets/img/Puppeteer.PNG"], image:"assets/img/Puppeteer.PNG", profession:"Puppeteer", quote:"The puppet doesn't move. My hand does. People just forget that on purpose.", name:"Devika Bhat", location:"Udaipur, Rajasthan" },
  { id:"thomas-varghese", images:["assets/img/Carpenter.PNG","assets/img/Carpenter-2.PNG"], image:"assets/img/Carpenter.PNG", profession:"Carpenter", quote:"Furniture should outlive the person who ordered it. That's the whole job.", name:"Thomas Varghese", location:"Kochi, Kerala" },
  { id:"priya-deshmukh", images:["assets/img/Graphic Designer.PNG","assets/img/Graphic Designer (2).PNG"], image:"assets/img/Graphic Designer.PNG", profession:"Graphic Designer", quote:"Everyone has an opinion on design. Not everyone has a reason for it.", name:"Priya Deshmukh", location:"Pune, Maharashtra" },
  { id:"mahesh-yadav", images:["assets/img/IMG_1388.PNG"], image:"assets/img/IMG_1388.PNG", profession:"Truck Driver", quote:"You learn a country by the roads you keep taking after everyone else has gone home.", name:"Mahesh Yadav", location:"Indore, Madhya Pradesh" },
  { id:"aditi-sharma", images:["assets/img/IMG_1389.PNG"], image:"assets/img/IMG_1389.PNG", profession:"UPSC Aspirant", quote:"Some tables hold books. Mine holds a future I am still trying to earn.", name:"Aditi Sharma", location:"Prayagraj, Uttar Pradesh" }
];

/* Compatibility layer for the current full-screen viewer.
   The viewer historically expected `image`; stories now use `images` so a profession
   can contain alternate photographs. This layer adds the Alt View control without
   changing the existing navigation or metadata rendering. */
(function(){
  const ALT = Object.create(null);
  const css = document.createElement('style');
  css.textContent = `
    .alt-view-btn{display:none;align-items:center;gap:9px;padding:7px 0;color:rgba(248,243,233,.92);font:500 10px var(--mono);letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid rgba(248,243,233,.45);transition:opacity .25s ease,transform .25s ease}
    .alt-view-btn.is-visible{display:inline-flex}
    .alt-view-btn:hover{transform:translateX(3px);border-color:#ef9a7e}
    .alt-view-count{opacity:.55;font-size:9px}
    .viewer-media.alt-transition img{opacity:0;transform:scale(1.035) translateX(18px);filter:blur(2px)}
    .viewer-media.alt-transition:before{content:"";position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(16,22,21,.12),transparent 45%);opacity:0;transition:opacity .45s ease;pointer-events:none}
    .viewer-media.alt-transition:before{opacity:1}
    .spotify-player{z-index:30!important;display:block!important;visibility:visible!important;pointer-events:auto!important}
    .spotify-player iframe{display:block!important;visibility:visible!important;opacity:1!important;height:80px!important;min-height:80px!important}
    @media(max-width:800px){.alt-view-btn{font-size:9px}.spotify-player{z-index:30!important;bottom:82px!important}}
  `;
  document.head.appendChild(css);

  function getCurrent(){
    const active=document.querySelector('.story-thumb.is-active');
    const index=active?Number(active.dataset.thumb):0;
    return {story:window.STORIES[index],index};
  }

  function ensureAltButton(){
    const actions=document.querySelector('.viewer-actions');
    if(!actions || document.querySelector('.alt-view-btn')) return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='alt-view-btn';
    btn.innerHTML='<span>Alt View</span><span class="alt-view-count"></span>';
    btn.addEventListener('click',function(){
      const {story,index}=getCurrent();
      if(!story || !story.images || story.images.length<2) return;
      ALT[index]=(ALT[index]||0)+1;
      if(ALT[index]>=story.images.length) ALT[index]=0;
      const next=story.images[ALT[index]];
      const media=document.getElementById('viewer-media');
      if(!media || !next) return;
      media.classList.add('alt-transition');
      setTimeout(()=>{
        const old=media.querySelector('img');
        const img=new Image();
        img.alt=(story.name||'')+' table in '+(story.location||'');
        img.src=next;
        img.onload=()=>{
          if(old) old.replaceWith(img); else media.appendChild(img);
          requestAnimationFrame(()=>media.classList.remove('alt-transition'));
        };
      },180);
      updateAltButton();
    });
    actions.appendChild(btn);
  }

  function updateAltButton(){
    const btn=document.querySelector('.alt-view-btn');
    if(!btn) return;
    const {story,index}=getCurrent();
    const has=!!(story && story.images && story.images.length>1);
    btn.classList.toggle('is-visible',has);
    const count=btn.querySelector('.alt-view-count');
    if(has){
      const current=(ALT[index]||0)+1;
      count.textContent=current+' / '+story.images.length;
    }
  }

  const observer=new MutationObserver(()=>{ensureAltButton();updateAltButton();});
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-thumb']});
  setTimeout(()=>{ensureAltButton();updateAltButton();},250);

  /* Spotify safety fallback: the official iFrame API replaces the host element with
     its player. If a browser/network blocks the API script, provide the same single
     compact embed instead of leaving an empty space. */
  setTimeout(()=>{
    const host=document.getElementById('spotify-player');
    if(!host || host.querySelector('iframe')) return;
    const iframe=document.createElement('iframe');
    iframe.title='Table soundtrack';
    iframe.src='https://open.spotify.com/embed/playlist/656d91JastxforR4ac4eIs?utm_source=generator&theme=0';
    iframe.width='100%'; iframe.height='80'; iframe.frameBorder='0';
    iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.loading='lazy';
    host.replaceChildren(iframe);
  },4500);
})();