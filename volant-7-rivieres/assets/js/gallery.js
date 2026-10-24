/* Galerie : filtre par album + visionneuse plein écran */
(() => {
  const bar = document.querySelector('.filters'), grid = document.querySelector('.gallery'), dlg = document.getElementById('lightbox');
  bar.addEventListener('click', e => {
    const b = e.target.closest('.filter'); if (!b) return;
    bar.querySelectorAll('.filter').forEach(x => x.classList.toggle('is-on', x === b));
    grid.querySelectorAll('[data-type]').forEach(el => { el.hidden = b.dataset.filter !== '*' && el.dataset.type !== b.dataset.filter; });
  });
  const img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption');
  let list = [], i = 0;
  const show = n => {
    i = (n + list.length) % list.length;
    const a = list[i]; img.src = a.href; img.alt = a.querySelector('img').alt; cap.textContent = `${a.dataset.album} · ${a.dataset.cap}`;
  };
  grid.addEventListener('click', e => {
    const a = e.target.closest('.shot__a'); if (!a) return;
    e.preventDefault();
    list = [...grid.querySelectorAll('.shot:not([hidden]) .shot__a')]; show(list.indexOf(a)); dlg.showModal();
  });
  dlg.querySelector('.lightbox__x').onclick = () => dlg.close();
  dlg.querySelector('.lightbox__p').onclick = () => show(i - 1);
  dlg.querySelector('.lightbox__n').onclick = () => show(i + 1);
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
})();
