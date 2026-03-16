
export function makePicker(filtered, key) {
  const l = new Set();
  filtered.forEach((boat) => {
    const v = boat[key];
    if (Array.isArray(v)) {
       v.forEach((i) => l.add(i));
    } else {
      l.add(v);
    }
  });
  const picker = [...l].filter((v) => v);
  picker.sort();
  return picker;
}

export function makePickers(filtered) {
  // console.log('PB', filtered);
  const pickers = {};
  [
    "designer",
    "builder",
    "rig_type",
    "mainsail_type",
    "generic_type",
    "design_class",
    "construction_material",
    "place_built",
    "home_port",
  ].forEach((key) => {
    pickers[key] = makePicker(filtered, key);
  });
  const names = makePicker(filtered, 'name');
  const prev = makePicker(filtered, 'previous_names');
  pickers.name = [...new Set([...names, ...prev])];
  pickers.name.sort();
  const years = filtered.map((boat) => boat.year).filter((y) => y);
  years.sort();
  pickers.year = {
    step: 10,
    min: years[0] || 1800,
    max: years[years.length - 1] || new Date().getFullYear(),
  };
  // console.log('P', pickers);
  return pickers;
}

export function findFirstAbsent(boat) {
    if (!boat) {
        return -1;
    }
    if (boat.length === 0) {
        return 1;
    }
    const ogaNos = boat.map((boat) => Number(boat.oga_no)).sort((a, b) => a - b);
    const idx = ogaNos.findIndex((val, index, vals) => val + 1 !== vals[index + 1]);
    if (idx === -1) {
        return ogaNos[ogaNos.length - 1] + 1;
    }
    return ogaNos[idx] + 1;
}

function andfilter(boats, k, filters) {
    let filteredBoats = [...boats];
    k.forEach(filter => {
        let wanted = filters[filter];
        if (['oga_no', 'firstYear, lastYear'].includes(filter)) {
            wanted = parseInt(wanted);
        }
        filteredBoats = filteredBoats.filter((boat) => {
            if (filter === 'name') {
                if (boat.previous_names?.includes(wanted)) return true;
                return wanted === boat.name;
            }
            const val = boat[(filter==='oga_nos'?'oga_no':filter)];
            if (Array.isArray(val)) {
                return val.includes(wanted);
            }
            if (Array.isArray(wanted)) {
                return wanted.includes(val);
            }
            if (filter === 'firstYear') {
                return wanted <= boat.year;
            }
            if (filter === 'lastYear') {
                return wanted >= boat.year;
            }
            return wanted === val;
        });
    });
    return filteredBoats;
}

export function applyFilters(boats, filters) {
    const all = Object.keys(filters || {});
    const k = all.filter((v) => v !== 'sail');
    let filteredBoats = [...boats];
    if (all.includes('sail')) {
       filteredBoats = boats.filter((b) => filters.sail.some(k => { return b[k]}));
    }
    if (k.length === 0) {
        return filteredBoats;
    }
    return andfilter(filteredBoats, k, filters);
}

export function sortAndPaginate(boats, state) {
    const b = [...boats].sort((a,b) => {
        const { sort, sortDirection } = state;
        const rs = sortDirection === 'asc' ? [1, -1] : [-1, 1];
        const as = a[sort];
        const bs = b[sort];
        if(as > bs) return rs[0];
        if(as < bs) return rs[1];
        return 0;
    });
    const { page, bpp } = state;
    const start = bpp * ( page - 1);
    return b.slice(start, start + bpp);
}
