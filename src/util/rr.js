
export function boatUrl(oga_no) {
    return `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${oga_no}`;
}

export function home(location) {
    return { ...location, pathname: '/' };
}

export function boatLink(state, oga_no) {
    return { pathname: `/boat/${oga_no}`, state };
}