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

/* First micro-animation experiment: a nearly imperceptible water trace on the distant window in the Software Developer photograph. */
(()=>{
  const install=()=>{
    if(document.getElementById('story-micro-motion-style'))return;
    const style=document.createElement('style');
    style.id='story-micro-motion-style';
    style.textContent=`
      .story-micro-motion{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .7s ease;overflow:hidden}
      .story-micro-motion.software-rain{opacity:1}
      .software-rain .drop{position:absolute;top:-8%;width:1.5px;height:38px;border-radius:999px;background:linear-gradient(to bottom,rgba(235,246,245,0),rgba(220,242,241,.28),rgba(255,255,255,.5),rgba(220,242,241,0));filter:blur(.25px);animation:windowDrip 4.8s linear infinite}
      .software-rain .drop:nth-child(1){left:73%;animation-delay:-1.7s;height:34px}
      .software-rain .drop:nth-child(2){left:77%;animation-delay:-3.4s;height:52px;opacity:.7}
      .software-rain .drop:nth-child(3){left:81%;animation-delay:-.8s;height:29px;opacity:.52}
      .software-rain .drop:nth-child(4){left:84%;animation-delay:-2.9s;height:44px;opacity:.62}
      .software-rain .drop:nth-child(5){left:88%;animation-delay:-4.1s;height:32px;opacity:.48}
      .software-rain .drop:nth-child(6){left:91%;animation-delay:-1.1s;height:48px;opacity:.55}
      @keyframes windowDrip{0%{transform:translate3d(0,-18px,0);opacity:0}10%{opacity:.34}68%{opacity:.24}100%{transform:translate3d(2px,112vh,0);opacity:0}}
      @media(prefers-reduced-motion:reduce){.story-micro-motion{display:none}}
    `;
    document.head.appendChild(style);
    const media=document.getElementById('viewer-media');
    if(!media)return;
    const layer=document.createElement('div');
    layer.id='story-micro-motion';
    layer.className='story-micro-motion';
    layer.innerHTML='<div class="drop"></div><div class="drop"></div><div class="drop"></div><div class="drop"></div><div class="drop"></div><div class="drop"></div>';
    media.appendChild(layer);
    const profession=document.getElementById('viewer-profession');
    const sync=()=>layer.classList.toggle('software-rain',profession?.textContent.trim()==='Software Developer');
    new MutationObserver(sync).observe(profession,{childList:true,characterData:true,subtree:true});
    sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
