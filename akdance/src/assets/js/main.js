(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu burger */
  const burger = $('.burger'), menu = $('#menu');
  if (burger && menu) {
    const set = (open) => {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    burger.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => e.target.closest('a') && set(false));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  }

  /* ombre de l'en-tête */
  const head = $('.site-header');
  const onScroll = () => head && head.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* apparition douce */
  const items = $$('[data-reveal]');
  items.forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 0.08}s`));
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add('in'));

  /* compteurs animés */
  const counters = $$('[data-count]');
  const run = (el) => {
    const end = +el.dataset.count;
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { run(e.target); co.unobserve(e.target); }
    }), { threshold: 0.4 });
    counters.forEach((el) => co.observe(el));
  } else counters.forEach((el) => { el.textContent = el.dataset.count; });

  /* léger parallaxe du héro */
  const hero = $('.hero');
  if (hero && !reduce) {
    const layers = $$('.ribbon, .petal', hero);
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, innerHeight);
        $$('.ribbon', hero).forEach((l, i) => { l.style.translate = `0 ${y * (0.12 + i * 0.08)}px`; });
        $$('.hero-inner', hero).forEach((l) => { l.style.translate = `0 ${y * 0.18}px`; l.style.opacity = 1 - y / (innerHeight * 0.9); });
        ticking = false;
      });
    }, { passive: true });
    void layers;
  }

  /* cartes tactiles : toucher pour déplier */
  $$('.card').forEach((c) => c.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    c.classList.toggle('open');
  }));

  /* filtre du planning */
  const pf = $$('[data-plan-filter]');
  pf.forEach((b) => b.addEventListener('click', () => {
    pf.forEach((x) => x.classList.toggle('is-on', x === b));
    $$('#week .slot').forEach((s) => { s.hidden = b.dataset.planFilter !== 'all' && s.dataset.fam !== b.dataset.planFilter; });
  }));

  /* filtre + lightbox de la galerie */
  const gf = $$('[data-gal-filter]');
  gf.forEach((b) => b.addEventListener('click', () => {
    gf.forEach((x) => x.classList.toggle('is-on', x === b));
    $$('.masonry figure, .videos .video').forEach((f) => { f.hidden = b.dataset.galFilter !== 'all' && f.dataset.cat !== b.dataset.galFilter; });
  }));
  const lb = $('#lightbox');
  if (lb) {
    const img = $('img', lb);
    const close = () => { lb.hidden = true; img.removeAttribute('src'); };
    $$('.zoom').forEach((z) => z.addEventListener('click', () => { img.src = z.dataset.full; img.alt = z.dataset.alt || ''; lb.hidden = false; }));
    lb.addEventListener('click', (e) => (e.target === lb || e.target.closest('.lb-close')) && close());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  }

  /* formulaire Netlify : envoi sans rechargement, repli sur l'envoi classique */
  const form = $('form[name="contact"]');
  if (form && window.fetch) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('button[type=submit]', form);
      btn.disabled = true; btn.textContent = 'Envoi…';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then((r) => { if (!r.ok) throw new Error(r.status); location.href = 'merci.html'; })
        .catch(() => { form.submit(); });
    });
  }
})();
