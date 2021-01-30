const pounds = new Intl.NumberFormat('en-GB', { currency: 'GBP', style: 'currency' });

const M2F = 3.28084;

export function price(n) {
    if (n === 0) {
        return 'offers';
    }
    return pounds.format(n);
}

export function feet(n) {
    return `${n.toFixed(2)} ft`;
}

export function m2df(val) {
    if(val) {
        return (M2F*val).toFixed(2);
    }
}

export function m2dsqf(val) {
    if(val) {
        return (M2F*M2F*val).toFixed(2);
    }
}

export function f2m(val) {
    if(val) {
        return val/M2F;
    }
}

export function f2m2(val) {
    if(val) {
        return val/M2F/M2F;
    }
}