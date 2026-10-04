#!/usr/bin/env python3
"""Generates PWA icons (icons/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png)."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(OUT, exist_ok=True)

BG = (47, 107, 58)        # forest green
PAPER = (246, 243, 236)   # warm paper
RED = (200, 50, 30)       # szlak red
INK = (31, 42, 34)


def draw_icon(size, maskable=False):
    s = size
    scale = 8  # supersample for smooth curves
    S = s * scale
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = 0 if maskable else int(S * 0.0)
    radius = int(S * (0.0 if maskable else 0.22))
    d.rounded_rectangle([pad, pad, S - pad, S - pad], radius=radius, fill=BG)

    # contour lines (faint)
    for i, y in enumerate([0.18, 0.30, 0.42]):
        pts = []
        for k in range(0, 41):
            x = k / 40
            yy = y + 0.05 * __import__('math').sin(x * 6.0 + i) + 0.02 * __import__('math').sin(x * 13 + i * 2)
            pts.append((x * S, yy * S))
        d.line(pts, fill=(255, 255, 255, 38), width=int(S * 0.012))

    # winding trail
    import math
    pts = []
    for k in range(0, 101):
        t = k / 100
        x = 0.16 + 0.68 * t
        y = 0.80 - 0.50 * t + 0.09 * math.sin(t * math.pi * 2.2)
        pts.append((x * S, y * S))
    d.line(pts, fill=PAPER, width=int(S * 0.085), joint='curve')
    # dashed centre line in red (trail marking feel)
    seg = 7
    for k in range(0, 100, seg * 2):
        sub = pts[k:k + seg + 1]
        if len(sub) > 1:
            d.line(sub, fill=RED, width=int(S * 0.028), joint='curve')

    # szlak blaze: white-red-white square, bottom-right
    bw = int(S * 0.26)
    bx = int(S * 0.62)
    by = int(S * 0.62)
    d.rounded_rectangle([bx, by, bx + bw, by + bw], radius=int(S * 0.03), fill=PAPER)
    band = bw // 3
    d.rectangle([bx, by + band, bx + bw, by + 2 * band], fill=RED)

    img = img.resize((s, s), Image.LANCZOS)
    return img


for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (180, 'apple-touch-icon.png')]:
    draw_icon(size).save(os.path.join(OUT, name))
draw_icon(512, maskable=True).save(os.path.join(OUT, 'icon-maskable-512.png'))
print('icons written to', os.path.abspath(OUT))
