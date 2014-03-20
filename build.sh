#!/bin/bash
# Exit if any errors
set -e

echo Getting latest website changes...
git pull

echo npm install for good mesure
/usr/local/bin/npm install

echo Re-generating website...
/usr/local/bin/node build.js

echo Uploading website...
git add .
git commit -am "Updated packages."
git push

