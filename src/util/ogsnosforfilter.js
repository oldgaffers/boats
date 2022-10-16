import useAxios from 'axios-hooks';

export function getTotal(data) {
}

export function getBoats(data) {
}

export const useCardQuery = (state) => {
    const [b] = useAxios('https://ogauk.github.io/boatregister/filterable.json')
    if (b.loading) return b;
    if (b.error) {
          return b;
    }
    const boats = b.data;
    const k = Object.keys(state.filters);
    let filteredBoats = [...boats];
    k.forEach(filter => {
        filteredBoats = filteredBoats.filter((boat) => {
            const val = boat[(filter==='oga_nos'?'oga_no':filter)];
            const wanted = state.filters[filter];
            if (Array.isArray(wanted)) {
                return wanted.includes(val);
            }
            return wanted === val;
        });
    });
    filteredBoats.sort((a,b) => {
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
    const bp = filteredBoats.slice(start, start + bpp);
    return { ...b, data: {
        boats: bp,
        totalCount: filteredBoats.length,
    }};
}
