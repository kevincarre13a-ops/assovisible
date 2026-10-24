(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const json = f => fetch(`data/${f}.json`).then(r => r.json());
  const MONTHS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  const DAYS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const verify = t => t ? `<span class="verify" title="${esc(t)}">à vérifier</span>` : '';
  const hm = t => t ? t.replace(':', ' h ').replace(/ h 00$/, ' h') : '';
  const range = (s, e) => e ? `${hm(s)} – ${hm(e)}` : `à ${hm(s)}`;
  const dateChip = d => `<div class="date-chip"><span>${MONTHS[d.getMonth()]}</span><b>${d.getDate()}</b></div>`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const nextWeekday = (wd) => { const t = today(); t.setDate(t.getDate() + ((wd - t.getDay() + 7) % 7)); return t; };

  // ---- header / menu
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('solid', scrollY > 40 || !$('.hero'));
  onScroll(); addEventListener('scroll', onScroll, {passive: true});
  const burger = $('.burger');
  burger?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  $$('.menu a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); burger?.setAttribute('aria-expanded', 'false'); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });

  // ---- reveal on scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.dataset.count) count(e.target); }
  }), {threshold: .15}) : null;
  const watch = root => $$('.reveal,[data-count]', root).forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && count(el)));
  function count(el) {
    const end = +el.dataset.count, dur = 1600, t0 = performance.now();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = end.toLocaleString('fr-FR'); return; }
    const tick = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-FR'); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  // ---- renderers
  const R = {
    async counters(el) {
      const d = await json('counters');
      el.innerHTML = d.map(c => `<div class="counter reveal"><b><i data-count="${c.value}" aria-label="${c.value}">0</i>${esc(c.suffix)}</b><span>${esc(c.label)}${verify(c.verify)}</span></div>`).join('');
    },
    async activities(el) {
      const d = await json('activities'), full = el.dataset.mode === 'full';
      el.innerHTML = full ? d.map((a, i) => `
        <article class="split reveal ${i % 2 ? 'rev' : ''}" id="${esc(a.id)}">
          <img src="${esc(a.image)}" alt="" loading="lazy" width="800" height="520">
          <div>
            <div class="icon-badge" aria-hidden="true">${esc(a.icon)}</div>
            <h2>${esc(a.title)}</h2>
            <p class="lead">${esc(a.summary)}</p>
            <ul class="list-clean tick">${a.details.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            <p class="meta" style="margin-top:1rem"><strong>Quand :</strong> ${esc(a.when)}<br><strong>Où :</strong> ${esc(a.where)}${a.price ? `<br><strong>Tarif :</strong> ${esc(a.price)}` : ''}</p>
            <a class="btn btn-dark" href="${esc(a.cta.href)}" ${a.cta.external ? 'target="_blank" rel="noopener"' : ''}>${esc(a.cta.label)}</a>
          </div>
        </article>`).join('<hr style="border:0;border-top:1px solid var(--line);margin:3.5rem 0">')
      : [d[0], d[1], d[3]].map((a, i) => `
        <a class="card reveal" data-d="${i % 3}" href="activites.html#${esc(a.id)}" style="text-decoration:none;color:inherit">
          <div class="card-img"><img src="${esc(a.image)}" alt="" loading="lazy" width="600" height="375"></div>
          <div class="card-body"><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><span class="card-link">En savoir plus</span></div>
        </a>`).join('');
    },
    async news(el) {
      const d = (await json('news')).items, lim = +el.dataset.limit || d.length;
      el.innerHTML = d.slice(0, lim).map((n, i) => `
        <article class="card reveal" data-d="${i % 3}">
          <div class="card-img"><img src="${esc(n.image)}" alt="" loading="lazy" width="600" height="375"></div>
          <div class="card-body"><span class="tag">${esc(n.tag)}</span><h3>${esc(n.title)}</h3>
          <p class="meta">${esc(String(n.date).length > 7 ? parse(n.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : n.date)}</p>
          <p>${esc(n.text)} ${verify(n.verify)}</p></div>
        </article>`).join('');
    },
    async 'next-event'(el) {
      const d = await json('events'), t = today();
      const cands = [
        ...d.recurring.map(r => ({...r, d: nextWeekday(r.weekday)})),
        ...d.events.filter(e => parse(e.date_end || e.date) >= t).map(e => ({...e, d: parse(e.date) < t ? t : parse(e.date)}))
      ].sort((a, b) => a.d - b.d || (a.start > b.start ? 1 : -1));
      const e = cands[0];
      el.innerHTML = `<div class="next-card reveal">${dateChip(e.d)}<div><span class="eyebrow" style="margin:0">Prochain rendez-vous</span><h2>${esc(e.title)}</h2><p>${DAYS[e.d.getDay()]} ${e.d.getDate()} ${MONTHS[e.d.getMonth()]} · ${range(e.start, e.end)} · ${esc(e.place)}${e.free ? ' · entrée gratuite' : ''} ${verify(e.verify)}</p></div><a class="btn btn-dark" href="agenda.html">Tout l'agenda</a></div>`;
    },
    async agenda(el) {
      const d = await json('events'), t = today();
      const card = (e, past) => { const dt = parse(e.date); return `<article class="event reveal ${past ? 'past' : ''}">${dateChip(dt)}<div><h3>${esc(e.title)}</h3><p class="meta">${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}${e.date_end ? ` → ${parse(e.date_end).getDate()} ${MONTHS[parse(e.date_end).getMonth()]}` : ''} · ${range(e.start, e.end)} · ${esc(e.place)} ${verify(e.verify)}</p><p>${esc(e.text)}</p></div></article>`; };
      const up = d.events.filter(e => parse(e.date_end || e.date) >= t), past = d.events.filter(e => parse(e.date_end || e.date) < t).sort((a, b) => b.date.localeCompare(a.date));
      $('#rec').innerHTML = d.recurring.map(r => `<article class="event reveal"><div class="date-chip"><span>chaque</span><b style="font-size:1.25rem">${DAYS[r.weekday].slice(0, 3)}.</b></div><div><h3>${esc(r.title)}</h3><p class="meta">${DAYS[r.weekday]} · ${range(r.start, r.end)} · ${esc(r.place)}${r.free ? ' · entrée gratuite' : ''} ${verify(r.verify)}</p><p>${esc(r.text)}</p></div></article>`).join('');
      $('#up').innerHTML = up.length ? up.map(e => card(e, false)).join('') : '<p class="lead">Pas de date exceptionnelle annoncée pour l\'instant : les rendez-vous hebdomadaires ci-contre restent ouverts à tous.</p>';
      $('#past').innerHTML = past.length ? past.map(e => card(e, true)).join('') : '<p>Aucune archive pour l\'instant.</p>';
    },
    async partners(el) {
      const d = await json('partners');
      el.innerHTML = d.partners.map((p, i) => `<article class="card reveal" data-d="${i % 3}"><div class="card-body"><span class="tag">${esc(p.kind)}</span><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p>${p.url ? `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">Visiter le site</a>` : ''}</div></article>`).join('');
      $('#contrib').innerHTML = d.contributors.map(x => `<li>${esc(x)}</li>`).join('');
      $('#press').innerHTML = d.press.map(x => `<li><strong>${esc(x.name)}</strong> — ${esc(x.text)}</li>`).join('');
      $('#visitors').innerHTML = d.visitors.map(x => `<li>${esc(x)}</li>`).join('');
    },
    async team(el) {
      const d = await json('team');
      el.innerHTML = d.people.map((p, i) => `<article class="card person reveal" data-d="${i}"><img src="${esc(p.photo)}" alt="Portrait de ${esc(p.name)}" loading="lazy" width="500" height="625"><div class="card-body"><span class="tag">${esc(p.role)}</span><h3>${esc(p.name)}</h3><p>${esc(p.bio)}</p></div></article>`).join('')
        + `<article class="card reveal" data-d="2"><div class="card-body"><span class="tag">Bureau</span><h3>Le bureau de l'association</h3><ul class="list-clean">${d.office.map(o => `<li><strong>${esc(o.role)}</strong> : ${esc(o.name)} ${o.name.startsWith('À') ? verify('Nom à renseigner dans data/team.json') : ''}</li>`).join('')}</ul></div></article>`;
    },
    async gallery(el) {
      const d = await json('gallery'); let all = [];
      d.categories.forEach(c => c.photos.forEach(p => all.push({...p, cat: c.id})));
      const fl = $('#filters');
      fl.innerHTML = `<button class="chip" aria-pressed="true" data-cat="*">Toutes</button>` + d.categories.map(c => `<button class="chip" aria-pressed="false" data-cat="${esc(c.id)}">${esc(c.label)}</button>`).join('');
      let view = all;
      const draw = () => { el.innerHTML = view.map((p, i) => `<figure class="reveal"><button type="button" data-i="${i}" aria-label="Agrandir : ${esc(p.caption)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></button><figcaption>${esc(p.caption)}</figcaption></figure>`).join(''); watch(el); };
      fl.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip', fl).forEach(x => x.setAttribute('aria-pressed', x === b)); view = b.dataset.cat === '*' ? all : all.filter(p => p.cat === b.dataset.cat); draw(); });
      draw();
      const lb = $('#lightbox'), im = $('img', lb), cap = $('p', lb); let cur = 0;
      const show = i => { cur = (i + view.length) % view.length; im.src = view[cur].src; im.alt = view[cur].alt; cap.textContent = view[cur].caption; };
      el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; show(+b.dataset.i); lb.classList.add('open'); $('.lb-btn', lb).focus(); });
      lb.addEventListener('click', e => { if (e.target.closest('.lb-btn') || e.target === lb) lb.classList.remove('open'); if (e.target.closest('.lb-prev')) show(cur - 1); if (e.target.closest('.lb-next')) show(cur + 1); });
      addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lb.classList.remove('open'); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    }
  };
  Promise.all($$('[data-render]').map(el => R[el.dataset.render]?.(el).catch(() => { el.innerHTML = '<p class="notice">Contenu momentanément indisponible. Merci de réessayer.</p>'; }))).finally(() => watch(document));
})();
