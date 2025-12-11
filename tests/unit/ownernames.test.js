import { test, expect, vi } from 'vitest';
import {
  ownerMembershipNumbers,
  ownershipsWithNames,
  getOwnerNames,
} from '../../src/util/ownernames';
import * as api from '../../src/util/api';

test('ownershipsWithNames returns ownerships unchanged when no members passed', () => {
  const ownerships = [{ id: 1, start: '2020' }];
  expect(ownershipsWithNames(ownerships)).toBe(ownerships);
});

test('ownershipsWithNames attaches name and skipper when member found and GDPR true', () => {
  const members = [
    { id: 1, skipper: true, GDPR: true, firstname: 'John', lastname: 'Doe' },
  ];
  const ownerships = [{ id: 1, start: '2020' }];
  const r = ownershipsWithNames(ownerships, members);
  expect(r[0].name).toBe('John Doe');
  expect(r[0].skipper).toBe(true);
});

test('ownerMembershipNumbers returns unique membership numbers where name is missing/empty', () => {
  const boat = {
    ownerships: [
      { member: 5, name: undefined },
      { member: 5, name: '' },
      { member: 6, name: 'Bob' },
      { member: 7 },
    ],
  };
  const nums = ownerMembershipNumbers(boat.ownerships);
  expect(nums.sort()).toEqual([5, 7]);
});

test('ownershipsWithNames adds names', () => {
  const boat = {
    ownerships: [
      { id: 1, start: '2019' },
      { id: 2, start: '2021' },
      { id: 3, start: '2022' },
    ],
  };
  const members = [
    { id: 1, GDPR: true, firstname: 'A', lastname: 'One' },
    { id: 2, GDPR: true, firstname: 'B', lastname: 'Two' },
    { id: 3, GDPR: false, firstname: 'C', lastname: 'Three' },
  ];
  const out = ownershipsWithNames(boat.ownerships, members);
  // ensure both ownerships are present and names were attached
  expect(out.map((o) => o.id).sort()).toEqual([1, 2, 3]);
  expect(out.find((o) => o.id === 1).name).toBe('A One');
  expect(out.find((o) => o.id === 3).note).toBe('name on record but withheld');
});

test('getOwnerNames calls getScopedData and returns Items', async () => {
  const spy = vi.spyOn(api, 'getScopedData').mockResolvedValue({ Items: [{ id: 5, firstname: 'X', lastname: 'Y', GDPR: true }] });
  const items = await getOwnerNames([5], 'token');
  expect(spy).toHaveBeenCalled();
  expect(items).toEqual([{ id: 5, firstname: 'X', lastname: 'Y', GDPR: true }]);
  spy.mockRestore();
});
