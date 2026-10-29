(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const get=u=>fetch(u).then(r=>r.json());
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const fd=d=>{const x=new Date(d);return {j:x.getDate(),m:MOIS[x.getMonth()],a:x.getFullYear()}};
const dateBox=(d,cls='')=>{const t=fd(d);return `<div class="date"><b>${t.j}</b><span>${t.m} ${t.a}</span></div>`};
const ICONS={book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13"/>',people:'<circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><circle cx="18" cy="9" r="2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',leaf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8"/>'};
const ico=n=>`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||ICONS.sun}</svg>`;

/* header */
const h=$('.site-header');
const onScroll=()=>h.classList.toggle('solid',scrollY>40||!$('.hero,.page-hero'));
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('.burger').addEventListener('click',e=>{const o=h.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>h.classList.remove('open')));

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const watch=()=>$$('.rv:not(.in)').forEach(el=>io.observe(el));

/* counters */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
 const el=e.target,end=+el.dataset.count,from=+(el.dataset.from||0),t0=performance.now();
 const step=t=>{const p=Math.min((t-t0)/1800,1),v=Math.round(from+(end-from)*(1-Math.pow(1-p,3)));el.textContent=v+(el.dataset.suffix||'');if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.5});
$$('[data-count]').forEach(el=>cio.observe(el));
$$('[data-years]').forEach(el=>{el.dataset.count=Math.max(1,new Date().getFullYear()-2021);cio.observe(el)});

/* water ripples on hero */
const cv=$('.hero canvas');
if(cv&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 const x=cv.getContext('2d');let W,H,rip=[];
 const rs=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight};rs();addEventListener('resize',rs);
 const add=(px,py)=>rip.push({x:px,y:py,r:0,a:.55});
 const hero=cv.parentElement;
 hero.addEventListener('pointermove',e=>{if(Math.random()<.18){const b=cv.getBoundingClientRect();add(e.clientX-b.left,e.clientY-b.top)}});
 setInterval(()=>add(W*.5+(Math.random()-.5)*W*.12,H*.84),1100);
 (function f(){x.clearRect(0,0,W,H);rip=rip.filter(r=>r.a>.01);rip.forEach(r=>{r.r+=1.6;r.a*=.972;x.strokeStyle=`rgba(255,255,255,${r.a})`;x.lineWidth=2;x.beginPath();x.ellipse(r.x,r.y,r.r,r.r*.38,0,0,7);x.stroke()});requestAnimationFrame(f)})();
}

/* data driven blocks */
const evCard=(e,arch)=>`<article class="row ${arch?'arch':''} rv">${dateBox(e.date)}<div><span class="tag">${esc(e.type||'Rendez-vous')}</span><h3>${esc(e.titre)}</h3><p>${esc(e.texte)}</p><p class="meta" style="font-size:.9rem;color:var(--ink-soft)">📍 ${esc(e.lieu||'Flassan')}${e.lien?` · <a href="${esc(e.lien)}" target="_blank" rel="noopener">Lire la source</a>`:''}</p></div></article>`;
const newsCard=n=>`<article class="card rv">${n.date?`<span class="tag">${fd(n.date).j} ${fd(n.date).m} ${fd(n.date).a}</span>`:'<span class="tag">À venir</span>'}<h3>${esc(n.titre)}</h3><p>${esc(n.texte)}</p>${n.lien?`<a href="${esc(n.lien)}" target="_blank" rel="noopener">Lire sur ${esc(n.source||'le site source')} →</a>`:''}</article>`;

const need=sel=>$(sel);
(async()=>{
 const site=await get('data/site.json').catch(()=>null);
 /* footer contact */
 $$('[data-contact]').forEach(el=>{const c=site?.contact||{};const parts=[c.adresse];if(c.email)parts.push(`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`);if(c.telephone)parts.push(esc(c.telephone));
  el.innerHTML=parts.filter(Boolean).join('<br>')+(c.email||c.telephone?'':'<br><em>E-mail et téléphone à compléter</em>')});
 $$('[data-social]').forEach(el=>{const r=site?.reseaux||[];el.innerHTML=r.length?r.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.nom)}</a></li>`).join(''):'<li><em>Liens vers les réseaux sociaux à ajouter</em></li>'});

 if(need('#next')||need('#agenda-up')||need('#agenda-arch')||need('#home-news')||need('#news')||need('#acts')||need('#acts-home')||need('#gal')||need('#team')){
  const [ev,ac,nw,eq,gl]=await Promise.all([get('data/evenements.json'),get('data/activites.json'),get('data/actualites.json'),get('data/equipe.json'),get('data/galerie.json')]).catch(()=>[{},[],[],[],{}]);
  const nx=$('#next');
  if(nx&&ev.prochain){const p=ev.prochain,ok=p.date&&new Date(p.date)>new Date();
   nx.innerHTML=`<div><span class="eyebrow" style="background:rgba(255,255,255,.2)">Prochain événement</span><h2 style="margin-top:.5em">${esc(p.titre)}</h2><p>${esc(ok?(p.lieu||''):p.texte)}</p><a class="btn" href="agenda.html">Voir l'agenda</a></div>
   ${ok?`<div class="count" aria-live="off"><div><b id="cj">0</b><span>jours</span></div><div><b id="ch">0</b><span>heures</span></div><div><b id="cm">0</b><span>min</span></div><div><b id="cs">0</b><span>sec</span></div></div>`:`<div class="tbd"><strong>Date à annoncer</strong><br>Le compte à rebours s'affichera dès qu'une date sera renseignée.</div>`}`;
   if(ok){const t=new Date(p.date),z=n=>String(n).padStart(2,'0');const tick=()=>{let d=Math.max(0,t-new Date())/1000;$('#cj').textContent=Math.floor(d/86400);$('#ch').textContent=z(Math.floor(d%86400/3600));$('#cm').textContent=z(Math.floor(d%3600/60));$('#cs').textContent=z(Math.floor(d%60))};tick();setInterval(tick,1000)}}
  const up=$('#agenda-up');if(up){up.innerHTML=(ev.a_venir||[]).length?ev.a_venir.map(e=>evCard(e)).join(''):`<div class="ph">Aucun rendez-vous publié pour le moment. Les prochaines dates seront ajoutées dans <code>data/evenements.json</code>.</div>`}
  const ar=$('#agenda-arch');if(ar)ar.innerHTML=(ev.archives||[]).map(e=>evCard(e,1)).join('');
  const act=card=>`<article class="card rv"><div class="ico">${ico(card.icone)}</div><h3>${esc(card.titre)}</h3><p>${esc(card.texte)}</p></article>`;
  const ah=$('#acts-home');if(ah)ah.innerHTML=ac.map(act).join('');
  const aa=$('#acts');if(aa)aa.innerHTML=ac.map(a=>`<article class="card rv"><div class="ico">${ico(a.icone)}</div><h3>${esc(a.titre)}</h3><p>${esc(a.texte)}</p><p class="meta">🗓 ${esc(a.quand)}<br>📍 ${esc(a.lieu)}<br>💶 Tarif : ${esc(a.tarif)}</p></article>`).join('');
  const hn=$('#home-news');if(hn)hn.innerHTML=nw.slice(0,3).map(newsCard).join('');
  const nn=$('#news');if(nn)nn.innerHTML=nw.map(newsCard).join('');
  const tm=$('#team');if(tm)tm.innerHTML=eq.map(p=>`<article class="card person rv"><div class="avatar">${esc(p.nom.split(' ').map(w=>w[0]).slice(0,2).join(''))}</div><h3>${esc(p.nom)}</h3><p class="meta">${esc(p.role)}</p></article>`).join('');
  const g=$('#gal');if(g){const fl=$('#filters');let cur='Tout';
   const draw=()=>{g.innerHTML=gl.photos.filter(p=>cur==='Tout'||p.cat===cur).map(p=>`<figure class="shot rv" style="margin:0">${p.src?`<img src="${esc(p.src)}" alt="${esc(p.titre)}" loading="lazy">`:`<div><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z"/></svg><strong>Photo à ajouter</strong><small>${esc(p.titre)}</small></div>`}<figcaption>${esc(p.cat)}</figcaption></figure>`).join('');watch()};
   fl.innerHTML=['Tout',...gl.categories].map(c=>`<button aria-pressed="${c==='Tout'}">${esc(c)}</button>`).join('');
   fl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=b.textContent;$$('button',fl).forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});draw()}
 }
 watch();
})();
watch();
})();
