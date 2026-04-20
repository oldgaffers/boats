import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBoats } from '../../src/util/boats';
import * as api from '../../src/util/api';

// Mock the API module
vi.mock('../../src/util/api', () => ({
  getFilterable: vi.fn(),
}));

describe('useBoats hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns undefined initially while loading', () => {
    // Mock getFilterable to never resolve (simulating loading state)
    api.getFilterable.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useBoats());

    expect(result.current).toBeUndefined();
  });

  it('returns all boats when no filters applied', async () => {
    const mockBoats = [
      { oga_no: 1, name: 'Boat 1' },
      { oga_no: 2, name: 'Boat 2' },
    ];

    api.getFilterable.mockResolvedValue(mockBoats);

    const { result } = renderHook(() => useBoats());

    await waitFor(() => {
      expect(result.current).toEqual(mockBoats);
    });

    expect(api.getFilterable).toHaveBeenCalledTimes(1);
  });

  it('filters boats by ownership when ownedOnly=true', async () => {
    const mockBoats = [
      { oga_no: 1, name: 'Boat 1', owners: [123] },
      { oga_no: 2, name: 'Boat 2', owners: [456] },
      { oga_no: 3, name: 'Boat 3', owners: [] },
    ];

    api.getFilterable.mockResolvedValue(mockBoats);

    const { result } = renderHook(() => useBoats(123, true));

    await waitFor(() => {
      expect(result.current).toEqual([{ oga_no: 1, name: 'Boat 1', owners: [123] }]);
    });
  });

  it('filters boats by members when membersBoatsOnly=true', async () => {
    const mockBoats = [
      { oga_no: 1, name: 'Boat 1', owners: [{ id: 1 }] },
      { oga_no: 2, name: 'Boat 2', owners: [] },
      { oga_no: 3, name: 'Boat 3' }, // no owners property
    ];

    api.getFilterable.mockResolvedValue(mockBoats);

    const { result } = renderHook(() => useBoats(null, false, true));

    await waitFor(() => {
      expect(result.current).toEqual([{ oga_no: 1, name: 'Boat 1', owners: [{ id: 1 }] }]);
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    api.getFilterable.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useBoats());

    // Should remain undefined on error
    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('only calls getFilterable once despite multiple renders', async () => {
    const mockBoats = [{ oga_no: 1, name: 'Boat 1' }];
    api.getFilterable.mockResolvedValue(mockBoats);

    const { result, rerender } = renderHook(() => useBoats());

    await waitFor(() => {
      expect(result.current).toEqual(mockBoats);
    });

    // Rerender the hook
    rerender();

    // Should still only have been called once
    expect(api.getFilterable).toHaveBeenCalledTimes(1);
  });
});
