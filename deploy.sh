#!/bin/sh
CURRENT=`git branch --show-current`
git checkout gh-pages
cp build/static/js/main.*.js.map .
git add *.map
git add static
cp build/static/js/main.*.js $1.js
git commit . -m ${npm_package_version}
git push
git checkout ${CURRENT}
