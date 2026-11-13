#!/usr/bin/env python3
"""Optimise les images du dossier images/ (à lancer depuis le dossier du site).

Pour chaque image .jpg/.jpeg/.png déposée dans images/ :
  - la redimensionne (1800 px max) et la convertit en RVB si besoin ;
  - crée une version WebP (même nom, extension .webp) ;
  - crée une vignette de 640 px (suffixe -640) en JPG/PNG et WebP.
Les images déjà traitées sont ignorées. Nécessite Python 3 et Pillow :
    pip install Pillow
    python3 outils/optimiser-images.py
"""
import os, sys
from PIL import Image, ImageOps

RACINE = sys.argv[1] if len(sys.argv) > 1 else 'images'
MAX, VIGNETTE = 1800, 640

def a_de_la_transparence(im):
    return im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)

def traiter(chemin):
    base, ext = os.path.splitext(chemin)
    if base.endswith('-640') or os.path.exists(base + '.webp'):
        return
    im = Image.open(chemin)
    im = ImageOps.exif_transpose(im)
    alpha = a_de_la_transparence(im)
    im = im.convert('RGBA' if alpha else 'RGB')
    if max(im.size) > MAX:
        im.thumbnail((MAX, MAX), Image.LANCZOS)
    if alpha:
        im.save(base + '.png', optimize=True)
        if ext.lower() != '.png':
            os.remove(chemin)
    else:
        im.save(base + '.jpg', quality=82, optimize=True, progressive=True)
        if ext.lower() != '.jpg':
            os.remove(chemin)
    im.save(base + '.webp', quality=80, method=6)
    v = im.copy(); v.thumbnail((VIGNETTE, VIGNETTE), Image.LANCZOS)
    v.save(base + '-640' + ('.png' if alpha else '.jpg'), **({'optimize': True} if alpha else {'quality': 80, 'optimize': True, 'progressive': True}))
    v.save(base + '-640.webp', quality=78, method=6)
    print('ok', chemin)

for dossier, _, fichiers in os.walk(RACINE):
    for f in sorted(fichiers):
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            traiter(os.path.join(dossier, f))
