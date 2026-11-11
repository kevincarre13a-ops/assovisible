# Compose le guide illustré (HTML -> PDF). Usage : python3 guide-build.py <dossier-captures> [pages.json]
import sys, json, os
D = sys.argv[1]
PW = os.environ['GUIDE_PW']  # mot de passe fourni à l'exécution, jamais écrit dans le dépôt
pages = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}

def legend(items):
    return '<ol class="leg">' + ''.join(f'<li><span class="n">{i}</span><div>{t}</div></li>' for i, t in items) + '</ol>'

def fig(img, caption):
    return f'<figure><img src="{img}.jpg" alt=""><figcaption>{caption}</figcaption></figure>'

def tip(t): return f'<div class="tip"><b>💡 Astuce</b> {t}</div>'
def warn(t): return f'<div class="warn"><b>⚠ Important</b> {t}</div>'
def chap(num, title): return f'<h1 class="chap" data-t="{title}"><span class="cn">{num}</span>{title}</h1>'

CH = []  # (titre, html)
def add(title, html): CH.append((title, html))

add("Le principe : enregistrer, puis mettre en ligne", f"""
<p class="lead">Modifier votre site se fait <b>en deux temps</b>. C'est la règle la plus importante de ce guide.</p>
<div class="two">
  <div class="step s1"><div class="big">1</div><h3>Vous modifiez et vous enregistrez</h3><p>Page après page, en français et en breton. Chaque page terminée, vous cliquez sur <b>« Enregistrer »</b>.</p><p class="small">Vos changements sont <b>gardés en brouillon</b>. Les visiteurs ne voient encore rien.</p></div>
  <div class="arrow">➜</div>
  <div class="step s2"><div class="big">2</div><h3>Vous mettez en ligne, une seule fois</h3><p>Quand <b>toutes</b> vos pages sont terminées, vous cliquez <b>une seule fois</b> sur <b>« Mettre le site en ligne »</b>.</p><p class="small">Tous vos changements apparaissent alors d'un coup sur le site.</p></div>
</div>
{warn("Ne mettez pas en ligne page par page. Plusieurs mises en ligne successives peuvent provoquer des erreurs sur le site. Une seule mise en ligne, à la fin, quand tout est terminé.")}
<h3>Ce que vous pouvez modifier</h3>
<ul class="ok"><li>Tous les <b>textes</b> de toutes les pages, en français et en breton</li><li>Toutes les <b>photos</b> (les changer, en ajouter, les supprimer) et leurs légendes</li><li>Les <b>événements</b> de l'agenda, les livres, les actualités, les affiches</li><li>Les <b>liens</b> et les <b>documents à télécharger</b> (PDF, Word…)</li><li>Les <b>coordonnées</b> en bas de page et les chiffres clés</li></ul>
<h3>Ce qui n'est pas possible</h3>
<ul class="no"><li>Ajouter ou supprimer une page du site</li><li>Changer le design (couleurs, mise en page, menu)</li><li>Changer le mot de passe : demandez-le à Kevin Carré</li></ul>
""")

add("Se connecter à l'espace administrateur", f"""
<p class="lead">L'espace administrateur est la partie privée du site, où vous faites vos modifications. Seule une personne qui connaît l'identifiant et le mot de passe peut y entrer.</p>
<h3>Étape 1 : trouver le lien en bas de page</h3>
<p>Allez sur le site <b>https://eost-telgruc.fr</b>, puis descendez tout en bas de n'importe quelle page. À droite de la dernière ligne, cliquez sur <b>« Espace administrateur »</b> (« Takad merañ » sur la version bretonne).</p>
{fig('01-pied-de-page','Le lien se trouve tout en bas, à droite, sur chaque page du site.')}
{legend([(1,"Lien <b>« Espace administrateur »</b> : cliquez dessus.")])}
{tip("Vous pouvez aussi écrire directement l'adresse <b>eost-telgruc.fr/admin</b> dans la barre d'adresse de votre navigateur.")}
<h3>Étape 2 : saisir l'identifiant et le mot de passe</h3>
{fig('02-connexion','L’écran de connexion.')}
{legend([(1,"Dans <b>Identifiant</b>, écrivez : <b>eost</b>"),(2,"Dans <b>Mot de passe</b>, écrivez votre mot de passe (<b>{PW}</b>). Il s'écrit en petites lettres, avec des tirets. Les points qui s'affichent sont normaux : cochez « Afficher le mot de passe » pour vérifier ce que vous avez tapé."),(3,"Cliquez sur le bouton vert <b>« Entrer »</b>.")])}
{tip("Si un message dit « Identifiant ou mot de passe incorrect », vérifiez les tirets et les majuscules (il n'y en a pas). Après plusieurs erreurs de suite, patientez un quart d'heure avant de réessayer.")}
""")

add("Le menu principal", f"""
<p class="lead">Une fois connecté, vous arrivez sur le menu. C'est le point de départ de toutes vos modifications.</p>
{fig('03-menu','Le menu principal de l’espace administrateur.')}
{legend([(1,"<b>Pages en français</b> : les 9 pages de la version française du site."),(2,"Cliquez sur le nom d'une page pour la modifier. Sous le nom, vous voyez son état : « Version d'origine », « Modifiée le… » ou « Enregistrée, pas encore en ligne »."),(3,"<b>Pages en breton</b> : les mêmes pages, en breton."),(4,"<b>Se déconnecter</b> : pour fermer votre session quand vous avez terminé.")])}
<p>Au-dessus des pages, un cadre vous indique si des modifications attendent d'être mises en ligne (voir le chapitre « Mettre le site en ligne »). Tout en bas du menu, vous trouvez aussi <b>« Aide »</b> et <b>« Voir le site en ligne »</b>.</p>
""")

add("Ouvrir une page et repérer les boutons", f"""
<p class="lead">Cliquez sur une page du menu : elle s'ouvre telle que les visiteurs la voient, mais vous pouvez cliquer dessus pour la modifier. Les zones modifiables sont entourées de <b>pointillés bleus</b>.</p>
{fig('04-editeur-barre','La barre du haut, avec tous les boutons dont vous avez besoin.')}
{legend([(1,"<b>← Retour au menu</b> : revenir à la liste des pages."),(2,"Le <b>nom de la page</b> et sa langue (français ou breton). Quand vous avez modifié quelque chose, « ● Modifications non enregistrées » apparaît ici."),(3,"<b>✔ Enregistrer</b> : garde vos changements en brouillon."),(4,"<b>Annuler la dernière action</b> : défait le dernier déplacement, ajout ou suppression."),(5,"<b>Anciennes versions</b> : retrouver une version précédente de la page."),(6,"<b>Aide</b> : un rappel des gestes essentiels."),(7,"<b>Voir la page</b> : ouvre la page <b>avec vos modifications</b> dans un nouvel onglet, pour la relire comme un visiteur.")])}
<p>Sous la barre, la bande jaune rappelle les trois gestes : cliquer sur un texte pour le modifier, cliquer sur une photo pour la changer, cliquer dans un élément pour le déplacer, l'ajouter ou le supprimer.</p>
{tip("Le menu du site (Accueil, Agenda…) en haut de la page n'est pas modifiable : c'est normal.")}
""")

add("Modifier un texte", f"""
<p class="lead">Modifier un texte se fait comme dans un traitement de texte : on clique, on écrit.</p>
{fig('05-texte','Un titre en cours de modification.')}
{legend([(1,"<b>Cliquez sur le texte</b> à changer (ici le titre). Un cadre apparaît autour. Écrivez, effacez ou corrigez comme d'habitude avec votre clavier."),(2,"Dès que vous changez quelque chose, <b>« Modifications non enregistrées »</b> s'affiche : c'est le signal qu'il faut enregistrer.")])}
<ol class="steps"><li>Cliquez à l'endroit du texte où vous voulez écrire.</li><li>Tapez ou effacez avec le clavier. Les touches <b>Retour arrière</b> et <b>Suppr</b> effacent.</li><li>Vous pouvez changer autant de textes que vous voulez sur la page.</li><li>Quand la page est terminée, cliquez sur <b>« Enregistrer »</b> (chapitre suivant).</li></ol>
{tip("Vous vous trompez ? Le raccourci <b>Ctrl + Z</b> annule la frappe en cours, et le bouton « Annuler la dernière action » défait un déplacement ou une suppression d'élément.")}
""")

add("Enregistrer votre travail", f"""
<p class="lead">Quand vous avez terminé une page, cliquez sur le grand bouton vert pour la garder en mémoire.</p>
{fig('06-avant-enregistrer','Avant d’enregistrer : le bouton vert et le signal « Modifications non enregistrées ».')}
{legend([(1,"<b>✔ Enregistrer</b> : cliquez dessus quand la page est terminée."),(2,"Ce signal disparaît une fois la page enregistrée.")])}
{fig('07-enregistre','Après avoir cliqué : un message vert confirme l’enregistrement.')}
{legend([(1,"« <b>Enregistré. Pas encore en ligne</b> » : vos changements sont gardés en brouillon. <b>Les visiteurs ne les voient pas encore.</b>")])}
{warn("Enregistrer ne met pas le site en ligne. Pour que les visiteurs voient vos modifications, il faut ensuite faire la mise en ligne (chapitre « Mettre le site en ligne »). Pensez à enregistrer avant de quitter une page, sinon vos changements seraient perdus : si vous oubliez, le site vous le rappelle.")}
""")

add("Changer une photo", f"""
<p class="lead">Changer une photo est très simple, et vous n'avez rien à préparer : le site réduit automatiquement la photo pour qu'elle reste rapide à afficher.</p>
<h3>Étape 1 : cliquer sur la photo</h3>
{fig('15-photo-clic','Sur la page Galerie, cliquez sur la photo à remplacer.')}
{legend([(1,"Cliquez sur la <b>photo</b> à changer.")])}
<h3>Étape 2 : choisir la nouvelle photo</h3>
{fig('16-photo-dialogue','La fenêtre « Changer la photo ».')}
{legend([(1,"Cliquez sur <b>« Choisir une photo sur mon ordinateur… »</b>, puis sélectionnez la photo dans vos dossiers (formats JPG, PNG, GIF ou WEBP).")])}
<h3>Étape 3 : vérifier et valider</h3>
{fig('17-photo-prete','La nouvelle photo est prête.')}
{legend([(1,"Le message vert « <b>Photo prête</b> » confirme que la photo est bien chargée."),(2,"<b>Description de la photo</b> : écrivez en quelques mots ce que montre la photo. Elle sert aux personnes qui ne voient pas bien l'image."),(3,"Cliquez sur <b>« Utiliser cette photo »</b>. (« Annuler » ferme la fenêtre sans rien changer.)")])}
<h3>Étape 4 : modifier la légende</h3>
{fig('18-photo-changee','La photo a changé. La légende dessous se modifie comme un texte.')}
{legend([(1,"La <b>nouvelle photo</b> est en place."),(2,"La <b>légende</b> : cliquez dessus pour la modifier, comme n'importe quel texte.")])}
<p>N'oubliez pas ensuite de cliquer sur <b>« Enregistrer »</b>.</p>
""")

add("Ajouter, déplacer ou supprimer un élément", f"""
<p class="lead">Un « élément » est un bloc de la page : un événement de l'agenda, une photo de la galerie, un livre, une actualité… Une petite barre noire permet de le déplacer, le copier ou le supprimer.</p>
<h3>Faire apparaître la barre</h3>
{fig('08-barre-element','Cliquez dans un élément : la barre noire apparaît au-dessus.')}
{legend([(1,"Cliquez <b>à l'intérieur d'un élément</b> (par exemple sur son titre) : la <b>barre noire</b> apparaît."),(2,"<b>↑ Monter</b> : remonte l'élément d'un cran."),(3,"<b>↓ Descendre</b> : le descend d'un cran."),(4,"<b>+ Ajouter un autre comme celui-ci</b> : crée une copie juste en dessous."),(5,"<b>✖ Supprimer</b> : retire l'élément (une confirmation vous est demandée).")])}
<h3>Ajouter un nouvel événement ou une nouvelle photo</h3>
<p>On ne part jamais d'une page blanche : on <b>copie un élément existant</b>, puis on modifie la copie. Ainsi, la mise en page est toujours respectée.</p>
{fig('09-copie-modifiee','L’élément a été copié, puis son titre et son texte ont été modifiés.')}
{legend([(1,"La <b>copie</b> : cliquez sur son titre et son texte pour les remplacer par les vôtres (date, titre, description).")])}
<h3>Supprimer un élément</h3>
{fig('10-supprimer','Une confirmation évite les erreurs.')}
{legend([(1,"<b>Non, annuler</b> : l'élément est conservé."),(2,"<b>Oui, supprimer</b> : l'élément disparaît de la page (il reste récupérable avec « Annuler la dernière action »).")])}
<h3>Classer une photo de la galerie</h3>
{fig('19-galerie-rubrique','Dans la galerie, la barre propose une « Rubrique ».')}
{legend([(1,"La barre noire d'une photo de la galerie."),(2,"<b>Rubrique</b> : choisissez dans la liste le thème de la photo (Moulin, Livres, Conférences, Breton, Randonnées, Assemblées). Les visiteurs peuvent filtrer la galerie avec ces thèmes.")])}
""")

add("Changer un lien ou un document à télécharger", f"""
<p class="lead">Certains boutons ouvrent un document (par exemple une affiche en PDF) ou une autre page. Vous pouvez changer le document ou l'adresse du lien.</p>
{fig('20-lien-puce','Cliquez sur le bouton ou le lien : une petite bulle jaune apparaît.')}
{legend([(1,"Cliquez sur <b>« Modifier le lien ou le document »</b>.")])}
{fig('21-lien-dialogue','La fenêtre « Modifier le lien ».')}
{legend([(1,"<b>Choisir un document…</b> : sélectionnez un fichier de votre ordinateur (PDF, Word, LibreOffice ou Excel, 4 Mo maximum). Il est envoyé automatiquement et le bouton pointe vers lui. Vous pouvez aussi écrire une adresse de page ou de site dans la case du haut."),(2,"Cliquez sur <b>« Valider »</b>.")])}
{tip("La case « Ouvrir dans un nouvel onglet » est cochée par défaut : le visiteur garde ainsi votre site ouvert pendant qu'il lit le document.")}
""")

add("Le pied de page et les chiffres clés", f"""
<p class="lead">Le bas de page contient les coordonnées de l'association. Il est <b>commun à toutes les pages d'une même langue</b> : si vous le modifiez une fois, le changement s'applique à toutes les pages en français (ou en breton).</p>
{fig('22-pied-de-page-edition','Ici, le numéro de téléphone du pied de page est en cours de modification.')}
{legend([(1,"Cliquez sur la ligne à changer (adresse, téléphone, e-mail…) et écrivez. Le pied de page se trouve tout en bas de chaque page, quelle que soit la page que vous ouvrez dans l'éditeur.")])}
<h3>Les chiffres clés de l'accueil</h3>
{fig('23-chiffre','Les chiffres de la page d’accueil (années, livres, adhérents, visiteurs).')}
{legend([(1,"Cliquez sur un chiffre pour le remplacer par le nouveau (par exemple le nombre de visiteurs du moulin). Les textes qui l'accompagnent se modifient de la même façon.")])}
""")

add("Les pages en breton", f"""
<p class="lead">Chaque page existe en français et en breton, et se modifie séparément. Modifier une version ne change pas l'autre.</p>
{fig('24-menu-breton','Dans le menu, la zone « Pages en breton (Brezhoneg) ».')}
{legend([(1,"Le titre de la zone <b>Pages en breton</b>."),(2,"Les pages bretonnes portent leur nom en breton (Degemer, Ar gevredigezh, Deiziataer…). Cliquez dessus exactement comme pour une page française.")])}
{fig('25-editeur-breton','Une page bretonne dans l’éditeur.')}
{legend([(1,"Le nom de la page et la mention <b>« Version en breton »</b> vous rappellent que vous modifiez la version bretonne.")])}
{tip("Pensez à reporter vos changements dans les deux langues : par exemple un nouvel événement doit être ajouté sur la page « Agenda » et sur la page « Deiziataer ».")}
""")

add("Mettre le site en ligne (une seule fois)", f"""
<p class="lead">C'est la dernière étape : elle rend visibles aux visiteurs <b>tous</b> vos changements enregistrés.</p>
{warn("Faites-la <b>une seule fois</b>, quand <b>toutes</b> vos pages (français et breton) sont terminées. Ne mettez pas en ligne page par page : plusieurs mises en ligne successives peuvent provoquer des erreurs sur le site.")}
<h3>Étape 1 : retourner au menu</h3>
<p>Cliquez sur <b>« ← Retour au menu »</b> en haut à gauche de l'éditeur. Un cadre jaune liste les pages enregistrées mais pas encore en ligne.</p>
{fig('11-menu-en-attente','Le menu, avec des modifications en attente.')}
{legend([(1,"Le <b>cadre jaune</b> : « Modifications enregistrées, pas encore en ligne »."),(2,"<b>voir</b> : ouvre la page avec vos modifications, pour la relire une dernière fois."),(3,"<b>abandonner</b> : efface les changements enregistrés de cette page (le site en ligne ne change pas)."),(4,"Le gros bouton vert <b>« 🌐 Mettre le site en ligne »</b>."),(5,"Les pages concernées portent l'étiquette « à mettre en ligne ».")])}
<h3>Étape 2 : confirmer</h3>
{fig('12-confirmation','Une fenêtre vous demande de confirmer.')}
{legend([(1,"<b>« Oui, tout est terminé : mettre en ligne »</b> : cliquez ici si toutes vos pages sont prêtes."),(2,"<b>« Non, annuler »</b> : rien n'est mis en ligne, vous pouvez continuer vos modifications.")])}
<h3>Étape 3 : c'est en ligne</h3>
{fig('13-en-ligne','Le message de réussite.')}
<p>Cliquez sur <b>« Très bien »</b>. Le cadre jaune est remplacé par un cadre vert :</p>
{fig('14-a-jour','Le site est à jour : plus aucune modification en attente.')}
{legend([(1,"Le cadre vert <b>« Le site est à jour »</b> confirme que les visiteurs voient vos modifications.")])}
{tip("Pour vérifier, cliquez sur « Voir le site en ligne » en bas du menu : le site s'ouvre dans un nouvel onglet. Si vous ne voyez pas le changement, actualisez la page avec la touche <b>F5</b>.")}
""")

add("Vous vous êtes trompé ? Revenir en arrière", f"""
<p class="lead">Rien n'est définitif : vous pouvez revenir en arrière à tout moment.</p>
<ul class="rec">
<li><b>Annuler la dernière action</b> (dans la barre du haut) : défait le dernier déplacement, ajout ou suppression d'un élément. Vous pouvez cliquer plusieurs fois pour remonter plusieurs étapes.</li>
<li><b>Ctrl + Z</b> : annule la frappe d'un texte en cours.</li>
<li><b>Quitter sans enregistrer</b> : si vous cliquez sur « Retour au menu » avec des changements non enregistrés, le site vous propose de rester, d'enregistrer ou de quitter sans enregistrer.</li>
<li><b>abandonner</b> (dans le cadre jaune du menu) : efface les changements enregistrés d'une page qui n'est pas encore en ligne.</li>
<li><b>Anciennes versions</b> (dans l'éditeur) : retrouver une version précédente <b>mise en ligne</b>, voir ci-dessous.</li>
</ul>
{fig('26-anciennes-versions','La fenêtre « Anciennes versions ».')}
{legend([(1,"Chaque ligne est une ancienne version de la page, avec sa date. <b>« Revenir à cette version »</b> la recharge dans l'éditeur. Elle ne sera visible des visiteurs qu'après la prochaine mise en ligne. Le site garde les 20 dernières versions de chaque page."),(2,"<b>« Rétablir la version d'origine de cette page »</b> : la page revient comme elle était lors de la création du site (après mise en ligne).")])}
""")

add("Se déconnecter et questions fréquentes", f"""
<h3>Se déconnecter</h3>
<p>Quand vous avez terminé, cliquez sur <b>« Se déconnecter »</b> en haut à droite du menu. Si des pages sont enregistrées mais pas encore en ligne, le site vous le rappelle : elles restent conservées, même déconnecté. La connexion se ferme aussi automatiquement après 12 heures sans activité.</p>
<h3>Questions fréquentes</h3>
<div class="faq">
<p><b>J'ai enregistré, mais je ne vois pas le changement sur le site.</b><br>C'est normal : enregistrer ne met pas en ligne. Faites la mise en ligne depuis le menu (chapitre « Mettre le site en ligne »).</p>
<p><b>Que signifie « à mettre en ligne » sur une page du menu ?</b><br>C'est une simple étiquette : la page est enregistrée mais pas encore visible des visiteurs. Ce n'est pas un bouton. Le bouton est le gros bouton vert du cadre jaune.</p>
<p><b>Un message dit « Votre connexion a expiré ».</b><br>Ne fermez pas la page : vos modifications sont conservées. Cliquez sur « Me reconnecter » (cela s'ouvre dans un nouvel onglet), reconnectez-vous, revenez sur l'onglet précédent et cliquez de nouveau sur « Enregistrer ».</p>
<p><b>Ma photo est refusée.</b><br>Utilisez une photo au format JPG, PNG, GIF ou WEBP. Si elle est très lourde, elle est réduite automatiquement ; si elle ne se charge pas, essayez de l'enregistrer de nouveau depuis votre ordinateur avant de la choisir.</p>
<p><b>J'ai fait une erreur sur une page déjà en ligne.</b><br>Ouvrez la page, corrigez, enregistrez, puis refaites la mise en ligne. Vous pouvez aussi utiliser « Anciennes versions ».</p>
<p><b>Je n'arrive plus à me connecter / j'ai oublié le mot de passe.</b><br>Contactez Kevin Carré (AssoVisible) : lui seul peut le changer ou le renouveler.</p>
</div>
<h3>Les messages du formulaire de contact</h3>
<p>Les messages envoyés par les visiteurs via le formulaire du site arrivent <b>directement dans votre boîte e-mail</b> (yannber.kemener1@orange.fr). Il suffit de répondre à l'e-mail pour répondre à la personne.</p>
""")

# ---- HTML
toc = ''.join(f'<li><span class="tn">{i+1}</span><span class="tt">{t}</span><span class="dots"></span><span class="tp">{pages.get(t, "")}</span></li>' for i, (t, _) in enumerate(CH))
import re
wrap = lambda h: re.sub(r'(<figure>.*?</figure>)\s*(<ol class="leg">.*?</ol>)', r'<div class="blk">\1\2</div>', h, flags=re.S)
body = ''.join(f'<section class="page">{chap(i+1, t)}{wrap(h)}</section>' for i, (t, h) in enumerate(CH))
css = """
@page{size:A4;margin:16mm 15mm 18mm}
*{box-sizing:border-box}
body{font:11.4pt/1.45 'Inter','Segoe UI',Arial,sans-serif;color:#1c2b36;margin:0}
h1,h2,h3,.cover h1{font-family:Georgia,'Times New Roman',serif;color:#0b2a47}
.cover{height:262mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;background:linear-gradient(#fff,#fff)}
.cover img{width:62mm;margin-bottom:14mm}
.cover h1{font-size:34pt;line-height:1.15;margin:0 0 6mm}
.cover .sub{font-size:16pt;color:#3d5a73;margin-bottom:16mm}
.cover .band{background:#0b2a47;color:#fff;border-radius:10px;padding:8mm 12mm;font-size:13pt}
.cover .band b{color:#ffd600}
.cover .by{margin-top:22mm;color:#667;font-size:11pt}
.access{page-break-after:always}
.access h1{font-size:22pt;border-bottom:3px solid #ffd600;padding-bottom:3mm;margin-top:0}
.box{border:3px solid #0b2a47;border-radius:12px;background:#f3f8fc;padding:6mm 8mm;font-size:14pt;margin:6mm 0}
.box div{margin:2mm 0}.box b{display:inline-block;min-width:42mm}
.box code{font:700 15pt Consolas,monospace;background:#fff;border:1px solid #9bb;padding:1px 8px;border-radius:5px}
.toc{list-style:none;padding:0;margin:4mm 0 0;font-size:13pt}
.toc li{display:flex;align-items:baseline;margin:2.2mm 0}
.toc .tn{width:9mm;font-weight:700;color:#0b2a47}
.toc .dots{flex:1;border-bottom:2px dotted #99a;margin:0 4px}
.toc .tp{font-weight:700;width:8mm;text-align:right}
.page{page-break-before:always}
h1.chap{font-size:22pt;border-bottom:3px solid #ffd600;padding-bottom:3mm;margin:0 0 5mm;display:flex;align-items:center;gap:4mm}
.cn{background:#0b2a47;color:#ffd600;border-radius:50%;width:12mm;height:12mm;flex:none;display:inline-flex;align-items:center;justify-content:center;font:700 17pt Arial}
h3{font-size:13.8pt;margin:5mm 0 2mm;break-after:avoid}
.lead{font-size:12.4pt;color:#27425a;margin:0 0 3mm}
.blk{break-inside:avoid;margin-bottom:3mm}
figure{margin:3mm 0 2mm;break-inside:avoid;text-align:center}
figure img{width:100%;max-width:152mm;max-height:112mm;object-fit:contain;border:1.5px solid #b9c6d1;border-radius:8px;box-shadow:0 2px 6px #0002}
figcaption{font-size:10pt;color:#667;margin-top:1.5mm;font-style:italic}
ol.leg{list-style:none;padding:0;margin:2mm 0 4mm;break-inside:avoid}
ol.leg li{display:flex;gap:3.5mm;align-items:flex-start;margin:1.8mm 0}
.n{flex:none;width:7.5mm;height:7.5mm;border-radius:50%;background:#e53935;color:#fff;font:700 11.5pt/7.5mm Arial;text-align:center;box-shadow:0 0 0 1.5px #fff,0 0 0 2.5px #e53935}
ol.steps{padding-left:7mm}ol.steps li{margin:2mm 0}
.tip{background:#eaf6ee;border-left:6px solid #2e7d32;padding:3mm 5mm;border-radius:6px;margin:4mm 0;break-inside:avoid}
.warn{background:#fff6d6;border:3px solid #e0a800;padding:4mm 6mm;border-radius:10px;margin:5mm 0;font-size:12.6pt;break-inside:avoid}
.two{display:flex;align-items:stretch;gap:3mm;margin:5mm 0}
.step{flex:1;border-radius:12px;padding:5mm;border:3px solid #0b2a47}
.step.s1{background:#eef5fb}.step.s2{background:#e8f5e9;border-color:#2e7d32}
.step h3{margin:2mm 0}.step .big{width:13mm;height:13mm;border-radius:50%;background:#0b2a47;color:#ffd600;font:700 20pt/13mm Arial;text-align:center}
.step.s2 .big{background:#2e7d32;color:#fff}.small{font-size:10.8pt;color:#455}
.arrow{align-self:center;font-size:26pt;color:#0b2a47}
ul.ok li::marker{content:'✔  ';color:#2e7d32}ul.no li::marker{content:'✖  ';color:#c0392b}
ul.ok,ul.no{padding-left:7mm}ul.rec{padding-left:6mm}ul.rec li{margin:2.5mm 0}
.faq p{margin:2mm 0;break-inside:avoid;background:#f6f8fa;border-radius:8px;padding:2mm 4mm;font-size:10.8pt}
"""
cover = f"""<section class="cover"><img src="logo.png" alt="EOST"><h1>Guide de prise en main</h1><div class="sub">Modifier votre site EOST, pas à pas, avec des images</div>
<div class="band">https://eost-telgruc.fr<br><b>Espace administrateur : eost-telgruc.fr/admin</b></div><div class="by">Études Ouvertes sur Telgruc-sur-Mer<br>Guide réalisé par AssoVisible · Novembre 2026</div></section>"""
access = f"""<section class="access"><h1>Avant de commencer</h1><p class="lead">Ce guide explique, avec des images, comment modifier vous-même <b>tout le site</b> : textes, photos, événements, liens et documents, en français comme en breton. Aucune compétence technique n'est nécessaire.</p>
<h3 style="margin-top:4mm">Vos accès</h3><div class="box"><div><b>Adresse</b> <code>eost-telgruc.fr/admin</code></div><div><b>Identifiant</b> <code>eost</code></div><div><b>Mot de passe</b> <code>{PW}</code></div></div>
<p style="font-size:10.8pt;color:#556">Le mot de passe s'écrit en petites lettres, avec des tirets. Gardez ce guide en lieu sûr. Pour tout changement de mot de passe, contactez Kevin Carré (AssoVisible).</p>
<h3>Sommaire</h3><ul class="toc">{toc}</ul></section>"""
html = f"<!doctype html><html lang='fr'><meta charset='utf-8'><title>Guide EOST</title><style>{css}</style>{cover}{access}{body}</html>"
open(os.path.join(D, 'guide.html'), 'w', encoding='utf8').write(html)
json.dump([t for t, _ in CH], open(os.path.join(D, 'chapters.json'), 'w', encoding='utf8'), ensure_ascii=False)
