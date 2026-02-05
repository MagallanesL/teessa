from math import pow

def srgb_to_linear(c):
    c = c/255.0
    if c <= 0.03928:
        return c/12.92
    return pow((c+0.055)/1.055, 2.4)

def luminance(rgb):
    r,g,b = rgb
    return 0.2126*srgb_to_linear(r) + 0.7152*srgb_to_linear(g) + 0.0722*srgb_to_linear(b)

def contrast_ratio(rgb1, rgb2):
    L1 = luminance(rgb1)
    L2 = luminance(rgb2)
    lighter = max(L1,L2)
    darker = min(L1,L2)
    return (lighter+0.05)/(darker+0.05)

colors = {
    'gold': (232,199,48),
    'rose': (232,66,111),
    'dark': (0,33,44),
    'terra': (226,163,140),
    'white': (255,255,255),
    'footer_bg': (7,16,24)
}

pairs = [
    ('dark','white'),
    ('dark','gold'),
    ('white','gold'),
    ('white','rose'),
    ('white','terra'),
    ('white','footer_bg'),
    ('gold','footer_bg'),
]

print('Contrast ratios (A higher is better). WCAG: normal text >=4.5, large text >=3.0')
for a,b in pairs:
    cr = contrast_ratio(colors[a], colors[b])
    print(f"{a} on {b}: {cr:.2f}")

mix = tuple(int((x+y)/2) for x,y in zip(colors['gold'], colors['rose']))
cr_mix = contrast_ratio(colors['white'], mix)
print(f"white on (gold+rose 50%): {cr_mix:.2f}")
