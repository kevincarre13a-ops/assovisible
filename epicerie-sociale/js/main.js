(function () {
  var btn = document.querySelector('.burger'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('lock', open);
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); document.body.classList.remove('lock'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); document.body.classList.remove('lock'); } });
  }
  var hdr = document.querySelector('.site-header');
  function sc() { hdr && hdr.classList.toggle('scrolled', window.scrollY > 8); }
  sc(); window.addEventListener('scroll', sc, { passive: true });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  var cs = document.querySelectorAll('[data-count]');
  function run(el) {
    var t = +el.dataset.count, plus = el.dataset.plus ? '+' : '', d = 1400, s = null;
    if (reduce) { el.textContent = t + plus; return; }
    function f(ts) { s = s || ts; var p = Math.min((ts - s) / d, 1), v = Math.round(t * (1 - Math.pow(1 - p, 3))); el.textContent = v + (p === 1 ? plus : ''); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { run(e.target); io2.unobserve(e.target); } }); }, { threshold: .5 });
    cs.forEach(function (c) { io2.observe(c); });
  }

  var q = new URLSearchParams(location.search).get('sujet'), sel = document.getElementById('sujet');
  if (q && sel) { for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === q) sel.selectedIndex = i; }
})();
