import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import App from './App';

test('renders intro', () => {
  const { getAllByText } = render(
    <MockedProvider mocks={[]}>
        <App/>
    </MockedProvider>
  );
  const wanted = getAllByText(/We have/);
  expect(wanted[0]).toBeInTheDocument();
  expect(wanted[0]).toBeValid();
});
