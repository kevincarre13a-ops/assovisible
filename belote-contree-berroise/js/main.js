/* Belote Contrée Berroise — comportements communs */

/* ===== CONFIGURATION DES CONCOURS (à modifier ici) =====
   Renseigner "date" au format ISO local, ex. "2027-03-27T14:00:00".
   Tant qu'une date est vide, le compte à rebours affiche un message d'attente. */
window.CONCOURS = [
  { nom: "Trophée des Villes", date: null },
  { nom: "Deuxième concours national", date: null },
  { nom: "Troisième concours national", date: null }
];

(function () {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', e => { if (e.target.tagName === 'A') nav.classList.remove('open'); });
  }

  /* apparition au défilement */
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  /* compteurs animés */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now(), d = 1600;
      const tick = t => {
        const p = Math.min((t - t0) / d, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); co.unobserve(el);
    }), { threshold: .5 });
    counters.forEach(c => co.observe(c));
  }

  /* compte à rebours */
  const box = document.getElementById('countdown');
  if (box) {
    const next = window.CONCOURS
      .filter(c => c.date && new Date(c.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const name = document.getElementById('cd-name');
    const grid = document.getElementById('cd-grid');
    const msg = document.getElementById('cd-msg');
    if (!next) {
      grid.hidden = true;
      msg.hidden = false;
    } else {
      msg.hidden = true;
      name.textContent = next.nom + ' — ' + new Date(next.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const set = (id, v) => document.getElementById(id).textContent = String(v).padStart(2, '0');
      const upd = () => {
        const s = Math.max(0, Math.floor((new Date(next.date) - new Date()) / 1000));
        set('cd-d', Math.floor(s / 86400)); set('cd-h', Math.floor(s % 86400 / 3600));
        set('cd-m', Math.floor(s % 3600 / 60)); set('cd-s', s % 60);
      };
      upd(); setInterval(upd, 1000);
    }
  }

  /* onglets palmarès */
  document.querySelectorAll('.tabs').forEach(tabs => {
    const btns = tabs.querySelectorAll('button');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-selected', x === b));
      document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== b.dataset.panel);
    }));
  });
})();
