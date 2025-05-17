import requests, sys, json

if len(sys.argv) < 2:
    print(f"usage: python3 {sys.argv[0]} api-key-file query")
    sys.exit(1)

apikey_file = sys.argv[1]
tlds = []
with open("tlds.txt", "r") as f:
    tlds = ["site:"+l.strip() for l in f.readlines()]
query = " OR ".join(tlds)

print("querying:", query)

key = None
try:
    with open(apikey_file, "r") as f:
        key = f.read().strip()
except FileNotFoundError:
    print("could not find api-key file")
    sys.exit(1)

for i in range(0,80):
    params = {
            "q": query,
            "hl": "en",
            "gl": "us",
            "api_key": key,
            "start": i,
            "engine": "bing"
            }

    try:
        r = requests.get("https://serpapi.com/search", params=params)
    except Exception as e:
        print(f"failed: {e}")

    data = r.json()
    with open(f"output_{i}.json", "w") as f:
        json.dump(data, f, indent=2)
