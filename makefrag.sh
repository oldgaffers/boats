#!/bin/sh
SCRIPTS=https://oga.org.uk/boat_register/browse_the_register/scripts.html
echo post build copying
X=(`curl -s ${SCRIPTS}|grep _documents | sed -e 's/^.*href="//' -e 's/".*$//'|sort -u`)
CSS=${X[0]}
TWO=${X[1]}
MAIN=${X[2]}
cat > build/fragment.html <<EOF
<link href="${CSS}" rel="stylesheet" />
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
<script src="${TWO}"></script>
<script src="${MAIN}"></script>
EOF
