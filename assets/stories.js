/* Thin override layer: preserve the existing stories implementation in a renamed blob,
   then apply the latest copy/link corrections after the original setup runs. */
document.write('<script src="assets/stories.base.js?v=20260912-1"><\/script>');

(function(){
  const applyCorrections=()=>{
    document.title="Whats on your indian table?";

    const applyHeading=()=>{
      const heading=document.querySelector('.hero h1');
      if(heading){
        heading.innerHTML="Whats on your <em>indian table?</em>";
        heading.setAttribute('aria-label','Whats on your indian table?');
      }
    };
    applyHeading();
    setTimeout(applyHeading,0);
    setTimeout(applyHeading,100);
    setTimeout(applyHeading,500);

    const fixAbout=()=>{
      const modal=document.querySelector('.git-about-modal');
      if(!modal)return false;

      modal.querySelectorAll('a').forEach(a=>{
        if((a.textContent||'').trim()==='Suyash'){
          a.href='https://x.com/suyashsngh';
          a.target='_blank';
          a.rel='noopener noreferrer';
        }
      });

      const walker=document.createTreeWalker(modal,NodeFilter.SHOW_TEXT);
      const nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{
        if(node.nodeValue&&node.nodeValue.includes('we researches')){
          node.nodeValue=node.nodeValue.replace(/we researches/g,'we researched');
        }
      });
      return true;
    };

    if(!fixAbout()){
      const observer=new MutationObserver(()=>{
        if(fixAbout())observer.disconnect();
      });
      observer.observe(document.body,{childList:true,subtree:true});
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyCorrections,{once:true});
  else applyCorrections();
})();
