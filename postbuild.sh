#!/bin/sh
SCRIPTS=https://oga.org.uk/boat_register/browse_the_register/scripts.html
echo post build copying
X=(`curl -s ${SCRIPTS}|grep _documents | sed -e 's/^.*href="//' -e 's/".*$//'|sort -u`)
prettier build/index.html | sed \
 -e '/DOCTYPE/d' \
 -e '/html/d' \
 -e '/head/d' \
 -e '/body/d' \
 -e '/meta/d' \
 -e "s;/boats/static/css/main.*css;${X[0]};" \
 -e "s;/boats/static/js/main.*js;${X[2]};" \
 -e "s;/boats/static/js/2.*js;${X[1]};" \
 -e '/<title>/d' \
 > build/fragment.html
