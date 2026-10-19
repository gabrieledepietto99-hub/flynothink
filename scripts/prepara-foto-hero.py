#!/usr/bin/env python3
"""FNT · R3 — prepara la fotografia della Hero (F01) e la inserisce nella pagina.

Uso:
  python3 scripts/prepara-foto-hero.py ORIGINALE.png \
      --desktop 0,0,1,1 --mobile 0.1,0,0.9,0.8 \
      --pos-d "50% 35%" --pos-m "50% 20%" --alt "…" [--stato da-approvare]

--desktop / --mobile: riquadro di ritaglio in frazioni dell'originale (x0,y0,x1,y1).
Genera AVIF, WebP e JPEG in assets/img/r3/ (metadati rimossi), sostituisce il blocco
R3:HERO-PHOTO in index.html con un <picture> e aggiunge il preload della variante giusta.
Solo Pillow, nessuna dipendenza esterna, nessun servizio online.
"""
import argparse, os, re, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'img', 'r3')
WIDTHS = {'desktop': [960, 1440, 1920, 2880], 'mobile': [480, 800, 1170]}
Q = {'avif': 52, 'webp': 74, 'jpg': 80}

def box(s):
    v = [float(x) for x in s.split(',')]
    assert len(v) == 4 and 0 <= v[0] < v[2] <= 1 and 0 <= v[1] < v[3] <= 1, s
    return v

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('--desktop', type=box, default=[0, 0, 1, 1])
    ap.add_argument('--mobile', type=box, default=[0, 0, 1, 1])
    ap.add_argument('--pos-d', default='50% 35%'); ap.add_argument('--pos-m', default='50% 20%')
    ap.add_argument('--alt', required=True); ap.add_argument('--stato', default='da-approvare')
    a = ap.parse_args()
    im = ImageOps.exif_transpose(Image.open(a.src)).convert('RGB')
    W, H = im.size
    os.makedirs(OUT, exist_ok=True)
    report, dims, made = [], {}, {}
    for kind, b in (('desktop', a.desktop), ('mobile', a.mobile)):
        crop = im.crop((round(b[0] * W), round(b[1] * H), round(b[2] * W), round(b[3] * H)))
        cw, ch = crop.size
        dims[kind] = (cw, ch)
        made[kind] = []
        for w in WIDTHS[kind]:
            if w > cw:
                report.append(f'ATTENZIONE {kind} {w}px > ritaglio {cw}px: generato a {cw}px (nessun ingrandimento)')
            tw = min(w, cw); th = round(ch * tw / cw)
            if tw in made[kind]: continue
            made[kind].append(tw)
            r = crop.resize((tw, th), Image.LANCZOS)
            for ext in ('avif', 'webp', 'jpg'):
                fn = os.path.join(OUT, f'fnt-f01-hero-{kind}-{tw}.{ext}')
                kw = {'quality': Q[ext]}
                if ext == 'jpg': kw.update(optimize=True, progressive=True)
                r.save(fn, 'JPEG' if ext == 'jpg' else ext.upper(), **kw)
                report.append(f'{os.path.relpath(fn, ROOT)}  {tw}x{th}  {os.path.getsize(fn) // 1024} KB')
    rel = 'assets/img/r3/fnt-f01-hero'
    ss = lambda k, e: ', '.join(f'{rel}-{k}-{w}.{e} {w}w' for w in made[k])
    mq_m, mq_d = '(max-width: 600px)', '(min-width: 601px)'
    sz_d = '100vw'
    dw, dh = dims['desktop']
    alt = a.alt.replace('"', '&quot;')
    mq_s = '(max-width: 600px) and (max-height: 720px)'
    pic = f'''    <picture>
      <source media="{mq_s}" type="image/avif" srcset="{ss('desktop', 'avif')}" sizes="100vw">
      <source media="{mq_s}" type="image/webp" srcset="{ss('desktop', 'webp')}" sizes="100vw">
      <source media="{mq_s}" srcset="{ss('desktop', 'jpg')}" sizes="100vw">
      <source media="{mq_m}" type="image/avif" srcset="{ss('mobile', 'avif')}" sizes="100vw">
      <source media="{mq_m}" type="image/webp" srcset="{ss('mobile', 'webp')}" sizes="100vw">
      <source media="{mq_m}" srcset="{ss('mobile', 'jpg')}" sizes="100vw">
      <source type="image/avif" srcset="{ss('desktop', 'avif')}" sizes="{sz_d}">
      <source type="image/webp" srcset="{ss('desktop', 'webp')}" sizes="{sz_d}">
      <img src="{rel}-desktop-{made['desktop'][1]}.jpg" srcset="{ss('desktop', 'jpg')}" sizes="{sz_d}" width="{dw}" height="{dh}"
           alt="{alt}" fetchpriority="high" decoding="async"
           data-rights="ai-illustrativa" data-photo-status="{a.stato}">
    </picture>'''
    pre = (f'<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="(max-width: 600px) and (min-height: 721px)" imagesrcset="{ss("mobile", "avif")}" imagesizes="100vw">\n'
           f'<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="{mq_s}" imagesrcset="{ss("desktop", "avif")}" imagesizes="100vw">\n'
           f'<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="{mq_d}" imagesrcset="{ss("desktop", "avif")}" imagesizes="{sz_d}">')
    p = os.path.join(ROOT, 'index.html'); s = open(p, encoding='utf-8').read()
    s = re.sub(r'(<!-- R3:HERO-PHOTO:START -->\n).*?(\n<!-- R3:HERO-PHOTO:END -->)', lambda m: m.group(1) + pic + m.group(2), s, flags=re.S)
    s = re.sub(r'<!-- R3:HERO-PRELOAD -->(\n<link rel="preload" as="image"[^\n]*){0,3}', lambda m: '<!-- R3:HERO-PRELOAD -->\n' + pre, s)
    s = re.sub(r'(<div class="hx-b-wrap")[^>]*>', lambda m: f'{m.group(1)} style="--hx-pos-d:{a.pos_d};--hx-pos-m:{a.pos_m};--hx-ratio-m:{dims["mobile"][0]}/{dims["mobile"][1]}">', s, count=1)
    open(p, 'w', encoding='utf-8').write(s)
    print(f'Originale {W}x{H} · desktop {dims["desktop"]} · mobile {dims["mobile"]}')
    print('\n'.join(report))

if __name__ == '__main__':
    sys.exit(main())
