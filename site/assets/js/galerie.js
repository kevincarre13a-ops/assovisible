/* Galerie : onglets Reportages / Sorties, filtres, filtre par auteur, vue auteur, détail + visionneuse.
   Routes (dans l'adresse, après le #) :
     #/reportages?cat=patrimoine   #/sorties?cat=nuit
     #/reportage/<id>   #/sortie/<id>   (option ?auteur=<id> pour ne voir que ses photos)
     #/auteur/<id>      (tous les reportages et sorties d'un auteur) */
(function () {
  'use strict';
  const { $, $$, esc, loadJSON, date, photoSrc, ph, plural, observe, lightbox, itemTile, authorNames, avatar } = window.CPM;
  const panel = $('#panel');
  const tabs = $$('.tab');
  let D = null, lastKey = '';

  const parse = () => {
    const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    return { parts, q: new URLSearchParams(qs || '') };
  };
  const go = (hash) => { location.hash = hash; };
  const kindOf = (k) => (k === 'sorties' || k === 'sortie' ? D.sorties : D.reportages);

  /* ---------- onglets ---------- */
  function setTab(active) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === active;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (active) panel.setAttribute('aria-labelledby', 'tab-' + active); else panel.removeAttribute('aria-labelledby');
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => go('#/' + t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); go('#/' + n.dataset.tab);
    });
  });

  /* ---------- liste (reportages ou sorties) ---------- */
  function renderList(kind, q) {
    const set = kind === 'sorties' ? D.sorties : D.reportages;
    const single = kind === 'sorties' ? 'sortie' : 'reportage';
    const cat = q.get('cat') || '';
    const usedCats = set.categories.filter((c) => set.items.some((it) => it.categorie === c.id));
    const items = set.items.filter((it) => !cat || it.categorie === cat);
    // auteurs de cet onglet, du plus prolifique au moins
    const counts = {};
    set.items.forEach((it) => (it.auteurs || []).forEach((a) => { counts[a] = (counts[a] || 0) + 1; }));
    const authorIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || (D.authors[a] ? D.authors[a].nom : a).localeCompare(D.authors[b] ? D.authors[b].nom : b));

    panel.innerHTML =
      '<div class="filters" role="group" aria-label="Filtrer par catégorie">' +
      '<button class="chip" type="button" data-cat="" aria-pressed="' + (!cat) + '">Toutes</button>' +
      usedCats.map((c) => '<button class="chip" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + (cat === c.id) + '">' + esc(c.nom) + '</button>').join('') +
      '<div class="select-wrap"><label class="sr-only" for="sel-auteur">Par auteur</label><select id="sel-auteur"><option value="">Par auteur</option>' +
      authorIds.map((id) => '<option value="' + esc(id) + '">' + esc(D.authors[id] ? D.authors[id].nom : id) + ' (' + counts[id] + ')</option>').join('') +
      '</select></div></div>' +
      (items.length
        ? '<div class="mosaic">' + items.map((it, i) => itemTile(it, single, D, i === 0 && !cat)).join('') + '</div>'
        : '<p class="empty">Aucun ' + single + ' dans cette catégorie pour le moment.</p>');
    $$('.chip', panel).forEach((b) => b.addEventListener('click', () => go('#/' + kind + (b.dataset.cat ? '?cat=' + encodeURIComponent(b.dataset.cat) : ''))));
    $('#sel-auteur', panel).addEventListener('change', (e) => { if (e.target.value) go('#/auteur/' + encodeURIComponent(e.target.value)); });
  }

  /* ---------- vue d'un auteur : tous ses reportages et sorties ---------- */
  function renderAuthor(id) {
    const a = D.authors[id];
    if (!a) return notFound('Auteur introuvable.');
    const reps = D.reportages.items.filter((it) => (it.auteurs || []).includes(id));
    const sors = D.sorties.items.filter((it) => (it.auteurs || []).includes(id));
    const group = (titre, list, single) => list.length
      ? '<h3 class="group-title">' + titre + ' <small>' + list.length + '</small></h3><div class="mosaic">' + list.map((it) => itemTile(it, single, D)).join('') + '</div>' : '';
    panel.innerHTML =
      '<div class="author-banner">' + avatar(a) + '<div><h2>' + esc(a.nom) + '</h2>' +
      '<p>' + (a.role ? esc(a.role) + ' · ' : '') + plural(reps.length, 'reportage') + ' · ' + plural(sors.length, 'sortie') + '</p>' +
      (a.bio ? '<p style="margin-top:.5em">' + esc(a.bio) + '</p>' : '') +
      (a.site ? '<p style="margin-top:.5em"><a href="' + esc(a.site) + '" target="_blank" rel="noopener">Son site personnel ↗</a></p>' : '') + '</div>' +
      '<a class="btn btn--ghost" href="#/reportages">Voir toute la galerie</a></div>' +
      (reps.length || sors.length ? group('Reportages', reps, 'reportage') + group('Sorties', sors, 'sortie') : '<p class="empty">Pas encore de reportage ni de sortie en ligne pour cet auteur.</p>');
  }

  /* ---------- détail d'un reportage / d'une sortie ---------- */
  function renderDetail(single, id, q) {
    const set = single === 'sortie' ? D.sorties : D.reportages;
    const list = single === 'sortie' ? 'sorties' : 'reportages';
    const item = set.items.find((it) => it.id === id);
    if (!item) return notFound((single === 'sortie' ? 'Sortie' : 'Reportage') + ' introuvable.');
    const filterA = q.get('auteur');
    let photos = item.photos.map(ph);
    if (filterA && photos.some((p) => p.a === filterA)) photos = photos.filter((p) => p.a === filterA);
    const catName = (set.categories.find((c) => c.id === item.categorie) || {}).nom;
    const authLinks = (item.auteurs || []).map((a) => '<a href="#/auteur/' + encodeURIComponent(a) + '">' + esc(D.authors[a] ? D.authors[a].nom : a) + '</a>').join(', ');
    const label = single === 'sortie' ? 'Voir la sortie complète' : 'Voir le reportage complet';

    panel.innerHTML =
      '<a class="detail__back" href="#/' + list + '">Retour aux ' + list + '</a>' +
      '<div class="detail__head">' + (catName ? '<span class="tag" style="justify-self:start">' + esc(catName) + '</span>' : '') +
      '<h2 tabindex="-1" id="detail-title">' + esc(item.titre) + '</h2>' +
      '<p class="detail__meta"><span><b>' + esc(date(item.date)) + '</b></span>' + (item.lieu ? '<span>' + esc(item.lieu) + '</span>' : '') +
      (authLinks ? '<span>Photos : ' + authLinks + '</span>' : '') + '</p>' +
      (item.note ? '<p class="muted" style="margin:0">' + esc(item.note) + '</p>' : '') +
      '<div class="detail__links"><span class="muted">' + (item.total && item.total > photos.length ? 'Sélection de ' + photos.length + ' photos sur ' + item.total : plural(photos.length, 'photo')) + '</span>' +
      (item.lien ? '<a class="btn btn--ghost" href="' + esc(item.lien) + '" target="_blank" rel="noopener">' + label + ' ↗</a>' : '') + '</div></div>' +
      '<div class="mosaic" id="photos">' + photos.map((p, i) => {
        const cls = p.w && p.h && p.h / p.w > 1.2 ? ' tile--tall' : (i % 5 === 0 ? ' tile--wide' : '');
        const who = p.a && D.authors[p.a] ? D.authors[p.a].nom : '';
        return '<button class="tile tile--photo' + cls + '" type="button" data-i="' + i + '" aria-label="Agrandir la photo ' + (i + 1) + ' sur ' + photos.length + '">' +
          '<img src="' + esc(photoSrc(item, p, true)) + '" alt="' + esc(item.titre + ', photo ' + (i + 1)) + '"' + (p.w ? ' width="' + p.w + '" height="' + p.h + '"' : '') + ' loading="lazy" decoding="async">' +
          ((who || p.l) ? '<span class="tile__cap"><span class="tile__meta" style="display:block">' + esc([who, p.l].filter(Boolean).join(' · ')) + '</span></span>' : '') + '</button>';
      }).join('') + '</div>';

    const slides = photos.map((p) => ({
      src: photoSrc(item, p, false), title: item.titre,
      sub: [date(item.date), p.a && D.authors[p.a] ? D.authors[p.a].nom : '', p.l].filter(Boolean).join(' · '),
      alt: item.titre, link: item.lien, linkLabel: single === 'sortie' ? 'Sortie complète ↗' : 'Reportage complet ↗'
    }));
    $('#photos', panel).addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) lightbox.open(slides, +b.dataset.i);
    });
    const h = $('#detail-title'); if (h) h.focus({ preventScroll: true });
  }

  function notFound(msg) {
    setTab('');
    panel.innerHTML = '<p class="empty">' + esc(msg) + ' <a href="#/reportages">Retour à la galerie</a></p>';
  }

  /* ---------- routeur ---------- */
  function route() {
    if (!D) return;
    const { parts, q } = parse();
    const [a, b] = parts;
    const key = [a || 'reportages', b || ''].join('/');
    if (a === 'reportage' || a === 'sortie') { setTab(a === 'sortie' ? 'sorties' : 'reportages'); renderDetail(a, b, q); }
    else if (a === 'auteur') { setTab(''); renderAuthor(b); }
    else { const k = a === 'sorties' ? 'sorties' : 'reportages'; setTab(k); renderList(k, q); }
    if (lastKey && lastKey !== key) $('#galerie-app').scrollIntoView({ block: 'start' });
    lastKey = key;
    observe(panel);
  }

  Promise.all([loadJSON('reportages'), loadJSON('sorties'), loadJSON('auteurs')]).then(([reportages, sorties, auteurs]) => {
    const authors = {}; auteurs.forEach((x) => { authors[x.id] = x; });
    const cats = {};
    reportages.categories.concat(sorties.categories).forEach((c) => { cats[c.id] = c.nom; });
    D = { reportages, sorties, authors, cats };
    $('#n-reportages').textContent = reportages.items.length;
    $('#n-sorties').textContent = sorties.items.length;
    route();
    window.addEventListener('hashchange', route);
  }).catch((e) => {
    console.error(e);
    panel.innerHTML = '<p class="empty">La galerie n’a pas pu être chargée. Réessayez dans un instant.</p>';
  });
})();
