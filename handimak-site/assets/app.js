(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function icon(name,cls){var w=el('div','ico '+(cls||'c1'));var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('aria-hidden','true');var u=document.createElementNS('http://www.w3.org/2000/svg','use');u.setAttribute('href','#i-'+(name||'coeur'));s.appendChild(u);w.appendChild(s);return w}
var COL=['c1','c2','c3','c4','c5'];
function get(f){return fetch('data/'+f).then(function(r){if(!r.ok)throw 0;return r.json()})}
// burger
var b=$('.burger'),n=$('#nav');
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded',false);b.focus()}})}
// reveal
function reveal(){var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
$$('.reveal').forEach(function(x){io?io.observe(x):x.classList.add('in')})}
// counters
function counter(node,to){var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){node.textContent=to.toLocaleString('fr-FR');return}
var t0=null;function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1500,1);node.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString('fr-FR');if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
function years(iso){var d=new Date(iso),n=new Date(),y=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))y--;return y}
var site;
get('site.json').then(function(s){site=s;
 $$('[data-don]').forEach(function(a){a.setAttribute('href','faire-un-don.html')});
 var dl=$('[data-don-external]');if(dl){if(s.lienDon){dl.href=s.lienDon;dl.rel='noopener';dl.target='_blank';dl.textContent='Donner en ligne (nouvel onglet)'}else{dl.removeAttribute('href');dl.setAttribute('aria-disabled','true');dl.textContent='Lien de don en ligne à renseigner';var nt=$('[data-don-note]');if(nt)nt.textContent=s.lienDonNote}}
 // cagnotte
 $$('[data-cagnotte]').forEach(function(c){var g=s.cagnotte,bar=$('.progress',c),txt=$('.cag-txt',c);
  if(g.montant!=null&&g.objectif){var pct=Math.min(100,Math.round(g.montant/g.objectif*100));bar.setAttribute('aria-valuenow',pct);setTimeout(function(){$('i',bar).style.width=pct+'%'},300);txt.textContent=g.montant.toLocaleString('fr-FR')+' € collectés sur '+g.objectif.toLocaleString('fr-FR')+' € ('+pct+' %)'}
  else{bar.classList.add('unknown');bar.removeAttribute('aria-valuenow');txt.textContent=g.note}});
 // countdown
 var pe=s.prochainEvenement,cd=$('[data-countdown]');
 if(cd&&pe){$('[data-ev-title]').textContent=pe.titre;$('[data-ev-lieu]').textContent=pe.lieu;$('[data-ev-note]').textContent=pe.note;
  var t=new Date(pe.date);$('[data-ev-date]').textContent=t.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  function tick(){var d=t-new Date();if(d<0)d=0;var v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];$$('b',cd).forEach(function(x,i){x.textContent=String(v[i]).padStart(2,'0')})}
  tick();setInterval(tick,1000)}
}).catch(function(){});
// stats
var st=$('[data-stats]');if(st)get('stats.json').then(function(a){a.forEach(function(x){var v=x.valeur==='annees'&&site?years(site.creation):x.valeur;if(x.valeur==='annees')v=years('2023-01-05');
 var d=el('div','stat reveal'),bb=el('b','',x.suffixe?'':'0');bb.setAttribute('aria-label',String(v));d.appendChild(bb);d.appendChild(el('strong','',x.libelle));d.appendChild(el('small','',x.note));st.appendChild(d);
 var done=false;var io=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!done){done=true;counter(bb,v);io.disconnect()}});io.observe(d)});reveal()});
// events
function evCard(e,arch){var c=el('article','card reveal');c.appendChild(icon(e.pictos,COL[Math.floor(Math.random()*0)+ (e.titre.length%5)]));
 var tg=el('span','tag'+(!arch&&/confirmer|renseigner/i.test(e.statut||e.dateTexte||'')?' wait':''),arch?e.date:(e.statut||'À venir'));c.appendChild(tg);c.appendChild(el('h3','',e.titre));
 if(!arch){c.appendChild(el('p','meta',e.dateTexte+' · '+e.lieu))}c.appendChild(el('p','',e.resume));return c}
var ea=$('[data-events-next]'),eh=$('[data-events-arch]'),home=$('[data-events-home]');
if(ea||eh||home)get('evenements.json').then(function(d){
 if(ea)d.avenir.forEach(function(e){ea.appendChild(evCard(e))});
 if(eh)d.archives.forEach(function(e){eh.appendChild(evCard(e,true))});
 if(home)d.avenir.slice(1,4).forEach(function(e){home.appendChild(evCard(e))});reveal()});
// news
var nw=$('[data-news]');if(nw){var lim=+nw.getAttribute('data-limit')||99;get('actualites.json').then(function(a){a.slice(0,lim).forEach(function(x){var c=el('article','card reveal');c.appendChild(el('span','tag',new Date(x.date).toLocaleDateString('fr-FR',{month:'long',year:'numeric'})));c.appendChild(el('h3','',x.titre));c.appendChild(el('p','',x.resume));nw.appendChild(c)});reveal()})}
// partners
var pt=$('[data-partners]');if(pt)get('partenaires.json').then(function(a){var lim=+pt.getAttribute('data-limit')||99;a.slice(0,lim).forEach(function(x,i){var c=el('article','card reveal');c.appendChild(icon(/Parrain/.test(x.type)?'note':/Commerces/.test(x.type)?'ble':'coeur',COL[i%5]));c.appendChild(el('span','tag',x.type));c.appendChild(el('h3','',x.nom));c.appendChild(el('p','',x.detail));pt.appendChild(c)});reveal()});
// gallery
var gl=$('[data-gallery]');if(gl)get('galerie.json').then(function(a){a.forEach(function(g,i){var c=el('article','card gal reveal');
 if(g.photos&&g.photos.length){g.photos.forEach(function(p){var im=new Image();im.src=p.src;im.alt=p.alt||g.evenement;im.loading='lazy';c.appendChild(im)})}
 else{var ph=el('div','ph');var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('aria-hidden','true');var u=document.createElementNS('http://www.w3.org/2000/svg','use');u.setAttribute('href','#i-'+g.pictos);s.appendChild(u);ph.appendChild(s);c.appendChild(ph)}
 c.appendChild(el('h3','',g.evenement));c.appendChild(el('p','meta',g.legende));gl.appendChild(c)});reveal()});
reveal();
})();
