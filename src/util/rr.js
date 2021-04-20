
export function boatUrl(oga_no, location ) {
    let test = '';
    if (location.pathname.includes('test')) {
      test = 'test_';
    }
    // TODO https://www.oga.org.uk/boat_register/boat/?oga_no=315
    return `${location.origin}/boat_register/browse_the_register/${test}boat.html?oga_no=${oga_no}`;
}

export function mapState(s) {
  const state = { filters: {}, view: {} };
  Object.keys(s).forEach((key) => {
    const value = s[key];
    switch (key) {
      case "bpp":
        state.bpp = parseInt(value, 10);
        break;
     case "p":
        state.page = parseInt(value, 10);
        break;
      case "asc":
        state.sortDirection = value === "true" ? "asc" : "desc";
        break;
      case "v_sale":
        state.view.sale = value === "true";
        break;
      default:
        if (key.startsWith("f_")) {
          const k = key.replace("f_", "");
          if (state.filters) {
            state.filters[k] = value;
          } else {
            state.filters = { [k]: value };
          }
        } else if (key.startsWith("v_")) {
          const k = key.replace("v_", "");
          state.view[k] = value.split('|');
        } else {
          state[key] = value;
        }
    }
  });
  return state;
}
