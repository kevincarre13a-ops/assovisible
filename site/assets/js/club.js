/* Le club : activités, histoire, valeurs, bureau, auteurs */
(function () {
  'use strict';
  const { $, $$, esc, loadJSON, plural, observe, avatar } = window.CPM;

  Promise.all([loadJSON('club'), loadJSON('auteurs'), loadJSON('reportages'), loadJSON('sorties')]).then(([club, auteurs, reps, sors]) => {
    const byId = {}; auteurs.forEach((a) => { byId[a.id] = a; });

    $('#activites').innerHTML = club.activites.map((a) => '<div class="act reveal"><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p></div>').join('');
    const pres = $('#presentation-texte');
    if (pres && club.presentation) pres.innerHTML = '<p class="eyebrow">Présentation</p><h2>Regarder, partager, progresser</h2>' + club.presentation.map((p) => '<p>' + esc(p) + '</p>').join('');

    $('#timeline').innerHTML = club.histoire.map((h) =>
      '<li class="reveal"><p class="yr">' + esc(h.annee) + '</p><h3>' + esc(h.titre) + '</h3><p>' + esc(h.texte) + '</p></li>').join('');

    $('#values').innerHTML = club.valeurs.map((v, i) =>
      '<div class="value reveal"><span class="n">0' + (i + 1) + '</span><h3>' + esc(v.titre) + '</h3><p>' + esc(v.texte) + '</p></div>').join('');

    $('#bureau-liste').innerHTML = club.bureau.map((b, i) => {
      const a = byId[b.id] || { nom: b.id, portrait: '' };
      return '<div class="member reveal' + (i === 0 ? ' member--lead' : '') + '">' + avatar(a) + '<div><b>' + esc(a.nom) + '</b><span>' + esc(b.role) + '</span></div></div>';
    }).join('');

    const count = (id) => ({
      r: reps.items.filter((x) => (x.auteurs || []).includes(id)).length,
      s: sors.items.filter((x) => (x.auteurs || []).includes(id)).length
    });
    $('#authors-grid').innerHTML = auteurs.filter((a) => a.vedette).map((a) => {
      const n = count(a.id);
      return '<a class="author reveal" href="galerie.html#/auteur/' + encodeURIComponent(a.id) + '" aria-label="Voir les photos de ' + esc(a.nom) + '">' +
        avatar(a) + '<h3>' + esc(a.nom) + '</h3>' + (a.role ? '<p class="role">' + esc(a.role) + '</p>' : '') +
        (a.bio ? '<p class="bio">' + esc(a.bio) + '</p>' : '') +
        '<span class="count">' + plural(n.r, 'reportage') + ' · ' + plural(n.s, 'sortie') + '</span></a>';
    }).join('');
    observe();
    if (location.hash) { const t = $(location.hash); if (t) t.scrollIntoView(); }
  }).catch((e) => { console.error(e); });

  /* rubrique active dans la barre secondaire */
  const links = $$('.subnav a');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        const act = $('.subnav a.active');
        if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((s) => so.observe(s));
  }
})();
