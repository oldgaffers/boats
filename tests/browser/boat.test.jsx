import React from 'react';
import { test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Boat from '../../src/components/boat';
import * as api from '../../src/util/api';

vi.mock("../../src/util/api", () => {
  return {
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
  };
});

test('renders boat', async () => {
  const screen = await render(
    <Boat location={{ search: '?oga_no=1' }} ogaNo={1} />
  );
  expect(screen.getByRole('button').length).toBe(6);
});

test('renders missing ogano', async () => {
  const screen = await render(<Boat location={{ search: '?oga_no=0' }} ogaNo={0} />);
  expect(screen.getByRole('link').length).toBe(4);

});
