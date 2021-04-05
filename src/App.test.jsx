import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import App from './App';

test('renders intro', () => {
  const { getByText } = render(
    <MockedProvider mocks={[]}>
        <App/>
    </MockedProvider>
  );
  const wanted = getByText(/Have a boat/);
  expect(wanted).toBeInTheDocument();
  expect(wanted).toBeValid();
});
