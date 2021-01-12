
export function home(location) {
    return { ...location, pathname: '/' };
}

export function boatLink(state, oga_no) {
    return { pathname: `/boat/${oga_no}`, state };
}

const exports = { home, boatLink };

export default exports;