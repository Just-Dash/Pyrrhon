import math
import sys
import requests
from PIL import Image, ImageFont, ImageDraw

img = Image.open(requests.get(sys.argv[1], stream=True).raw)
out = Image.new("RGB", (250, 122))
palette = Image.open("helpers/palette.png")
palette.convert("P")
img = img.convert("RGB")
scale = 1
if img.width > 250:
    scale = 250 / img.width
if img.height > 122:
    scale = min(scale, 122 / img.height)
if scale != 1:
    img = img.resize((math.floor(img.width * scale), math.floor(img.height * scale)))
img = img.quantize(colors=3, palette=palette, dither=Image.Dither.FLOYDSTEINBERG)
out = out.quantize(colors=3, palette=palette, dither=Image.Dither.NONE)
out.paste(img)
out.save("helpers/SPOILER_out.png")
print("Ok")
