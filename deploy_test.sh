cp build/static/js/main.*.js.map .
cp build/static/js/main.*.js test.js
git add *.map
git commit . -m `jq -r .version package.json`
git push
