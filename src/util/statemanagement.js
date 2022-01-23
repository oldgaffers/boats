const DEFAULT_BROWSE_STATE = {
    app: {
        bpp: 12, 
        page: 1, 
        sort: 'rank', 
        sortDirection: 'asc', 
        filters: {},
        view: 'app',    
    },
    sell: {
        bpp: 12, 
        page: 1, 
        sort: 'price', 
        sortDirection: 'desc', 
        filters: { sale: true },
        view: 'sell',    
    },
    small: {
        bpp: 12, 
        page: 1, 
        sort: 'rank', 
        sortDirection: 'asc',
        filters: { generic_type:  ['Dinghy', 'Dayboat'] },
        view: 'app',    
    }
};

const key = (view) => `${view.toUpperCase()}_BROWSE_STATE`;

export function saveState(state, view='app') {
    console.log('storing state for view', view);
    sessionStorage.setItem(key(view), JSON.stringify(state));
}

export function getState(view='app') {
    const ss = sessionStorage.getItem(key(view))
    if (ss) {
        return JSON.parse(ss);
    }
    const r = DEFAULT_BROWSE_STATE[view]; // new session
    saveState(r, view);
    return r;
}
