#!/bin/bash
# Exit if any errors
set -e

echo Getting latest website changes...
git pull

echo Re-generating website...
node build.js

echo Uploading website...
git commit -am "Updated packages."
git push