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
    let boats = b.data;
    const k = Object.keys(state.filters);
    k.forEach(filter => {
        console.log('next', boats);
        console.log(filter);
        const r = boats.filter((boat) => boat[filter] === state.filters[k]);
        console.log('found', r);
        boats = r;
    });
    console.log('filtered', boats);
    console.log('sort', state.sort, state.sortDirection);
    console.log('page', state.bpp, state.page);
    return { ...b, data: boats };
}
