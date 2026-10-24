(function(){
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var esc=function(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var load=function(n){return fetch('data/'+n+'.json').then(function(r){return r.json()})};
/* burger */
var b=$('.burger'),nav=$('.nav');
b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
$$('.nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');b.setAttribute('aria-expanded','false')})});
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
function watch(){$$('.rv:not(.in)').forEach(function(e,i){e.style.transitionDelay=(i%4)*90+'ms';io.observe(e)})}
/* counters */
var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,end=+el.dataset.n,t0=performance.now();(function f(t){var p=Math.min((t-t0)/1600,1),k=1-Math.pow(1-p,3);el.textContent=Math.round(end*k)+(el.dataset.s||'');if(p<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
/* renderers */
var R={
 chiffres:function(el,d){el.innerHTML=d.chiffres.map(function(c){return'<div class="stat rv"><b data-n="'+c.valeur+'" data-s="'+esc(c.suffixe)+'">0</b><p>'+esc(c.texte)+'</p></div>'}).join('');$$('b',el).forEach(function(x){co.observe(x)})},
 cours:function(el,d,lim){el.innerHTML=d.map(function(c){var full=el.dataset.full==='1';return'<article class="card '+c.couleur+' rv" id="'+c.id+'"><span class="emo">'+c.emoji+'</span><h3>'+esc(c.titre)+'</h3><p>'+esc(c.resume)+'</p>'+(full?'<dl><dt>Public</dt><dd>'+esc(c.public)+'</dd><dt>Niveau</dt><dd>'+esc(c.niveau)+'</dd><dt>Jours</dt><dd>'+esc(c.jours)+'</dd><dt>Horaires</dt><dd>'+esc(c.horaires)+'</dd><dt>Lieu</dt><dd>'+esc(c.lieu)+'</dd><dt>Professeur</dt><dd>'+esc(c.professeur)+'</dd></dl><p style="margin-top:16px"><a class="btn rose" href="contact.html">Essayer ce cours</a></p>':'<p style="margin-top:10px"><span class="tag">'+esc(c.jours.split(' (')[0])+'</span></p>')+'</article>'}).join('')},
 planning:function(el,d){el.innerHTML=d.jours.map(function(j){return'<div class="jour rv'+(j.cours.length?'':' vide')+'"><h3>'+esc(j.jour)+'</h3>'+(j.cours.length?j.cours.map(function(c){return'<div class="slot '+(c.couleur==='vert'?'vert':'')+'">'+esc(c.titre)+'<small>'+esc(c.heure)+'</small></div>'}).join(''):'<p>Pas de cours</p>')+'</div>'}).join('');var n=$('#plan-note');if(n)n.textContent=d.note},
 tarifs:function(el,d){el.innerHTML='<p>'+esc(d.intro)+'</p><table style="margin:16px 0"><tr><th>Cours</th><th>Tarif</th></tr>'+d.lignes.map(function(l){return'<tr><td>'+esc(l.titre)+'</td><td>'+esc(l.prix)+'</td></tr>'}).join('')+'</table><h3>Modalités d\'inscription</h3><ul class="check" style="margin-top:12px">'+d.modalites.map(function(m){return'<li>'+esc(m)+'</li>'}).join('')+'</ul>'},
 prochain:function(el,d){var e=d.a_venir[0];el.innerHTML='<div class="evt rv"><div><span class="tag">'+esc(e.categorie)+'</span><p class="date">'+esc(e.date_affichee)+'</p><h3 style="font-size:1.8rem">'+esc(e.titre)+'</h3><p>'+esc(e.texte)+'</p></div><div><a class="btn blanc" href="'+esc(e.lien)+'">'+esc(e.lien_texte)+'</a></div></div>'},
 avenir:function(el,d){el.innerHTML=d.a_venir.map(function(e){return'<article class="card orange rv"><span class="tag">'+esc(e.categorie)+'</span><h3>'+esc(e.titre)+'</h3><p><b>'+esc(e.date_affichee)+'</b></p><p>'+esc(e.texte)+'</p><p style="margin-top:14px"><a class="btn rose" href="'+esc(e.lien)+'">'+esc(e.lien_texte)+'</a></p></article>'}).join('')},
 archives:function(el,d){el.innerHTML=d.archives.map(function(e){return'<article class="card rv"><span class="annee">'+esc(e.annee)+'</span><span class="tag" style="justify-self:start">'+esc(e.categorie)+'</span><h3>'+esc(e.titre)+'</h3><p><b>'+esc(e.date_affichee)+'</b></p><p>'+esc(e.texte)+'</p></article>'}).join('')},
 actus:function(el,d){var n=+el.dataset.max||99;el.innerHTML=d.slice(0,n).map(function(a){return'<article class="rv"><img src="'+esc(a.image)+'" alt="" loading="lazy"><div class="b"><time datetime="'+esc(a.date)+'">'+esc(a.date_affichee)+'</time><h3>'+esc(a.titre)+'</h3><p>'+esc(a.texte)+'</p></div></article>'}).join('')},
 galerie:function(el,d){el.innerHTML='<p class="note">'+esc(d.note)+'</p>'+d.albums.map(function(a){return'<h2 style="margin:40px 0 18px;font-size:1.8rem" class="rv">'+esc(a.titre)+'</h2><div class="gal">'+a.items.map(function(i){return'<figure class="rv"><img src="'+esc(i.src)+'" alt="'+esc(i.legende)+'" loading="lazy"><figcaption>'+esc(i.legende)+'</figcaption></figure>'}).join('')+'</div>'}).join('')+'<h2 style="margin:40px 0 18px;font-size:1.8rem" class="rv">Vidéos</h2><div class="ph-vide rv" style="min-height:160px">Aucune vidéo publique trouvée pour l\'instant : emplacement réservé aux extraits de cours et de spectacles.</div>';
  var lb=$('.lb');$$('.gal figure',el).forEach(function(f){f.addEventListener('click',function(){$('img',lb).src=$('img',f).src;lb.classList.add('on')})});lb.addEventListener('click',function(){lb.classList.remove('on')})}
};
var jobs={};$$('[data-render]').forEach(function(el){var k=el.dataset.render,src=el.dataset.src||k;(jobs[src]=jobs[src]||load(src)).then(function(d){R[k](el,d);watch()}).catch(function(){el.innerHTML='<p class="note">Contenu momentanément indisponible.</p>'})});
watch();
/* parallax doux */
var hp=$('.poster');if(hp&&!matchMedia('(prefers-reduced-motion:reduce)').matches){addEventListener('scroll',function(){hp.style.marginTop=Math.min(scrollY*.12,60)+'px'},{passive:true})}
})();
