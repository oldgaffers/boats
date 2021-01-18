# oga-boat-register-frontend
React/MaterialUI/Apollo/GraphQL viewer for the OGA Boat Register
![Node.js CI](https://github.com/jcable/oga-boat-register-frontend/workflows/Node.js%20CI/badge.svg)

This website = should normally be accessed at https://www.oga.org.uk/boat_register/boat_register.html

Deploy by including the built css + js files in a publicly accessible place, e.g. by adding as documents on oga.org.uk
and then paste a fragment of the built index.html on each of the following pages:

1. https://www.oga.org.uk/boat_register/boat_register.html
2. https://www.oga.org.uk/boat_register/boats_for_sale/boats_for_sale.html
3. https://www.oga.org.uk/boat_register/browse_the_register/browse_the_register.html
4. https://www.oga.org.uk/boat_register/browse_the_register/boat.html

The fragment should look like:
`<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.findIndex%2CString.prototype.repeat%2CArray.prototype.flat%2CString.prototype.startsWith%2CArray.prototype.%40%40iterator"></script>
<link href="/_documents/[585642]main.6dea0f05.chunk.css" rel="stylesheet" />
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
<script>
    !(function (e) {
    function t(t) {
        for (
        var n, a, l = t[0], f = t[1], i = t[2], c = 0, s = [];
        c < l.length;
        c++
        )
        (a = l[c]),
            Object.prototype.hasOwnProperty.call(o, a) &&
            o[a] &&
            s.push(o[a][0]),
            (o[a] = 0);
        for (n in f)
        Object.prototype.hasOwnProperty.call(f, n) && (e[n] = f[n]);
        for (p && p(t); s.length; ) s.shift()();
        return u.push.apply(u, i || []), r();
    }
    function r() {
        for (var e, t = 0; t < u.length; t++) {
        for (var r = u[t], n = !0, l = 1; l < r.length; l++) {
            var f = r[l];
            0 !== o[f] && (n = !1);
        }
        n && (u.splice(t--, 1), (e = a((a.s = r[0]))));
        }
        return e;
    }
    var n = {},
        o = { 1: 0 },
        u = [];
    function a(t) {
        if (n[t]) return n[t].exports;
        var r = (n[t] = { i: t, l: !1, exports: {} });
        return e[t].call(r.exports, r, r.exports, a), (r.l = !0), r.exports;
    }
    (a.m = e),
        (a.c = n),
        (a.d = function (e, t, r) {
        a.o(e, t) ||
            Object.defineProperty(e, t, { enumerable: !0, get: r });
        }),
        (a.r = function (e) {
        "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (a.t = function (e, t) {
        if ((1 & t && (e = a(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
            (a.r(r),
            Object.defineProperty(r, "default", { enumerable: !0, value: e }),
            2 & t && "string" != typeof e)
        )
            for (var n in e)
            a.d(
                r,
                n,
                function (t) {
                return e[t];
                }.bind(null, n)
            );
        return r;
        }),
        (a.n = function (e) {
        var t =
            e && e.__esModule
            ? function () {
                return e.default;
                }
            : function () {
                return e;
                };
        return a.d(t, "a", t), t;
        }),
        (a.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
        }),
        (a.p = "/boats/");
    var l = (this.webpackJsonpboats = this.webpackJsonpboats || []),
        f = l.push.bind(l);
    (l.push = t), (l = l.slice());
    for (var i = 0; i < l.length; i++) t(l[i]);
    var p = f;
    r();
    })([]);
</script>
<script src="/_documents/[586431]2.ef590f88.chunk.js"></script>
<script src="/_documents/[586432]main.edc0eb66.chunk.js"></script>
`
