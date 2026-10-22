#!/usr/bin/env python3
"""Robust tarot image downloader: JPEG-magic validated, backoff on rate limit."""
import re, sys, time, pathlib, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = (ROOT / "scripts/download-tarot-images.js").read_text()
BASE = "https://upload.wikimedia.org/wikipedia/commons"
OUT = ROOT / "public/assets/tarot"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

pattern = re.compile(r'"([\w/-]+)":\s*\{(.*?)\n\s*\}', re.S)
pairs = re.compile(r'"([\w-]+)":\s*`\$\{BASE_URL\}(/[^`]+)`')
jobs = [(cat, name, path) for cat, body in pattern.findall(JS) for name, path in pairs.findall(body)]


def is_valid(p: pathlib.Path) -> bool:
    try:
        return p.stat().st_size > 5000 and p.read_bytes()[:3] == b"\xff\xd8\xff"
    except OSError:
        return False


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/*"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


pending = [(c, n, p) for c, n, p in jobs if not is_valid(OUT / c / f"{n}.jpg")]
print(f"total {len(jobs)}, pending {len(pending)}", flush=True)

ok = fail = 0
for cat, name, path in pending:
    dest = OUT / cat / f"{name}.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    url = BASE + path
    got = False
    for attempt in range(4):
        try:
            data = fetch(url)
            if data[:3] == b"\xff\xd8\xff" and len(data) > 5000:
                dest.write_bytes(data)
                ok += 1
                got = True
                break
            print(f"  BAD-CONTENT {cat}/{name} ({len(data)}B), retrying", flush=True)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait = 8 * (attempt + 1)
                print(f"  RATE-LIMITED {cat}/{name} {e.code}, sleep {wait}s", flush=True)
                time.sleep(wait)
            else:
                print(f"  HTTP {e.code} {cat}/{name}", flush=True)
                break
        except Exception as e:
            print(f"  ERR {cat}/{name}: {e}", flush=True)
            time.sleep(4)
    if not got:
        fail += 1
    time.sleep(2.5)

valid = sum(1 for c, n, _ in jobs if is_valid(OUT / c / f"{n}.jpg"))
print(f"round done: +{ok} ok, {fail} failed, valid total {valid}/{len(jobs)}", flush=True)
sys.exit(0 if valid == len(jobs) else 1)
