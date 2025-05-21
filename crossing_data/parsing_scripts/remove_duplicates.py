# Remove duplicates from 'pages.json'

import json, sys

# parsed -> path to 'pages.json'
def remove_duplicates(parsed: str):
    pages = None
    with open(parsed, "r") as f:
        pages = json.load(f) 

    uniq_pages = []
    hrefs = []
    for p in pages:
        if p["href"] not in hrefs:
            uniq_pages.append(p)
            hrefs.append(p["href"])

    with open(parsed, "w") as f:
        json.dump(uniq_pages, f)

if __name__ == "__main__":
    remove_duplicates(sys.argv[1])
