#!/bin/bash

if [ $# -lt 3 ]; then
	echo "usage: parse.bash <urls-file> <source-title> <source-url>"
	exit 1
fi

URLS_FILE=$(realpath $1)
if [ ! -f "${URLS_FILE}" ]; then
	echo "error: path for urls-file argument doesn't exist: ${URLS_FILE}"
	exit 1
fi

# run screenshawty
cat ${URLS_FILE} | screenshawty --concurrency 5 --wait-time 7 --browser

# run python parsing scripts, combine data
if [ ! -e ".venv" ]; then
	python3 -m venv .venv
	source .venv/bin/activate
	python3 -m pip install -r requirements.txt
else
	source .venv/bin/activate
fi
python3 shawty_parse.py shawty_output "$2" "$3"
python3 combine.py parsed-for-site/pages.json ../source/data/crossing_pages.json
python3 sort_pages.py combined_pages.json
deactivate
rm -rf parsing_scripts/.venv

mv parsed-for-site/screenshots/* ../source/images/crossing/pages/
cp sorted_pages.json backups/sorted_pages_$(date | sed 's/\ /-/g').json
mv sorted_pages.json ../source/data/crossing_pages.json

cp parsed-for-site/pages.json backups/source_pages_$(date | sed 's/\ /-/g').json
#rm -rf shawty_output parsed-for-site combined_pages.json
