import { test, expect } from 'vitest';
import { toTitleCase } from '../../src/util/text_utils';

test('toTitleCase - basic cases', () => {
  expect(toTitleCase('')).toBe('');
  expect(toTitleCase('hello world')).toBe('Hello World');
  expect(toTitleCase('mIXed CaSe')).toBe('Mixed Case');
  expect(toTitleCase("o'reilly's book")).toBe("O'reilly's Book");
  // leading/trailing whitespace should be preserved by replace behavior
  expect(toTitleCase('  leading')).toBe('  Leading');
});
