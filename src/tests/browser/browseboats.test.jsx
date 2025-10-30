import * as React from 'react';
import { screen, render } from 'vitest-browser-react';
import BrowseBoats from '../../components/browseboats';
import { test, expect } from 'vitest';

test('renders learn react link', () => {
  render(
      <Router>
        <BrowseBoats path='/' state={{filters:{ sale: false },view:{}}} />
      </Router>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  // const wanted = screen.getByText(/Other great places to look for boats are/);
  // expect(wanted).toBeInTheDocument();
});
