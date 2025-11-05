import { vi } from "vitest";

export function getBoatData() { Promise.resolve({ name: 'x' }); }
export function getPicklists() { Promise.resolve({}); }
export function getScopedData() { Promise.resolve(vi.fn()); }
export function postScopedData() { Promise.resolve(vi.fn()); }
export function postGeneralEnquiry() { Promise.resolve(vi.fn()); }
export function getUploadCredentials() { Promise.resolve(vi.fn()); }
export function createPhotoAlbum() { Promise.resolve(vi.fn()); }
export function getAlbumKey() { Promise.resolve(vi.fn()); }
export function postBoatData() { Promise.resolve(vi.fn()); }
export function getBoatLastModified() { Promise.resolve(vi.fn()); }
export function nextOgaNo() { Promise.resolve(vi.fn()); }
export function openPr() { Promise.resolve(undefined); }
export function shuffleBoats() { Promise.resolve(undefined); }
export function getLargestImage() { Promise.resolve(undefined); }
export function getFilterable() { Promise.resolve(undefined); }
export function getFleets() { Promise.resolve(undefined); }
export function getThumb() { Promise.resolve(undefined); }
export function getPlaces() { Promise.resolve(undefined); }
