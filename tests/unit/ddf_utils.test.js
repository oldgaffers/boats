import { describe, it, expect } from 'vitest';
import { flatten, unflatten, drop_ddf } from '../../src/util/ddf_utils.js';

describe('ddf_utils', () => {
  it('flatten and unflatten roundtrip', () => {
    const obj = { a: { b: 1, c: { d: 2 } }, e: [1,2] };
    const f = flatten(obj);
    // flattened keys should include join char '~'
    expect(Object.keys(f).length).toBeGreaterThan(0);
    const u = unflatten(f);
    expect(u).toEqual(obj);
  });

  it('drop_ddf removes keys starting with ddf_', () => {
    const vals = { ddf_one: 1, keep: 2, ddf_two: 3 };
    const out = drop_ddf(vals);
    expect(out).toEqual({ keep: 2 });
  });
});
