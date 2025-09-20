import { f2m } from "./format";
// Constants
const baseLengthInFeetForTHCF = 25;

// Helper Functions
function rigAllowance(r) {
  r = r.toLowerCase();
  switch (r) {
    case 'cutter': return 0.96;
    case 'yawl': return 0.94;
    case 'schooner': return 0.92;
    case 'ketch': return 0.90;
    default: return 1.0;
  }
}

export function sails(r) {
  r = r.toLowerCase();
  if (['cutter', 'sloop'].includes(r)) {
    return ['fore_triangle', 'main', 'topsail'];
  } else if (r === 'yawl' || r === 'ketch') {
    return ['fore_triangle', 'main', 'topsail', 'mizzen', 'mizzen_topsail'];
  } else if (r === 'schooner') {
    return ['fore_triangle', 'main', 'topsail', 'fore_sail', 'fore_topsail', 'mizzen', 'mizzen_topsail'];
  } else if (['catboat', 'single sail'].includes(r)) {
    return ['main'];
  }
  return [];
}

export function sailArea(boat) {
  const s = sails(boat.rig_type || '');
  const sailAreas = {};
  const hd = boat.handicap_data || {};
  if (!hd.main) return hd.sailarea || 0;

  for (const sail of s) {
    sailAreas[sail] = 0;
    if (sail === 'fore_triangle') {
      sailAreas[sail] = fForeTriangle(hd);
    } else if (['main', 'fore_sail', 'mizzen'].includes(sail)) {
      sailAreas[sail] = fMainSA(hd[sail] || {});
    } else if (['topsail', 'fore_topsail', 'mizzen_topsail'].includes(sail)) {
      sailAreas[sail] = fTopSA(hd[sail] || {});
    }
  }

  const total = Object.values(sailAreas).reduce((a, b) => a + b, 0);
  return total || 0;
}

export function fMainSA(sail) {
  if (!sail) return 0;
  const b = sail.foot || 0;
  const h = sail.luff || 0;
  if (b == null || h == null) return 0;
  if (!('head' in sail)) return 0.5 * b * h;
  const g = parseFloat(sail.head);
  const d = Math.sqrt(b * b + h * h);
  return 0.5 * b * h + 0.5 * g * d;
}

export function fTopSA(sail) {
  if (sail) {
    const i = sail.perpendicular || 0;
    const h = sail.luff || 0;
    if (i != null && h != null) return 0.5 * i * h;
  }
  return 0;
}

export function fForeTriangle(data) {
  if (data) {
    const i = parseFloat(data.fore_triangle_height || 0);
    const j = parseFloat(data.fore_triangle_base || 0);
    return 0.425 * i * j;
  }
  return 0;
}

export function fL(data) {
  if (data?.length_on_deck && data?.length_on_waterline) {
    return 0.5 * (data.length_on_deck + data.length_on_waterline);
  }
  return 0;
}

export function fBD(boat) {
  const hd = boat?.handicap_data;
  if (hd?.beam) return 0.67 * hd.beam * hd.beam;
  return 0;
}

export function fSqrtS(rigAllowanceVal, sailarea) {
  return rigAllowanceVal * Math.sqrt(sailarea);
}

export function fMR(boat, useSailArea = false) {
  const hd = boat?.handicap_data;
  if (!boat.rig_type || !hd) return 0;
  const L = fL(hd);
  let sailAreaVal = sailArea(boat);
  if (sailAreaVal === 0 && useSailArea && hd.sailarea) sailAreaVal = hd.sailarea;
  if (sailAreaVal === 0) return 0;
  const sqrtS = fSqrtS(rigAllowance(boat.rig_type), sailAreaVal);
  if (sqrtS === 0 || L === 0) return 0;
  const BD = fBD(boat);
  if (BD > 0) {
    const x = 0.15 * L * sqrtS / Math.sqrt(BD);
    const y = 0.2 * (L + sqrtS);
    return x + y;
  }
  return 0;
}

export function fPropellorBonus(data) {
  const propType = data?.propellor?.type || '';
  if (propType === 'fixed') return 0.03;
  if (['folding', 'feathering'].includes(propType)) return 0.015;
  return 0;
}

export function fShoalBonus(R, boat) {
  const hd = boat?.handicap_data;
  if (!hd) return 0;
  const lwl = hd.length_on_waterline;
  const draft = boat.draft;
  const nominalDraft = 0.12 * lwl;
  let bonus = 0;
  if (draft < 0.8 * nominalDraft) bonus = 0.02 * R;
  if (draft < 0.66 * nominalDraft) bonus = 0.02 * R;
  if (['centre-boarder', 'centreboard dinghy', 'leeboarder'].includes(boat.hull_form)) bonus /= 2;
  return bonus;
}

export function fR(boat, useSailArea = false ) {
  if (!boat) return 0;
  const MR = fMR(boat, useSailArea);
  return MR - MR * fPropellorBonus(boat.handicap_data);
}

export function fThcf(boat, useSailArea = false) {
  const r = fR(boat, useSailArea);
  if (r <= 0) return 0;
  return 0.125 * (Math.sqrt(r) + 3);
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
    const thcf = fThcf(mmrf*(1 - boat.ddf.prop_allowance));
    const pf = Number(data.solent?.performance_factor || 0);
    const sr = (1 + pf) * thcf;
    return Math.round(1000 * sr) / 1000;
}