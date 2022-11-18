import { foretriangle_area } from './Handicap';
import { thcf, fGaffSA, fTopSA, fForeTriangle, fMSA, fL, fMR, fBD, fSqrtS, fR } from '../util/THCF';
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
  "full_description": "<p>Transcur CK 365 was built in 1889, it seems to replace a larger 17 ton smack of the same name that was registered out of Maldon as MN11 in 1871. It was in 1898 that the Maldon &#39;Transcur&#39; did not appear in the register and &#39;Transcur CK 365&#39; was first registered.</p>\r\n\r\n<p>Her early history is rather vague and the only thing we know is that she worked from the Essex River Crouch and was owned by the Smith Brothers, well known oyster merchants of the area. In 1924 she came out of the register and was sold for conversion to a yacht. Coamings and skylights were added. In 1937 her first engine was fitted on the starboard quarter. She passed through several hands, each owner keeping her for approximatly five years. Most of this time was spent on the east coast of England.</p>\r\n\r\n<p>In 1998 the Thomas family bought Transcur from Lymington on the Solent where she had been for 19 years. Not in a sound enough condition to be sailed back to the east coast, she came back overland to the front garden where the family spent the next two years restoring her, keeping the floors but the rest of the boat was so rotten it needed replacing. She was returned to her original gaff rig which she lost in the late 50s. Since her restoration she has been sailed regularly to Holland each year for family holidays.</p>\r\n\r\n<p>Unlike many smacks, she is sailed by a family and cruised extensivly.</p>",
  "generic_type": "Smack",
  "handicap_data": {
    "beam": 3.279648,
    "draft": 1.396,
    "fore_triangle_base": 7.315288953913679,
    "fore_triangle_height": 10.05852231163131,
    "length_on_deck": 10.796,
    "length_on_waterline": 8.686905632772493,
    "length_over_all": 10.790051207022676,
    "main": {
      "foot": 7.010485247500609,
      "head": 5.029261155815655,
      "luff": 5.4864667154352595
    },
    "propellor": {
      "type": "folding"
    },
    "sailarea": 81.0645980727051,
    "thcf": 1.025,
    "topsail": {
      "luff": 6.705681541087539,
      "perpendicular": 2.43842965130456
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
  "short_description": "<p>'Transcur' was built in 1889 as an oyster dredger working on the east coast of England. She is just over 35ft long weighing 12 tons. 'Transcur' was totally rebuilt between 1999 and 2001, when she was relaunched.</p>",
  "spar_material": "wood",
  "thumb": "https://photos.smugmug.com/photos/i-kmtkTqf/0/Th/i-kmtkTqf-Th.jpg",
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
  "fishing_number": "",
  "for_sales": [],
  "full_description": "<p>\"When his last boat, the 42' Tredwin barge <em>Pearl</em>, was burnt out on moorings,\nMr. Denys Rayner decided to try his hand at designing a boat, after studying\nthe \"How To\" articles in the Y.M. Economy limited the size to less than 23' overall,\nwhile a plea from the Shipmate was more or less an order for 6ft headroom.\"</p>\n<p>The preceding extract from the February 1937 issue of Yachting Monthly was penned by Maurice Griffith.</p>\n<p><em>Robinetta</em> was designed from the outset for single handing, with all lines except the\njib halyard let to the cockpit. She was strongly built with pine planking on an oak and elm\nframe with an iron keel and a good deal of lead ballast. Her main cabin is cavernous\nfor such a tiny boat. Part of this stems from the extension of the hull upwards\nto form the cabin sides. Griffith goes on to say, \"Perhaps the most striking feature\nof this experimental design is the fullness of the hull, the pronounced tumblehome\nof the topsides from amidships aft, and the enormous quarters, which appear to be\nbased on those of the French crabbers.\"</p>\n<p>Robinetta is mostly original, but her iron keel was replaced by lead in the 1950 or 60s\nwhen small changes were also made to her foredeck, both to the designs of Alan Buchanan.</p>\n<p>Significant changes were made by Mike Garnham who replaced the previous engine\nwith a Yanmar 1GM10 and re-worked the cockpit. Major structural repairs were performed during\nthe winter of 2007/2008 strengthening the keel fixings and doubling several ribs.</p>\n<p>In 2012, she was re-caulked by Paul Drake of Tollesbury and given a new sail plan by\nMark Butler of James Lawrence. This necessitated a new gaff, made by owner using a\nbirdsmouth construction and the one fitted is the prototype, which by 2022 had done 10 seasons.</p>\n<p>Previous sail dimensions: Mainsail Head: 9.17 ft Topsail Perpendicular: 6ft Topsail luff 13 ft</p>\n<p>Deck beam replaced and other repairs winter 2017/18. New Yanmar 1GM10 2022.</p>\n<p>Read articles about Robinetta from the Royal Cruising Club Journal, 1938, on <a href=\"http://www.sailing-by.org.uk/content/standing-waves-and-submarines\">Sailing\nby</a>\nand explore her <a href=\"https://robinetta-log.blogspot.co.uk/\">blog</a>\nwith a detailed history of ownership and other exploits.</p>",
  "generic_type": "Yacht",
  "handicap_data": {
    "beam": 2.441,
    "draft": 1.3716,
    "fore_triangle_base": 1.5240185320653499,
    "fore_triangle_height": 4.57205559619605,
    "length_on_deck": 6.858,
    "length_on_waterline": 6.096,
    "length_over_all": 6.858083394294074,
    "main": {
      "foot": 4,
      "head": 4.26725188978298,
      "luff": 4.319068519873201
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
  "mssi": "235109366",
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
  "short_description": "<p><em>Robinetta</em> is a 22' 6\" tabloid cruiser, designed by Denys\nRayner and built for him by the Enterprise Small Craft Company, Rock Ferry, Birkenhead.</p>",
  "spar_material": "wood",
  "ssr": "131134",
  "thumb": "https://photos.smugmug.com/photos/i-F8N5HJk/2/Th/i-F8N5HJk-Th.jpg",
  "uk_part1": "165315",
  "updated_at": "2022-10-30T08:21:32.430046+00:00",
  "website": "https://robinetta-log.blogspot.com/p/robinetta.html",
  "year": 1937,
  "year_is_approximate": false
};

test('boatm2f', () => {
  const a = { "1": 1, q: { a: 2 } };
  expect(boatm2f(a)).toStrictEqual(a);
});

const tcf = {
  "beam": 10.761,
  "draft": 4.6,
  "fore_triangle_base": 23.999,
  "fore_triangle_height": 33.002,
  "length_on_waterline": 28.5,
  "length_on_deck": 35.4,
  "propellor": { "type": "folding" },
  "main": {
    "foot": 22.998,
    "head": 16.499,
    "luff": 17.998,
  },
  "sailarea": 821.998,
  "thcf": 1.025,
  "topsail": {
    "luff": 22,
    "perpendicular": 8,
  },
};

const rcf = {
  "beam": 8,
  "draft": 4.501,
  "fore_triangle_base": 5,
  "fore_triangle_height": 15,
  "length_on_waterline": 20,
  "length_on_deck": 22.5,
  "propellor": { "type": "fixed" },
  "main": {
    "foot": 13.12,
    "head": 13.999,
    "luff": 14.17,
  },
};

test('boatm2f Transcur feet', () => {
  expect(boatm2f(Transcur.handicap_data)).toStrictEqual(tcf);
});

test('boatm2f Robinetta feet', () => {
  const m = Robinetta.handicap_data;
  const f = boatm2f(m);
  expect(f).toStrictEqual(rcf);
});

test('boatm2f Transcur metres', () => {
  const t = boatm2f(Transcur);
  expect(boatf2m(t)).toStrictEqual(Transcur);
});

test('boatm2f Robinetta metres', () => {
  expect(boatf2m(boatm2f(Robinetta))).toStrictEqual(Robinetta);
});

test('Transcur foretriangle_area', () => {
  const f = foretriangle_area(tcf);
  expect(f.toFixed(1)).toEqual('336.6');
});

test('Robinetta foretriangle_area', () => {
  const f = foretriangle_area(rcf);
  expect(f).toEqual(31.875);
});

test('Transcur fGaffSA', () => {
  expect(fGaffSA(tcf.main).toFixed(2)).toEqual('447.87');
});
test('Transcur fTopSA', () => {
  expect(fTopSA(tcf.topsail).toFixed()).toEqual('88');
});

test('Transcur fForeTriangle', () => {
  expect(fForeTriangle(tcf).toFixed(2)).toEqual('336.61');
});

test('Transcur fMSA', () => {
  expect(fMSA(tcf).toFixed(1)).toEqual(tcf.sailarea.toFixed(1));
});

test('Transcur fL', () => {
  expect(fL(tcf)).toEqual((tcf.length_on_waterline + tcf.length_on_deck) / 2);
});

test('Transcur fBD', () => {
  const b = boatm2f(Transcur);
  expect(fBD(b)).toEqual(.67 * b.handicap_data.beam * b.handicap_data.beam);
});

test('Transcur fSqrtS', () => {
  const x = .96 * Math.sqrt(tcf.sailarea);
  expect(fSqrtS(boatm2f(Transcur)).toFixed(2)).toEqual(x.toFixed(2));
});

test('Transcur C', () => {
  expect((.67 * tcf.beam * tcf.beam).toFixed(2)).toEqual('77.59');
});

test('Transcur fMR', () => {
  expect(fMR(boatm2f(Transcur)).toFixed(2)).toEqual('26.87');
});

test('Transcur fR', () => {
  expect(fR(boatm2f(Transcur)).toFixed(2)).toEqual('26.47');
});

test('Transcur T(H)CF', () => {
  expect(thcf(boatm2f(Transcur)).toFixed(3)).toEqual('1.018');
});

test('t1', () => {
  expect(0.125 * (Math.sqrt(27.04) + 3)).toEqual(1.025);
});

test('Robinetta T(H)CF', () => {
  expect(thcf(boatm2f(Robinetta)).toFixed(3)).toEqual('0.850');
});
