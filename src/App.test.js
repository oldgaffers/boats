import React from 'react';
import { Route } from 'reach/router';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import App from './App';

test('renders learn react link', () => {
  window.location.pathname='p';
  const { getByText } = render(
    <MockedProvider mocks={[]}>
      <Route>
        <App path='/'/>
      </Route>
    </MockedProvider>
  );
  const wanted = getByText();
  expect(wanted).toBeInTheDocument();
  expect(wanted).toBeValid();
});
