(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const get=u=>fetch(u).then(r=>r.json());
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fdate=d=>new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
const pend=t=>`<p class="pending">${esc(t)}</p>`;
const icons={kick:"🥋",form:"☯",fight:"🥊",shield:"🛡"};
// nav
const b=$(".burger"),n=$("#nav");
b?.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
$$("#nav a").forEach(a=>a.addEventListener("click",()=>{n.classList.remove("open");b.setAttribute("aria-expanded",false)}));
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
const watch=()=>$$(".rv:not(.in)").forEach(e=>io.observe(e));
// counters
const count=el=>{const t=+el.dataset.v,s=performance.now();(function f(now){const p=Math.min((now-s)/1600,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)};
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}}));
// renderers
const R={
 async footer(el){const s=await get("/data/site.json");
  const soc=s.socials.length?s.socials.map(x=>`<li><a href="${esc(x.url)}" rel="noopener" target="_blank">${esc(x.label)}</a></li>`).join(""):`<li>Liens à ajouter</li>`;
  el.innerHTML=`<div class="wrap"><div class="grid"><div><h3>${esc(s.name)}</h3><p>Club de taekwondo<br>${esc(s.address)}<br><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p></div><div><h3>Réseaux sociaux</h3><ul>${soc}</ul></div><div><h3>Liens utiles</h3><ul>${s.links.map(x=>`<li><a href="${esc(x.url)}" rel="noopener" target="_blank">${esc(x.label)}</a></li>`).join("")}</ul></div></div><p class="copy">© ${new Date().getFullYear()} ${esc(s.name)} · Association loi 1901 · <a href="/mentions-legales.html">Mentions légales</a> · Maquette réalisée par AssoVisible</p></div>`},
 async counters(el){const c=await get("/data/counters.json"),y=new Date().getFullYear();
  el.innerHTML=c.filter(x=>x.value!=null||x.computeFromYear).map(x=>{const v=x.computeFromYear?y-x.computeFromYear:x.value;return`<div class="stat rv"><b data-v="${v}">0</b><span>${esc(x.label)}</span></div>`}).join("");
  $$("b[data-v]",el).forEach(e=>cio.observe(e))},
 async next(el){const e=await get("/data/events.json");
  el.innerHTML=e.next?`<h3>${esc(e.next.title)}</h3><p>${fdate(e.next.date)} · ${esc(e.next.place||"")}</p>`:`<h3>Prochain passage de grade</h3>${pend("Date à annoncer par le club.")}`},
 async news(el){let n=await get("/data/news.json");n.sort((a,b)=>b.date.localeCompare(a.date));if(el.dataset.limit)n=n.slice(0,+el.dataset.limit);
  el.innerHTML=n.map(x=>`<article class="card rv"><span class="tag">${fdate(x.date)}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${x.source?`<p><a href="${esc(x.source)}" rel="noopener" target="_blank">Source</a></p>`:""}</article>`).join("")},
 async disciplines(el){const c=await get("/data/courses.json");
  el.innerHTML=c.disciplines.map(d=>`<div class="card rv"><div style="font-size:2rem">${icons[d.icon]||"◆"}</div><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></div>`).join("")+`<p class="pending" style="grid-column:1/-1">${esc(c.disciplinesNote)}</p>`},
 async publics(el){const c=await get("/data/courses.json");
  el.innerHTML=c.publics.map(d=>`<div class="card rv"><span class="tag">${esc(d.age)}</span><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></div>`).join("")},
 async slots(el){const c=await get("/data/courses.json");
  el.innerHTML=c.slots.length?`<div class="table-wrap"><table><tr><th>Jour</th><th>Horaire</th><th>Public</th><th>Salle</th></tr>${c.slots.map(s=>`<tr><td>${esc(s.jour)}</td><td>${esc(s.debut)}–${esc(s.fin)}</td><td>${esc(s.public)}</td><td>${esc(s.salle)}</td></tr>`).join("")}</table></div>`:pend(c.slotsPlaceholder)},
 async tarifs(el){const c=await get("/data/courses.json");
  el.innerHTML=(c.tarifs.length?`<ul class="list">${c.tarifs.map(t=>`<li>${esc(t.label)} : <b>${esc(t.prix)}</b></li>`).join("")}</ul>`:pend(c.tarifsPlaceholder))+`<p style="margin-top:14px">${esc(c.inscription)}</p>`},
 async equip(el){const c=await get("/data/courses.json");el.innerHTML=c.equipement.map(x=>`<li>${esc(x)}</li>`).join("")},
 async belts(el){const g=await get("/data/grades.json");
  el.innerHTML=g.belts.map(b=>`<div class="belt rv"><i style="background:${b.color}"></i><div><b>${esc(b.name)}</b><small>${esc(b.meaning)}</small></div></div>`).join("")+pend(g.beltsNote)},
 async passages(el){const g=await get("/data/grades.json");
  el.innerHTML=g.passages.length?`<div class="timeline">${g.passages.map(p=>`<article><time>${fdate(p.date)}</time><h3>${esc(p.title)}</h3><p>${esc(p.text||"")}</p></article>`).join("")}</div>`:pend(g.passagesPlaceholder)},
 async prepare(el){const g=await get("/data/grades.json");el.innerHTML=g.prepare.map(x=>`<li>${esc(x)}</li>`).join("")},
 async comp(el){const c=await get("/data/competitions.json");
  const l=(a,p)=>a.length?`<div class="timeline">${a.map(x=>`<article><time>${fdate(x.date)}</time><h3>${esc(x.title)}</h3><p>${esc(x.text||"")}</p></article>`).join("")}</div>`:pend(p);
  el.innerHTML=`<div class="sec-head"><h2>Calendrier</h2></div>${l(c.calendar,c.calendarPlaceholder)}<div class="sec-head" style="margin-top:50px"><h2>Résultats & palmarès</h2></div>${l(c.results,c.resultsPlaceholder)}<p style="margin-top:36px" class="lead">${esc(c.context)}</p>`},
 async events(el){const e=await get("/data/events.json");
  const l=(a,p)=>a.length?`<div class="timeline">${a.map(x=>`<article><time>${fdate(x.date)}${x.place?" · "+esc(x.place):""}</time><h3>${esc(x.title)}</h3><p>${esc(x.text||"")}</p>${x.source?`<a href="${esc(x.source)}" rel="noopener" target="_blank">Source</a>`:""}</article>`).join("")}</div>`:pend(p);
  el.innerHTML=`<div class="sec-head"><h2>Prochains rendez-vous</h2></div>${l(e.upcoming,e.upcomingPlaceholder)}<div class="sec-head" style="margin-top:50px"><h2>Archives</h2></div>${l(e.archive,"")}`},
 async gallery(el){const g=await get("/data/gallery.json");let cur="Tout";
  const draw=()=>{const it=g.items.filter(i=>cur==="Tout"||i.category===cur);
   el.innerHTML=`<div class="filters">${["Tout",...g.categories].map(c=>`<button class="${c===cur?"on":""}">${esc(c)}</button>`).join("")}</div>`+(g.items.length?`<div class="grid">${it.map(i=>`<figure class="tile"><img src="${esc(i.src)}" alt="${esc(i.alt)}" loading="lazy"></figure>`).join("")}</div>`:`<div class="grid">${g.categories.map(c=>`<div class="tile" style="${cur==="Tout"||cur===c?"":"display:none"}"><span>◆<br>${esc(c)}<br><small>photos à venir</small></span></div>`).join("")}</div>${pend(g.placeholder)}`);
   $$(".filters button",el).forEach(b=>b.onclick=()=>{cur=b.textContent;draw()})};draw()},
 async team(el){const t=await get("/data/team.json");
  el.innerHTML=`<div class="card"><span class="tag">${esc(t.master.grade)}</span><h3>${esc(t.master.name)}</h3><p><b>${esc(t.master.role)}</b></p><p>${esc(t.master.bio)}</p></div>`},
 async board(el){const t=await get("/data/team.json");el.innerHTML=t.board.map(b=>`<div class="card"><h3>${esc(b.role)}</h3><p>${esc(b.name)}</p></div>`).join("")},
 async contact(el){const s=await get("/data/site.json");el.innerHTML=`<p><b>Adresse</b><br>${esc(s.address)}</p><p><b>Salle d'entraînement</b><br>${esc(s.salle)}</p><p><b>E-mail</b><br><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p><p><b>Contact</b><br>${esc(s.contactName)}</p>`}
};
$$("[data-render]").forEach(el=>R[el.dataset.render]?.(el).then?.(watch));
$$("[data-render]").forEach(()=>setTimeout(watch,400));setTimeout(watch,900);watch();
if(location.search.includes("envoye")){const f=$("#contact-form");if(f)f.outerHTML='<p class="ok">Merci ! Votre message a bien été envoyé. Le dojang vous répondra rapidement.</p>'}
// sparkle diamond field
const cv=$("#sparkle");
if(cv&&!matchMedia("(prefers-reduced-motion:reduce)").matches){const x=cv.getContext("2d");let w,h,P=[];
 const rs=()=>{w=cv.width=cv.offsetWidth;h=cv.height=cv.offsetHeight;P=Array.from({length:Math.min(40,w/20)},()=>({x:Math.random()*w,y:Math.random()*h,s:4+Math.random()*10,p:Math.random()*6,v:.01+Math.random()*.02}))};rs();addEventListener("resize",rs);
 (function loop(){x.clearRect(0,0,w,h);P.forEach(q=>{q.p+=q.v;const a=Math.max(0,Math.sin(q.p));x.save();x.translate(q.x,q.y);x.rotate(Math.PI/4);x.globalAlpha=a*.8;x.fillStyle="#f6dd8b";x.fillRect(-q.s/2,-q.s/2,q.s,q.s);x.restore()});requestAnimationFrame(loop)})()}
})();
