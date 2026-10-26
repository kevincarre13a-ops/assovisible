/* À Chœur Ouvert — comportements communs. Les contenus viennent des fichiers /data/*.json */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const MOIS_C = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getJSON = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
  const parse = s => { const [d, t = '00:00'] = s.split('T'); const [y, m, j] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number); return new Date(y, m - 1, j, h, mi); };
  const longDate = d => `${JOURS[d.getDay()]} ${d.getDate()}${d.getDate() === 1 ? 'er' : ''} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;

  /* En-tête : fond au défilement + burger */
  const hdr = $('.hdr'), burger = $('.burger'), nav = $('.nav');
  const onScroll = () => hdr.classList.toggle('solid', scrollY > 24 || hdr.dataset.solid === '1');
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  burger?.addEventListener('click', () => {
    const o = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', o); nav.classList.toggle('open', o);
    if (o) hdr.classList.add('solid'); else onScroll();
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') { nav.classList.remove('open'); burger?.setAttribute('aria-expanded', 'false'); } });

  /* Notes de musique flottantes dans le héro */
  const notes = $('.notes');
  if (notes && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const glyphs = ['♪', '♫', '♩', '♬'];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.textContent = glyphs[i % 4];
      s.style.cssText = `left:${(i * 8.3 + Math.random() * 6) % 98}%;animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s`;
      notes.append(s);
    }
  }

  /* Apparition douce */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  const reveal = r => $$('.rv:not(.in)', r).forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* Compteurs animés */
  const count = el => {
    const to = +el.dataset.to; if (!to && to !== 0) return;
    if (matchMedia('(prefers-reduced-motion:reduce)').matches || to === 0) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), { threshold: .6 }) : null;
  const counters = r => $$('[data-to]', r).forEach(el => cio ? cio.observe(el) : (el.textContent = el.dataset.to));

  /* Données partagées */
  let concertsP, siteP;
  const loadConcerts = () => concertsP ||= getJSON('data/concerts.json');
  const loadSite = () => siteP ||= getJSON('data/site.json');
  const upcomingAndPast = d => {
    const now = new Date();
    const all = d.concerts.map(c => ({ ...c, _d: parse(c.date) })).sort((a, b) => a._d - b._d);
    return { up: all.filter(c => c._d >= now), past: all.filter(c => c._d < now).reverse() };
  };

  /* Prochain concert + compte à rebours */
  const nextBox = $('[data-next]');
  if (nextBox) loadConcerts().then(d => {
    const { up } = upcomingAndPast(d);
    const p = d.prochain, planned = p.date ? parse(p.date) : null;
    const nxt = planned && planned >= new Date() ? { ...p, _d: planned } : up[0];
    if (nxt) {
      $('[data-next-title]', nextBox).textContent = nxt.titre;
      $('[data-next-meta]', nextBox).innerHTML = `<span>🗓 ${esc(longDate(nxt._d))}${nxt.heure === false ? '' : ' à ' + String(nxt._d.getHours()).padStart(2, '0') + 'h' + String(nxt._d.getMinutes()).padStart(2, '0')}</span><span>📍 ${esc(nxt.lieu)}${nxt.ville ? ', ' + esc(nxt.ville) : ''}</span>`;
      $('[data-next-text]', nextBox).textContent = nxt.avec || nxt.details || '';
      const cd = $('[data-countdown]', nextBox); cd.hidden = false; $('[data-pending]', nextBox).hidden = true;
      const tick = () => {
        let s = Math.max(0, Math.floor((nxt._d - new Date()) / 1000));
        const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
        $$('b', cd).forEach((b, i) => b.textContent = String(v[i]).padStart(2, '0'));
      };
      tick(); setInterval(tick, 1000);
    } else {
      $('[data-next-title]', nextBox).textContent = p.titre;
      $('[data-next-meta]', nextBox).innerHTML = `<span>📍 ${esc(p.lieu)}</span>`;
      $('[data-next-text]', nextBox).textContent = p.details;
    }
  }).catch(() => {});

  /* Liste des concerts (agenda) */
  const evHTML = (c, past) => {
    const d = c._d, hh = c.heure === false ? '' : `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
    return `<article class="ev ${past ? 'past' : ''} rv">
      <div class="ev-date"><span>${MOIS_C[d.getMonth()]}</span><b>${d.getDate()}</b><span>${d.getFullYear()}</span>${hh ? `<small>${hh}</small>` : ''}</div>
      <div><h3>${esc(c.titre)}</h3>
      <p class="where">${esc(c.lieu)}${c.ville && c.ville !== c.lieu ? ' — ' + esc(c.ville) : ''}</p>
      ${c.avec ? `<p><strong>${esc(c.avec)}</strong></p>` : ''}
      ${c.details ? `<p>${esc(c.details)}</p>` : ''}
      ${c.affiche ? `<img src="${esc(c.affiche)}" alt="Affiche : ${esc(c.titre)}" loading="lazy" width="220">` : ''}
      </div></article>`;
  };
  const agenda = $('[data-agenda]');
  if (agenda) loadConcerts().then(d => {
    const { up, past } = upcomingAndPast(d);
    const p = d.prochain;
    const upEl = $('[data-up]', agenda), pastEl = $('[data-past]', agenda);
    const planned = p.date ? { ...p, _d: parse(p.date) } : null;
    const ups = (planned && planned._d >= new Date() ? [planned, ...up.filter(u => u.date !== p.date)] : up);
    upEl.innerHTML = ups.length ? ups.map(c => evHTML(c, false)).join('') : `<div class="empty"><strong>${esc(p.titre)}</strong><br>${esc(p.details)}<br><a href="rejoindre.html#contact">Être prévenu du prochain concert</a></div>`;
    pastEl.innerHTML = past.map(c => evHTML(c, true)).join('');
    const info = $('[data-infos]'); if (info) info.innerHTML = d.infosPratiques.map(i => `<div class="card rv"><h3>${esc(i.titre)}</h3><p>${esc(i.texte)}</p></div>`).join('');
    $$('[data-tab]').forEach(b => b.addEventListener('click', () => {
      $$('[data-tab]').forEach(x => x.setAttribute('aria-pressed', x === b));
      upEl.hidden = b.dataset.tab !== 'up'; pastEl.hidden = b.dataset.tab !== 'past';
    }));
    reveal(agenda);
  }).catch(() => { agenda.innerHTML = '<div class="empty">Impossible de charger l’agenda pour le moment.</div>'; });

  /* Compteur : nombre de concerts archivés */
  const cc = $('[data-count-concerts]');
  if (cc) loadConcerts().then(d => { cc.dataset.to = d.concerts.length; counters(cc.parentNode); });

  /* Actualités */
  $$('[data-news]').forEach(box => getJSON('data/actualites.json').then(d => {
    const n = +box.dataset.news || 99;
    box.innerHTML = d.actualites.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, n).map(a => {
      const dt = parse(a.date);
      return `<article class="post rv">${a.image ? `<img src="${esc(a.image)}" alt="" loading="lazy" width="640" height="400">` : ''}<div><time datetime="${esc(a.date)}">${dt.getDate()} ${MOIS[dt.getMonth()]} ${dt.getFullYear()}</time><h3>${esc(a.titre)}</h3><p>${esc(a.texte)}</p>${a.lien ? `<a href="${esc(a.lien.url)}" target="_blank" rel="noopener">${esc(a.lien.texte)} ↗</a>` : ''}</div></article>`;
    }).join(''); reveal(box);
  }).catch(() => {}));

  /* Lecteur audio / vidéo */
  const player = $('[data-player]');
  if (player) getJSON('data/repertoire.json').then(d => {
    const list = $('[data-tracks]', player), screen = $('[data-screen]', player), title = $('[data-ptitle]', player), note = $('[data-pnote]', player);
    const TY = { sacre: 'Sacré', chanson: 'Chanson', monde: 'Monde', autre: 'Autre' };
    const tracks = d.morceaux.filter(m => m.youtube || m.drive);
    list.innerHTML = tracks.map((m, i) => `<li><button type="button" data-i="${i}"><span class="n">${i + 1}</span><span>${esc(m.titre)}<small>${esc(m.note || '')}</small></span><span class="ty">${TY[m.type] || ''}</span></button></li>`).join('');
    const load = (i, auto) => {
      const m = tracks[i]; title.textContent = m.titre; note.textContent = m.note || '';
      $$('button', list).forEach((b, k) => b.setAttribute('aria-current', k === i));
      const src = m.youtube ? `https://www.youtube-nocookie.com/embed/${m.youtube}?rel=0&autoplay=1` : `https://drive.google.com/file/d/${m.drive}/preview`;
      if (m.youtube && !auto) { screen.className = 'screen'; screen.style.backgroundImage = `url(https://i.ytimg.com/vi/${m.youtube}/hqdefault.jpg)`; screen.innerHTML = `<button class="play" aria-label="Lancer : ${esc(m.titre)}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>`; $('.play', screen).onclick = () => load(i, true); return; }
      screen.className = m.youtube ? 'screen' : 'screen'; screen.style.backgroundImage = '';
      screen.innerHTML = `<iframe src="${src}" title="${esc(m.titre)}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    };
    list.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { load(+b.dataset.i, true); screen.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
    if (tracks.length) load(0, false);
    // grille des morceaux travaillés
    const grid = $('[data-pieces]');
    if (grid) {
      const draw = f => { grid.innerHTML = d.morceaux.filter(m => f === 'all' || m.type === f).map(m => `<li class="card rv in" style="padding:18px 22px"><span class="tag ${m.type === 'sacre' ? 'sand' : m.type === 'monde' ? '' : 'heart'}">${TY[m.type] || ''}</span><h3 style="margin:.5em 0 .1em;font-size:1.15rem">${esc(m.titre)}</h3><p style="margin:0;font-size:.9rem;color:var(--ink-2)">${esc(m.note || '')}</p></li>`).join(''); };
      draw('all');
      $$('[data-filter]').forEach(b => b.addEventListener('click', () => { $$('[data-filter]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.filter); }));
    }
    const u = $('[data-univers]'); if (u) { u.innerHTML = d.univers.map((x, i) => `<div class="card rv d${i}"><h3>${esc(x.titre)}</h3><p style="margin:0;color:var(--ink-2)">${esc(x.texte)}</p></div>`).join(''); reveal(u); }
    const q = $('[data-quote]'); if (q) q.innerHTML = `<p class="quote">« ${esc(d.citation.texte)} »</p><cite>${esc(d.citation.auteur)}</cite>`;
  }).catch(() => {});

  /* Vidéo d'accueil (chargée au clic) */
  $$('[data-yt]').forEach(box => {
    const id = box.dataset.yt;
    box.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
    box.innerHTML = `<button class="play" aria-label="Lancer la vidéo"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>`;
    $('.play', box).onclick = () => { box.style.backgroundImage = ''; box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1" title="Vidéo de la chorale" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`; };
  });

  /* Galerie + lightbox */
  const gal = $('[data-gallery]');
  if (gal) getJSON('data/galerie.json').then(d => {
    const all = [];
    gal.innerHTML = d.albums.map(a => `<section class="album rv" id="${esc(a.id)}" style="padding:0"><h2>${esc(a.titre)}</h2><div class="masonry">${a.photos.map(p => { all.push(p); return `<button type="button" data-k="${all.length - 1}"><img src="${esc(p.src)}" alt="${esc(p.legende)}" loading="lazy"><span>${esc(p.legende)}</span></button>`; }).join('')}</div></section>`).join('');
    const nav2 = $('[data-albums]'); if (nav2) nav2.innerHTML = d.albums.map(a => `<a class="chip" href="#${esc(a.id)}" style="text-decoration:none">${esc(a.titre)}</a>`).join('');
    const lb = $('.lb'), img = $('img', lb), cap = $('p', lb); let k = 0;
    const show = i => { k = (i + all.length) % all.length; img.src = all[k].src; img.alt = all[k].legende; cap.textContent = all[k].legende; lb.classList.add('open'); };
    gal.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) show(+b.dataset.k); });
    $('.x', lb).onclick = () => lb.classList.remove('open'); $('.pv', lb).onclick = () => show(k - 1); $('.nx', lb).onclick = () => show(k + 1);
    lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
    addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lb.classList.remove('open'); if (e.key === 'ArrowLeft') show(k - 1); if (e.key === 'ArrowRight') show(k + 1); });
    reveal(gal);
  }).catch(() => {});

  /* Formulaire Netlify (envoi sans rechargement) */
  const form = $('form.contact');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Envoi…';
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then(r => { if (!r.ok) throw 0; form.hidden = true; $('.form-ok').style.display = 'block'; $('.form-ok').focus(); })
      .catch(() => { btn.disabled = false; btn.textContent = 'Envoyer le message'; alert('Le message n’a pas pu être envoyé. Appelez-nous au numéro indiqué sur cette page.'); });
  });
  // pré-sélection de l'objet via ?objet=essai
  const obj = new URLSearchParams(location.search).get('objet'); if (obj && $('#objet')) $('#objet').value = obj;

  reveal(document); counters(document);
})();
