import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_BROWSE_STATE, setView, saveState, getState } from '../../src/util/statemanagement.js';

describe('statemanagement', () => {
  beforeEach(() => {
    // Provide a minimal sessionStorage mock when running in node (Vitest unit mode)
    if (typeof sessionStorage === 'undefined') {
      globalThis.sessionStorage = new (class {
        constructor(){ this._m = {}; }
        clear(){ this._m = {}; }
        getItem(k){ return this._m[k] ?? null }
        setItem(k,v){ this._m[k] = v }
        removeItem(k){ delete this._m[k] }
      })();
    }
    sessionStorage.clear();
  });

  it('DEFAULT_BROWSE_STATE contains expected views', () => {
    expect(DEFAULT_BROWSE_STATE.app).toBeTruthy();
    expect(DEFAULT_BROWSE_STATE.sell.view).toBe('sell');
  });

  it('setView stores BOAT_CURRENT_VIEW', () => {
    setView('sail');
    expect(sessionStorage.getItem('BOAT_CURRENT_VIEW')).toBe('sail');
  });

  it('saveState stores keyed state and removes legacy key', () => {
    saveState({ foo: 'bar' }, 'app');
    const stored = sessionStorage.getItem('APP_BROWSE_STATE');
    expect(stored).toBe(JSON.stringify({ foo: 'bar' }));
    expect(sessionStorage.getItem('BOAT_BROWSE_STATE')).toBeNull();
  });

  it('getState returns saved state or default and persists default', () => {
    // No saved state -> should return default and persist it
    const s = getState('app');
    expect(s).toEqual(DEFAULT_BROWSE_STATE.app);
    // Should be stored
    const stored = JSON.parse(sessionStorage.getItem('APP_BROWSE_STATE'));
    expect(stored).toEqual(DEFAULT_BROWSE_STATE.app);

    // If we set a value it should be returned
    const custom = { page: 5 };
    sessionStorage.setItem('APP_BROWSE_STATE', JSON.stringify(custom));
    expect(getState('app')).toEqual(custom);
  });
});
