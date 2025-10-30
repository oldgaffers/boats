import * as React from 'react';
import { render } from 'vitest-browser-react';
import BrowseBoats from '../../src/components/browseboats';
import { test, expect } from 'vitest';

test('renders learn react link', async () => {
  const screen = await render(
        <BrowseBoats path='/' state={{filters:{ sale: false }, view:{}}} />
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  // const wanted = screen.getByText(/Other great places to look for boats are/);
  // expect(wanted).toBeInTheDocument();
});
