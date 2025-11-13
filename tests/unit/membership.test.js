import { describe, it, expect } from 'vitest';
import { memberPredicate } from '../../src/util/membership.js';

describe('memberPredicate', () => {
  it('returns false for falsy member or id mismatch', () => {
    expect(memberPredicate('1', null)).toBe(false);
    expect(memberPredicate('1', { id: '2' })).toBe(false);
  });

  it('filters out Left OGA and Not Paid when defaults used', () => {
    expect(memberPredicate('1', { id: '1', status: 'Left OGA', GDPR: true })).toBe(false);
    expect(memberPredicate('1', { id: '1', status: 'Not Paid', GDPR: true })).toBe(false);
  });

  it('honours excludeNotPaid and excludeNoConsent flags', () => {
    const m = { id: '1', status: 'Not Paid', GDPR: false };
    expect(memberPredicate('1', m, true, true)).toBe(false);
    expect(memberPredicate('1', m, false, true)).toBe(false); // still false because GDPR false and excludeNoConsent true
    expect(memberPredicate('1', m, false, false)).toBe(true);
  });
});
