cp build/static/js/main.*.js.map .
git add *.map
cp build/static/js/main.*.js $1.js
VERSION=`npm run -s get_version`
echo ${VERSION}
sed -i -e "s/%%VERSION%%/${VERSION}/" $1.js
git commit . -m ${VERSION}
git push
