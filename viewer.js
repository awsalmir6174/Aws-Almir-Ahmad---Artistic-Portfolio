
(function(){
  var dlg=document.getElementById('viewer'),
      img=document.getElementById('viewer-img'),
      cap=document.getElementById('viewer-cap'),
      cnt=document.getElementById('viewer-count'),
      plates=[].slice.call(document.querySelectorAll('[data-plate]')),
      seen={}, order=[], idx=0;
  plates.forEach(function(b){
    var k=b.getAttribute('data-key');
    if(!seen[k]){ seen[k]=true; order.push(b); }
  });
  function show(i){
    if(i<0) i=order.length-1;
    if(i>=order.length) i=0;
    idx=i;
    var b=order[i], im=b.querySelector('img');
    img.src=im.getAttribute('data-full')||im.src;
    img.alt=im.alt;
    cap.textContent=b.getAttribute('data-cap');
    cnt.textContent=(i+1)+' of '+order.length;
  }
  plates.forEach(function(b){
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-key'), i=0;
      order.forEach(function(o,n){ if(o.getAttribute('data-key')===k) i=n; });
      show(i);
      if(dlg.showModal) dlg.showModal();
    });
  });
  document.getElementById('viewer-prev').addEventListener('click',function(e){e.stopPropagation();show(idx-1);});
  document.getElementById('viewer-next').addEventListener('click',function(e){e.stopPropagation();show(idx+1);});
  dlg.addEventListener('click',function(e){ if(e.target===dlg) dlg.close(); });
  document.getElementById('viewer-close').addEventListener('click',function(){dlg.close();});
  dlg.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();show(idx-1);}
    if(e.key==='ArrowRight'){e.preventDefault();show(idx+1);}
  });
})();

(function(){
  /* view toggle */
  var b=document.body, tT=document.getElementById('t-timeline'), tG=document.getElementById('t-grid');
  if(tT&&tG){
  function setView(v){
    b.classList.toggle('grid-view', v==='grid');
    tT.setAttribute('aria-pressed', String(v!=='grid'));
    tG.setAttribute('aria-pressed', String(v==='grid'));
  }
  tT.addEventListener('click',function(){setView('timeline');});
  tG.addEventListener('click',function(){setView('grid');});
  }

  /* active section in nav */
  var links=[].slice.call(document.querySelectorAll('nav.top a'));
  var targets=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){a.removeAttribute('aria-current');});
          var i=targets.indexOf(e.target);
          if(i>-1) links[i].setAttribute('aria-current','true');
        }
      });
    },{rootMargin:'-20% 0px -70% 0px'});
    targets.forEach(function(t){if(t) io.observe(t);});
  }

  /* video facades */
  document.querySelectorAll('.vid').forEach(function(v){
    v.addEventListener('click',function(){
      var id=v.getAttribute('data-id');
      v.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0" title="Recording" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      v.style.cursor='default';
    });
  });
})();
