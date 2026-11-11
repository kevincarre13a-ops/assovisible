#!/usr/bin/env python3
"""Génère le devis AssoVisible -> Football Terrasses du Tarn (mise en page du devis DEV-2026-1106-HM).
Les coordonnées bancaires et l'identité légale sont lues dans coordonnees.local.json (non versionné).
Usage : python3 devis/generer_devis.py"""
import json, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(HERE, "coordonnees.local.json"), encoding="utf8"))

NUMERO = "DEV-2026-1111-FT"
EMIS = "11 novembre 2026"
VALIDE = "18 novembre 2026"
CLIENT = {
    "contact": "Jérémy Mothes, président",
    "asso": "Association Football Terrasses du Tarn (F.T.T)",
    "adresse": "9 Rue Grand-rue · 82100 Labastide-du-Temple",
    "site": "football-terrasses-du-tarn-ftt.netlify.app",
    "email": "jeremy.mothes@sfr.fr · 06 86 52 68 24",
}
PRIX_STANDARD, REMISE = 390.00, 100.00
NB_PAGES_SUP, PRIX_PAGE = 3, 9.90
HEBERGEMENT = 90.00

creation = PRIX_STANDARD - REMISE
pages = round(NB_PAGES_SUP * PRIX_PAGE, 2)
total = round(creation + pages + HEBERGEMENT, 2)
acompte = round(total * 0.30, 2)
solde = round(total - acompte, 2)

def eur(x):
    s = f"{abs(x):,.2f}".replace(",", " ").replace(".", ",") + " €"
    return ("−" + s) if x < 0 else s

CSS = """
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font: 8.9pt/1.35 "Liberation Sans", Helvetica, Arial, sans-serif; color: #1c2b3a; }
.page { width: 210mm; height: 297mm; padding: 10mm 16mm 10mm; position: relative; overflow: hidden; page-break-after: always; }
.page:last-child { page-break-after: auto }
.head { display: flex; justify-content: space-between; align-items: flex-start; }
.head img { height: 13mm; }
.meta { text-align: right; font-size: 8.3pt; color: #66758a; line-height: 1.7; }
.meta b { color: #12324f; font-size: 8.8pt; }
.meta .off { color: #12324f; font-weight: 700; margin-top: 1.5mm; }
.rule { height: 1.1mm; background: #f0821e; margin: 4mm 0 4mm; }
h1 { font-size: 19pt; margin: 0 0 1mm; color: #12324f; }
.sub { font-size: 8.2pt; color: #66758a; margin-bottom: 3.5mm; }
h2 { font-size: 11.2pt; color: #12324f; margin: 4.5mm 0 2mm; }
.two { display: flex; border: 1px solid #d7dee8; background: #f2f5f9; }
.two > div { flex: 1; padding: 2.4mm 4mm; }
.two > div + div { border-left: 1px solid #d7dee8; }
.lab { font-size: 7pt; letter-spacing: 1px; text-transform: uppercase; color: #66758a; font-weight: 700; margin-bottom: 1mm; }
.two b.n { color: #12324f; }
.two .s { color: #66758a; font-size: 8.4pt; }
table { width: 100%; border-collapse: collapse; }
.prest th { background: #12324f; color: #fff; font-size: 7.2pt; letter-spacing: .8px; text-transform: uppercase; text-align: left; padding: 2.4mm 3.5mm; }
.prest td { padding: 1.9mm 3.5mm; border: 1px solid #d7dee8; vertical-align: top; }
.prest td.d b { color: #12324f; display: block; }
.prest td.d span { color: #66758a; font-size: 8.6pt; }
.prest tr:nth-child(even) td { background: #f2f5f9; }
.prest td.q { width: 17mm; } .prest td.m { width: 33mm; font-weight: 700; color: #12324f; }
.prest .old { text-decoration: line-through; color: #8996a8; display: block; font-weight: 700; }
.prest .new { color: #f0821e; display: block; }
.prest .calc { color: #66758a; font-weight: 400; font-size: 8.4pt; }
.recap td { padding: 1.4mm 3.5mm; border: 1px solid #d7dee8; }
.recap td:last-child { text-align: right; width: 55mm; }
.recap .hl td { background: #f2f5f9; font-weight: 700; color: #12324f; }
.recap .tva td { color: #66758a; font-size: 8.4pt; }
.recap .tot td { background: #12324f; color: #fff; font-weight: 700; padding: 2.4mm 4mm; border-color: #12324f; font-size: 8.5pt; }
.recap .tot td:last-child { font-size: 13pt; }
.offre { margin-top: 3mm; padding: 2mm 3.5mm; background: #fff4e8; border: 1px solid #f0821e; font-size: 8.7pt; }
.pay td { padding: 1.6mm 3.5mm; border: 1px solid #d7dee8; font-weight: 700; color: #12324f; }
.pay td:first-child { background: #f2f5f9; } .pay td:last-child { text-align: right; width: 55mm; }
.bank { margin-top: 2.5mm; color: #66758a; font-size: 8.4pt; }
.foot { position: absolute; left: 17mm; right: 17mm; bottom: 8mm; border-top: 1px solid #d7dee8; padding-top: 2.5mm; font-size: 7.6pt; color: #66758a; display: flex; justify-content: space-between; }
ul { margin: 0; padding-left: 4.5mm; } li { margin-bottom: 1.5mm; }
p.c { margin: 0 0 2mm; } p.c b { color: #12324f; }
.sign .two > div { min-height: 30mm; }
.note { margin-top: 3.5mm; color: #66758a; font-size: 8.3pt; }
"""

HTML = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Devis {NUMERO} – AssoVisible – Football Terrasses du Tarn</title><style>{CSS}</style></head><body>
<div class="page">
  <div class="head"><img src="logo-assovisible.png" alt="AssoVisible">
    <div class="meta"><b>DEVIS N° {NUMERO}</b><br>Émis le {EMIS}<div class="off">OFFRE DE RENTRÉE</div>Valable jusqu’au {VALIDE} inclus</div></div>
  <div class="rule"></div>
  <h1>Création de site internet</h1>
  <div class="sub">Football Terrasses du Tarn · Devis personnalisé</div>
  <div class="two">
    <div><div class="lab">Devis à l’attention de</div><b class="n">{CLIENT['contact']}</b><br>{CLIENT['asso']}<br><span class="s">{CLIENT['adresse']}<br>Site concerné : {CLIENT['site']}<br>E-mail : {CLIENT['email']}</span></div>
    <div><div class="lab">Votre prestataire</div><b class="n">AssoVisible</b><br>{C['nom']}<br><span class="s">{C['adresse']}<br>SIREN : {C['siren']}<br>contact@assovisible.fr · 06 47 47 45 81</span></div>
  </div>

  <h2>01 · Détail des prestations</h2>
  <table class="prest"><thead><tr><th>Prestation</th><th>Qté</th><th>Montant</th></tr></thead><tbody>
    <tr><td class="d"><b>Création du site vitrine</b><span>Site de 5 pages, design personnalisé aux couleurs de l’écusson, intégration des contenus fournis, adaptation mobile et tablette, mise en ligne.</span></td><td class="q">1</td><td class="m"><span class="old">{eur(PRIX_STANDARD)}</span><span class="new">{eur(creation)}</span></td></tr>
    <tr><td class="d"><b>Pages supplémentaires</b><span>3 pages complémentaires au-delà des 5 pages incluses (Actualités &amp; événements, Galerie, Partenaires).</span></td><td class="q">{NB_PAGES_SUP}</td><td class="m">{eur(pages)}<br><span class="calc">{NB_PAGES_SUP} × {eur(PRIX_PAGE)}</span></td></tr>
    <tr><td class="d"><b>Hébergement, nom de domaine et assistance technique</b><span>Forfait pour la première année : hébergement sécurisé, nom de domaine, certificat SSL et assistance technique en cas de problème. Renouvellement : {eur(HEBERGEMENT)} par an.</span></td><td class="q">1 an</td><td class="m">{eur(HEBERGEMENT)}</td></tr>
    <tr><td class="d"><b>Mise en ligne et prise en main</b><span>Accompagnement de base à la livraison.</span></td><td class="q">Inclus</td><td class="m">0,00 €</td></tr>
  </tbody></table>

  <h2>02 · Récapitulatif financier</h2>
  <table class="recap">
    <tr><td>Création du site — tarif standard</td><td>{eur(PRIX_STANDARD)}</td></tr>
    <tr><td>Remise offre de rentrée</td><td>{eur(-REMISE)}</td></tr>
    <tr class="hl"><td>Création après remise</td><td>{eur(creation)}</td></tr>
    <tr><td>{NB_PAGES_SUP} pages supplémentaires</td><td>{eur(pages)}</td></tr>
    <tr><td>Hébergement, nom de domaine et assistance — première année</td><td>{eur(HEBERGEMENT)}</td></tr>
    <tr class="tva"><td>TVA non applicable, art. 293 B du CGI</td><td>0,00 €</td></tr>
    <tr class="tot"><td>TOTAL NET À PAYER</td><td>{eur(total)}</td></tr>
  </table>
  <div class="offre"><b>OFFRE DE RENTRÉE</b> · La remise de 100 € sur la création du site est valable jusqu’au <b>{VALIDE} inclus</b>. Pour en bénéficier, le devis doit être signé et l’acompte versé avant cette date.</div>
  <table class="pay" style="margin-top:3mm"><tr><td>Acompte à la signature (30 %)</td><td>{eur(acompte)}</td></tr><tr><td>Solde à la mise en ligne (70 %)</td><td>{eur(solde)}</td></tr></table>
  <div class="bank">Règlement par virement bancaire. Bénéficiaire : {C['beneficiaire']} · IBAN : {C['iban']} · BIC : {C['bic']}</div>
  <div class="foot"><span>AssoVisible · contact@assovisible.fr · 06 47 47 45 81 · assovisible.fr</span><span>{NUMERO} · 1</span></div>
</div>

<div class="page">
  <h1>Modalités &amp; validation</h1>
  <h2>03 · Prestations incluses</h2>
  <ul>
    <li>Site vitrine de 8 pages au total : 5 pages incluses et 3 pages supplémentaires.</li>
    <li>Design personnalisé, cohérent avec l’identité visuelle du club (écusson et couleurs).</li>
    <li>Intégration des textes, photos et informations transmis par le client.</li>
    <li>Affichage adapté aux ordinateurs, tablettes et téléphones.</li>
    <li>Contenus (équipes, matchs, actualités, événements, galerie, partenaires) organisés pour être mis à jour simplement.</li>
    <li>Liens vers la Ligue de Football d’Occitanie, le District de Tarn-et-Garonne et la FFF pour les calendriers et classements.</li>
    <li>Formulaire de contact et plan des terrains d’entraînement.</li>
    <li>Hébergement, nom de domaine et certificat SSL pour la première année.</li>
    <li>Assistance technique en cas de problème pendant la première année.</li>
    <li>Mise en ligne et accompagnement de base à la prise en main.</li>
  </ul>
  <h2>04 · Conditions générales</h2>
  <p class="c"><b>Validité.</b> Devis et offre de rentrée valables 1 semaine, jusqu’au {VALIDE} inclus.</p>
  <p class="c"><b>Contenus.</b> Le client fournit les textes, photos et documents nécessaires et garantit disposer des droits correspondants, y compris l’autorisation des parents pour toute photo d’enfant.</p>
  <p class="c"><b>Périmètre.</b> Toute demande hors des prestations décrites au présent devis pourra faire l’objet d’un devis complémentaire.</p>
  <p class="c"><b>Paiement.</b> Acompte de 30 % à la signature, solde de 70 % à la mise en ligne. TVA non applicable, art. 293 B du CGI.</p>
  <p class="c"><b>Renouvellement.</b> Hébergement, nom de domaine et assistance technique renouvelables à {eur(HEBERGEMENT)} par an à partir de la deuxième année.</p>
  <h2>05 · Bon pour accord</h2>
  <div class="two sign">
    <div><div class="lab">AssoVisible</div><b class="n">{C['nom']}</b><br><br>Date : __________________<br><br>Signature :</div>
    <div><div class="lab">Client</div><b class="n">{CLIENT['contact']}</b><br>{CLIENT['asso']}<br><br>Date : __________________<br><br>Signature précédée de la mention « Bon pour accord » :</div>
  </div>
  <div class="note">Le projet démarre à réception du devis signé et de l’acompte. Le solde est à régler à la mise en ligne.</div>
  <div class="foot"><span>AssoVisible · contact@assovisible.fr · 06 47 47 45 81 · assovisible.fr</span><span>{NUMERO} · 2</span></div>
</div></body></html>"""

src = os.path.join(HERE, "devis-football-terrasses-du-tarn.html")
out = os.path.join(HERE, "Devis-AssoVisible-Football-Terrasses-du-Tarn.pdf")
open(src, "w", encoding="utf8").write(HTML)
cjs = os.path.join(HERE, "_pdf.cjs")
open(cjs, "w").write(f'''const {{ chromium }} = require("playwright");
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
await p.goto("file://{src}"); await p.pdf({{ path: "{out}", format: "A4", printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();''')
subprocess.run(["node", cjs], check=True)
os.remove(cjs)
print(f"Création {eur(creation)} + pages {eur(pages)} + hébergement {eur(HEBERGEMENT)} = {eur(total)} | acompte {eur(acompte)} | solde {eur(solde)}")
