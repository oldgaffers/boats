import * as React from 'react';
import { render } from 'vitest-browser-react';
import BrowseBoats from '../../src/components/browseboats';
import { test, expect, vi } from 'vitest';

test('renders progress while boats are loading', async () => {
  const screen = await render(
        <BrowseBoats path='/' state={{filters:{ sale: false }, view: "app"}} />
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

// When boats are available we mock useBoats and child components
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ user: undefined }),
}));

vi.mock('../../src/util/boats', () => ({
  useBoats: () => ([
    { oga_no: 1, name: 'Alpha', year: 1990 },
    { oga_no: 2, name: 'Bravo', year: 2000 },
  ]),
}));

vi.mock('../../src/components/boatcards', () => ({
  default: (props) => <div data-testid="boatcards">BoatCards:{props.totalCount}</div>,
}));

vi.mock('../../src/components/filterboats', () => ({
  default: () => <div data-testid="filterboats-mock">Filters</div>,
}));

vi.mock('../../src/components/sortingandpagination', () => ({
  default: () => <div data-testid="sorting-mock">Sorting</div>,
}));

test('renders BoatCards when boats are available', async () => {
  const screen = await render(
    <BrowseBoats
      path='/'
      state={{ bpp: 12, sort: 'rank', sortDirection: 'asc', filters: {}, view: {}}}
    />
  );

  expect(screen.getByTestId('boatcards')).toBeInTheDocument();
  // expect(screen.getByTestId('boatcards').textContent).toContain('BoatCards:2');
});
