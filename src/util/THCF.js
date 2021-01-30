const rig_allowance = {
    cutter: 0.96,
    yawl: 0.94,
    schooner: 0.92,
    ketch: 0.90,
};

export function fGaffSA(sail) {
    if(sail) {
        const b = sail.foot;
        const h = sail.luff;
        const g = sail.head;
        const d = Math.sqrt(b*b+h*h);
        return 0.5*b*h+0.5*g*d;    
    }
}

export function fTopSA(sail) {
    if(sail) {
        const i = sail.perpendicular;
        const h = sail.luff;
        return 0.5*i*h;    
    }
}

export function fForeTriangle(handicap_data) {
    if(handicap_data) {
        const i = handicap_data.fore_triangle_height;
        const j = handicap_data.fore_triangle_base;
        return 0.5*i*j;    
    }
}

// The measured sail area is the sum of:-
// 0.5(b x h) + 0.5(g x d) for mainsail and mizzen, 
// where d = √(b^2+h^2 ), plus 0.5(i x h) for topsails, 
// plus O.425(i x j) for the foretriangle.
export function fMSA(handicap_data) {
    const sa = fGaffSA(handicap_data.main)
        + fGaffSA(handicap_data.mizen)
        + fTopSA(handicap_data.topsail)
        + fTopSA(handicap_data.mizen_topsail)
        + 0.85*fForeTriangle(handicap_data);
}

export function fL(handicap_data) {
    return 0.5*(handicap_data.length_overall+handicap_data.length_on_waterline);
}

export function fB(boat) {
    return boat.beam;
}

// N.B rig_allowance might be outside the sqrt.
export function fS(boat) {
    const SA = boat.handicap_data.sailarea || fMSA(boat.handicap_data);
    return SA*rig_allowance(boat.rig_type);
}

export function fD(handicap_data) {
    return 1.25*handicap_data.depth;
}

export function fMR(boat) {
    const L = fL(boat.handicap_data);
    const S = fS(boat);
    const B = fB(boat);
    const D = fD(boat.handicap_data);
    return 0.15*L*Math.sqrt(S)/Math.sqrt(B*D)+0.2*(L+Math.sqrt(S));
}

/* 
From the MR, bonuses, expressed as percentages are deducted.
R = MR - Bonus.
These bonuses are:- 
    for a fixed propeller – 3% ; 
    folding prop – 1½%; 
    built pre 1930 – 2½%; (removed)
    pre 1914 - 5%; pre 1900 – 7% ; (removed)
    draft less than 66% of 0.16 LWL - 4%; 
    less than 80% - 2%. 
    Shoal draft bonus halved if centreboard or leeboards fitted.
*/
export function fPropellerBonus(R, handicap_data) {
    switch(handicap_data.prop) {
        case 'fixed': return 0.03*R;
        case 'folding': return 0.015*R;
        default: return 0;
    }
}

export function fShoalBonus(R, boat) {
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

export function fR(boat) {
    const MR = fMR(boat);
    return MR
    - fPropellerBonus(R, handicap_data)
    - fShoalBonus(R, boat);
}

export function thcf(boat) {
    return 0.125*(Math.sqrt(fR(boat))+3);
}