echo Re-generating website
node build.js
echo Uploading website...
git commit -am "Updated packages."
git push