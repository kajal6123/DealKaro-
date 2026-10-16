import os, io, shutil, base64
from PIL import Image, ImageDraw

RES = os.environ.get("RES", "android/app/src/main/res")

if os.path.exists("icon.b64"):
    data = base64.b64decode(open("icon.b64").read())
    im = Image.open(io.BytesIO(data)).convert("RGB")
else:
    N = 1024
    im = Image.new("RGB", (N, N), (14, 16, 51))
    d = ImageDraw.Draw(im)
    d.arc([370, 190, 654, 520], 180, 360, fill=(255, 226, 122), width=40)
    d.rounded_rectangle([250, 380, 774, 860], 70, fill=(255, 196, 0))

shutil.rmtree(os.path.join(RES, "mipmap-anydpi-v26"), ignore_errors=True)
for name, size in [("mdpi", 48), ("hdpi", 72), ("xhdpi", 96), ("xxhdpi", 144), ("xxxhdpi", 192)]:
    folder = os.path.join(RES, "mipmap-" + name)
    os.makedirs(folder, exist_ok=True)
    small = im.resize((size, size), Image.LANCZOS)
    small.save(os.path.join(folder, "ic_launcher.png"))
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size * 4 - 1, size * 4 - 1], fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    rnd = small.convert("RGBA")
    rnd.putalpha(mask)
    rnd.save(os.path.join(folder, "ic_launcher_round.png"))
print("icons written to", RES)
