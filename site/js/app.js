/* Photo Ciné Club Sénonais — comportements communs et rendu des données (data/*.json) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const J = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.page;
  const TZ = 'Europe/Paris';
  const fmt = (d, o) => new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, ...o }).format(d);
  const ymd = d => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(d);
  const parse = s => new Date(s + 'T12:00:00Z');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cache = {};
  const data = n => cache[n] || (cache[n] = J(`data/${n}.json`));

  /* ---------- En-tête, menu, apparitions ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('solid', scrollY > 30 || page !== 'home');
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); nav.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); document.body.style.overflow = ''; } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) burger.click(); });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  const reveal = (root = document) => $$('.rv', root).forEach(el => io ? io.observe(el) : el.classList.add('in'));
  reveal();

  /* ---------- Visionneuse plein écran ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Visionneuse photo');
  lb.innerHTML = '<span class="n"></span><button class="ic x" aria-label="Fermer">✕</button><button class="ic pv" aria-label="Photo précédente">‹</button><button class="ic nx" aria-label="Photo suivante">›</button><div class="lb-stage"><img alt=""></div><div class="lb-bar"><b></b><span></span></div>';
  document.body.appendChild(lb);
  let items = [], cur = 0, lastFocus = null;
  const lbImg = $('img', lb);
  const show = i => {
    cur = (i + items.length) % items.length; const it = items[cur];
    lbImg.style.opacity = 0;
    const im = new Image(); im.onload = () => { lbImg.src = it.src; lbImg.alt = it.alt || it.title; lbImg.style.opacity = 1; };
    im.src = it.src;
    $('b', lb).textContent = it.title || '';
    $('.lb-bar span', lb).textContent = [it.author ? `© ${it.author}` : '', it.album || '', 'Photo Ciné Club Sénonais'].filter(Boolean).join(' · ');
    $('.n', lb).textContent = items.length > 1 ? `${String(cur + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}` : '';
    $('.pv', lb).hidden = $('.nx', lb).hidden = items.length < 2;
    const nx = items[(cur + 1) % items.length]; if (nx) new Image().src = nx.src;
  };
  const openLb = (list, i) => { items = list; lastFocus = document.activeElement; lb.classList.add('open'); document.body.style.overflow = 'hidden'; show(i); $('.x', lb).focus(); };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus && lastFocus.focus(); };
  $('.x', lb).onclick = closeLb; $('.pv', lb).onclick = () => show(cur - 1); $('.nx', lb).onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  let tx = null; lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); tx = null; });
  const asItem = p => ({ src: p.file, title: p.title, author: p.author, album: p.album, alt: p.alt });

  /* ---------- Dates ---------- */
  const lastWednesday = (y, m) => { const d = new Date(Date.UTC(y, m + 1, 0, 12)); while (d.getUTCDay() !== 3) d.setUTCDate(d.getUTCDate() - 1); return d; };
  const nextReunion = () => {
    const now = new Date(), t = ymd(now); let y = +fmt(now, { year: 'numeric' }), m = +fmt(now, { month: 'numeric' }) - 1;
    let d = lastWednesday(y, m); if (ymd(d) < t) { m++; if (m > 11) { m = 0; y++; } d = lastWednesday(y, m); }
    return d;
  };
  const range = (a, b) => {
    const d1 = parse(a), d2 = parse(b);
    if (a === b) return fmt(d1, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const sameY = fmt(d1, { year: 'numeric' }) === fmt(d2, { year: 'numeric' });
    return `du ${fmt(d1, sameY ? { day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long', year: 'numeric' })} au ${fmt(d2, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  /* ---------- Accueil ---------- */
  const initHome = async () => {
    const slides = $$('.slide'), dots = $$('.dots button'), credit = $('.hero-credit'), hero = $('.hero'), fc = $('#frameno');
    let k = 0, timer;
    const setSlide = n => {
      k = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('on', i === k); const im = $('img', s); if (i === k || i === (k + 1) % slides.length) if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } });
      dots.forEach((d, i) => { d.classList.remove('on'); void d.offsetWidth; d.classList.toggle('on', i === k); d.setAttribute('aria-current', i === k); });
      credit.textContent = slides[k].dataset.credit; if (fc) fc.textContent = `${String(k + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    const play = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => setSlide(k + 1), 6500); hero.classList.remove('paused'); };
    const stop = () => { clearInterval(timer); hero.classList.add('paused'); };
    dots.forEach((d, i) => d.addEventListener('click', () => { setSlide(i); play(); }));
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
    setSlide(0); play();

    const [club, ev, gal] = await Promise.all([data('club'), data('events'), data('gallery')]);
    // chiffres animés
    const box = $('#counters');
    box.innerHTML = club.chiffres.map(c => `<div class="counter rv"><b data-to="${c.valeur}" data-pre="${esc(c.prefixe)}" data-suf="${esc(c.suffixe)}">${esc(c.prefixe)}0<i>${esc(c.suffixe)}</i></b><span>${esc(c.libelle)}</span></div>`).join('');
    const nf = new Intl.NumberFormat('fr-FR');
    const count = el => {
      const to = +el.dataset.to, pre = el.dataset.pre, suf = el.dataset.suf, t0 = performance.now(), dur = reduce ? 1 : 1800;
      const step = t => { const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.innerHTML = `${esc(pre)}${nf.format(v)}<i>${esc(suf)}</i>`; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    $$('b[data-to]', box).forEach(b => co.observe(b)); reveal(box);
    // prochains rendez-vous
    const r = nextReunion(), today = ymd(new Date());
    const next = ev.evenements.filter(e => e.fin >= today).sort((a, b) => a.debut.localeCompare(b.debut))[0];
    const chip = (d) => `<div class="date-chip"><b>${fmt(d, { day: 'numeric' })}</b><span>${fmt(d, { month: 'short' }).replace('.', '')}</span></div>`;
    $('#rdv').innerHTML = `
      <article>${chip(r)}<div><span class="tag">Réunion mensuelle</span><h3>${fmt(r, { weekday: 'long', day: 'numeric', month: 'long' })} à 20 h</h3><p>${esc(club.reunion.texte)}</p></div></article>
      ${next ? `<article>${chip(parse(next.debut))}<div><span class="tag">${esc(next.type)}</span><h3>${esc(next.titre)}</h3><p>${esc(range(next.debut, next.fin))} · ${esc(next.lieu)}</p><p><a href="expositions-evenements.html">Tous les rendez-vous →</a></p></div></article>` : ''}`;
    // derniers travaux
    const last = gal.photos.filter(p => /septembre 2026/.test(p.album)).concat(gal.photos.filter(p => /Photos du mois/.test(p.album) && !/septembre 2026/.test(p.album))).slice(0, 14);
    const strip = $('#works');
    strip.innerHTML = last.map((p, i) => `<figure><button data-i="${i}" aria-label="Agrandir : ${esc(p.title)}"><img src="${p.thumb}" width="${Math.round(p.w * 420 / p.h)}" height="420" alt="${esc(p.alt)}" loading="lazy"></button><figcaption>${esc(p.title)} — © ${esc(p.author)}</figcaption></figure>`).join('');
    strip.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) openLb(last.map(asItem), +b.dataset.i); });
  };

  /* ---------- Le club ---------- */
  const initClub = async () => {
    const [club, au, gal] = await Promise.all([data('club'), data('authors'), data('gallery')]);
    $('#bureau').innerHTML = club.bureau.map(b => `<div class="card rv"><h3>${esc(b.nom)}</h3><p class="muted" style="margin:0"><span class="tag" style="margin:0">${esc(b.role)}</span>${b.note ? `<br>${esc(b.note)}` : ''}</p></div>`).join('');
    $('#bureau-note').textContent = club.bureau_note;
    const ini = n => n.split(/[\s-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    $('#auteurs').innerHTML = au.auteurs.map(a => {
      const mine = gal.photos.filter(p => p.author === a.nom).slice(0, 3);
      return `<article class="author rv"><div class="top">${a.portrait ? `<img class="mono" style="object-fit:cover" src="${esc(a.portrait)}" alt="Portrait de ${esc(a.nom)}">` : `<div class="mono" aria-hidden="true">${esc(ini(a.nom))}</div>`}<div><h3>${esc(a.nom)}</h3>${a.role ? `<span class="role">${esc(a.role)}</span>` : ''}</div></div>
      ${a.presentation ? `<p>${esc(a.presentation)}</p>` : `<p class="muted" style="margin:0;font-size:.9rem">Présentation à compléter par l'auteur.</p>`}
      ${a.travaux?.length ? `<ul>${a.travaux.slice(0, 4).map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${mine.length ? `<div class="thumbs">${mine.map(p => `<img src="${p.thumb}" alt="${esc(p.alt)}" loading="lazy" width="120" height="120">`).join('')}</div>` : ''}
      <a class="more" href="galerie.html?auteur=${encodeURIComponent(a.nom)}">${mine.length ? 'Voir ses photos ici →' : 'Galerie du club →'}</a>
      ${a.galerie ? `<a class="more" href="${esc(a.galerie)}" target="_blank" rel="noopener">Sa galerie complète${a.photos_en_ligne ? ` (${a.photos_en_ligne} photos)` : ''} ↗</a>` : ''}</article>`;
    }).join(''); reveal($('#auteurs'));
  };

  /* ---------- Activités / contact : données du club ---------- */
  const initInfo = async () => {
    const club = await data('club');
    $$('[data-club]').forEach(el => { const v = el.dataset.club.split('.').reduce((o, k) => o?.[k], club); if (v) el.textContent = v; });
  };

  /* ---------- Galerie ---------- */
  const initGallery = async () => {
    const gal = await data('gallery'), P = gal.photos, T = gal.themes;
    const url = new URLSearchParams(location.search);
    let theme = url.get('theme') || 'all', author = url.get('auteur') || 'all';
    const fil = $('#filters'), sel = $('#author'), grid = $('#mos'), cnt = $('#count');
    const chips = [['all', 'Tout'], ['pdm', 'Photos du mois 2026'], ...Object.entries(T)];
    fil.innerHTML = chips.map(([k, v]) => `<button class="chip" data-k="${k}" aria-pressed="${k === theme}">${esc(v)}</button>`).join('');
    const authors = [...new Set(P.map(p => p.author))].sort((a, b) => a.localeCompare(b, 'fr'));
    sel.innerHTML = `<option value="all">Tous les auteurs</option>` + authors.map(a => `<option ${a === author ? 'selected' : ''}>${esc(a)}</option>`).join('');
    let list = [];
    const render = () => {
      list = P.filter(p => (theme === 'all' || (theme === 'pdm' ? /^Photos du mois/.test(p.album) : p.theme === theme)) && (author === 'all' || p.author === author));
      grid.innerHTML = list.length ? list.map((p, i) => `<figure><button data-i="${i}" aria-label="Agrandir : ${esc(p.title)}"><img src="${p.thumb}" width="${p.w > 720 ? 720 : p.w}" height="${Math.round((p.w > 720 ? 720 : p.w) * p.h / p.w)}" alt="${esc(p.alt)}" loading="lazy"></button><figcaption><b>${esc(p.title)}</b><br>© ${esc(p.author)}</figcaption></figure>`).join('') : '<p class="muted">Aucune photo pour cette sélection.</p>';
      cnt.textContent = `${list.length} photo${list.length > 1 ? 's' : ''}`;
      $$('.chip', fil).forEach(c => c.setAttribute('aria-pressed', c.dataset.k === theme));
    };
    fil.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { theme = c.dataset.k; render(); } });
    sel.addEventListener('change', () => { author = sel.value; render(); });
    grid.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) openLb(list.map(asItem), +b.dataset.i); });
    render();
  };

  /* ---------- Films & vidéos ---------- */
  const initFilms = async () => {
    const [gal, films] = await Promise.all([data('gallery'), data('films')]);
    // salle de projection : diaporama des photos du club
    const seq = gal.photos.filter(p => p.w > p.h && ['paysages', 'nature', 'nb', 'ville', 'macro'].includes(p.theme) && p.w >= 1400).slice(0, 26);
    const scr = $('#screen'), box = $('.frames', scr), cap = $('.cap', scr), bar = $('.bar i', scr), big = $('.big', scr), pp = $('#pp');
    box.innerHTML = seq.map(p => `<div class="frm"><img alt="${esc(p.alt)}" data-src="${p.file}"></div>`).join('');
    const fr = $$('.frm', box); let k = 0, playing = false, t0 = 0, raf; const DUR = 5200;
    const load = i => { const im = $('img', fr[i % fr.length]); if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } };
    const go = n => { k = (n + seq.length) % seq.length; fr.forEach((f, i) => f.classList.toggle('on', i === k)); load(k); load(k + 1); const p = seq[k]; cap.innerHTML = `<b>${esc(p.title)}</b>© ${esc(p.author)} · ${esc(p.album)}`; t0 = performance.now(); };
    const tick = t => { if (!playing) return; const p = (t - t0) / DUR; bar.style.width = Math.min(100, p * 100) + '%'; if (p >= 1) go(k + 1); raf = requestAnimationFrame(tick); };
    const set = on => { playing = on; pp.textContent = on ? '❚❚' : '▶'; pp.setAttribute('aria-label', on ? 'Pause' : 'Lecture'); cancelAnimationFrame(raf); if (on) { t0 = performance.now(); raf = requestAnimationFrame(tick); } };
    go(0);
    big.addEventListener('click', () => { big.classList.add('hide'); set(true); });
    pp.addEventListener('click', () => set(!playing));
    $('#prev', scr).addEventListener('click', () => go(k - 1)); $('#next', scr).addEventListener('click', () => go(k + 1));
    $('#fs', scr).addEventListener('click', () => { (document.fullscreenElement ? document.exitFullscreen() : scr.requestFullscreen?.()); });
    // films (YouTube / Vimeo)
    const list = $('#films');
    if (!films.films.length) { list.innerHTML = '<div class="todo">Les premiers films et extraits du club seront présentés ici. Le club peut les ajouter lui-même dans <code>data/films.json</code> (liens YouTube ou Vimeo).</div>'; return; }
    list.innerHTML = films.films.map((f, i) => `<article class="rv"><div class="vid" data-i="${i}" role="button" tabindex="0" aria-label="Lire : ${esc(f.titre)}"><span class="play">▶</span></div><h3 style="margin-top:1rem">${esc(f.titre)}</h3><p class="muted">${esc(f.categorie || '')} · ${esc(f.auteur)} · ${esc(f.annee)} ${f.duree ? '· ' + esc(f.duree) : ''}</p><p>${esc(f.resume || '')}</p></article>`).join(''); reveal(list);
    const start = el => { const f = films.films[+el.dataset.i]; const src = f.plateforme === 'vimeo' ? `https://player.vimeo.com/video/${encodeURIComponent(f.id)}?autoplay=1` : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.id)}?autoplay=1&rel=0`; el.innerHTML = `<iframe src="${src}" title="${esc(f.titre)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`; el.removeAttribute('role'); };
    list.addEventListener('click', e => { const v = e.target.closest('.vid'); if (v && !v.querySelector('iframe')) start(v); });
    list.addEventListener('keydown', e => { const v = e.target.closest('.vid'); if (v && (e.key === 'Enter' || e.key === ' ') && !v.querySelector('iframe')) { e.preventDefault(); start(v); } });
  };

  /* ---------- Expositions & événements ---------- */
  const initEvents = async () => {
    const ev = await data('events'), today = ymd(new Date());
    const card = (e, past) => {
      const posterBtn = e.affiche ? `<a class="poster" href="${esc(e.affiche)}" data-title="${esc(e.titre)}" data-credit="${esc(e.affiche_credit || '')}" aria-label="Agrandir l'affiche : ${esc(e.titre)}"><img src="${esc(e.affiche)}" alt="Affiche : ${esc(e.titre)}" loading="lazy" width="150"></a>` : '';
      return `<article class="event rv ${e.affiche ? '' : 'noposter'} ${past ? 'past' : ''}">${posterBtn}<div><div class="when">${esc(e.type)} · ${esc(range(e.debut, e.fin))}</div><h3>${esc(e.titre)}</h3><p style="margin:0">${esc(e.texte || '')}</p><div class="meta"><span>📍 ${esc(e.lieu)}</span>${e.horaires ? `<span>🕘 ${esc(e.horaires)}</span>` : ''}${e.vernissage ? `<span>🥂 Vernissage : ${esc(e.vernissage)}</span>` : ''}${e.acces ? `<span>${esc(e.acces)}</span>` : ''}</div>${e.lien ? `<a class="btn sm" href="${esc(e.lien)}" target="_blank" rel="noopener">${esc(e.lien_texte || 'En savoir plus')} ↗</a>` : ''}</div></article>`;
    };
    const up = ev.evenements.filter(e => e.fin >= today).sort((a, b) => a.debut.localeCompare(b.debut));
    const past = ev.evenements.filter(e => e.fin < today).sort((a, b) => b.debut.localeCompare(a.debut));
    $('#upcoming').innerHTML = up.length ? up.map(e => card(e)).join('') : '<div class="todo">Les prochains rendez-vous seront annoncés ici. Rendez-vous aux réunions mensuelles pour en savoir plus.</div>';
    $('#archives').innerHTML = past.map(e => card(e, true)).join('');
    $('#autres').innerHTML = ev.autres_manifestations.map(a => `<li>${esc(a)}</li>`).join('');
    $('#concours').innerHTML = ev.concours.map(c => `<div class="card rv"><span class="num">${c.annee}</span><h3>${esc(c.gagnant)}</h3><p class="muted" style="margin:0">Premier du concours — ${esc(c.points)}. ${esc(c.texte)}</p></div>`).join('');
    document.addEventListener('click', e => { const a = e.target.closest('a.poster'); if (a) { e.preventDefault(); openLb([{ src: a.getAttribute('href'), title: a.dataset.title, author: '', album: a.dataset.credit }], 0); } });
    reveal();
  };

  /* ---------- Actualités ---------- */
  const initNews = async () => {
    const n = await data('news');
    const list = n.actualites.slice().sort((a, b) => b.date.localeCompare(a.date));
    $('#news').innerHTML = list.map(p => { const d = parse(p.date); return `<article class="post ${p.image ? 'hasimg' : ''} rv"><time datetime="${p.date}"><b>${fmt(d, { day: 'numeric' })}</b>${fmt(d, { month: 'long', year: 'numeric' })}</time><div><span class="tag">${esc(p.categorie)}</span><h3>${esc(p.titre)}</h3><p>${esc(p.texte)}</p>${p.lien ? `<a href="${esc(p.lien)}" target="_blank" rel="noopener">Lire sur le site du club ↗</a>` : ''}</div>${p.image ? `<a class="poster" href="${esc(p.image)}" data-title="${esc(p.titre)}" data-credit="${esc(p.image_credit || '')}"><img src="${esc(p.image)}" alt="${esc(p.titre)}" loading="lazy"></a>` : ''}</article>`; }).join('');
    document.addEventListener('click', e => { const a = e.target.closest('a.poster'); if (a) { e.preventDefault(); openLb([{ src: a.getAttribute('href'), title: a.dataset.title, author: '', album: a.dataset.credit }], 0); } });
    reveal($('#news'));
  };

  /* ---------- Contact ---------- */
  const initContact = async () => {
    await initInfo();
    const club = await data('club');
    $('#tarif').textContent = club.adhesion.tarif; $('#essai').textContent = club.adhesion.essai;
    const s = new URLSearchParams(location.search).get('sujet'); if (s && $('#sujet')) $('#sujet').value = s;
  };

  const boot = { home: initHome, club: initClub, activites: initInfo, galerie: initGallery, films: initFilms, expos: initEvents, actus: initNews, contact: initContact }[page];
  if (boot) boot().catch(err => { console.error(err); const m = $('#data-error'); if (m) m.hidden = false; });
})();
