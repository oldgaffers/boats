const JC = '~'; // the join character to use, '.' doesn't work!

function flatten1(o, prefix) {
    return Object.keys(o).map(key => {
        const k2 = prefix?`${prefix}${JC}${key}`:key;
        if(typeof o[key] === 'object') {
            if(o[key] === null) {
                return {[k2]: o[key]}
            } else if(Array.isArray(o[key])) {
                return {[k2]: o[key]}
            } else {
                return flatten1(o[key], k2);
            }
        }
        return {[k2]: o[key]}
    }).flat()
}

export function flatten(boat) {
    return flatten1(boat).flat().reduce((a,c)=>{return {...a,...c}});
}

export function unflatten(o) {
    const outers = new Set();
    Object.keys(o).forEach(key => {
        if(key.includes(JC)) {
            const f = key.split(JC);
            outers.add(f[0]);
        } else {
            outers.add(key);
        }
    });
    const r = {};
    outers.forEach(outer => {
        if(o[outer]) {
            r[outer] = o[outer];
        } else {
            const c = {};
            const t = {};
            Object.keys(o).forEach(key => {
                if(key.startsWith(outer)) {
                    const f = key.split(JC);
                    f.shift();
                    if(f.length == 1) {
                        c[f[0]] = o[key];
                    } else {
                        t[f.join(JC)] = o[key];
                    }
                }
            });
            r[outer] = {...c, ...unflatten(t)};
        }
    });
    return r;
}

export function drop_ddf(values) {
    return Object.keys(values).filter((k) => !k.startsWith('ddf_')).reduce((a,c)=>{return {...a,...c}});;
}

   
