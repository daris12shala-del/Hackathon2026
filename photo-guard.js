(function(){
  if(document.body && document.body.dataset.page === 'myhome') return;
  const prefix='assets/fallback/';
  const idPattern=/(photo-[a-zA-Z0-9-]+)/;
  function fallback(img){
    if(!img || img.tagName!=='IMG' || img.dataset.fallbackApplied==='1') return;
    const candidate=img.getAttribute('data-fallback') || '';
    const src=img.currentSrc || img.src || '';
    const id=(src.match(idPattern)||[])[1];
    const path=candidate || (id ? prefix+id+'.svg' : '');
    if(!path || src.endsWith(path)) return;
    img.dataset.fallbackApplied='1';
    img.src=path;
  }
  document.addEventListener('error',function(event){fallback(event.target);},true);
  function scan(){
    document.querySelectorAll('img').forEach(img=>{
      if(img.complete && img.naturalWidth===0) fallback(img);
    });
  }
  window.addEventListener('load',scan);
  window.addEventListener('pageshow',scan);
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();
