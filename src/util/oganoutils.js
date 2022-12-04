import { useGetFilterable } from '../components/boatregisterposts';

export function findFirstAbsent(boat) {
    if (!boat) {
        return -1;
    }
    const ogaNos = boat.map((boat) => Number(boat.oga_no)).sort((a, b) => a - b);
    const idx = ogaNos.findIndex((val, index, vals) => val + 1 !== vals[index + 1]);
    return ogaNos[idx] + 1;
}

export function applyFilters(boats, filters) {
    const k = Object.keys(filters || {});
    let filteredBoats = [...boats];
    k.forEach(filter => {
        let wanted = filters[filter];
        if (['oga_no', 'firstYear, lastYear'].includes(filter)) {
            wanted = parseInt(wanted);
        }
        filteredBoats = filteredBoats.filter((boat) => {
            const val = boat[(filter==='oga_nos'?'oga_no':filter)];
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

export const useCardQuery = (state) => {
    const { data, error, loading } = useGetFilterable();

    if (loading) return { loading };
    if (!data) return { loading: true };
    if (error)  return { error };

    const filteredBoats = applyFilters(data, state.filters);
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
    return { data: {
        boats: bp,
        totalCount: filteredBoats.length,
    }};
}
