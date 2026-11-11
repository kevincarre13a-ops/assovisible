/* Espace administrateur EOST : modification directe des pages (français et breton), photos, documents. */
(function () {
  'use strict';

  const PAGES = [
    { key: 'index', fr: 'Accueil', br: 'Degemer' },
    { key: 'association', fr: "L'association", br: 'Ar gevredigezh' },
    { key: 'activites', fr: 'Activités', br: 'Oberiantizoù' },
    { key: 'agenda', fr: 'Agenda', br: 'Deiziataer' },
    { key: 'galerie', fr: 'Galerie', br: 'Skeudennoù' },
    { key: 'actualites', fr: 'Actualités et ressources', br: 'Keleier ha danvezioù' },
    { key: 'adherer', fr: 'Adhérer / Contact', br: 'Emezelañ / Darempred' },
    { key: 'mentions-legales', fr: 'Mentions légales', br: 'Menegoù lezennel' },
    { key: 'merci', fr: 'Remerciement après envoi du formulaire', br: 'Trugarez goude kas ar follenn' },
  ];
  const app = document.getElementById('app');
  let editorActive = false, pendingCount = 0;
  const pageUrl = (lang, key) => (lang === 'br' ? '/br/' + (key === 'index' ? '' : key) : '/' + (key === 'index' ? '' : key));

  /* ---------- petits outils ---------- */
  function mk(doc, tag, props, ...kids) {
    const el = doc.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else if (v !== false && v != null) el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) { if (kid == null || kid === false) continue; el.append(kid.nodeType ? kid : doc.createTextNode(kid)); }
    return el;
  }
  const h = (tag, props, ...kids) => mk(document, tag, props, ...kids);

  async function api(action, body, silent) {
    const opts = body === undefined ? { method: 'GET', headers: { 'X-Requested-With': 'eost-admin' } }
      : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'eost-admin' }, body: JSON.stringify(body) };
    let r, j;
    try { r = await fetch('/.netlify/functions/admin-api?a=' + encodeURIComponent(action), { ...opts, credentials: 'same-origin' }); }
    catch { return { ok: false, error: "Pas de connexion à Internet. Vérifiez votre connexion puis réessayez." }; }
    try { j = await r.json(); } catch { j = { ok: false, error: 'Réponse inattendue du serveur.' }; }
    if (r.status === 401 && action !== 'login' && !silent) {
      if (editorActive) {
        modal('Votre connexion a expiré', h('div', {}, h('p', {}, 'Ne fermez pas cette page : vos modifications sont conservées ici.'), h('ol', { class: 'steps' }, h('li', {}, 'Cliquez sur « Me reconnecter » (cela s\'ouvre dans un nouvel onglet).'), h('li', {}, 'Connectez-vous, puis revenez sur cet onglet.'), h('li', {}, 'Cliquez de nouveau sur « Enregistrer ».'))), [{ id: 'ok', label: 'Fermer' }, { id: 'go', label: 'Me reconnecter', cls: 'main', run: () => { window.open('/admin/', '_blank', 'noopener'); return false; } }]);
      } else showLogin('Votre session a expiré. Merci de vous reconnecter.');
    }
    return j;
  }

  let toastEl = null, toastTimer = 0;
  function toast(msg, bad) {
    if (toastEl) toastEl.remove();
    toastEl = h('div', { class: 'toast' + (bad ? ' bad' : ''), role: 'status' }, msg);
    document.body.append(toastEl);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl && toastEl.remove(), bad ? 9000 : 5000);
  }

  const openModals = new Set();
  const closeModals = () => { [...openModals].forEach((c) => c(null)); };
  function modal(title, body, buttons) {
    return new Promise((resolve) => {
      const veil = h('div', { class: 'veil' });
      const esc = (e) => { if (e.key === 'Escape') close(null); };
      const close = (v) => { veil.remove(); document.removeEventListener('keydown', esc); openModals.delete(close); resolve(v); };
      openModals.add(close);
      document.addEventListener('keydown', esc);
      const row = h('div', { class: 'row end' }, buttons.map((b) => h('button', {
        class: 'btn ' + (b.cls || ''), type: 'button',
        onclick: async () => { if (b.run) { const r = await b.run(); if (r === false) return; close(r === undefined ? b.id : r); } else close(b.id); },
      }, b.label)));
      veil.append(h('div', { class: 'dlg', role: 'dialog', 'aria-modal': 'true' }, h('h2', {}, title), body, row));
      document.body.append(veil);
      const f = veil.querySelector('input,textarea,select'); if (f) f.focus();
    });
  }
  const confirmBox = (title, text, yes, danger) => modal(title, h('p', {}, text), [{ id: null, label: 'Non, annuler' }, { id: 'yes', label: yes, cls: danger ? 'danger' : 'main' }]).then((r) => r === 'yes');
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }); } catch { return iso || ''; } };
  const toB64 = (blob) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1]); fr.onerror = rej; fr.readAsDataURL(blob); });

  /* ---------- en-tête commun ---------- */
  const topBar = (right) => h('div', { class: 'top' }, h('img', { src: '/assets/logo-eost.png', alt: 'EOST' }), h('div', {}, h('b', {}, 'Espace administrateur'), h('br'), h('span', {}, 'Études Ouvertes sur Telgruc')), h('div', { style: 'margin-left:auto' }, right));

  /* ---------- connexion ---------- */
  function showLogin(message) {
    const err = h('div', { class: 'err', hidden: !message, role: 'alert' }, message || '');
    const user = h('input', { type: 'text', id: 'user', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false' });
    const pass = h('input', { type: 'password', id: 'pass', autocomplete: 'current-password' });
    const show = h('input', { type: 'checkbox', id: 'show', onchange: () => { pass.type = show.checked ? 'text' : 'password'; }, style: 'width:auto;margin-right:8px;transform:scale(1.4)' });
    const go = h('button', { class: 'btn main', type: 'submit', style: 'width:100%;margin-top:22px' }, 'Entrer');
    const form = h('form', {
      onsubmit: async (e) => {
        e.preventDefault(); go.disabled = true; err.hidden = true;
        const r = await api('login', { user: user.value, password: pass.value });
        go.disabled = false;
        if (r.ok) showHome(); else { err.textContent = r.error || 'Connexion impossible.'; err.hidden = false; pass.value = ''; pass.focus(); }
      },
    },
      h('label', { for: 'user' }, 'Identifiant'), user,
      h('label', { for: 'pass' }, 'Mot de passe'), pass,
      h('label', { for: 'show', style: 'font-weight:400;margin-top:10px' }, show, 'Afficher le mot de passe'),
      err, go);
    app.replaceChildren(h('div', { class: 'login' },
      h('div', { style: 'text-align:center' }, h('img', { src: '/assets/logo-eost.png', alt: 'Logo EOST', style: 'height:90px' })),
      h('div', { class: 'card' }, h('h1', {}, 'Espace administrateur'), h('p', {}, 'Entrez votre identifiant et votre mot de passe pour modifier le site.'), form),
      h('p', { class: 'muted', style: 'text-align:center' }, h('a', { href: '/' }, '← Retourner sur le site'))));
    user.focus();
  }

  /* ---------- menu principal ---------- */
  async function showHome() {
    editorActive = false;
    const me = await api('me');
    if (!me.ok) return;
    const pg = await api('pages');
    const mod = {}, drf = {};
    (pg.pages || []).forEach((p) => { mod[p.lang + ':' + p.key] = p.modified; drf[p.lang + ':' + p.key] = p.draft; });
    const pending = (pg.pages || []).filter((p) => p.draft);
    const footersPending = Object.keys(pg.footers || {});
    const nb = pending.length;
    pendingCount = nb + footersPending.length;
    const tiles = (lang) => PAGES.map((p) => {
      const k = lang + ':' + p.key;
      return h('button', { class: 'tile', type: 'button', onclick: () => openEditor(lang, p.key) },
        h('span', {}, p[lang]),
        h('small', {}, drf[k] ? 'Enregistrée, pas encore en ligne' : mod[k] ? 'Modifiée le ' + fmtDate(mod[k]).split(' à')[0].split(',')[0] : 'Version d\'origine'),
        drf[k] ? h('span', { class: 'pill wait' }, 'à mettre en ligne') : mod[k] ? h('span', { class: 'pill' }, 'en ligne') : null);
    });
    const names = pending.map((p) => h('li', {}, h('b', {}, p.name), ' (' + (p.lang === 'br' ? 'breton' : 'français') + ') ',
      h('a', { href: pageUrl(p.lang, p.key) + '?draft=1', target: '_blank', rel: 'noopener' }, 'voir'), ' · ',
      h('a', { href: '#', onclick: async (e) => { e.preventDefault();
        if (!(await confirmBox('Abandonner les changements de cette page ?', 'Les modifications enregistrées de cette page (pas encore en ligne) seront effacées. Le site en ligne ne change pas.', 'Oui, abandonner', true))) return;
        const r = await api('discard', { lang: p.lang, page: p.key }); if (r.ok) { toast('Changements abandonnés.'); showHome(); } else toast(r.error, true); } }, 'abandonner')));
    footersPending.forEach((l) => names.push(h('li', {}, h('b', {}, 'Pied de page'), ' (' + (l === 'br' ? 'breton' : 'français') + ')')));
    const publishBox = pendingCount
      ? h('div', { class: 'publish wait' },
        h('h2', {}, '⚠ Modifications enregistrées, pas encore en ligne'),
        h('p', {}, 'Les visiteurs ne voient encore rien de ce que vous avez fait. Quand vous avez ', h('b', {}, 'terminé toutes vos pages'), ' (français et breton), faites la mise en ligne ', h('b', {}, 'une seule fois'), '.'),
        h('ul', {}, names),
        h('button', { class: 'btn main big', type: 'button', onclick: publish }, '🌐 Mettre le site en ligne'),
        h('p', { class: 'muted', style: 'margin-top:12px' }, 'Ne mettez pas en ligne page par page : cela peut provoquer des erreurs sur le site. Une seule mise en ligne, à la fin.'))
      : h('div', { class: 'publish ok' }, h('b', {}, '✔ Le site est à jour.'), ' Aucune modification en attente. Quand vous modifiez et enregistrez des pages, elles restent en attente ici jusqu\'à la mise en ligne.');
    app.replaceChildren(topBar(h('button', { class: 'btn small', onclick: logout }, 'Se déconnecter')),
      h('div', { class: 'wrap' },
        h('h1', {}, 'Bonjour ! Que voulez-vous modifier ?'),
        h('p', {}, 'Choisissez une page. Vous pourrez cliquer directement sur les textes et les photos pour les changer. ', h('b', {}, 'Vos changements ne sont visibles des visiteurs qu\'après la mise en ligne finale.')),
        publishBox,
        h('h2', {}, 'Pages en français'), h('div', { class: 'grid' }, tiles('fr')),
        h('h2', {}, 'Pages en breton (Brezhoneg)'), h('div', { class: 'grid' }, tiles('br')),
        h('h2', {}, 'Autres'),
        h('div', { class: 'grid' },
          h('button', { class: 'tile', type: 'button', onclick: showHelp }, 'Aide', h('small', {}, 'Comment faire ?')),
          h('a', { class: 'tile', href: '/', target: '_blank', rel: 'noopener' }, 'Voir le site en ligne', h('small', {}, 'S\'ouvre dans un nouvel onglet'))),
        h('p', { class: 'muted', style: 'margin-top:36px' }, 'Vous ne pouvez pas ajouter ou supprimer de page, ni changer la mise en page : le reste du site est modifiable.')));
  }
  async function publish() {
    const go = await confirmBox('Mettre le site en ligne ?',
      'Avez-vous terminé TOUTES vos modifications, en français et en breton ? La mise en ligne se fait en une seule fois, quand tout est fini. Ne la refaites pas page par page : cela peut provoquer des erreurs sur le site. Vous pouvez d\'abord vérifier chaque page avec « voir ».',
      'Oui, tout est terminé : mettre en ligne');
    if (!go) return;
    const r = await api('publish', {});
    if (r.ok) {
      pendingCount = 0;
      await modal('✔ Le site est en ligne', h('div', {}, h('p', {}, r.published + ' élément' + (r.published > 1 ? 's' : '') + ' mis en ligne en une seule fois.'), h('p', {}, 'Les visiteurs voient maintenant vos modifications.')), [{ id: 'ok', label: 'Très bien', cls: 'main' }]);
      showHome();
    } else toast(r.error || 'La mise en ligne a échoué. Rien n\'est perdu : réessayez.', true);
  }
  async function logout() {
    if (pendingCount) {
      const r = await modal('Des modifications ne sont pas en ligne', h('div', {}, h('p', {}, 'Vous avez des pages enregistrées mais pas encore mises en ligne. Elles sont conservées, mais les visiteurs ne les verront qu\'après la mise en ligne.')), [{ id: 'stay', label: 'Retourner au menu', cls: 'main' }, { id: 'out', label: 'Me déconnecter quand même' }]);
      if (r !== 'out') return;
    }
    await api('logout', {}); showLogin();
  }

  /* ---------- aide ---------- */
  function helpBody() {
    return h('div', {},
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, 'Changer un texte : '), 'cliquez dessus et écrivez. Les textes modifiables sont entourés de pointillés bleus.'),
        h('li', {}, h('b', {}, 'Changer une photo : '), 'cliquez sur la photo, puis « Choisir une photo sur mon ordinateur ».'),
        h('li', {}, h('b', {}, 'Ajouter un élément (un événement, une photo, un livre…) : '), 'cliquez dans un élément existant : une barre noire apparaît au-dessus. Choisissez « Ajouter un autre comme celui-ci », puis modifiez la copie.'),
        h('li', {}, h('b', {}, 'Supprimer, monter ou descendre un élément : '), 'utilisez la même barre noire.'),
        h('li', {}, h('b', {}, 'Changer un lien ou un document à télécharger : '), 'cliquez sur le bouton ou le lien, puis sur « Modifier le lien ».'),
        h('li', {}, h('b', {}, 'Enregistrer : '), 'cliquez sur le grand bouton vert « Enregistrer » à chaque page terminée. Vos changements sont gardés, mais les visiteurs ne les voient pas encore.'),
        h('li', {}, h('b', {}, 'Mettre en ligne (une seule fois) : '), 'quand TOUTES vos pages sont terminées (français et breton), retournez au menu et cliquez sur « Mettre le site en ligne ». Ne le faites pas page par page : cela peut provoquer des erreurs sur le site.'),
        h('li', {}, h('b', {}, 'Vous vous êtes trompé ? '), '« Anciennes versions » permet de revenir en arrière. « Annuler la dernière action » défait le dernier déplacement, ajout ou suppression.')),
      h('p', { class: 'muted' }, 'Le pied de page (en bas de chaque page, avec les coordonnées) est commun à toutes les pages d\'une même langue : si vous le modifiez, le changement s\'applique à toutes les pages.'));
  }
  function showHelp() {
    editorActive = false;
    app.replaceChildren(topBar(h('button', { class: 'btn small', onclick: showHome }, '← Retour au menu')), h('div', { class: 'wrap' }, h('h1', {}, 'Aide'), h('div', { class: 'card' }, helpBody())));
  }

  /* ---------- éditeur ---------- */
  const BLOCK_SEL = '.card, .ev, .book, .tl > li, .gal figure, .stats > div, .trad-note, .next';
  const SINGLE_SEL = '.trad-note, .next';
  const INLINE = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'SPAN', 'SMALL', 'BR', 'SUP', 'SUB', 'U', 'CODE']);
  const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'FORM', 'IFRAME', 'BUTTON', 'SELECT', 'OPTION', 'TEXTAREA', 'INPUT', 'IMG', 'FIGURE', 'LABEL', 'NAV']);

  const EDIT_CSS = `
  html.eost-on .rv{opacity:1!important;transform:none!important}
  html.eost-on *{animation:none!important;transition:none!important}
  html.eost-on .site-header{position:absolute!important;background:#082a44!important}
  html.eost-on{scroll-behavior:auto!important}
  [data-eost-t]{outline:2px dashed rgba(26,111,212,.4);outline-offset:3px;cursor:text;min-height:1em}
  [data-eost-t]:hover{outline-color:rgba(26,111,212,.9);background-color:rgba(255,235,59,.22)}
  [data-eost-t]:focus{outline:3px solid #1a6fd4;background-color:rgba(255,235,59,.3)}
  img.eost-img{cursor:pointer;outline:2px dashed rgba(26,111,212,.55);outline-offset:-2px}
  img.eost-img:hover{outline:3px solid #1a6fd4}
  .eost-active{outline:4px solid #2e7d32!important;outline-offset:6px;border-radius:12px}
  .eost-bar{position:absolute;z-index:99999;display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#111;padding:6px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.45);font:700 15px system-ui,sans-serif;max-width:96vw}
  .eost-bar button,.eost-bar select{font:700 15px system-ui,sans-serif;min-height:42px;border:0;border-radius:9px;padding:6px 12px;background:#fff;color:#111;cursor:pointer}
  .eost-bar button:hover{background:#ffe97a}.eost-bar button.del{background:#ffd9d6;color:#8a1b13}
  .eost-bar button[disabled]{opacity:.4;cursor:not-allowed}
  .eost-bar label{color:#fff;font-weight:400;margin:0 2px 0 8px}
  .eost-chip{position:absolute;z-index:99999;background:#111;color:#fff;border-radius:10px;padding:4px;box-shadow:0 6px 22px rgba(0,0,0,.4)}
  .eost-chip button{font:700 15px system-ui,sans-serif;min-height:40px;border:0;border-radius:8px;padding:6px 12px;background:#ffe97a;color:#111;cursor:pointer}
  `;

  async function openEditor(lang, key) {
    const page = PAGES.find((p) => p.key === key);
    const url = pageUrl(lang, key);
    editorActive = true;
    const S = { dirty: false, undo: [], snap: '', saving: false };
    let doc = null, win = null, mainEl = null, footerEl = null, active = null, barEl = null, chipEl = null, timer = 0;

    const iframe = h('iframe', { class: 'frame', title: 'Page à modifier' });
    const dirtyEl = h('span', { class: 'dirty', hidden: true }, '● Modifications non enregistrées');
    const undoBtn = h('button', { class: 'btn small', type: 'button', disabled: true, onclick: doUndo }, '↶ Annuler la dernière action');
    const saveBtn = h('button', { class: 'btn main', type: 'button', onclick: save }, '✔ Enregistrer');
    const bar = h('div', { class: 'bar' },
      h('div', { class: 'row1' },
        h('button', { class: 'btn small', type: 'button', onclick: back }, '← Retour au menu'),
        h('div', { class: 'title' }, page[lang], h('small', {}, (lang === 'br' ? 'Version en breton' : 'Version en français') + ' ', dirtyEl)),
        saveBtn),
      h('div', { class: 'row2' },
        undoBtn,
        h('button', { class: 'btn small', type: 'button', onclick: showVersions }, 'Anciennes versions'),
        h('button', { class: 'btn small', type: 'button', onclick: () => modal('Aide', helpBody(), [{ id: 'ok', label: 'J\'ai compris', cls: 'main' }]) }, 'Aide'),
        h('a', { class: 'btn small', href: url + '?draft=1', target: '_blank', rel: 'noopener' }, 'Voir la page')));
    const tip = h('div', { class: 'tip' }, h('b', {}, 'Cliquez sur un texte'), ' pour le modifier · ', h('b', {}, 'cliquez sur une photo'), ' pour la changer · ', h('b', {}, 'cliquez dans un élément'), ' pour le déplacer, l\'ajouter ou le supprimer. ', h('b', {}, 'Enregistrer ne met pas en ligne'), ' : la mise en ligne se fait une seule fois, depuis le menu.');
    app.replaceChildren(h('div', { class: 'editor' }, bar, tip, iframe));

    /* chargement de la vraie page dans le cadre, sans ses scripts d'animation */
    let html;
    try { html = await (await fetch(url + '?draft=1&t=' + Date.now(), { credentials: 'same-origin' })).text(); }
    catch { toast('Impossible de charger la page.', true); return showHome(); }
    html = html.replace(/<script[^>]*site\.js[^>]*><\/script>/, '').replace('<head>', '<head><base href="' + location.origin + url + '">');
    iframe.addEventListener('load', setup, { once: true });
    iframe.srcdoc = html;

    window.onbeforeunload = () => (S.dirty ? 'Des modifications ne sont pas enregistrées.' : undefined);

    function serialize(root) {
      const c = root.cloneNode(true);
      c.querySelectorAll('[data-eost-t]').forEach((e) => { e.removeAttribute('data-eost-t'); e.removeAttribute('contenteditable'); e.removeAttribute('spellcheck'); });
      c.querySelectorAll('.eost-active').forEach((e) => { e.classList.remove('eost-active'); if (!e.getAttribute('class')) e.removeAttribute('class'); });
      c.querySelectorAll('img.eost-img').forEach((e) => { e.classList.remove('eost-img'); if (!e.getAttribute('class')) e.removeAttribute('class'); });
      c.querySelectorAll('.rv.in').forEach((e) => e.classList.remove('in'));
      c.querySelectorAll('[data-eost-count]').forEach((e) => { const n = parseInt(String(e.textContent).replace(/\D/g, ''), 10) || 0; e.setAttribute('data-count', String(n)); e.textContent = '0'; e.removeAttribute('data-eost-count'); });
      c.querySelectorAll('.eost-bar,.eost-chip').forEach((e) => e.remove());
      return c.innerHTML;
    }
    const snapshot = () => serialize(mainEl) + '\u0001' + serialize(footerEl);
    function refreshDirty() { S.dirty = snapshot() !== S.snap; dirtyEl.hidden = !S.dirty; }
    const touched = () => { clearTimeout(timer); timer = setTimeout(refreshDirty, 350); };

    function isLeaf(el) {
      if (SKIP.has(el.tagName.toUpperCase()) || el.closest('svg,form,iframe,.chips,.langsw,nav')) return false;
      if (!el.textContent.trim()) return false;
      for (const c of el.children) if (!INLINE.has(c.tagName.toUpperCase())) return false;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
      return own || el.children.length <= 1;
    }
    function mark(node) {
      for (const el of [...node.children]) {
        if (el.hasAttribute('data-eost-t')) continue;
        if (isLeaf(el)) { el.setAttribute('data-eost-t', ''); el.setAttribute('contenteditable', 'true'); el.setAttribute('spellcheck', 'true'); }
        else if (!SKIP.has(el.tagName.toUpperCase()) || el.tagName === 'FIGURE') mark(el);
      }
    }

    function setup() {
      doc = iframe.contentDocument; win = iframe.contentWindow;
      mainEl = doc.querySelector('main'); footerEl = doc.querySelector('footer');
      if (!mainEl || !footerEl) { toast('Cette page ne peut pas être modifiée.', true); return showHome(); }
      doc.head.append(mk(doc, 'style', {}, EDIT_CSS));
      doc.documentElement.classList.add('eost-on');
      doc.querySelectorAll('.rv').forEach((e) => e.classList.add('in'));
      doc.querySelectorAll('[data-count]').forEach((e) => { e.setAttribute('data-eost-count', ''); e.textContent = e.getAttribute('data-count'); e.removeAttribute('data-count'); });
      mark(mainEl); mark(footerEl);
      mainEl.querySelectorAll('img').forEach((i) => { if (!i.closest('svg')) i.classList.add('eost-img'); });
      S.snap = snapshot(); S.dirty = false;

      doc.addEventListener('input', touched);
      doc.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); return; }
        const t = e.target;
        if (e.key === 'Enter' && t && t.hasAttribute && t.hasAttribute('data-eost-t')) {
          e.preventDefault();
          if (t.tagName === 'P') doc.execCommand('insertLineBreak');
        }
      });
      doc.addEventListener('paste', (e) => {
        const t = e.target;
        if (!(t && t.hasAttribute && t.hasAttribute('data-eost-t'))) return;
        e.preventDefault();
        const txt = (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s*\r?\n+\s*/g, ' ');
        doc.execCommand('insertText', false, txt);
      });
      doc.addEventListener('dragstart', (e) => e.preventDefault());
      doc.addEventListener('drop', (e) => e.preventDefault());
      doc.addEventListener('submit', (e) => e.preventDefault(), true);
      win.addEventListener('keydown', () => {}, true);

      doc.addEventListener('click', (e) => {
        const t = e.target;
        if (t.closest('.eost-bar') || t.closest('.eost-chip')) return;
        const a = t.closest('a');
        if (a) e.preventDefault();
        hideChip();
        const img = t.closest('img');
        if (img && mainEl.contains(img) && !img.closest('svg')) { e.preventDefault(); selectBlock(blockOf(img)); return changePhoto(img); }
        if (a && !a.closest('.langsw,.site-header') && (mainEl.contains(a) || footerEl.contains(a))) showChip(a);
        selectBlock(blockOf(t));
      }, true);
    }

    /* ----- blocs (événements, photos, cartes…) ----- */
    function blockOf(n) {
      const el = n && n.nodeType === 1 ? n : n && n.parentElement;
      if (!el || el.closest('.eost-bar,.eost-chip')) return null;
      const b = el.closest(BLOCK_SEL);
      if (!b || !mainEl.contains(b) || b.querySelector('form,iframe') || b.closest('form')) return null;
      return b;
    }
    const sibling = (b, dir) => { const s = dir < 0 ? b.previousElementSibling : b.nextElementSibling; return s && s.matches(BLOCK_SEL) && s.tagName === b.tagName ? s : null; };

    function hideBar() { if (barEl) { barEl.remove(); barEl = null; } if (active) { active.classList.remove('eost-active'); if (!active.getAttribute('class')) active.removeAttribute('class'); active = null; } }
    function selectBlock(b) {
      if (b === active) return;
      hideBar();
      if (!b) return;
      active = b; b.classList.add('eost-active');
      const single = b.matches(SINGLE_SEL);
      const bt = (label, cls, fn, off) => mk(doc, 'button', { type: 'button', class: cls || '', disabled: !!off, onclick: (e) => { e.preventDefault(); e.stopPropagation(); fn(); } }, label);
      barEl = mk(doc, 'div', { class: 'eost-bar', contenteditable: 'false' });
      if (!single) {
        barEl.append(bt('↑ Monter', '', () => move(b, -1), !sibling(b, -1)), bt('↓ Descendre', '', () => move(b, 1), !sibling(b, 1)), bt('＋ Ajouter un autre comme celui-ci', '', () => copy(b)));
        if (b.matches('.gal figure')) {
          const sel = mk(doc, 'select', { 'aria-label': 'Rubrique de la photo' });
          doc.querySelectorAll('.chips button[data-f]').forEach((c) => { if (c.dataset.f !== 'all') sel.append(mk(doc, 'option', { value: c.dataset.f, selected: c.dataset.f === b.dataset.c }, c.textContent)); });
          sel.addEventListener('change', () => { b.dataset.c = sel.value; touched(); });
          barEl.append(mk(doc, 'label', {}, 'Rubrique :'), sel);
        }
      }
      barEl.append(bt('✖ Supprimer', 'del', () => remove(b)));
      doc.body.append(barEl);
      const r = b.getBoundingClientRect(), sy = win.scrollY, sx = win.scrollX;
      barEl.style.top = Math.max(sy + 4, r.top + sy - barEl.offsetHeight - 6) + 'px';
      barEl.style.left = Math.max(sx + 8, Math.min(r.right + sx - barEl.offsetWidth, win.innerWidth + sx - barEl.offsetWidth - 8)) + 'px';
    }
    function pushUndo(fn) { S.undo.push(fn); undoBtn.disabled = false; touched(); }
    function doUndo() { const f = S.undo.pop(); if (f) { hideBar(); f(); touched(); } undoBtn.disabled = !S.undo.length; }
    function move(b, dir) {
      const s = sibling(b, dir); if (!s) return;
      dir < 0 ? s.before(b) : s.after(b);
      pushUndo(() => (dir < 0 ? s.after(b) : s.before(b)));
      active = null; selectBlock(b);
    }
    function copy(b) {
      hideBar();
      const c = b.cloneNode(true);
      c.classList.remove('eost-active'); if (!c.getAttribute('class')) c.removeAttribute('class');
      b.after(c); mark(c);
      pushUndo(() => c.remove());
      selectBlock(c); c.scrollIntoView({ block: 'center', behavior: 'smooth' });
      toast('Une copie a été ajoutée juste en dessous. Modifiez-la maintenant.');
    }
    async function remove(b) {
      const ok = await confirmBox('Supprimer cet élément ?', 'Il disparaîtra de la page quand vous cliquerez sur « Enregistrer ». Vous pouvez encore l\'annuler avec « Annuler la dernière action ».', 'Oui, supprimer', true);
      if (!ok) return;
      hideBar();
      const parent = b.parentNode, next = b.nextSibling;
      b.remove();
      pushUndo(() => parent.insertBefore(b, next));
    }

    /* ----- liens ----- */
    function hideChip() { if (chipEl) { chipEl.remove(); chipEl = null; } }
    function showChip(a) {
      const r = a.getBoundingClientRect(), sy = win.scrollY, sx = win.scrollX;
      chipEl = mk(doc, 'div', { class: 'eost-chip', contenteditable: 'false' }, mk(doc, 'button', { type: 'button', onclick: (e) => { e.preventDefault(); e.stopPropagation(); hideChip(); editLink(a); } }, '🔗 Modifier le lien ou le document'));
      doc.body.append(chipEl);
      chipEl.style.top = (r.bottom + sy + 8) + 'px'; chipEl.style.left = Math.max(sx + 8, Math.min(r.left + sx, win.innerWidth + sx - chipEl.offsetWidth - 8)) + 'px';
    }
    async function editLink(a) {
      const href = h('input', { type: 'text', value: a.getAttribute('href') || '', 'aria-label': 'Adresse du lien' });
      const file = h('input', { type: 'file', accept: '.pdf,.doc,.docx,.odt,.xlsx', style: 'display:none' });
      const info = h('div', { class: 'muted' }, 'Un document PDF, Word ou LibreOffice de 4 Mo maximum.');
      const newTab = h('input', { type: 'checkbox', style: 'width:auto;margin-right:8px;transform:scale(1.3)', checked: a.getAttribute('target') === '_blank' });
      file.addEventListener('change', async () => {
        const f = file.files[0]; if (!f) return;
        if (f.size > 4 * 1000 * 1000) { info.textContent = 'Ce document est trop lourd (4 Mo maximum).'; info.className = 'err'; return; }
        info.className = 'muted'; info.textContent = 'Envoi du document en cours…';
        const r = await api('upload', { kind: 'doc', name: f.name, data: await toB64(f) });
        if (r.ok) { href.value = r.url; newTab.checked = true; info.className = 'ok'; info.textContent = '✔ Document envoyé : ' + f.name + '. Cliquez sur « Valider ».'; }
        else { info.className = 'err'; info.textContent = r.error || 'Envoi impossible.'; }
      });
      const body = h('div', {}, h('label', {}, 'Adresse du lien (vers une page ou un site)'), href,
        h('label', {}, 'Ou bien : choisir un document sur mon ordinateur'), h('button', { class: 'btn', type: 'button', onclick: () => file.click() }, '📄 Choisir un document…'), file, info,
        h('label', { style: 'font-weight:400;margin-top:16px' }, newTab, 'Ouvrir dans un nouvel onglet'));
      const r = await modal('Modifier le lien', body, [{ id: null, label: 'Annuler' }, { id: 'ok', label: 'Valider', cls: 'main' }]);
      if (r !== 'ok') return;
      const v = href.value.trim();
      if (!v) { toast('L\'adresse est vide : le lien n\'a pas été changé.', true); return; }
      if (/^\s*(javascript|data|vbscript):/i.test(v)) { toast('Cette adresse n\'est pas autorisée.', true); return; }
      a.setAttribute('href', v);
      if (newTab.checked) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
      touched();
    }

    /* ----- photos ----- */
    async function loadBitmap(f) {
      try { return await createImageBitmap(f, { imageOrientation: 'from-image' }); } catch { /* repli ci-dessous */ }
      try { return await createImageBitmap(f); } catch { /* repli ci-dessous */ }
      const url = URL.createObjectURL(f);
      try {
        const img = new Image(); img.src = url; await img.decode();
        return { width: img.naturalWidth, height: img.naturalHeight, _img: img };
      } finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
    }
    async function prepareImage(f) {
      let bmp;
      try { bmp = await loadBitmap(f); }
      catch { throw new Error('Cette photo ne peut pas être lue. Utilisez une photo au format JPG ou PNG.'); }
      const draw = (max) => { const s = Math.min(1, max / Math.max(bmp.width, bmp.height)); const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bmp.width * s)); c.height = Math.max(1, Math.round(bmp.height * s)); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp._img || bmp, 0, 0, c.width, c.height); return c; };
      const blob = (c, q) => new Promise((res) => c.toBlob(res, 'image/jpeg', q));
      const big = draw(1600), small = draw(640);
      return { blob: await blob(big, 0.84), thumb: await blob(small, 0.8), w: big.width, h: big.height, tw: small.width };
    }
    async function changePhoto(img) {
      let prepared = null;
      const file = h('input', { type: 'file', accept: 'image/*', style: 'display:none' });
      const preview = h('img', { class: 'preview', alt: 'Aperçu', src: img.currentSrc || img.src });
      const info = h('div', { class: 'muted' }, 'Choisissez une photo : elle sera automatiquement réduite pour que le site reste rapide.');
      const alt = h('input', { type: 'text', value: img.getAttribute('alt') || '', 'aria-label': 'Description de la photo' });
      file.addEventListener('change', async () => {
        const f = file.files[0]; if (!f) return;
        info.className = 'muted'; info.textContent = 'Préparation de la photo…';
        try { prepared = await prepareImage(f); preview.src = URL.createObjectURL(prepared.blob); info.className = 'ok'; info.textContent = '✔ Photo prête. Cliquez sur « Utiliser cette photo ».'; }
        catch (e) { prepared = null; info.className = 'err'; info.textContent = e.message; }
      });
      const body = h('div', {}, preview, h('button', { class: 'btn', type: 'button', onclick: () => file.click() }, '🖼 Choisir une photo sur mon ordinateur…'), file, info,
        h('label', {}, 'Description de la photo (utile pour les personnes qui voient mal)'), alt);
      const r = await modal('Changer la photo', body, [{ id: null, label: 'Annuler' }, {
        id: 'ok', label: 'Utiliser cette photo', cls: 'main',
        run: async () => {
          if (!prepared) { if (alt.value !== (img.getAttribute('alt') || '')) return 'alt'; info.className = 'err'; info.textContent = 'Choisissez d\'abord une photo.'; return false; }
          info.className = 'muted'; info.textContent = 'Envoi de la photo…';
          const up = await api('upload', { kind: 'image', name: 'photo.jpg', data: await toB64(prepared.blob), thumb: await toB64(prepared.thumb) });
          if (!up.ok) { info.className = 'err'; info.textContent = up.error || 'Envoi impossible.'; return false; }
          img.setAttribute('src', up.url);
          if (up.thumb) img.setAttribute('srcset', `${up.thumb} ${prepared.tw}w, ${up.url} ${prepared.w}w`); else img.removeAttribute('srcset');
          img.setAttribute('width', String(prepared.w)); img.setAttribute('height', String(prepared.h));
          const a = img.closest('a'); if (a && /(^|\/)(assets|media)\//.test(a.getAttribute('href') || '')) a.setAttribute('href', up.url);
          return 'ok';
        },
      }]);
      if (r === 'ok' || r === 'alt') { img.setAttribute('alt', alt.value); touched(); }
    }

    /* ----- enregistrement, retour, versions ----- */
    async function save() {
      if (S.saving) return;
      S.saving = true; saveBtn.disabled = true; saveBtn.textContent = 'Enregistrement…';
      try {
        const main = serialize(mainEl), footer = serialize(footerEl);
        const footerChanged = footer !== S.snap.split('\u0001')[1];
        const r = await api('save-page', { lang, page: key, main, footer: footerChanged ? footer : undefined });
        if (r.ok) { S.snap = snapshot(); S.dirty = false; dirtyEl.hidden = true; toast('✔ Enregistré. Pas encore en ligne : quand TOUT est fini, retournez au menu et cliquez sur « Mettre le site en ligne ».'); }
        else toast(r.error || 'L\'enregistrement a échoué. Rien n\'a été perdu : réessayez.', true);
      } finally { S.saving = false; saveBtn.disabled = false; saveBtn.textContent = '✔ Enregistrer'; }
    }
    async function back() {
      refreshDirty();
      if (S.dirty) {
        const r = await modal('Modifications non enregistrées', h('p', {}, 'Vous avez fait des changements qui ne sont pas encore enregistrés.'), [
          { id: 'stay', label: 'Rester sur la page' }, { id: 'drop', label: 'Quitter sans enregistrer', cls: 'danger' }, { id: 'save', label: 'Enregistrer et quitter', cls: 'main' }]);
        if (r === 'save') { await save(); if (S.dirty) return; } else if (r !== 'drop') return;
      }
      window.onbeforeunload = null; showHome();
    }
    async function showVersions() {
      const r = await api('history', { lang, page: key });
      const list = h('div', {});
      const items = r.items || [];
      if (!r.ok) list.append(h('div', { class: 'err' }, r.error || 'Impossible de lire l\'historique.'));
      else if (!items.length) list.append(h('p', {}, 'Aucune ancienne version pour le moment. Elles apparaissent après une mise en ligne.'));
      items.forEach((it) => list.append(h('div', { class: 'hist' }, h('span', {}, fmtDate(it.at)), h('button', { class: 'btn small', type: 'button', onclick: async () => {
        if (!(await confirmBox('Revenir à cette version ?', 'Cette ancienne version sera chargée dans la page. Elle ne sera visible des visiteurs qu\'après la mise en ligne.', 'Oui, revenir en arrière'))) return;
        const rr = await api('restore', { lang, page: key, id: it.id });
        if (rr.ok) { window.onbeforeunload = null; closeModals(); toast('✔ Ancienne version rétablie dans la page. Pensez à enregistrer puis à mettre en ligne.'); openEditor(lang, key); } else toast(rr.error, true);
      } }, 'Revenir à cette version'))));
      const extra = h('div', { style: 'margin-top:18px' }, h('button', { class: 'btn small danger', type: 'button', onclick: async () => {
        if (!(await confirmBox('Rétablir la version d\'origine ?', 'La page reviendra à la version d\'origine du site, au moment de la mise en ligne. La version actuelle restera dans les anciennes versions.', 'Oui, rétablir', true))) return;
        const rr = await api('reset-page', { lang, page: key });
        if (rr.ok) { window.onbeforeunload = null; closeModals(); toast('✔ Version d\'origine rétablie dans la page (pas encore en ligne).'); openEditor(lang, key); } else toast(rr.error, true);
      } }, 'Rétablir la version d\'origine de cette page'));
      await modal('Anciennes versions', h('div', {}, list, extra), [{ id: 'ok', label: 'Fermer', cls: 'main' }]);
    }
  }

  /* ---------- démarrage ---------- */
  api('me', undefined, true).then((r) => { if (r.ok) showHome(); else showLogin(); });
})();
