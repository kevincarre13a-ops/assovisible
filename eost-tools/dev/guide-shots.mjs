// Captures d'écran annotées pour le guide de prise en main (serveur local, aucune donnée réelle).
import path from 'node:path';
import { createRequire } from 'node:module';
import { startServer } from './serve-local.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = process.env.OUT;
const assets = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'eost-site', 'assets');
const s = await startServer({ resendCalls: [] });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const frame = () => page.frameLocator('iframe.frame');
const sleep = (ms) => page.waitForTimeout(ms);
async function toMenu() {
  await page.getByRole('button', { name: '← Retour au menu' }).click();
  const quit = page.getByRole('button', { name: 'Quitter sans enregistrer' });
  await Promise.race([quit.waitFor({ timeout: 2500 }).then(() => quit.click()), page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor({ timeout: 2500 })]).catch(() => {});
  await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor(); await sleep(500);
}

// Repères : cadre rouge + pastille numérotée, posés par-dessus la page le temps de la capture.
async function mark(items) {
  const boxes = [];
  for (const [loc, n, pad = 6] of items) {
    const b = await loc.first().boundingBox();
    if (b) boxes.push({ x: b.x - pad, y: b.y - pad, w: b.width + pad * 2, h: b.height + pad * 2, n });
  }
  await page.evaluate((boxes) => {
    document.getElementById('__ann')?.remove();
    const root = document.createElement('div'); root.id = '__ann';
    root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
    boxes.forEach((b) => {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border:4px solid #e53935;border-radius:10px;box-shadow:0 0 0 2px #fff`;
      const c = document.createElement('div');
      c.textContent = b.n;
      c.style.cssText = 'position:absolute;left:-16px;top:-16px;width:34px;height:34px;border-radius:50%;background:#e53935;color:#fff;font:700 19px/34px Arial,sans-serif;text-align:center;box-shadow:0 0 0 3px #fff';
      d.append(c); root.append(d);
    });
    document.body.append(root);
  }, boxes);
}
const clear = () => page.evaluate(() => document.getElementById('__ann')?.remove());
const KEEP = new Set(['07-enregistre', '10-supprimer', '09-copie-modifiee']);
const shot = async (name, clip) => { if (!KEEP.has(name)) await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove())); await page.screenshot({ path: `${OUT}/${name}.png`, clip }); await clear(); console.log('  ', name); };

// 1. Bas de page du site public
await page.setViewportSize({ width: 1200, height: 1000 });
await page.goto(s.url + '/'); await sleep(800);
await page.addStyleTag({ content: '.rv{opacity:1!important;transform:none!important;transition:none!important}' });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })); await sleep(900);
await mark([[page.locator('footer a[href="/admin/"]'), 1, 18]]);
await shot('01-pied-de-page', { x: 0, y: 560, width: 1200, height: 440 });
await page.setViewportSize({ width: 1200, height: 800 });

// 2. Connexion
await page.goto(s.url + '/admin/'); await page.locator('#user').waitFor(); await sleep(400);
await page.fill('#user', 'eost'); await page.fill('#pass', 'test-1234');
await mark([[page.locator('#user'), 1], [page.locator('#pass'), 2], [page.getByRole('button', { name: 'Entrer' }), 3]]);
await shot('02-connexion', { x: 200, y: 60, width: 800, height: 640 });
await page.getByRole('button', { name: 'Entrer' }).click();
await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor(); await sleep(500);

// 3. Menu principal
await mark([[page.locator('h2', { hasText: 'Pages en français' }), 1], [page.locator('.tile', { hasText: 'Agenda' }).first(), 2], [page.locator('h2', { hasText: 'Pages en breton' }), 3], [page.getByRole('button', { name: 'Se déconnecter' }), 4]]);
await shot('03-menu', { x: 0, y: 0, width: 1200, height: 800 });

// 4. Éditeur : barre du haut
await page.locator('.grid').first().getByRole('button', { name: /Agenda/ }).click();
await frame().locator('[data-eost-t]').first().waitFor(); await sleep(1800);
await mark([
  [page.getByRole('button', { name: '← Retour au menu' }), 1], [page.locator('.bar .title'), 2], [page.getByRole('button', { name: /Enregistrer/ }), 3],
  [page.getByRole('button', { name: /Annuler la dernière action/ }), 4], [page.getByRole('button', { name: 'Anciennes versions' }), 5],
  [page.getByRole('button', { name: 'Aide', exact: true }), 6], [page.getByRole('link', { name: 'Voir la page' }), 7]]);
await shot('04-editeur-barre', { x: 0, y: 0, width: 1200, height: 360 });

// 5. Modifier un texte
const h2 = frame().locator('main h2').first();
await h2.scrollIntoViewIfNeeded(); await sleep(300);
await h2.click(); await page.keyboard.press('End'); await page.keyboard.type(' (exemple)'); await sleep(300);
await mark([[h2, 1, 10], [page.locator('.dirty'), 2]]);
await shot('05-texte', { x: 0, y: 0, width: 1200, height: 700 });

// 6. Enregistrer
await mark([[page.getByRole('button', { name: /Enregistrer/ }), 1], [page.locator('.dirty'), 2]]);
await shot('06-avant-enregistrer', { x: 0, y: 0, width: 1200, height: 200 });
await page.getByRole('button', { name: /Enregistrer/ }).click();
await page.locator('.toast', { hasText: 'Enregistré' }).waitFor(); await sleep(500);
await mark([[page.locator('.toast'), 1, 8]]);
await shot('07-enregistre', { x: 0, y: 0, width: 1200, height: 800 });

// 7. Barre d'un élément (événement)
const ev = frame().locator('main .ev').first();
await ev.scrollIntoViewIfNeeded(); await ev.locator('h3').click(); await frame().locator('.eost-bar').waitFor(); await sleep(500);
await mark([[frame().locator('.eost-bar'), 1, 4], [frame().getByRole('button', { name: /Monter/ }), 2, 2], [frame().getByRole('button', { name: /Descendre/ }), 3, 2], [frame().getByRole('button', { name: /Ajouter un autre/ }), 4, 2], [frame().locator('.eost-bar button.del'), 5, 2]]);
await shot('08-barre-element', { x: 0, y: 150, width: 1200, height: 650 });
// copie
await frame().getByRole('button', { name: /Ajouter un autre/ }).click(); await sleep(600);
const copy = frame().locator('main .ev').nth(1);
await copy.locator('h3').click(); await page.keyboard.press('Control+A'); await page.keyboard.type('Sortie au moulin de Luzéoc');
await copy.locator('p').click(); await page.keyboard.press('Control+A'); await page.keyboard.type('Samedi 12 juin, 15 h. Venez nombreux !'); await sleep(300);
await mark([[copy, 1, 4]]);
await shot('09-copie-modifiee', { x: 0, y: 150, width: 1200, height: 650 });
await frame().locator('.eost-bar button.del').click();
await page.locator('.dlg').waitFor(); await sleep(300);
await mark([[page.getByRole('button', { name: 'Non, annuler' }), 1], [page.getByRole('button', { name: 'Oui, supprimer' }), 2]]);
await shot('10-supprimer', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: 'Oui, supprimer' }).click(); await sleep(400);
await page.getByRole('button', { name: /Enregistrer/ }).click(); await page.locator('.toast', { hasText: 'Enregistré' }).waitFor(); await page.locator('.dirty').waitFor({ state: 'hidden' });
await page.getByRole('button', { name: '← Retour au menu' }).click();
await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor(); await sleep(600);

// 8. Cadre jaune : mise en ligne
await mark([[page.locator('.publish.wait'), 1, 4], [page.locator('.publish.wait a', { hasText: 'voir' }).first(), 2], [page.locator('.publish.wait a', { hasText: 'abandonner' }).first(), 3], [page.getByRole('button', { name: /Mettre le site en ligne/ }), 4], [page.locator('.tile', { hasText: 'Agenda' }).first(), 5]]);
await shot('11-menu-en-attente', { x: 0, y: 0, width: 1200, height: 900 });
await page.getByRole('button', { name: /Mettre le site en ligne/ }).click(); await page.locator('.dlg').waitFor(); await sleep(400);
await mark([[page.getByRole('button', { name: /Oui, tout est terminé/ }), 1], [page.getByRole('button', { name: 'Non, annuler' }), 2]]);
await shot('12-confirmation', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: /Oui, tout est terminé/ }).click(); await page.locator('.dlg', { hasText: 'Le site est en ligne' }).waitFor(); await sleep(400);
await shot('13-en-ligne', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: 'Très bien' }).click(); await page.locator('.publish.ok').waitFor(); await sleep(400);
await mark([[page.locator('.publish.ok'), 1, 4]]);
await shot('14-a-jour', { x: 0, y: 0, width: 1200, height: 500 });

// 9. Photos (galerie)
await page.locator('.grid').first().getByRole('button', { name: /Galerie/ }).click();
await frame().locator('main .gal figure').first().waitFor(); await sleep(1800);
const img = frame().locator('main .gal figure img').first();
await img.scrollIntoViewIfNeeded(); await sleep(400);
await mark([[img, 1, 4]]);
await shot('15-photo-clic', { x: 0, y: 0, width: 1200, height: 800 });
await img.click(); await page.locator('.dlg', { hasText: 'Changer la photo' }).waitFor(); await sleep(400);
await mark([[page.locator('.dlg input[type=file]'), 1, 4]]);
await shot('16-photo-dialogue', { x: 0, y: 0, width: 1200, height: 800 });
await page.locator('.dlg input[type=file]').setInputFiles(path.join(assets, 'gal-breton-2025.jpg'));
await page.locator('.dlg .ok', { hasText: 'Photo prête' }).waitFor(); await sleep(400);
await page.locator('.dlg input[type=text]').fill('Après-midi de conversation en breton');
await mark([[page.locator('.dlg .ok'), 1, 4], [page.locator('.dlg input[type=text]'), 2], [page.getByRole('button', { name: 'Utiliser cette photo' }), 3]]);
await shot('17-photo-prete', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: 'Utiliser cette photo' }).click(); await page.locator('.dlg').waitFor({ state: 'detached' }); await sleep(600);
const cap = frame().locator('main .gal figure figcaption').first();
await mark([[img, 1, 4], [cap, 2, 6]]);
await shot('18-photo-changee', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: /Enregistrer/ }).click(); await page.locator('.toast', { hasText: 'Enregistré' }).waitFor(); await page.locator('.dirty').waitFor({ state: 'hidden' });
// rubriques de galerie
const fig3 = frame().locator('main .gal figure figcaption').nth(2);
await fig3.click(); await frame().locator('.eost-bar select').waitFor(); await sleep(400);
await mark([[frame().locator('.eost-bar'), 1, 4], [frame().locator('.eost-bar select'), 2, 2]]);
await shot('19-galerie-rubrique', { x: 0, y: 0, width: 1200, height: 800 });
await page.getByRole('button', { name: '← Retour au menu' }).click();
await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor(); await sleep(400);

// 10. Document / lien (Activités)
await page.locator('.grid').first().getByRole('button', { name: /Activités/ }).click();
await frame().locator('main .doc').first().waitFor(); await sleep(1800);
const dl = frame().locator('main .doc a.btn').first();
await dl.scrollIntoViewIfNeeded(); await dl.click(); await sleep(500);
await mark([[frame().getByRole('button', { name: /Modifier le lien/ }), 1, 4]]);
await shot('20-lien-puce', { x: 0, y: 0, width: 1200, height: 800 });
await frame().getByRole('button', { name: /Modifier le lien/ }).click(); await page.locator('.dlg', { hasText: 'Modifier le lien' }).waitFor(); await sleep(400);
await mark([[page.locator('.dlg input[type=file]'), 1, 4], [page.getByRole('button', { name: 'Valider' }), 2]]);
await shot('21-lien-dialogue', { x: 0, y: 0, width: 1200, height: 800 });
await page.keyboard.press('Escape'); await sleep(300);
await page.locator('.dlg').waitFor({ state: 'detached' }).catch(async () => { await page.getByRole('button', { name: /Annuler|Fermer/ }).first().click(); });
await page.getByRole('button', { name: '← Retour au menu' }).click().catch(() => {});
await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor().catch(async () => { await page.getByRole('button', { name: 'Quitter sans enregistrer' }).click(); await page.getByRole('heading', { name: /Que voulez-vous modifier/ }).waitFor(); }); await sleep(400);

// 11. Pied de page
await page.locator('.grid').first().getByRole('button', { name: /Accueil/ }).click();
await frame().locator('main .stats').first().waitFor(); await sleep(1800);
const phone = frame().locator('footer [data-eost-t]', { hasText: '06 64 96 45 50' }).first();
await phone.scrollIntoViewIfNeeded(); await phone.click(); await sleep(500);
await mark([[phone, 1, 8]]);
await shot('22-pied-de-page-edition', { x: 0, y: 0, width: 1200, height: 800 });

// 12. Chiffres clés
const counter = frame().locator('.stats b').first();
await counter.scrollIntoViewIfNeeded(); await counter.click(); await sleep(500);
await mark([[counter, 1, 8]]);
await shot('23-chiffre', { x: 0, y: 0, width: 1200, height: 800 });
await toMenu();

// 13. Pages en breton
await page.locator('h2', { hasText: 'Pages en breton' }).evaluate((e) => e.scrollIntoView({ block: 'start' })); await sleep(400);
await mark([[page.locator('h2', { hasText: 'Pages en breton' }), 1], [page.locator('.grid').nth(1).locator('.tile').first(), 2]]);
await shot('24-menu-breton', { x: 0, y: 0, width: 1200, height: 560 });
await page.locator('.grid').nth(1).getByRole('button', { name: /Deiziataer/ }).click();
await frame().locator('[data-eost-t]').first().waitFor(); await sleep(1800);
await mark([[page.locator('.bar .title'), 1, 6]]);
await shot('25-editeur-breton', { x: 0, y: 0, width: 1200, height: 800 });
await toMenu();

// 14. Anciennes versions : 2e mise en ligne puis historique
await page.locator('.grid').first().getByRole('button', { name: /Agenda/ }).click();
await frame().locator('[data-eost-t]').first().waitFor(); await sleep(1800);
await frame().locator('main h2').first().click(); await page.keyboard.press('End'); await page.keyboard.type(' bis');
await page.getByRole('button', { name: /Enregistrer/ }).click(); await page.locator('.toast', { hasText: 'Enregistré' }).waitFor(); await page.locator('.dirty').waitFor({ state: 'hidden' });
await page.getByRole('button', { name: '← Retour au menu' }).click();
await page.getByRole('button', { name: /Mettre le site en ligne/ }).click(); await page.getByRole('button', { name: /Oui, tout est terminé/ }).click();
await page.getByRole('button', { name: 'Très bien' }).click(); await page.locator('.publish.ok').waitFor();
await page.locator('.grid').first().getByRole('button', { name: /Agenda/ }).click();
await frame().locator('[data-eost-t]').first().waitFor(); await sleep(1500);
await page.getByRole('button', { name: 'Anciennes versions' }).click(); await page.locator('.hist').first().waitFor(); await sleep(400);
await mark([[page.locator('.hist').first(), 1, 4], [page.getByRole('button', { name: /Rétablir la version d'origine/ }), 2]]);
await shot('26-anciennes-versions', { x: 0, y: 0, width: 1200, height: 800 });
await page.keyboard.press('Escape'); await sleep(400);

// 15. Aide
await toMenu();
await page.locator('.tile', { hasText: 'Aide' }).click(); await page.getByRole('heading', { name: 'Aide' }).waitFor(); await sleep(400);
await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
await shot('27-aide', { x: 0, y: 0, width: 1200, height: 800 });

await browser.close(); await s.stop();
