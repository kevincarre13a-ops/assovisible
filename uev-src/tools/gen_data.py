# Génère les fichiers data/*.json initiaux à partir de faits relevés sur le blog officiel de l'UEV.
import json, re, unicodedata, pathlib
OUT = pathlib.Path(__file__).resolve().parents[2] / "uev-site" / "data"
def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii","ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+","-",s).strip("-")
IMA25 = "Les Imaginales 2025 (Épinal)"
IMA26 = "Les Imaginales 2026 (Épinal)"
VOS = "La Vosgiothèque (Épinal, nov. 2025)"
VIL26 = "Village des auteurs régionaux, Le Thillot (juin 2026)"
BAL26 = "Fête du Ballon d'Alsace (16 août 2026)"
people = [
 ("Delphine","Arnould",[IMA26]),
 ("André","Balaud",[IMA26,VIL26]),
 ("Jérôme","Bonnet",[IMA25,IMA26,VOS]),
 ("Nicolas","Cassagnau",[IMA25,IMA26,VOS,VIL26,BAL26]),
 ("Vincent","Decombis",[VOS]),
 ("Élodie","Déelle",[IMA26,VOS,BAL26]),
 ("Coralie","Desgranges",[IMA26]),
 ("Micheline","Faliguerho",[IMA25,IMA26,VOS,VIL26]),
 ("Marie-France","Houlbreque",[VOS]),
 ("Olivier","d'Icarie",[IMA25]),
 ("Ludovic","Jacquemer",[IMA26]),
 ("Jeph (Jean-Philippe Vauthier)","",[VOS]),
 ("Laurent","Joly",[IMA25]),
 ("Sébastien","Klein",[IMA26]),
 ("Philippe","Mengin",[IMA26]),
 ("Marjolaine","Pauchet",[IMA25,IMA26,BAL26]),
 ("Pierre-Olivier","Poyard",[VOS]),
 ("Cédric","Prévot",[VOS]),
 ("Thierry","Schmaltz",[IMA25,IMA26]),
 ("Alixe","Sylvestre",[VOS]),
 ("Céleste","Torino",[IMA25,IMA26]),
 ("René-Vincent","Viry",[IMA25,VIL26]),
 ("Ginette","Walter",[VOS]),
]
extra = {
 "Vincent Decombis": dict(role="Président de l'UEV", bio="Président de l'Union des Écrivains Vosgiens et auteur du blog officiel. Il défend une association où l'on ne distingue pas les auteurs publiés des écrivants en attente de l'être : « tous écrivains ! »"),
 "Jeph (Jean-Philippe Vauthier)": dict(genres=["Poésie","Chanson"], bio="Poète, slameur et chanteur sous le nom de JePh, après quinze ans comme chanteur du groupe « Tournée Générale ». Premier album « Mon Pays » (2020). Il a donné le concert final de la Journée des auteurs, le 9 novembre 2025 à Épinal."),
 "Pierre-Olivier Poyard": dict(role="À l'initiative de la Journée des auteurs (9 nov. 2025)", bio="À l'origine de la Journée des auteurs du 9 novembre 2025, pensée pour cerner et développer le pôle auteurs de l'UEV."),
 "Alixe Sylvestre": dict(bio="Citée par l'UEV comme lauréate du prix Erckmann-Chatrian."),
 "Nicolas Cassagnau": dict(role="Contact du projet de site"),
}
auteurs=[]
for p,n,pres in people:
    nom=(p+" "+n).strip()
    short = "Jeph" if n=="" else nom
    ini = "J" if n=="" else (p[0]+n[0]).upper()
    e = extra.get(nom, {})
    auteurs.append(dict(id=slug(short if n=="" else nom), nom=short, initiales=ini, role=e.get("role",""), genres=e.get("genres",[]), ville="", bio=e.get("bio",""), photo=None, photoCredit="", ouvrages=[], presences=pres, lien=""))
auteurs.sort(key=lambda a: a["nom"].split()[-1].lower() if a["id"]!="jeph" else "jeph")
(OUT/"auteurs.json").write_text(json.dumps(auteurs,ensure_ascii=False,indent=2),encoding="utf-8")
print(len(auteurs),"auteurs")
