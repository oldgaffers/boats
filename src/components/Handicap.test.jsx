import { foretriangle_area, mainsail_area } from './Handicap';
import { fMainSA, fTopSA, fForeTriangle, sailArea, fL, fMR, fBD, fSqrtS, fR, fThcf } from '../util/THCF';
import { boatm2f, boatf2m } from "../util/format";

const Transcur = {
  "builder": {
    "id": "78bc9e97-d57d-481e-b855-b10261a92e4d",
    "name": "Aldous Ltd."
  },
  "construction_details": "Trad ",
  "construction_material": "wood",
  "construction_method": "carvel",
  "created_at": "2020-04-25T17:32:47.429243+00:00",
  "designer": {
    "id": "74db1b7f-49fa-49d4-8e3f-9f172cd58673",
    "name": "Aldous"
  },
  "for_sales": [],
  "full_description": 'x',
  "generic_type": ["Smack"],
  "handicap_data": {
    "beam": 3.28,
    "draft": 1.396,
    "fore_triangle_base": 7.315,
    "fore_triangle_height": 10,
    "length_on_deck": 10.796,
    "length_on_waterline": 8.687,
    "length_over_all": 10.79,
    "main": {
      "foot": 7,
      "head": 5,
      "luff": 5.486
    },
    "propellor": {
      "type": "folding"
    },
    "sailarea": 81,
    "thcf": 1.025,
    "topsail": {
      "luff": 6.706,
      "perpendicular": 2.438
    }
  },
  "home_country": "GBR",
  "home_port": "Pin Mill",
  "hull_form": "long keel deep forefoot",
  "id": "656e0e94-c298-408e-90e2-1bafd5bdd824",
  "image_key": "grRdbV",
  "mainsail_type": "gaff",
  "name": "Transcur",
  "oga_no": 2932,
  "ownerships": [
    {
      "name": "Frank Mulville"
    },
    {
      "name": "Peter Maynard"
    },
    {
      "name": "Rober Bettle"
    },
    {
      "current": true,
      "id": 38,
      "member": 954,
      "share": 64,
      "start": 1998
    }
  ],
  "place_built": "Brightlingsea",
  "rig_type": "Cutter",
  "sail_number": "CK365",
  "selling_status": "not_for_sale",
  "short_description": 'x',
  "spar_material": "wood",
  "updated_at": "2022-10-30T06:56:03.964565+00:00",
  "year": 1889,
  "year_is_approximate": false
};

const Robinetta = {
  "builder": {
    "id": "a27bca50-d155-428a-be49-a542d64ba316",
    "name": "Enterprise Small Craft"
  },
  "callsign": "MKDZ8",
  "construction_details": "pitch pine on oak and elm",
  "construction_material": "wood",
  "construction_method": "carvel",
  "created_at": "2020-04-25T16:47:00.543376+00:00",
  "designer": {
    "id": "afc68d59-e7ba-466e-861f-741e2eeae526",
    "name": "D.A. Rayner"
  },
  "for_sales": [],
  "full_description": 'x',
  "generic_type": ["Yacht"],
  "handicap_data": {
    "beam": 2.441,
    "draft": 1.372,
    "fore_triangle_base": 1.524,
    "fore_triangle_height": 4.572,
    "length_on_deck": 6.858,
    "length_on_waterline": 6.096,
    "length_over_all": 6.858,
    "main": {
      "foot": 4,
      "head": 4.267,
      "luff": 4.319
    },
    "propellor": {
      "type": "fixed"
    },
    "sailarea": 24.156,
    "thcf": 0.85
  },
  "home_country": "GBR",
  "home_port": "Rosneath",
  "hull_form": "long keel deep forefoot",
  "id": "85315666-4359-47f7-8d8d-4dd2905b7aa2",
  "image_key": "9NV8KW",
  "mainsail_type": "gaff",
  "mmsi": "235109366",
  "name": "Robinetta",
  "nsbr": "1717",
  "oga_no": 315,
  "ownerships": [
    {
      "end": 1946,
      "name": "Denys Rayner",
      "share": 64,
      "start": 1937
    },
    {
      "end": 1949,
      "name": "Audrey Parker",
      "share": 32,
      "start": 1946
    },
    {
      "end": 1949,
      "name": "Henry Parker",
      "share": 32,
      "start": 1946
    },
    {
      "end": 1985,
      "name": "Nigel Heriot",
      "share": 64,
      "start": 1949
    },
    {
      "end": 1986,
      "name": "Frank Driscoll",
      "share": 64,
      "start": 1985
    },
    {
      "end": 2007,
      "name": "Mike Garnham",
      "share": 64,
      "start": 1986
    },
    {
      "current": true,
      "id": 559,
      "member": 5004,
      "share": 32,
      "start": 2007
    },
    {
      "current": true,
      "id": 1219,
      "member": 5004,
      "share": 32,
      "start": 2007
    }
  ],
  "place_built": "Rock Ferry, Birkenhead",
  "reference": [
    "YM May 1937",
    "YM Nov 1937",
    "YM Nov 1947",
    "YM Nov 2022"
  ],
  "rig_type": "Cutter",
  "sail_number": "315",
  "selling_status": "not_for_sale",
  "short_description": 'x',
  "spar_material": "wood",
  "ssr": "131134",
  "uk_part1": "165315",
  "updated_at": "2022-10-30T08:21:32.430046+00:00",
  "website": "https://robinetta-log.blogspot.com/p/robinetta.html",
  "year": 1937,
  "year_is_approximate": false
};

const tcf = boatm2f(Transcur).handicap_data;
const rcf = boatm2f(Robinetta).handicap_data;

test('boatm2f', () => {
  const a = { "1": 1, q: { a: 2 } };
  expect(boatm2f(a)).toStrictEqual(a);
});

test('boatm2f Transcur feet', () => {
  expect(tcf).toMatchSnapshot();
});

test('boatm2f Robinetta feet', () => {
  expect(rcf).toMatchSnapshot();
});

test('boatm2f Transcur metres', () => {
  expect(boatf2m(boatm2f(Transcur))).toStrictEqual(Transcur);
});

test('boatm2f Robinetta metres', () => {
  expect(boatf2m(boatm2f(Robinetta))).toStrictEqual(Robinetta);
});

test('Transcur foretriangle_area', () => {
  const f = foretriangle_area(tcf);
  expect(f.toFixed(1)).toMatchSnapshot();
});

test('Robinetta foretriangle_area', () => {
  const f = foretriangle_area(rcf);
  expect(f).toMatchSnapshot();
});

test('Transcur fMainSA', () => {
  expect(fMainSA(tcf.main).toFixed(2)).toMatchSnapshot();
});
test('Transcur fTopSA', () => {
  expect(fTopSA(tcf.topsail).toFixed()).toMatchSnapshot();
});

test('Transcur fForeTriangle', () => {
  expect(fForeTriangle(tcf).toFixed(2)).toMatchSnapshot();
});

test('Transcur fMSA', () => {
  expect(sailArea(Transcur).toFixed(1)).toMatchSnapshot();
});

test('Transcur fL', () => {
  expect(fL(tcf)).toEqual((tcf.length_on_waterline + tcf.length_on_deck) / 2);
});

test('Transcur fBD', () => {
  const b = boatm2f(Transcur);
  expect(fBD(b)).toMatchSnapshot();
});

test('Transcur fMR', () => {
  const b = boatm2f(Transcur);
  expect(fMR(b).toFixed(2)).toMatchSnapshot();
});

test('Transcur T(H)CF', () => {
  const b = boatm2f(Transcur);
  expect(fThcf(b).toFixed(3)).toMatchSnapshot();
});

test('Robinetta T(H)CF', () => {
  const b = boatm2f(Robinetta);
  expect(fThcf(b).toFixed(3)).toMatchSnapshot();
});
