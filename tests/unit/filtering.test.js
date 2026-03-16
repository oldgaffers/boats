import { test, expect } from 'vitest';
import {
  makePicker,
  makePickers,
  findFirstAbsent,
  applyFilters,
  sortAndPaginate,
} from '../../src/util/filtering';

const mockBoats = [
  {
    oga_no: 1,
    name: 'Boat A',
    designer: 'Designer A',
    builder: 'Builder A',
    rig_type: 'Sloop',
    mainsail_type: 'Gaff',
    generic_type: 'Dinghy',
    design_class: 'Class A',
    construction_material: 'Wood',
    place_built: 'Place A',
    home_port: 'Port A',
    year: 2000,
    previous_names: ['Old Boat A'],
  },
  {
    oga_no: 2,
    name: 'Boat B',
    designer: 'Designer B',
    builder: 'Builder B',
    rig_type: 'Cutter',
    mainsail_type: 'Bermudan',
    generic_type: 'Yacht',
    design_class: 'Class B',
    construction_material: 'GRP',
    place_built: 'Place B',
    home_port: 'Port B',
    year: 2010,
    previous_names: [],
  },
  {
    oga_no: 3,
    name: 'Boat C',
    designer: 'Designer A',
    builder: 'Builder C',
    rig_type: 'Sloop',
    mainsail_type: 'Gaff',
    generic_type: 'Dinghy',
    design_class: 'Class A',
    construction_material: 'Wood',
    place_built: 'Place A',
    home_port: 'Port C',
    year: 2020,
    previous_names: ['Old Boat C1', 'Old Boat C2'],
  },
  {
    oga_no: 5,
    name: 'Boat D',
    designer: 'Designer C',
    builder: 'Builder A',
    rig_type: 'Ketch',
    mainsail_type: 'Gaff',
    generic_type: 'Yacht',
    design_class: 'Class C',
    construction_material: 'Steel',
    place_built: 'Place C',
    home_port: 'Port A',
    year: 1990,
    previous_names: [],
  },
];

test('makePicker returns sorted unique values for a key', () => {
  const result = makePicker(mockBoats, 'designer');
  expect(result).toEqual(['Designer A', 'Designer B', 'Designer C']);
});

test('makePicker handles array values', () => {
  const boatsWithArray = [
    { designers: ['Designer A', 'Designer B'] },
    { designers: ['Designer B', 'Designer C'] },
  ];
  const result = makePicker(boatsWithArray, 'designers');
  expect(result).toEqual(['Designer A', 'Designer B', 'Designer C']);
});

test('makePicker filters out falsy values', () => {
  const boatsWithFalsy = [
    { designer: 'Designer A' },
    { designer: null },
    { designer: '' },
    { designer: 'Designer B' },
  ];
  const result = makePicker(boatsWithFalsy, 'designer');
  expect(result).toEqual(['Designer A', 'Designer B']);
});

test('makePickers creates pickers for all specified keys', () => {
  const result = makePickers(mockBoats);
  expect(result.designer).toEqual(['Designer A', 'Designer B', 'Designer C']);
  expect(result.builder).toEqual(['Builder A', 'Builder B', 'Builder C']);
  expect(result.rig_type).toEqual(['Cutter', 'Ketch', 'Sloop']);
  expect(result.mainsail_type).toEqual(['Bermudan', 'Gaff']);
  expect(result.generic_type).toEqual(['Dinghy', 'Yacht']);
  expect(result.design_class).toEqual(['Class A', 'Class B', 'Class C']);
  expect(result.construction_material).toEqual(['GRP', 'Steel', 'Wood']);
  expect(result.place_built).toEqual(['Place A', 'Place B', 'Place C']);
  expect(result.home_port).toEqual(['Port A', 'Port B', 'Port C']);
});

test('makePickers combines name and previous_names', () => {
  const result = makePickers(mockBoats);
  expect(result.name).toEqual(['Boat A', 'Boat B', 'Boat C', 'Boat D', 'Old Boat A', 'Old Boat C1', 'Old Boat C2']);
});

test('makePickers creates year range', () => {
  const result = makePickers(mockBoats);
  expect(result.year).toEqual({
    step: 10,
    min: 1990,
    max: 2020,
  });
});

test('makePickers handles empty filtered array', () => {
  const result = makePickers([]);
  expect(result.designer).toEqual([]);
  expect(result.year).toEqual({
    step: 10,
    min: 1800,
    max: new Date().getFullYear(),
  });
});

test('findFirstAbsent returns -1 for null or undefined boat', () => {
  expect(findFirstAbsent(null)).toBe(-1);
  expect(findFirstAbsent(undefined)).toBe(-1);
});

test('findFirstAbsent returns 1 for empty array', () => {
  expect(findFirstAbsent([])).toBe(1);
});

test('findFirstAbsent finds first missing number', () => {
  const boats = [
    { oga_no: 1 },
    { oga_no: 2 },
    { oga_no: 4 },
  ];
  expect(findFirstAbsent(boats)).toBe(3);
});

test('findFirstAbsent returns next number if no gaps', () => {
  const boats = [
    { oga_no: 1 },
    { oga_no: 2 },
    { oga_no: 3 },
  ];
  expect(findFirstAbsent(boats)).toBe(4);
});

test('findFirstAbsent handles unsorted array', () => {
  const boats = [
    { oga_no: 3 },
    { oga_no: 1 },
    { oga_no: 2 },
  ];
  expect(findFirstAbsent(boats)).toBe(4);
});

test('applyFilters returns all boats when no filters', () => {
  const result = applyFilters(mockBoats, {});
  expect(result).toEqual(mockBoats);
});

test('applyFilters returns all boats when filters is null', () => {
  const result = applyFilters(mockBoats, null);
  expect(result).toEqual(mockBoats);
});

test('applyFilters filters by single key', () => {
  const filters = { designer: 'Designer A' };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(2);
  expect(result.map(b => b.name)).toEqual(['Boat A', 'Boat C']);
});

test('applyFilters filters by multiple keys (AND logic)', () => {
  const filters = { designer: 'Designer A', rig_type: 'Sloop' };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(2);
  expect(result.map(b => b.name)).toEqual(['Boat A', 'Boat C']);
});

test('applyFilters filters by name including previous names', () => {
  const filters = { name: 'Old Boat A' };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Boat A');
});

test('applyFilters handles array values in boat data', () => {
  const boatsWithArrays = [
    { oga_no: 1, designers: ['Designer A', 'Designer B'] },
    { oga_no: 2, designers: ['Designer C'] },
  ];
  const filters = { designers: 'Designer A' };
  const result = applyFilters(boatsWithArrays, filters);
  expect(result).toHaveLength(1);
  expect(result[0].oga_no).toBe(1);
});

test('applyFilters handles array values in filters', () => {
  const filters = { designer: ['Designer A', 'Designer B'] };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(3);
  expect(result.map(b => b.name).sort()).toEqual(['Boat A', 'Boat B', 'Boat C']);
});

test('applyFilters filters by year range', () => {
  const filters = { firstYear: 2000, lastYear: 2015 };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(2);
  expect(result.map(b => b.name).sort()).toEqual(['Boat A', 'Boat B']);
});

test('applyFilters handles sail filter', () => {
  const filters = { sail: ['rig_type', 'mainsail_type'] };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(4); // All boats have at least one of these properties
});

test('applyFilters combines sail and other filters', () => {
  const filters = { sail: ['rig_type'], designer: 'Designer A' };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(2);
  expect(result.map(b => b.name)).toEqual(['Boat A', 'Boat C']);
});

test('applyFilters handles oga_no filter', () => {
  const filters = { oga_no: 2 };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Boat B');
});

test('applyFilters handles oga_nos filter (maps to oga_no)', () => {
  const filters = { oga_nos: 2 };
  const result = applyFilters(mockBoats, filters);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Boat B');
});

test('sortAndPaginate sorts and slices correctly', () => {
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