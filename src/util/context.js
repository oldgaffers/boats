import spa from './rr';
import _3pa from './gr';

export function boatUrl(oga_no) {
    return `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${oga_no}`;
}

export function home(location) {
    if (location.href) {
        return _3pa.home(location);
    }
    return spa.home(location);
}

export function boatLink(state, oga_no, location) {
    if (location.href) {
        console.log('gatsby');
        return _3pa.boatLink(state, oga_no);
    }
    console.log('not gatsby');
    return spa.boatLink(state, oga_no);
}
