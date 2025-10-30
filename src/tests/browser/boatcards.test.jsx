import { expect, test } from 'vitest';
import { screen, render } from 'vitest-browser-react';
import BoatCards from '../../components/boatcards';

test('renders learn react link', () => {
  render(
    <BoatCards location={{}} state={{ filters: {} }} />
  );
  const wanted = screen.getByText(/There are no boats on the register/);
  expect(wanted).toBeInTheDocument();
});
