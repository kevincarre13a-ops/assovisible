(function(){
  'use strict';
  window.__lucioles=1;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc=function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var ico=function(n,c){return '<svg class="'+(c||'i')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
  var getJSON=function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.json()})};

  $$('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});

  // ---------- Header, menu, progress ----------
  var header=$('.site-header'),b=$('.burger'),nav=$('.nav'),bar=$('.progress');
  var closeMenu=function(){nav.classList.remove('open');header.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Ouvrir le menu')};
  if(b){
    b.addEventListener('click',function(){var o=nav.classList.toggle('open');header.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))closeMenu()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();b.focus()}});
  }
  var onScroll=function(){
    var max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=Math.min(1,scrollY/max);
    header.classList.toggle('scrolled',scrollY>30);
    if(bar)bar.style.transform='scaleX('+p+')';
    return p;
  };

  // ---------- Hero: stars, title words, pointer glow ----------
  var hero=$('.hero');
  $$('.stars').forEach(function(box){
    var n=innerWidth<700?45:90,h='';
    for(var i=0;i<n;i++)h+='<i class="star" style="left:'+(Math.random()*100).toFixed(2)+'%;top:'+(Math.random()*75).toFixed(2)+'%;--t:'+(2.5+Math.random()*4).toFixed(1)+'s;--dl:-'+(Math.random()*5).toFixed(1)+'s;'+(Math.random()<.15?'width:3px;height:3px;':'')+'"></i>';
    box.innerHTML=h;
  });
  $$('.split-words').forEach(function(h){
    if(reduce)return;
    var i=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var f=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(w){
            if(!w)return;
            if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}
            var s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=w;f.appendChild(s);
          });
          node.replaceChild(f,c);
        }else if(c.nodeType===1){walk(c)}
      });
    })(h);
  });
  if(hero&&!reduce&&matchMedia('(pointer:fine)').matches){
    var g=document.createElement('span');g.className='hero-glow';hero.appendChild(g);
    hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();g.style.left=(e.clientX-r.left)+'px';g.style.top=(e.clientY-r.top)+'px'});
  }

  // ---------- Fireflies that light up while scrolling ----------
  var box=$('.fireflies'),flies=[];
  if(box&&!reduce){
    var N=innerWidth<700?14:24;
    for(var i=0;i<N;i++){
      var f=document.createElement('i');f.className='fly';
      f.style.left=(Math.random()*96+1)+'vw';f.style.top=(Math.random()*92+3)+'vh';
      f.style.setProperty('--x',(Math.random()*90-45).toFixed(0)+'px');f.style.setProperty('--y',(Math.random()*90-55).toFixed(0)+'px');
      f.style.setProperty('--d',(7+Math.random()*8).toFixed(1)+'s');f.style.setProperty('--b',(2+Math.random()*3).toFixed(1)+'s');
      f.style.setProperty('--o',(.45+Math.random()*.5).toFixed(2));
      var sz=(5+Math.random()*6).toFixed(1)+'px';f.style.width=f.style.height=sz;
      box.appendChild(f);flies.push(f);
    }
  }
  var ticking=false;
  var update=function(){ticking=false;var p=onScroll(),k=Math.ceil(5+p*(flies.length-5));flies.forEach(function(f,i){f.classList.toggle('on',i<k)})};
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  update();

  // ---------- Reveal on scroll + counters ----------
  var hasIO='IntersectionObserver' in window;
  var io=hasIO?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'}):null;
  var watch=function(root){$$('.reveal',root).forEach(function(el,i){if(root)el.style.setProperty('--rd',(Math.min(i,6)*70)+'ms');io?io.observe(el):el.classList.add('in')})};
  watch();
  $$('[data-years]').forEach(function(el){el.setAttribute('data-count',new Date().getFullYear()-(+el.getAttribute('data-years')))});
  $$('[data-count]').forEach(function(el){
    var end=+el.getAttribute('data-count');el.textContent=end;
    if(reduce||!hasIO)return;
    el.textContent='0';
    new IntersectionObserver(function(es,o){
      if(!es[0].isIntersecting)return;o.disconnect();
      var t0=performance.now(),d=1800;
      (function step(t){var p=Math.min(1,(t-t0)/d);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})(t0);
    },{threshold:.6}).observe(el);
  });

  // ---------- Agenda ----------
  var MONTHS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var parseDate=function(s){return s?new Date(s+'T12:00:00'):null};
  var eventCard=function(ev,archive){
    var d=parseDate(ev.date),when=d?d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):(ev.dateLabel||'Date à venir');
    return '<article class="card reveal"><span class="tag'+(archive?'':' gold')+'">'+(archive?'Archive':'À venir')+'</span><h3>'+esc(ev.title)+'</h3>'+
      '<p><strong>'+ico('calendar')+' '+esc(when)+'</strong>'+(ev.place?'<br>'+ico('pin')+' '+esc(ev.place):'')+'</p><p style="margin-top:.8em">'+esc(ev.description)+'</p></article>'};
  var nextEl=$('#next-event'),upEl=$('#events-upcoming'),arEl=$('#events-archive'),fmEl=$('#formats');
  if(nextEl||upEl||arEl||fmEl){
    getJSON('data/events.json').then(function(ev){
      var today=new Date();today.setHours(0,0,0,0);
      var up=ev.upcoming.filter(function(x){var d=parseDate(x.date);return !d||d>=today}).sort(function(a,b){return (a.date||'9').localeCompare(b.date||'9')});
      if(nextEl){
        var n=up[0];
        if(!n){nextEl.innerHTML='<p>Retrouvez bientôt nos prochains rendez-vous.</p>';return}
        var d=parseDate(n.date);
        nextEl.innerHTML='<div class="date-bubble">'+(d?'<span><small>'+MONTHS[d.getMonth()]+'</small><strong>'+d.getDate()+'</strong></span>':'<span>Bientôt<br>✦</span>')+'</div>'+
          '<div><h3>'+esc(n.title)+'</h3><p>'+esc(n.description)+'</p>'+(n.place?'<p><strong>'+ico('pin')+' '+esc(n.place)+'</strong></p>':'')+
          '<a class="btn btn-gold" href="evenements.html">'+ico('calendar')+'Voir l\'agenda</a></div>';
      }
      if(upEl){upEl.innerHTML=up.map(function(x){return eventCard(x)}).join('');watch(upEl)}
      if(arEl){arEl.innerHTML=ev.archive.map(function(x){return eventCard(x,1)}).join('');watch(arEl)}
      if(fmEl){var col=['','green','gold',''];fmEl.innerHTML=ev.formats.map(function(f,i){return '<div class="card reveal"><span class="badge '+col[i%4]+'">'+ico(f.icon)+'</span><h3>'+esc(f.title)+'</h3><p>'+esc(f.text)+'</p></div>'}).join('');watch(fmEl)}
    }).catch(function(){if(nextEl)nextEl.innerHTML='<p>Retrouvez bientôt nos prochains rendez-vous.</p>'});
  }

  // ---------- Hôpitaux : carte animée + liste ----------
  var mapEl=$('#map'),hsEl=$('#hospitals'),matEl=$('#materials');
  var drawMap=function(hs){
    var compact=mapEl.clientWidth<620;
    var HOME={lat:45.6886,lon:5.9153};
    var P=function(lat,lon){return [((lon-4.55)*400),((46.02-lat)*572)]};
    var groups={},order=[];
    hs.forEach(function(h){var k=h.pin||h.name;if(!groups[k]){groups[k]={n:0,lat:0,lon:0};order.push(k)}var g=groups[k];g.n++;g.lat+=h.lat;g.lon+=h.lon});
    var A=P(HOME.lat,HOME.lon),svg='';
    svg+='<path class="ridge" d="M560 345 L610 250 L650 300 L700 210 L745 290 L790 230 L800 345Z"/><path class="ridge" d="M420 345 L470 280 L520 320 L560 260 L600 345Z"/>';
    var L=P(45.735,5.858);
    svg+='<ellipse class="lake" cx="'+L[0].toFixed(0)+'" cy="'+L[1].toFixed(0)+'" rx="7" ry="42" transform="rotate(-8 '+L[0].toFixed(0)+' '+L[1].toFixed(0)+')"/>';
    svg+='<text class="lake-l" x="'+L[0].toFixed(0)+'" y="'+(L[1]+58).toFixed(0)+'" text-anchor="middle">Lac du Bourget</text>';
    var pins='';
    order.forEach(function(k,i){
      var g=groups[k],B=P(g.lat/g.n,g.lon/g.n),mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-50-(i%2)*20,id='r'+i;
      svg+='<path id="'+id+'" class="route" d="M'+A[0].toFixed(1)+' '+A[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+B[0].toFixed(1)+' '+B[1].toFixed(1)+'"/>';
      if(!reduce)svg+='<circle class="spark" r="4"><animateMotion dur="'+(3+i*.6).toFixed(1)+'s" repeatCount="indefinite" begin="'+(i*.5)+'s"><mpath href="#'+id+'"/></animateMotion></circle>';
      var an,lx=B[0],ly,sy;
      if(B[0]>650){an='middle';ly=B[1]-34;sy=B[1]-19}
      else if(B[1]>A[1]+30){an='middle';ly=B[1]+30;sy=B[1]+45}
      else if(B[0]<250){an='start';lx=B[0]+16;ly=B[1]-4;sy=B[1]+12}
      else{an='end';lx=B[0]-16;ly=B[1]-4;sy=B[1]+12}
      pins+='<g class="p"><circle class="halo" cx="'+B[0].toFixed(1)+'" cy="'+B[1].toFixed(1)+'" r="13"/><circle class="dot" cx="'+B[0].toFixed(1)+'" cy="'+B[1].toFixed(1)+'" r="7"/>'+
        '<text class="lbl" x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="'+an+'">'+esc(k)+'</text>'+
        '<text class="sub" x="'+lx.toFixed(1)+'" y="'+sy.toFixed(1)+'" text-anchor="'+an+'">'+(g.n>1?g.n+' établissements':'1 établissement')+'</text></g>';
    });
    pins+='<g class="home"><circle class="halo" cx="'+A[0].toFixed(1)+'" cy="'+A[1].toFixed(1)+'" r="16"/><circle class="dot" cx="'+A[0].toFixed(1)+'" cy="'+A[1].toFixed(1)+'" r="9"/>'+
      '<text class="lbl" x="'+(A[0]+18).toFixed(1)+'" y="'+(A[1]+(compact?32:-2)).toFixed(1)+'">Aix-les-Bains</text><text class="sub" x="'+(A[0]+18).toFixed(1)+'" y="'+(A[1]+14).toFixed(1)+'">siège des Lucioles</text></g>';
    mapEl.innerHTML='<svg viewBox="40 40 760 300" aria-hidden="true"'+(compact?' class="compact"':'')+'>'+svg+pins+'</svg>';
  };
  if(mapEl||hsEl||matEl){getJSON('data/projects.json').then(function(p){
    if(mapEl){drawMap(p.hospitals);var w0=mapEl.clientWidth,rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(Math.abs(mapEl.clientWidth-w0)>40){w0=mapEl.clientWidth;drawMap(p.hospitals)}},200)})}
    if(hsEl){hsEl.innerHTML=p.hospitals.map(function(h){return '<div class="hosp reveal"><span class="pin">'+ico('hospital')+'</span><div><h3>'+esc(h.name)+'</h3><p>'+esc(h.city)+'</p></div></div>'}).join('');watch(hsEl)}
    if(matEl){var col=['','green','gold',''];matEl.innerHTML=p.materials.map(function(x,i){return '<div class="card reveal"><span class="badge '+col[i%4]+'">'+ico(x.icon)+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p></div>'}).join('');watch(matEl)}
  }).catch(function(){})}

  // ---------- Partenaires ----------
  var ptEl=$('#partners');
  if(ptEl){getJSON('data/partners.json').then(function(d){
    if(d.partners.length){
      ptEl.innerHTML=d.partners.map(function(p){var inner=p.logo?'<img loading="lazy" src="'+esc(p.logo)+'" alt="'+esc(p.name)+'">':esc(p.name);
        return p.url?'<a class="partner reveal" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+inner+'</a>':'<div class="partner reveal">'+inner+'</div>'}).join('');
    }else{
      ptEl.innerHTML=[1,2,3,4].map(function(){return '<div class="partner ghost reveal">'+ico('handshake')+'<span>Votre logo ici</span></div>'}).join('');
    }
    watch(ptEl);
  }).catch(function(){})}

  // ---------- Galerie + visionneuse ----------
  var gal=$('#gallery');
  if(gal){getJSON('data/gallery.json').then(function(g){
    var chips=$('#chips'),lb=$('#lightbox'),cur='all',shown=[],idx=0,last=null;
    var draw=function(){
      var out='';shown=[];
      g.albums.forEach(function(a){
        if(cur!=='all'&&cur!==a.id)return;
        if(!a.photos.length){out+='<div class="ph-empty reveal">'+ico('camera')+'<span><strong>'+esc(a.title)+'</strong><small>Photos bientôt en ligne</small></span></div>';return}
        a.photos.forEach(function(p){var n=shown.length;shown.push({src:p.src,alt:p.alt||a.title,cap:p.caption||a.title});
          out+='<button class="ph-btn reveal" data-i="'+n+'"><img loading="lazy" src="'+esc(p.src)+'" alt="'+esc(p.alt||a.title)+'"><span>'+esc(p.caption||a.title)+'</span></button>'});
      });
      gal.innerHTML=out;watch(gal);
    };
    chips.innerHTML='<button class="chip" aria-pressed="true" data-id="all">Tout</button>'+g.albums.map(function(a){return '<button class="chip" aria-pressed="false" data-id="'+esc(a.id)+'">'+esc(a.title)+'</button>'}).join('');
    chips.addEventListener('click',function(e){var c=e.target.closest('.chip');if(!c)return;cur=c.getAttribute('data-id');$$('.chip',chips).forEach(function(x){x.setAttribute('aria-pressed',x===c)});draw()});
    var show=function(i){idx=(i+shown.length)%shown.length;var s=shown[idx];$('img',lb).src=s.src;$('img',lb).alt=s.alt;$('figcaption',lb).textContent=s.cap+'  ·  '+(idx+1)+' / '+shown.length};
    var close=function(){lb.hidden=true;document.body.style.overflow='';if(last)last.focus()};
    gal.addEventListener('click',function(e){var t=e.target.closest('.ph-btn');if(!t)return;last=t;show(+t.getAttribute('data-i'));lb.hidden=false;document.body.style.overflow='hidden';$('.lb-close',lb).focus()});
    $('.lb-close',lb).addEventListener('click',close);
    $('.lb-prev',lb).addEventListener('click',function(){show(idx-1)});
    $('.lb-next',lb).addEventListener('click',function(){show(idx+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
    var x0=null;lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));x0=null});
    draw();
  }).catch(function(){})}

  // ---------- Formulaire de contact (Netlify Forms) ----------
  var form=$('#contact-form');
  if(form){
    if(new URLSearchParams(location.search).get('objet')==='partenariat')$('#o').value='Devenir partenaire des Lucioles';
    form.addEventListener('submit',function(e){
      e.preventDefault();var st=$('#form-status'),btn=$('button[type=submit]',form);st.textContent='Envoi en cours…';btn.disabled=true;
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
        .then(function(r){if(!r.ok)throw 0;form.reset();st.textContent='Merci ! Votre message a bien été envoyé. Nous vous répondrons très vite.'})
        .catch(function(){st.textContent='Oups, l\'envoi a échoué. Vous pouvez nous écrire directement par e-mail.'})
        .then(function(){btn.disabled=false});
    });
  }
})();
