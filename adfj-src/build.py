#!/usr/bin/env python3
"""Assemble les pages HTML du site ADFJ (en-tête, pied de page et contenu communs).
Usage : python3 build.py   (depuis le dossier adfj-src). Les pages sont écrites dans ../adfj/
Les contenus qui changent (cours, horaires, actus, événements…) sont dans ../adfj/data/*.json : pas besoin de relancer ce script pour les modifier."""
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'adfj')
SITE = json.load(open(os.path.join(OUT, 'data', 'site.json'), encoding='utf-8'))
C = SITE['contact']

NAV = [('index.html', 'Accueil'), ('club.html', 'Le club'), ('cours-enfants.html', 'Cours enfants'),
       ('cours-adultes.html', 'Cours adultes'), ('lieux.html', 'Nos lieux'), ('evenements.html', 'Ninja Challenge'),
       ('motion-capture.html', 'Motion Capture'), ('actualites.html', 'Actualités'), ('galerie.html', 'Galerie')]

ICON_FB = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>'
ICON_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>'

PAGES = {
 'index.html': dict(key='index.html', title="Asnières Digital Fighting Jitsu — Judo, ju-jitsu, self-défense à Asnières-sur-Seine",
   desc="ADFJ, club de judo, ju-jitsu, self-défense, taiso et cardio à Asnières-sur-Seine, ouvert à toutes et à tous. Label Club Argent France Judo, Ninja Challenge, inclusion par le sport.", hero=None),
 'club.html': dict(key='club.html', title="Le club — Asnières Digital Fighting Jitsu", crumb="Le club",
   h1="Un club pour tous", lead="Judo, ju-jitsu, self-défense, taiso, cardio : un club d'Asnières-sur-Seine où l'inclusion n'est pas un mot, c'est une pratique.",
   desc="Découvrez l'ADFJ : histoire, valeurs, inclusion par le sport, label Club Argent France Judo, bureau et éducateurs à Asnières-sur-Seine.", bg='club-groupe'),
 'cours-enfants.html': dict(key='cours-enfants.html', title="Cours de judo enfants à Asnières-sur-Seine — ADFJ", crumb="Cours enfants",
   h1="Cours enfants", lead="Le judo dès 3 ans et demi, pour grandir en confiance, en respect et en rigolant.",
   desc="Cours de judo pour enfants à Asnières-sur-Seine : éveil judo (moins de 6 ans) et judo enfants, mercredi et samedi, dans trois gymnases.", bg='judo-cottonbro'),
 'cours-adultes.html': dict(key='cours-adultes.html', title="Cours adultes à Asnières : judo, ju-jitsu, self-défense, cardio — ADFJ", crumb="Cours adultes",
   h1="Cours adultes & ados", lead="Judo, ju-jitsu, self-défense, taiso, cardio/fitness : trouvez votre séance.",
   desc="Cours adultes à Asnières-sur-Seine : judo, ju-jitsu, self-défense, taiso et cardio Swiss Ball, le mardi, le samedi et le dimanche.", bg='cours-ballon'),
 'lieux.html': dict(key='lieux.html', title="Nos lieux de pratique — gymnases à Asnières-sur-Seine — ADFJ", crumb="Nos lieux de pratique",
   h1="Nos lieux de pratique", lead="Trois gymnases à Asnières-sur-Seine : Les Bruyères, Assia El Hannouni et Teddy Riner.",
   desc="Adresses, plans, accès et créneaux des trois gymnases de l'ADFJ à Asnières-sur-Seine : Les Bruyères, Assia El Hannouni, Teddy Riner.", bg='lieu-teddy-riner-1'),
 'evenements.html': dict(key='evenements.html', title="Ninja Challenge & événements d'inclusion par le sport — ADFJ", crumb="Ninja Challenge & événements",
   h1="Ninja Challenge & événements", lead="Le sport qui rassemble : parcours ninja, Sport Inclusion, Les Victoires… des rendez-vous ouverts à toutes et à tous.",
   desc="Ninja Challenge, Les Victoires, Sport Inclusion avec Helios Latchoumanaya : tous les événements d'inclusion par le sport organisés par l'ADFJ à Asnières-sur-Seine.", bg='event-2023-salle'),
 'motion-capture.html': dict(key='motion-capture.html', title="Motion Capture — Digital Fighting Studio — ADFJ", crumb="Motion Capture",
   h1="Motion Capture", lead="Quand les arts martiaux rencontrent la capture de mouvement : le Digital Fighting Studio.",
   desc="La nouveauté Motion Capture de l'ADFJ : analyser le geste sportif en 3D, corriger la technique, prévenir les blessures et favoriser l'inclusion.", bg='mocap-1'),
 'actualites.html': dict(key='actualites.html', title="Actualités du club — ADFJ Asnières-sur-Seine", crumb="Actualités",
   h1="Notre actualité", lead="Événements, presse, radio, podcasts, bonnes nouvelles : suivez la vie du club.",
   desc="Toute l'actualité de l'ADFJ : événements, articles de presse, podcasts Vivre FM, nouveautés et vie du club à Asnières-sur-Seine.", bg='club-tatami-groupe'),
 'galerie.html': dict(key='galerie.html', title="Galerie photos — ADFJ Asnières-sur-Seine", crumb="Galerie",
   h1="Galerie", lead="Cours, événements, gymnases : le club en images.",
   desc="Galerie photos de l'ADFJ : cours de judo, cardio, self-défense, événements Sport Inclusion, Les Victoires, Ninja Challenge.", bg='event-2022-groupe'),
 'inscription.html': dict(key='inscription.html', title="S'inscrire & contact — ADFJ Asnières-sur-Seine", crumb="S'inscrire & contact",
   h1="S'inscrire & nous contacter", lead="Séance d'essai, dossier, tarifs, contact : tout pour nous rejoindre.",
   desc="Inscription à l'ADFJ : séance d'essai, documents, tarifs, pré-inscription en ligne et contact à Asnières-sur-Seine.", bg='cours-tapis'),
 'mentions-legales.html': dict(key='', title="Mentions légales et politique de cookies — ADFJ", crumb="Mentions légales",
   h1="Mentions légales & cookies", lead="Informations légales, données personnelles et politique de cookies.",
   desc="Mentions légales, protection des données et politique de cookies du site de l'Asnières Digital Fighting Jitsu.", bg='club-groupe'),
 'merci.html': dict(key='', title="Message envoyé — ADFJ", crumb="Merci", noindex=True,
   h1="Merci !", lead="Votre message a bien été envoyé. Nous vous répondons très vite.", desc="Confirmation d'envoi de votre message à l'ADFJ.", bg='club-demo'),
 '404.html': dict(key='', title="Page introuvable — ADFJ", crumb="Erreur 404", noindex=True,
   h1="Oups, page introuvable", lead="Cette page n'existe pas (ou plus). Pas de panique, il y a toujours de la place chez nous.", desc="Page introuvable.", bg='club-chanbara'),
}

def head(p, fname):
    robots = '<meta name="robots" content="noindex">' if p.get('noindex') else ''
    img = 'assets/img/' + (p.get('bg') or 'event-2022-groupe') + '.webp'
    ld = ''
    if fname == 'index.html':
        ld = '<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "SportsClub", "name": SITE['nom'], "alternateName": "ADFJ",
            "slogan": SITE['accroche'], "telephone": "+33687757482", "email": C['email'],
            "address": {"@type": "PostalAddress", "streetAddress": "30 avenue de la Lauzière", "postalCode": "92600", "addressLocality": "Asnières-sur-Seine", "addressCountry": "FR"},
            "sameAs": list(SITE['reseaux'].values()), "sport": ["Judo", "Ju-jitsu", "Self-défense"]}, ensure_ascii=False) + '</script>'
    return f'''<!doctype html>
<html lang="fr" class="js-off">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p['title']}</title>
<meta name="description" content="{p['desc']}">
{robots}
<meta name="theme-color" content="#08243B">
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{p['title']}"><meta property="og:description" content="{p['desc']}">
<meta property="og:image" content="{img}">
<link rel="icon" href="assets/logos/adfj.png" type="image/png">
<link rel="apple-touch-icon" href="assets/logos/adfj.png">
<link rel="preload" href="assets/fonts/BricolageGrotesque-800-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/Figtree-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/fonts/fonts-local.css">
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.className='js'</script>
<script src="js/main.js" defer></script>
{ld}
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
'''

def header(key):
    cur = ' aria-current="page"'
    items = ''.join('<li><a href="%s"%s>%s</a></li>' % (h, cur if h == key else '', t) for h, t in NAV)
    ins = ' aria-current="page"' if key == 'inscription.html' else ''
    return f'''<header class="site-header">
 <div class="header-in">
  <a class="brand" href="index.html" aria-label="ADFJ — retour à l'accueil"><img src="assets/logos/adfj.png" alt="Logo Asnières Digital Fighting Jitsu" width="52" height="52"><span><b>ADFJ</b><small>Digital Fighting Jitsu</small></span></a>
  <nav class="nav" id="nav" aria-label="Navigation principale"><ul>{items}</ul>
   <p class="nav-extra">{C['telephone']} · <a href="mailto:{C['email']}">{C['email']}</a> · <a href="mentions-legales.html">Mentions légales</a></p></nav>
  <div class="header-cta"><a class="btn btn-primary btn-sm" href="inscription.html"{ins}>S'inscrire</a>
   <button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>
 </div>
</header>
<main id="contenu">
'''

def hero(p):
    return f'''<section class="page-hero" style="background-image:url('assets/img/{p['bg']}.webp')">
 <div class="wrap">
  <p class="crumbs"><a href="index.html">Accueil</a> › {p['crumb']}</p>
  <h1>{p['h1']}</h1>
  <p>{p['lead']}</p>
 </div>
</section>
'''

def footer():
    links = ''.join(f'<li><a href="{h}">{t}</a></li>' for h, t in NAV + [('inscription.html', "S'inscrire & contact")])
    return f'''</main>
<footer class="site-footer">
 <div class="wrap">
  <div class="foot-grid">
   <div>
    <div class="foot-brand"><img src="assets/logos/adfj.png" alt="" width="64" height="64"><span><b>ADFJ</b>Asnières Digital Fighting Jitsu</span></div>
    <p>{SITE['accroche']}<br><em>« {SITE['devise']} »</em></p>
    <div class="social"><a href="{SITE['reseaux']['facebook']}" target="_blank" rel="noopener" aria-label="Facebook de l'ADFJ (nouvelle fenêtre)">{ICON_FB}</a><a href="{SITE['reseaux']['instagram']}" target="_blank" rel="noopener" aria-label="Instagram de l'ADFJ (nouvelle fenêtre)">{ICON_IG}</a></div>
   </div>
   <div><h2>Contact</h2>
    <ul><li>{C['adresse']}</li><li><a href="tel:{C['telephone_lien']}">{C['telephone']}</a></li><li><a href="mailto:{C['email']}">{C['email']}</a></li></ul></div>
   <div><h2>Le site</h2><ul>{links}</ul></div>
   <div><h2>Nos gymnases</h2><ul data-render="venues-list"><li>Les Bruyères</li><li>Assia El Hannouni</li><li>Teddy Riner</li></ul></div>
  </div>
  <div class="foot-partners"><h2>Partenaires &amp; soutiens</h2><div class="logos footer-logos" data-render="partners"></div></div>
  <div class="foot-bottom"><span>© <span id="an">2026</span> Asnières Digital Fighting Jitsu — Association loi 1901</span>
   <span><a href="mentions-legales.html">Mentions légales</a> · <a href="mentions-legales.html#cookies">Politique de cookies</a></span></div>
 </div>
</footer>
<script>document.getElementById('an').textContent=new Date().getFullYear()</script>
</body>
</html>
'''

for fname, p in PAGES.items():
    body = open(os.path.join(HERE, 'pages', fname), encoding='utf-8').read()
    html = head(p, fname) + header(p['key']) + ('' if p.get('hero', 1) is None else hero(p)) + body + footer()
    open(os.path.join(OUT, fname), 'w', encoding='utf-8').write(html)
    print('écrit', fname)
