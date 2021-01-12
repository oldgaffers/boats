import { home as reactrouterdomHome, boatLink as reactrouterdomBoatLink } from './rr';
import { home as gatsbyHome, boatLink as gatsbyBoatLink  } from './gr';

export function boatUrl(oga_no) {
    return `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${oga_no}`;
}

export function home(location) {
    if (location.key) {
        return reactrouterdomHome(location);
    }
    return gatsbyHome(location);
}

export function boatLink(state, oga_no, location) {
    if (location.key) {
        return reactrouterdomBoatLink(state, oga_no);
    }
    return gatsbyBoatLink(state, oga_no);
}
