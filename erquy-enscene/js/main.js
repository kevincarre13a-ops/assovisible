(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu burger */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var ouvert = menu.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert);
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = ouvert ? 'hidden' : '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('ouvert')) burger.click();
    });
  }

  /* Apparitions douces */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduit) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  } else {
    items.forEach(function (i) { i.classList.add('vu'); });
  }

  /* Compte à rebours */
  var cr = document.querySelector('[data-countdown]');
  if (cr) {
    var cible = new Date(cr.getAttribute('data-countdown')).getTime();
    var champs = { j: cr.querySelector('[data-j]'), h: cr.querySelector('[data-h]'), m: cr.querySelector('[data-m]'), s: cr.querySelector('[data-s]') };
    var fin = function () {
      cr.innerHTML = '<p class="cr-fin">Le rideau est tombé : merci à tous les spectateurs-jurés !</p>';
    };
    var tick = function () {
      var d = cible - Date.now();
      if (d <= 0) { fin(); return true; }
      var p = function (n) { return String(n).padStart(2, '0'); };
      champs.j.textContent = Math.floor(d / 864e5);
      champs.h.textContent = p(Math.floor(d % 864e5 / 36e5));
      champs.m.textContent = p(Math.floor(d % 36e5 / 6e4));
      champs.s.textContent = p(Math.floor(d % 6e4 / 1e3));
      return false;
    };
    if (!tick()) { var iv = setInterval(function () { if (tick()) clearInterval(iv); }, 1000); }
  }

  /* Compteurs animés */
  var compteurs = document.querySelectorAll('[data-compte]');
  var lance = function (el) {
    var fin = parseInt(el.getAttribute('data-compte'), 10);
    if (reduit) { el.textContent = fin; return; }
    var t0 = null, dur = 1600;
    var step = function (t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { lance(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.5 });
    compteurs.forEach(function (c) { io2.observe(c); });
  } else {
    compteurs.forEach(function (c) { c.textContent = c.getAttribute('data-compte'); });
  }

  /* Carrousel d'affiches */
  document.querySelectorAll('.carrousel').forEach(function (car) {
    var piste = car.querySelector('.piste');
    var pas = function () { return Math.max(piste.clientWidth * 0.7, 260); };
    var prev = car.querySelector('[data-prev]'), next = car.querySelector('[data-next]');
    prev.addEventListener('click', function () { piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
    if (!reduit) {
      var auto = setInterval(function () {
        if (piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 4) piste.scrollTo({ left: 0, behavior: 'smooth' });
        else piste.scrollBy({ left: pas(), behavior: 'smooth' });
      }, 4500);
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { car.addEventListener(ev, function () { clearInterval(auto); }, { passive: true }); });
    }
  });

  /* Frise : centrer le prochain spectacle */
  var proch = document.querySelector('.frise .prochain');
  if (proch && proch.parentNode.scrollWidth > proch.parentNode.clientWidth) {
    proch.parentNode.scrollLeft = Math.max(0, proch.offsetLeft - 20);
  }

  /* Visionneuse photo */
  var dlg = document.getElementById('lightbox');
  if (dlg && dlg.showModal) {
    var img = dlg.querySelector('img'), leg = dlg.querySelector('p');
    document.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        img.src = b.getAttribute('data-zoom');
        img.alt = b.getAttribute('data-alt') || '';
        leg.textContent = b.getAttribute('data-alt') || '';
        dlg.showModal();
      });
    });
    dlg.querySelector('.fermer').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }
})();
