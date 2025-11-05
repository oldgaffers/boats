import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import VoyageMap from '../../src/components/voyagemap';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(undefined),
  }),
));

test('renders learn react link', async () => {
  const screen = await render(
    <VoyageMap places={[[0,0]]} />
  );
  expect(screen).toBeDefined();
});
