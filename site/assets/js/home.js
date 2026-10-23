/* Accueil : diaporama, programme du mercredi, derniers reportages, prochaine sortie, chiffres */
(function () {
  'use strict';
  const { $, $$, esc, loadJSON, date, dateLong, todayISO, photoSrc, plural, observe, itemTile } = window.CPM;

  /* hauteur du bandeau d'annonce -> le héros remplit exactement le reste de l'écran */
  const bandeau = $('.annonce');
  const setBandeau = () => document.documentElement.style.setProperty('--ah', (bandeau ? bandeau.offsetHeight : 64) + 'px');
  setBandeau();
  window.addEventListener('resize', setBandeau);

  /* ---------- héro : diaporama ---------- */
  function initHero(slidesData) {
    const hero = $('#hero');
    const dots = $('.hero__dots', hero);
    const caption = $('#hero-caption');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slides = slidesData.map((d, i) => ({ d, el: i === 0 ? $('.hero__slide', hero) : null }));
    let cur = 0, timer = null, paused = false;

    slides.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Photo ' + (i + 1) + ' sur ' + slides.length);
      b.addEventListener('click', () => { show(i); schedule(); });
      dots.appendChild(b);
    });

    function ensure(i) {
      const s = slides[i];
      if (!s.el) {
        s.el = document.createElement('div');
        s.el.className = 'hero__slide';
        s.el.innerHTML = '<img src="' + esc(s.d.src) + '" alt="' + esc(s.d.legende) + '" width="' + s.d.w + '" height="' + s.d.h + '" decoding="async">';
        hero.insertBefore(s.el, $('.hero__content', hero));
      }
      return s.el;
    }
    function show(i) {
      i = (i + slides.length) % slides.length;
      const el = ensure(i);
      const img = $('img', el);
      const go = () => {
        slides.forEach((s, k) => { if (s.el) s.el.classList.toggle('active', k === i); });
        $$('button', dots).forEach((b, k) => { b.classList.toggle('active', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
        cur = i;
        const d = slides[i].d;
        caption.innerHTML = '<a href="' + esc(d.lien) + '">' + esc(d.legende) + '</a>' + (d.credit ? ' · ' + esc(d.credit) : '');
        ensure((i + 1) % slides.length);
      };
      if (img.complete && img.naturalWidth) go(); else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', go, { once: true }); }
    }
    function schedule() {
      clearTimeout(timer);
      if (paused || reducedMotion || document.hidden) return;
      timer = setTimeout(() => { show(cur + 1); schedule(); }, 6500);
    }
    const setPaused = (p) => { paused = p; hero.classList.toggle('paused', p); if (p) clearTimeout(timer); else schedule(); };
    hero.addEventListener('mouseenter', () => setPaused(true));
    hero.addEventListener('mouseleave', () => setPaused(false));
    hero.addEventListener('focusin', () => setPaused(true));
    hero.addEventListener('focusout', () => setPaused(false));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : schedule()));
    let x0 = null;
    hero.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    hero.addEventListener('pointerup', (e) => {
      if (x0 == null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 60) { show(cur + (dx < 0 ? 1 : -1)); schedule(); }
    });
    show(0);
    window.addEventListener('load', () => setTimeout(schedule, 1200));
  }

  /* ---------- programme du mercredi soir ---------- */
  function renderProgramme(prog) {
    const m = prog.mercredi, a = m.attente, today = todayISO();
    const soirees = (m.soirees || []).filter((s) => s.date);
    const next = soirees.filter((s) => s.date >= today).sort((x, y) => x.date.localeCompare(y.date))[0];
    const past = soirees.filter((s) => s.date < today).sort((x, y) => y.date.localeCompare(x.date))[0];
    const f = next
      ? { date: dateLong(next.date), theme: next.theme || a.theme, intervenant: next.intervenant || a.intervenant, lieu: next.lieu || m.lieu, horaire: next.horaire || m.horaire, texte: next.texte || '' }
      : { date: a.date, theme: a.theme, intervenant: a.intervenant, lieu: m.lieu, horaire: m.horaire, texte: a.texte };
    const sub = $('#annonce-sub');
    if (sub && next) sub.textContent = 'Prochaine soirée : ' + dateLong(next.date) + ' — ' + (next.theme || '');
    const line = (k, v) => '<li><span class="k">' + k + '</span><span class="v">' + esc(v) + '</span></li>';
    $('#prog-root').innerHTML =
      '<article class="prog-card' + (next ? '' : ' is-placeholder') + '">' +
      '<div class="prog-card__main"><p class="eyebrow">' + (next ? 'Prochaine soirée' : 'Prochaine soirée · à confirmer') + '</p>' +
      '<p class="prog-date">' + esc(f.date) + '</p>' +
      '<ul class="prog-list">' + line('Thème', f.theme) + line('Intervenant', f.intervenant) + line('Lieu', f.lieu) + line('Horaire', f.horaire) + '</ul>' +
      (f.texte ? '<p class="muted" style="margin:1.3em 0 0">' + esc(f.texte) + '</p>' : '') + '</div>' +
      '<div class="prog-card__side"><p class="prog-side__lbl">Chaque mercredi soir</p><p class="prog-side__big">' + esc(m.horaire) + '</p>' +
      '<p style="margin:.6em 0 1.4em">' + esc(m.lieu) + '</p><p style="margin:0"><a class="btn" style="--b:#fff" href="contact.html">Nous écrire</a></p></div></article>' +
      ((m.types_de_soirees || []).length
        ? '<p class="prog-past" style="margin-bottom:10px">Au fil de l’année, au programme :</p><ul class="tags">' + m.types_de_soirees.map((t) => '<li class="tag">' + esc(t) + '</li>').join('') + '</ul>' : '') +
      (past ? '<p class="prog-past">Dernière soirée annoncée : ' + esc(date(past.date)) + ' — ' + esc(past.theme) + '.</p>' : '');
  }

  /* ---------- prochaine sortie ---------- */
  function renderSortie(prog, sorties, ctx) {
    const ps = prog.prochaine_sortie;
    const last = sorties.items[0];
    const media = $('#sortie-media');
    if (last) {
      const cover = last.photos[last.couverture || 0];
      media.href = 'galerie.html#/sortie/' + encodeURIComponent(last.id);
      media.setAttribute('aria-label', 'Voir la dernière sortie : ' + last.titre);
      media.innerHTML = '<img src="' + esc(photoSrc(last, cover, false)) + '" alt="" width="' + cover.w + '" height="' + cover.h + '" loading="lazy">' +
        '<span class="tile__cap"><span class="tile__meta" style="display:block;text-transform:uppercase;letter-spacing:.18em">Dernière sortie</span>' +
        '<span class="tile__title" style="display:block">' + esc(last.titre) + '</span>' +
        '<span class="tile__meta" style="display:block">' + esc(date(last.date)) + '</span></span>';
    }
    const known = ps.date || ps.lieu || ps.theme;
    const line = (k, v) => v ? '<li><span class="k">' + k + '</span><span class="v">' + esc(v) + '</span></li>' : '';
    $('#sortie-root').innerHTML =
      '<p class="eyebrow">Sorties photo</p><h2>' + esc(ps.titre) + '</h2>' +
      (known
        ? '<ul class="prog-list" style="margin-bottom:1.6em">' + line('Date', ps.date ? (/^\d{4}-\d{2}-\d{2}$/.test(ps.date) ? dateLong(ps.date) : ps.date) : '') + line('Lieu', ps.lieu) + line('Thème', ps.theme) + '</ul>' + (ps.texte ? '<p class="muted">' + esc(ps.texte) + '</p>' : '')
        : '<p class="lead">' + esc(ps.attente) + '</p>') +
      '<p style="display:flex;flex-wrap:wrap;gap:12px"><a class="btn" href="galerie.html#/sorties">Voir les sorties</a><a class="btn btn--ghost" href="contact.html">Être prévenu</a></p>';
  }

  /* ---------- chiffres clés ---------- */
  function renderStats(club, reps, sors) {
    const c = club.chiffres, ids = new Set();
    reps.items.concat(sors.items).forEach((it) => (it.auteurs || []).forEach((a) => ids.add(a)));
    const stats = [
      { to: new Date().getFullYear() - c.annee_creation, lbl: 'ans d’existence' },
      { to: c.hivernales, lbl: c.hivernales_libelle || 'éditions des Hivernales' },
      { to: reps.items.length, lbl: 'reportages à parcourir' },
      { to: sors.items.length, lbl: 'sorties photo' },
      { to: ids.size, lbl: 'auteurs dans nos galeries' }
    ];
    if (c.adherents) stats.splice(1, 0, { to: c.adherents, lbl: 'adhérents' });
    $('#stats').innerHTML = stats.map((s) => '<div class="stat"><span class="stat__num" data-to="' + s.to + '">0</span><span class="stat__lbl">' + esc(s.lbl) + '</span></div>').join('');
  }

  Promise.all([loadJSON('club'), loadJSON('programme'), loadJSON('reportages'), loadJSON('sorties'), loadJSON('auteurs')]).then(([club, prog, reps, sors, auteurs]) => {
    const authors = {}; auteurs.forEach((a) => { authors[a.id] = a; });
    const ctx = { authors, cats: {} };
    reps.categories.forEach((c) => { ctx.cats[c.id] = c.nom; });
    sors.categories.forEach((c) => { ctx.cats[c.id] = c.nom; });
    initHero(club.hero);
    renderProgramme(prog);
    $('#home-reportages').innerHTML = reps.items.slice(0, 5).map((it, i) => itemTile(it, 'reportage', ctx, i === 0)).join('');
    renderSortie(prog, sors, ctx);
    renderStats(club, reps, sors);
    observe();
    if (location.hash === '#programme') { const t = $('#programme'); if (t) t.scrollIntoView(); }
  }).catch((err) => {
    console.error(err);
    const r = $('#prog-root'); if (r) r.innerHTML = '<p class="empty">Le programme n’a pas pu être chargé. Réessayez dans un instant.</p>';
  });
})();
