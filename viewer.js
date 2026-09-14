
(function(){
  /* ---------- lightbox with zoom + rotate ---------- */
  var dlg=document.getElementById('viewer'), img=document.getElementById('viewer-img'),
      cap=document.getElementById('viewer-cap'), cnt=document.getElementById('viewer-count'),
      plates=[].slice.call(document.querySelectorAll('[data-plate]')),
      seen={}, order=[], idx=0, zoom=1, rot=0;

  plates.forEach(function(b){ var k=b.getAttribute('data-key');
    if(!seen[k]){ seen[k]=true; order.push(b); } });

  function apply(){ img.style.transform='rotate('+rot+'deg) scale('+zoom+')'; }
  function show(i){
    if(!order.length) return;
    if(i<0) i=order.length-1;
    if(i>=order.length) i=0;
    idx=i; zoom=1; rot=0; apply();
    var b=order[i], im=b.querySelector('img');
    img.src=im.getAttribute('data-full')||im.src;
    img.alt=im.alt||'';
    cap.textContent=b.getAttribute('data-cap')||'';
    cnt.textContent=(i+1)+' of '+order.length;
  }
  plates.forEach(function(b){
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-key'), i=0;
      order.forEach(function(o,n){ if(o.getAttribute('data-key')===k) i=n; });
      show(i); if(dlg.showModal) dlg.showModal();
    });
  });
  function on(id,fn){ var e=document.getElementById(id); if(e) e.addEventListener('click',function(ev){ev.stopPropagation();fn();}); }
  on('viewer-prev',function(){show(idx-1);});
  on('viewer-next',function(){show(idx+1);});
  on('z-in',function(){ zoom=Math.min(zoom*1.35,8); apply(); });
  on('z-out',function(){ zoom=Math.max(zoom/1.35,.4); apply(); });
  on('r-left',function(){ rot=(rot-90)%360; apply(); });
  on('r-right',function(){ rot=(rot+90)%360; apply(); });
  on('reset',function(){ zoom=1; rot=0; apply(); });
  on('viewer-close',function(){ dlg.close(); });

  img.addEventListener('dblclick',function(){ zoom = zoom>1 ? 1 : 2.2; apply(); });
  img.addEventListener('wheel',function(e){
    if(!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoom = Math.min(8, Math.max(.4, zoom * (e.deltaY<0?1.12:1/1.12))); apply();
  },{passive:false});

  dlg.addEventListener('click',function(e){ if(e.target===dlg) dlg.close(); });
  dlg.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();show(idx-1);}
    else if(e.key==='ArrowRight'){e.preventDefault();show(idx+1);}
    else if(e.key==='+'||e.key==='='){e.preventDefault();zoom=Math.min(zoom*1.35,8);apply();}
    else if(e.key==='-'){e.preventDefault();zoom=Math.max(zoom/1.35,.4);apply();}
    else if(e.key.toLowerCase()==='r'){e.preventDefault();rot=(rot+90)%360;apply();}
    else if(e.key==='0'){e.preventDefault();zoom=1;rot=0;apply();}
  });

  /* ---------- timeline / grid toggle ---------- */
  var body=document.body, tT=document.getElementById('t-timeline'), tG=document.getElementById('t-grid');
  if(tT&&tG){
    function setView(v){
      body.classList.toggle('grid-view', v==='grid');
      tT.setAttribute('aria-pressed', String(v!=='grid'));
      tG.setAttribute('aria-pressed', String(v==='grid'));
    }
    tT.addEventListener('click',function(){setView('timeline');});
    tG.addEventListener('click',function(){setView('grid');});
  }

  /* ---------- active section in nav ---------- */
  var links=[].slice.call(document.querySelectorAll('nav.top a')),
      targets=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){a.removeAttribute('aria-current');});
          var i=targets.indexOf(e.target);
          if(i>-1) links[i].setAttribute('aria-current','true');
        }
      });
    },{rootMargin:'-18% 0px -72% 0px'});
    targets.forEach(function(t){ if(t) io.observe(t); });
  }

  /* ---------- video facades ---------- */
  function mount(el){
    var id=el.getAttribute('data-id');
    el.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0" title="Recording" '+
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    el.style.cursor='default';
  }
  document.querySelectorAll('[data-id]').forEach(function(el){
    el.addEventListener('click',function(){mount(el);});
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();mount(el);} });
  });
})();
