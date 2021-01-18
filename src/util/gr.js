const root = "/boat_register";
const browse_root = `${root}/browse_the_register`;
const sale_root = `${root}/boats_for_sale`;

function prefix(location) {
  if (location.href.includes("test")) {
    return "test_";
  } else {
    return "";
  }
}

export function boatUrl(oga_no, { origin, pathname }) {
  return `${origin}${pathname}?oga_no=${oga_no}`;
}

export function home(location) {
  const params = new URLSearchParams(location.search);
  const sale = params.get("f_sale") === "true";
  const path = sale ? sale_root : browse_root;
  const base = sale ? "boats_for_sale" : "browse_the_register";
  const doc = `${prefix(location)}${base}.html`;
  let home = `${path}/${doc}`;
  params.delete("f_sale"); // not needed as destination knows!
  params.delete("oga_no"); // but not f_oga_no
  const qp = params.toString();
  if (qp.length > 0) {
    home = `${home}?${qp}`;
  }
  return home;
}

export function boatLink(state, oga_no, location) {
  let qp;
  if (state) {
    const { filters, p, bpp, sort, sortDirection } = state;
    qp = `&p=${p}&bpp=${bpp}&sort=${sort}&asc=${sortDirection === "asc"}`;
    for (const field of Object.keys(filters)) {
      if (field) {
        qp = `${qp}&f_${field}=${filters[field]}`;
      }
    }
  } else {
    qp = "";
  }
  return `${browse_root}/${prefix(location)}boat.html?oga_no=${oga_no}${qp}`;
}

export function mapState(s, defaultState = {}) {
  const state = { ...defaultState };
  Object.keys(s).forEach((key) => {
    const value = s[key];
    switch (key) {
      case "p":
        state.p = value;
        break;
      case "asc":
        state.sortDirection = value === "true" ? "asc" : "desc";
        break;
      case "f_sale":
        if (state.filters) {
          state.filters.sale = value === "true";
        } else {
          state.filters = { sale: value === "true" };
        }
        break;
      default:
        if (key.startsWith("f_")) {
          const k = key.replace("f_", "");
          console.log("f_", k, value);
          if (state.filters) {
            state.filters[k] = value;
          } else {
            state.filters = { [k]: value };
          }
          console.log(state);
        } else {
          state[key] = value;
        }
    }
  });
  return state;
}

const exports = { home, boatLink, mapState, boatUrl };

export default exports;
