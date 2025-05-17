# combine to 'pages.json' files

import json, sys

file1 = sys.argv[1]
file2 = sys.argv[2]
out = "combined_pages.json"

pages = []
with open(file1, "r") as f:
    pages = json.load(f)
with open(file2, "r") as f:
    pages += json.load(f)
with open(out, "w") as f:
    json.dump(pages, f)
