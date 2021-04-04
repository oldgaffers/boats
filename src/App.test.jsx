import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import App from './App';

test('renders learn react link', () => {
  window.location.pathname='p';
  const { getByText } = render(
    <MockedProvider mocks={[]}>
        <App />
    </MockedProvider>
  );
  const wanted = getByText('Welcome');
  expect(wanted).toBeInTheDocument();
  expect(wanted).toBeValid();
});
