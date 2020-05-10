#!/bin/sh
tar zcf build.tar.gz -C build *.js *.ico *json robots.txt index.html static
git checkout heroku
git pull
tar xf build.tar.gz
git commit . -m "updated
git push
