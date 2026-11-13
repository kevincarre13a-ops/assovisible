/* Graines de Cabane : interactions du site (sans framework) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = {
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------- Données ---------- */
  const cache = {};
  const getJSON = (name) => (cache[name] ||= fetch(`data/${name}.json`, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(name); return r.json(); }));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const fmt = (d, o) => new Intl.DateTimeFormat('fr-FR', o).format(d);
  const fmtLong = (d) => fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtShort = (d) => fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const TYPES = { permanence: 'Permanence ludique', evenement: 'Temps fort', defi: 'Défi collecte', atelier: 'Atelier' };

  let agendaP;
  const loadAgenda = () => (agendaP ||= getJSON('agenda').then((a) => {
    const evs = a.evenements.map((e, i) => {
      const start = parseDate(e.date);
      const end = e.fin ? parseDate(e.fin) : start;
      return { ...e, id: 'ev-' + i, start, end, lieu: e.lieu ?? a.lieuParDefaut, horaires: e.horaires ?? a.horairesParDefaut, past: end < today, ongoing: start <= today && end >= today };
    }).sort((x, y) => x.start - y.start);
    return { ...a, evs, upcoming: evs.filter((e) => !e.past), past: evs.filter((e) => e.past) };
  }));
  const isSalle = (e) => e.type !== 'defi' && /Tourren/i.test(e.lieu || '');

  /* ---------- En-tête et menu ---------- */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('[data-burger]'); const nav = $('[data-nav]');
  if (burger && nav) {
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.classList.toggle('is-open', open); document.body.classList.toggle('nav-open', open);
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); burger.focus(); } });
    window.matchMedia('(min-width: 1121px)').addEventListener('change', () => setOpen(false));
  }

  /* ---------- Apparition au défilement ---------- */
  const io = 'IntersectionObserver' in window && !reduced ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); en.target.dispatchEvent(new CustomEvent('reveal')); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  const observe = (el) => { if (io) io.observe(el); else { el.classList.add('is-in'); el.dispatchEvent(new CustomEvent('reveal')); } };
  const observeAll = (root = document) => $$('.reveal, .reveal-pop, .brush, .timeline, .words, [data-count], [data-observe]', root).forEach(observe);
  $$('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', (i * 0.09).toFixed(2) + 's'); }));
  $$('.words').forEach((el) => {
    let i = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) frag.append(w); else { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = w; frag.append(s); } });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  });
  observeAll();

  /* ---------- Compteurs ---------- */
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count); const out = $('.n', el) || el;
    const format = (v) => Math.round(v).toLocaleString('fr-FR');
    if (reduced) { out.textContent = format(target); return; }
    out.textContent = '0';
    el.addEventListener('reveal', () => {
      const t0 = performance.now(); const dur = 1800;
      const step = (t) => { const p = Math.min(1, (t - t0) / dur); out.textContent = format(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { once: true });
  });

  /* ---------- Parallaxe légère des pièces du héros ---------- */
  const pieces = $$('[data-parallax]');
  if (pieces.length && !reduced) {
    let mx = 0, my = 0, ticking = false;
    const apply = () => {
      const sy = window.scrollY;
      pieces.forEach((p, i) => { const k = (i % 3 + 1) * 0.12; p.style.transform = `translate3d(${mx * k * 30}px, ${my * k * 30 - sy * k}px, 0)`; });
      ticking = false;
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req(); }, { passive: true });
  }

  /* ---------- Images manquantes : visuel d'attente ---------- */
  const placeholder = (label) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#E6F1F7"/><circle cx="70" cy="60" r="70" fill="#8FB43A" opacity=".25"/><circle cx="340" cy="250" r="80" fill="#F08A1E" opacity=".2"/><rect x="170" y="95" width="60" height="60" rx="14" fill="#1479B8"/><g fill="#fff"><circle cx="185" cy="110" r="5"/><circle cx="215" cy="110" r="5"/><circle cx="200" cy="125" r="5"/><circle cx="185" cy="140" r="5"/><circle cx="215" cy="140" r="5"/></g><text x="200" y="195" text-anchor="middle" font-family="Fredoka,Nunito,sans-serif" font-size="20" font-weight="700" fill="#1F3A63">${esc(label || 'Photo à venir')}</text></svg>`);
  const fixImg = (img) => { if (img.dataset.fixed) return; img.dataset.fixed = '1'; img.src = placeholder(img.dataset.placeholder || 'Photo à venir'); };
  document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') fixImg(e.target); }, true);
  $$('img').forEach((img) => { if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) fixImg(img); });

  /* ---------- Visionneuse ---------- */
  const lb = $('#lightbox');
  let lbItems = [], lbIndex = 0;
  const lbShow = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length; const it = lbItems[lbIndex];
    const img = $('img', lb); img.src = it.src; img.alt = it.alt || '';
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    $('figcaption', lb).innerHTML = (it.caption ? esc(it.caption) : '') + (it.pdf ? ` · <a href="${esc(it.pdf)}" download>Télécharger le PDF</a>` : '') + (it.src.match(/\.(png|jpe?g|webp)$/) ? ` · <a href="${esc(it.src)}" target="_blank" rel="noopener">Ouvrir en grand</a>` : '');
    $$('[data-lb-prev],[data-lb-next]', lb).forEach((b) => (b.hidden = lbItems.length < 2));
  };
  const openLightbox = (items, i = 0) => { if (!lb) return; lbItems = items; lbShow(i); lb.showModal(); };
  if (lb) {
    $('[data-close]', lb).addEventListener('click', () => lb.close());
    $('[data-lb-prev]', lb).addEventListener('click', () => lbShow(lbIndex - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => lbShow(lbIndex + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') lbShow(lbIndex - 1); if (e.key === 'ArrowRight') lbShow(lbIndex + 1); });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lightbox]'); if (!a || !lb) return;
    e.preventDefault();
    const group = a.dataset.lightbox; const all = group ? $$(`a[data-lightbox="${group}"]`) : [a];
    openLightbox(all.map((x) => ({ src: x.getAttribute('href'), alt: $('img', x)?.alt, caption: x.dataset.caption || $('img', x)?.alt, pdf: x.dataset.pdf })), all.indexOf(a));
  });

  /* ---------- Prochain rendez-vous ---------- */
  const describeNext = (e) => {
    if (!e) return null;
    if (e.ongoing && e.fin) return `En cours jusqu'au ${fmt(e.end, { day: 'numeric', month: 'long' })}`;
    return cap(fmt(e.start, { weekday: 'long', day: 'numeric', month: 'long' }));
  };
  if ($('[data-next-rdv]')) loadAgenda().then((a) => {
    const next = a.upcoming.find((e) => e.type !== 'defi') || a.upcoming[0];
    $$('[data-next-rdv]').forEach((el) => {
      if (!next) { el.textContent = 'Dates bientôt annoncées'; return; }
      el.textContent = el.dataset.nextRdv === 'short' ? fmtShort(next.start) : describeNext(next);
      const t = el.closest('[data-next-wrap]')?.querySelector('[data-next-title]'); if (t) t.textContent = next.titre;
    });
  }).catch(() => {});

  /* Prochaines dates de permanences (cartes) */
  $$('[data-next-dates]').forEach((box) => loadAgenda().then((a) => {
    const n = Number(box.dataset.nextDates) || 3;
    const list = a.upcoming.filter(isSalle).slice(0, n);
    box.innerHTML = list.length ? list.map((e) => `<a class="mini-date" href="agenda.html#${e.id}"><b>${fmtShort(e.start).replace(/^(\w+)\s/, (m, w) => cap(w) + ' ')}</b><span>${esc(e.titre)}</span></a>`).join('') : '<p class="small">Prochaines dates bientôt annoncées.</p>';
  }).catch(() => { box.innerHTML = '<p class="small"><a href="agenda.html">Voir l\'agenda</a></p>'; }));

  /* ---------- Cartes d'événements ---------- */
  const eventCard = (e, isNext) => {
    const d = e.start;
    const range = e.fin ? `Du ${fmt(e.start, { day: 'numeric', month: 'long' })} au ${fmtLong(e.end)}` : cap(fmtLong(d));
    const meta = [range, e.horaires, e.lieu].filter(Boolean).join(' · ');
    return `<article class="event-card ev-${e.type}${isNext ? ' is-next' : ''}" id="${e.id}">
      <div class="event-date"><span class="dw">${fmt(d, { weekday: 'short' }).replace('.', '')}</span><span class="d">${d.getDate()}</span><span class="m">${fmt(d, { month: 'short' }).replace('.', '')}${d.getFullYear() !== today.getFullYear() ? ' ' + String(d.getFullYear()).slice(2) : ''}</span></div>
      <div class="event-body"><span class="event-type">${TYPES[e.type] || 'Rendez-vous'}</span>${isNext ? '<span class="badge-next">Prochain RDV</span>' : ''}${e.ongoing && e.fin ? '<span class="badge-next">En cours</span>' : ''}
        <h3>${esc(e.titre)}</h3><p>${esc(meta)}</p>${e.description ? `<p>${esc(e.description)}</p>` : ''}</div></article>`;
  };

  /* Liste « À venir » + archives */
  const list = $('[data-agenda-list]');
  if (list) loadAgenda().then((a) => {
    const next = a.upcoming.find((e) => e.type !== 'defi');
    list.innerHTML = a.upcoming.length ? a.upcoming.map((e) => eventCard(e, e === next)).join('') : '<p>Le prochain programme arrive très vite. Suivez-nous sur Facebook !</p>';
    if (next) { const el = document.getElementById(next.id); const anchor = $('#prochain-rendez-vous'); if (anchor && el) el.before(anchor); }
    const arch = $('[data-agenda-archives]');
    if (arch) { arch.innerHTML = a.past.slice().reverse().map((e) => eventCard(e)).join('') || '<p>Aucune archive pour le moment.</p>'; const c = $('[data-archives-count]'); if (c) c.textContent = a.past.length; }
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView({ block: 'start' }), 60); }
  }).catch(() => { list.innerHTML = '<p>Impossible de charger l\'agenda pour le moment.</p>'; });

  /* Calendrier mensuel */
  const cal = $('[data-calendar]');
  if (cal) loadAgenda().then((a) => {
    const byDay = new Map();
    a.evs.forEach((e) => {
      if (e.fin) { for (let d = new Date(e.start); d <= e.end; d.setDate(d.getDate() + 1)) { const k = d.toDateString(); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push({ ...e, range: true }); } }
      else { const k = e.start.toDateString(); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(e); }
    });
    const first = a.upcoming[0]?.start || today;
    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    if (a.upcoming.length && today >= a.evs[0].start) view = new Date(today.getFullYear(), today.getMonth(), 1);
    const title = $('[data-cal-title]', cal), grid = $('[data-cal-grid]', cal), detail = $('[data-cal-detail]', cal);
    const showDetail = (k) => {
      const evs = byDay.get(k) || [];
      detail.innerHTML = evs.length ? evs.map((e) => eventCard(e)).join('') : '';
      $$('.cal-day.is-selected', grid).forEach((b) => b.classList.remove('is-selected'));
      $(`[data-key="${CSS.escape(k)}"]`, grid)?.classList.add('is-selected');
    };
    const draw = () => {
      title.textContent = fmt(view, { month: 'long', year: 'numeric' });
      const start = new Date(view); const offset = (start.getDay() + 6) % 7; start.setDate(1 - offset);
      let html = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map((d) => `<div class="cal-dow" aria-hidden="true">${d}</div>`).join('');
      for (let i = 0; i < 42; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const k = d.toDateString(); const evs = byDay.get(k) || [];
        const single = evs.find((e) => !e.range); const ranged = evs.find((e) => e.range);
        const cls = ['cal-day', d.getMonth() !== view.getMonth() ? 'is-out' : '', +d === +today ? 'is-today' : '', d < today ? 'is-past' : '', single ? `has-event ev-${single.type}` : '', ranged ? 'ev-defi-range' : '', ranged && !single && (+d === +ranged.start || +d === +ranged.end) ? 'has-event ev-defi' : ''].filter(Boolean).join(' ');
        const label = fmtLong(d) + (evs.length ? ' : ' + evs.map((e) => e.titre).join(', ') : '');
        html += evs.length ? `<button type="button" class="${cls}" data-key="${k}" aria-label="${esc(label)}">${d.getDate()}</button>` : `<span class="${cls}" aria-hidden="true">${d.getDate()}</span>`;
        if (i === 34 && d.getMonth() !== view.getMonth()) break;
      }
      grid.innerHTML = html;
      const firstEv = [...byDay.keys()].map((k) => new Date(k)).filter((d) => d.getMonth() === view.getMonth() && d.getFullYear() === view.getFullYear() && d >= today).sort((x, y) => x - y)[0];
      detail.innerHTML = '<p class="small muted">Cliquez sur un jour coloré pour voir le détail du rendez-vous.</p>';
      if (firstEv) showDetail(firstEv.toDateString());
    };
    grid.addEventListener('click', (e) => { const b = e.target.closest('button[data-key]'); if (b) showDetail(b.dataset.key); });
    $('[data-cal-prev]', cal).addEventListener('click', () => { view.setMonth(view.getMonth() - 1); draw(); });
    $('[data-cal-next]', cal).addEventListener('click', () => { view.setMonth(view.getMonth() + 1); draw(); });
    draw();
  }).catch(() => {});

  /* ---------- Témoignages ---------- */
  const tBox = $('[data-temoignages]');
  if (tBox) getJSON('temoignages').then(({ temoignages: list }) => {
    if (!list.length) return;
    const track = $('.t-track', tBox), dots = $('.t-dots', tBox), bar = $('.t-progress span', tBox);
    track.innerHTML = list.map((t, i) => `<div class="t-slide" role="group" aria-roledescription="témoignage" aria-label="${i + 1} sur ${list.length}"${i ? ' aria-hidden="true"' : ''}><blockquote>${esc(t.texte)}</blockquote>
      <div class="t-author"><span class="t-avatar" aria-hidden="true">${esc(t.prenom.charAt(0))}</span><div><strong>${esc(t.prenom)}</strong><span>${esc([t.qualite, t.contexte].filter(Boolean).join(', '))}</span></div></div></div>`).join('');
    dots.innerHTML = list.map((t, i) => `<button type="button" class="t-dot" aria-label="Témoignage ${i + 1} : ${esc(t.prenom)}"${i ? '' : ' aria-current="true"'}></button>`).join('');
    let i = 0, timer = null, paused = false; const DELAY = 7000;
    const go = (n) => {
      i = (n + list.length) % list.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      $$('.t-slide', track).forEach((s, k) => s.setAttribute('aria-hidden', String(k !== i)));
      $$('.t-dot', dots).forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      restart();
    };
    const restart = () => {
      clearTimeout(timer); if (reduced || paused) { if (bar) bar.style.width = '0'; return; }
      if (bar) { bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth; bar.style.transition = `width ${DELAY}ms linear`; bar.style.width = '100%'; }
      timer = setTimeout(() => go(i + 1), DELAY);
    };
    const pause = (p) => { paused = p; if (p) { clearTimeout(timer); if (bar) { bar.style.transition = 'none'; bar.style.width = getComputedStyle(bar).width; } } else restart(); };
    $('[data-t-prev]', tBox).addEventListener('click', () => go(i - 1));
    $('[data-t-next]', tBox).addEventListener('click', () => go(i + 1));
    dots.addEventListener('click', (e) => { const d = e.target.closest('.t-dot'); if (d) go($$('.t-dot', dots).indexOf(d)); });
    tBox.addEventListener('mouseenter', () => pause(true)); tBox.addEventListener('mouseleave', () => pause(false));
    tBox.addEventListener('focusin', () => pause(true)); tBox.addEventListener('focusout', () => pause(false));
    let sx = null; track.addEventListener('pointerdown', (e) => (sx = e.clientX)); track.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(i + (e.clientX < sx ? 1 : -1)); sx = null; });
    restart();
  }).catch(() => {});

  /* ---------- Carte du monde ---------- */
  let svgP;
  const loadSvg = () => (svgP ||= fetch('images/carte-monde.svg').then((r) => r.text()));
  const CONT_COLORS = { 'Amérique du Sud': '#D22E35', Afrique: '#F08A1E', Europe: '#1479B8' };
  const pinSVG = (x, y, s, color) => `<g class="pin" style="animation-delay:var(--pd)"><circle class="pin-pulse" cx="${x}" cy="${y}" r="${3 * s}" fill="${color}" opacity=".5"/><path d="M${x} ${y} c${-1.2 * s} ${-2.2 * s} ${-4.2 * s} ${-4.6 * s} ${-4.2 * s} ${-7.4 * s} a${4.2 * s} ${4.2 * s} 0 1 1 ${8.4 * s} 0 c0 ${2.8 * s} ${-3 * s} ${5.2 * s} ${-4.2 * s} ${7.4 * s}z" fill="${color}" stroke="#fff" stroke-width="${0.9 * s}"/><circle cx="${x}" cy="${y - 7.4 * s}" r="${1.6 * s}" fill="#fff"/></g>`;
  async function playWorld(box) {
    if (box.dataset.played) return; box.dataset.played = '1';
    const [svgText, { pays }] = await Promise.all([loadSvg(), getJSON('pays')]);
    const holder = $('.world-holder', box); holder.innerHTML = svgText;
    const svg = $('svg', holder);
    const zoom = $('.zoom-europe', box);
    zoom.insertAdjacentHTML('afterbegin', svgText); const zsvg = $('svg', zoom);
    zsvg.setAttribute('viewBox', '452 104 132 132'); zsvg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const pinsG = $('.pins', svg), zpinsG = $('.pins', zsvg);
    // Point de départ : Saint-Vincent-de-Tyrosse
    const home = [496.8, 156.4];
    box.classList.add('is-drawn');
    const legend = (iso) => $(`li[data-iso="${iso}"]`, box);
    const counter = $('[data-world-count]', box);
    let n = 0; if (counter && !reduced) counter.textContent = '0';
    const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
    await wait(1100);
    pinsG.insertAdjacentHTML('beforeend', `<circle class="home-pin" cx="${home[0]}" cy="${home[1]}" r="2.6" stroke="#fff" stroke-width=".8"/>`);
    for (const p of pays) {
      const c = $(`#c-${p.iso}`, svg); const zc = $(`#c-${p.iso}`, zsvg);
      const color = CONT_COLORS[p.continent] || '#8FB43A';
      if (c) {
        c.style.setProperty('--cf', color); c.classList.add('on');
        const x = +c.dataset.cx, y = +c.dataset.cy;
        if (p.continent !== 'Europe') {
          const mx = (home[0] + x) / 2, my = Math.min(home[1], y) - Math.abs(home[0] - x) * 0.25;
          pinsG.insertAdjacentHTML('afterbegin', `<path class="route" d="M${home[0]} ${home[1]} Q${mx} ${my} ${x} ${y}"/>`);
        }
        pinsG.insertAdjacentHTML('beforeend', pinSVG(x, y, p.continent === 'Europe' ? 1 : 1.6, color));
        if (zc) { zc.style.setProperty('--cf', color); zc.classList.add('on'); zpinsG.insertAdjacentHTML('beforeend', pinSVG(+zc.dataset.cx, +zc.dataset.cy, 0.75, color)); }
      }
      legend(p.iso)?.classList.add('on');
      if (counter) counter.textContent = String(++n);
      if (p.continent === 'Europe') zoom.classList.add('is-in');
      await wait(420);
    }
  }
  $$('[data-world-map]').forEach((box) => {
    if (box.hasAttribute('data-autoplay')) { box.setAttribute('data-observe', ''); box.addEventListener('reveal', () => playWorld(box), { once: true }); observe(box); }
  });
  const mondeDlg = $('#monde-dialog');
  if (mondeDlg) {
    $$('[data-open-monde]').forEach((b) => b.addEventListener('click', () => { mondeDlg.showModal(); playWorld($('[data-world-map]', mondeDlg)); }));
    $('[data-close]', mondeDlg).addEventListener('click', () => mondeDlg.close());
    mondeDlg.addEventListener('click', (e) => { if (e.target === mondeDlg) mondeDlg.close(); });
  }

  /* ---------- Jauge du défi ---------- */
  $$('[data-defi]').forEach((box) => getJSON('defi').then((d) => {
    const kg = Math.max(0, Number(d.kgRecoltes) || 0), goal = Number(d.objectifKg) || 300;
    const pct = Math.min(100, (kg / goal) * 100);
    const fill = $('.gauge-fill', box), label = $('.gauge-label', box), maj = $('[data-defi-maj]', box);
    $$('[data-defi-goal]', box).forEach((e) => (e.textContent = goal));
    label.textContent = `${kg.toLocaleString('fr-FR')} kg récoltés sur ${goal} kg`;
    if (maj) maj.textContent = d.miseAJour ? `Mise à jour : ${d.miseAJour}` : 'Le compteur sera mis à jour au fil de la récolte.';
    fill.classList.toggle('is-empty', kg === 0);
    box.setAttribute('data-observe', '');
    box.addEventListener('reveal', () => { fill.style.width = pct + '%'; }, { once: true });
    $('.gauge', box).setAttribute('aria-valuenow', String(kg)); $('.gauge', box).setAttribute('aria-valuemax', String(goal));
    observe(box);
  }).catch(() => {}));

  /* ---------- Galerie ---------- */
  const gal = $('[data-galerie]');
  if (gal) getJSON('galerie').then(({ photos }) => {
    const CATS = { permanences: ['Permanences', '#E6F1F7'], animations: ['Animations', '#FBE3E1'], 'grands-jeux': ['Grands jeux en bois', '#FDEBD3'], collecte: ['Collecte', '#EEF5DC'], monde: ['Dans le monde', '#EAF3F7'] };
    const ARS = ['1', '4/5', '4/3', '3/4', '1', '5/4'];
    let html = photos.map((p, i) => `<a class="m-item reveal" data-cat="${esc(p.categorie)}" href="${esc(p.src)}" data-lightbox="galerie" data-caption="${esc(p.legende || p.alt || '')}"><img src="${esc(p.src)}" alt="${esc(p.alt || '')}" loading="lazy"></a>`).join('');
    const cats = Object.keys(CATS); const have = new Set(photos.map((p) => p.categorie));
    let k = 0;
    cats.forEach((c) => { if (have.has(c)) return; for (let j = 0; j < 3; j++) html += `<div class="m-item m-placeholder reveal" data-cat="${c}" style="--ph:${CATS[c][1]};--ar:${ARS[k++ % ARS.length]}"><div><svg viewBox="0 0 24 24" fill="none" stroke="#1F3A63" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.6"/><path d="M8.5 5l1.5-2h4l1.5 2"/></svg><strong>Photos bientôt en ligne</strong><small>${CATS[c][0]}</small></div></div>`; });
    gal.innerHTML = html; observeAll(gal);
    $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filter;
      $$('.m-item', gal).forEach((it) => it.classList.toggle('is-hidden', f !== 'tout' && it.dataset.cat !== f));
      $$('.m-item', gal).forEach((it) => { if (!it.classList.contains('is-hidden')) it.classList.add('is-in'); });
    }));
  }).catch(() => {});

  /* ---------- Affiches (vignettes cliquables) ---------- */
  $$('[data-affiches]').forEach((box) => getJSON('affiches').then(({ affiches }) => {
    box.innerHTML = affiches.map((a) => `<a class="poster reveal" href="${esc(a.image)}" data-lightbox="affiches" data-caption="${esc(a.titre)}"><img src="${esc(a.vignette || a.image)}" alt="Affiche : ${esc(a.titre)}" loading="lazy" width="520" height="780"><span>${esc(a.titre)}</span></a>`).join('');
    observeAll(box);
  }).catch(() => {}));

  /* ---------- Onglets ---------- */
  $$('[data-tabs]').forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); p.hidden = !on; if (on) { p.classList.remove('is-anim'); void p.offsetWidth; p.classList.add('is-anim'); } });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); } if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- Formulaires ---------- */
  const params = new URLSearchParams(location.search);
  const sujet = params.get('sujet');
  const sel = $('select[name="sujet"]');
  if (sel && sujet) { const o = [...sel.options].find((x) => x.value === sujet || x.dataset.slug === sujet); if (o) { sel.value = o.value; } }
  $$('form[data-games-form]').forEach((form) => {
    const hidden = $('input[name="jeux_souhaites"]', form); const counter = $('[data-games-count]', form);
    const sync = () => { const v = $$('input[data-game]:checked', form).map((c) => c.value); hidden.value = v.join(' ; '); if (counter) counter.textContent = v.length ? `${v.length} jeu${v.length > 1 ? 'x' : ''} sélectionné${v.length > 1 ? 's' : ''}` : 'Aucun jeu sélectionné'; };
    form.addEventListener('change', sync); sync();
    const pre = params.get('jeu'); if (pre) { const c = $$('input[data-game]', form).find((x) => x.value.startsWith(pre + '.')); if (c) { c.checked = true; sync(); } }
  });

  /* ---------- Carte des lieux (Leaflet, chargée à la demande) ---------- */
  const maps = $$('[data-lieux-map]');
  if (maps.length) {
    const loadLeaflet = () => new Promise((res, rej) => { if (window.L) return res(); const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'js/vendor/leaflet.css'; document.head.append(css); const s = document.createElement('script'); s.src = 'js/vendor/leaflet.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
    const pinIcon = (color, label) => window.L.divIcon({ className: 'gdc-pin', iconSize: [34, 44], iconAnchor: [17, 42], popupAnchor: [0, -38], html: `<svg viewBox="0 0 34 44" aria-hidden="true"><path d="M17 43C14 37 3 28 3 17a14 14 0 0 1 28 0c0 11-11 20-14 26z" fill="${color}" stroke="#fff" stroke-width="2.5"/><text x="17" y="22" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="14" fill="#fff">${label}</text></svg>` });
    maps.forEach((el) => {
      el.setAttribute('data-observe', '');
      el.addEventListener('reveal', async () => {
        try {
          await loadLeaflet();
          const L = window.L;
          const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
          const fb = $('.map-fallback', el); if (fb) fb.remove();
          if (el.dataset.lieuxMap === 'siege') {
            const m = L.marker([43.6603, -1.3058], { icon: pinIcon('#D22E35', '★') }).addTo(map);
            m.bindPopup('<strong>Saint-Vincent-de-Tyrosse</strong><br>Siège : Pôle SEVA, 21 place Plaisance<br>Permanences : salle Tourren, 2 rue du Grand Tourren').openPopup();
            map.setView([43.6603, -1.3058], 14);
          } else {
            const { communes } = await getJSON('lieux-recolte');
            const pts = communes.map((c, i) => { L.marker([c.lat, c.lng], { icon: pinIcon(i === 0 ? '#D22E35' : '#F08A1E', i + 1), title: c.commune }).addTo(map).bindPopup(`<strong>${esc(c.commune)}</strong><br>${c.lieux.map(esc).join('<br>')}`); return [c.lat, c.lng]; });
            map.fitBounds(pts, { padding: [40, 40] });
          }
        } catch (err) { /* la liste reste disponible */ }
      }, { once: true });
      observe(el);
    });
  }

  /* Année courante */
  $$('[data-year]').forEach((e) => (e.textContent = today.getFullYear()));
})();
