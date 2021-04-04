
export function boatUrl(oga_no, location ) {
    let test = '';
    if (location.pathname.includes('test')) {
      test = 'test_';
    }
    return `/boat_register/browse_the_register/${test}boat.html?oga_no=${oga_no}`;
}

const exports = { boatUrl };

export default exports;