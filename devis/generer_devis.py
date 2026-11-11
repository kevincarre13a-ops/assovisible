#!/usr/bin/env python3
"""Génère le devis AssoVisible -> Football Terrasses du Tarn (HTML puis PDF via Playwright).
Renseignez les champs IBAN / BIC / SIRET ci-dessous puis relancez : python3 devis/generer_devis.py"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))

# --- À compléter (laisser vide = champ surligné « à compléter » sur le devis) ---
SIRET = ""
IBAN = ""
BIC = ""
TITULAIRE = "Kevin Carré"
NUMERO = "DEVIS-2026-FTT-01"
DATE = "11 novembre 2026"
VALIDITE = "30 jours"

# --- Lignes du devis ---
LIGNES = [
    ("Création du site vitrine « Football Terrasses du Tarn » : 5 pages",
     "Accueil · Le club · Équipes · Matchs & résultats · Nous rejoindre / Contact. Design aux couleurs de l'écusson, adapté mobile et tablette, formulaire de contact, plan des stades, liens vers la ligue et le district, mentions légales incluses.",
     1, 390.00),
    ("Offre de lancement AssoVisible", "Remise commerciale sur la création du site.", 1, -100.00),
    ("Pages supplémentaires",
     "Actualités & événements · Galerie photos · Partenaires (3 pages à 9,90 € l'unité).", 3, 9.90),
    ("Hébergement, nom de domaine et assistance technique (12 mois)",
     "Hébergement sécurisé, nom de domaine, assistance technique en cas de problème (correction d'anomalies, aide à la mise à jour).", 1, 90.00),
]

def eur(x):
    s = f"{abs(x):,.2f}".replace(",", " ").replace(".", ",")
    return ("− " if x < 0 else "") + s + " €"

total = sum(q * p for _, _, q, p in LIGNES)
acompte = round(total * 0.30, 2)
solde = round(total - acompte, 2)

def champ(v, libelle):
    return v if v else f'<span class="todo">{libelle} à compléter</span>'

rows = ""
for d, sub, q, p in LIGNES:
    rows += f'''<tr><td><b>{d}</b><br><span class="sub">{sub}</span></td><td class="r">{q}</td><td class="r">{eur(p)}</td><td class="r">{eur(q * p)}</td></tr>'''

html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>{NUMERO}</title>
<style>
@page {{ size: A4; margin: 0 }}
* {{ box-sizing: border-box }}
body {{ margin: 0; font: 9.2pt/1.38 "Helvetica Neue", Arial, sans-serif; color: #17233b; }}
.page {{ width: 210mm; height: 296mm; overflow: hidden; padding: 11mm 15mm 12mm; position: relative; }}
.top {{ display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #e8761e; padding-bottom: 5mm; }}
.brand {{ font-size: 24pt; font-weight: 800; letter-spacing: -.5px; color: #1a3963; }}
.brand span {{ color: #e8761e; }}
.tag {{ color: #6b7790; font-size: 9pt; margin-top: 1mm; }}
.doc {{ text-align: right; }}
.doc h1 {{ margin: 0; font-size: 22pt; letter-spacing: 2px; color: #1a3963; }}
.doc div {{ color: #4a5873; font-size: 9.5pt; }}
.cols {{ display: flex; gap: 10mm; margin: 5mm 0 3mm; }}
.box {{ flex: 1; background: #f5f7fb; border-radius: 3mm; padding: 3.5mm 5mm; }}
.box h3 {{ margin: 0 0 2mm; font-size: 8pt; letter-spacing: 1.5px; text-transform: uppercase; color: #e8761e; }}
.box p {{ margin: 0; }}
.obj {{ margin: 0 0 2mm; font-size: 9.5pt; }}
table {{ width: 100%; border-collapse: collapse; }}
th {{ background: #1a3963; color: #fff; font-size: 8.5pt; letter-spacing: 1px; text-transform: uppercase; padding: 2.5mm 3mm; text-align: left; }}
td {{ padding: 1.8mm 3mm; border-bottom: 1px solid #e1e6ef; vertical-align: top; }}
.r {{ text-align: right; white-space: nowrap; }}
th.r {{ text-align: right; }}
.sub {{ color: #5b6985; font-size: 8.7pt; }}
.totals {{ width: 78mm; margin: 2mm 0 0 auto; }}
.totals div {{ display: flex; justify-content: space-between; padding: 1.5mm 3mm; }}
.totals .grand {{ background: #1a3963; color: #fff; font-weight: 800; font-size: 12pt; border-radius: 2mm; margin-top: 1.5mm; padding: 3mm; }}
.note {{ margin-top: 1.5mm; font-size: 8pt; color: #5b6985; text-align: right; }}
.grid2 {{ display: flex; gap: 8mm; margin-top: 3.5mm; }}
.grid2 .box {{ background: #fff; border: 1px solid #dde3ee; }}
.small {{ font-size: 8.8pt; color: #3d4a66; }}
.todo {{ background: #fff3bf; color: #7a5a00; padding: 0 1.5mm; border-radius: 1mm; font-weight: 600; }}
.sign {{ display: flex; gap: 8mm; margin-top: 4mm; }}
.sign .box {{ height: 19mm; background: #fff; border: 1px dashed #aab4c8; }}
.foot {{ position: absolute; left: 17mm; right: 17mm; bottom: 5mm; font-size: 7.8pt; color: #7a869e; text-align: center; border-top: 1px solid #e1e6ef; padding-top: 2.5mm; }}
</style></head><body><div class="page">
<div class="top">
  <div><img src="logo-assovisible.png" alt="AssoVisible" style="height:15mm;display:block"></div>
  <div class="doc"><h1>DEVIS</h1><div><b>N° {NUMERO}</b></div><div>Émis le {DATE}</div><div>Valable {VALIDITE}</div></div>
</div>
<div class="cols">
  <div class="box"><h3>Prestataire</h3><p><b>Kevin Carré — AssoVisible</b><br>Micro-entreprise (auto-entrepreneur)<br>Aix-en-Provence, France<br>SIRET : {champ(SIRET, "n° SIRET")}<br>contact@assovisible.fr · 06 47 47 45 81<br>assovisible.fr</p></div>
  <div class="box"><h3>Client</h3><p><b>Football Terrasses du Tarn (F.T.T)</b><br>À l'attention de Jérémy Mothes, président<br>9 Rue Grand-rue<br>82100 Labastide-du-Temple<br>jeremy.mothes@sfr.fr · 06 86 52 68 24</p></div>
</div>
<p class="obj"><b>Objet :</b> création du site internet du club Football Terrasses du Tarn, hébergement, nom de domaine et assistance technique.</p>
<table><thead><tr><th>Désignation</th><th class="r">Qté</th><th class="r">Prix unitaire</th><th class="r">Total</th></tr></thead><tbody>{rows}</tbody></table>
<div class="totals">
  <div class="grand"><span>TOTAL À PAYER</span><span>{eur(total)}</span></div>
</div>
<div class="note">TVA non applicable, article 293 B du CGI (franchise en base).</div>
<div class="grid2">
  <div class="box"><h3>Conditions de règlement</h3><p class="small">Acompte de 30 % à la commande : <b>{eur(acompte)}</b><br>Solde à la livraison, avant mise en ligne : <b>{eur(solde)}</b><br>Paiement par virement bancaire.<br>Livraison sous 5 jours ouvrés à compter de la réception de l'acompte et des contenus (textes, photos, logo).</p></div>
  <div class="box"><h3>Coordonnées bancaires</h3><p class="small">Titulaire : <b>{TITULAIRE}</b><br>IBAN : {champ(IBAN, "IBAN")}<br>BIC : {champ(BIC, "BIC")}<br>Référence à indiquer : <b>{NUMERO}</b></p></div>
</div>
<div class="sign">
  <div class="box"><h3>Bon pour accord — le client</h3><p class="small">Date, signature précédée de la mention « Bon pour accord » :</p></div>
  <div class="box"><h3>Le prestataire</h3><p class="small">Kevin Carré — AssoVisible<br>{DATE}</p></div>
</div>
<div class="foot">La signature du devis vaut acceptation des CGV (assovisible.fr/cgv) · AssoVisible — Kevin Carré, micro-entreprise · Aix-en-Provence · contact@assovisible.fr · 06 47 47 45 81</div>
</div></body></html>'''

src = os.path.join(HERE, "devis-football-terrasses-du-tarn.html")
out = os.path.join(HERE, "Devis-Football-Terrasses-du-Tarn-AssoVisible.pdf")
open(src, "w", encoding="utf8").write(html)
js = f'''const {{ chromium }} = require("playwright");
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
await p.goto("file://{src}"); await p.pdf({{ path: "{out}", format: "A4", printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();'''
tmp = os.path.join(HERE, "_pdf.cjs")
open(tmp, "w").write(js)
subprocess.run(["node", tmp], check=True)
os.remove(tmp)
print("Total", eur(total), "| acompte", eur(acompte), "| solde", eur(solde))
print(out)
