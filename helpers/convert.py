import math
import sys
import requests
from PIL import Image, ImageFont, ImageDraw

img = Image.open(requests.get(sys.argv[1], stream=True).raw)
out = Image.new("RGB", (250, 122))
palette = Image.open("helpers/palette.png")
palette.convert("P")
img = img.convert("RGB")
scale = min(250 / img.width, 122 / img.height)
if scale != 1:
    img = img.resize((math.floor(img.width * scale), math.floor(img.height * scale)))
dither = Image.Dither.FLOYDSTEINBERG if sys.argv[2] == "true" else Image.Dither.NONE
img = img.quantize(colors=3, palette=palette, dither=dither)
out = out.quantize(colors=3, palette=palette, dither=Image.Dither.NONE)
out.paste(img)
out.save("helpers/SPOILER_out.png")
print("Ok")
