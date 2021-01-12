import spa from './rr';
import _3pa from './gr';

export function boatUrl(oga_no, location) {
    if (location.href) {
        return _3pa.boatUrl(oga_no, location);
    }
    return spa.boatUrl(oga_no, location);
}

export function home(location) {
    if (location.href) {
        return _3pa.home(location);
    }
    return spa.home(location);
}

export function boatLink(state, oga_no, location) {
    if (location.href) {
        return _3pa.boatLink(state, oga_no, location);
    }
    return spa.boatLink(state, oga_no);
}
