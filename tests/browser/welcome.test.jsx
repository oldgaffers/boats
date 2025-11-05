import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Uut from '../../src/components/Welcome';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(undefined),
  }),
));

test('renders learn react link', async () => {
  const screen = await render(
    <Uut />
  );
  expect(screen).toBeDefined();
});
