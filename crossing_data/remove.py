import json
import sys
import os

pages_file = "../data/crossing/pages.json"
screenshots = "../source/images/crossing/pages/"
page_screenshots = "../../saplove/images/crossing/pages/"

if len(sys.argv) < 2:
    print("usage: python3 remove.py href-values...")
    sys.exit()

with open(pages_file, "r") as f:
    pages = json.load(f)

for p in pages:
    if p["href"] in sys.argv[1:] or p["href"]+"/" in sys.argv[1:]:
        pages.remove(p)
        try:
            os.remove(screenshots + p["screenshot_url"])
        except FileNotFoundError:
            pass
        try:
            os.remove(page_screenshots + p["screenshot_url"])
        except FileNotFoundError:
            pass
        print(f"removed: {p['href']}")

with open(pages_file, "w") as f:
    json.dump(pages, f)
