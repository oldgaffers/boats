#!/bin/sh
cd ../boat_register
rm -r static
cp -r ../boats/build/* .
git add .
git commit -m next
git push
cp index.html ../boats/x.html
cd ../boats
