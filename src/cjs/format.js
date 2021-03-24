const M2F = 3.2808;

const pounds = new Intl.NumberFormat('en-GB', { currency: 'GBP', style: 'currency' });

module.exports.price = function (n) {
    if (n === 0) {
        return 'offers';
    }
    return pounds.format(n);
}

module.exports.feet = function(n) {
    return `${n.toFixed(2)} ft`;
}

module.exports.m2df = function(val) {
    if(val) {
        return (M2F*val).toFixed(2);
    }
}

module.exports.m2dsqf = function(val) {
    if(val) {
        return (M2F*M2F*val).toFixed(2);
    }
}

module.exports.m2dfn = function(val) {
    if(val) {
        return parseFloat((M2F*val).toFixed(2));
    }
}

module.exports.m2dsqfn = function(val) {
    if(val) {
        return parseFloat((M2F*M2F*val).toFixed(3));
    }
}

module.exports.f2m = function(val) {
    if(val) {
        return Math.round(1000*val/M2F) / 1000;
    }
}

module.exports.f2m2 = function(val) {
    if(val) {
        return Math.round(1000*val/M2F/M2F) / 1000;
    }
}