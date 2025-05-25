import json
import sys
import os

pages_file = "../source/data/crossing_pages.json"
screenshots = "../source/images/crossing/pages/"
remove_file = ".removed_urls.txt"

if len(sys.argv) < 2:
    print("remove entries in crossing by 'href'")
    print("usage: python3 remove.py href-values...")
    sys.exit()

with open(pages_file, "r") as f:
    pages = json.load(f)

for p in pages:
    if p["href"].lower() in sys.argv[1:] or p["href"].lower()+"/" in sys.argv[1:]:
        pages.remove(p)
        try:
            os.remove(screenshots + p["screenshot_url"])
        except FileNotFoundError:
            pass
        print(f"removed: {p['href']}")
        with open(remove_file, "a") as f:
            f.write(p["href"]+"\n")

with open(pages_file, "w") as f:
    json.dump(pages, f)
