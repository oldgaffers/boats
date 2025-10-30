import React from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import BoatCards from '../../src/components/boatcards';

test('renders learn react link', async () => {
  const screen = await render(
    <BoatCards location={{}} state={{ filters: {} }} />
  );
  const wanted = screen.getByText(/There are no boats on the register/);
  expect(wanted).toBeInTheDocument();
});
