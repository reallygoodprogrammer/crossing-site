# combine to 'pages.json' files

import json, sys

file1 = sys.argv[1]
file2 = sys.argv[2]
out = "combined_pages.json"

pages = None
with open(file1, "r") as f:
    pages = json.load(f)
with open(file2, "r") as f:
    p = json.load(f)
    print(type(p), type(pages))
    pages += p
with open(out, "w") as f:
    json.dump(pages, f)
