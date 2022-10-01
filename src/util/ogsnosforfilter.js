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
        filteredBoats = filteredBoats.filter((boat) => boat[filter] === state.filters[filter]);
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
    return { ...b, data: {
        boats: filteredBoats.slice(start, start + bpp),
        totalCount: boats.length,
    }};
}
