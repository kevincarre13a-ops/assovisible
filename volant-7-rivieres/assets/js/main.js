(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');

  /* En-tête : transparent sur le héros, plein au défilement */
  const onScroll = () => header.classList.toggle('is-solid', scrollY > 24);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  /* Menu burger */
  const setMenu = open => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  burger.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width:1180px)').addEventListener('change', e => e.matches && setMenu(false));

  /* Apparitions douces */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Compteurs animés */
  const run = el => {
    const end = +el.dataset.count, dur = 1700, t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), v = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(end * v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { co.unobserve(e.target); reduce ? 0 : (e.target.textContent = '0', run(e.target)); }
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  /* Cartes qui s'inclinent au survol */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .12s linear';
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .5s cubic-bezier(.22,.8,.24,1)'; el.style.transform = ''; });
    });
  }

  /* Cartes de créneaux : détails au toucher / clavier */
  document.querySelectorAll('.slot').forEach(card => {
    const b = card.querySelector('.slot__more');
    b.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open); b.textContent = open ? 'Fermer' : 'Détails';
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === card) b.click(); });
  });
})();
