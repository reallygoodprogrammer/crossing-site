#!/bin/bash

if [ $# -lt 1 ]; then
	echo "usage: parse.bash <urls-file>"
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
python3 shawty_parse.py shawty_output
python3 combine.py parsed-for-site/pages.json ../../data/crossing/pages.json
deactivate
rm -rf parsing_scripts/.venv

mv parsed-for-site/screenshots/* ../source/images/crossing/pages/
mv combined_pages.json ../data/crossing/pages.json

rm -rf shawty_output parsed-for-site

cd ../

middleman build

if [ $? -ne 0 ]; then
	echo "[!] build failed"
	exit 1
fi

rm -rf  ../reallygoodprogrammer.github.io/crossing \
	../reallygoodprogrammer.github.io/stylesheets \
	../reallygoodprogrammer.github.io/javascripts \
	../reallygoodprogrammer.github.io/images

mv build/* ../reallygoodprogrammer.github.io/

cd ../reallygoodprogrammer.github.io/
git add .
git commit -m "update for site at $(date)"
git push
