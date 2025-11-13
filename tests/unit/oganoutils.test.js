import { describe, it, expect } from 'vitest';
import { findFirstAbsent, applyFilters, sortAndPaginate } from '../../src/util/oganoutils.js';

describe('oganoutils', () => {
  it('findFirstAbsent handles null and gaps', () => {
    expect(findFirstAbsent(null)).toBe(-1);
    const boats = [{ oga_no: '1' }, { oga_no: '2' }, { oga_no: '4' }];
    expect(findFirstAbsent(boats)).toBe(3);
  });

  it('applyFilters filters by simple equality and year ranges', () => {
    const boats = [
      { oga_no: 1, year: 1990, builder: 'b1', sail: ['a'] },
      { oga_no: 2, year: 2000, builder: 'b2', sail: [] },
    ];
    expect(applyFilters(boats, { builder: 'b1' })).toEqual([boats[0]]);
    expect(applyFilters(boats, { firstYear: 1995 })).toEqual([boats[1]]);
  });

  it('sortAndPaginate sorts and slices correctly', () => {
    const boats = [
      { name: 'C' },
      { name: 'A' },
      { name: 'B' },
      { name: 'D' }
    ];
    const state = { sort: 'name', sortDirection: 'asc', page: 2, bpp: 2 };
    const page = sortAndPaginate(boats, state);
    // Sorted names: A, B, C, D -> page 2 (bpp 2) contains C, D
    expect(page.map(b => b.name)).toEqual(['C', 'D']);
  });
});
