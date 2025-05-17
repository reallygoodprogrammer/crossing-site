# Parse screenshawty output directory for site

import getopt, sys, json, os
import progressbar
from PIL import Image
from datetime import datetime


def help():
    print(f"usage: python3 {sys.argv[0]} [options] <screenshawty-output-dir>")
    print(f"\t-h/--help\t\tdisplay help message")
    print(f"\t-i/--output\t\tset output directory")


# look for dump cloudflare / bad dns / 404 pages
bad_words_in_response = [
        ["invalid ssl certificate", "visit cloudflare"],
        ["buy this domain", "godaddy"]
        ]

# characters that break img filenames
bad_file_characters = ["?", "#"]

def bad_response_data(filename : str) -> bool:
    with open(filename, "r") as f:
        file_data = f.read().lower().replace("\n", " ")
        for bad_set in bad_words_in_response:
            for i, b in enumerate(bad_set):
                if b not in file_data:
                    break
                if i == len(bad_set) - 1:
                    return True
    return False

def get_data(dirname : str) -> list:
    pages = []
    try:
        with open(dirname+"/pages.json", "r") as f:
            pages = json.load(f)
    except FileNotFoundError:
        print(f"error: directory {dirname} exists and has no pages.json")
        sys.exit(1)
    return pages


def main():
    outdir = "parsed-for-site"

    opts, args = getopt.getopt(sys.argv[1:], "i:h", ["input-dir=", "help"])
    if len(args) == 0: 
        print("specify a input directory")
        help()
        sys.exit(1)

    for o, a in opts:
        if o in ["-h", "--help"]:
            help()
            sys.exit(0)
        elif o in ["-o", "--output"]:
            outfile = a[:-1] if a[-1] == "/" else a
        else:
            print(f"did not understand option {o}")
            help()
            sys.exit(1)

    pages = []
    dirname = args[0][:-1] if args[0][-1] == "/" else args[0]
    files = [f for f in os.listdir(dirname) if f.endswith("words.txt")]

    try:
        os.mkdir(outdir)
        os.mkdir(outdir+"/screenshots")
    except FileExistsError:
        pages = get_data(outdir)

    bar = progressbar.ProgressBar(maxval=len(files), widgets=['[', progressbar.Percentage(), '] ', progressbar.Bar()])
    for i, file in enumerate(files):
        bar.update(i)

        if bad_response_data(dirname+"/"+file):
            continue

        title = file.split("_")[2].split(".")[-2]
        href = file.replace("_words.txt", "").replace("_", "/")
        tags = []
        screenshot_url = ""
        ts = datetime.fromtimestamp(os.path.getmtime(dirname+"/"+file)).strftime("%Y-%m-%d %I:%M:%S%p")

        assumed_ss_file = dirname+"/"+file.replace("words.txt", "screenshot.png")
        if os.path.exists(assumed_ss_file):
            new_file = outdir+"/screenshots/"+assumed_ss_file.split("/")[-1]

            for b in bad_file_characters:
                new_file = new_file.replace(b, "_")

            ss = Image.open(assumed_ss_file)
            w = ss.width
            h = w * 0.5625
            new_ss = ss.crop((0, 0, w, h))
            new_ss.save(new_file)

            screenshot_url = new_file.split("/")[-1]
        
        pages.append({
            "title": title,
            "href": href,
            "tags": tags,
            "screenshot_url": screenshot_url,
            "timestamp": ts,
            })

    bar.finish()

    with open(outdir+"/pages.json", "w") as f:
        json.dump(pages, f, indent=4)
    

if __name__ == "__main__":
    main()
