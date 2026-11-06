// Serveur de test local : reproduit Netlify (pages, fonctions, redirections) avec des « Blobs » en mémoire.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(here, '..', '..', 'eost-site');

export function memoryFactory() {
  const stores = new Map();
  return (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    const api = {
      async get(key, opts = {}) {
        const e = m.get(key); if (!e) return null;
        if (opts.type === 'json') return JSON.parse(e.data.toString());
        if (opts.type === 'arrayBuffer') return e.data.buffer.slice(e.data.byteOffset, e.data.byteOffset + e.data.byteLength);
        return e.data.toString();
      },
      async getWithMetadata(key, opts = {}) { const e = m.get(key); if (!e) return null; return { data: await api.get(key, opts), metadata: e.meta }; },
      async set(key, data, opts = {}) { m.set(key, { data: Buffer.from(typeof data === 'string' ? data : new Uint8Array(data)), meta: opts.metadata || {} }); },
      async setJSON(key, val, opts = {}) { m.set(key, { data: Buffer.from(JSON.stringify(val)), meta: opts.metadata || {} }); },
      async delete(key) { m.delete(key); },
      async list({ prefix = '' } = {}) { return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; },
    };
    return api;
  };
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };

export async function startServer({ port = 0, password = 'test-1234', resendCalls = [] } = {}) {
  globalThis.__EOST_STORE_FACTORY__ = memoryFactory();
  const { hashPassword } = await import(pathToFileURL(path.join(here, '..', 'fn', 'lib', 'auth.mjs')).href);
  process.env.SESSION_SECRET = 'secret-de-test-'.repeat(3);
  process.env.ADMIN_USER = 'eost';
  process.env.ADMIN_PASSWORD_HASH = await hashPassword(password);
  process.env.RESEND_API_KEY = 're_test_FAKE';
  process.env.CONTACT_TO = 'yannber.kemener1@orange.fr';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (u, o) => {
    if (String(u).startsWith('https://api.resend.com/')) { resendCalls.push({ url: String(u), headers: o.headers, body: JSON.parse(o.body) }); return new Response('{"id":"x"}', { status: 200 }); }
    return realFetch(u, o);
  };

  // redirections lues dans le vrai netlify.toml
  const toml = fs.readFileSync(path.join(site, 'netlify.toml'), 'utf8');
  const rules = [...toml.matchAll(/from = "([^"]+)"\s+to = "([^"]+)"\s+status = (\d+)\s+force = true/g)].map((m) => ({ from: m[1], to: m[2], status: +m[3] }));
  const cache = {};
  const load = async (name) => cache[name] || (cache[name] = (await import(pathToFileURL(path.join(site, 'netlify', 'functions', name + '.mjs')).href)).default);

  const server = http.createServer(async (req, res) => {
    try {
      const u = new URL(req.url, `http://localhost:${server.address().port}`);
      let p = u.pathname.replace(/\/+$/, '') || '/';
      let target = null;
      for (const r of rules) {
        const f = r.from.replace(/\/+$/, '') || '/';
        if (f.endsWith('/*')) { const base = f.slice(0, -2); if (p.startsWith(base + '/')) { target = r.to.replace(':splat', p.slice(base.length + 1)); break; } }
        else if (f === p) { target = r.to; break; }
      }
      if (target && target.startsWith('/404')) { res.statusCode = 404; return res.end('404'); }
      let fnUrl = null;
      if (target) fnUrl = new URL(target, u.origin);
      else if (p.startsWith('/.netlify/functions/')) fnUrl = new URL(req.url, u.origin);
      if (fnUrl) {
        for (const [k, v] of u.searchParams) if (!fnUrl.searchParams.has(k)) fnUrl.searchParams.set(k, v);
        const name = fnUrl.pathname.replace('/.netlify/functions/', '');
        const handler = await load(name);
        const chunks = []; for await (const c of req) chunks.push(c);
        const body = chunks.length ? Buffer.concat(chunks) : undefined;
        const headers = { ...req.headers, host: u.host };
        const request = new Request(fnUrl, { method: req.method, headers, body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body });
        const out = await handler(request, { ip: req.socket.remoteAddress });
        res.statusCode = out.status;
        const setCookie = out.headers.getSetCookie ? out.headers.getSetCookie() : [];
        out.headers.forEach((v, k) => { if (k !== 'set-cookie') res.setHeader(k, v); });
        if (setCookie.length) res.setHeader('Set-Cookie', setCookie);
        return res.end(Buffer.from(await out.arrayBuffer()));
      }
      let file = path.join(site, decodeURIComponent(u.pathname));
      if (!file.startsWith(site)) { res.statusCode = 403; return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('404'); }
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    } catch (e) { console.error('ERREUR serveur de test', e); res.statusCode = 500; res.end(String(e && e.stack)); }
  });
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  return { server, port: server.address().port, url: `http://localhost:${server.address().port}`, resendCalls, stop: () => { globalThis.fetch = realFetch; return new Promise((r) => server.close(r)); } };
}
