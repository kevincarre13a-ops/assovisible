/* ADFJ — comportements communs et rendu des données (data/*.json) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const IMG = n => `assets/img/${esc(n)}.webp`;
  const cache = {};
  const load = n => (cache[n] ??= fetch(`data/${n}.json`).then(r => { if (!r.ok) throw new Error(n); return r.json(); }));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateFr = iso => { const d = new Date(iso + 'T12:00:00'); return `${d.getDate() === 1 ? '1er' : d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`; };
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const CAT = { evenement: 'Événement', medias: 'Presse & radio', club: 'Vie du club', formation: 'Formation', sport: 'Sport' };

  /* ---------- Navigation ---------- */
  const header = $('.site-header');
  const burger = $('.burger');
  const nav = $('#nav');
  const closeNav = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu'); document.body.style.overflow = ''; };
  burger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav?.addEventListener('click', e => { if (e.target.closest('a')) closeNav(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeNav(); burger.focus(); } });
  addEventListener('resize', () => { if (innerWidth >= 1180) closeNav(); });
  const onScroll = () => header?.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Apparitions & compteurs ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.dataset.count) countUp(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' }) : null;
  const observe = (root = document) => $$('.rv:not(.in),[data-count]:not([data-done])', root).forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && countUp(el)));
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, from = el.dataset.from ? +el.dataset.from : 0, suf = el.dataset.suffix || '';
    const fmt = v => (el.dataset.format === 'annee' ? String(v) : v.toLocaleString('fr-FR')) + suf;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => { const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(Math.round(from + (to - from) * e)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- Rendus ---------- */
  const lieuNom = (V, id) => V.gymnases.find(g => g.id === id);
  const slotHTML = (c, V, ed) => {
    const g = lieuNom(V, c.gymnase);
    return `<div class="slot"><time>${esc(c.debut)}<small>à ${esc(c.fin)}</small></time><div>
      <strong>${esc(c.discipline)}</strong>
      <div class="meta"><span class="pill">${esc(c.age)}</span> <a href="lieux.html#${esc(c.gymnase)}">${esc(g ? g.nom : c.gymnase)}</a></div>
      <div class="meta">${esc(c.educateur || ed)}</div></div></div>`;
  };
  const daysHTML = (list, V, ed) => {
    const by = {}; list.forEach(c => (by[c.jour] ??= []).push(c));
    return `<div class="days">` + JOURS.filter(j => by[j]).map(j => `<section class="day rv" aria-label="${j}"><h3>${j}<span>${by[j].length} séance${by[j].length > 1 ? 's' : ''}</span></h3>${by[j].map(c => slotHTML(c, V, ed)).join('')}</section>`).join('') + `</div>`;
  };

  const R = {
    async counters(el) {
      const [S, C, V] = await Promise.all([load('site'), load('cours'), load('venues')]);
      const calc = { creneaux: C.enfants.creneaux.length + C.adultes.creneaux.length, activites: C.adultes.disciplines.length, gymnases: V.gymnases.length };
      el.innerHTML = S.chiffres.map(c => {
        const v = c.calcul ? calc[c.calcul] : c.valeur;
        return `<div class="counter rv"><b data-count="${v}" ${c.format ? `data-format="${c.format}" data-from="${v - 15}"` : ''} ${c.suffixe ? `data-suffix="${esc(c.suffixe)}"` : ''}>0</b><span>${esc(c.libelle)}</span>${c.note ? `<small>${esc(c.note)}</small>` : ''}</div>`;
      }).join('');
    },
    async rentree(el) {
      const S = await load('site'); const r = S.rentree;
      const over = new Date() > new Date(r.valable_jusqu_au + 'T23:59:59');
      el.innerHTML = over ? `<strong>Saison ${esc(r.saison)}</strong> <span>${esc(r.texte_apres)}</span>` : `<strong>Rentrée ${esc(r.saison)}</strong> <span>${esc(r.texte)}</span>`;
      if (el.dataset.chip !== undefined) el.innerHTML = `<span class="dot"></span><span>${over ? esc(r.texte_apres) : '<b>Rentrée :</b> ' + esc(r.texte)}</span>`;
    },
    async countdown(el) {
      const E = (await load('events')).prochain; const t = new Date(E.date_debut).getTime();
      const tick = () => {
        const d = t - Date.now();
        if (d <= 0) { el.innerHTML = `<p class="cd-over" role="status">${esc(E.texte_si_passe)}<br><strong>Prochain rendez-vous : date à annoncer.</strong></p>`; return false; }
        const j = Math.floor(d / 864e5), h = Math.floor(d % 864e5 / 36e5), m = Math.floor(d % 36e5 / 6e4), s = Math.floor(d % 6e4 / 1e3);
        const b = (v, l) => `<div class="cd-box"><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`;
        el.innerHTML = `<div class="countdown" role="timer" aria-label="Temps restant avant ${esc(E.titre)}">${b(j, 'jours')}${b(h, 'heures')}${b(m, 'min')}${b(s, 'sec')}</div>`;
        return true;
      };
      if (tick()) { const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000); }
    },
    async 'preview-cours'(el) {
      const [C, V] = await Promise.all([load('cours'), load('venues')]);
      const n = k => C[k].creneaux.length;
      const cards = [
        { t: 'Cours enfants', tag: 'Dès 3 ans et demi', p: `${C.enfants.intro}`, img: 'judo-cottonbro', href: 'cours-enfants.html', alt: 'Deux enfants en judogi pendant un cours', s: `${n('enfants')} créneaux par semaine` },
        { t: 'Cours adultes & ados', tag: 'Dès 11 ans', p: 'Judo, ju-jitsu, self-défense, taiso et cardio/fitness : le mardi, le samedi et le dimanche.', img: 'cours-ballon', href: 'cours-adultes.html', alt: 'Adultes en cours de cardio sur ballon', s: `${n('adultes')} créneaux par semaine` },
        { t: 'Nos trois gymnases', tag: 'Asnières-sur-Seine', p: 'Les Bruyères, Assia El Hannouni et Teddy Riner : trouvez le gymnase le plus proche de chez vous.', img: 'lieu-teddy-riner-1', href: 'lieux.html', alt: 'Tatami bleu et jaune de l\'Arena Teddy Riner', s: 'Adresses & plans' }
      ];
      el.innerHTML = cards.map((c, i) => `<article class="card rv d${i}"><img src="${IMG(c.img)}" alt="${esc(c.alt)}" loading="lazy" decoding="async"><div class="card-body"><span class="tag">${esc(c.tag)}</span><h3><a class="stretch" href="${c.href}">${esc(c.t)}</a></h3><p>${esc(c.p)} <strong>${esc(c.s)}.</strong></p></div></article>`).join('');
    },
    async disciplines(el) {
      const C = await load('cours');
      el.innerHTML = C.adultes.disciplines.map((d, i) => `<article class="card rv d${i % 3}"><img src="${IMG(d.image)}" alt="" loading="lazy" decoding="async"><div class="card-body"><h3>${esc(d.nom)}</h3><p>${esc(d.texte)}</p></div></article>`).join('');
    },
    async ages(el) {
      const C = await load('cours');
      el.innerHTML = C.enfants.ages.map((a, i) => `<article class="tile accent rv d${i}"><span class="pill o">${esc(a.age)}</span><h3 style="margin-top:.6rem">${esc(a.label)}</h3><p class="mb0">${esc(a.texte)}</p></article>`).join('');
    },
    async 'planning-enfants'(el) { const [C, V] = await Promise.all([load('cours'), load('venues')]); el.innerHTML = daysHTML(C.enfants.creneaux, V, C.educateur_defaut); },
    async 'planning-adultes'(el) { const [C, V] = await Promise.all([load('cours'), load('venues')]); el.innerHTML = daysHTML(C.adultes.creneaux, V, C.educateur_defaut); },
    async 'texte-enfants'(el) { el.textContent = (await load('cours')).enfants.intro; },
    async 'texte-adultes'(el) { el.textContent = (await load('cours')).adultes.intro; },
    async venues(el) {
      const [V, C] = await Promise.all([load('venues'), load('cours')]);
      el.innerHTML = V.gymnases.map(g => {
        const sl = [...C.enfants.creneaux.map(c => ({ ...c, pub: 'Enfants' })), ...C.adultes.creneaux.map(c => ({ ...c, pub: 'Ados / adultes' }))].filter(c => c.gymnase === g.id)
          .sort((a, b) => JOURS.indexOf(a.jour) - JOURS.indexOf(b.jour) || a.debut.localeCompare(b.debut));
        const bb = `${g.lon - .006}%2C${g.lat - .004}%2C${g.lon + .006}%2C${g.lat + .004}`;
        return `<article class="venue" id="${esc(g.id)}"><div class="venue-main rv">
          <span class="eyebrow">${esc(g.quartier)}</span><h2>${esc(g.nom)}</h2>
          <p><strong>Adresse :</strong> ${esc(g.adresse)}</p>
          <p><strong>Accès :</strong> ${esc(g.acces)}</p>${g.remarque ? `<p class="note">${esc(g.remarque)}</p>` : ''}
          <div class="table-wrap"><table><caption>Créneaux au ${esc(g.nom)}</caption><thead><tr><th scope="col">Jour</th><th scope="col">Horaire</th><th scope="col">Cours</th><th scope="col">Public</th></tr></thead><tbody>
          ${sl.map(c => `<tr><td>${esc(c.jour)}</td><td>${esc(c.debut)} – ${esc(c.fin)}</td><td>${esc(c.discipline)}</td><td>${esc(c.pub)}</td></tr>`).join('')}</tbody></table></div>
          <p class="mt"><a class="btn btn-dark btn-sm" href="${esc(g.lien_itineraire)}" target="_blank" rel="noopener">Itinéraire<span class="sr"> vers ${esc(g.nom)} (nouvelle fenêtre)</span></a></p></div>
          <div class="rv d1"><div class="venue-ph">${g.photos.map(p => `<img src="${IMG(p)}" alt="Intérieur du ${esc(g.nom)}" loading="lazy" decoding="async">`).join('')}</div>
          <iframe class="map mt" title="Plan indicatif : ${esc(g.nom)}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bb}&amp;layer=mapnik&amp;marker=${g.lat}%2C${g.lon}"></iframe>
          <p class="note">${esc(g.plan_note)} <a href="${esc(g.lien_carte)}" target="_blank" rel="noopener">Agrandir le plan</a></p></div></article>`;
      }).join('');
    },
    async 'venues-list'(el) {
      const V = await load('venues');
      el.innerHTML = V.gymnases.map(g => `<li><a href="lieux.html#${esc(g.id)}"><strong>${esc(g.nom)}</strong></a><br>${esc(g.adresse)}</li>`).join('');
    },
    async frise(el) {
      const E = await load('events'); const f = el.dataset.type; const lim = +el.dataset.limit || 99;
      const items = E.frise.filter(x => !f || f.split(',').includes(x.type)).slice(0, lim);
      el.innerHTML = items.map((x, i) => `<li class="rv d${i % 2}"><span class="tl-date">${esc(x.date)}</span><div class="tl-card ${x.type === 'ninja' ? 'ninja-t' : ''}">${x.image ? `<img src="${IMG(x.image)}" alt="" loading="lazy" decoding="async">` : ''}<div><h3>${esc(x.titre)}</h3><p>${esc(x.texte)}</p></div></div></li>`).join('');
    },
    async ninja(el) {
      const N = (await load('events')).ninja;
      el.innerHTML = `<ul class="facts"><li><strong>${esc(N.dates)}</strong></li><li>${esc(N.lieu)}</li>${N.programme.map(p => `<li>${esc(p.jour)} · ${esc(p.horaire)} — <strong>${esc(p.titre)}</strong></li>`).join('')}<li>${esc(N.attendus)}</li><li>${esc(N.soutiens)}</li></ul>`;
    },
    async autres(el) {
      const E = await load('events');
      el.innerHTML = E.autres.map((a, i) => `<article class="tile rv d${i}"><img src="${IMG(a.image)}" alt="${esc(a.alt)}" loading="lazy" decoding="async" style="border-radius:12px;margin-bottom:1rem;aspect-ratio:16/10;object-fit:cover;width:100%"><span class="pill y">${esc(a.date)}</span><h3 style="margin-top:.6rem">${esc(a.titre)}</h3><p class="mb0">${esc(a.texte)}</p></article>`).join('');
    },
    async seances(el) {
      const E = await load('events');
      el.innerHTML = E.seances.map((s, i) => `<article class="tile rv d${i % 3}"><h3>${esc(s.titre)}</h3><p class="mb0">${esc(s.texte)}</p></article>`).join('');
    },
    async 'galerie-editions'(el) {
      const E = await load('events');
      el.innerHTML = E.galerie_editions.map(g => `<a href="${IMG(g.image)}" data-lb data-alt="${esc(g.alt)}" data-cap="${esc(g.legende)}"><img src="${IMG(g.image)}" alt="${esc(g.alt)}" loading="lazy" decoding="async"></a>`).join('');
      lightbox(el);
    },
    async 'news-latest'(el) {
      const N = await load('news'); el.innerHTML = N.articles.slice(0, +el.dataset.limit || 3).map(postHTML).join('');
    },
    async 'news-all'(el) {
      const N = await load('news'); const fb = $('#news-filters');
      const cats = ['tout', ...new Set(N.articles.map(a => a.categorie))];
      const draw = c => { el.innerHTML = N.articles.filter(a => c === 'tout' || a.categorie === c).map(postHTML).join(''); observe(el); };
      if (fb) { fb.innerHTML = cats.map(c => `<button type="button" aria-pressed="${c === 'tout'}" data-c="${c}">${c === 'tout' ? 'Tout' : CAT[c] || c}</button>`).join(''); fb.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', fb).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.c); }); }
      draw('tout');
    },
    async podcasts(el) { const N = await load('news'); el.innerHTML = N.podcasts.map(p => `<li><a href="${esc(p.lien)}" target="_blank" rel="noopener">${esc(p.titre)}<span class="sr"> (nouvelle fenêtre)</span></a></li>`).join(''); },
    async gallery(el) {
      const G = await load('gallery'); const fb = $('#gal-filters');
      const draw = c => { el.innerHTML = G.photos.filter(p => c === 'tout' || p.cat === c).map(p => `<a href="${IMG(p.image)}" data-lb data-alt="${esc(p.alt)}" data-cap="${esc(p.alt)}"><img src="${IMG(p.image)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></a>`).join(''); lightbox(el); };
      fb.innerHTML = G.categories.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-c="${c.id}">${esc(c.nom)}</button>`).join('');
      fb.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', fb).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.c); });
      draw('tout');
    },
    async partners(el) {
      const P = await load('partners');
      el.innerHTML = P.partenaires.map(p => {
        const inner = p.logo ? `<img src="assets/logos/${esc(p.logo)}" alt="${esc(p.nom)}" loading="lazy" decoding="async">` : `<span>${esc(p.nom)}</span>`;
        return p.lien ? `<a class="logo-tile" href="${esc(p.lien)}" target="_blank" rel="noopener" title="${esc(p.nom)}">${inner}<span class="sr">${esc(p.nom)} (nouvelle fenêtre)</span></a>` : `<div class="logo-tile" title="${esc(p.nom)}">${inner}</div>`;
      }).join('');
    },
    async team(el) {
      const T = await load('team');
      const k = el.dataset.kind;
      if (k === 'bureau') el.innerHTML = T.bureau.map((m, i) => `<article class="tile accent rv d${i}"><span class="pill">${esc(m.role)}</span><h3 style="margin-top:.6rem">${esc(m.nom)}</h3><p>${esc(m.texte)}</p>${m.diplomes ? `<p class="note mb0">${esc(m.diplomes)}</p>` : ''}</article>`).join('');
      if (k === 'educateurs') el.innerHTML = T.educateurs.map((m, i) => `<article class="tile rv d${i}"><span class="pill ${m.attente ? 'y' : ''}">${esc(m.role)}</span><h3 style="margin-top:.6rem">${esc(m.nom)}</h3><p class="note mb0">${esc(m.diplomes)}</p></article>`).join('');
      if (k === 'valeurs') el.innerHTML = T.valeurs.map((m, i) => `<article class="tile rv d${i % 3}"><h3>${esc(m.titre)}</h3><p class="mb0">${esc(m.texte)}</p></article>`).join('');
    },
    async tarifs(el) {
      const I = (await load('site')).inscription;
      el.innerHTML = I.tarifs.length ? `<div class="table-wrap"><table><thead><tr><th>Formule</th><th>Tarif</th></tr></thead><tbody>${I.tarifs.map(t => `<tr><td>${esc(t.nom)}</td><td>${esc(t.prix)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="callout todo">${esc(I.tarifs_texte_attente)}</p>`;
    },
    async aides(el) { el.innerHTML = (await load('site')).inscription.aides.map(a => `<li>${esc(a)}</li>`).join(''); },
    async 'lien-actuel'(el) { el.href = (await load('site')).inscription.page_actuelle; }
  };
  const postHTML = a => {
    const ext = a.lien && /^https?:/.test(a.lien);
    const poster = /affiche|impact|label/.test(a.image);
    return `<article class="post rv"><img class="${poster ? 'contain' : ''}" src="${IMG(a.image)}" alt="${esc(a.alt)}" loading="lazy" decoding="async"><div class="post-b"><time datetime="${esc(a.date)}">${dateFr(a.date)} · ${esc(CAT[a.categorie] || '')}</time><h3>${esc(a.titre)}</h3><p>${esc(a.texte)}</p>${a.lien ? `<a class="more" href="${esc(a.lien)}" ${ext ? 'target="_blank" rel="noopener"' : ''}>${esc(a.lien_texte || 'En savoir plus')}${ext ? '<span class="sr"> (nouvelle fenêtre)</span>' : ''} →</a>` : ''}</div></article>`;
  };

  /* ---------- Lightbox ---------- */
  let lb;
  function lightbox(scope) {
    const links = $$('[data-lb]', scope); if (!links.length) return;
    if (!lb) {
      lb = document.createElement('dialog'); lb.className = 'lb'; lb.setAttribute('aria-label', 'Visionneuse de photos');
      lb.innerHTML = '<div class="lb-in"><button class="x" type="button" aria-label="Fermer">✕</button><button class="p" type="button" aria-label="Photo précédente">‹</button><figure style="margin:0;display:contents"><img alt=""><figcaption></figcaption></figure><button class="n" type="button" aria-label="Photo suivante">›</button></div>';
      document.body.appendChild(lb);
    }
    let cur = 0, set = links;
    const show = i => { cur = (i + set.length) % set.length; const a = set[cur]; $('img', lb).src = a.href; $('img', lb).alt = a.dataset.alt || ''; $('figcaption', lb).textContent = a.dataset.cap || ''; };
    scope.onclick = e => { const a = e.target.closest('[data-lb]'); if (!a) return; e.preventDefault(); set = $$('[data-lb]', scope); show(set.indexOf(a)); lb.showModal(); };
    lb.onclick = e => { if (e.target.closest('.x') || e.target === $('.lb-in', lb)) lb.close(); else if (e.target.closest('.p')) show(cur - 1); else if (e.target.closest('.n')) show(cur + 1); };
    lb.onkeydown = e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); };
  }

  /* ---------- Héros : diaporama ---------- */
  const slides = $$('.hero-slides li');
  if (slides.length > 1 && !reduce) { let i = 0; setInterval(() => { slides[i].classList.remove('on'); i = (i + 1) % slides.length; slides[i].classList.add('on'); }, 6500); }

  /* ---------- Lancement ---------- */
  const jobs = $$('[data-render]').map(el => { const f = R[el.dataset.render]; return f ? f(el).catch(err => { console.warn('Données indisponibles :', el.dataset.render, err); el.innerHTML = '<p class="note">Contenu momentanément indisponible. Contactez-nous au 06 87 75 74 82.</p>'; }) : null; });
  Promise.all(jobs).then(() => observe());
  observe();
})();
