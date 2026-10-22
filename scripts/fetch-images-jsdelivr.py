#!/usr/bin/env python3
"""Fetch all 78 RWS card images from a GitHub mirror via jsDelivr (no rate limiting).

Source: mixvlad/TarotCards -> tarot/rider-waite/720px/ (public-domain Rider-Waite-Smith).
Writes into the exact paths the app's LOCAL_TAROT_IMAGES expects.
"""
import re, sys, time, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public/assets/tarot"
TS = (ROOT / "src/lib/tarot-images.ts").read_text()
CDN = "https://cdn.jsdelivr.net/gh/mixvlad/TarotCards@main/tarot/rider-waite/720px/"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"

# repo file inventory (name -> filename)
REPO_MAJOR = """00_Fool 01_Magician 02_High_Priestess 03_Empress 04_Emperor 05_Hierophant
06_Lovers 07_Chariot 08_Strength 09_Hermit 10_Wheel_of_Fortune 11_Justice 12_Hanged_Man
13_Death 14_Temperance 15_Devil 16_Tower 17_Star 18_Moon 19_Sun 20_Judgement 21_World""".split()
SUIT_PREFIX = {"cups": "Cups", "wands": "Wands", "swords": "Swords", "pentacles": "Pents"}
RANK_NUM = {"ace": "01", "page": "11", "knight": "12", "queen": "13", "king": "14"}

major_by_slug = {n.lower().replace("_", "-"): f"{n}.jpg" for n in REPO_MAJOR}

# parse app's local paths
i = TS.find("LOCAL_TAROT_IMAGES")
block = TS[i : TS.find("\n};", i)]
targets = re.findall(r"\$\{LOCAL_BASE\}/([\w/-]+\.jpg)", block)
print(f"targets from mapping: {len(targets)}")


def source_name(rel: str):
    parts = rel.split("/")
    if parts[0] == "major-arcana":
        return major_by_slug.get(parts[1][:-4])
    suit = parts[1]
    rank = parts[2][:-4]
    num = RANK_NUM.get(rank, rank.zfill(2))
    return f"{SUIT_PREFIX[suit]}{num}.jpg"


def valid(p: pathlib.Path) -> bool:
    try:
        return p.stat().st_size > 5000 and p.read_bytes()[:3] == b"\xff\xd8\xff"
    except OSError:
        return False


ok = fail = 0
for rel in targets:
    src = source_name(rel)
    if not src:
        print(f"  NO-SOURCE {rel}")
        fail += 1
        continue
    dest = OUT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if valid(dest) and "--force" not in sys.argv:
        ok += 1
        continue
    url = CDN + src
    got = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            if data[:3] == b"\xff\xd8\xff" and len(data) > 5000:
                dest.write_bytes(data)
                ok += 1
                got = True
                break
            print(f"  BAD-CONTENT {rel} <- {src} ({len(data)}B)")
        except Exception as e:
            print(f"  ERR {rel} <- {src}: {e}")
            time.sleep(2)
    if not got:
        fail += 1
    time.sleep(0.2)

valid_n = sum(1 for r in targets if valid(OUT / r))
print(f"done: ok={ok} fail={fail} valid={valid_n}/{len(targets)}")
sys.exit(0 if valid_n == len(targets) else 1)
