import { screen, render } from '@testing-library/react';
import BoatCards from './boatcards';

test('renders learn react link', () => {
  render(
    <BoatCards location={{}} state={{ filters: {} }} />
  );
  const wanted = screen.getByText(/There are no boats on the register/);
  expect(wanted).toBeInTheDocument();
});
