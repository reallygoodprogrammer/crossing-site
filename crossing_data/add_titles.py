import json, os, sys, requests
from bs4 import BeautifulSoup



pages = []
with open(sys.argv[1]+"/pages.json", "r") as f:
    pages = json.load(f)

bad_words = [
        "cloudflare",
        "just a moment",
        "403 forbidden",
        "no such app",
        ]
bad_words = [b.lower() for b in bad_words]

def abort(title: str):
    for bad in bad_words:
        if bad in title.lower():
            return False
    return True

for page in pages:
    title = page["title"]
    if abort(title):
        continue

    try:
        r = requests.get(page["href"], verify=False)
    except:
        continue
    soup = BeautifulSoup(r.text, 'html.parser')
    if soup.title is not None and not abort(soup.title.string):
        page["title"] = soup.title.string

with open(sys.argv[1]+"/pages.json", "w") as f:
    json.dump(pages, f)
