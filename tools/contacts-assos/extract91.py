#!/usr/bin/env python3
"""Extraction des candidats (email + contexte + date de source) depuis raw91/*.json.
Usage: extract91.py scratchdir
Sorties: candidates_all.jsonl, candidates_zone{1..5}.jsonl, communes_status.json
"""
import sys, os, re, json, glob, datetime as dt, urllib.parse, concurrent.futures as cf
import requests

S = sys.argv[1]
TODAY = dt.date(2026, 10, 19)
MONTHS = {"janvier": 1, "février": 2, "fevrier": 2, "mars": 3, "avril": 4, "mai": 5, "juin": 6, "juillet": 7, "août": 8, "aout": 8,
          "septembre": 9, "octobre": 10, "novembre": 11, "décembre": 12, "decembre": 12}
RE_FR = re.compile(r"\b(\d{1,2})(?:er)?\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(20\d\d)\b", re.I)
RE_SL = re.compile(r"\b(\d{1,2})[/.](\d{1,2})[/.](20\d\d)\b")
RE_ISO = re.compile(r"\b(20\d\d)-(\d\d)-(\d\d)")
RE_EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}")
RE_SEASON = re.compile(r"\b(20\d\d)\s*[-/–]\s*(20\d\d|\d\d)\b")
BADTLD = {"png", "jpg", "jpeg", "gif", "svg", "webp", "css", "js", "pdf"}
GENERIC = re.compile(r"^(no-?reply|webmaster|postmaster|dpo|rgpd|privacy|cnil)@", re.I)

def mkdate(y, m, d):
    try:
        x = dt.date(int(y), int(m), int(d))
        return x if dt.date(2015, 1, 1) <= x <= TODAY else None
    except Exception:
        return None

def dates_in(text):
    out = []
    for m in RE_FR.finditer(text):
        out.append(mkdate(m[3], MONTHS[m[2].lower()], m[1]))
    for m in RE_SL.finditer(text):
        out.append(mkdate(m[3], m[2], m[1]))
    for m in RE_ISO.finditer(text):
        out.append(mkdate(m[1], m[2], m[3]))
    return [d for d in out if d]

def parse_http_date(s):
    if not s: return None
    try:
        from email.utils import parsedate_to_datetime
        d = parsedate_to_datetime(s).date()
        return d if d <= TODAY else None
    except Exception:
        return None

def parse_pdf_date(s):
    if not s: return None
    m = re.search(r"(\d{4})-(\d\d)-(\d\d)", s) or re.search(r"D:(\d{4})(\d\d)(\d\d)", s)
    if m: return mkdate(*m.groups())
    try:
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(s).date()
    except Exception:
        pass
    m = re.search(r"(\w{3})\s+(\w{3})\s+(\d+)\s+[\d:]+\s+(20\d\d)", s)  # pdfinfo: Tue Sep  2 10:08:23 2025
    if m:
        mon = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}.get(m[2])
        return mkdate(m[4], mon, m[3]) if mon else None
    return None

def season_year(text):
    ys = []
    for m in RE_SEASON.finditer(text[:6000]):
        a = int(m[1]); b = m[2]; b = int(b) if len(b) == 4 else int(str(a)[:2] + b)
        if b == a + 1 and 2015 <= a <= 2026: ys.append(b)
    return max(ys) if ys else None

def meta_dates(p):
    out = []
    for k, v in (p.get("meta_dates") or {}).items():
        if k.startswith("_"): continue
        for s in (v if isinstance(v, list) else [v]):
            if isinstance(s, str):
                m = RE_ISO.search(s)
                if m:
                    d = mkdate(*m.groups());
                    if d: out.append(d)
    for s in p.get("times") or []:
        m = RE_ISO.search(s or "")
        if m:
            d = mkdate(*m.groups());
            if d: out.append(d)
    return out

def domain(email): return email.split("@")[1].lower()

def host_root(url):
    h = urllib.parse.urlparse(url).netloc.lower().replace("www.", "")
    return h

def clean_email(e):
    e = e.strip().strip(".,;:()<>[]\"'").lower()
    e = re.sub(r"^(mailto:)", "", e)
    return e

def valid_email(e):
    if not RE_EMAIL.fullmatch(e): return False
    tld = e.rsplit(".", 1)[1]
    if tld in BADTLD or "@2x" in e or "@3x" in e: return False
    if GENERIC.match(e): return False
    return True

# ---- zones ------------------------------------------------------------------
geo = json.load(open(os.path.join(S, "geo91.json")))
ZONE_OF_EPCI = {
    "200056232": 1, "247800584": 1,
    "200057859": 2, "249100074": 2, "249100595": 2,
    "200059228": 3, "249100546": 3,
    "200058477": 4, "200054781": 4, "247700644": 4,
    "200017846": 5, "249100553": 5, "249100157": 5,
}
ZNAMES = {1: "Paris-Saclay (Massy, Palaiseau, Les Ulis, Gif, Orsay, Bièvres…)",
          2: "Cœur d'Essonne + Pays de Limours + Dourdannais (Sainte-Geneviève, Brétigny, Arpajon, Limours, Dourdan…)",
          3: "Grand Paris Sud + Val d'Essonne (Évry-Courcouronnes, Corbeil, Ris-Orangis, Mennecy, La Ferté-Alais…)",
          4: "Val d'Yerres Val de Seine + Grand-Orly Seine Bièvre (Yerres, Brunoy, Draveil, Savigny, Athis-Mons, Viry, Juvisy…)",
          5: "Étampois Sud-Essonne + Entre Juine et Renarde + 2 Vallées (Étampes, Angerville, Étréchy, Milly-la-Forêt, Maisse…)"}
zone_of = {g["code"]: ZONE_OF_EPCI.get(g.get("codeEpci"), 5) for g in geo}
name_of = {g["code"]: g["nom"] for g in geo}

# ---- collecte ---------------------------------------------------------------
cands = {}   # (code,email) -> dict
status = {}
for fn in sorted(glob.glob(os.path.join(S, "raw91", "*.json"))):
    d = json.load(open(fn)); code = d["code"]
    commune = name_of.get(code) or d["mairie"].replace("Mairie - ", "")
    pages = d.get("pages", [])
    st = {"code": code, "commune": commune, "zone": zone_of.get(code, 5), "site": d.get("site"), "notes": d.get("notes", []),
          "pages_total": len(pages), "emails_total": 0, "emails_kept": 0, "site_active_date": None}
    if not pages:
        st["statut"] = "irrécupérable: " + ("; ".join(d.get("notes", [])) or "aucune page")
        status[code] = st; continue
    site_host = host_root(pages[0]["url"])
    # activité du site: dates sur home + metas/Last-Modified des pages HTML
    act = []
    for p in pages:
        if p["kind"] == "html":
            act += meta_dates(p)
            lm = parse_http_date(p.get("last_modified"));  act += [lm] if lm else []
    home = pages[0]
    act += dates_in(home["text"])
    for p in pages[1:]:
        if p["kind"] == "html" and not re.search(r"annuaire|association|asso", p["url"], re.I):
            act += dates_in(p["text"][:15000])   # pages actualités
    # copyright
    m = re.findall(r"©\s*(20\d\d)|copyright\s*(20\d\d)", home["text"], re.I)
    site_active = max(act) if act else None
    st["site_active_date"] = site_active.isoformat() if site_active else None
    for p in pages:
        kind = p["kind"]
        if kind == "pdf":
            pd = parse_http_date(p.get("last_modified"))
            info = p.get("pdfinfo") or {}
            cands_dates = [x for x in (pd, parse_pdf_date(info.get("ModDate")), parse_pdf_date(info.get("CreationDate"))) if x]
            sy = season_year(p["text"])
            if cands_dates:
                pdate = max(cands_dates); basis = "PDF (en-tête HTTP / métadonnées)"
            elif sy:
                pdate = dt.date(sy, 9, 1); basis = "PDF (saison %d-%d mentionnée)" % (sy - 1, sy)
            else:
                pdate = None; basis = ""
            # le PDF peut afficher une saison plus parlante que sa date de mise en ligne
            text = p["text"]
            lines = [re.sub(r"\s+", " ", l).strip() for l in text.splitlines()]
            for i, l in enumerate(lines):
                for em in RE_EMAIL.findall(l):
                    e = clean_email(em)
                    if not valid_email(e): continue
                    ctx = " ¦ ".join(x for x in lines[max(0, i - 4):i + 2] if x)[:420]
                    k = (code, e)
                    rec = cands.setdefault(k, {"code": code, "commune": commune, "zone": st["zone"], "email": e, "ctx": [], "url": p["url"],
                                                "kind": "pdf", "date": None, "basis": "", "title": ""})
                    if len(rec["ctx"]) < 2: rec["ctx"].append(ctx)
                    if pdate and (rec["date"] is None or pdate > rec["date"]):
                        rec["date"], rec["basis"], rec["url"], rec["kind"] = pdate, basis, p["url"], "pdf"
        else:
            md = p.get("meta_dates") or {}
            title = (md.get("_h1") or md.get("_title") or "")[:120]
            own = meta_dates(p); lm = parse_http_date(p.get("last_modified"))
            own = own + ([lm] if lm else [])
            pdate = max(own) if own else None
            basis = "page HTML (métadonnée de date)" if pdate else ""
            if not pdate and site_active:
                pdate, basis = site_active, "site mairie actif (actualité du %s)" % site_active.isoformat()
            seen_here = set()
            for item in md.get("_mail_ctx", []):
                e = clean_email(item["email"])
                if not valid_email(e) or e in seen_here: continue
                seen_here.add(e)
                k = (code, e)
                rec = cands.setdefault(k, {"code": code, "commune": commune, "zone": st["zone"], "email": e, "ctx": [], "url": p["url"],
                                            "kind": "html", "date": None, "basis": "", "title": title})
                if len(rec["ctx"]) < 2: rec["ctx"].append(item["ctx"][:420])
                if pdate and (rec["date"] is None or pdate > rec["date"] or (rec["kind"] == "html" and rec["basis"].startswith("site") and basis.startswith("page"))):
                    rec["date"], rec["basis"], rec["url"], rec["kind"], rec["title"] = pdate, basis, p["url"], "html", title
            for em in RE_EMAIL.findall(p["text"]):
                e = clean_email(em)
                if not valid_email(e) or e in seen_here: continue
                seen_here.add(e)
                i = p["text"].find(em)
                ctx = re.sub(r"\s+", " ", p["text"][max(0, i - 220):i + 80])
                k = (code, e)
                rec = cands.setdefault(k, {"code": code, "commune": commune, "zone": st["zone"], "email": e, "ctx": [], "url": p["url"],
                                            "kind": "html", "date": None, "basis": "", "title": title})
                if len(rec["ctx"]) < 2: rec["ctx"].append(ctx)
                if pdate and (rec["date"] is None or pdate > rec["date"]):
                    rec["date"], rec["basis"], rec["url"], rec["kind"], rec["title"] = pdate, basis, p["url"], "html", title
    st["site_host"] = site_host
    status[code] = st

# ---- filtres email ----------------------------------------------------------
final = []
for (code, e), r in cands.items():
    st = status[code]; st["emails_total"] += 1
    dom = domain(e)
    sh = st.get("site_host", "")
    root = ".".join(sh.split(".")[-2:]) if sh else ""
    r["reject"] = None
    if r["date"] is None: r["reject"] = "date_source introuvable"
    elif r["date"] < dt.date(2021, 1, 1): r["reject"] = "source antérieure à 2021"
    elif root and (dom == root or dom.endswith("." + root)): r["reject"] = "email du domaine de la mairie (service communal)"
    final.append(r)

# ---- MX via DoH -------------------------------------------------------------
doms = sorted({domain(r["email"]) for r in final if not r["reject"]})
def mx(dm):
    for attempt in range(3):
        try:
            j = requests.get("https://dns.google/resolve", params={"name": dm, "type": "MX"}, headers={"accept": "application/dns-json"}, timeout=15).json()
            if j.get("Status") == 0 and j.get("Answer"):
                return dm, any(a["type"] == 15 and a["data"].strip(". ") not in ("", "0") for a in j["Answer"]) or False
            if j.get("Status") == 3: return dm, False
            j2 = requests.get("https://dns.google/resolve", params={"name": dm, "type": "A"}, headers={"accept": "application/dns-json"}, timeout=15).json()
            return dm, bool(j2.get("Answer"))
        except Exception:
            continue
    return dm, None
mxres = {}
with cf.ThreadPoolExecutor(8) as ex:
    for dm, ok in ex.map(mx, doms): mxres[dm] = ok
for r in final:
    if not r["reject"]:
        ok = mxres.get(domain(r["email"]))
        r["mx"] = ok
        if ok is False: r["reject"] = "domaine sans MX/A (email non délivrable)"
        elif ok is None: r["mx"] = None

out_all = open(os.path.join(S, "candidates_all.jsonl"), "w")
zf = {z: open(os.path.join(S, "candidates_zone%d.jsonl" % z), "w") for z in range(1, 6)}
kept = rej = 0
rej_rows = []
for r in final:
    row = dict(r); row["date"] = r["date"].isoformat() if r["date"] else None
    row["ctx"] = r["ctx"]
    out_all.write(json.dumps(row, ensure_ascii=False) + "\n")
    if r["reject"]:
        rej += 1; rej_rows.append(row); continue
    kept += 1; status[r["code"]]["emails_kept"] += 1
    zf[r["zone"]].write(json.dumps({k: row[k] for k in ("commune", "email", "ctx", "title", "url", "kind", "date", "basis", "mx")}, ensure_ascii=False) + "\n")
for code, st in status.items():
    if "statut" not in st:
        st["statut"] = "ok (%d emails retenus)" % st["emails_kept"] if st["emails_kept"] else ("sans contact exploitable" + (": " + "; ".join(st["notes"][:2]) if st["notes"] else ""))
json.dump(status, open(os.path.join(S, "communes_status.json"), "w"), ensure_ascii=False, indent=1)
json.dump(rej_rows, open(os.path.join(S, "rejected_prefilter.json"), "w"), ensure_ascii=False)
from collections import Counter
print("candidats:", len(final), "retenus pré-filtre:", kept, "rejetés:", rej)
print(Counter(r["reject"] for r in final if r["reject"]))
print("par zone:", Counter(r["zone"] for r in final if not r["reject"]))
print("communes:", Counter(s["statut"].split(":")[0].split(" (")[0] for s in status.values()))
