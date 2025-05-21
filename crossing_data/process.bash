#!/bin/bash

BATCH_SIZE=20

if [ $# -lt 1 ]; then
	echo "usage: parse.bash <urls-file>"
	exit 1
fi

URLS_FILE=$(realpath $1)
if [ ! -f "${URLS_FILE}" ]; then
	echo "error: path for urls-file argument doesn't exist: ${URLS_FILE}"
	exit 1
fi

urls=$(cat ${URLS_FILE})

starting_pwd=$(pwd)

while [ "${urls}" != "" ]; do
	cd ${starting_pwd}
	current_batch=$(echo ${urls} | sed 's/\ /\n/g' | head -n ${BATCH_SIZE})

	cd parsing_scripts
	echo ${current_batch} | sed 's/\ /\n/g' | screenshawty --concurrency 5 \
		--wait-time 7 --browser

	if [ ! -e ".venv" ]; then
		python3 -m venv .venv
		source .venv/bin/activate
		python3 -m pip install -r requirements.txt
	else
		source .venv/bin/activate
	fi

	python3 shawty_parse.py shawty_output
	python3 request_titles.py parsed-for-site
	python3 combine.py parsed-for-site/pages.json ../../data/crossing/pages.json
	python3 remove_duplicates.py combined_pages.json

	deactivate

	mv parsed-for-site/screenshots/* ../../source/images/crossing/pages/
	mv combined_pages.json ../../data/crossing/pages.json

	rm -rf shawty_output parsed-for-site

	cd ../../
	./move.bash

	set -- ${urls}
	shift ${BATCH_SIZE}
	if [ $? -ne 0 ]; then
		urls=""
	else
		urls="$*"
	fi
done

cd ${starting_pwd}
rm -rf parsing_scripts/.venv
