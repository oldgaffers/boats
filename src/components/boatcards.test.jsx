import React from 'react';
import { screen, render } from '@testing-library/react';
import BoatCards from './boatcards';

test('renders learn react link', () => {
  render(
    <BoatCards location={{}} state={{ filters: {} }} />
  );
  const wanted = screen.getByText(/Loading/);
  expect(wanted).toBeInTheDocument();
});
