/* Filtres par pastilles (archives, actualités) */
(() => {
  const bar = document.querySelector('.filters'), list = document.querySelector('[data-filterable]');
  if (!bar || !list) return;
  bar.addEventListener('click', e => {
    const b = e.target.closest('.filter'); if (!b) return;
    bar.querySelectorAll('.filter').forEach(x => x.classList.toggle('is-on', x === b));
    const f = b.dataset.filter;
    list.querySelectorAll('[data-type]').forEach(el => { el.hidden = f !== '*' && el.dataset.type !== f; });
  });
  if (location.hash) { const t = document.querySelector(location.hash.replace(/([.:])/g, '\\$1')); t && t.querySelector('details') && (t.querySelector('details').open = true); }
})();
