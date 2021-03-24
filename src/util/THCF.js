const rig_allowance = (r) => {
    switch(r) {
        case 'cutter': return 0.96;
        case 'yawl': return 0.94;
        case 'schooner': return 0.92;
        case 'ketch': return 0.90;
        default: return 1.0;
    };
};

export function fGaffSA(sail) {
    if(sail) {
        const b = Number(sail.foot);
        const h = Number(sail.luff);
        const g = Number(sail.head);
        const d = Math.sqrt(b*b+h*h);
        return 0.5*b*h+0.5*g*d;    
    }
    return 0;
}

export function fTopSA(sail) {
    if(sail) {
        const i = Number(sail.perpendicular);
        const h = Number(sail.luff);
        return 0.5*i*h;    
    }
    return 0;
}

export function fForeTriangle(data) {
    if(data) {
        const i = Number(data.fore_triangle_height);
        const j = Number(data.fore_triangle_base);
        return 0.5*i*j;    
    }
    return 0;
}

// The measured sail area is the sum of:-
// 0.5(b x h) + 0.5(g x d) for mainsail and mizzen, 
// where d = √(b^2+h^2 ), plus 0.5(i x h) for topsails, 
// plus O.425(i x j) for the foretriangle.
export function fMSA(data) {
    if(data) {
        const sa = 0
        + fGaffSA(data.main)
        + fGaffSA(data.mizen)
        + fTopSA(data.topsail)
        + fTopSA(data.mizen_topsail)
        + 0.85*fForeTriangle(data);
        return sa;
    }
    return 0;
}

export function fL(data) {
    if(data && data.length_over_all && data.length_on_waterline ) {
        return 0.5*(data.length_over_all+data.length_on_waterline);
    }
    return 0;
}

export function fB(boat) {
    if(boat) {
        return boat.beam;
    }
    return 0;
}

export function fSqrtS(boat) {
    if(boat && boat.handicap_data) {
        const SA = boat.handicap_data.sailarea || fMSA(boat.handicap_data);
        return rig_allowance(boat.rig_type.toLowerCase())*Math.sqrt(SA);
    }
    return 0;
}

/*
export function fD(data) {
    if(data && data.depth) {
        return 1.25*data.depth;
    }
    return 0;
}
*/

export function fBD(boat) {
    // John Scarlett
    // return fB(boat)*fD(boat.handicap_data);
    // old online register
    return 0.67*boat.beam*boat.beam;
}

export function fMR(boat) {
    if(boat) {
        const L = fL(boat.handicap_data);
        const sqrtS = fSqrtS(boat);
        const BD = fBD(boat);
        if ( BD>0) {   
            const x = 0.15*L*sqrtS/Math.sqrt(BD);
            const y = 0.2*(L+sqrtS);    
            return x + y;
        }
    }
    return 0;
}

/* 
From the MR, bonuses, expressed as percentages are deducted.
R = MR - Bonus.
These bonuses are:- 
    for a fixed propeller – 3% ; 
    folding prop – 1½%; 
    built pre 1930 – 2½%; (removed)
        pre 1914 - 5%; (removed)
        pre 1900 – 7% ; (removed)
    draft less than 66% of 0.16 LWL - 4%; 
    less than 80% - 2%. 
    Shoal draft bonus halved if centreboard or leeboards fitted.
*/
export function fPropellerBonus(R, data) {
    if(data) {
        switch(data.prop) {
            case 'fixed': return 0.03*R;
            case 'folding': return 0.015*R;
            default: return 0;
        }    
    }
    return 0;
}

export function fShoalBonus(R, boat) {
    if(boat && boat.handicap_data) {
        const lwl = boat.handicap_data.length_on_waterline;
        const draft = boat.draft;
        const nominal_draft = 0.16 * lwl - 0.04 * lwl;
        let bonus = 0;
        if(draft < 0.8*nominal_draft) bonus = 0.02*R;
        if(draft < 0.66*nominal_draft) bonus = 0.02*R;
        if(['centre-boarder', 'centreboard dinghy', 'leeboarder'].includes(boat.hull_form)){
            bonus = bonus / 2;
        }
        return bonus;    
    }
    return 0;
}

export function fR(boat) {
    if(boat) {
        const MR = fMR(boat);
        return MR
        - fPropellerBonus(MR, boat.handicap_data)
        ;//- fShoalBonus(MR, boat);    
    }
    return 0;
}

export function thcf(boat) {
    if(boat) {
        return 0.125*(Math.sqrt(fR(boat))+3);
    }
    return 0;    
}