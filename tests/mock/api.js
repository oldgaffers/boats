import { vi } from "vitest";

export const api_mocks = {
    getBoatData: () => Promise.resolve({ name: 'x' }),
    getPicklists: () => Promise.resolve({}),
    getScopedData: () => Promise.resolve(vi.fn()),
    postScopedData: () => Promise.resolve(vi.fn()),
    postGeneralEnquiry: () => Promise.resolve(vi.fn()),
    getUploadCredentials: () => Promise.resolve(vi.fn()),
    createPhotoAlbum: () => Promise.resolve(vi.fn()),
    getAlbumKey: () => Promise.resolve(vi.fn()),
    postBoatData: () => Promise.resolve(vi.fn()),
    getBoatLastModified: () => Promise.resolve(vi.fn()),
    nextOgaNo: () => Promise.resolve(vi.fn()),
    openPr: () => Promise.resolve(undefined),
    shuffleBoats: () => Promise.resolve(undefined),
    getLargestImage: () => Promise.resolve(undefined),
    getFilterable: () => Promise.resolve(undefined),
    getFleets: () => Promise.resolve(undefined),
    getThumb: () => Promise.resolve(undefined),
    getPlaces: () => Promise.resolve(undefined),
};