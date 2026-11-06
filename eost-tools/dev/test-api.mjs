import assert from 'node:assert/strict';
import { startServer } from './serve-local.mjs';

const calls = [];
const s = await startServer({ resendCalls: calls });
const B = s.url;
let pass = 0;
const ok = (name, cond, extra = '') => { assert.ok(cond, `${name} ${extra}`); pass++; console.log('  ✓', name); };
const H = { 'Content-Type': 'application/json', 'X-Requested-With': 'eost-admin' };
const api = (a, body, cookie, headers = H) => fetch(`${B}/.netlify/functions/admin-api?a=${a}`, { method: body === undefined ? 'GET' : 'POST', headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });

console.log('Pages publiques');
let r = await fetch(B + '/'); let html = await r.text();
ok('accueil FR servi par la fonction', r.status === 200 && html.includes('Études ouvertes') && html.includes('<main id="main">'));
ok('lien admin dans le pied de page', html.includes('href="/admin/"') && html.includes('Espace administrateur'));
r = await fetch(B + '/br/agenda'); html = await r.text();
ok('agenda BR servi', r.status === 200 && html.includes('Deiziataer') && html.includes('lang="br"'));
for (const p of ['/association', '/activites.html', '/galerie', '/actualites', '/adherer', '/mentions-legales', '/merci', '/br', '/br/', '/br/merci.html']) { r = await fetch(B + p); ok('route ' + p, r.status === 200, r.status); }
r = await fetch(B + '/netlify/functions/admin-api.mjs'); ok('le code des fonctions n\'est pas servi', r.status === 404);
html = await (await fetch(B + '/adherer')).text();
ok('formulaire : plus de Netlify Forms, envoi vers notre fonction', html.includes('action="/.netlify/functions/contact"') && !html.includes('data-netlify'));

console.log('Sécurité de l\'API');
r = await api('me'); ok('sans connexion : refusé (401)', r.status === 401);
r = await api('save-page', { lang: 'fr', page: 'index', main: '<section>x</section>' }); ok('sans connexion : enregistrement refusé', r.status === 401);
r = await api('login', { user: 'eost', password: 'test-1234' }, null, { 'Content-Type': 'application/json' }); ok('connexion sans en-tête anti-CSRF : refusée (403)', r.status === 403);
r = await api('login', { user: 'eost', password: 'mauvais' }); ok('mauvais mot de passe : 401', r.status === 401);
r = await api('login', { user: 'autre', password: 'test-1234' }); ok('mauvais identifiant : 401', r.status === 401);
for (let i = 0; i < 3; i++) await api('login', { user: 'eost', password: 'x' + i });
r = await api('login', { user: 'eost', password: 'test-1234' }); const lock = await r.json(); ok('après 5 échecs : verrouillé 429 même avec le bon mot de passe', r.status === 429 && /minute/.test(lock.error), JSON.stringify(lock));
await s.stop();

// nouveau serveur (compteur d'essais remis à zéro)
const s2 = await startServer({ resendCalls: calls });
const B2 = s2.url;
const api2 = (a, body, cookie, headers = H) => fetch(`${B2}/.netlify/functions/admin-api?a=${a}`, { method: body === undefined ? 'GET' : 'POST', headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
console.log('Connexion et modification');
r = await api2('login', { user: 'EOST', password: 'test-1234' }); ok('bonne connexion (identifiant insensible à la casse)', r.status === 200);
const setc = r.headers.get('set-cookie'); ok('cookie sécurisé HttpOnly + Secure + SameSite=Strict', /HttpOnly/.test(setc) && /Secure/.test(setc) && /SameSite=Strict/.test(setc));
const cookie = setc.split(';')[0];
r = await api2('me', undefined, cookie); const me = await r.json(); ok('session reconnue', me.ok && me.user === 'eost');
r = await api2('me', undefined, cookie.slice(0, -3) + 'abc'); ok('cookie falsifié refusé', r.status === 401);
r = await api2('save-page', { lang: 'fr', page: 'index', main: '<section>x</section>' }, cookie, { 'Content-Type': 'application/json' }); ok('enregistrement sans en-tête anti-CSRF refusé', r.status === 403);

const orig = await (await fetch(B2 + '/agenda')).text();
const origMain = orig.match(/<main id="main">([\s\S]*)<\/main>/)[1];
const edited = origMain.replace('Prochains rendez-vous', 'Prochains rendez-vous MODIFIÉS').replace(/<script[^>]*>[\s\S]*?<\/script>/g, '') + '<script>alert(1)</script>';
r = await api2('save-page', { lang: 'fr', page: 'agenda', main: edited + '<p onclick="x()">piège</p>' }, cookie); const sv = await r.json(); ok('enregistrement de la page agenda', sv.ok, JSON.stringify(sv));
let pub = await (await fetch(B2 + '/agenda')).text();
ok('la modification est visible sur le site public', pub.includes('Prochains rendez-vous MODIFIÉS'));
ok('script et attribut dangereux supprimés', !pub.includes('alert(1)') && !pub.includes('onclick'));
ok('en-tête, menu et mise en page conservés', pub.includes('class="site-header"') && pub.includes('<footer>'));
ok('autre page non touchée', !(await (await fetch(B2 + '/br/agenda')).text()).includes('MODIFIÉS') && !(await (await fetch(B2 + '/galerie')).text()).includes('MODIFIÉS'));
r = await api2('save-page', { lang: 'fr', page: 'agenda', main: '<p>vide</p>' }, cookie); ok('contenu vide/incomplet refusé', (await r.json()).ok === false);
r = await api2('save-page', { lang: 'fr', page: 'inexistante', main: edited }, cookie); ok('page inconnue refusée', (await r.json()).ok === false);
r = await api2('save-page', { lang: 'fr', page: 'agenda', main: edited.replace('MODIFIÉS', 'DEUX') , footer: '<div class="wrap"><p>Pied de page modifié 06 00 00 00 00</p></div>' }, cookie); const sv2 = await r.json(); ok('2e enregistrement + pied de page', sv2.ok && sv2.footerSaved);
ok('le pied de page modifié s\'applique à toutes les pages de la langue', (await (await fetch(B2 + '/')).text()).includes('Pied de page modifié') && (await (await fetch(B2 + '/galerie')).text()).includes('Pied de page modifié'));
ok('mais pas à l\'autre langue', !(await (await fetch(B2 + '/br/')).text()).includes('Pied de page modifié'));
r = await api2('history', { lang: 'fr', page: 'agenda' }, cookie); const hist = await r.json(); ok('historique : 1 ancienne version', hist.ok && hist.items.length === 1, JSON.stringify(hist));
r = await api2('restore', { lang: 'fr', page: 'agenda', id: hist.items[0].id }, cookie); ok('retour à une ancienne version', (await r.json()).ok && (await (await fetch(B2 + '/agenda')).text()).includes('MODIFIÉS') && !(await (await fetch(B2 + '/agenda')).text()).includes('DEUX'));
r = await api2('reset-page', { lang: 'fr', page: 'agenda' }, cookie); ok('rétablir la version d\'origine', (await r.json()).ok && (await (await fetch(B2 + '/agenda')).text()).includes('Prochains rendez-vous') && !(await (await fetch(B2 + '/agenda')).text()).includes('MODIFIÉS'));
r = await api2('reset-footer', { lang: 'fr' }, cookie); ok('rétablir le pied de page', (await r.json()).ok && !(await (await fetch(B2 + '/')).text()).includes('Pied de page modifié'));
r = await api2('pages', undefined, cookie); const pg = await r.json(); ok('liste des 18 pages (9 FR + 9 BR)', pg.ok && pg.pages.length === 18);

console.log('Photos et documents');
const jpg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(2000, 7)]).toString('base64');
r = await api2('upload', { kind: 'image', name: 'Moulin.JPG', data: jpg, thumb: jpg }, cookie); const up = await r.json(); ok('envoi d\'une photo', up.ok && /^\/media\/[a-z0-9]+\.jpg$/.test(up.url) && up.thumb, JSON.stringify(up));
r = await fetch(B2 + up.url); ok('photo servie (image/jpeg, cache 1 an)', r.status === 200 && r.headers.get('content-type') === 'image/jpeg' && /immutable/.test(r.headers.get('cache-control')) && (await r.arrayBuffer()).byteLength === 2004);
const pdf = Buffer.from('%PDF-1.4\n' + 'x'.repeat(500)).toString('base64');
r = await api2('upload', { kind: 'doc', name: 'Compte rendu AG 2026.pdf', data: pdf }, cookie); const upd = await r.json(); ok('envoi d\'un PDF', upd.ok && upd.url.endsWith('.pdf'));
r = await fetch(B2 + upd.url); ok('PDF servi avec son nom', r.status === 200 && r.headers.get('content-type') === 'application/pdf' && /Compte rendu AG 2026\.pdf/.test(r.headers.get('content-disposition')));
r = await api2('upload', { kind: 'image', name: 'virus.jpg', data: Buffer.from('MZ-pas-une-image').toString('base64') }, cookie); ok('faux fichier déguisé en photo refusé', (await r.json()).ok === false);
r = await api2('upload', { kind: 'doc', name: 'script.exe', data: pdf }, cookie); ok('format non autorisé refusé', (await r.json()).ok === false);
r = await api2('upload', { kind: 'image', name: 'gros.jpg', data: Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(3.2 * 1024 * 1024)]).toString('base64') }, cookie); const big = await r.json(); ok('photo trop lourde refusée avec message clair', big.ok === false && /trop lourde/.test(big.error));
r = await fetch(B2 + '/media/../../etc/passwd'); ok('chemin piégé refusé', r.status === 404);
r = await fetch(B2 + '/media/inconnu1234567.jpg'); ok('média inconnu : 404', r.status === 404);

console.log('Formulaire de contact');
const post = (fields, ip) => fetch(B2 + '/.netlify/functions/contact', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields), redirect: 'manual' });
const good = { lang: 'fr', nom: 'Marie Le Goff', email: 'marie@example.org', sujet: 'Adhésion', message: 'Bonjour,\nJe souhaite adhérer.\nMerci', 'bot-field': '', ts: String(Date.now() - 10000) };
calls.length = 0;
r = await post(good); ok('message valide : redirection vers la page de remerciement', r.status === 303 && r.headers.get('location') === '/merci');
ok('UN SEUL e-mail envoyé à M. Quéméner', calls.length === 1 && calls[0].body.to[0] === 'yannber.kemener1@orange.fr', JSON.stringify(calls.map(c => c.body.to)));
ok('e-mail : expéditeur, objet et adresse de réponse', calls[0].body.from.includes('contact@eost-telgruc.fr') && /nouveau message \(Adhésion\)/.test(calls[0].body.subject) && calls[0].body.reply_to === 'marie@example.org' && calls[0].body.text.includes('Je souhaite adhérer.'));
r = await post({ ...good, lang: 'br' }); ok('formulaire breton : remerciement breton', r.headers.get('location') === '/br/merci');
calls.length = 0;
r = await post({ ...good, 'bot-field': 'je suis un robot' }); ok('robot (champ piège) : faux succès, aucun e-mail', r.status === 303 && calls.length === 0);
r = await post({ ...good, ts: String(Date.now()) }); ok('envoi instantané (robot) : aucun e-mail', r.status === 303 && calls.length === 0);
r = await post({ ...good, email: 'pas-un-mail' }); ok('e-mail invalide : message d\'erreur (400)', r.status === 400);
r = await post({ ...good, sujet: 'Adhésion\nBcc: pirate@example.org', nom: 'Jean\r\nBcc: x@y.z' }); ok('injection d\'en-tête neutralisée', r.status === 303 && !/\n/.test(calls[0].body.subject) && !/\n/.test(calls[0].body.text.split('\n').find(l => l.startsWith('Nom'))));
r = await fetch(B2 + '/.netlify/functions/contact'); ok('GET refusé', r.status === 405);
let st = 0; for (let i = 0; i < 8; i++) st = (await post({ ...good, nom: 'Spam' + i })).status; ok('trop de messages depuis la même adresse : bloqué (429)', st === 429);

console.log('Messages dans l\'espace administrateur');
r = await api2('messages', undefined, cookie); const ms = await r.json(); ok('les messages sont conservés', ms.ok && ms.items.length >= 3 && ms.items.some(m => m.nom === 'Marie Le Goff' && m.mail === 'envoyé'));
r = await api2('me', undefined, cookie); ok('compteur de messages non lus', (await r.json()).unread >= 3);
const first = ms.items[0];
r = await api2('message-read', { key: first.key }, cookie); ok('marquer comme lu', (await r.json()).ok);
r = await api2('message-delete', { key: first.key }, cookie); ok('supprimer un message', (await r.json()).ok && !(await (await api2('messages', undefined, cookie)).json()).items.some(m => m.key === first.key));
r = await api2('message-delete', { key: '../../x' }, cookie); ok('clé de message piégée refusée', (await r.json()).ok === false);

console.log('Mot de passe');
r = await api2('change-password', { current: 'faux', next: 'nouveau-mdp-123' }, cookie); ok('ancien mot de passe faux : refusé', r.status === 403);
r = await api2('change-password', { current: 'test-1234', next: 'court' }, cookie); ok('mot de passe trop court refusé', (await r.json()).ok === false);
r = await api2('change-password', { current: 'test-1234', next: 'nouveau-mdp-123' }, cookie); ok('changement du mot de passe', (await r.json()).ok);
r = await api2('login', { user: 'eost', password: 'test-1234' }); ok('l\'ancien mot de passe ne marche plus', r.status === 401);
r = await api2('login', { user: 'eost', password: 'nouveau-mdp-123' }); ok('le nouveau marche', r.status === 200);
r = await api2('logout', {}, cookie); ok('déconnexion', r.status === 200 && /Max-Age=0/.test(r.headers.get('set-cookie')));
await s2.stop();
console.log(`\n${pass} vérifications réussies.`);
