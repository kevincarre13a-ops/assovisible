#!/usr/bin/env python3
"""Assemble le classeur Excel final. Usage: assemble91.py scratchdir out.xlsx"""
import sys, os, json, glob, re
from collections import Counter, defaultdict
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

S, OUT = sys.argv[1], sys.argv[2]
PRIO = {"Sport": 0, "Loisirs-Culture": 1, "Solidarité": 2, "Autre": 3}
HDR = ["nom_association", "ville", "email", "telephone", "source", "date_source", "categorie", "type_de_date"]

# ---- fusion décisions agents + données source --------------------------------
rows = []
missing = 0
for z in range(1, 6):
    full = {r["i"]: r for r in json.load(open(os.path.join(S, "chunks", f"zone{z}_full.json")))}
    dec = {}
    for fn in glob.glob(os.path.join(S, "chunks", f"out_z{z}_*.jsonl")):
        for l in open(fn):
            l = l.strip()
            if not l: continue
            try: d = json.loads(l)
            except Exception: continue
            dec[int(d["i"])] = d
    for i, r in full.items():
        d = dec.get(i)
        if not d:
            missing += 1; continue
        rows.append({"zone": z, "i": i, "commune": r["commune"], "email": r["email"], "url": r["url"], "date": r["date"], "basis": r["basis"],
                     "kind": r["kind"], "keep": bool(d.get("keep")), "name": (d.get("name") or "").strip(), "cat": d.get("cat") or "",
                     "phone": (d.get("phone") or "").strip(), "conf": d.get("conf") or "low", "reason": d.get("reason") or ""})

def phone_ok(p):
    d = re.sub(r"\D", "", p)
    if len(d) == 10 and d[0] == "0": return " ".join(d[k:k + 2] for k in range(0, 10, 2))
    return ""
for r in rows: r["phone"] = phone_ok(r["phone"])

def short_basis(b):
    if b.startswith("PDF"): return "PDF de mairie (date du fichier)" if "saison" not in b else "PDF de mairie (saison indiquée)"
    if b.startswith("page"): return "page de mairie datée"
    if b.startswith("site"): return b.replace("site mairie actif", "site de mairie actif")
    return b

for r in rows:
    if r["keep"] and r["basis"].startswith("site") and (r["date"] or "") < "2025-01-01":
        r["keep"] = False; r["reason"] = "site de mairie non actif (dernière actualité avant 2025) et page sans date propre"
kept = [r for r in rows if r["keep"] and r["name"] and r["cat"] in PRIO]
# dédoublonnage global par email : on garde la meilleure ligne (conf haute, date récente)
best = {}
dups = 0
for r in kept:
    k = r["email"]
    score = (r["conf"] == "high", r["date"] or "", r["kind"] == "html")
    if k not in best: best[k] = (score, r)
    else:
        dups += 1
        if score > best[k][0]: best[k] = (score, r)
uniq = [v[1] for v in best.values()]
main = [r for r in uniq if r["conf"] == "high" and r["cat"] in ("Sport", "Loisirs-Culture", "Solidarité")]
autres = [r for r in uniq if r["conf"] == "high" and r["cat"] == "Autre"]
verif = [r for r in uniq if r["conf"] != "high"]
excl = [r for r in rows if not r["keep"]]
srt = lambda r: (PRIO.get(r["cat"], 9), r["commune"], r["name"].lower())
main.sort(key=srt); autres.sort(key=srt); verif.sort(key=srt)

# ---- classeur ----------------------------------------------------------------
wb = Workbook()
def sheet(ws, header, data, widths):
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor="1F3A5F"); c.alignment = Alignment(vertical="center")
    for row in data: ws.append(row)
    for k, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(k)].width = w
    ws.freeze_panes = "A2"; ws.auto_filter.ref = ws.dimensions
def rowof(r):
    return [r["name"], r["commune"], r["email"], r["phone"], r["url"], r["date"], r["cat"], short_basis(r["basis"])]

ws = wb.active; ws.title = "Contacts"
sheet(ws, HDR, [rowof(r) for r in main], [44, 24, 36, 16, 70, 12, 16, 38])
ws2 = wb.create_sheet("Autres associations")
sheet(ws2, HDR, [rowof(r) for r in autres], [44, 24, 36, 16, 70, 12, 16, 38])
ws3 = wb.create_sheet("A verifier (nom incertain)")
sheet(ws3, HDR, [rowof(r) for r in verif], [44, 24, 36, 16, 70, 12, 16, 38])

st = json.load(open(os.path.join(S, "communes_status.json")))
kept_by_commune = Counter(r["commune"] for r in main)
ws4 = wb.create_sheet("Communes")
crows = []
for code, v in sorted(st.items(), key=lambda kv: (kv[1]["zone"], kv[1]["commune"])):
    crows.append([v["commune"], code, v["zone"], v["site"] or "", v["statut"], v["pages_total"], v["site_active_date"] or "", kept_by_commune.get(v["commune"], 0)])
sheet(ws4, ["commune", "code_insee", "zone", "site_mairie", "statut_collecte", "pages_lues", "derniere_activite_site", "contacts_retenus"], crows, [30, 11, 6, 44, 60, 10, 20, 16])

ws5 = wb.create_sheet("Exclus (curation)")
sheet(ws5, ["ville", "email", "nom_detecte", "motif", "source"], [[r["commune"], r["email"], r["name"], r["reason"], r["url"]] for r in sorted(excl, key=lambda r: (r["commune"], r["email"]))], [24, 36, 40, 50, 70])

pre = json.load(open(os.path.join(S, "rejected_prefilter.json")))
pre_c = Counter(r["reject"] for r in pre)
ws6 = wb.create_sheet("Synthese", 0)
ws6.append(["Base de contacts associations loi 1901 - Essonne (91)"]); ws6["A1"].font = Font(bold=True, size=14)
ws6.append(["Collecte du 2026-10-19 - sources: sites officiels de mairies et PDF publiés par les mairies uniquement"])
ws6.append([])
cats = Counter(r["cat"] for r in main)
lines = [("Contacts retenus (feuille Contacts)", len(main)), ("  dont Sport", cats["Sport"]), ("  dont Loisirs-Culture", cats["Loisirs-Culture"]), ("  dont Solidarité", cats["Solidarité"]),
         ("Autres associations (hors 3 catégories prioritaires)", len(autres)), ("Nom incertain, à vérifier à la main", len(verif)),
         ("Doublons d'email fusionnés", dups), ("Exclus par la curation (filtres associations, non-assos…)", len(excl)),
         ("Exclus avant curation: source antérieure à 2021", pre_c["source antérieure à 2021"]),
         ("Exclus avant curation: date de source introuvable", pre_c["date_source introuvable"]),
         ("Exclus avant curation: email du domaine de la mairie", pre_c["email du domaine de la mairie (service communal)"]),
         ("Exclus avant curation: domaine sans MX/A", pre_c["domaine sans MX/A (email non délivrable)"]),
         ("Lignes non traitées par la curation", missing)]
for a, b in lines: ws6.append([a, b])
ws6.append([])
cs = Counter(v["statut"].split(":")[0].split(" (")[0] for v in st.values())
ws6.append(["Communes (195 mairies dans l'annuaire officiel)", sum(cs.values())])
for k, n in cs.items(): ws6.append(["  " + k, n])
ws6.column_dimensions["A"].width = 70; ws6.column_dimensions["B"].width = 12
wb.save(OUT)
print("OK", OUT, "| main", len(main), cats, "| autres", len(autres), "| verif", len(verif), "| excl", len(excl), "| dups", dups, "| missing", missing)
