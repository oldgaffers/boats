import { f2m } from "./format";

export const baseLengthInFeetForTHCF = 25;

export const rig_allowance = (r) => {
    switch(r.toLowerCase()) {
        case 'cutter': return 0.96;
        case 'yawl': return 0.94;
        case 'schooner': return 0.92;
        case 'ketch': return 0.90;
        default: return 1.0;
    };
};

// The measured sail area for gaff sails is:
// 0.5(b x h) + 0.5(g x d) for mainsail and mizzen  where d = √(b^2+h^2 ), 
export function fGaffSA(sail) {
    if(sail) {
        const b = Number(sail.foot);
        const h = Number(sail.luff);
        const g = Number(sail.head);
        const d = Math.sqrt(b*b+h*h);
        return 0.5*b*h + 0.5*g*d;    
    }
    return 0;
}

// The measured sail area for topsails is 0.5(i x h)
export function fTopSA(sail) {
    if(sail) {
        const i = Number(sail.perpendicular);
        const h = Number(sail.luff);
        return 0.5*i*h;    
    }
    return 0;
}

// the foretriangle is O.425(i x j).
export function fForeTriangle(data) {
    if(data) {
        const i = Number(data.fore_triangle_height);
        const j = Number(data.fore_triangle_base);
        return 0.425*i*j;    
    }
    return 0;
}

export function fL(data) {
    if(data && data.length_on_deck && data.length_on_waterline ) {
        return 0.5*(data.length_on_deck+data.length_on_waterline);
    }
    return 0;
}

export function fBD(boat) {
    // John Scarlett
    // return fB(boat)*fD(boat.handicap_data);
    // old online register
    return 0.67*boat.handicap_data.beam*boat.handicap_data.beam;
}

export function fMSA(sail_area) {
    const vals = Object.keys(sail_area).map((k) => sail_area[k]);
    return vals.reduce((p, v) => p + v, 0);
}

export function fSqrtS(data) {
    return data.rig_allowance * Math.sqrt(data.total_sail_area)
}

export function fMR(boat) {
    const { ddf, handicap_data } = boat;
    if(handicap_data) {
        const L = fL(handicap_data);
        const sqrtS = ddf.root_s || 0.0;
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
    for a fixed propellor – 3% ; 
    folding prop – 1½%; 
    built pre 1930 – 2½%; (removed)
        pre 1914 - 5%; (removed)
        pre 1900 – 7% ; (removed)
    draft less than 66% of 0.16 LWL - 4%; 
    less than 80% - 2%. 
    Shoal draft bonus halved if centreboard or leeboards fitted.
*/
export function fPropellorBonus(R, data) {
    if(data) {
        switch(data.propellor.type) {
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
        - fPropellorBonus(MR, boat.handicap_data)
        ;//- fShoalBonus(MR, boat);    
    }
    return 0;
}

export function fThcf(r = baseLengthInFeetForTHCF) {
    return 0.125*(Math.sqrt(r)+3);
}

const shapeFactorMap = {
    'Long keel - High volume': 0.25,
    'Long keel - Standard': 0.20,
    'Long keel - Low volume': 0.15,
    'Fin keel': 0.10,
  };

export function shapeFactors(sf) {
    return shapeFactorMap?.[sf] || 0.2;
}

export function solentLength(data) {
    const LOD = data.length_on_deck || baseLengthInFeetForTHCF;
    const LWL = data.length_on_waterline || baseLengthInFeetForTHCF;
    return f2m(0.5*(LOD+LWL));
}

// normalised to kg using 1000 kg per cubic metre for salt water
export function solentEstimatedDisplacement(data) {
    const L = solentLength(data);
    const B = f2m(data.beam);
    const D = f2m(data.draft);
    const SF = shapeFactors(data.solent.hull_shape);
    return Math.round(1000 * L * B * D * SF);
}
  
/*
Proposed rating formula (metres):
Measured Rating = MR = 0.2*(L*√S)/√(B*D*SF) + 0.67*(L+√S)
OR if displacement is known:
Measured Rating = MR = 0.2*(L*√S)/√(Disp/L) + 0.67*(L+√S)
Where:
L = (LWL+LOD)/2
S = Corrected sail area (includes rig allowance)
B = Beam (Should be water line, but in most cases the difference is insignificant)
D = Draft
SF = Shape Factor above
Disp = Displacement

*/

export function solentMR(boat) {
    const { ddf, handicap_data } = boat;
    const L = solentLength(handicap_data);
    const rS = f2m(ddf.root_s || 0.0);
    const y = 0.67 * (L + rS);
    if (handicap_data.displacement) {
        const enteredDisplacement = handicap_data.displacement / 1000; // in cubic metres
        const x = 0.2 * L * rS / Math.sqrt(enteredDisplacement / L);
        return x + y;    
    } else {
        // const estimatedDisplacement = solentEstimatedDisplacement(data) / 1000; // in cubic metres
        // const x2 = 0.2 * L * rS / Math.sqrt(estimatedDisplacement / L);
        const B = f2m(handicap_data.beam);
        const D = f2m(handicap_data.draft);
        const SF = shapeFactors(handicap_data.solent.hull_shape);   
        const x = 0.2 * L * rS / Math.sqrt(B*D*SF);
        return x + y;            
    }
}

export function solentRating(boat) {
    const data = boat.handicap_data;
    const mmrf = data.solent.measured_rating;
    const thcf = fThcf(mmrf);
    const pf = Number(data.solent.performance_factor);
    const sr = (1 + pf) * thcf;
    return Math.round(1000 * sr) / 1000;
}