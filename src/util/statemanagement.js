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

export function setView(view) {
    console.log('storing current view', view);
    sessionStorage.setItem('BOAT_CURRENT_VIEW', view);
}

export function saveState(state, view='app') {
    console.log('storing state for view', view);
    sessionStorage.setItem(key(view), JSON.stringify(state));
    sessionStorage.removeItem('BOAT_BROWSE_STATE'); // TODO remove eventually
}

export function getState(view) {
    const wantedView = view || sessionStorage.getItem('BOAT_CURRENT_VIEW') || 'app';
    console.log(`statemanagement getState view ${view} wantedView ${wantedView}`)
    const ss = sessionStorage.getItem(key(wantedView))
    if (ss) {
        console.log(`statemanagement getState got ${ss}`)
        return JSON.parse(ss);
    }
    const r = DEFAULT_BROWSE_STATE[wantedView]; // new session
    saveState(r, wantedView);
    return r;
}