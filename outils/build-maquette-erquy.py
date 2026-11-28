# -*- coding: utf-8 -*-
# Maquette v2 : Festival et Murder Party intégrés à la saison, une fiche détaillée par spectacle.
import os, html, datetime
OUT = "/home/user/assovisible/erquy-enscene"
HELLO = "https://www.helloasso.com/associations/erquy-en-scene"
OT = "https://www.capderquy-valandre.com/"
MAIRIE = "https://www.ville-erquy.com/"
AGENDA = "https://www.agendaou.fr/culture.html"
PASS = "https://pass.culture.fr/"
TEL = "02 57 25 22 22"; TELHREF = "tel:+33257252222"
BASE_TITLE = "Erquy en Scène"
AUJOURDHUI = datetime.date(2026, 11, 28)

def esc(s): return html.escape(s, quote=True)

RULE = "Pour bénéficier du tarif réduit de 17 € et de 22 € par et selon le spectacle, il faut en choisir 3 en dehors de celui du Festival du Théâtre des Amateurs."
VERRE = "Pour rappel, après chaque spectacle, nous partageons le verre de l'amitié, sauf pour les spectacles du Festival du Théâtre des Amateurs."

# ---------- Saison (site actuel + affiche générale officielle) ----------
# type "spectacle" = fiche détaillée ; "evenement" = simple mention dans le déroulé
S = [
 dict(id="divine-lemon", type="evenement", titre="Divine Lemon", genre="Présentation de la saison · Concert pop rock", date="Samedi 5 septembre 2026", heure="18h", lieu="L'Ancre des Mots",
      iso="2026-09-05", court="5 sept.", prix=["Entrée libre"], img=None,
      txt="Lancement de la saison en musique, en entrée libre."),
 dict(id="tout-ce-que-vous-voulez", type="spectacle", titre="Tout ce que vous voulez", genre="Comédie", date="Samedi 3 octobre 2026", heure="20h30",
      iso="2026-10-03", court="3 oct.", prix=["20 €","17 €"], img="tcqvv.jpg", photo="photo-tcqvv.jpg", yt="RhcZb2Bvr2s",
      chapo="Une autrice heureuse… donc en panne d'inspiration.",
      recit="Lucie est une autrice à succès… mais depuis qu'elle est heureuse, elle n'écrit plus une ligne. Elle qui n'a jamais écrit que sur le malheur a perdu l'inspiration le jour où elle a trouvé le bonheur. Si seulement quelqu'un pouvait la rendre un peu malheureuse… Heureusement, la vie est mal faite : l'arrivée de Thomas, son nouveau voisin, va tout changer. Matthieu Delaporte et Alexandre de la Patellière, les auteurs du « Prénom », explorent ici l'alchimie d'une rencontre : d'où vient cette attraction inexplicable qui rapproche deux êtres que tout sépare ? Une comédie aux dialogues ciselés, « coup de cœur » Avignon 2025.",
      citations=[("Un ravissement pur… inoubliable","Ouest-France"),("Les dialogues claquent et l'humour mordant fait mouche","Culture Avignon")]),
 dict(id="terreur", type="spectacle", titre="Terreur", genre="Procès fiction · Les spectateurs sont les jurés", date="Samedi 31 octobre 2026", heure="20h30",
      iso="2026-10-31", court="31 oct.", prix=["25 €","22 €"], img="terreur.jpg", photo="photo-terreur.jpg", yt=None,
      chapo="Condamner ou acquitter ? C'est vous, le jury, qui décidez.",
      recit="Le 26 septembre 2024, Laura Koch, pilote de chasse de l'armée allemande, abat un avion de ligne détourné par un terroriste. Le pirate de l'air menaçait d'écraser l'appareil sur un stade où 70 000 personnes assistaient à un match international. Laura Koch a choisi de désobéir à sa hiérarchie et de tirer. Avait-elle le droit de sacrifier les 164 occupants de l'avion pour sauver les spectateurs du stade ? Sur la scène transformée en salle d'audience, vous entendrez les témoins, la partie civile, la défense et l'avocat général, avant de voter en votre âme et conscience. Un évènement théâtral singulier, joué dans le monde entier.",
      distribution=[("Texte","Ferdinand von Schirach, traduction de Michel Deutsch (L'Arche, éditeur et agence théâtrale)"),("Compagnie","Hercub'"),("Avec","Michel Burstin, Frédéric Jeannot, Céline Martin-Sisteron, Bruno Rochette, Sylvie Rolland, Johanne Thibaut et Laëtitia Leroy"),("Mise en scène","M. Burstin, B. Rochette, S. Rolland")],
      citations=[("Une réflexion passionnante sur les démocraties face au terrorisme","Le Figaro"),("Une véritable expérience sociologique","La Provence"),("Le jeu des 7 comédiens est à la juste mesure de l'émotion","L'Humanité")]),
 dict(id="contre-temps", type="spectacle", titre="Contre-temps", genre="Biopic musical", date="Dimanche 29 novembre 2026", heure="17h",
      iso="2026-11-29", heure_iso="17:00", court="29 nov.", prix=["20 €","17 €"], img="contretemps.jpg", photo="photo-contretemps.jpg", yt="V-UcRqqk3os",
      chapo="De Paris à Broadway, une plongée euphorique dans la comédie musicale.",
      recit="À travers la vie fantasque de François Courdot, chef d'orchestre français exilé en Amérique, Contre-temps offre une plongée euphorique dans l'histoire de l'opérette et de la comédie musicale au XXe siècle, d'Offenbach à Cole Porter, de Duke Ellington à Leonard Bernstein. Deux chanteuses exceptionnelles embarquent le public, avec humour et énergie, dans un voyage de Paris à Broadway. Théâtre, jazz, opérette, comédie musicale, romance, biographie, voyages : autant de facettes pour découvrir l'insaisissable François Courdot. Signée Samuel Séné, la pièce a obtenu six nominations aux Trophées de la comédie musicale.",
      citations=[("Épatant récit, on s'y régale !","Télérama"),("Une comédie musicale menée tambour battant.","France Inter"),("Aussi déconcertant que désopilant.","Le Canard enchaîné")]),
 dict(id="et-si-c-etait-elle", type="spectacle", titre="Et si c'était elle ?", genre="Comédie romantique", date="Samedi 30 janvier 2027", heure="20h30",
      iso="2027-01-30", court="30 janv.", prix=["20 €","17 €"], img="etsicetaitelle.jpg", photo="photo-etsicetaitelle.jpg", yt="NzAEOUYhI-4",
      chapo="L'histoire vraie d'une rencontre pas comme les autres.",
      recit="C'est l'histoire vraie d'une rencontre pas comme les autres. Franck est désinvolte, superficiel et sans ambition. Faute d'avoir un endroit où dormir, il multiplie les rendez-vous galants avec un objectif minimal : gagner un lit pour la nuit. Jusqu'au jour où il croise Lélé, jeune femme au visage lumineux, pétillante… et atteinte d'un handicap majeur. À partir de son propre vécu, Franck Buirod a mijoté une folle comédie, à la fois légère, joyeuse, tendre, drôle et émouvante. Une ode à la différence dont on ressort enchanté, et qui invite à regarder au-delà des apparences.",
      citations=[("Une pièce qui dépasse les clichés et invite à voir au-delà des apparences","Avignon et Moi"),("Un très joli spectacle drôle… plein de tendresse","Sortir à Paris"),("Tout est dans cette pièce, humour, intelligence, tendresse.","Baz'art")]),
 dict(id="rose-royal", type="spectacle", titre="Rose Royal", genre="Seule en scène · Thriller", date="Samedi 20 février 2027", heure="20h30",
      iso="2027-02-20", court="20 fév.", prix=["25 €","22 €"], img="roseroyal.jpg", photo="photo-roseroyal.jpg", yt="gSjP-3JeVJQ",
      chapo="Un trio de choc pour un seul en scène coup de poing.",
      recit="Un récit de Nicolas Mathieu, mis en scène par Romane Bohringer et interprété par Anne Charrier : un trio de choc pour un seul en scène coup de poing. Rose a cinquante ans, de beaux restes, et avec les hommes, elle sait se défendre. Un soir, alors qu'elle est au téléphone, son compagnon du moment lui ordonne de se taire pour regarder le journal télévisé ; elle comprend qu'il va la frapper. Le lendemain, elle s'offre un calibre 38 et des cartouches. Désormais, la peur doit changer de camp. Un texte superbe et une comédienne au zénith, pour un spectacle qui ne laisse personne indifférent.",
      citations=[("Un texte vraiment superbe","France Inter"),("Anne Charrier campe une Rose étourdissante","Le Nouvel Obs"),("50 nuances de subtilité… joli mariage d'un texte brillant et d'une comédienne au zénith","Le Parisien")]),
 dict(id="murder-party", type="evenement", titre="Murder Party", genre="Jeu de rôles · Enquête policière", date="Samedi 27 février 2027", heure="14h", lieu="Domaine de Roz Armor",
      iso="2027-02-27", court="27 fév.", prix=["10 € / joueur"], img="murder-flyer.jpg",
      txt="Une enquête à mener en équipe sur le site de Roz Armor. Scénario original coproduit par Erquy en Scène et Noir sur la Ville. Inscription obligatoire, 50 joueurs maximum."),
 dict(id="l-affaire-buckingham", type="spectacle", titre="L'Affaire Buckingham", genre="Comédie musicale (presque) historique", date="Samedi 20 mars 2027", heure="20h30",
      iso="2027-03-20", court="20 mars", prix=["20 €","17 €"], img="buckingham.jpg", photo="photo-buckingham.jpg", yt="fdV_Pg-29vQ",
      chapo="D'Artagnan dégaine… l'humour !",
      recit="Avec L'Affaire Buckingham, d'Artagnan dégaine… l'humour ! Bienvenue à la cour de Louis XIII avec cette version parodique des « Trois Mousquetaires », une comédie musicale (presque) historique. Cinq comédiens-chanteurs y incarnent avec fantaisie toute une galerie de personnages pittoresques. Une comédie légère, anachronique et résolument pétillante, où le burlesque se mêle à des dialogues en alexandrins. Une fresque historique aussi irrévérencieuse que jubilatoire, à la manière des Monty Python ou de Buster Keaton, portée par des comédiens à la performance royale. Un vaudeville de cape et d'épée pour toute la famille.",
      citations=[("Vaudeville mené tambour battant !","Télérama"),("Comédie débridée.","Ouest-France"),("Irrésistible revisite des 3 Mousquetaires.","La Provence")]),
 dict(id="a-pile-ou-face", type="spectacle", titre="À pile ou face", genre="Comédie interactive", date="Samedi 17 avril 2027", heure="20h30",
      iso="2027-04-17", court="17 avril", prix=["20 €","17 €"], img="apileouface.jpg", photo="photo-apileouface.jpg", yt="Y85O4yD92eM",
      chapo="Le public tient la pièce entre ses mains.",
      recit="Après une rencontre inattendue, Adélie et Eliott décident de confier chaque moment de leur journée au hasard, en jouant leur avenir immédiat à pile ou face. Chaque lancer façonne leur destin. Sur scène, chaque situation fait apparaître de nouveaux décors projetés et des personnages virtuels qui interagissent avec les comédiens. Deux personnages, un scénario à choix multiples : le public tient la pièce entre ses mains et décide du sort des protagonistes. Une comédie interactive, poétique et innovante, dont chaque représentation est unique. Un spectacle rare et imprévisible, à vivre ensemble, au fil des pièces lancées.",
      citations=[("Une comédie à géométries variables, aux allures d'un film de Jean-Pierre Jeunet.","Presse Océan"),("Poétique, participatif… un très bon moment de théâtre.","Théâtre Graslin")]),
 dict(id="festival", type="evenement", titre="20e Festival de théâtre amateur", genre="Festival · Pièce courte", date="Samedi 8 mai 2027 à 20h30 · Dimanche 9 mai 2027 à 15h", heure="",
      iso="2027-05-08", court="8-9 mai", prix=["7 € / jour","Pass 2 jours 10 €"], img="fta.jpg",
      txt="Le vingtième festival de la pièce courte rassemble des passionnés venus de Bretagne et d'ailleurs : créations et comédies du répertoire, pour tous les âges."),
]
for s in S:
    s.setdefault("lieu", "L'Ancre des Mots, Erquy")
    s["passe"] = datetime.date.fromisoformat(s["iso"]) < AUJOURDHUI
    if s["type"] == "spectacle":
        s["page"] = "spectacle-" + s["id"] + ".html"
SPEC = [s for s in S if s["type"] == "spectacle"]
PROCHAIN = next(s for s in SPEC if not s["passe"])
PROCHAIN["prochain"] = True
NEXT_ISO = PROCHAIN["iso"] + "T" + PROCHAIN.get("heure_iso", "20:30") + ":00+01:00"

def lien(s):
    return s.get("page", "saison-2026-2027.html#" + s["id"])

NAV = [
 ("index.html","Accueil"),
 (PROCHAIN["page"],"Prochain spectacle"),
 ("saison-2026-2027.html","Saison 2026-2027"),
 ("qui-sommes-nous.html","Qui sommes-nous"),
 ("galerie-videos.html","Galerie & vidéos"),
 ("en-pratique.html","En pratique"),
 ("contact.html","Contact"),
]

def head(title, desc, og="img/contretemps.jpg"):
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} | {BASE_TITLE}</title>
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#0d0a0c">
<meta property="og:title" content="{esc(title)} | {BASE_TITLE}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{og}">
<link rel="icon" href="img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
"""

def header(actif):
    items = ""
    for f, label in NAV:
        cur = ' aria-current="page"' if f == actif else ""
        items += f'<li><a href="{f}"{cur}>{label}</a></li>\n'
    return f"""<header class="site-header">
<div class="wrap">
  <a class="logo" href="index.html" aria-label="Erquy en Scène — accueil"><img src="img/logo.jpg" alt="Erquy en Scène" width="149" height="75"></a>
  <nav aria-label="Navigation principale"><ul class="menu" id="menu">
{items}  </ul></nav>
  <div class="header-droite">
    <a class="btn btn-or" href="{HELLO}" target="_blank" rel="noopener">Réserver</a>
    <button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span></button>
  </div>
</div>
</header>
<main id="contenu">
<div class="ruban-maquette">Maquette de refonte (version 2) présentée au client — contenus issus du site actuel, éléments à compléter signalés « À compléter ».</div>
"""

def footer():
    spect = "".join(f'<li><a href="{s["page"]}">{esc(s["titre"])}</a></li>' for s in SPEC)
    return f"""</main>
<footer class="site-footer">
<div class="wrap">
 <div class="pied-grille">
  <div>
   <a class="logo-pied" href="index.html"><img src="img/logo.jpg" alt="Erquy en Scène" width="149" height="75"></a>
   <p>Association loi 1901 qui programme le théâtre municipal d'Erquy, la salle de l'Ancre des Mots, d'octobre à mai.</p>
   <p><strong>Mairie d'Erquy</strong><br>11 Square de l'Hôtel de Ville<br>22430 Erquy</p>
   <p>Tél. <a href="tel:+33781211204">07 81 21 12 04</a><br><a href="mailto:contact@erquy-enscene.fr">contact@erquy-enscene.fr</a></p>
  </div>
  <div>
   <h4>Les spectacles</h4>
   <ul>{spect}<li><a href="saison-2026-2027.html">Toute la saison</a></li></ul>
  </div>
  <div>
   <h4>Infos &amp; partenaires</h4>
   <ul>
    <li><a href="en-pratique.html">En pratique</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="{HELLO}" target="_blank" rel="noopener">HelloAsso — billetterie</a></li>
    <li><a href="{OT}" target="_blank" rel="noopener">Office de tourisme Cap d'Erquy</a></li>
    <li><a href="{MAIRIE}" target="_blank" rel="noopener">Mairie d'Erquy</a></li>
    <li><a href="{AGENDA}" target="_blank" rel="noopener">Agendaou — agenda culturel</a></li>
    <li><a href="{PASS}" target="_blank" rel="noopener">Pass Culture</a></li>
    <li><a href="mentions-legales.html">Mentions légales</a></li>
   </ul>
  </div>
  <div>
   <h4>Réseaux sociaux</h4>
   <p><span class="attente-tag">À compléter</span>Liens Facebook, Instagram et YouTube de l'association.</p>
  </div>
 </div>
 <div class="pied-bas"><span>© 2026 Erquy en Scène — association loi 1901</span><span>Maquette de refonte</span></div>
</div>
</footer>
<script src="js/main.js"></script>
</body>
</html>
"""

def page_hero(titre, intro, img, fil, fil_parent=None):
    parent = f'<a href="{fil_parent[0]}">{esc(fil_parent[1])}</a> / ' if fil_parent else ""
    return f"""<section class="page-hero">
  <div class="fond" style="background-image:url('img/{img}')"></div>
  <div class="wrap">
    <p class="fil"><a href="index.html">Accueil</a> / {parent}{esc(fil)}</p>
    <h1>{titre}</h1>
    <p>{intro}</p>
  </div>
</section>
"""

def prix_html(s):
    if len(s["prix"]) == 2 and s["type"] == "spectacle":
        return f'<div class="prix"><span>Plein {s["prix"][0]}</span><span>Réduit {s["prix"][1]}</span></div>'
    return '<div class="prix">' + "".join(f"<span>{p}</span>" for p in s["prix"]) + "</div>"

def pastille(s):
    if s["passe"]: return '<span class="pastille passe">Déjà joué</span>'
    if s.get("prochain"): return '<span class="pastille">Prochain spectacle</span>'
    return ""

def carte_saison(s):
    if s["type"] == "spectacle":
        img = f'<a href="{s["page"]}" tabindex="-1" aria-hidden="true"><img src="img/{s["img"]}" alt="" loading="lazy"></a>'
        btns = f'<a class="btn btn-or" href="{s["page"]}">Voir la fiche du spectacle</a>'
        if not s["passe"]:
            btns += f'<a class="btn btn-ligne" href="{HELLO}" target="_blank" rel="noopener">Réserver</a>'
        corps = f'<p>{esc(s["chapo"])}</p>'
    else:
        img = f'<img src="img/{s["img"]}" alt="Affiche : {esc(s["titre"])}" loading="lazy">' if s["img"] else \
              '<div style="background:linear-gradient(135deg,#1f6fa8,#0f3d5e);display:grid;place-items:center;font-family:var(--titre);font-size:1.8rem;min-height:180px;padding:20px;text-align:center">Concert<br>d\'ouverture</div>'
        btns = "" if s["passe"] else f'<a class="btn btn-ligne" href="{HELLO}" target="_blank" rel="noopener">Réserver</a>'
        corps = f'<p>{esc(s["txt"])}</p>'
    quand = esc(s["date"]) + (f' · {esc(s["heure"])}' if s["heure"] else "")
    return f"""<article class="carte carte-spectacle reveal" id="{s["id"]}">
  {img}
  <div class="corps">
    {pastille(s)}
    <span class="genre">{esc(s["genre"])}</span>
    <h3>{f'<a href="{s["page"]}" style="color:inherit;text-decoration:none">{esc(s["titre"])}</a>' if s["type"]=="spectacle" else esc(s["titre"])}</h3>
    <p class="quand">{quand}</p>
    <p class="meta">{esc(s["lieu"])}</p>
    {prix_html(s)}
    {corps}
    <div class="btn-groupe">{btns}</div>
  </div>
</article>"""

def frise():
    li = ""
    for s in S:
        cls = "passe" if s["passe"] else ("prochain" if s.get("prochain") else "")
        li += f'<li class="{cls}"><a href="{lien(s)}"><time datetime="{s["iso"]}">{s["court"]}</time><strong>{esc(s["titre"])}</strong><em>{esc(s["genre"].split("·")[0].strip())}</em></a></li>\n'
    return f'<ol class="frise" aria-label="Frise de la saison 2026-2027">\n{li}</ol>'

def carrousel():
    a = ""
    for s in S:
        if not s["img"]: continue
        a += f'<a href="{lien(s)}"><img src="img/{s["img"]}" alt="Affiche : {esc(s["titre"])}" loading="lazy" width="617" height="861"><span>{esc(s["court"])} · {esc(s["titre"])}</span></a>\n'
    return f"""<div class="carrousel" role="region" aria-label="Carrousel des affiches de la saison">
<div class="piste" tabindex="0">
{a}</div>
<div class="fleches"><button class="fleche" data-prev aria-label="Affiches précédentes">‹</button><button class="fleche" data-next aria-label="Affiches suivantes">›</button></div>
</div>"""

def attente(txt):
    return f'<div class="encadre attente"><span class="attente-tag">À compléter</span>{txt}</div>'

def teaser(s):
    if s.get("yt"):
        return f"""<div class="teaser"><button data-yt="{s["yt"]}" aria-label="Lire le teaser de {esc(s["titre"])}">
  <img src="https://i.ytimg.com/vi/{s["yt"]}/hqdefault.jpg" alt="" loading="lazy"><span class="lecture"></span><span class="lib">Teaser — {esc(s["titre"])}</span></button></div>
<p style="margin-top:10px"><a href="https://www.youtube.com/watch?v={s["yt"]}" target="_blank" rel="noopener">Voir le teaser sur YouTube</a></p>"""
    return f'<div class="video-attente"><div><div class="lecture"></div><p><span class="attente-tag">À compléter</span>Lien du teaser de la compagnie à ajouter.</p></div></div>'

def cd(s):
    iso = s["iso"] + "T" + s.get("heure_iso", "20:30") + ":00+01:00"
    return f"""<div class="cr" data-countdown="{iso}" role="timer" aria-label="Compte à rebours avant {esc(s["titre"])}">
  <div><b data-j>0</b><small>jours</small></div><div><b data-h>00</b><small>heures</small></div><div><b data-m>00</b><small>min</small></div><div><b data-s>00</b><small>sec</small></div>
</div>"""

def write(fn, content):
    with open(os.path.join(OUT, fn), "w", encoding="utf-8") as f: f.write(content)

# ================= ACCUEIL =================
def home():
    p = PROCHAIN
    o = head("Théâtre à Erquy — Saison 2026-2027", f"Erquy en Scène programme le théâtre municipal d'Erquy : prochain spectacle « {p['titre']} », {p['date'].lower()} à l'Ancre des Mots, et toute la saison 2026-2027.", "img/" + p["img"])
    o += header("index.html")
    o += f"""<section class="hero">
  <div class="fond" style="background-image:url('img/{p["img"]}')"></div>
  <div class="rideau g" aria-hidden="true"></div><div class="rideau d" aria-hidden="true"></div>
  <div class="wrap hero-grille">
    <div class="contenu">
      <span class="kicker">Votre prochain spectacle · {esc(p["date"])}</span>
      <h1>{esc(p["titre"])}</h1>
      <p class="sous">{esc(p["chapo"])}</p>
      <ul class="infos">
        <li><strong>Quand</strong> {esc(p["date"])}, {esc(p["heure"])}</li>
        <li><strong>Où</strong> {esc(p["lieu"])}</li>
        <li><strong>Tarifs</strong> Plein {p["prix"][0]} · Réduit {p["prix"][1]}</li>
      </ul>
      {cd(p)}
      <div class="btn-groupe">
        <a class="btn btn-or" href="{HELLO}" target="_blank" rel="noopener">Réserver sur HelloAsso</a>
        <a class="btn btn-ligne" href="{p["page"]}">Découvrir le spectacle</a>
      </div>
      <p style="margin-top:18px">Billetterie à l'office de tourisme d'Erquy : <a href="{TELHREF}">{TEL}</a></p>
    </div>
    <div class="affiche-cadre contenu"><div class="projecteur" aria-hidden="true"></div>
      <img src="img/{p["img"]}" alt="Affiche de {esc(p["titre"])}" width="617" height="861" fetchpriority="high"></div>
  </div>
</section>

<section class="ocean">
 <div class="wrap">
  <div class="compteurs reveal">
    <div><b data-compte="2004">0</b><span>année de création de l'association</span></div>
    <div><b data-compte="10">0</b><span>dates d'octobre à mai</span></div>
    <div><b data-compte="7">0</b><span>spectacles professionnels</span></div>
    <div><b data-compte="20">0</b><span>e édition du Festival de théâtre amateur</span></div>
  </div>
 </div>
</section>

<section>
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Saison 2026-2027</span><h2>Dix dates à retenir, d'octobre 2026 à mai 2027</h2>
   <p class="lead">Sept spectacles professionnels — comédies, musicales, thriller et un procès fiction dont vous êtes les jurés — complétés par une Murder Party en février et le 20e Festival de théâtre amateur en mai.</p></div>
  <div class="reveal">{carrousel()}</div>
  <div class="reveal" style="margin-top:40px"><h3 style="text-align:center">La frise de la saison</h3>{frise()}</div>
  <p style="text-align:center;margin-top:30px"><a class="btn btn-rouge" href="saison-2026-2027.html">Voir toute la saison</a></p>
 </div>
</section>

<section class="velours">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">À l'affiche</span><h2>Les prochains spectacles</h2></div>
  <div class="grille trois">
""" + "".join(f"""   <article class="carte reveal"><a href="{s["page"]}" tabindex="-1" aria-hidden="true"><img src="img/{s["photo"]}" alt="" loading="lazy" style="aspect-ratio:4/3;object-fit:cover;width:100%"></a><div class="corps">
    <span class="genre">{esc(s["court"])} · {esc(s["heure"])}</span><h3>{esc(s["titre"])}</h3><p>{esc(s["chapo"])}</p>
    <div class="btn-groupe"><a class="btn btn-ligne" href="{s["page"]}">Découvrir</a></div></div></article>
""" for s in [x for x in SPEC if not x["passe"]][:3]) + f"""  </div>
 </div>
</section>

<section>
 <div class="wrap">
  <div class="grille deux">
   <div class="encadre verre reveal"><h3>Le verre de l'amitié</h3><p style="margin:0">{esc(VERRE)}</p></div>
   <div class="encadre reveal"><h3>Agenda culturel</h3><p>Retrouvez nos dates sur l'agenda externe Agendaou.</p><a class="btn btn-ligne" href="{AGENDA}" target="_blank" rel="noopener">Ouvrir Agendaou</a></div>
  </div>
 </div>
</section>

<section class="sombre">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Ils nous soutiennent</span><h2>Nos partenaires</h2></div>
  <div class="partenaires reveal">
   <a href="{MAIRIE}" target="_blank" rel="noopener">Mairie d'Erquy</a>
   <a href="{OT}" target="_blank" rel="noopener">Office de tourisme Cap d'Erquy</a>
   <a href="{HELLO}" target="_blank" rel="noopener">HelloAsso</a>
   <a href="{AGENDA}" target="_blank" rel="noopener">Agendaou</a>
   <a href="{PASS}" target="_blank" rel="noopener">Pass Culture</a>
   <span class="encadre attente" style="margin:0;padding:12px 20px"><span class="attente-tag">À compléter</span>Autres partenaires à confirmer</span>
  </div>
 </div>
</section>
"""
    o += footer(); write("index.html", o)

# ================= FICHE SPECTACLE =================
def fiche(s, i):
    prec = SPEC[i-1] if i > 0 else None
    suiv = SPEC[i+1] if i < len(SPEC)-1 else None
    o = head(f"{s['titre']} — {s['date']}", f"{s['titre']} ({s['genre'].lower()}), {s['date'].lower()} à {s['heure']} à l'Ancre des Mots d'Erquy. {s['chapo']}", "img/" + s["img"])
    o += header(PROCHAIN["page"] if s.get("prochain") else "saison-2026-2027.html")
    o += page_hero(esc(s["titre"]), f'{esc(s["genre"])} — {esc(s["date"])} à {esc(s["heure"])}', s["photo"], s["titre"], ("saison-2026-2027.html", "Saison 2026-2027"))
    btns = "" if s["passe"] else f'<div class="btn-groupe" style="margin-bottom:26px"><a class="btn btn-or" href="{HELLO}" target="_blank" rel="noopener">Réserver sur HelloAsso</a><a class="btn btn-ligne" href="{OT}" target="_blank" rel="noopener">Office de tourisme</a></div><p>Par téléphone : <a href="{TELHREF}">{TEL}</a> (office de tourisme d\'Erquy)</p>'
    if s["passe"]:
        btns = '<div class="encadre"><p style="margin:0">Ce spectacle a déjà eu lieu. Merci aux spectateurs ! Retrouvez la suite de la saison ci-dessous.</p></div>'
    dist = ""
    if s.get("distribution"):
        dist = '<h3 style="margin-top:30px">Distribution</h3><ul class="coches">' + "".join(f"<li><strong>{esc(k)} :</strong> {esc(v)}</li>" for k, v in s["distribution"]) + "</ul>"
    quotes = "".join(f'<blockquote class="citation">« {esc(t)} »<cite>{esc(src)}</cite></blockquote>' for t, src in s["citations"])
    o += f"""<section>
 <div class="wrap fiche">
  <div class="fiche-visuels reveal">
   <div class="cadre-or"><img src="img/{s["img"]}" alt="Affiche de {esc(s["titre"])}" width="617" height="861"></div>
   <img src="img/{s["photo"]}" alt="{esc(s["titre"])} : {'illustration' if s['id']=='terreur' else 'photo du spectacle'}" loading="lazy" style="border-radius:14px;width:100%">
  </div>
  <div class="fiche-texte reveal">
   {pastille(s)}
   <span class="kicker" style="display:block;margin-top:10px">{esc(s["genre"])}</span>
   <h2>{esc(s["chapo"])}</h2>
   <dl class="infos-cles">
    <div><dt>Date</dt><dd>{esc(s["date"])}</dd></div>
    <div><dt>Heure</dt><dd>{esc(s["heure"])}</dd></div>
    <div><dt>Lieu</dt><dd>{esc(s["lieu"])}</dd></div>
    <div><dt>Tarifs</dt><dd>{s["prix"][0]} / réduit {s["prix"][1]}</dd></div>
   </dl>
   {"" if s["passe"] else cd(s)}
   <p class="recit">{esc(s["recit"])}</p>
   {btns}
   {dist}
  </div>
 </div>
</section>

<section class="sombre">
 <div class="wrap grille deux" style="align-items:start">
  <div class="reveal"><span class="kicker">En vidéo</span><h2>Le teaser</h2>{teaser(s)}</div>
  <div class="reveal"><span class="kicker">La presse</span><h2>Ils en parlent</h2>{quotes}<p class="meta" style="color:var(--texte-doux)">Citations reprises du site actuel d'Erquy en Scène.</p></div>
 </div>
</section>

<section>
 <div class="wrap">
  <div class="grille deux" style="margin-bottom:40px">
   <div class="encadre reveal"><h3>Tarif réduit</h3><p style="margin:0">{esc(RULE)}</p></div>
   <div class="encadre verre reveal"><h3>Verre de l'amitié</h3><p style="margin:0">{esc(VERRE)}</p></div>
  </div>
  <nav class="nav-fiches" aria-label="Autres spectacles de la saison">
   {f'<a href="{prec["page"]}"><small>← Spectacle précédent</small>{esc(prec["titre"])}</a>' if prec else '<a href="saison-2026-2027.html"><small>← Retour</small>Toute la saison</a>'}
   {f'<a class="suiv" href="{suiv["page"]}"><small>Spectacle suivant →</small>{esc(suiv["titre"])}</a>' if suiv else '<a class="suiv" href="saison-2026-2027.html#festival"><small>Pour finir la saison →</small>20e Festival de théâtre amateur</a>'}
  </nav>
 </div>
</section>
"""
    o += footer(); write(s["page"], o)

# ================= SAISON =================
def saison():
    o = head("Saison 2026-2027 et programme complet", "Dix dates d'octobre 2026 à mai 2027 à Erquy : sept spectacles professionnels, la Murder Party et le 20e Festival de théâtre amateur. Programme, tarifs et réservation.")
    o += header("saison-2026-2027.html")
    o += page_hero("Saison 2026-2027", "Dix dates à retenir d'octobre 2026 à mai 2027. Merci pour votre fidélité !", "bando.jpg", "Saison 2026-2027")
    fest, murder = next(s for s in S if s["id"] == "festival"), next(s for s in S if s["id"] == "murder-party")
    o += f"""<section>
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Programmation</span><h2>La saison en un coup d'œil</h2>
   <p class="lead">Venez découvrir la programmation concoctée par l'équipe d'Erquy en Scène : pas moins de 7 spectacles professionnels, dont plusieurs comédies musicales, un thriller et un procès fiction dont vous êtes les jurés. Une nouvelle Murder Party est au menu à Roz Armor, et le 20e Festival de théâtre amateur clôturera la saison en mai.</p></div>
  <div class="reveal">{frise()}</div>
 </div>
</section>

<section class="sombre">
 <div class="wrap">
  <div class="titre-section reveal"><h2>Le déroulé de la saison</h2><p class="lead">Chaque spectacle dispose de sa fiche détaillée : présentation, photo, teaser, tarifs et réservation.</p></div>
  <div class="grille">
""" + "\n".join(carte_saison(s) for s in S) + f"""
  </div>
 </div>
</section>

<section class="velours">
 <div class="wrap duo">
  <div class="reveal">
   <span class="kicker">Tarifs</span><h2>Le tarif réduit, comment ça marche ?</h2>
   <div class="encadre"><p style="font-size:1.25rem;margin:0">{esc(RULE)}</p></div>
   <p>Le tarif réduit s'applique aussi, sur présentation d'un justificatif, aux moins de 25 ans, aux étudiants et aux demandeurs d'emploi, ainsi qu'aux abonnés d'Erquy en Scène et du Festival d'Avignon OFF 2026.</p>
   <div class="encadre verre"><h3>Le verre de l'amitié</h3><p style="margin:0">{esc(VERRE)}</p></div>
   <div class="btn-groupe"><a class="btn btn-or" href="en-pratique.html#tarifs">Tous les tarifs</a><a class="btn btn-ligne" href="{AGENDA}" target="_blank" rel="noopener">Agenda Agendaou</a></div>
  </div>
  <div class="reveal cadre-or"><img src="img/affiche-generale.jpg" alt="Affiche générale de la saison 2026-2027 d'Erquy en Scène" loading="lazy" style="max-width:420px;margin:auto"></div>
 </div>
</section>
"""
    o += footer(); write("saison-2026-2027.html", o)

# ================= QUI SOMMES-NOUS =================
def qui():
    o = head("Qui sommes-nous ? L'association et le théâtre d'Erquy", "Erquy en Scène, association de bénévoles née en 2004, programme les spectacles du théâtre municipal d'Erquy, l'Ancre des Mots, d'octobre à mai.")
    o += header("qui-sommes-nous.html")
    o += page_hero("Qui sommes-nous ?", "Une équipe de bénévoles passionnés, au service de la scène à Erquy depuis 2004.", "bando.jpg", "Qui sommes-nous")
    o += f"""<section>
 <div class="wrap duo">
  <div class="reveal">
   <span class="kicker">L'association</span><h2>Erquy en Scène, association loi 1901</h2>
   <p>Née en 2004, Erquy en Scène fait vivre le spectacle vivant à Erquy. Son équipe de bénévoles met en œuvre l'ensemble de la saison : de sept à huit spectacles ou festivals, d'octobre à mai.</p>
   <p>Le programme est choisi collégialement, à partir des retours des festivals d'Avignon et de Barjac ou de la cérémonie des Molières : théâtre, musique, chant, danse, humour… Une fois la saison établie, la communication et la billetterie se mettent en place, à l'office de tourisme d'Erquy.</p>
   <p>L'association accueille aussi les artistes et les équipes techniques, et gère la salle les jours de spectacle. Elle travaille avec la municipalité et l'agglomération, qui la soutiennent financièrement et mettent l'Ancre des Mots à sa disposition.</p>
  </div>
  <div class="reveal cadre-or"><img src="img/logo.jpg" alt="Logo Erquy en Scène : deux masques de théâtre et un ruban rouge" style="background:var(--creme);padding:30px;border-radius:14px;width:100%;max-width:420px;margin:auto" width="149" height="75"></div>
 </div>
</section>

<section class="ocean">
 <div class="wrap"><div class="titre-section reveal"><span class="kicker">Nos valeurs</span><h2>Ce qui nous anime</h2></div>
  <div class="grille trois">
   <div class="carte reveal"><div class="corps"><h3>Le choix collectif</h3><p>Chaque spectacle est choisi ensemble, pour la qualité des textes et des interprètes.</p></div></div>
   <div class="carte reveal"><div class="corps"><h3>Le plaisir du public</h3><p>Une salle conviviale, des spectacles pour tous les âges, et le verre de l'amitié partagé après la représentation.</p></div></div>
   <div class="carte reveal"><div class="corps"><h3>L'amateur à l'honneur</h3><p>Chaque année, le Festival de théâtre amateur donne la scène aux troupes de Bretagne et d'ailleurs.</p></div></div>
  </div></div>
</section>

<section class="sombre">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Repères</span><h2>Histoire de l'association</h2></div>
  <ol class="frise reveal" style="justify-content:center">
   <li><time>2004</time><strong>Création</strong><em>Naissance d'Erquy en Scène, association loi 1901</em></li>
   <li><time>2004 → 2026</time><strong>Saison après saison</strong><em>Un spectacle environ par mois, d'octobre à mai</em></li>
   <li class="prochain"><time>2026-2027</time><strong>Saison en cours</strong><em>Dix dates</em></li>
   <li><time>Mai 2027</time><strong>20e Festival</strong><em>Théâtre amateur, pièce courte</em></li>
  </ol>
  {attente("Chronologie détaillée (premières saisons, faits marquants) : à compléter avec les archives de l'association.")}
 </div>
</section>

<section>
 <div class="wrap duo inverse">
  <div class="reveal cadre-or"><img src="img/ancre.jpg" alt="Façade de l'Ancre des Mots, théâtre municipal d'Erquy" loading="lazy"></div>
  <div class="reveal">
   <span class="kicker">Le théâtre municipal</span><h2>L'Ancre des Mots</h2>
   <p>Scène culturelle de la ville, l'Ancre des Mots accueille théâtre, musique, danse, chanson et humour dans le centre d'Erquy, Square de la mairie. C'est là que se jouent les spectacles de la saison.</p>
   <p>Selon des sources tierces, la salle compte environ 315 places, dont quatre emplacements pour fauteuils roulants en parterre — <em>à confirmer</em>.</p>
   {attente("Historique du bâtiment : à compléter avec la mairie.")}
  </div>
 </div>
</section>

<section class="velours">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">L'équipe</span><h2>Bureau &amp; bénévoles</h2></div>
  <div class="grille trois">
   <div class="carte reveal"><div class="corps"><span class="genre">Présidence</span><h3><span class="attente-tag">À compléter</span>Nom</h3><p>Photo et mot de bienvenue à ajouter.</p></div></div>
   <div class="carte reveal"><div class="corps"><span class="genre">Trésorerie</span><h3><span class="attente-tag">À compléter</span>Nom</h3><p>Composition du bureau à confirmer.</p></div></div>
   <div class="carte reveal"><div class="corps"><span class="genre">Secrétariat</span><h3><span class="attente-tag">À compléter</span>Nom</h3><p>Composition du bureau à confirmer.</p></div></div>
  </div>
  <p class="lead reveal" style="margin:30px auto 0;text-align:center">Et toute l'équipe de bénévoles, présente à chaque spectacle : accueil du public, billetterie sur place, accueil des artistes, technique et verre de l'amitié.</p>
 </div>
</section>
"""
    o += footer(); write("qui-sommes-nous.html", o)

# ================= GALERIE =================
def galerie():
    def b(img, alt, haut=False):
        return f'<button class="{"haut" if haut else ""}" data-zoom="img/{img}" data-alt="{esc(alt)}"><img src="img/{img}" alt="{esc(alt)}" loading="lazy"><span class="leg">{esc(alt)}</span></button>'
    o = head("Galerie photos et vidéos", "Affiches, photos et teasers des spectacles de la saison 2026-2027, souvenirs des saisons passées et photos du théâtre de l'Ancre des Mots.")
    o += header("galerie-videos.html")
    o += page_hero("Galerie &amp; vidéos", "Affiches, photos de spectacles et teasers, classés par saison.", "bando.jpg", "Galerie & vidéos")
    o += f"""<section>
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Saison 2026-2027</span><h2>Les spectacles en images</h2></div>
  <div class="galerie reveal">{"".join(b(s["photo"], s["titre"]) for s in SPEC)}</div>
 </div>
</section>
<section class="sombre">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Saison 2026-2027</span><h2>Les affiches</h2></div>
  <div class="galerie reveal">{"".join(b(s["img"], s["titre"], True) for s in S if s["img"])}{b("affiche-generale.jpg","Affiche générale de la saison",True)}</div>
 </div>
</section>
<section class="velours">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Vidéos</span><h2>Les teasers de la saison</h2></div>
  <div class="grille deux reveal">{"".join(f'<div><h3>{esc(s["titre"])}</h3>{teaser(s)}</div>' for s in SPEC if s.get("yt"))}</div>
 </div>
</section>
<section>
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Saisons passées</span><h2>Souvenirs de scène</h2></div>
  <div class="galerie reveal">
   {b("graeme.jpg","Graeme Allwright, saison passée")}
   {b("intramuros.jpg","Intra Muros, saison 2021-2022")}
   {b("porteur.jpg","Porteur d'histoire, saison passée")}
   {b("voulez.jpg","Voulez-vous danser, saison passée")}
   {b("murder-photo.jpg","Murder Party, édition précédente")}
   {b("ancre.jpg","L'Ancre des Mots, théâtre municipal d'Erquy")}
  </div>
  {attente("Légendes précises (saison, troupe, crédit photo) et photos de bénévoles à compléter.")}
 </div>
</section>
<dialog id="lightbox" aria-label="Visionneuse photo"><button class="fermer" aria-label="Fermer">×</button><div class="lb"><img src="" alt=""><p></p></div></dialog>
"""
    o += footer(); write("galerie-videos.html", o)

# ================= EN PRATIQUE =================
def pratique():
    o = head("En pratique : accès, tarifs, billetterie", "Comment venir à l'Ancre des Mots d'Erquy, tarifs de la saison 2026-2027, billetterie, abonnement, Pass Culture et verre de l'amitié.")
    o += header("en-pratique.html")
    o += page_hero("En pratique", "Tout pour préparer votre venue à l'Ancre des Mots.", "ancre.jpg", "En pratique")
    o += f"""<section>
 <div class="wrap grille deux">
  <div class="reveal">
   <span class="kicker">Bienvenue</span><h2>Accès &amp; horaires</h2>
   <ul class="coches">
    <li><strong>Lieu :</strong> salle de l'Ancre des Mots, Square de la mairie d'Erquy, 22430 Erquy</li>
    <li><strong>Horaires :</strong> les jours de spectacle, ouverture du hall une demi-heure avant le début de la représentation</li>
    <li><strong>Placement libre</strong></li>
    <li><strong>Arrivée :</strong> l'entrée peut être refusée aux retardataires, même munis d'un billet. Les réservations non retirées ne sont plus garanties 15 minutes avant le début</li>
    <li><strong>Dans la salle :</strong> téléphones éteints, enregistrements interdits, ni nourriture ni boisson</li>
    <li><strong>Murder Party :</strong> elle se déroule au domaine de Roz Armor, à Erquy</li>
   </ul>
   <h3>Parking</h3>{attente("Parkings à proximité de l'Ancre des Mots.")}
   <h3>Accessibilité</h3>{attente("Accès PMR, boucle magnétique, toilettes : à confirmer.")}
  </div>
  <div class="reveal">
   <iframe class="carte-osm" title="Carte : Ancre des Mots, Erquy" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-2.4720%2C48.6270%2C-2.4520%2C48.6380&amp;layer=mapnik"></iframe>
   <p style="margin-top:10px"><a href="https://www.openstreetmap.org/search?query=Ancre%20des%20Mots%20Erquy" target="_blank" rel="noopener">Ouvrir la carte en grand</a></p>
   <img src="img/plan.jpg" alt="Plan du centre d'Erquy avec l'Ancre des Mots" loading="lazy" style="border-radius:14px;margin-top:14px">
  </div>
 </div>
</section>

<section class="sombre" id="tarifs">
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Billetterie</span><h2>Tarifs de la saison 2026-2027</h2></div>
  <div class="table-scroll reveal"><table>
   <thead><tr><th>Spectacles</th><th>Tarifs</th></tr></thead>
   <tbody>
    <tr><td>Tout ce que vous voulez · Contre-temps · Et si c'était elle ? · L'Affaire Buckingham · À pile ou face</td><td>Plein tarif 20 € · Tarif réduit 17 €</td></tr>
    <tr><td>Terreur · Rose Royal</td><td>Plein tarif 25 € · Tarif réduit 22 €</td></tr>
    <tr><td>Jeu de rôles — Murder Party</td><td>10 € par joueur</td></tr>
    <tr><td>Festival de théâtre amateur</td><td>7 € par jour · 10 € le pass 2 jours</td></tr>
   </tbody></table></div>
  <div class="grille deux">
   <div class="reveal"><div class="encadre"><h3>Tarif réduit</h3><p>{esc(RULE)}</p>
    <p>Il s'applique sur présentation d'un justificatif aux moins de vingt-cinq ans, aux étudiants et aux chômeurs, aux abonnés d'Erquy en Scène pour la saison 2026-2027 et aux abonnés du Festival d'Avignon OFF 2026.</p></div>
    <div class="encadre"><h3>Abonnement</h3><p style="margin:0">Abonnement nominatif à partir de trois spectacles (hors Festival Théâtre Amateur et Murder Party). La carte d'abonnement donne aussi droit au tarif réduit pour les autres spectacles de la saison.</p></div></div>
   <div class="reveal"><h3>Où réserver ?</h3>
    <ul class="coches">
     <li>Office de tourisme d'Erquy : <a href="{TELHREF}">{TEL}</a></li>
     <li>En ligne : <a href="{HELLO}" target="_blank" rel="noopener">HelloAsso</a></li>
     <li>Par courrier, avec un chèque et une enveloppe timbrée à votre adresse</li>
     <li>Sur place, le soir du spectacle, s'il reste des places</li>
     <li>Le Pass Culture est accepté (<a href="{PASS}" target="_blank" rel="noopener">pass.culture.fr</a>)</li>
    </ul>
    <div class="btn-groupe"><a class="btn btn-or" href="{HELLO}" target="_blank" rel="noopener">Réserver sur HelloAsso</a></div></div>
  </div>
 </div>
</section>

<section class="velours" id="verre">
 <div class="wrap duo">
  <div class="reveal"><span class="kicker">Convivialité</span><h2>Le verre de l'amitié</h2><p style="font-size:1.25rem">{esc(VERRE)}</p></div>
  <div class="reveal"><div class="encadre"><h3>Agenda externe</h3><p>Retrouvez les dates sur Agendaou.</p><a class="btn btn-ligne" href="{AGENDA}" target="_blank" rel="noopener">Ouvrir Agendaou</a></div></div>
 </div>
</section>

<section>
 <div class="wrap">
  <div class="titre-section reveal"><span class="kicker">Séjourner à Erquy</span><h2>Hébergement &amp; restauration</h2><p class="lead">Prolongez la soirée sur la côte de Penthièvre.</p></div>
  <div class="grille deux reveal">
   <div class="carte"><div class="corps"><h3>Où dormir</h3><p>Hôtels, chambres d'hôtes, campings et gîtes : la liste des hébergements est tenue par l'office de tourisme Cap d'Erquy – Val-André.</p><div class="btn-groupe"><a class="btn btn-ligne" href="https://www.capderquy-valandre.com/en/plan-your-stay/where-to-sleep" target="_blank" rel="noopener">Hébergements</a></div></div></div>
   <div class="carte"><div class="corps"><h3>Où dîner</h3><p>Restaurants et crêperies d'Erquy : sélection à compléter avec l'office de tourisme.</p><div class="btn-groupe"><a class="btn btn-ligne" href="{OT}" target="_blank" rel="noopener">Office de tourisme</a></div></div></div>
  </div>
 </div>
</section>
"""
    o += footer(); write("en-pratique.html", o)

# ================= CONTACT / MERCI / MENTIONS =================
def contact():
    o = head("Contact", "Contacter Erquy en Scène : formulaire de contact, coordonnées, liens vers HelloAsso, la mairie d'Erquy, l'office de tourisme et les partenaires.")
    o += header("contact.html")
    o += page_hero("Contact", "Une question ? Écrivez-nous, nous répondons dès que possible.", "bando.jpg", "Contact")
    o += f"""<section>
 <div class="wrap grille deux" style="align-items:start">
  <div class="reveal">
   <h2>Écrivez-nous</h2>
   <form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact">
    <p class="cache"><label>Ne pas remplir : <input name="bot-field"></label></p>
    <label for="nom">Nom *</label><input id="nom" name="nom" type="text" required autocomplete="name">
    <label for="email">Adresse e-mail *</label><input id="email" name="email" type="email" required autocomplete="email">
    <label for="sujet">Sujet *</label><input id="sujet" name="sujet" type="text" required>
    <label for="message">Message *</label><textarea id="message" name="message" required></textarea>
    <button class="btn btn-or" type="submit">Envoyer le message</button>
   </form>
   <p class="meta" style="margin-top:14px;color:var(--texte-doux)">Pour réserver, utilisez la billetterie en ligne ou l'office de tourisme.</p>
  </div>
  <div class="reveal">
   <h2>Coordonnées</h2>
   <ul class="coches">
    <li><strong>Adresse :</strong> Mairie d'Erquy, 11 Square de l'Hôtel de Ville, 22430 Erquy</li>
    <li><strong>Téléphone :</strong> <a href="tel:+33781211204">07 81 21 12 04</a></li>
    <li><strong>E-mail :</strong> <a href="mailto:contact@erquy-enscene.fr">contact@erquy-enscene.fr</a></li>
    <li><strong>Billetterie :</strong> office de tourisme d'Erquy, <a href="{TELHREF}">{TEL}</a></li>
   </ul>
   <h3>Liens utiles</h3>
   <div class="partenaires" style="justify-content:flex-start">
    <a href="{HELLO}" target="_blank" rel="noopener">HelloAsso</a>
    <a href="{MAIRIE}" target="_blank" rel="noopener">Mairie d'Erquy</a>
    <a href="{OT}" target="_blank" rel="noopener">Office de tourisme</a>
    <a href="{AGENDA}" target="_blank" rel="noopener">Agendaou</a>
   </div>
  </div>
 </div>
</section>
"""
    o += footer(); write("contact.html", o)

def merci():
    o = head("Message envoyé", "Merci pour votre message : Erquy en Scène vous répondra dès que possible.")
    o += header("contact.html")
    o += page_hero("Merci !", "Votre message a bien été envoyé.", "bando.jpg", "Contact")
    o += '<section><div class="wrap" style="text-align:center"><p class="lead" style="margin:0 auto 24px">Nous vous répondrons dès que possible.</p><a class="btn btn-or" href="index.html">Retour à l\'accueil</a></div></section>\n'
    o += footer(); write("merci.html", o)

def mentions():
    o = head("Mentions légales", "Mentions légales du site d'Erquy en Scène : éditeur, hébergement, données personnelles, crédits.")
    o += header("mentions-legales.html")
    o += page_hero("Mentions légales", "Informations légales relatives à ce site.", "bando.jpg", "Mentions légales")
    o += f"""<section><div class="wrap" style="max-width:820px">
 <h2>Éditeur</h2>
 <p>Erquy en Scène, association loi 1901.<br>Siège : Mairie d'Erquy, 11 Square de l'Hôtel de Ville, 22430 Erquy.<br>SIREN : 524 581 055 <span class="attente-tag">À confirmer</span><br>Licence d'entrepreneur de spectacles : PLATESV-R-2022-006714 (selon les affiches de la saison).<br>Contact : <a href="mailto:contact@erquy-enscene.fr">contact@erquy-enscene.fr</a> · 07 81 21 12 04</p>
 <p>Directeur de la publication : <span class="attente-tag">À compléter</span></p>
 <h2>Hébergement</h2>
 <p><span class="attente-tag">À compléter</span>Hébergeur du site définitif.</p>
 <h2>Données personnelles</h2>
 <p>Le formulaire de contact collecte votre nom, votre adresse e-mail et votre message, uniquement pour répondre à votre demande. Les données ne sont ni cédées ni utilisées à d'autres fins. Vous pouvez demander leur suppression en écrivant à l'adresse ci-dessus. Les teasers YouTube ne se chargent qu'à votre demande, au clic.</p>
 <h2>Crédits</h2>
 <p>Logo, affiches, flyers et photographies : Erquy en Scène et les compagnies concernées. Illustration de « Terreur » : affiche du spectacle. Vidéos : chaînes YouTube des compagnies et théâtres. Cartographie : © contributeurs OpenStreetMap.</p>
</div></section>
"""
    o += footer(); write("mentions-legales.html", o)

# Nettoyage des pages supprimées de la v1
for old in ("prochain-spectacle.html", "festival-theatre-amateur-2027.html", "murder-party-2027.html"):
    p = os.path.join(OUT, old)
    if os.path.exists(p): os.remove(p)
# Anciennes adresses redirigées (Netlify)
with open(os.path.join(OUT, "_redirects"), "w") as f:
    f.write(f"/prochain-spectacle.html  /{PROCHAIN['page']}  301\n/festival-theatre-amateur-2027.html  /saison-2026-2027.html#festival  301\n/murder-party-2027.html  /saison-2026-2027.html#murder-party  301\n")

home(); saison(); qui(); galerie(); pratique(); contact(); merci(); mentions()
for i, s in enumerate(SPEC): fiche(s, i)
print("ok — prochain :", PROCHAIN["titre"])
