import json
import sys
import os

pages_file = "../data/crossing/pages.json"
screenshots = "../source/images/crossing/pages/"

if len(sys.argv) < 2:
    print("usage: python3 remove.py href-values...")
    sys.exit()

with open(pages_file, "r") as f:
    pages = json.load(f)

for p in pages:
    if p["href"] in sys.argv[1:]:
        pages.remove(p)
        os.remove(screenshots + p["screenshot_url"])

with open(pages_file, "w") as f:
    json.dump(pages, f)
