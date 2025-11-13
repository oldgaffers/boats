import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../src/util/api', () => ({
  geolocate: vi.fn(),
  getFilterable: vi.fn(),
}));

import { geolocate, getFilterable } from '../../src/util/api';
import boatsByHomePort from '../../src/util/boatsbyhomeport';

describe('boatsByHomePort', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns Items for boats with a home_port and valid geolocation', async () => {
    getFilterable.mockResolvedValue([
      { id: 1, name: 'B1', home_port: 'Harbour A' },
      { id: 2, name: 'B2', home_port: '' },
      { id: 3, name: 'B3', home_port: 'Harbour B' },
    ]);

    geolocate.mockImplementation(async (hp) => {
      if (hp === 'Harbour A') return { lat: 1, lng: 2 };
      if (hp === 'Harbour B') return null;
      return null;
    });

    const res = await boatsByHomePort();
    expect(res).toHaveProperty('Items');
    // Only Harbour A should be included because Harbour B returned null and one boat had empty home_port
    expect(res.Items).toEqual([
      expect.objectContaining({ id: 1, home_port: 'Harbour A', latitude: 1, longitude: 2 }),
    ]);
  });

  it('returns empty Items when no boats have home_port', async () => {
    getFilterable.mockResolvedValue([]);
    const res = await boatsByHomePort();
    expect(res).toEqual({ Items: [] });
  });
});
