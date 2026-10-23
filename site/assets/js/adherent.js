/* Espace adhérents : cours et supports (data/cours.json), classés par thème ou par date */
(function () {
  'use strict';
  const { $, $$, esc, loadJSON, date, plural, observe } = window.CPM;
  const root = $('#docs-root');
  const search = $('#docs-search');
  const chips = $$('[data-view]');
  let data = null, view = 'theme';

  const docHTML = (d) =>
    '<div class="doc reveal"><span class="doc__ico ' + esc(d.type) + '">' + esc(d.type.toUpperCase()) + '</span>' +
    '<div><h3>' + esc(d.titre) + (d.exemple ? '<span class="badge-ex">Exemple</span>' : '') + '</h3>' +
    '<p>' + (d.description ? esc(d.description) + ' · ' : '') + esc(date(d.date)) + (d.taille ? ' · ' + esc(d.taille) : '') + '</p></div>' +
    '<a class="btn btn--ghost" href="' + esc(d.fichier) + '" download>Télécharger</a></div>';

  const group = (titre, list) => '<section class="doc-group"><h2>' + esc(titre) + ' <small>' + plural(list.length, 'document') + '</small></h2>' + list.map(docHTML).join('') + '</section>';

  function render() {
    const q = search.value.trim().toLowerCase();
    const items = data.items.filter((d) => !q || [d.titre, d.description, d.theme].join(' ').toLowerCase().includes(q));
    if (!items.length) {
      root.innerHTML = '<p class="empty">' + (data.items.length ? 'Aucun document ne correspond à votre recherche.' : 'Aucun support déposé pour le moment.') + '</p>';
      return;
    }
    let html = '';
    if (view === 'theme') {
      const order = (data.themes || []).slice();
      items.forEach((d) => { if (!order.includes(d.theme)) order.push(d.theme); });
      order.forEach((t) => {
        const l = items.filter((d) => d.theme === t).sort((a, b) => b.date.localeCompare(a.date));
        if (l.length) html += group(t, l);
      });
    } else {
      const years = [...new Set(items.map((d) => d.date.slice(0, 4)))].sort().reverse();
      years.forEach((y) => { html += group(y, items.filter((d) => d.date.startsWith(y)).sort((a, b) => b.date.localeCompare(a.date))); });
    }
    root.innerHTML = html;
    observe(root);
  }

  chips.forEach((b) => b.addEventListener('click', () => {
    view = b.dataset.view;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
    render();
  }));
  search.addEventListener('input', render);

  loadJSON('cours').then((d) => { data = d; render(); }).catch(() => {
    root.innerHTML = '<p class="empty">Impossible de charger les supports. Cet espace est réservé aux adhérents : rechargez la page et saisissez le mot de passe demandé.</p>';
  });
})();
