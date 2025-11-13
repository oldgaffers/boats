import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock local table actions before importing the module under test
vi.mock('../../src/util/boatsByPlaceBuilt', () => ({
  default: () => ['place-built-mock']
}));
vi.mock('../../src/util/boatsbyhomeport', () => ({
  default: () => ['home-port-mock']
}));

import {
  postNewValues,
  clearNewValues,
  getPicklist,
  postScopedData,
  getScopedData,
  getBoatData,
  getPicklists,
  getFilterable,
  getPlaces,
  getUploadCredentials,
  getAlbumKey,
  getThumb,
  getLargestImage,
  nextOgaNo,
  disposeOgaNo,
  postGeneralEnquiry,
  putGeneralEnquiry,
  shuffleBoats,
  postBoatData,
  postCrewEnquiry,
  getExtra,
  geolocate,
} from '../../src/util/api.js';

describe('api util', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    // ensure newValues cleared between tests
    await clearNewValues();
  });

  it('postNewValues and getPicklist (string list) merges and sorts values', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ json: async () => ['alpha'] });
    await postNewValues('places', ['beta']);
    const res = await getPicklist('places');
    // expect union of ['alpha','beta'] sorted
    expect(res).toEqual(['alpha', 'beta']);
  });

  it('getPicklist (object list) maps newValues to objects and includes them', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ json: async () => [{ name: 'one' }] });
    await postNewValues('builders', ['two']);
    const res = await getPicklist('builders');
    // Should include original object and mapped new value object
    const names = res.map((r) => r.name || r);
    expect(names).toEqual(expect.arrayContaining(['one', 'two']));
  });

  it('postScopedData includes Authorization header when token provided', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) });
  globalThis.fetch = fetchMock;
    await postScopedData('scope', 'subject', { a: 1 }, 'tok123');
    expect(fetchMock).toHaveBeenCalled();
    const calledOptions = fetchMock.mock.calls[0][1];
    expect(calledOptions.headers.Authorization).toBe('Bearer tok123');
  });

  it('getScopedData uses local table actions for home_port and place_built', async () => {
    // no fetch mock needed; the local actions should be returned
    const resHome = await getScopedData('public', 'home_port', {});
    expect(resHome).toEqual(['home-port-mock']);
    const resPlace = await getScopedData('public', 'place_built', {});
    expect(resPlace).toEqual(['place-built-mock']);
  });

  it('getScopedData calls remote fetch for non-local subject and passes Authorization when provided', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ items: 1 }) });
  globalThis.fetch = fetchMock;
    const filters = { q: 'x' };
    const r = await getScopedData('public', 'not_local', filters, 'tokX');
    expect(fetchMock).toHaveBeenCalled();
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/not_local?');
    const options = fetchMock.mock.calls[0][1];
    expect(options.headers.Authorization).toBe('Bearer tokX');
    expect(r).toEqual({ items: 1 });
  });

  it('postScopedData without token does not include Authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) });
    globalThis.fetch = fetchMock;
    await postScopedData('scope', 'subject', { a: 1 });
    expect(fetchMock).toHaveBeenCalled();
    const calledOptions = fetchMock.mock.calls[0][1];
    expect(calledOptions.headers.Authorization).toBeUndefined();
    expect(calledOptions.headers['content-type']).toBe('application/json');
  });

  it('getPicklists fetches pickers.json', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ lists: 'data' }) });
    globalThis.fetch = fetchMock;
    const res = await getPicklists();
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][0]).toContain('pickers.json');
    expect(res).toEqual({ lists: 'data' });
  });

  it('getBoatData fetches and processes boat data on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: {
          pageContext: {
            boat: {
              name: 'Test Boat',
              generic_type: 'Cruiser',
              builder: 'Test Builder',
              designer: 'Test Designer',
            }
          }
        }
      })
    });
    globalThis.fetch = fetchMock;
    const res = await getBoatData(123);
    expect(res.name).toBe('Test Boat');
    expect(Array.isArray(res.generic_type)).toBe(true);
  });

  it('getBoatData returns undefined on fetch failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    globalThis.fetch = fetchMock;
    const res = await getBoatData(999);
    expect(res).toBeUndefined();
  });

  it('getFilterable fetches and merges filterable boats with extra data', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ json: async () => [{ oga_no: 1, name: 'Boat' }] });
    globalThis.fetch = fetchMock;
    const res = await getFilterable();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(1);
  });

  it('getPlaces fetches places.json', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ['Port1', 'Port2'] });
    globalThis.fetch = fetchMock;
    const res = await getPlaces();
    expect(res).toEqual(['Port1', 'Port2']);
  });

  it('getUploadCredentials fetches upload credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ bucket: 'test' }) });
    globalThis.fetch = fetchMock;
    const res = await getUploadCredentials();
    expect(res).toEqual({ bucket: 'test' });
  });

  it('getAlbumKey returns album key on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ key: 'album-key' })
    });
    globalThis.fetch = fetchMock;
    const res = await getAlbumKey('My Album', 123);
    expect(res).toEqual({ key: 'album-key' });
  });

  it('getAlbumKey returns undefined on fetch failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    globalThis.fetch = fetchMock;
    const res = await getAlbumKey('Album', 123);
    expect(res).toBeUndefined();
  });

  it('getThumb fetches thumbnail from album key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ thumb: 'url' }) });
    globalThis.fetch = fetchMock;
    const res = await getThumb('key123');
    expect(res).toEqual({ thumb: 'url' });
  });

  it('getLargestImage fetches largest image from album key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ image: 'url' }) });
    globalThis.fetch = fetchMock;
    const res = await getLargestImage('key123');
    expect(res).toEqual({ image: 'url' });
  });

  it('nextOgaNo fetches next OGA number', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ oga_no: 5000 }) });
    globalThis.fetch = fetchMock;
    const res = await nextOgaNo();
    expect(res).toEqual({ oga_no: 5000 });
  });

  it('disposeOgaNo posts OGA number to dispose', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) });
    globalThis.fetch = fetchMock;
    const res = await disposeOgaNo(123);
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
    expect(res).toEqual({ ok: true });
  });

  it('postGeneralEnquiry posts data to API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;
    await postGeneralEnquiry('scope', 'subject', { msg: 'test' });
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
  });

  it('putGeneralEnquiry puts data to API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) });
    globalThis.fetch = fetchMock;
    const res = await putGeneralEnquiry('scope', 'subject', { msg: 'test' });
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('PUT');
    expect(res).toEqual({ ok: true });
  });

  it('shuffleBoats posts shuffle request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ shuffled: true }) });
    globalThis.fetch = fetchMock;
    const res = await shuffleBoats();
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
    expect(res).toEqual({ shuffled: true });
  });

  it('postBoatData posts boat data to Lambda URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;
    await postBoatData({ oga_no: 1, name: 'Boat' });
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
  });

  it('postCrewEnquiry posts crew enquiry data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;
    await postCrewEnquiry({ name: 'John' });
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
  });

  it('getExtra returns undefined (currently no-op)', async () => {
    const res = await getExtra();
    expect(res).toBeUndefined();
  });

  it('geolocate calls API on success and returns data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ lat: 51, lon: -2 })
    });
    globalThis.fetch = fetchMock;
    const res = await geolocate('London');
    expect(res).toEqual({ lat: 51, lon: -2 });
  });

  it('geolocate returns undefined on failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    globalThis.fetch = fetchMock;
    const res = await geolocate('Unknown');
    expect(res).toBeUndefined();
  });
});
