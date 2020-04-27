import React from 'react';
import { render } from '@testing-library/react';
import Main from './main';

test('renders learn react link', () => {
  const { getByText } = render(<Main />);
  const wanted = getByText(/Main/);
  expect(wanted).toBeInTheDocument();
});
