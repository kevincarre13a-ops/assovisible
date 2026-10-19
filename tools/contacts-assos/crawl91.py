#!/usr/bin/env python3
"""Vague unique de collecte : sites de mairie -> pages/PDF vie associative.
Usage: crawl91.py mairies91.json outdir
Stocke par commune un JSON {pages:[{url,kind,status,last_modified,meta_dates,text}], notes}.
"""
import sys, os, re, json, time, subprocess, tempfile, threading
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup

src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8", "Accept-Language": "fr-FR,fr;q=0.9",
      "Upgrade-Insecure-Requests": "1", "Sec-Fetch-Mode": "navigate"}
KEY = re.compile(r"asso|annuaire|vie-?locale|vie-?associ|guide|sport|culture|loisir|club|bénévol|benevol|animation|solidar", re.I)
STRONG = re.compile(r"annuaire|asso|vie-?associ|guide-?des|livret", re.I)
EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
MAXPAGES, MAXPDF = int(os.environ.get('MAXPAGES', 22)), int(os.environ.get('MAXPDF', 6))

class _R:
    pass

def curl_get(url, timeout):
    hdr = []
    for k, v in UA.items(): hdr += ["-H", "%s: %s" % (k, v)]
    p = subprocess.run(["curl", "-sS", "-L", "-m", str(timeout), "-D", "-", "--max-filesize", "26000000"] + hdr + [url], capture_output=True)
    raw = p.stdout
    # séparer les en-têtes (dernier bloc) du corps
    parts = raw.split(b"\r\n\r\n")
    idx = 0
    for i, part in enumerate(parts):
        if part.startswith(b"HTTP/"): idx = i
    head = parts[idx].decode("latin1"); body = b"\r\n\r\n".join(parts[idx + 1:])
    r = _R()
    m = head.split("\r\n")[0].split()
    r.status_code = int(m[1]) if len(m) > 1 and m[1].isdigit() else 0
    r.headers = {}
    for l in head.split("\r\n")[1:]:
        if ":" in l:
            k, v = l.split(":", 1); r.headers[k.strip().title()] = v.strip()
    r.content = body; r.text = body.decode("utf8", "ignore"); r.url = url
    return r

def get(url, timeout=20, stream=False):
    r = requests.get(url, headers=UA, timeout=timeout, allow_redirects=True, stream=stream)
    if r.status_code in (403, 418, 429):
        try:
            r2 = curl_get(url, timeout)
            if r2.status_code and r2.status_code < 400: return r2
        except Exception:
            pass
    return r

def deobf(html):
    h = html.replace("[at]", "@").replace("(at)", "@").replace("&#64;", "@").replace(" [arobase] ", "@")
    return h

def page_info(url, r):
    soup = BeautifulSoup(deobf(r.text), "html.parser")
    metas = {}
    for m in soup.find_all("meta"):
        k = (m.get("property") or m.get("name") or "").lower()
        if any(s in k for s in ("modified", "published", "date", "updated")):
            metas[k] = m.get("content")
    for t in soup.find_all("time"):
        if t.get("datetime"): metas.setdefault("time", []) if False else None
    times = [t.get("datetime") for t in soup.find_all("time") if t.get("datetime")][:10]
    mailtos = set(); ctxs = []
    def _cf(h):
        try:
            k = int(h[:2], 16); return "".join(chr(int(h[i:i + 2], 16) ^ k) for i in range(2, len(h), 2))
        except Exception:
            return ""
    for el in soup.find_all(attrs={"data-cfemail": True}):
        em = _cf(el["data-cfemail"])
        if "@" in em:
            mailtos.add(em)
            node = el; ctx = ""
            for _ in range(6):
                node = node.parent
                if node is None: break
                t = node.get_text(" | ", strip=True)
                if len(t) >= 40: ctx = t[:700]; break
            ctxs.append({"email": em, "ctx": ctx})
    for a in soup.find_all("a", href=True):
        if "/cdn-cgi/l/email-protection#" in a["href"]:
            em = _cf(a["href"].split("#", 1)[1])
            if "@" in em: mailtos.add(em); ctxs.append({"email": em, "ctx": a.parent.get_text(" | ", strip=True)[:700] if a.parent else ""})
    title = (soup.title.get_text(" ", strip=True) if soup.title else "")
    h1 = " | ".join(h.get_text(" ", strip=True) for h in soup.find_all(["h1"])[:2])
    metas["_title"] = title; metas["_h1"] = h1
    for a in soup.find_all("a", href=True):
        h = a["href"]
        if h.lower().startswith("mailto:"):
            em = h[7:].split("?")[0].strip(); mailtos.add(em)
            node = a; ctx = ""
            for _ in range(6):
                node = node.parent
                if node is None: break
                t = node.get_text(" | ", strip=True)
                if len(t) >= 40:
                    ctx = t[:700]; break
            ctxs.append({"email": em, "ctx": ctx})
    metas["_mail_ctx"] = ctxs
    for s in soup(["script", "style", "noscript"]): s.decompose()
    text = soup.get_text("\n", strip=True)
    links = [(urljoin(url, a["href"]).split("#")[0], a.get_text(" ", strip=True)) for a in soup.find_all("a", href=True)
             if not a["href"].lower().startswith(("mailto:", "tel:", "javascript:"))]
    return text, sorted(mailtos), metas, times, links

def pdf_text(content):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(content); p = f.name
    try:
        txt = subprocess.run(["pdftotext", "-layout", p, "-"], capture_output=True, timeout=90).stdout.decode("utf8", "ignore")
        raw = subprocess.run(["pdftotext", p, "-"], capture_output=True, timeout=90).stdout.decode("utf8", "ignore")
        info = subprocess.run(["pdfinfo", p], capture_output=True, timeout=30).stdout.decode("utf8", "ignore")
    except Exception as e:
        txt, raw, info = "", "", str(e)
    os.unlink(p)
    m = re.search(r"CreationDate:\s*(.*)", info); mm = re.search(r"ModDate:\s*(.*)", info)
    return (txt, raw), {"CreationDate": m.group(1) if m else None, "ModDate": mm.group(1) if mm else None}

def score(url, label):
    s = 0
    u = (url + " " + label).lower()
    if STRONG.search(u): s += 5
    if KEY.search(u): s += 2
    if url.lower().split("?")[0].endswith(".pdf"): s += 1
    return s

def crawl(code, entries):
    res = {"code": code, "mairie": entries[0]["nom"], "site": "", "pages": [], "notes": []}
    site = next((e["site"] for e in entries if e["site"]), "")
    if not site:
        res["notes"].append("pas de site déclaré"); return res
    if not site.startswith("http"): site = "http://" + site
    res["site"] = site
    try:
        r = get(site)
    except Exception as e:
        res["notes"].append("home inaccessible: %s" % type(e).__name__); return res
    if r.status_code >= 400:
        res["notes"].append("home HTTP %s" % r.status_code); return res
    base = r.url; host = urlparse(base).netloc.replace("www.", "")
    seen = {base}; queue = []; npdf = 0
    text, mailtos, metas, times, links = page_info(base, r)
    res["pages"].append({"url": base, "kind": "html", "status": r.status_code, "last_modified": r.headers.get("Last-Modified"),
                         "meta_dates": metas, "times": times, "mailtos": mailtos, "text": text[:20000]})
    if len(text) < 300: res["notes"].append("home quasi vide (JS ?)")
    def push(links, depth):
        for u, lab in links:
            if u in seen: continue
            pu = urlparse(u)
            same = pu.netloc.replace("www.", "") == host
            ispdf = pu.path.lower().endswith(".pdf")
            if not same and not ispdf: continue
            if not same and ispdf and host.split(".")[0] not in pu.netloc: continue
            sc = score(u, lab)
            if sc < 2: continue
            seen.add(u); queue.append((sc, depth, u))
    push(links, 1)
    # sitemap hint
    n = 0
    while queue and n < MAXPAGES:
        queue.sort(key=lambda x: (-x[0], x[1])); sc, depth, u = queue.pop(0)
        try:
            if u.lower().split("?")[0].endswith(".pdf"):
                if npdf >= MAXPDF: continue
                rr = get(u, timeout=40)
                if rr.status_code >= 400 or len(rr.content) > 25_000_000: continue
                (txt, rawtxt), info = pdf_text(rr.content); npdf += 1
                res["pages"].append({"url": u, "kind": "pdf", "status": rr.status_code, "last_modified": rr.headers.get("Last-Modified"),
                                     "pdfinfo": info, "mailtos": [], "text": txt[:300000], "text_raw": rawtxt[:300000]})
            else:
                rr = get(u)
                if rr.status_code >= 400 or "html" not in rr.headers.get("Content-Type", "html"): continue
                t, mt, mm, tm, lk = page_info(rr.url, rr)
                res["pages"].append({"url": rr.url, "kind": "html", "status": rr.status_code, "last_modified": rr.headers.get("Last-Modified"),
                                     "meta_dates": mm, "times": tm, "mailtos": mt, "text": t[:60000]})
                if depth < 4: push(lk, depth + 1)
            n += 1
        except Exception as e:
            res["notes"].append("err %s: %s" % (u[:80], type(e).__name__))
    if len(res["pages"]) == 1: res["notes"].append("aucune page asso trouvée")
    return res

def work(item):
    code, entries = item
    fn = os.path.join(outdir, code + ".json")
    if os.path.exists(fn): return
    try:
        res = crawl(code, entries)
    except Exception as e:
        res = {"code": code, "mairie": entries[0]["nom"], "pages": [], "notes": ["crash %r" % e]}
    json.dump(res, open(fn, "w"), ensure_ascii=False)
    print(code, res["mairie"], len(res["pages"]), res["notes"][:2], flush=True)

data = json.load(open(src))
with ThreadPoolExecutor(12) as ex:
    list(ex.map(work, data.items()))
print("DONE")
