(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getJSON = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
  const fr = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  const dateBox = d => `<div class="datebox" aria-hidden="true"><b>${d.getDate()}</b><span>${MOIS[d.getMonth()]}</span></div>`;

  /* ---- header / burger ---- */
  const header = $('.site-header'), toggle = $('.nav-toggle');
  const onScroll = () => header.classList.toggle('solid', scrollY > 40 || !document.body.classList.contains('has-hero'));
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('has-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('has-open')) toggle.click(); });
  $$('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('has-open')));

  /* ---- reveal ---- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  const watch = () => $$('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  watch();

  /* ---- counters ---- */
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = to.toLocaleString('fr-FR'); return; }
    const t0 = performance.now(), dur = 1800;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('fr-FR'); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 }) : null;
  $$('[data-count]').forEach(el => cio ? cio.observe(el) : (el.textContent = (+el.dataset.count).toLocaleString('fr-FR')));
  const yr = new Date().getFullYear();
  $$('[data-years-since]').forEach(el => el.dataset.count = yr - +el.dataset.yearsSince);

  /* ---- compare slider ---- */
  $$('.compare').forEach(c => {
    const r = $('input', c), set = () => c.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set); set();
  });

  /* ---- next occurrence of recurring events ---- */
  const nextOccurrence = ev => {
    const now = new Date(); now.setHours(0,0,0,0);
    if (ev.premierLundi) {
      for (let m = 0; m < 3; m++) {
        const d = new Date(now.getFullYear(), now.getMonth() + m, 1);
        while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
        if (d >= now) return d;
      }
    }
    const d = new Date(now); d.setDate(d.getDate() + ((ev.jourSemaine - d.getDay() + 7) % 7)); return d;
  };
  const fullDate = d => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const pages = {
    async home() {
      const [ev, news] = await Promise.all([getJSON('data/evenements.json'), getJSON('data/actualites.json')]);
      const all = [...ev.avenir.map(e => ({ ...e, d: new Date(e.date) })), ...ev.recurrents.map(e => ({ ...e, d: nextOccurrence(e) }))]
        .sort((a, b) => a.d - b.d);
      const n = all[0];
      $('#next-event').innerHTML = `<div class="wrap next"><div class="next-card">${dateBox(n.d)}
        <div><span class="chip">Prochain rendez-vous</span><h2 style="font-size:1.6rem;margin:.3rem 0">${esc(n.titre)}</h2>
        <p style="margin:0"><strong>${esc(fullDate(n.d))}</strong>, ${esc(n.heure)} · ${esc(n.lieu)}</p></div>
        <a class="btn ghost" href="conferences-expositions-sorties.html">Tous les rendez-vous</a></div></div>`;
      $('#home-news').innerHTML = news.slice(0, 3).map(a => `<article class="news reveal"><time datetime="${esc(a.date)}">${fr.format(new Date(a.date))}</time>
        <h3>${esc(a.titre)}</h3><p>${esc(a.texte)}</p></article>`).join('');
      watch();
    },
    async societe() {
      const b = await getJSON('data/bureau.json');
      $('#bureau').innerHTML = b.map(x => `<div class="card reveal"><span class="eyebrow">${esc(x.role)}</span>${x.noms.map(n => `<p style="margin:0;font:700 1.2rem var(--serif)">${esc(n)}</p>`).join('')}</div>`).join('');
      watch();
    },
    async histoire() {
      const [tl, pe, li, pr] = await Promise.all(['chronologie', 'periodes', 'lieux', 'personnages'].map(n => getJSON(`data/${n}.json`)));
      const rail = $('#tl-rail'), panel = $('#tl-panel'); let cur = 0;
      rail.innerHTML = tl.map((t, i) => `<button class="tl-dot" role="tab" id="tab${i}" aria-selected="${i === 0}" aria-controls="tl-panel" tabindex="${i === 0 ? 0 : -1}">${esc(t.annee)}</button>`).join('');
      const show = i => {
        cur = (i + tl.length) % tl.length; const t = tl[cur];
        $$('.tl-dot', rail).forEach((b, k) => { b.setAttribute('aria-selected', k === cur); b.tabIndex = k === cur ? 0 : -1; });
        panel.setAttribute('aria-labelledby', 'tab' + cur);
        panel.innerHTML = `<div class="tl-year">${esc(t.annee)}</div><div><h3>${esc(t.titre)}</h3><p>${esc(t.texte)}</p>
          <p class="tl-src">Source : <a href="${esc(t.lien)}" rel="noopener">${esc(t.source)}</a></p></div>`;
        $$('.tl-dot', rail)[cur].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      };
      rail.addEventListener('click', e => { const b = e.target.closest('.tl-dot'); if (b) show($$('.tl-dot', rail).indexOf(b)); });
      rail.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { show(cur + 1); $$('.tl-dot', rail)[cur].focus(); } if (e.key === 'ArrowLeft') { show(cur - 1); $$('.tl-dot', rail)[cur].focus(); } });
      $('#tl-prev').onclick = () => show(cur - 1); $('#tl-next').onclick = () => show(cur + 1);
      show(0);
      $('#periodes').innerHTML = pe.map(p => `<article class="card reveal"><span class="chip gres">${esc(p.dates)}</span><h3 style="margin-top:.6rem">${esc(p.titre)}</h3><p>${esc(p.texte)}</p>
        ${p.placeholder ? `<p class="placeholder">${esc(p.placeholder)}</p>` : ''}<p class="note">Source : ${esc(p.source)}</p></article>`).join('');
      $('#lieux').innerHTML = li.map(p => `<article class="card reveal"><h3>${esc(p.nom)}</h3><p>${esc(p.texte)}</p>${p.placeholder ? `<p class="placeholder">${esc(p.placeholder)}</p>` : ''}<p class="note">Source : ${esc(p.source)}</p></article>`).join('');
      $('#personnages').innerHTML = pr.map(p => `<article class="card reveal"><span class="chip blue">${esc(p.dates)}</span><h3 style="margin-top:.6rem">${esc(p.nom)}</h3><p>${esc(p.texte)}</p><p class="note">Source : ${esc(p.source)}</p></article>`).join('');
      watch();
    },
    async publications() {
      const list = await getJSON('data/publications.json'); const box = $('#pubs'); let f = 'all';
      const draw = () => {
        box.innerHTML = list.filter(p => f === 'all' || p.type === f).map(p => `<article class="card pub reveal in">
          ${p.couverture ? `<img src="${esc(p.couverture)}" alt="Couverture : ${esc(p.titre)}" loading="lazy" width="140" height="196">` : `<div class="nocover">${esc(p.titre)}</div>`}
          <div><span class="chip ${p.type === 'bulletin' ? '' : 'blue'}">${p.type === 'bulletin' ? 'Bulletin' : 'Ouvrage'}</span>
          <h3 style="margin-top:.5rem">${esc(p.titre)}</h3>
          <p class="note" style="margin-bottom:.4rem">${esc([p.auteur, p.annee].filter(Boolean).join(' · '))}</p>
          ${p.resume ? `<p>${esc(p.resume)}</p>` : `<p class="placeholder">Résumé à fournir par la société.</p>`}
          <p class="price">${p.statut === 'épuisé' ? 'Épuisé' : esc(p.prix)}</p>
          ${p.statut === 'épuisé' ? '' : `<a class="btn ghost" href="nous-rejoindre.html#contact?objet=${encodeURIComponent(p.titre)}" data-order="${esc(p.titre)}">Demander cet ouvrage</a>`}</div></article>`).join('');
        $$('[data-order]', box).forEach(a => a.href = 'nous-rejoindre.html?objet=' + encodeURIComponent('Commande : ' + a.dataset.order) + '#contact');
      };
      $$('.filters button').forEach(b => b.addEventListener('click', () => {
        f = b.dataset.f; $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw();
      }));
      draw();
    },
    async rendezvous() {
      const ev = await getJSON('data/evenements.json');
      const up = [...ev.avenir.map(e => ({ ...e, d: new Date(e.date), dt: fr.format(new Date(e.date)) })), ...ev.recurrents.map(e => ({ ...e, d: nextOccurrence(e), dt: fullDate(nextOccurrence(e)) + (e.premierLundi ? ' (1er lundi du mois)' : ' (chaque lundi)') }))].sort((a, b) => a.d - b.d);
      $('#upcoming').innerHTML = up.map(e => `<article class="ev reveal">${dateBox(e.d)}<div><span class="chip">${esc(e.type)}</span><h3 style="margin-top:.4rem">${esc(e.titre)}</h3>
        <p style="margin:0 0 .3rem"><strong>${esc(e.dt)}</strong> · ${esc(e.heure || '')} · ${esc(e.lieu)}</p><p style="margin:0">${esc(e.texte)}</p></div></article>`).join('')
        + (ev.avenir.length ? '' : `<p class="placeholder">Aucune conférence ni sortie datée n'est annoncée pour le moment : les dates seront ajoutées par la société dans le fichier data/evenements.json.</p>`);
      const draw = f => {
        $('#archives').innerHTML = ev.archives.filter(e => f === 'all' || e.type === f).sort((a, b) => b.date.localeCompare(a.date)).map(e => {
          const d = new Date(e.date);
          return `<article class="ev past reveal in">${dateBox(d)}<div><span class="chip gres">${esc(e.type)}</span><h3 style="margin-top:.4rem">${esc(e.titre)}</h3>
          <p style="margin:0 0 .3rem"><strong>${esc(e.dateTexte)}</strong> · ${esc(e.lieu)}</p><p style="margin:0">${esc(e.texte)}</p>
          ${e.lien ? `<p class="note" style="margin:.4rem 0 0">Source : <a href="${esc(e.lien)}" rel="noopener">${esc(e.source)}</a></p>` : ''}</div></article>`;
        }).join('');
      };
      $$('.filters button').forEach(b => b.addEventListener('click', () => {
        $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.f);
      }));
      draw('all'); watch();
    },
    async galerie() {
      const list = await getJSON('data/galerie.json'); const box = $('#gallery'); let cur = [], idx = 0;
      const dlg = $('#lightbox');
      const draw = f => {
        cur = list.filter(g => f === 'all' || g.theme === f);
        box.innerHTML = cur.map((g, i) => `<figure class="shot ${g.old ? 'old' : ''}"><button type="button" data-i="${i}" aria-label="Agrandir : ${esc(g.titre)}">
          <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></button>
          <figcaption><b>${esc(g.titre)}</b>Crédit : ${esc(g.credit)}</figcaption></figure>`).join('');
      };
      const open = i => {
        idx = (i + cur.length) % cur.length; const g = cur[idx];
        $('#lb-img').src = g.src; $('#lb-img').alt = g.alt;
        $('#lb-cap').innerHTML = `<strong>${esc(g.titre)}</strong><small>Crédit : ${esc(g.credit)} · ${esc(g.licence)}${g.lien ? ` · <a style="color:#fff" href="${esc(g.lien)}" rel="noopener">source</a>` : ''}</small>`;
        if (!dlg.open) dlg.showModal();
      };
      box.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) open(+b.dataset.i); });
      $('#lb-close').onclick = () => dlg.close(); $('#lb-prev').onclick = () => open(idx - 1); $('#lb-next').onclick = () => open(idx + 1);
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') open(idx - 1); if (e.key === 'ArrowRight') open(idx + 1); });
      $$('.filters button').forEach(b => b.addEventListener('click', () => {
        $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.f);
      }));
      draw('all');
    },
    async actualites() {
      const news = await getJSON('data/actualites.json');
      $('#news').innerHTML = news.sort((a, b) => b.date.localeCompare(a.date)).map(a => `<article class="news reveal"><time datetime="${esc(a.date)}">${fr.format(new Date(a.date))}</time>
        <h2 style="font-size:1.5rem;margin:0">${esc(a.titre)}</h2><p style="margin:0">${esc(a.texte)}</p>
        <p class="note" style="margin:0">Source : ${a.lien ? `<a href="${esc(a.lien)}" rel="noopener">${esc(a.source)}</a>` : esc(a.source)}</p></article>`).join('');
      watch();
    },
    async rejoindre() {
      const o = new URLSearchParams(location.search).get('objet');
      if (o) { const s = $('#objet'); s.value = 'Autre'; $('#message').value = o + '\n\n'; }
    }
  };
  const p = document.body.dataset.page;
  if (pages[p]) pages[p]().catch(err => console.error(err));
})();
