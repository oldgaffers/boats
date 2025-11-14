import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import BuilderPage, { BuilderSummary, VesselTable } from '../../src/components/builderpage';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(undefined),
  }),
));

test('renders builderpage', async () => {
  const screen = await render(
    <BuilderSummary
      name='Test Yard'
      place='Woodbridge'
    />
  );
  expect(screen).toBeDefined();
});

test('renders builderpage', async () => {
  const screen = await render(
    <BuilderPage
      name='Test Yard'
      place='Woodbridge'
    />
  );
  expect(screen).toBeDefined();
});

test('renders vessel table', async () => {
  const screen = await render(
    <VesselTable heading='' vessels={[{ name: '' }]}
    />
  );
});
