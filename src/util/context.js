import { home as reactrouterdomHome, boatLink as reactrouterdomBoatLink } from './rr';
import { home as gatsbyHome, boatLink as gatsbyBoatLink  } from './gr';

export function boatUrl(oga_no) {
    return `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${oga_no}`;
}

export function home(location) {
    if (location.href) {
        return gatsbyHome(location);
    }
    return reactrouterdomHome(location);
}

export function boatLink(state, oga_no, location) {
    if (location.href) {
        console.log('gatsby');
        return gatsbyBoatLink(state, oga_no);
    }
    console.log('not gatsby');
    return reactrouterdomBoatLink(state, oga_no);
}
