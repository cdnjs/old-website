#!/bin/bash
# Exit if any errors
set -e

echo Getting latest website changes...
git pull

echo npm install for good mesure
npm install

echo Re-generating website...
node build.js

echo Uploading website...
git add .
git commit -am "Updated packages."
git push
