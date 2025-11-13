import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
// Mock CardMedia to avoid MUI runtime prop warnings in tests
vi.mock('@mui/material/CardMedia', () => ({ default: (props) => {
  // lightweight mock: render a div container for children
  // Use the already-imported React instead of require (not available in browser env)
  return React.createElement('div', props, props.children);
}}));

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
