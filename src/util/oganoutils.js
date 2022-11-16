import { useAxios } from 'use-axios-client';
import { boatRegisterHome } from './constants';
import axios from 'axios';

export function findFirstAbsent(boat) {
    if (!boat) {
        return -1;
    }
    const ogaNos = boat.map((boat) => Number(boat.oga_no)).sort((a, b) => a - b);
    const idx = ogaNos.findIndex((val, index, vals) => val + 1 !== vals[index + 1]);
    return ogaNos[idx] + 1;
}

export async function getFilterable() {
    return axios(`${boatRegisterHome}/boatregister/filterable.json`);
}

export function getTotal(data) {
}

export function getBoats(data) {
}

export function useFilterable() {
    return useAxios(`${boatRegisterHome}/boatregister/filterable.json`);
}

export const useCardQuery = (state) => {
    const { data, error, loading } = useFilterable();

    if (loading) return { loading };
    if (!data) return { loading: true };
    if (error)  return { error };

    const boats = data;
    const k = Object.keys(state.filters);
    let filteredBoats = [...boats];
    k.forEach(filter => {
        let wanted = state.filters[filter];
        if (filter === 'oga_no') {
            wanted = parseInt(wanted);
        }
        filteredBoats = filteredBoats.filter((boat) => {
            const val = boat[(filter==='oga_nos'?'oga_no':filter)];
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
    return { data: {
        boats: bp,
        totalCount: filteredBoats.length,
    }};
}
