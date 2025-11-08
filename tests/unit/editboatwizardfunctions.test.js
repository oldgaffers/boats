  import fs from 'fs';
  import { expect, test, vi } from 'vitest';
  import { formatters } from 'jsondiffpatch';
  import { boatdiff, getNewItems, getAllNewItems, prepareInitialValues, prepareModifiedValues } from '../../src/components/editboatwizardfunctions';
  import { boatDefined } from '../../src/util/format';
  
  const robinetta = JSON.parse(fs.readFileSync('tests/mock/robinetta.json'));
  const { result: { pageContext: { boat: roanmor } } } = JSON.parse(fs.readFileSync('./tests/mock/843.json', 'utf-8'));
  
  const pickers = {
    boatNames: [],
    designer: [
      {
        "id": "afc68d59-e7ba-466e-861f-741e2eeae526",
        "name": "D.A. Rayner",  
      },
    ],
    builder: [
      {
        "id": "a27bca50-d155-428a-be49-a542d64ba316",
        "name": "Enterprise Small Craft",  
      },
    ],
    rig_type: [],
    sail_type: [],
    design_class: [],
    generic_type: [],
    construction_material: [],
    construction_method: [],
    hull_form: [],
    spar_material: [],
  };
  
  vi.setSystemTime(1699091602308);
  
  test('boat defined', () => {
    const defined = boatDefined(robinetta);
    expect(defined).toMatchSnapshot();
    expect(defined).toEqual(robinetta);
    expect(boatDefined({ ...robinetta, previous_names: [], for_sales: [] })).toEqual(robinetta);
  });
  
  test('diff no change', () => {
    const delta = boatdiff(robinetta, robinetta);
    expect(delta).toMatchSnapshot();
  });
  
  test('diff name change', () => {
    const after = JSON.parse(JSON.stringify(robinetta));
    after.name = 'Cloud';
    after.previous_names = ['Victoria'];
    const delta = boatdiff(robinetta, after);
    expect(delta).toMatchSnapshot();
  });
  
  test('prepareInitialValues', () => {
    const user = {
      email: 'x@b.c',
      'https://oga.org.uk/id': 559,
      'https://oga.org.uk/roles': ['editor', 'member'],
    };
  
    expect(prepareInitialValues(robinetta)).toMatchSnapshot();
    const iv = prepareInitialValues(robinetta, user);
    expect(iv).toMatchSnapshot();
    expect(iv.designer).toEqual(['D.A. Rayner']);
    expect(iv.builder).toEqual(['Enterprise Small Craft']);
  });
  
  test('getNewItems 1', () => {
    const t0 = getNewItems(['Noah'], [{ name: 'Noah' }]);
    expect(t0).toStrictEqual({});
  });
  
  test('getNewItems 2', () => {
    const t0 = getNewItems([{ name: 'Noah' }], [{ name: 'Noah' }]);
    expect(t0).toStrictEqual({});
  });
  
  test('getNewItems with new item', () => {
    const t0 = getNewItems(['Pooh'], [{ name: 'Noah' }]);
    expect(t0[0].name).toStrictEqual('Pooh');
  });
  
  test('getAllNewItems 1', () => {
    const t0 = getAllNewItems(prepareInitialValues(robinetta), pickers);
    expect(t0).toStrictEqual({});
  });
  
  test('getAllNewItems 2', () => {
    const t1 = getAllNewItems({ builder: ['Noah'] }, pickers);
    expect(t1.builder[0].name).toEqual('Noah');
  });
  
  test('prepareModifiedValues', () => {
     
    const { name, oga_no, id, image_key, for_sales, for_sale_state, ...rest } = JSON.parse(JSON.stringify(robinetta));
    const ddf = {};
    rest.ownerships.forEach((o) => {
      o.goldId = o.id;
    });
    const submitted = { ...rest, ddf };
    const mv = prepareModifiedValues(submitted, robinetta, pickers);
    expect(mv).toMatchSnapshot();
  });
  
  test('no change', () => {
    const user = {
      email: 'x@b.c',
      'https://oga.org.uk/id': 559,
      'https://oga.org.uk/roles': ['editor', 'member'],
    };
    {
      const iv = prepareInitialValues(robinetta, user);
      const { boat, newItems, email } = prepareModifiedValues(iv, robinetta, pickers);
      expect(boat).toEqual(robinetta);
      expect(newItems).toEqual({});
      expect(email).toEqual(user.email);
    }
  
  
  });
  
  test('Grosso', () => {
  
    const old = {
      "builder": { "id": "ee814a69-d5ad-46d9-88a9-a0598ae6d33b", "name": "Martin Heard" }, "construction_details": "G R P", "construction_material": "grp", "designer": { "id": "7ac480da-7d09-4dd7-9c89-61199ff30913", "name": "Percy Dalton" },
      "for_sales": [
        {
          "created_at": "2022-09-29T17:28:21.36815+00:00",
          "asking_price": 29500, 
          "sales_text": "<p>Settling import tax and delivery to the UK are negotiable.</p>\n<p>Engine: Yanmar diesel 3GM30 27 pk Engine number 05696 Sleeps 4 The dinette is a\ndouble berth One sleeping place in the dog cage, in the bow is a single bed. 4\nBronze portholes which can be opened and two fixed bronze portholes. Hatch 50 x\n50 cm in foredeck. Goyot handanchorwinch, CQR anchor and chain. Overhaul\n2021/22. Renewed: Plastic water tank 77 liter + deck filler cap incl. All hoses.\n“Wyna”water lever gauge. Holding tank Galley with automatic diaphragm pump\nPlastic diesel tank 42 Liter + deck filler cap incl. all hoses. Tevens “Wyna”\nlever gauge. Round stainless steel galley sink incl. all hoses. All electric\nsystems incl. switch panel. Electric bilge pump incl. all hoses. New hose on the\nhand bilge pump. Thru-hull fittings with valves are renewed or replaced\nNavigation lights The paneling has been partially replaced and executed in clear\nlacquered mahogany. 9 New ceiling lights, partially led. The cockpit is\npartially renewed and made self draining. New teak list round the boat All the\npaint at the underwatership is removed. New epoxy layers and antifouling The\nrudder is renewed incl. three bronze/stainless steel bearings.</p>\n<p>Engine: New Yanmar vibration dampers, Extensive service. New exhaust system with\nsilencer, goose neck and thru hull fitting. Gaff rigged Ironable mast with\nstainless steel mast sleeve. Oregeon pine mast, boom, gaff and bow sprit.\nMainsail Staysail Jibb ( 2 ) “Wykeham Martin” ( jib )</p>\n<p>Deck: Stainless steel pulpit Stainless steel railing Boom support aftdeck.\nWooden part is renewed. 2 Self tailing winches staysail and two winches jib.\nAutopilot ( old ) GPS with speed, course and verity. Voltmeter, telephone\nchargers. ( 2 ) Victron 15 ah accucharger Shore connection with cable, ground\nfault and 2 x 16 ah automatic fuses. 3 Varta batter 70 ah No VHF, Depth sounder\nand speed log. We can install modern navigational instruments. Cabin cushions\nwill be renewed to the new owners colour choice.</p>",
        },
      ],
      "generic_type": ["Yacht"],
      "handicap_data": { "beam": 3.048, "draft": 1.524, "length_on_deck": 8.534 },
      "hull_form": "long keel sloping forefoot", "id": "1dab7650-151e-44a6-b6d1-b7928ed732fe", "image_key": "2JTzFg", "mainsail_type": "gaff", "name": "Grosso", "oga_no": 2511, "ownerships": [], "place_built": "Mylor Bridge", "previous_names": [], "rig_type": "Cutter", "selling_status": "for_sale", "spar_material": "wood", "uk_part1": "28255", "year": 1988, "year_is_approximate": false,
    };
    const submitted = {
      "mainsail_type": "gaff", "rig_type": "Cutter", "generic_type": ["Yacht"], "year": 1988, "year_is_approximate": false, "place_built": "Mylor Bridge", "builder": { "name": "Martin Heard", "id": "ee814a69-d5ad-46d9-88a9-a0598ae6d33b" }, "designer": { "name": "Percy Dalton", "id": "7ac480da-7d09-4dd7-9c89-61199ff30913" }, "design_class": { "name": "Heard 28", "id": "47040682-ee05-42de-a493-400ebd5956db" },
      "handicap_data": { "length_on_deck": 8.534, "beam": 3.048, "draft": 1.524 },
      "previous_names": [], "uk_part1": "28255", "construction_material": "grp", "spar_material": "wood", "construction_details": "G R P", "hull_form": "long keel sloping forefoot", "ownerships": [], "name": "Grosso", "oga_no": 2511, "id": "1dab7650-151e-44a6-b6d1-b7928ed732fe", "image_key": "2JTzFg",
      "for_sales": [
        {
          "created_at": "2022-01-01T00:00:00Z",
          "asking_price": 29500,
          "sales_text": "<p>Settling import tax and delivery to the UK are negotiable.</p><p>Sleeps 4 The dinette is a double berth One sleeping place in the dog cage, in the bow is a single bed.</p><p>4 Bronze portholes which can be opened and two fixed bronze portholes. Hatch 50 x 50 cm in foredeck. Goyot hand anchor winch, CQR anchor and chain. Overhaul 2021/22.&nbsp;</p><p>Renewed: Plastic water tank 77 litre + deck filler cap incl. All hoses. “Wyna”water lever gauge. Holding tank Galley with automatic diaphragm pump Plastic diesel tank 42 Liter + deck filler cap incl. all hoses. Tevens “Wyna” lever gauge. Round stainless steel galley sink incl. all hoses. All electric systems incl. switch panel. Electric bilge pump incl. all hoses. New hose on the hand bilge pump. Thru-hull fittings with valves are renewed or replaced</p><p>Navigation lights.</p><p>The paneling has been partially replaced and executed in clear lacquered mahogany. 9 New ceiling lights, partially led. The cockpit is partially renewed and made self draining. New teak list round the boat All the paint at the underwatership is removed. New epoxy layers and antifouling The rudder is renewed incl. three bronze/stainless steel bearings.</p><p>Engine: Yanmar diesel 3GM30 27 pk Engine number 05696. New Yanmar vibration dampers, Extensive service. New exhaust system with silencer, goose neck and thru hull fitting.</p><p>Gaff rigged Ironable mast with stainless steel mast sleeve. Oregon pine mast, boom, gaff and bow sprit. Mainsail Staysail Jibb ( 2 ) “Wykeham Martin” ( jib )</p><p>Deck: Stainless steel pulpit Stainless steel railing Boom support aft-deck. Wooden part is renewed. 2 Self tailing winches staysail and two winches jib. Autopilot ( old ) GPS with speed, course and verity. Voltmeter, telephone chargers. ( 2 ) Victron 15 ah accucharger Shore connection with cable, ground fault and 2 x 16 ah automatic fuses. 3 Varta batter 70 ah No VHF, Depth sounder and speed log.</p><p>We can install modern navigational instruments. Cabin cushions will be renewed to the new owners colour choice.</p>",
        },
      ],
      "selling_status": "for_sale",
    };
    const delta = boatdiff(old, submitted);
    expect(delta).toMatchSnapshot();
    // const jp = formatters.jsonpatch.format(delta);
    // expect(jp).toMatchSnapshot();
    // console.log(old.for_sales[0].sales_text.length, submitted.for_sales[0].sales_text.length);
    const fsd = boatdiff(old.for_sales[0].sales_text, submitted.for_sales[0].sales_text);
    expect(fsd).toMatchSnapshot();
    expect(formatters.jsonpatch.format(fsd)).toMatchSnapshot();
  });
  
  test('Ro-an-mor', () => {
    expect(roanmor).toBeDefined();
    expect(boatdiff(roanmor, roanmor)).toBeUndefined();
    const { ownerships, ...boatNoOwnerships } = roanmor;
    expect(boatdiff(roanmor, boatNoOwnerships)).toEqual(boatdiff({ ownerships }, {}));
  });
  
  