import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../src/util/api', () => ({
  geolocate: vi.fn(),
  getPlaces: vi.fn(),
}));

import { geolocate, getPlaces } from '../../src/util/api';
import boatsByPlaceBuilt from '../../src/util/boatsByPlaceBuilt';

describe('boatsByPlaceBuilt', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns Items with latitude/longitude for places with count > 1', async () => {
    getPlaces.mockResolvedValue({
      p1: { place: 'Port A', count: 3 },
      p2: { place: 'Port B', count: 1 },
      p3: { place: 'Port C', count: 2 },
    });

    geolocate.mockImplementation(async (name) => {
      if (name === 'Port A') return { lat: 10, lng: 20 };
      if (name === 'Port C') return { lat: 30, lng: 40 };
      return null;
    });

    const res = await boatsByPlaceBuilt();
    expect(res).toHaveProperty('Items');
    expect(Array.isArray(res.Items)).toBe(true);
    // Should include only places with count > 1 and where geolocate returned coordinates
    expect(res.Items).toEqual([
      expect.objectContaining({ place: 'Port A', latitude: 10, longitude: 20 }),
      expect.objectContaining({ place: 'Port C', latitude: 30, longitude: 40 }),
    ]);
  });

  it('returns empty Items when getPlaces returns no entries', async () => {
    getPlaces.mockResolvedValue({});
    const res = await boatsByPlaceBuilt();
    expect(res).toEqual({ Items: [] });
  });
});
