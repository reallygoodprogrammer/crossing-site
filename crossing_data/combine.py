# combine to 'pages.json' files

import json, sys

if len(sys.argv) < 3:
    print("combine two crossing pages.json files and remove dups")
    print("usage: python3 combine.py <file1> <file2>")
    sys.exit(1)

file1 = sys.argv[1]
file2 = sys.argv[2]
out = "combined_pages.json"

pages = None
with open(file1, "r") as f:
    pages = json.load(f)
with open(file2, "r") as f:
    p = json.load(f)
    pages += p

uniq_pages = []
hrefs = []
for p in pages:
    if p["href"] not in hrefs:
        uniq_pages.append(p)
        hrefs.append(p["href"])

with open(out, "w") as f:
    json.dump(uniq_pages, f)
