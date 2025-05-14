#!/bin/bash

HOST="ftp-usa.nekoweb.org"
PORT="30000"
LOCAL_BUILD_DIR=$(readlink -f "$0" | sed 's/\/move_saplove\.bash$//g')/build

cd ${LOCAL_DIR}
middleman build

if [ $? -ne 0 ]; then
	echo "[!] build failed"
	exit 1
fi

# move files to ftp server
lftp ${HOST}:${PORT} <<EOF
mirror -R --only-newer "${LOCAL_BUILD_DIR}/" "/"
bye
EOF
