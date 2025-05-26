import json, sys

with open(sys.argv[1], "r") as f:
    pages = json.load(f)

sorted_pages = sorted(pages, key=lambda p: p["timestamp"])

with open("sorted_pages.json", "w") as f:
    json.dump(sorted_pages, f)
