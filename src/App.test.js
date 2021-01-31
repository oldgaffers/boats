import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { MockedProvider } from "@apollo/react-testing";

test('renders learn react link', () => {
  window.location.pathname='p';
  const { getByText } = render(
    <MockedProvider mocks={[]}>
      <App />
    </MockedProvider>
  );
  const wanted = getByText();
  expect(wanted).toBeInTheDocument();
  expect(wanted).toBeValid();
});
