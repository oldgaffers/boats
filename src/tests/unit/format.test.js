
import { test, expect } from 'vitest';
import {
  formatList,
price,
m2df,
m2f,
m2dsqf,
m2dfn,
m2dsqfn,
f2m,
f2m2,
boatm2f,
boatf2m,
boatDefined,
m2fall } from '../../util/format';

const t = [undefined, 3.281, 4.921];

test('formatList', () => {
  expect(formatList({ }, 'builder')).toBeUndefined();
  let builder = { name: 'Tom' };
  expect(formatList({ builder }, 'builder')).toEqual(builder.name);
  builder = [builder];
  expect(formatList({ builder }, 'builder')).toEqual(builder[0].name);
  builder = [...builder, { name: 'Dick'}, { name: 'Harry'}]
  expect(formatList({ builder }, 'builder')).toEqual('Tom / Dick / Harry');
});

test('price', () => {
  expect(price(0)).toEqual('offers');
  expect(price(1)).toEqual('£1.00');
  expect(price(1.5)).toEqual('£1.50');
});

test('m2df', () => {
  expect(m2df(0)).toBeUndefined();
  expect(m2df(1)).toEqual('3.28');
  expect(m2df(1.5)).toEqual('4.92');
});

test('m2f', () => {
  expect(m2f(0)).toBeUndefined();
  expect(m2f(1)).toEqual('3.28 ft');
  expect(m2f(1.5)).toEqual('4.92 ft');
});

test('m2dfn', () => {
  expect(m2dfn(0)).toBeUndefined();
  expect(m2dfn(1)).toEqual(3.281);
  expect(m2dfn(1.5)).toEqual(4.921);
});

test('m2dsqfn', () => {
  expect(m2dsqfn(0)).toBeUndefined();
  expect(m2dsqfn(1)).toEqual(10.764);
  expect(m2dsqfn(1.5)).toEqual(16.146);
});

test('m2dsqf', () => {
  expect(m2dsqf(0)).toBeUndefined();
  expect(m2dsqf(1)).toEqual('10.764');
  expect(m2dsqf(1.5)).toEqual('16.146');
});

test('f2m', () => {
  expect(f2m(0)).toBeUndefined();
  expect(f2m(10)).toEqual(3.048);
  expect(f2m(22.5)).toEqual(6.858);
});

test('f2m2', () => {
  expect(f2m2(0)).toBeUndefined();
  expect(f2m2(1.5)).toEqual(0.139);
  expect(f2m2(10)).toEqual(0.929);
});

const boatInFeet1 = {
  rig_type: 'Cutter',
  draft: 4.921,
  handicap_data: {
    beam: 9.678,
    sailarea: undefined,
    fore_triangle_height: 30.581,
    fore_triangle_base: 19.259,
    length_on_deck: 27.871,
    length_on_waterline: 27.231,
    depth: 5,
    main: {
      luff: 17.221,
      head: 15.909,
      foot: 18.54,
    },
    topsail: {
      luff: 18.77,
      perpendicular: 7.051
    },
    propellor: { type: 'fixed' },
  }
};

const boatInFeet2 = {
  hull_type: 'deep',
  rig_type: 'Cutter',
  draft: 2.749,
  handicap_data: {
    beam: 7.001,
    sailarea: undefined,
    fore_triangle_height: 19.501,
    fore_triangle_base: 9.301,
    length_on_deck: 21.001,
    length_on_waterline: 17.001,
    depth: 5,
    main: {
      luff: 9.751,
      head: 16.9,
      foot: 16.9,
    },
    propellor: { type: 'fixed' },
  }
};

test('boatf2m', () => {
  expect(boatf2m(boatInFeet1)).toMatchSnapshot();
  expect(boatf2m(boatInFeet2)).toMatchSnapshot();
});

const boatInMetres1 = boatf2m(boatInFeet1);
const boatInMetres2 = boatf2m(boatInFeet2);

test('boatm2f', () => {
  expect(boatm2f(boatInMetres1)).toStrictEqual(boatInFeet1);
  expect(boatm2f(boatInMetres2)).toStrictEqual(boatInFeet2);
});

test('boatDefined', () => {
  expect(boatDefined(boatInFeet1)).toMatchSnapshot();
  expect(boatDefined(boatInFeet2)).toMatchSnapshot();
});

test('m2fall', () => {
  expect(m2fall({ a: t[0], b: t[1], c: t[2] })).toStrictEqual([m2dfn(t[0]), m2dfn(t[1]), m2dfn(t[2])]);
});

