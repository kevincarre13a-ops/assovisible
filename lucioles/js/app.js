(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc=function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var getJSON=function(u){return fetch(u).then(function(r){if(!r.ok)throw 0;return r.json()})};

  // Burger
  var b=$('.burger'),nav=$('.nav');
  if(b){b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');b.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');b.setAttribute('aria-expanded','false')}})}

  // Fireflies appearing with scroll
  var box=$('.fireflies');
  if(box&&!reduce){
    var N=22,flies=[];
    for(var i=0;i<N;i++){
      var f=document.createElement('i');f.className='fly';
      f.style.left=(Math.random()*96+1)+'vw';f.style.top=(Math.random()*92+2)+'vh';
      f.style.setProperty('--x',(Math.random()*80-40)+'px');f.style.setProperty('--y',(Math.random()*80-50)+'px');
      f.style.setProperty('--d',(7+Math.random()*8)+'s');f.style.setProperty('--o',(.45+Math.random()*.5).toFixed(2));
      f.style.width=f.style.height=(6+Math.random()*7)+'px';
      box.appendChild(f);flies.push(f)}
    var upd=function(){
      var max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=Math.min(1,scrollY/max),k=Math.ceil(4+p*(N-4));
      flies.forEach(function(f,i){f.classList.toggle('on',i<k)})};
    addEventListener('scroll',upd,{passive:true});upd();
  }

  // Reveal + counters
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15}):null;
  var watch=function(root){$$('.reveal',root).forEach(function(el){io?io.observe(el):el.classList.add('in')})};
  watch();
  $$('[data-count]').forEach(function(el){
    var end=+el.dataset.count,done=false;
    var run=function(){if(done)return;done=true;if(reduce){el.textContent=end;return}
      var t0=performance.now(),d=1600;(function step(t){var p=Math.min(1,(t-t0)/d);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})(t0)};
    if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){run();o.disconnect()}},{threshold:.5}).observe(el)}else{el.textContent=end}
  });
  $$('[data-years]').forEach(function(el){el.dataset.count=new Date().getFullYear()-(+el.dataset.years)});

  // Data: next event / events
  var MONTHS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var eventCard=function(e,archive){
    var d=e.date?new Date(e.date+'T12:00:00'):null;
    var when=d?d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):(e.dateLabel||'Date à venir');
    return '<article class="card reveal"><span class="tag">'+esc(archive?'Archive':'À venir')+'</span><h3>'+esc(e.title)+'</h3><p><strong>'+esc(when)+'</strong>'+(e.place?' · '+esc(e.place):'')+'</p><p>'+esc(e.description)+'</p></article>'};

  var nextEl=$('#next-event');
  var evBox=$('#events-upcoming');
  if(nextEl||evBox||$('#events-archive')||$('#formats')){
    getJSON('data/events.json').then(function(ev){
      var up=ev.upcoming.slice().sort(function(a,b){return (a.date||'9').localeCompare(b.date||'9')});
      if(nextEl){var n=up[0],d=n&&n.date?new Date(n.date+'T12:00:00'):null;
        nextEl.innerHTML='<div class="date-bubble">'+(d?'<span><small>'+MONTHS[d.getMonth()]+'</small><strong>'+d.getDate()+'</strong></span>':'<span>Bientôt<br>✦</span>')+'</div><div><h3>'+esc(n.title)+'</h3><p>'+esc(n.description)+'</p>'+(n.place?'<p><strong>📍 '+esc(n.place)+'</strong></p>':'')+'<a class="btn btn-gold" href="evenements.html">Voir l\'agenda</a></div>'}
      if(evBox){evBox.innerHTML=up.map(function(e){return eventCard(e)}).join('');watch(evBox)}
      var ar=$('#events-archive');if(ar){ar.innerHTML=ev.archive.map(function(e){return eventCard(e,1)}).join('');watch(ar)}
      var fm=$('#formats');if(fm){fm.innerHTML=ev.formats.map(function(f){return '<div class="card reveal"><span class="ico" aria-hidden="true">'+f.icon+'</span><h3>'+esc(f.title)+'</h3><p>'+esc(f.text)+'</p></div>'}).join('');watch(fm)}
    }).catch(function(){if(nextEl)nextEl.innerHTML='<p>Retrouvez bientôt nos prochains rendez-vous.</p>'})
  }

  // Projects
  var hs=$('#hospitals');
  if(hs||$('#materials')){getJSON('data/projects.json').then(function(p){
    if(hs){hs.innerHTML=p.hospitals.map(function(h){return '<div class="card hosp reveal"><span class="pin" aria-hidden="true">✚</span><div><h3>'+esc(h.name)+'</h3><p>'+esc(h.city)+'</p></div></div>'}).join('');watch(hs)}
    var m=$('#materials');if(m){m.innerHTML=p.materials.map(function(x){return '<div class="card reveal"><span class="ico" aria-hidden="true">'+x.icon+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p></div>'}).join('');watch(m)}
  })}

  // Gallery
  var gal=$('#gallery');
  if(gal){getJSON('data/gallery.json').then(function(g){
    var chips=$('#chips'),cur='all';
    var draw=function(){
      var out='';g.albums.forEach(function(a){if(cur!=='all'&&cur!==a.id)return;
        if(!a.photos.length)out+='<figure class="ph" data-album="'+a.id+'"><span>'+esc(a.title)+'<br><small>Photos à venir</small></span></figure>';
        a.photos.forEach(function(p){out+='<figure data-src="'+esc(p.src)+'"><img loading="lazy" src="'+esc(p.src)+'" alt="'+esc(p.alt||a.title)+'"><figcaption>'+esc(p.caption||a.title)+'</figcaption></figure>'})});
      gal.innerHTML=out};
    chips.innerHTML=['<button class="chip" aria-pressed="true" data-id="all">Tout</button>'].concat(g.albums.map(function(a){return '<button class="chip" aria-pressed="false" data-id="'+a.id+'">'+esc(a.title)+'</button>'})).join('');
    chips.addEventListener('click',function(e){var c=e.target.closest('.chip');if(!c)return;cur=c.dataset.id;$$('.chip',chips).forEach(function(x){x.setAttribute('aria-pressed',x===c)});draw()});
    var lb=$('#lightbox');
    gal.addEventListener('click',function(e){var f=e.target.closest('figure[data-src]');if(!f)return;$('img',lb).src=f.dataset.src;lb.classList.add('open');$('button',lb).focus()});
    lb.addEventListener('click',function(){lb.classList.remove('open')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});
    draw()})}

  // Contact form (Netlify Forms, AJAX)
  var form=$('#contact-form');
  if(form){form.addEventListener('submit',function(e){
    e.preventDefault();var st=$('#form-status');st.textContent='Envoi en cours…';
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
      .then(function(r){if(!r.ok)throw 0;form.reset();st.textContent='Merci ! Votre message a bien été envoyé. Nous vous répondrons très vite.'})
      .catch(function(){st.textContent='Oups, l\'envoi a échoué. Vous pouvez nous écrire directement par e-mail.'})})}
})();
