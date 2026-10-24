const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv[2] || '/home/user/assovisible/nitnoy/index.html');
const shots = process.argv[3] || __dirname + '/../replica/clone-screens';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  await page.goto(URL); await page.waitForTimeout(600);
  const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('F01 home loaded; horizontal scroll:', hscroll);
  await page.screenshot({ path: shots + '/S01-home.png' });
  // F01: lesson 1.1 end to end, answering via the debug hook
  await page.getByRole('button', { name: /Unit 1, lesson 1/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shots + '/S02-intro.png' });
  async function runLesson(){
  let guard = 0, shotMC = false, shotBuild = false, shotMatch = false, shotSay = false;
  while (guard++ < 80) {
    const st = await page.evaluate(() => { const s = window.NITNOY.session; if (!s || s.kind === 'done') return null; const step = s.steps[s.i]; if (!step) return { type: 'end' }; return { type: step.type, en: step.item && step.item.en, th: step.item && step.item.th, i: s.i, n: s.steps.length, ro: step.item && step.item.ro, pairs: step.pairs && step.pairs.map(p => [p.th, p.en]) }; });
    if (!st) break;
    if (st.type === 'end') { await page.screenshot({ path: shots + '/S03-done.png' }); await page.getByRole('button', { name: 'Continue' }).click(); break; }
    if (st.type === 'intro') { await page.getByRole('button', { name: 'Continue' }).click(); }
    else if (st.type === 'mc-th' || st.type === 'listen') {
      // deliberately wrong once on first mc to test requeue
      const opts = page.locator('.opt');
      const texts = await opts.allInnerTexts();
      const target = st.type === 'mc-th' ? st.en : st.th.replace(/ /g, '');
      let idx = texts.findIndex(t => t.includes(target));
      if (!shotMC && st.type === 'mc-th') { idx = (idx + 1) % texts.length; }
      await opts.nth(idx).click(); if (!shotMC && st.type === 'mc-th') { await page.screenshot({ path: shots + '/S02-mc.png' }); }
      await page.getByRole('button', { name: 'Check' }).click(); await page.waitForTimeout(150);
      if (!shotMC && st.type === 'mc-th') { await page.screenshot({ path: shots + '/S02-wrong.png' }); shotMC = true; }
      await page.locator('#cont').click();
    } else if (st.type === 'mc-en') {
      const opts = page.locator('.opt'); const texts = await opts.allInnerTexts();
      const idx = texts.findIndex(t => t.includes(st.th.replace(/ /g, '')));
      await opts.nth(idx).click(); await page.getByRole('button', { name: 'Check' }).click(); await page.waitForTimeout(150); await page.locator('#cont').click();
    } else if (st.type === 'build') {
      for (const t of st.ro.split(' ')) { await page.locator('.tiles.bank .tile:not(.ghosted)').filter({ hasText: t }).first().click(); }
      if (!shotBuild) { await page.screenshot({ path: shots + '/S02-build.png' }); shotBuild = true; }
      await page.getByRole('button', { name: 'Check' }).click(); await page.waitForTimeout(150);
      const sheetText = await page.locator('#sheet h3').innerText(); if (/Not quite/.test(sheetText)) console.log('BUILD judged wrong for', st.ro);
      await page.locator('#cont').click();
    } else if (st.type === 'match') {
      for (const [th, en] of st.pairs) { await page.locator('.pairs .col').first().locator('.opt:not(.locked)').filter({ hasText: th.replace(/ /g, '') }).first().click(); await page.locator('.pairs .col').nth(1).locator('.opt:not(.locked)').filter({ hasText: en }).first().click(); await page.waitForTimeout(80); }
      if (!shotMatch) { await page.screenshot({ path: shots + '/S02-match.png' }); shotMatch = true; }
      await page.locator('#cont').click();
    } else if (st.type === 'say') {
      if (!shotSay) { await page.screenshot({ path: shots + '/S02-say.png' }); shotSay = true; }
      const mic = page.getByRole('button', { name: 'Record yourself' });
      if (await mic.count()) { await mic.click(); await page.waitForTimeout(1500); console.log('say status:', await page.locator('.speak .status').innerText()); }
      const said = page.getByRole('button', { name: 'I said it' });
      if (await said.count()) { await said.click(); await page.waitForTimeout(150); await page.locator('#cont').click(); }
      else { await page.getByRole('button', { name: 'Cannot speak right now' }).click(); }
    } else { console.log('unknown step', st.type); break; }
    await page.waitForTimeout(60);
  }
  }
  await runLesson();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('nitnoy.v1')));
  console.log('F01 after lesson: xp', after.xp, 'streak', after.streak.count, 'lesson times', after.lessons.u1l1 && after.lessons.u1l1.times, 'today', after.today.lessons);
  await page.screenshot({ path: shots + '/S01-home-after.png' });
  // lesson 2 unlocked?
  const l2 = await page.getByRole('button', { name: /Unit 1, lesson 2/ }).isDisabled();
  console.log('F01 lesson 2 unlocked:', !l2);
  // F03 practice (needs >=4 learned)
  await page.getByRole('button', { name: 'Practice', exact: true }).click(); await page.waitForTimeout(200);
  await page.screenshot({ path: shots + '/S04-practice.png' });
  const prBtn = page.getByRole('button', { name: /Start a practice round/ });
  console.log('F03 practice button visible:', await prBtn.isVisible());
  // F04 phrasebook search
  await page.getByRole('button', { name: 'Phrases', exact: true }).click(); await page.waitForTimeout(200);
  await page.getByLabel('Search phrases').fill('toilet'); await page.waitForTimeout(100);
  const rows = await page.locator('.row').count(); console.log('F04 rows for "toilet":', rows);
  await page.getByLabel('Search phrases').fill('khǎw'); await page.waitForTimeout(100); console.log('F04 rows for "khǎw":', await page.locator('.row').count());
  await page.getByLabel('Search phrases').fill('khaw'); await page.waitForTimeout(100); console.log('F04 rows for "khaw" (no accents):', await page.locator('.row').count());
  await page.getByLabel('Search phrases').fill('zzzz'); await page.waitForTimeout(100); console.log('F04 empty state:', await page.locator('.empty').count());
  await page.getByLabel('Search phrases').fill(''); await page.waitForTimeout(100);
  await page.screenshot({ path: shots + '/S05-phrases.png' });
  // F05 settings: gender switch then check a phrase
  await page.getByRole('button', { name: 'Me', exact: true }).click(); await page.waitForTimeout(200);
  await page.screenshot({ path: shots + '/S06-me.png' });
  await page.getByRole('button', { name: 'khà / chǎn' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Phrases', exact: true }).click(); await page.waitForTimeout(200);
  await page.getByLabel('Search phrases').fill('my name'); await page.waitForTimeout(100);
  console.log('F05 female form:', (await page.locator('.row .th').first().innerText()));
  await page.getByRole('button', { name: 'Me', exact: true }).click(); await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'khráp / phǒm' }).click(); await page.waitForTimeout(100);
  // F02 talk: finish lessons 1.2 and 1.3 quickly by seeding state, then run the talk
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('nitnoy.v1')); s.lessons.u1l2 = { times: 1, best: 0 }; s.lessons.u1l3 = { times: 1, best: 0 }; localStorage.setItem('nitnoy.v1', JSON.stringify(s)); });
  await page.reload(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Unit 1 talk/ }).click(); await page.waitForTimeout(300);
  let g = 0;
  while (g++ < 20) {
    const done = await page.locator('.done-wrap').count(); if (done) break;
    const said = page.getByRole('button', { name: 'I said it' }); const cont = page.getByRole('button', { name: 'Continue' });
    const mic = page.getByRole('button', { name: 'Say your line' });
    if (await mic.count()) { if (g === 1) await page.screenshot({ path: shots + '/S07-talk.png' }); await mic.click(); await page.waitForTimeout(1500); console.log('talk status:', await page.locator('#sp .status').innerText().catch(()=>'-')); }
    const said2 = page.getByRole('button', { name: 'I said it' });
    if (await said2.count()) { await said2.click(); } else if (await cont.count()) await cont.click(); else if (await page.getByRole('button', { name: 'Cannot speak right now' }).count()) await page.getByRole('button', { name: 'Cannot speak right now' }).click(); else break;
    await page.waitForTimeout(120);
  }
  await page.screenshot({ path: shots + '/S07-talk-done.png' });
  const t = await page.evaluate(() => JSON.parse(localStorage.getItem('nitnoy.v1')).talks);
  console.log('F02 talk recorded:', JSON.stringify(t));
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: /Unit 1, lesson 3/ }).click(); await page.waitForTimeout(300); await runLesson(); console.log('F01 lesson 3 (build+say) done');
  // quit mid-lesson
  await page.getByRole('button', { name: /Unit 1, lesson 1/ }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Quit this lesson' }).click(); await page.getByRole('button', { name: 'Quit', exact: true }).click();
  console.log('F01-E1 quit works, overlay gone:', (await page.locator('#lesson').count()) === 0);
  // F07 backup and restore
  await page.getByRole('button', { name: 'Me', exact: true }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Copy backup code' }).click(); await page.waitForTimeout(100);
  const codeVal = await page.locator('#backup').inputValue(); console.log('F07 backup code starts with NITNOY1:', codeVal.startsWith('NITNOY1.'), 'length', codeVal.length);
  await page.evaluate(() => { localStorage.removeItem('nitnoy.v1'); }); await page.reload(); await page.waitForTimeout(400);
  const xpBefore = await page.evaluate(() => (JSON.parse(localStorage.getItem('nitnoy.v1') || '{"xp":0}')).xp); console.log('F07 xp after wipe:', xpBefore);
  await page.getByRole('button', { name: 'Me', exact: true }).click(); await page.waitForTimeout(200);
  await page.locator('#backup').fill(codeVal); await page.getByRole('button', { name: 'Restore from code' }).click(); await page.waitForTimeout(300);
  const xpAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('nitnoy.v1')).xp); console.log('F07 xp after restore:', xpAfter);
  await page.locator('#backup').fill('garbage'); await page.getByRole('button', { name: 'Restore from code' }).click(); await page.waitForTimeout(100); console.log('F07 bad code toast:', await page.locator('#toast').innerText());
  await page.screenshot({ path: shots + '/S06-backup.png' });
  await page.getByRole('button', { name: 'Learn', exact: true }).click(); await page.waitForTimeout(200);
  // dark mode screenshot
  await page.emulateMedia({ colorScheme: 'dark' }); await page.waitForTimeout(200); await page.screenshot({ path: shots + '/S01-dark.png' });
  // desktop width
  await page.setViewportSize({ width: 1440, height: 900 }); await page.emulateMedia({ colorScheme: 'light' }); await page.waitForTimeout(200); await page.screenshot({ path: shots + '/S01-desktop.png' });
  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
