
export function home(location) {
  const params = new URLSearchParams(location.search);
  const doc =
    params.get("sale") === "true" ? "boats_for_sale" : "browse_the_register";
  let home = `/${doc}/${doc}.html`;

  params.delete("sale"); // not needed as destination knows!
  params.delete("oga_no");
  const qp = params.toString();
  if (qp.length > 0) {
    home = `${home}?${qp}`;
  }
  return home;
}

export function boatLink(state, oga_no) {
  let qp;
  if (state) {
    const { filters, page, boatsPerPage, sortField, sortDirection } = state;
    qp = `&p=${page}&bpp=${boatsPerPage}&sort=${sortField}&asc=${
      sortDirection === "asc"
    }`;
    for (const field of Object.keys(filters)) {
      if (field) {
        if (field === "year") {
          const f = filters.year.firstYear || "";
          const l = filters.year.lastYear || "";
          qp = `${qp}&y=${f}-${l}`;
        } else {
          qp = `${qp}&${field}=${filters[field]}`;
        }
      }
    }  
  } else {
    qp = '';
  }
  return `/browse_the_register/boat.html?oga_no=${oga_no}${qp}`;
}

export function getState(defaultState, search) {
  const state = { ...defaultState };
  if (search && search !== "") {
    const params = new URLSearchParams(search);
    for (const [key, value] of params) {
      switch (key) {
        case "p":
          state.page = parseInt(value, 10);
          break;
        case "bpp":
          state.boatsPerPage = value;
          break;
        case "sort":
          state.sortField = value;
          break;
        case "asc":
          state.sortDirection = value === "true" ? "asc" : "desc";
          break;
        case "y":
          const year = {};
          const [firstYear, lastYear] = value.split("-");
          if (firstYear !== "") {
            year.firstYear = firstYear;
          }
          if (lastYear !== "") {
            year.lastYear = lastYear;
          }
          state.filters.year = year;
          break;
        default:
          state.filters[key] = value;
      }
    }
  }
  return state;
}

const exports = { home, boatLink, getState };

export default exports;