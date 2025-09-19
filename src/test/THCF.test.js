import { foretriangle_area, mainsail_area } from '../components/Handicap';
import { fMainSA, fTopSA, fForeTriangle, sailArea, fL, fSqrtS, fR, fThcf } from '../util/THCF';

const agaff = {foot: 10, luff: 10, head: 5};
const atopsl = {perpendicular: 10, luff: 10};
const aft = {fore_triangle_height: 10, fore_triangle_base: 10};

// thcf 0.972
const aboat2 = {
  hull_type: '',
  rig_type: 'Cutter',
  draft: 4.92,
  handicap_data: {
    beam: 9.68,
    sailarea: undefined,
    fore_triangle_height: 30.58,
    fore_triangle_base: 19.26,
    length_on_deck: 27.87,
    length_on_waterline: 27.23,
    depth: 5,
    main: {
      luff: 17.22,
      head: 15.91,
      foot: 18.54,
    },
    topsail: {
      luff: 18.77,
      perpendicular: 7.05
    },
    propellor: { type: 'fixed' },
  }
};

/* 
<field name="boat_sail_area">324.327766252543</field>
<field name="boat_thcf">0.873</field>
*/
const aboat = {
  hull_type: '',
  rig_type: 'Cutter',
  draft: 2.75,
  handicap_data: {
    beam: 7,
    sailarea: undefined,
    fore_triangle_height: 19.5,
    fore_triangle_base: 9.3,
    length_on_deck: 21,
    length_on_waterline: 17,
    depth: 5,
    main: {
      luff: 9.75,
      head: 16.9,
      foot: 16.9,
    },
    propellor: { type: 'fixed' },
  }
};

test('thcf gaff empty', () => {
    expect(fMainSA()).toEqual(0);
  });

test('thcf gaff valid', () => {
  expect(fMainSA(agaff).toFixed(2)).toEqual("85.36");
});

test('thcf topsail empty', () => {
  expect(fTopSA()).toEqual(0);
});

test('thcf topsail valid', () => {
  expect(fTopSA(atopsl).toFixed(2)).toEqual("50.00");
});

test('thcf fore triangle empty', () => {
  expect(fForeTriangle()).toEqual(0);
});

test('thcf fore triangle valid', () => {
  expect(fForeTriangle(aft).toFixed(2)).toEqual("42.50");
});

test('thcf measured sail area valid', () => {
  expect(sailArea(aboat).toFixed(2)).toEqual('324.33');
});

test('thcf empty', () => {
  expect(fThcf()).toEqual(1);
});

test('thcf aboat', () => {
  expect(fL(aboat.handicap_data)).toBe((21+17)/2);
  const ddf = {
    root_s: fSqrtS(0.96, sailArea(aboat)),
  };
  expect(ddf.root_s.toFixed()).toEqual('17');
  expect(fThcf(aboat).toFixed(3)).toEqual('0.865');
});

test('thcf aboat2', () => {
  const { handicap_data } = aboat2;
  expect(fL(handicap_data)).toBe((27.87+27.23)/2);
  expect(fThcf(aboat2).toFixed(3)).toEqual("0.961");
});