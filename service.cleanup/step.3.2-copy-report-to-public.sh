#!/bin/bash

EXTERNAL_DIR=""$(dirname "$PWD")""

cp $PWD/service.cleanup/report.final.json $EXTERNAL_DIR/backend/public/report.final.json
