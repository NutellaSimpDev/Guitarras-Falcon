# -*- coding: utf-8 -*-
"""Limpia la foto de Abraham: fuerza el verde de paleta a transparente."""
from PIL import Image
import warnings
warnings.filterwarnings("ignore")

SRC = r"assets\img\historia-04.png"
OUT = r"assets\img\abraham-sin-fondo.png"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()

GREEN = (71, 112, 76)
TOL = 12  # el verde de paleta es exacto; margen pequeño

n = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if abs(r - GREEN[0]) <= TOL and abs(g - GREEN[1]) <= TOL and abs(b - GREEN[2]) <= TOL:
            px[x, y] = (0, 0, 0, 0)
            n += 1

print("forced transparent:", n)

# Recortar al contenido visible
bbox = im.getbbox()
print("bbox", bbox)
im = im.crop(bbox)

# Componer preview sobre rojo
bg = Image.new("RGBA", im.size, (220, 40, 40, 255))
bg.alpha_composite(im)
bg.convert("RGB").save(r"C:\Users\EduPedu\AppData\Local\Temp\abraham-check2.jpg", quality=88)

im.save(OUT)
print("saved", OUT, im.size)

# stats
a = im.split()[-1].histogram()
print("transparent", a[0], "opaque", a[255], "semi", sum(a[1:255]))
