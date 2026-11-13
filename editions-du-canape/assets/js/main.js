/* éditions du Canapé — petits comportements, sans dépendance */
(function () {
  'use strict';
  var doc = document;
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- menu mobile ---------- */
  var burger = $('.burger'), nav = $('#menu-principal');
  if (burger && nav) {
    var fermer = function () { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('est-ouvert'); };
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!ouvert));
      nav.classList.toggle('est-ouvert', !ouvert);
      if (!ouvert) { var a = $('a', nav); if (a) a.focus(); }
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('est-ouvert')) { fermer(); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) fermer(); });
  }

  /* ---------- curseur plume (ordinateur uniquement) ---------- */
  if (!reduit && window.matchMedia('(hover: hover) and (pointer: fine)').matches) doc.body.classList.add('curseur-plume');

  /* ---------- apparitions douces ---------- */
  var reveles = $$('.revele');
  if ('IntersectionObserver' in window && !reduit) {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('est-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    reveles.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
    // filet de sécurité : un défilement très rapide peut « sauter » un élément
    var verifier = function () {
      reveles.forEach(function (el) { if (!el.classList.contains('est-visible') && el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('est-visible'); io.unobserve(el); } });
    };
    var attente = null;
    window.addEventListener('scroll', function () { if (!attente) attente = setTimeout(function () { attente = null; verifier(); }, 120); }, { passive: true });
  } else reveles.forEach(function (el) { el.classList.add('est-visible'); });

  /* ---------- étagère : glisser au toucher, à la souris et au défilement ---------- */
  var rang = $('.etagere__rang');
  if (rang) {
    var tire = false, depart = 0, scrollDepart = 0, bouge = false;
    rang.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      tire = true; bouge = false; depart = e.clientX; scrollDepart = rang.scrollLeft; rang.classList.add('est-tire');
    });
    window.addEventListener('pointermove', function (e) {
      if (!tire) return;
      var dx = e.clientX - depart; if (Math.abs(dx) > 4) bouge = true;
      rang.scrollLeft = scrollDepart - dx;
    });
    window.addEventListener('pointerup', function () { tire = false; rang.classList.remove('est-tire'); });
    rang.addEventListener('click', function (e) { if (bouge) { e.preventDefault(); bouge = false; } }, true);
    rang.addEventListener('dragstart', function (e) { e.preventDefault(); });
    // au défilement vertical de la page, les couvertures glissent doucement
    if (!reduit) {
      var interagi = false, dernier = window.scrollY, rafId = null;
      ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (t) { rang.addEventListener(t, function () { interagi = true; }, { passive: true }); });
      window.addEventListener('scroll', function () {
        if (interagi || rafId) return;
        rafId = requestAnimationFrame(function () {
          rafId = null;
          var dy = window.scrollY - dernier; dernier = window.scrollY;
          var r = rang.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) rang.scrollLeft += dy * .6;
        });
      }, { passive: true });
    }
  }

  /* ---------- filtres et recherche (catalogue, carnet) ---------- */
  var liste = $$('[data-liste]');
  if (liste.length) {
    var boutons = $$('[data-filtre]'), champ = $('[data-recherche]'), resultat = $('[data-resultat]'), vide = $('[data-vide]');
    var items = $$('[data-liste] > li');
    var attr = items[0] && items[0].hasAttribute('data-themes') ? 'data-themes' : 'data-categories';
    var nom = attr === 'data-themes' ? ['article', 'articles'] : ['livre', 'livres'];
    var filtre = 'tous';
    var normal = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var appliquer = function () {
      var q = normal(champ ? champ.value.trim() : ''), n = 0;
      items.forEach(function (li) {
        var okF = filtre === 'tous' || (' ' + li.getAttribute(attr) + ' ').indexOf(' ' + filtre + ' ') > -1;
        var okQ = !q || normal(li.getAttribute('data-recherche') || li.textContent).indexOf(q) > -1;
        li.hidden = !(okF && okQ); if (!li.hidden) n++;
      });
      $$('[data-annee]').forEach(function (s) { s.hidden = !$$('li:not([hidden])', s).length; });
      if (resultat) resultat.textContent = n + ' ' + (n > 1 ? nom[1] : nom[0]);
      if (vide) vide.hidden = n > 0;
    };
    var choisir = function (f) {
      filtre = f;
      boutons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filtre') === f)); });
      appliquer();
    };
    boutons.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filtre'); choisir(f);
        var u = new URL(location.href); if (f === 'tous') u.searchParams.delete('filtre'); else u.searchParams.set('filtre', f);
        history.replaceState(null, '', u);
      });
    });
    if (champ) champ.addEventListener('input', appliquer);
    var reinit = $('[data-reinit]'); if (reinit) reinit.addEventListener('click', function () { if (champ) champ.value = ''; choisir('tous'); });
    var depuisUrl = new URLSearchParams(location.search).get('filtre');
    if (depuisUrl && boutons.some(function (b) { return b.getAttribute('data-filtre') === depuisUrl; })) choisir(depuisUrl);
  }

  /* ---------- frise qui se dessine au défilement ---------- */
  var frise = $('[data-frise]');
  if (frise) {
    var trait = $('.frise__trait path', frise);
    var maj = function () {
      var r = frise.getBoundingClientRect(), h = window.innerHeight;
      var p = Math.min(1, Math.max(0, (h * .75 - r.top) / r.height));
      trait.style.setProperty('--trace', String(1 - p));
    };
    if (!reduit) { maj(); window.addEventListener('scroll', function () { requestAnimationFrame(maj); }, { passive: true }); }
  }

  /* ---------- feuilletage plein écran avec page qui tourne ---------- */
  var feuilletages = $$('[data-feuilletage]');
  if (feuilletages.length) {
    var v = doc.createElement('div');
    v.className = 'visionneuse'; v.hidden = true;
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Feuilletage des pages');
    v.innerHTML = '<div class="visionneuse__haut"><span class="visionneuse__compteur" aria-live="polite"></span><button type="button" class="visionneuse__btn" data-fermer aria-label="Fermer le feuilletage">✕</button></div>' +
      '<div class="visionneuse__scene"><button type="button" class="visionneuse__btn visionneuse__nav visionneuse__nav--prec" data-prec aria-label="Page précédente">←</button><div class="visionneuse__page"><picture><source type="image/webp"><img alt=""></picture></div><button type="button" class="visionneuse__btn visionneuse__nav visionneuse__nav--suiv" data-suiv aria-label="Page suivante">→</button></div>' +
      '<p class="visionneuse__legende"></p>';
    doc.body.appendChild(v);
    var pageEl = $('.visionneuse__page', v), imgEl = $('img', v), srcEl = $('source', v), leg = $('.visionneuse__legende', v), cpt = $('.visionneuse__compteur', v);
    var courant = [], index = 0, retour = null;
    var afficher = function (i, sens) {
      index = (i + courant.length) % courant.length;
      var b = courant[index];
      srcEl.srcset = b.getAttribute('data-webp') || '';
      imgEl.src = b.getAttribute('data-src');
      imgEl.alt = $('img', b).alt;
      leg.textContent = $('img', b).alt;
      cpt.textContent = 'Page ' + (index + 1) + ' / ' + courant.length;
      if (!reduit && sens) { pageEl.classList.remove('tourne-suivant', 'tourne-precedent'); void pageEl.offsetWidth; pageEl.classList.add(sens > 0 ? 'tourne-suivant' : 'tourne-precedent'); }
      // précharger la suivante
      var n = courant[(index + 1) % courant.length]; if (n) { var pre = new Image(); pre.src = n.getAttribute('data-src'); }
    };
    var ouvrir = function (boutonsF, i, declencheur) {
      courant = boutonsF; retour = declencheur;
      v.hidden = false; doc.documentElement.style.overflow = 'hidden';
      var plusieurs = courant.length > 1;
      $('[data-prec]', v).hidden = !plusieurs; $('[data-suiv]', v).hidden = !plusieurs;
      afficher(i, 1); $('[data-fermer]', v).focus();
    };
    var fermerV = function () { v.hidden = true; doc.documentElement.style.overflow = ''; if (retour) retour.focus(); };
    feuilletages.forEach(function (f) {
      var bs = $$('.feuilletage__vignette', f);
      bs.forEach(function (b, i) { b.addEventListener('click', function () { ouvrir(bs, i, b); }); });
    });
    $('[data-fermer]', v).addEventListener('click', fermerV);
    $('[data-prec]', v).addEventListener('click', function () { afficher(index - 1, -1); });
    $('[data-suiv]', v).addEventListener('click', function () { afficher(index + 1, 1); });
    v.addEventListener('click', function (e) { if (e.target === v || e.target.classList.contains('visionneuse__scene')) fermerV(); });
    doc.addEventListener('keydown', function (e) {
      if (v.hidden) return;
      if (e.key === 'Escape') fermerV();
      else if (e.key === 'ArrowRight') afficher(index + 1, 1);
      else if (e.key === 'ArrowLeft') afficher(index - 1, -1);
      else if (e.key === 'Tab') { // garder le focus dans la visionneuse
        var fs = $$('button:not([hidden])', v), pr = fs[0], de = fs[fs.length - 1];
        if (e.shiftKey && doc.activeElement === pr) { e.preventDefault(); de.focus(); }
        else if (!e.shiftKey && doc.activeElement === de) { e.preventDefault(); pr.focus(); }
      }
    });
    var tx = null;
    v.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) {
      if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40 && courant.length > 1) afficher(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  }

  /* ---------- formulaire de contact : pré-remplissage et commande ---------- */
  var form = $('[data-formulaire-contact]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var bloc = $('[data-bloc-commande]', form), select = $('#livre', form), qte = $('#quantite', form), total = $('[data-total]', form);
    var sujet = params.get('sujet'), livreP = params.get('livre');
    if (sujet) { var r = $('input[name="sujet"][value="' + sujet + '"]', form); if (r) r.checked = true; }
    if (livreP && select) select.value = livreP;
    var majSujet = function () {
      var s = ($('input[name="sujet"]:checked', form) || {}).value;
      bloc.hidden = s !== 'commande';
      if (select) select.required = s === 'commande';
    };
    var majTotal = function () {
      var o = select.options[select.selectedIndex], p = parseFloat(o && o.getAttribute('data-prix'));
      var q = parseInt(qte.value, 10) || 1;
      total.textContent = p ? 'Montant indicatif : ' + (p * q).toFixed(2).replace('.', ',') + ' €, hors frais d’envoi (à convenir par courriel).' : '';
    };
    $$('input[name="sujet"]', form).forEach(function (r) { r.addEventListener('change', majSujet); });
    select.addEventListener('change', majTotal); qte.addEventListener('input', majTotal);
    majSujet(); majTotal();
    if (location.hash === '#formulaire' && (sujet || livreP)) { var t = $('#formulaire'); if (t) setTimeout(function () { t.focus({ preventScroll: true }); }, 50); }
  }
})();
