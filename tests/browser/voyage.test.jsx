import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Voyage from '../../src/components/voyage';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(undefined),
  }),
));

test('renders learn react link', async () => {
  const screen = await render(
    <Voyage voyage={{ title: '', boat: { name: '', oga_no: 1 } }} />
  );
  expect(screen).toBeDefined();
});
