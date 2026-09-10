window.STORIES = [
  { id:"meena-devi", images:["assets/img/Tailor.PNG","assets/img/Hero.JPEG"], image:"assets/img/Tailor.PNG", profession:"Tailor", quote:"A stitch you rush is a stitch you redo. I have time for exactly one of those.", name:"Meena Devi", location:"Lucknow, Uttar Pradesh" },
  { id:"irfan-sheikh", images:["assets/img/Auto Mechanic.PNG","assets/img/Auto Mechanic (2).PNG"], image:"assets/img/Auto Mechanic.PNG", profession:"Auto Mechanic", quote:"Every engine tells you what's wrong. You just have to stop talking and listen.", name:"Irfan Sheikh", location:"Mumbai, Maharashtra" },
  { id:"lakshmi-kumhar", images:["assets/img/Potter.PNG","assets/img/Potter (2).PNG"], image:"assets/img/Potter.PNG", profession:"Potter", quote:"The wheel doesn't lie. If your hand shakes, the pot shows it.", name:"Lakshmi Kumhar", location:"Jaipur, Rajasthan" },
  { id:"rahul-nair", images:["assets/img/Software Developer.PNG","assets/img/Software Developer (2).PNG"], image:"assets/img/Software Developer.PNG", profession:"Software Developer", quote:"Good code is a letter to the next person who has to fix your mistakes.", name:"Rahul Nair", location:"Bengaluru, Karnataka" },
  { id:"farida-ansari", images:["assets/img/Banarasi Weaver.PNG","assets/img/Banarasi Weaver (2).PNG"], image:"assets/img/Banarasi Weaver.PNG", profession:"Banarasi Weaver", quote:"A power loom copies the pattern. My hands copy my grandmother.", name:"Farida Ansari", location:"Varanasi, Uttar Pradesh" },
  { id:"suresh-poduval", images:["assets/img/fisherman.PNG","assets/img/Fisherman (2).PNG","assets/img/Fisherman (3).PNG"], image:"assets/img/fisherman.PNG", profession:"Fisherman", quote:"The sea gives you exactly what it wants to, not what you need.", name:"Suresh Poduval", location:"Kochi, Kerala" },
  { id:"ganesh-achari", images:["assets/img/Goldsmith.PNG","assets/img/Goldsmith (2).PNG"], image:"assets/img/Goldsmith.PNG", profession:"Goldsmith", quote:"Gold forgives almost nothing. That's why I still work slowly.", name:"Ganesh Achari", location:"Madurai, Tamil Nadu" },
  { id:"babulal-soni", images:["assets/img/Chai Stall Owner.PNG","assets/img/Chai Stall Owner (2).PNG"], image:"assets/img/Chai Stall Owner.PNG", profession:"Chai Stall Owner", quote:"People don't come back for the tea. They come back for five minutes of being asked how they are.", name:"Babulal Soni", location:"Jodhpur, Rajasthan" },
  { id:"noor-fatima", images:["assets/img/Bangle Maker.PNG","assets/img/Bangle Maker (2).PNG"], image:"assets/img/Bangle Maker.PNG", profession:"Bangle Maker", quote:"No two of my bangles are the same, even when the customer asks for that.", name:"Noor Fatima", location:"Hyderabad, Telangana" },
  { id:"bipul-das", images:["assets/img/Boat Builder.PNG","assets/img/Boat Builder (2).PNG"], image:"assets/img/Boat Builder.PNG", profession:"Boat Builder", quote:"A boat has to trust the water before anyone else does.", name:"Bipul Das", location:"Guwahati, Assam" },
  { id:"kiran-singh", images:["assets/img/Farmer.PNG","assets/img/Farmer (2).PNG"], image:"assets/img/Farmer.PNG", profession:"Farmer", quote:"The land doesn't care about your plans. It only cares about your patience.", name:"Kiran Singh", location:"Amritsar, Punjab" },
  { id:"arjun-vishwakarma", images:["assets/img/Truck & Rickshaw Painter.PNG","assets/img/Truck & Rickshaw Painter (2).PNG"], image:"assets/img/Truck & Rickshaw Painter.PNG", profession:"Truck & Rickshaw Painter", quote:"A sticker peels off in a year. My paint fades with the truck.", name:"Arjun Vishwakarma", location:"Delhi, Delhi" },
  { id:"manisha-bose", images:["assets/img/Bookbinder.PNG","assets/img/Bookbinder (2).PNG"], image:"assets/img/Bookbinder.PNG", profession:"Bookbinder", quote:"A repaired book still remembers being broken. That's what makes it honest.", name:"Manisha Bose", location:"Kolkata, West Bengal" },
  { id:"devika-bhat", images:["assets/img/Puppeteer.PNG","assets/img/Puppeteer (2).PNG"], image:"assets/img/Puppeteer.PNG", profession:"Puppeteer", quote:"The puppet doesn't move. My hand does. People just forget that on purpose.", name:"Devika Bhat", location:"Udaipur, Rajasthan" },
  { id:"thomas-varghese", images:["assets/img/Carpenter.PNG","assets/img/Carpenter-2.PNG"], image:"assets/img/Carpenter.PNG", profession:"Carpenter", quote:"Furniture should outlive the person who ordered it. That's the whole job.", name:"Thomas Varghese", location:"Kochi, Kerala" },
  { id:"priya-deshmukh", images:["assets/img/Graphic Designer.PNG","assets/img/Graphic Designer (2).PNG"], image:"assets/img/Graphic Designer.PNG", profession:"Graphic Designer", quote:"Everyone has an opinion on design. Not everyone has a reason for it.", name:"Priya Deshmukh", location:"Pune, Maharashtra" },
  { id:"mahesh-yadav", images:["assets/img/Truck Driver.PNG","assets/img/Truck Driver (2).PNG"], image:"assets/img/Truck Driver.PNG", profession:"Truck Driver", quote:"You learn a country by the roads you keep taking after everyone else has gone home.", name:"Mahesh Yadav", location:"Indore, Madhya Pradesh" },
  { id:"aditi-sharma", images:["assets/img/UPSC.PNG","assets/img/UPSC (2).PNG"], image:"assets/img/UPSC.PNG", profession:"UPSC Aspirant", quote:"Some tables hold books. Mine holds a future I am still trying to earn.", name:"Aditi Sharma", location:"Prayagraj, Uttar Pradesh" }
];

(function(){
  const style=document.createElement('style');
  style.textContent=`
    .hero:after{background:linear-gradient(180deg,rgba(8,12,11,.08) 0%,rgba(8,12,11,.16) 48%,rgba(8,12,11,.38) 100%)}
    .hero-copy{text-shadow:0 3px 28px rgba(0,0,0,.58)}
    @media(max-width:800px){
      .hero-media{inset:-5%;transform:scale(1.02);background-position:center bottom}
      .hero-copy{width:calc(100vw - 28px);transform:translateY(-9vh)}
      .hero-kicker{font-size:10px;margin-bottom:18px;letter-spacing:.12em}
      .hero h1{font-size:clamp(2.8rem,14vw,5rem);line-height:.96}
      .hero-cta{margin-top:28px;padding:15px 0;font-size:10px}
      .archive-intro{top:max(14px,env(safe-area-inset-top));padding-top:4px}
      .archive-intro h2{font-size:8px;letter-spacing:.15em}
      .home-link{left:14px;font-size:10px}
      .viewer-info{top:43%;width:calc(100vw - 58px);transform:translate(-50%,-40%)}
      .viewer-profession{font-size:9px;margin-bottom:10px}
      .viewer-name{font-size:1rem;margin-bottom:9px}
      .viewer-quote{font-size:clamp(1.65rem,8.1vw,2.55rem);line-height:1.13;max-width:100%;text-shadow:0 3px 22px rgba(0,0,0,.72)}
      .viewer-location{font-size:8px}
      .viewer-arrow{font-size:2rem;padding:24px;opacity:.8}
      .viewer-arrow:first-child{left:0}.viewer-arrow:last-of-type{right:0}
      .alt-view{top:max(48px,calc(env(safe-area-inset-top) + 34px));right:12px;padding:11px 14px;font-size:9px}
      .music-player{left:8px;right:8px;bottom:78px;transform:none;width:auto;height:78px;border-radius:20px;padding:9px 12px;box-shadow:0 14px 42px rgba(0,0,0,.52);background:rgba(13,18,17,.93)}
      .music-art{width:58px;height:58px;flex-basis:58px}
      .music-copy{padding:0 14px}.music-kicker{font-size:8px;margin-bottom:5px}.music-title{font-size:13px}
      .music-controls{gap:5px}.music-controls button{width:44px;height:44px;font-size:19px}.music-play{font-size:16px!important}.music-open{display:none!important}
      .story-thumbs{left:10px;right:10px;bottom:6px;gap:8px;padding:7px 3px 9px}
      .story-thumb{flex:0 0 76px;height:50px;border-radius:3px;opacity:.58}
      .story-thumb span{font-size:8px;left:6px;bottom:5px}.story-thumb.is-active{transform:translateY(-4px)}
    }
    @media(max-width:420px){
      .viewer-info{top:41%;width:calc(100vw - 54px)}
      .viewer-quote{font-size:clamp(1.55rem,7.8vw,2.2rem)}
      .music-player{bottom:76px;height:74px;left:7px;right:7px;padding:8px 10px}
      .music-art{width:54px;height:54px;flex-basis:54px}
      .music-copy{padding:0 10px}.music-title{font-size:12px}
      .music-controls{gap:3px}.music-controls button{width:41px;height:41px;font-size:18px}
      .story-thumb{flex-basis:70px;height:46px}
    }
  `;
  document.head.appendChild(style);
})();
