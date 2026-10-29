(function(){
'use strict';
var ART={
 palets:'<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="40" ry="14" fill="#8a5a2b"/><ellipse cx="50" cy="56" rx="40" ry="14" fill="#E4572E"/><ellipse cx="50" cy="56" rx="26" ry="8" fill="#F6C945"/><ellipse cx="50" cy="38" rx="30" ry="10" fill="#2A78B5"/><ellipse cx="50" cy="33" rx="30" ry="10" fill="#5aa4d8"/></svg>',
 pions:'<svg viewBox="0 0 100 100"><circle cx="30" cy="34" r="20" fill="#C93D22"/><circle cx="30" cy="34" r="11" fill="#e8765f"/><circle cx="70" cy="34" r="20" fill="#F6C945"/><circle cx="70" cy="34" r="11" fill="#fbe38a"/><circle cx="50" cy="72" r="20" fill="#C93D22"/><circle cx="50" cy="72" r="11" fill="#e8765f"/></svg>',
 cubes:'<svg viewBox="0 0 100 100"><rect x="10" y="62" width="38" height="28" rx="5" fill="#B7773B"/><rect x="52" y="62" width="38" height="28" rx="5" fill="#C98A4B"/><rect x="22" y="32" width="38" height="28" rx="5" fill="#E9B44C"/><rect x="40" y="8" width="38" height="22" rx="5" fill="#5E9E4A" transform="rotate(8 59 19)"/></svg>',
 quilles:'<svg viewBox="0 0 100 100"><g fill="#fff" stroke="#4A2F1A" stroke-width="3"><path d="M30 12c8 0 8 14 3 22 6 10 6 40-3 52-9-12-9-42-3-52-5-8-5-22 3-22z"/><path d="M62 12c8 0 8 14 3 22 6 10 6 40-3 52-9-12-9-42-3-52-5-8-5-22 3-22z"/></g><path d="M25 38h10M57 38h10" stroke="#C93D22" stroke-width="5"/><circle cx="82" cy="78" r="12" fill="#2A78B5"/></svg>',
 cible:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#fff" stroke="#4A2F1A" stroke-width="3"/><circle cx="50" cy="50" r="30" fill="#C93D22"/><circle cx="50" cy="50" r="19" fill="#fff"/><circle cx="50" cy="50" r="9" fill="#F6C945" stroke="#4A2F1A" stroke-width="2"/></svg>',
 des:'<svg viewBox="0 0 100 100"><rect x="8" y="30" width="48" height="48" rx="10" fill="#fff" stroke="#4A2F1A" stroke-width="3" transform="rotate(-10 32 54)"/><g fill="#C93D22" transform="rotate(-10 32 54)"><circle cx="22" cy="44" r="4"/><circle cx="42" cy="64" r="4"/><circle cx="32" cy="54" r="4"/><circle cx="42" cy="44" r="4"/><circle cx="22" cy="64" r="4"/></g><rect x="52" y="14" width="40" height="40" rx="9" fill="#2A78B5" stroke="#4A2F1A" stroke-width="3" transform="rotate(14 72 34)"/><g fill="#fff" transform="rotate(14 72 34)"><circle cx="63" cy="25" r="3.5"/><circle cx="81" cy="43" r="3.5"/><circle cx="72" cy="34" r="3.5"/></g></svg>'
};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
function get(f){return fetch('data/'+f).then(function(r){return r.json()})}
function art(o){return (o.photo?'<img loading="lazy" src="'+esc(o.photo)+'" alt="'+esc(o.name||o.title)+'">':'')+(o.photo?'':(ART[o.art]||ART.palets))}
function fmt(d){if(!d)return null;var x=new Date(d+'T12:00:00');return{d:x.getDate(),m:x.toLocaleDateString('fr-FR',{month:'short'}),full:x.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),t:x.getTime()}}

/* nav */
var b=document.querySelector('.burger'),m=document.querySelector('.menu');
if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false')}})}

/* reveal */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
function reveal(root){(root||document).querySelectorAll('.rv:not(.in)').forEach(function(el){io?io.observe(el):el.classList.add('in')})}

/* counters */
var co='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,end=+el.dataset.end,suf=el.dataset.suf||'',t0=performance.now();
 (function tick(t){var p=Math.min((t-t0)/1600,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick)})(t0)})},{threshold:.5}):null;

function flipCard(g){return '<div class="flip rv" tabindex="0" role="button" aria-label="Retourner la carte '+esc(g.name)+'"><div class="flip-in">'+
 '<div class="face front"><div class="art">'+(g.placeholder?'<span class="badge">exemple</span>':'')+art(g)+'</div><div class="meta"><h3>'+esc(g.name)+'</h3><span class="chip">'+esc(g.tag||'')+'</span><span class="chip">'+esc(g.players)+'</span></div></div>'+
 '<div class="face back"><h3>'+esc(g.name)+'</h3><p>'+esc(g.description)+'</p><div><span class="chip">👥 '+esc(g.players)+'</span><span class="chip">🎂 '+esc(g.age)+'</span></div><a class="btn light" href="contact.html#pret">Demander ce jeu</a></div></div></div>'}

function render(site){
 document.querySelectorAll('[data-render]').forEach(function(el){
  var k=el.dataset.render,n=+el.dataset.limit||99;
  if(k==='games')get('games.json').then(function(a){el.innerHTML=a.slice(0,n).map(flipCard).join('');reveal(el);bindFlip(el)});
  if(k==='stats')get('stats.json').then(function(a){el.innerHTML=a.map(function(s){return '<div class="stat rv"><b data-end="'+s.value+'" data-suf="'+esc(s.suffix)+'">0</b><small>'+esc(s.label)+'</small>'+(s.placeholder?'<i>valeur d’attente</i>':'')+'</div>'}).join('');el.querySelectorAll('b').forEach(function(x){co?co.observe(x):x.textContent=x.dataset.end+x.dataset.suf});reveal(el)});
  if(k==='team')get('team.json').then(function(a){el.innerHTML=a.map(function(p){return '<div class="card rv center"><div class="ico" style="margin-inline:auto">🪵</div><h3>'+esc(p.name)+'</h3><p>'+esc(p.role)+'</p></div>'}).join('');reveal(el)});
  if(k==='news')get('news.json').then(function(a){a.sort(function(x,y){return y.date>x.date?1:-1});el.innerHTML=a.slice(0,n).map(function(p){var d=fmt(p.date);return '<article class="row rv"><div class="date"><b>'+d.d+'</b>'+d.m+'</div><div><h3>'+esc(p.title)+'</h3><p>'+esc(el.dataset.full?p.body:p.summary)+'</p></div></article>'}).join('');reveal(el)});
  if(k==='events'||k==='archives')get('events.json').then(function(a){var now=Date.now()-864e5,up=[],old=[];
   a.forEach(function(e){var d=fmt(e.date);if(!d||d.t>=now)up.push(e);else old.push(e)});
   var list=k==='events'?up:old;
   if(!list.length){el.innerHTML='<p class="card">'+(k==='events'?'Aucun rendez-vous programmé pour le moment.':'Les archives se rempliront au fil des événements.')+'</p>';return}
   el.innerHTML=list.map(function(e){var d=fmt(e.date);return '<article class="row rv"><div class="date'+(d?'':' none')+'">'+(d?'<b>'+d.d+'</b>'+d.m:'Bientôt')+'</div><div><h3>'+esc(e.title)+'</h3><p>'+esc(e.description)+'</p><span class="chip">'+esc(e.type||'')+'</span>'+(e.place?'<span class="chip">📍 '+esc(e.place)+'</span>':'')+(e.time?'<span class="chip">🕒 '+esc(e.time)+'</span>':'')+'</div></article>'}).join('');reveal(el)});
  if(k==='next')get('events.json').then(function(a){var now=Date.now()-864e5,e=a.filter(function(x){var d=fmt(x.date);return d&&d.t>=now}).sort(function(x,y){return x.date>y.date?1:-1})[0],d=e&&fmt(e.date);
   el.innerHTML=e?'<div class="date"><b>'+d.d+'</b>'+d.m+'</div><div><span class="eyebrow">Prochain événement</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.description)+'</p></div><a class="btn" href="evenements.html">Tous les rendez-vous</a>':
   '<div class="date none">Bientôt</div><div><span class="eyebrow">Prochain événement</span><h3>Les prochaines dates arrivent !</h3><p>Une fête, un marché, une kermesse ? Les rendez-vous seront annoncés ici. En attendant, invitez-nous chez vous.</p></div><a class="btn" href="contact.html#animation">Demander une animation</a>';reveal(el)});
  if(k==='gallery')get('gallery.json').then(function(g){var cur='Tous';
   function draw(){el.innerHTML='<div class="filters">'+g.categories.map(function(c){return '<button type="button" aria-pressed="'+(c===cur)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('')+'</div><div class="shots">'+
    g.items.filter(function(i){return cur==='Tous'||i.category===cur}).map(function(i){return '<button type="button" class="shot rv" '+(i.photo?'data-full="'+esc(i.photo)+'"':'')+' aria-label="'+esc(i.title)+'">'+(i.photo?'<img loading="lazy" src="'+esc(i.photo)+'" alt="'+esc(i.title)+'">':ART[i.art]||'')+'<span>'+esc(i.category)+' · '+esc(i.title)+'</span></button>'}).join('')+'</div>';reveal(el)}
   draw();el.addEventListener('click',function(e){var f=e.target.closest('.filters button');if(f){cur=f.dataset.c;draw();return}var s=e.target.closest('.shot');if(s&&s.dataset.full){var lb=document.getElementById('lb');lb.querySelector('img').src=s.dataset.full;lb.classList.add('open')}})});
 });
 document.querySelectorAll('[data-site]').forEach(function(el){var v=site[el.dataset.site];if(v)el.textContent=v});
 var h=document.querySelector('.hero.has-photo-slot');if(h&&site.heroPhoto){h.style.backgroundImage='url("'+site.heroPhoto+'")';h.classList.add('has-photo')}
}
function bindFlip(root){root.querySelectorAll('.flip').forEach(function(f){f.addEventListener('click',function(e){if(e.target.closest('a'))return;f.classList.toggle('on')});f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}})})}

var lb=document.getElementById('lb');if(lb)lb.addEventListener('click',function(){lb.classList.remove('open')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb)lb.classList.remove('open')});

/* hero parallax */
var hero=document.querySelector('.hero');
if(hero&&!matchMedia('(prefers-reduced-motion: reduce)').matches){hero.addEventListener('pointermove',function(e){var x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;hero.querySelectorAll('.fl').forEach(function(f,i){var k=(i+1)*6;f.style.translate=(-x*k)+'px '+(-y*k)+'px'})})}

/* contact form (AJAX, Netlify Forms) */
var form=document.querySelector('form[data-netlify]');
if(form)form.addEventListener('submit',function(e){e.preventDefault();var btn=form.querySelector('button[type=submit]');btn.disabled=true;
 fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
 .then(function(r){if(!r.ok)throw 0;location.href='merci.html'}).catch(function(){btn.disabled=false;alert('Oups, l’envoi a échoué. Écrivez-nous directement à jeuxdetoutbois@orange.fr')})});
if(location.hash&&form){var t=document.getElementById('sujet');if(t){var h=location.hash.slice(1),map={pret:'Prêt de jeux',animation:'Demande d’animation',adhesion:'Adhésion',benevole:'Bénévolat'};if(map[h])t.value=map[h]}}

reveal();
fetch('data/site.json').then(function(r){return r.json()}).then(render).catch(function(){render({})});
})();
