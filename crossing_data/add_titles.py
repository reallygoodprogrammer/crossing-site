# Visit pages and extract titles

import json, os, sys, requests
from bs4 import BeautifulSoup

# pages -> file path for 'pages.json' file
def request_titles(pages : str):
    pages = []
    with open(pages, "r") as f:
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
                return True
        return False

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

    with open(pages, "w") as f:
        json.dump(pages, f)

if __name__ == "__main__":
    request_titles(sys.argv[1]+"/pages.json")
