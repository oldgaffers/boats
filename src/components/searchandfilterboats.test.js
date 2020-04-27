import React from 'react';
import { render } from '@testing-library/react';
import SearchAndFilterBoats from './searchandfilterboats';

test('renders learn react link', () => {
  const { getAllByText } = render(<SearchAndFilterBoats />);
  const wanted = getAllByText(/Boat/);
  expect(wanted[0]).toBeInTheDocument();
});
