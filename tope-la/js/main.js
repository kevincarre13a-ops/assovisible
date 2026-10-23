(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var T=window.TOPELA||{evenements:[],actualites:[]};
  var MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  function $(s,c){return (c||d).querySelector(s)} function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])}

  /* header */
  var header=$('.site-header');
  function onScroll(){header.classList.toggle('solid',window.scrollY>30)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  var burger=$('.burger'),nav=$('.nav');
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  $$('.nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');closeLb()}});

  /* hero slideshow */
  var slides=$$('.slide');
  if(slides.length){var i=0;slides[0].classList.add('on');if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(function(){slides[i].classList.remove('on');i=(i+1)%slides.length;slides[i].classList.add('on')},6500)}}

  /* events */
  var today=new Date();today.setHours(0,0,0,0);
  function endOf(e){return parse(e.fin||e.date)}
  var upcoming=T.evenements.filter(function(e){return endOf(e)>=today}).sort(function(a,b){return parse(a.date)-parse(b.date)});
  var past=T.evenements.filter(function(e){return endOf(e)<today}).sort(function(a,b){return parse(b.date)-parse(a.date)});
  function badge(e){
    if(e.dateLabel){return '<div class="datebadge"><span>'+esc(e.dateLabel)+'</span></div>'}
    var a=parse(e.date);var m=MOIS[a.getMonth()];
    var day=a.getDate();if(e.fin){var b=parse(e.fin);if(b.getMonth()===a.getMonth())day=day+'-'+b.getDate()}
    return '<div class="datebadge"><b>'+day+'</b><span>'+m+' '+a.getFullYear()+'</span></div>'
  }
  function evHtml(e){
    var facts=[];if(e.lieu)facts.push('📍 '+esc(e.lieu));if(e.horaires)facts.push('🕒 '+esc(e.horaires));if(e.tarif)facts.push('🎟️ '+esc(e.tarif));
    return '<article class="ev reveal">'+badge(e)+'<div><span class="meta">'+esc(e.type||'')+'</span><h3>'+esc(e.titre)+'</h3><ul class="facts">'+facts.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul><p>'+esc(e.texte||'')+'</p>'+(e.lien?'<a href="'+esc(e.lien.href)+'" target="_blank" rel="noopener">'+esc(e.lien.texte)+' →</a>':'')+(e.image?'<img class="thumb" loading="lazy" src="'+esc(e.image)+'" alt="Affiche ou photo : '+esc(e.titre)+'">':'')+'</div></article>'
  }
  var nx=$('#next-event');
  if(nx){
    var e=upcoming[0];
    if(e){nx.innerHTML='<div class="next reveal">'+badge(e)+'<div><span class="badge">Prochain rendez-vous</span><h2>'+esc(e.titre)+'</h2><p>'+esc((e.lieu?e.lieu+'. ':'')+(e.horaires||'')+' '+(e.texte||''))+'</p><div class="btns"><a class="btn btn-or" href="agenda.html">Tout l\'agenda</a><a class="btn btn-ligne" href="contact.html">Réserver / nous écrire</a></div></div></div>'}
    else{nx.innerHTML='<div class="next reveal"><div class="datebadge"><b>?</b><span>à venir</span></div><div><span class="badge">Prochain rendez-vous</span><h2>La prochaine date arrive bientôt</h2><p>Les dates ne sont pas encore publiées sur ce site. Le festival Cajun &amp; Zydeco a lieu tous les deux ans à la Pentecôte, et l\'association organise aussi des soirées et un loto dans l\'année. Écrivez-nous pour être prévenu(e) en premier.</p><div class="btns"><a class="btn btn-or" href="contact.html">Être prévenu(e)</a><a class="btn btn-ligne" href="agenda.html">Voir les éditions passées</a></div></div></div>'}
  }
  var up=$('#upcoming');
  if(up){up.innerHTML=upcoming.length?upcoming.map(evHtml).join(''):'<div class="card flat"><h3>Pas de date annoncée pour le moment</h3><p>Les prochains rendez-vous seront publiés ici dès qu\'ils seront confirmés. Le festival Cajun &amp; Zydeco a lieu tous les deux ans à la Pentecôte.</p><a class="btn btn-rouge" href="contact.html">Être prévenu(e) des prochaines dates</a></div>'}
  var ar=$('#archives');
  if(ar){var y='',h='';past.forEach(function(e){var yy=(e.dateLabel&&/\d{4}/.test(e.dateLabel)?e.dateLabel.match(/\d{4}/)[0]:parse(e.date).getFullYear());if(yy!==y){y=yy;h+='<h3 class="year-title">'+yy+'</h3>'}h+=evHtml(e)});ar.innerHTML=h}

  /* news */
  var ns=$('#news');
  if(ns){var max=+ns.getAttribute('data-max')||99;
    ns.innerHTML=T.actualites.slice(0,max).map(function(n,k){return '<article class="news-card reveal d'+(k%3+1)+(n.attente?' wait':'')+'">'+(n.image?'<img loading="lazy" src="'+esc(n.image)+'" alt="">':'')+'<time>'+esc(n.date)+'</time><h3>'+esc(n.titre)+'</h3><p>'+esc(n.texte)+'</p></article>'}).join('')}

  /* counters */
  var cs=$$('[data-count]');
  var yrs=$('#years-count');if(yrs){yrs.setAttribute('data-count',new Date().getFullYear()-1998)}
  function run(el){var to=+el.getAttribute('data-count'),t0=null;function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}

  /* reveal */
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');if(en.target.hasAttribute('data-count')&&!en.target.dataset.done){en.target.dataset.done=1;run(en.target)}io.unobserve(en.target)}})},{threshold:.15}):null;
  $$('.reveal,[data-count]').forEach(function(el){if(io)io.observe(el);else{el.classList.add('in');if(el.hasAttribute('data-count'))el.textContent=el.getAttribute('data-count')}});

  /* carousel */
  $$('.carousel').forEach(function(c){var tr=$('.track',c);$$('.car-btns button',c).forEach(function(b){b.addEventListener('click',function(){tr.scrollBy({left:(b.dataset.dir==='next'?1:-1)*Math.min(tr.clientWidth*.8,420),behavior:'smooth'})})})});

  /* gallery */
  var fb=$$('.filters button');
  fb.forEach(function(b){b.addEventListener('click',function(){fb.forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');var f=b.dataset.f;$$('.gallery figure').forEach(function(fg){fg.hidden=!(f==='all'||fg.dataset.cat===f)})})});
  var lb=$('.lb');
  function closeLb(){if(lb)lb.classList.remove('open')}
  if(lb){$$('.gallery figure').forEach(function(fg){var btn=$('button',fg);btn.addEventListener('click',function(){var im=$('img',fg);$('img',lb).src=im.currentSrc||im.src;$('img',lb).alt=im.alt;$('figcaption',lb).textContent=$('figcaption',fg).textContent;lb.classList.add('open');$('.lb-close',lb).focus()})});
    $('.lb-close',lb).addEventListener('click',closeLb);lb.addEventListener('click',function(e){if(e.target===lb)closeLb()})}

  /* form feedback */
  if(/[?&]merci/.test(location.search)){var n=$('#merci');if(n)n.hidden=false}
  var yr=$('#year');if(yr)yr.textContent=new Date().getFullYear();
})();
