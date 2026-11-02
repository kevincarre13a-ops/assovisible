(function(){
"use strict";
var D=window.TPO||{};
var JOURS=["","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var h=function(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var hm=function(t){return t.replace(":","h")};
var niv=function(c){return (c.titre)||D.niveaux[c.niveau].titre};
var mapUrl=function(q){return "https://www.openstreetmap.org/search?query="+encodeURIComponent(q)};
var reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- en-tête ---------- */
var header=$(".site-header"),burger=$(".burger"),menu=$("#menu");
function onScroll(){header&&header.classList.toggle("scrolled",window.scrollY>10)}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
if(burger){
  burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&menu.classList.contains("open")){menu.classList.remove("open");burger.setAttribute("aria-expanded","false");burger.focus()}});
  $$("a",menu).forEach(function(a){a.addEventListener("click",function(){menu.classList.remove("open");burger.setAttribute("aria-expanded","false")})});
}

/* ---------- ondes sur le héro ---------- */
var hero=$(".hero");
if(hero&&!reduced){
  var last=0;
  hero.addEventListener("pointermove",function(e){
    var n=Date.now();if(n-last<420)return;last=n;
    var r=hero.getBoundingClientRect(),d=document.createElement("span");
    d.className="ripple";d.style.left=(e.clientX-r.left)+"px";d.style.top=(e.clientY-r.top)+"px";
    hero.appendChild(d);setTimeout(function(){d.remove()},2300);
  });
}

/* ---------- données dynamiques ---------- */
var coursSorted=(D.cours||[]).slice().sort(function(a,b){return a.jour-b.jour||a.debut.localeCompare(b.debut)});
function lieuName(k){return D.lieux[k].nom}

/* chiffres clés */
var cn=$("[data-count=cours]");if(cn)cn.dataset.to=(D.cours||[]).length;
var ln=$("[data-count=lieux]");if(ln)ln.dataset.to=Object.keys(D.lieux||{}).length;
var tn=$("[data-count=ens]");if(tn)tn.dataset.to=(D.enseignantes||[]).length;
function countUp(el){
  var to=+el.dataset.to,suf=el.dataset.suffix||"",t0=null,dur=1800;
  if(reduced){el.textContent=to+suf;return}
  (function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step)})(performance.now());
}

/* prochaine séance / prochain événement */
function nextOccurrence(c,from){
  var p=c.debut.split(":"),d=new Date(from);
  d.setHours(+p[0],+p[1],0,0);
  var dow=d.getDay()||7,add=(c.jour-dow+7)%7;d.setDate(d.getDate()+add);
  if(d<from)d.setDate(d.getDate()+7);
  return d;
}
function nextSession(now){
  var best=null;
  (D.cours||[]).forEach(function(c){var d=nextOccurrence(c,now);if(!best||d<best.d)best={c:c,d:d}});
  return best;
}
var nx=$("#next");
if(nx){
  var now=new Date(),futur=(D.evenements||[]).filter(function(e){return e.date&&new Date(e.date)>now}).sort(function(a,b){return new Date(a.date)-new Date(b.date)})[0];
  var target,titre,sous,lien;
  if(futur){target=new Date(futur.date);titre=futur.titre;sous=futur.type+" · "+futur.lieu;lien="stages-evenements.html";$("#next-label").textContent="Prochain "+futur.type.toLowerCase()}
  else{
    var s=nextSession(now);target=s.d;titre=JOURS[s.c.jour]+" "+hm(s.c.debut)+" · "+lieuName(s.c.lieu);
    sous=niv(s.c)+" — "+s.c.salle;lien="cours-planning.html";
  }
  $("#next-title").textContent=titre;$("#next-sub").textContent=sous;$("#next-link").href=lien;
  var ids=["d","h","m","s"];
  (function tick(){
    var diff=Math.max(0,target-new Date()),v=[Math.floor(diff/864e5),Math.floor(diff/36e5)%24,Math.floor(diff/6e4)%60,Math.floor(diff/1e3)%60];
    ids.forEach(function(k,i){$("#cd-"+k).textContent=String(v[i]).padStart(2,"0")});
    setTimeout(tick,1000);
  })();
}

/* planning interactif */
var pl=$("#planning");
if(pl){
  var cur="tous",today=new Date().getDay()||7;
  var dlg=$("#slot-dialog");
  function drawPlan(){
    var html="";
    for(var j=1;j<=6;j++){
      var list=coursSorted.filter(function(c){return c.jour===j&&(cur==="tous"||c.lieu===cur)});
      var extra=(D.mensuel&&j===D.mensuel.jour&&(cur==="tous"||cur===D.mensuel.lieu))?D.mensuel:null;
      html+='<div class="day'+(j===today?" today":"")+'"><h3>'+JOURS[j]+'</h3>';
      if(!list.length&&!extra)html+='<p class="vide">Pas de cours</p>';
      list.forEach(function(c){var i=D.cours.indexOf(c);
        html+='<button class="slot c-'+c.lieu+'" data-i="'+i+'"><b>'+hm(c.debut)+' – '+hm(c.fin)+'</b>'+h(niv(c))+'<br><small>'+h(lieuName(c.lieu))+'</small></button>'});
      if(extra)html+='<button class="slot c-'+extra.lieu+'" data-i="m"><b>'+hm(extra.debut)+' – '+hm(extra.fin)+'</b>Matinée de pratique<br><small>1 samedi par mois · '+h(lieuName(extra.lieu))+'</small></button>';
      html+='</div>';
    }
    pl.innerHTML=html;
  }
  drawPlan();
  pl.addEventListener("click",function(e){
    var b=e.target.closest(".slot");if(!b)return;
    var c=b.dataset.i==="m"?Object.assign({niveau:"pratique"},D.mensuel):D.cours[+b.dataset.i],L=D.lieux[c.lieu],n=D.niveaux[c.niveau];
    dlg.innerHTML='<h3>'+h(c.titre||n.titre)+'</h3><p><b>'+(c.jour===6?"1 samedi par mois":JOURS[c.jour])+'</b>, '+hm(c.debut)+' – '+hm(c.fin)+'</p>'
      +'<p><b>Lieu :</b> '+h(c.salle)+', '+h(L.nom)+'<br><b>Public :</b> '+h(n.public)+'<br><b>Niveau :</b> '+h(n.niveau)+'</p>'
      +'<p><a href="'+mapUrl(L.requete)+'" target="_blank" rel="noopener">Voir sur la carte (nouvel onglet)</a></p>'
      +'<div class="btn-row"><a class="btn btn-primary" href="nous-rejoindre.html">Venir essayer</a><button class="btn btn-ghost" id="dlg-close">Fermer</button></div>';
    dlg.showModal();
  });
  dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.id==="dlg-close")dlg.close()});
  $$(".chip[data-lieu]").forEach(function(ch){ch.addEventListener("click",function(){
    cur=ch.dataset.lieu;$$(".chip[data-lieu]").forEach(function(x){x.setAttribute("aria-pressed",x===ch)});drawPlan()})});
}

/* cartes disciplines (accueil) */
var cards=$("#niveaux-cards");
if(cards){
  var imgs={debutant:"img/pratique-3.jpg",approfondissement:"img/file-parc.jpg",perfectionnement:"img/eventail.jpg"};
  cards.innerHTML=["debutant","approfondissement","perfectionnement"].map(function(k,i){var n=D.niveaux[k];
    return '<div class="flip rv d'+i+'" tabindex="0" role="group" aria-label="'+h(n.titre)+'"><div class="flip-in">'
    +'<div class="flip-face flip-front" style="--img:url(/'+imgs[k]+')"><span class="ico" aria-hidden="true">'+n.icone+'</span><h3>'+h(n.titre)+'</h3><span class="flip-hint">'+h(n.niveau)+'</span></div>'
    +'<div class="flip-face flip-back"><h3>'+h(n.titre)+'</h3><p>'+h(n.texte)+'</p><a href="cours-planning.html" class="arrow-link">Horaires et lieux</a></div></div></div>'}).join("");
  $$(".flip",cards).forEach(function(f){f.addEventListener("click",function(){f.classList.toggle("on")})});
}

/* fiches cours */
var fi=$("#fiches");
if(fi){
  fi.innerHTML=Object.keys(D.niveaux).map(function(k,i){
    var n=D.niveaux[k];
    var items=(k==="pratique"?[Object.assign({lieu:D.mensuel.lieu,jour:6,debut:D.mensuel.debut,fin:D.mensuel.fin,salle:D.mensuel.salle,niveau:k})]:coursSorted.filter(function(c){return c.niveau===k}));
    return '<article class="card fiche rv d'+(i%3)+'" id="fiche-'+k+'"><div class="ico" aria-hidden="true">'+n.icone+'</div><div><h3>'+h(n.titre)+'</h3>'
      +'<span class="tag">'+h(n.niveau)+'</span><p><b>Public :</b> '+h(n.public)+'</p><p>'+h(n.texte)+'</p>'
      +'<p><b>Enseignante :</b> l\'une des enseignantes de l\'association <span class="vide">(à confirmer par créneau)</span></p>'
      +'<ul>'+items.map(function(c){return '<li><b>'+(c.jour===6?"1 samedi par mois":JOURS[c.jour])+' '+hm(c.debut)+' – '+hm(c.fin)+'</b> · '+h(lieuName(c.lieu))+'<small>'+h(c.salle)+(c.titre?" · "+h(c.titre):"")+'</small></li>'}).join("")+'</ul></div></article>';
  }).join("");
}

/* lieux */
var lx=$("#lieux");
if(lx){
  lx.innerHTML=Object.keys(D.lieux).map(function(k,i){var L=D.lieux[k];
    return '<article class="card rv d'+i+'"><span class="eyebrow">'+h(L.dept)+'</span><h3>'+h(L.nom)+'</h3><p>'+h(L.adresse)+'</p><p><b>Rentrée 2026 :</b> '+h(L.rentree)+'</p><a class="arrow-link" target="_blank" rel="noopener" href="'+mapUrl(L.requete)+'">Voir sur la carte<span class="sr" style="position:absolute;left:-999px"> (nouvel onglet)</span></a></article>'}).join("");
}
var ml=$("#map-links");
if(ml)ml.innerHTML=Object.keys(D.lieux).map(function(k){var L=D.lieux[k];return '<a target="_blank" rel="noopener" href="'+mapUrl(L.requete)+'"><span>'+h(L.nom)+'<br><small style="font-weight:400">'+h(L.adresse)+'</small></span><span aria-hidden="true">↗</span></a>'}).join("");

/* enseignantes / bureau */
var te=$("#team");
if(te)te.innerHTML=D.enseignantes.map(function(p,i){
  var ini=p.nom.split(" ").map(function(w){return w[0]}).slice(0,2).join("");
  return '<article class="card rv d'+(i%3)+'" style="text-align:center"><div aria-hidden="true" style="width:84px;height:84px;margin:0 auto 1rem;border-radius:50%;background:linear-gradient(135deg,var(--wave),var(--ocean));color:#fff;display:grid;place-items:center;font:600 2rem var(--serif)">'+h(ini)+'</div><h3>'+h(p.nom)+'</h3><p style="margin:0"><b>'+h(p.diplome)+'</b><br>'+h(p.role)+'</p></article>'}).join("");
var bu=$("#bureau");
if(bu)bu.innerHTML=D.bureau.map(function(p){return '<li><b>'+h(p.nom)+'</b> — '+(p.detail==="À compléter"?'<span class="placeholder">À compléter</span>':h(p.detail))+'</li>'}).join("");

/* tarifs */
var tr=$("#tarifs");
if(tr){var T=D.tarifs,fixe=T.adhesion+T.licence;
  var set=function(id,v){var e=$(id);if(e)e.textContent=v};
  set("#t-adh",T.adhesion);set("#t-lic",T.licence);set("#t-plein",T.plein);set("#t-reduit",T.reduit);
  set("#t-total-plein",fixe+T.plein);set("#t-total-reduit",fixe+T.reduit);
}

/* événements */
function fmtDate(s){var d=new Date(s);return {j:d.getDate(),m:d.toLocaleDateString("fr-FR",{month:"short"})}}
function evHtml(e,i){
  var w=e.date?'<div class="when"><b>'+fmtDate(e.date).j+'</b><span>'+fmtDate(e.date).m+'</span></div>':'<div class="when tba">Date à<br>confirmer</div>';
  return '<article class="card ev rv d'+(i%3)+'">'+w+'<div><span class="tag">'+h(e.type)+'</span><h3>'+h(e.titre)+'</h3><p style="margin:0"><b>'+h(e.lieu)+'</b><br>'+h(e.detail)+'</p></div></article>'}
var ea=$("#events-up");
if(ea)ea.innerHTML=D.evenements.filter(function(e){return e.a_venir}).map(evHtml).join("");
var ear=$("#events-arch");
if(ear)ear.innerHTML=D.evenements.filter(function(e){return !e.a_venir}).map(evHtml).join("");

/* actualités */
function newsHtml(a,i){
  var ext=/^docs\//.test(a.lien)?' target="_blank" rel="noopener"':"";
  return '<article class="card news rv d'+(i%3)+'"><div class="im"><img src="'+a.image+'" alt="" loading="lazy" width="640" height="400"></div><div class="tx"><span class="date">'+h(a.date)+'</span><h3>'+h(a.titre)+'</h3><p>'+h(a.texte)+'</p><a class="arrow-link" href="'+a.lien+'"'+ext+'>'+h(a.lienTexte)+'</a></div></article>'}
var nh=$("#news-home");if(nh)nh.innerHTML=D.actualites.slice(0,3).map(newsHtml).join("");
var na=$("#news-all");if(na)na.innerHTML=D.actualites.map(newsHtml).join("");

/* galerie */
var ga=$("#gallery");
if(ga){
  ga.innerHTML=D.galerie.map(function(g,i){return '<figure data-cat="'+g.cat+'"><button type="button" data-i="'+i+'" aria-label="Agrandir : '+h(g.alt)+'"><img src="'+g.src+'" alt="'+h(g.alt)+'" loading="lazy"></button></figure>'}).join("");
  var fl=$("#gal-filters");
  fl.innerHTML='<button class="chip" aria-pressed="true" data-cat="tous">Tout</button>'+Object.keys(D.categories).map(function(k){return '<button class="chip" aria-pressed="false" data-cat="'+k+'">'+h(D.categories[k])+'</button>'}).join("");
  fl.addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;
    $$(".chip",fl).forEach(function(x){x.setAttribute("aria-pressed",x===b)});
    $$("figure",ga).forEach(function(f){f.classList.toggle("hide",b.dataset.cat!=="tous"&&f.dataset.cat!==b.dataset.cat)})});
  var lb=$("#lb"),lbi=$("img",lb),lbp=$("p",lb),opener;
  ga.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var g=D.galerie[+b.dataset.i];
    lbi.src=g.src;lbi.alt=g.alt;lbp.textContent=g.alt+" — "+D.categories[g.cat];lb.classList.add("open");opener=b;$("button",lb).focus()});
  function close(){lb.classList.remove("open");opener&&opener.focus()}
  lb.addEventListener("click",function(e){if(e.target===lb||e.target.tagName==="BUTTON")close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&lb.classList.contains("open"))close()});
  var vd=$("#videos");if(vd&&!D.videos.length)vd.innerHTML='<div class="placeholder">Les vidéos de l\'association seront ajoutées ici (texte d\'attente). Pour le moment, retrouvez des vidéos du Taichi Chuan Toum sur <a href="https://toum.asso.fr/" target="_blank" rel="noopener">toum.asso.fr</a>.</div>';
}

/* message d'envoi du formulaire */
if(/[?&]envoye=1/.test(location.search)){var ok=$("#sent");if(ok){ok.hidden=false;ok.focus&&ok.setAttribute("tabindex","-1");ok.focus()}}

/* apparitions + compteurs */
var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(en){
  if(en.isIntersecting){var el=en.target;el.classList.add("in");if(el.dataset.to)countUp(el);io.unobserve(el)}})},{threshold:.15}):null;
function observe(){$$(".rv:not(.in),[data-to]").forEach(function(el){io?io.observe(el):(el.classList.add("in"),el.dataset.to&&(el.textContent=el.dataset.to+(el.dataset.suffix||"")))})}
observe();
})();
