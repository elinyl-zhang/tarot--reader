#!/usr/bin/env python3
"""Download Rider-Waite tarot images from Wikimedia Commons with a proper User-Agent."""
import re, os, sys, time, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = (ROOT / "scripts/download-tarot-images.js").read_text()
BASE = "https://upload.wikimedia.org/wikipedia/commons"
OUT = ROOT / "public/assets/tarot"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

# parse: "category": { "name": `${BASE_URL}/x/xy/File.jpg`, ... }
pattern = re.compile(r'"([\w/-]+)":\s*\{(.*?)\n\s*\}', re.S)
pairs = re.compile(r'"([\w-]+)":\s*`\$\{BASE_URL\}(/[^`]+)`')

jobs = []
for cat, body in pattern.findall(JS):
    for name, path in pairs.findall(body):
        jobs.append((cat, name, path))

print(f"found {len(jobs)} images")
ok = fail = 0
for cat, name, path in jobs:
    d = OUT / cat
    d.mkdir(parents=True, exist_ok=True)
    dest = d / f"{name}.jpg"
    if dest.exists() and dest.stat().st_size > 1000:
        ok += 1
        continue
    url = BASE + path
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        data = urllib.request.urlopen(req, timeout=30).read()
        dest.write_bytes(data)
        ok += 1
    except Exception as e:
        fail += 1
        print(f"  FAIL {cat}/{name}: {e}")
    time.sleep(2.6)

print(f"done: {ok} ok, {fail} failed -> {OUT}")
sys.exit(1 if fail else 0)
