#!/bin/sh
echo post build copying
cp build/static/css/main.*.chunk.css build/static/css/main.chunk.css
cp build/static/css/main.*.chunk.css.map build/static/css/main.chunk.css.map
cp build/static/js/runtime-main.*.js build/static/js/runtime-main.js
cp build/static/js/runtime-main.*.js.map build/static/js/runtime-main.js.map
cp build/static/js/2.*.chunk.js.map build/static/js/2.chunk.js.map
cp build/static/js/main.*.chunk.js.map build/static/js/main.chunk.js.map
cp build/static/js/main.*.chunk.js build/static/js/main.chunk.js
cp build/static/js/2.*.chunk.js.LICENSE.txt build/static/js/2.chunk.js.LICENSE.txt
cp build/static/js/2.*.chunk.js build/static/js/2.chunk.js
