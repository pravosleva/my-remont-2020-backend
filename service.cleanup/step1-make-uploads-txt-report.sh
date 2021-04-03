#!/bin/bash

EXTERNAL_DIR=""$(dirname "$PWD")""
echo $EXTERNAL_DIR
SERVICE_DIR=$EXTERNAL_DIR/backend/service.cleanup
REPORT_ALL_PHOTOS_LIST_FILENAME=report.all-photos.txt
REPORT_TOTAL_FILENAME=report.total.txt
REPORT_JSON_FILENAME=report.uploads-dir.json

if [ ! -d "${EXTERNAL_DIR}/backend/public/uploads" ]
  then
    echo "${EXTERNAL_DIR}/backend/public/uploads Should be created"
    # mkdir "${EXTERNAL_DIR}/backend/public/demo"
    exit 1
fi

# STEP 1.1: Список файлов
ls "${EXTERNAL_DIR}/backend/public/uploads" > $SERVICE_DIR/$REPORT_ALL_PHOTOS_LIST_FILENAME &&

# STEP 1.2: Total counter
wc -l $SERVICE_DIR/$REPORT_ALL_PHOTOS_LIST_FILENAME | awk '{ print $1 }' > $SERVICE_DIR/$REPORT_TOTAL_FILENAME

# STEP 2: Make json string and write as report
# NOTE: Решил средствами Node
# FILES=$EXTERNAL_DIR/$REPORT_ALL_PHOTOS_LIST_FILENAME
# while IFS= read -r line
# do
#   # NOTE: push to array
#   echo "{\"filename\":\"$line\"}"
# done < "$FILES"
