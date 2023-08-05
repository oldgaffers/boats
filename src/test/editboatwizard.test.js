import fs from 'fs';
import { buildChanges, includes, elements_matching_by_field, nameChanges, recursiveUpdate, salesChanges, updateOwnerships, updateOwnership } from '../components/editboatwizard';
import { channel } from 'diagnostics_channel';

const robinetta = JSON.parse(fs.readFileSync('src/test/robinetta.json'));
const pickers = {
  design_class: [{ "id": "c05a2174-4b46-410f-829f-894193f020c3", "name": "Falmouth Bass Boat" }],
  designer: [],
  builder: [],
};

test('nameChanges empty none', () => {
  expect(nameChanges({}, undefined)).toBe(undefined);
});

test('nameChanges non empty none', () => {
  expect(nameChanges({ name: 'X' }, undefined)).toBe(undefined);
});

test('nameChanges no previous change', () => {
  expect(nameChanges({ name: 'Spray' }, 'Cloud')).toMatchSnapshot();
});

test('nameChanges with previous change', () => {
  expect(nameChanges({
    name: 'Spray',
    previous_names: ['Victoria'],
  }, 'Cloud')).toMatchSnapshot();
});

test('salesChanges none', () => {
  expect(salesChanges({}, {}, {}, {})).toMatchSnapshot();
});

test('salesChanges no change', () => {
  expect(salesChanges({}, {}, {}, {})).toMatchSnapshot();
});

test('buildChanges none', () => {
  const { removed, ...changes } = buildChanges({}, {}, {}, {}, {}, {});
  expect(changes).toMatchSnapshot();
});

test('buildChanges no change', () => {
  const { removed, ...changes1 } = buildChanges({}, robinetta, {}, {}, {}, {});
  expect(changes1).toStrictEqual({});
  let changes2;
  {
    const { removed, ...changes } = buildChanges({}, {
      design_class: {
        id: 'c05a2174-4b46-410f-829f-894193f020c3',
        name: 'Falmouth Bass Boat',
      },
    }, {}, {}, {}, pickers);
    changes2 = changes;
  }
  expect(changes2).toStrictEqual({});
});

test('buildChanges name change', () => {
  const { removed, ...changes } = buildChanges({},
    {
      name: 'Spray',
      previous_names: ['Victoria'],
    },
    {},
    { new_name: 'Cloud' },
    {},
    {});
  expect(changes).toMatchSnapshot();
});

test('recursiveUpdate no change', () => {
  expect(recursiveUpdate(robinetta, {})).toStrictEqual(robinetta);
});

test('recursiveUpdate add air draft', () => {
  expect(recursiveUpdate(robinetta, {
    air_draft: 4.0
  })).toStrictEqual({ ...robinetta, air_draft: 4.0 });
});

test('includes', () => {
  expect(includes([], true)).toBe(false);
  expect(includes([1], 0)).toBe(false);
  expect(includes([1], 1)).toBe(true);
  expect(includes([{ x: 1 }], { x: 1 })).toBe(true);
});

test('match by field', () => {
  const o = [
    { start: 1986, end: 2007, name: 'Mike Garnham', share: 64 },
    { id: 559, member: 5004, share: 32, start: 2007, end: 2025 },
    { id: 1219, member: 5004, share: 32, start: 2007, end: 2025 },
  ];
  const n = [{ name: 'John Smith', start: 2025, share: 64, current: true }];
  expect(elements_matching_by_field(o, n, 'id')).toStrictEqual([]);
  expect(elements_matching_by_field(o, [o[0]], 'id')).toStrictEqual([]);
  expect(elements_matching_by_field(o, [o[0]], 'name')).toStrictEqual([o[0]]);
  expect(elements_matching_by_field(o, [o[0]], 'id')).toStrictEqual([]);
  expect(elements_matching_by_field(o, [o[1]], 'id')).toStrictEqual([o[1]]);
  const r = elements_matching_by_field(o, [o[1]], 'member');
  expect(r).toStrictEqual([o[1], o[2]]);
});

test('update-ownerships 0', () => {
  expect(updateOwnerships([], [])).toStrictEqual([]);
  const o = [
    { id: 559, member: 5004, share: 32, start: 2007, end: 2025 },
    { id: 1219, member: 5004, share: 32, start: 2007, end: 2025 },
  ];
  expect(updateOwnerships(o, [])).toStrictEqual(o);
});

test('update-ownerships 1', () => {
  const o = [
    { start: 1986, end: 2007, name: 'Mike Garnham', share: 64 },
    { id: 559, member: 5004, share: 32, start: 2007, end: 2025 },
    { id: 1219, member: 5004, share: 32, start: 2007, end: 2025 },
  ];
  const n = [{ name: 'John Smith', start: 2025, share: 64, current: true }];
  expect(updateOwnerships(o, n)).toStrictEqual([...o, ...n]);
});

test('update_ownership', () => {
  const o = { id: 559, member: 5004, share: 32, start: 2007, current: true };
  const n = { id: 559, member: 5004, share: 32, start: 2007, end: 2025 };
  expect(updateOwnership(o, n)).toStrictEqual(n);
  const n2 = { id: 559, member: 5004, start: 2007, end: 2025 };
  expect(updateOwnership(o, n2)).toStrictEqual(n);
});

test('update-ownerships 2', () => {
  const o = [
    { start: 1986, end: 2007, name: 'Mike Garnham', share: 64 },
    { id: 559, member: 5004, share: 32, start: 2007 },
    { id: 1219, member: 5004, share: 32, start: 2007 },
  ];
  const n = [
    { id: 559, member: 5004, share: 32, start: 2007, end: 2025 },
    { id: 1219, member: 5004, share: 32, start: 2007, end: 2025 },
    { name: 'John Smith', start: 2025, share: 64, current: true },
  ];
  expect(updateOwnerships(o, n)).toStrictEqual([
    { start: 1986, end: 2007, name: 'Mike Garnham', share: 64 }, ...n]);
});

test('recursiveUpdate new owner', () => {
  const n = [{ name: 'John Smith', start: 2025, share: 64, current: true }];
  const changes = { ownerships: n };
  // console.log(JSON.stringify(robinetta, null, 2));
  const updated = recursiveUpdate(robinetta, changes);
  // console.log(JSON.stringify(updated, null, 2));
  const q = { ...robinetta };
  delete q.ownerships;
  const u = { ...updated };
  delete u.ownerships;
  expect(q).toEqual(u);
  expect(updated.ownerships).toStrictEqual([...robinetta.ownerships, ...n]);
});

test('recursiveUpdate new owner', () => {
  const n = { name: 'John Smith', start: 2025, share: 64, current: true };
  const changes = {
    ownerships: [
      { id: 559, member: 5004, share: 32, start: 2007, end: 2025 },
      { id: 1219, member: 5004, share: 32, start: 2007, end: 2025 },
      n,
    ]
  };
  // console.log(JSON.stringify(robinetta, null, 2));
  const updated = recursiveUpdate(robinetta, changes);
  // console.log(JSON.stringify(updated, null, 2));
  const q = { ...robinetta };
  delete q.ownerships;
  const u = { ...updated };
  delete u.ownerships;
  expect(q).toEqual(u);
  expect(updated.ownerships).toMatchSnapshot();
});

test('handle submit 1', () => {
  const boat = { "air_draft": 3.048, "construction_details": "Built-in bouyancy", "construction_material": "grp", "construction_method": "cold_moulded", "design_class": { "id": "c05a2174-4b46-410f-829f-894193f020c3", "name": "Falmouth Bass Boat" }, "draft": 1.219, "for_sale_state": { "text": "not_for_sale" }, "for_sales": [], "generic_type": "Dinghy", "handicap_data": { "beam": 1.829 }, "home_country": "UK", "home_port": "Bristol", "hull_form": "centre-board dinghy", "id": "5598c94d-4720-4423-a575-44b0845a308b", "image_key": "ddgWxx", "length_on_deck": 4.877, "mainsail_type": "gunter", "name": "Test Boat Record Entry", "oga_no": 9001, "ownerships": [{ "current": true, "id": 35000, "member": 6583, "share": 64, "name": "John B. Sloop" }], "place_built": "Falmouth", "rig_type": "Yawl", "short_description": "<p>Open sailing dinghy.</p>", "spar_material": "wood", "year": 1985, "year_is_approximate": true };
  const ddf = { "can_sell": true, "skip-handicap": "2", "confirm_for_sale": false };
  const submitted = { "mainsail_type": "gunter", "rig_type": "Yawl", "generic_type": "Dinghy", "short_description": "<p>Open sailing dinghy.</p>", "year": 1985, "year_is_approximate": true, "place_built": "Falmouth", "design_class": { "id": "c05a2174-4b46-410f-829f-894193f020c3", "name": "Falmouth Bass Boat" }, "handicap_data": { "length_on_deck": 14, "beam": 6.001, "draft": 1 }, "air_draft": 10, "home_country": "UK", "home_port": "Bristol", "construction_material": "grp", "spar_material": "wood", "construction_details": "Built-in bouyancy", "hull_form": "centre-board dinghy", "ownerships": [{ "current": true, "id": 35000, "member": 6583, "share": 64, "name": "John B. Sloop", "start": 2021 }] };
  const changes = { "handicap_data": { "length_on_deck": 4.267, "draft": 0.305 }, "ownerships": [{ "current": true, "id": 35000, "member": 6583, "share": 64, "name": "John B. Sloop", "start": 2021 }] };
  const newItems = {};
  // expect(buildChanges({}, boat, submitted, ddf, newItems, pickers)).toStrictEqual(changes);
  expect(recursiveUpdate(boat, changes, ['construction_method'])).toMatchSnapshot();


});