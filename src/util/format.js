const pounds = new Intl.NumberFormat('en-GB', { currency: 'GBP', style: 'currency' });

export function price(n) {
    if (n === 0) {
        return 'offers';
    }
    return pounds.format(n);
}

export function feet(n) {
    return `${n.toFixed(2)} ft`;
}
